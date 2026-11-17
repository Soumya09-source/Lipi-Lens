
import requests
import os

# API URLs
OCR_URL = "http://127.0.0.1:5001/api/ocr"
TRANSLATION_URL = "http://127.0.0.1:5000/api/translate"

# Test image
IMAGE_PATH = os.path.join(
    "backend",
    "test_kannada.jpg"
)

if not os.path.exists(IMAGE_PATH):
    print("Error: Test image not found:", IMAGE_PATH)
    raise SystemExit(1)

# STEP 1: Kannada OCR through Windows
print("\n1. Sending image to Windows OCR...")

try:
    with open(IMAGE_PATH, "rb") as image:
        response = requests.post(
            OCR_URL,
            files={"image": image},
            timeout=120
        )

    response.raise_for_status()
    ocr_result = response.json()

    kannada_text = ocr_result.get("kannada_text", "").strip()

    if not ocr_result.get("success") or not kannada_text:
        print("OCR failed:", ocr_result)
        raise SystemExit(1)

    print("\nKannada OCR output:")
    print(kannada_text)

except requests.RequestException as error:
    print("OCR connection error:", error)
    raise SystemExit(1)

# STEP 2: Translation through Ubuntu
print("\n2. Sending Kannada text to Ubuntu translation...")

try:
    response = requests.post(
        TRANSLATION_URL,
        json={"kannada_text": kannada_text},
        timeout=180
    )

    response.raise_for_status()
    translation_result = response.json()

    if not translation_result.get("success"):
        print("Translation failed:", translation_result)
        raise SystemExit(1)

    english_text = translation_result.get("english_text", "")

    print("\nEnglish translation:")
    print(english_text)

except requests.RequestException as error:
    print("Translation connection error:", error)
    raise SystemExit(1)

# FINAL RESULT
print("\n================================")
print("LIPI LENS FULL PIPELINE SUCCESS!")
print("================================")
