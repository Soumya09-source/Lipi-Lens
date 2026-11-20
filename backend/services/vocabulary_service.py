
import json
import re
import unicodedata

from services.summary_service import client
from services.dictionary_service import lookup_word

MODEL_NAME = "gemini-3.8-flash"
MAX_VOCABULARY = 10
MAX_DEFINITIONS = 3


# --------------------------------------------------
# KANNADA WORD EXTRACTION
# --------------------------------------------------

STOP_WORDS = {
    "ಮತ್ತು", "ಆದರೆ", "ಇದು", "ಅದು", "ಇಲ್ಲಿ",
    "ಅಲ್ಲಿ", "ನಮ್ಮ", "ನೀವು", "ಅವರು", "ಒಂದು",
    "ಎಂದು", "ಇದೆ", "ಇವೆ", "ಮೇಲೆ", "ಮೂಲಕ",
    "ಅನ್ನು", "ದಲ್ಲಿ", "ಗಳಿಗೆ", "ಆಗಿದೆ",
    "ಅವರ", "ಅದರ", "ಇದರ", "ಎಲ್ಲ", "ಮಾತ್ರ",
    "ಮಾಡಿ", "ಮಾಡಲು", "ಆಗಿ", "ಇಂದ"
}


def normalize_kannada_word(word):
    """Normalize Kannada text while preserving Kannada characters."""

    word = unicodedata.normalize("NFC", word.strip())

    return re.sub(r"[^\u0C80-\u0CFF]", "", word)


def extract_kannada_words(text):
    """
    Extract Kannada words while preserving ZWJ/ZWNJ
    inside compound words such as ಆನ್‌ಲೈನ್.
    """

    pattern = r'[\u0C80-\u0CFF]+(?:[\u200C\u200D][\u0C80-\u0CFF]+)*'

    words = re.findall(pattern, text)

    return [
        normalize_kannada_word(word)
        for word in words
        if normalize_kannada_word(word)
    ]


# --------------------------------------------------
# OFFLINE VOCABULARY
# --------------------------------------------------

def extract_local_vocabulary(kannada_text):

    words = extract_kannada_words(kannada_text)

    word_frequency = {}

    for word in words:

        if len(word) < 3:
            continue

        if word in STOP_WORDS:
            continue

        word_frequency[word] = word_frequency.get(word, 0) + 1

    vocabulary = []
    seen = set()

    # Prioritize repeated words, then longer meaningful candidates.
    ranked_words = sorted(
        word_frequency.items(),
        key=lambda item: (
            item[1],
            len(item[0])
        ),
        reverse=True
    )

    for word, frequency in ranked_words:

        if word in seen:
            continue

        seen.add(word)

        try:
            definitions = lookup_word(word)
        except Exception as error:
            print(f"Dictionary lookup failed for {word}: {error}")
            continue

        if not definitions:
            continue

        meanings = []
        seen_meanings = set()

        for definition in definitions:

            meaning = definition.get("meaning", "").strip()

            if not meaning:
                continue

            key = meaning.lower()

            if key in seen_meanings:
                continue

            seen_meanings.add(key)
            meanings.append(meaning)

            if len(meanings) >= MAX_DEFINITIONS:
                break

        if not meanings:
            continue

        vocabulary.append({
            "word": word,
            "english_meaning": "; ".join(meanings),
            "kannada_explanation": (
                "ಈ ಪದಕ್ಕೆ ಅಲಾರ್ ಕನ್ನಡ-ಇಂಗ್ಲಿಷ್ "
                "ನಿಘಂಟಿನಲ್ಲಿ ಅರ್ಥಗಳನ್ನು ನೀಡಲಾಗಿದೆ."
            ),
            "example_kannada": "",
            "example_english": ""
        })

        if len(vocabulary) >= MAX_VOCABULARY:
            break

    return vocabulary


# --------------------------------------------------
# GEMINI VOCABULARY GENERATION
# --------------------------------------------------

def generate_gemini_vocabulary(kannada_text):

    prompt = f"""
You are an expert Kannada language learning assistant.

Identify up to 10 useful and meaningful Kannada words
from the supplied document.

For each word provide:

1. Kannada word
2. English meaning
3. Simple Kannada explanation
4. Natural Kannada example sentence
5. English translation of the example

Instructions:
- Select words actually present in the document.
- Do not invent words.
- Avoid repetitions.
- Avoid incomplete word fragments.
- Use natural, grammatically correct Kannada.
- Prefer educationally useful vocabulary.

DOCUMENT:
{kannada_text}

Return valid JSON:
{{
  "vocabulary": [
    {{
      "word": "",
      "english_meaning": "",
      "kannada_explanation": "",
      "example_kannada": "",
      "example_english": ""
    }}
  ]
}}
"""

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "temperature": 0.2
        }
    )

    if not response.text:
        raise ValueError("Gemini returned an empty response")

    result = json.loads(response.text)

    vocabulary = result.get("vocabulary", [])

    if not isinstance(vocabulary, list):
        raise ValueError("Invalid vocabulary response format")

    cleaned_vocabulary = []
    seen = set()

    for item in vocabulary:

        if not isinstance(item, dict):
            continue

        word = item.get("word", "").strip()

        if not word:
            continue

        normalized = normalize_kannada_word(word)

        if not normalized or normalized in seen:
            continue

        seen.add(normalized)

        cleaned_vocabulary.append({
            "word": word,
            "english_meaning": item.get("english_meaning", ""),
            "kannada_explanation": item.get("kannada_explanation", ""),
            "example_kannada": item.get("example_kannada", ""),
            "example_english": item.get("example_english", "")
        })

        if len(cleaned_vocabulary) >= MAX_VOCABULARY:
            break

    return cleaned_vocabulary


# --------------------------------------------------
# MAIN VOCABULARY FUNCTION
# --------------------------------------------------

def generate_vocabulary(kannada_text):

    if not kannada_text or not kannada_text.strip():
        return {
            "success": False,
            "error": "No Kannada text provided"
        }

    try:
        vocabulary = generate_gemini_vocabulary(kannada_text)

        if vocabulary:
            return {
                "success": True,
                "vocabulary": vocabulary,
                "vocabulary_source": "gemini"
            }

        raise ValueError("Gemini returned no usable vocabulary")

    except Exception as error:

        print("Gemini Vocabulary Error:", str(error))
        print("Switching to offline dictionary...")

        try:
            local_vocabulary = extract_local_vocabulary(kannada_text)

            return {
                "success": True,
                "vocabulary": local_vocabulary,
                "vocabulary_source": "local",
                "message": (
                    "Vocabulary generated using the offline "
                    "Alar Kannada-English dictionary. "
                    "Example sentences are unavailable offline."
                )
            }

        except Exception as local_error:

            print("Local Vocabulary Error:", str(local_error))

            return {
                "success": False,
                "error": "Unable to generate vocabulary."
            }
