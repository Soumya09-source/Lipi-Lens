
import json
from services.summary_service import client
import time

MODEL_NAME = "gemini-3.5-flash-lite"


def generate_vocabulary(kannada_text):

    if not kannada_text or not kannada_text.strip():
        return {
            "success": False,
            "error": "No Kannada text provided"
        }

    prompt = f"""
You are a Kannada language learning assistant.

Identify 8 to 10 useful Kannada words from this document.

For each word provide:
1. Kannada word
2. English meaning
3. Simple Kannada explanation
4. Kannada example sentence
5. English translation of the example

Use natural Kannada. Do not invent words.
Avoid repetitions.

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

    for attempt in range(3):
        try:
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

            print("Gemini raw response:", response.text)

            result = json.loads(response.text)

            return {
                "success": True,
                "vocabulary": result.get("vocabulary", [])
            }

        except Exception as e:
            error_message = str(e)

            if "503" in error_message and attempt < 2:
                wait_time = 2 ** (attempt + 1)
                print(f"Gemini busy. Retrying in {wait_time} seconds...")
                time.sleep(wait_time)
                continue

            print("Vocabulary Error:", error_message)

            return {
                "success": False,
                "error": error_message
            }
