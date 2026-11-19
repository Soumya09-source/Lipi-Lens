import os
import json
from dotenv import load_dotenv
from google import genai
from google.genai import types
import time

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not configured")

client = genai.Client(api_key=api_key)

MODEL_NAME = "gemini-3.8-flash"



def generate_summary(kannada_text, english_text):
    if not kannada_text.strip() and not english_text.strip():
        return {
            "success": False,
            "error": "No document text provided"
        }

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

    for attempt in range(3):
        try:
            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.2
                )
            )

            result = json.loads(response.text)

            return {
                "success": True,
                "summary": result
            }

        except Exception as e:
            error_message = str(e)

            if "503" in error_message and attempt < 2:
                wait_time = 2 ** (attempt + 1)
                print(f"Gemini busy. Retrying in {wait_time} seconds...")
                time.sleep(wait_time)
                continue

            print("Gemini Summary Error:", error_message)

            return {
                "success": False,
                "error": error_message
            }
