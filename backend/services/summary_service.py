
import os
import re
import json

from dotenv import load_dotenv
from google import genai
from google.genai import types


# --------------------------------------------------
# CONFIGURATION
# --------------------------------------------------

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

load_dotenv(os.path.join(BACKEND_DIR, ".env"))

API_KEY = os.getenv("GEMINI_API_KEY")

MODEL_NAME = "gemini-3.8-flash"

client = None

if API_KEY:
    client = genai.Client(
        api_key=API_KEY,
        http_options=types.HttpOptions(
            timeout=15000,
            retry_options=types.HttpRetryOptions(
                attempts=1
            )
        )
    )


# --------------------------------------------------
# LOCAL SUMMARIZATION HELPERS
# --------------------------------------------------

def split_sentences(text):
    """Split Kannada or English text into sentences."""

    if not text:
        return []

    sentences = re.split(r'(?<=[.!?।])\s+|\n+', text.strip())

    return [
        sentence.strip()
        for sentence in sentences
        if sentence.strip()
    ]


def score_sentence(sentence):
    """Score sentences using useful information indicators."""

    score = 0

    keywords = [
        "important", "must", "should", "required",
        "deadline", "date", "total", "amount",
        "notice", "warning", "submit", "result",
        "ಮುಖ್ಯ", "ದಿನಾಂಕ", "ಮೊತ್ತ", "ಅಗತ್ಯ",
        "ಸೂಚನೆ", "ಕಡ್ಡಾಯ", "ಸಲ್ಲಿಸು", "ಕೊನೆಯ"
    ]

    lower_sentence = sentence.lower()

    for keyword in keywords:
        if keyword in lower_sentence:
            score += 2

    # Sentences containing numbers may carry useful details.
    if re.search(r'\d+', sentence):
        score += 2

    # Prefer informative sentences over extremely short ones.
    if len(sentence.split()) >= 5:
        score += 1

    return score


def select_important_sentences(text, limit=3):
    """Select important sentences while preserving document order."""

    sentences = split_sentences(text)

    if not sentences:
        return []

    ranked = sorted(
        enumerate(sentences),
        key=lambda item: score_sentence(item[1]),
        reverse=True
    )

    selected_indices = sorted(
        item[0] for item in ranked[:limit]
    )

    return [sentences[i] for i in selected_indices]


def extract_important_details(text, limit=8):
    """Extract sentences containing dates, numbers or key indicators."""

    sentences = split_sentences(text)

    keywords = [
        "date", "deadline", "amount", "total",
        "address", "phone", "contact", "time",
        "important", "must", "required",
        "ದಿನಾಂಕ", "ಮೊತ್ತ", "ಸಮಯ", "ಮುಖ್ಯ",
        "ಅಗತ್ಯ", "ಸಂಪರ್ಕ", "ವಿಳಾಸ"
    ]

    details = []

    for sentence in sentences:
        lower_sentence = sentence.lower()

        has_number = bool(re.search(r'\d+', sentence))

        has_keyword = any(
            keyword in lower_sentence
            for keyword in keywords
        )

        if has_number or has_keyword:
            if sentence not in details:
                details.append(sentence)

        if len(details) >= limit:
            break

    return details


def generate_local_summary(kannada_text, english_text):
    """Generate a fallback summary without an external AI service."""

    kannada_sentences = select_important_sentences(
        kannada_text, limit=3
    )

    english_sentences = select_important_sentences(
        english_text, limit=3
    )

    kannada_summary = " ".join(kannada_sentences)
    english_summary = " ".join(english_sentences)

    # Use available source text for key-point extraction.
    source_text = english_text if english_text.strip() else kannada_text

    key_points = select_important_sentences(
        source_text, limit=5
    )

    # Collect details from both language versions.
    important_details = []

    for text in [kannada_text, english_text]:
        for detail in extract_important_details(text):
            if detail not in important_details:
                important_details.append(detail)

    return {
        "kannada_summary": kannada_summary,
        "english_summary": english_summary,
        "key_points": key_points,
        "important_details": important_details,
        "summary_source": "local"
    }


# --------------------------------------------------
# GEMINI SUMMARIZATION
# --------------------------------------------------

def generate_gemini_summary(kannada_text, english_text):

    prompt = f"""
You are an intelligent Kannada document summarizer.

KANNADA TEXT:
{kannada_text}

ENGLISH TRANSLATION:
{english_text}

Generate:
1. A concise Kannada summary.
2. A concise English summary.
3. Important key points.
4. Names, dates, numbers, places and instructions.

Do not invent information.

Return valid JSON:
{{
    "kannada_summary": "",
    "english_summary": "",
    "key_points": [],
    "important_details": []
}}
"""

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            temperature=0.2
        )
    )

    if not response.text:
        raise ValueError("Gemini returned an empty response")

    result = json.loads(response.text)

    required_fields = [
        "kannada_summary",
        "english_summary",
        "key_points",
        "important_details"
    ]

    if not isinstance(result, dict):
        raise ValueError("Invalid Gemini summary format")

    for field in required_fields:
        if field not in result:
            raise ValueError(f"Missing summary field: {field}")

    if not isinstance(result["key_points"], list):
        raise ValueError("Invalid key_points format")

    if not isinstance(result["important_details"], list):
        raise ValueError("Invalid important_details format")

    result["summary_source"] = "gemini"

    return result


# --------------------------------------------------
# MAIN SUMMARY FUNCTION
# --------------------------------------------------

def generate_summary(kannada_text, english_text):

    kannada_text = (
        kannada_text.strip()
        if isinstance(kannada_text, str)
        else ""
    )

    english_text = (
        english_text.strip()
        if isinstance(english_text, str)
        else ""
    )

    if not kannada_text and not english_text:
        return {
            "success": False,
            "error": "No document text provided"
        }

    # Try Gemini first.
    if client is not None:

        try:
            print(f"Generating summary using {MODEL_NAME}...")

            summary = generate_gemini_summary(
                kannada_text,
                english_text
            )

            print("Gemini summary generated successfully.")

            return {
                "success": True,
                "summary": summary
            }

        except Exception as e:
            print("Gemini unavailable:", str(e))
            print("Switching to local summarization...")

    else:
        print("Gemini API key unavailable.")
        print("Using local summarization...")

    # Automatic local fallback.
    try:

        summary = generate_local_summary(
            kannada_text,
            english_text
        )

        if not summary["kannada_summary"] and not summary["english_summary"]:
            raise ValueError("Unable to extract summary from document")

        print("Local summary generated successfully.")

        return {
            "success": True,
            "summary": summary
        }

    except Exception as e:

        print("Local Summary Error:", str(e))

        return {
            "success": False,
            "error": "Unable to generate summary: " + str(e)
        }
