
from services.ocr_service import extract_kannada_text

# Test image
image_path = "test_kannada.jpg"

print("\n===================================")
print("       LIPI LENS - KANNADA OCR")
print("===================================\n")

result = extract_kannada_text(image_path)

if result["success"]:

    print("\n--------- EXTRACTED TEXT ---------\n")

    print(result["kannada_text"])

    # Save extracted text in UTF-8 format
    with open(
        "ocr_output.txt",
        "w",
        encoding="utf-8"
    ) as file:
        file.write(result["kannada_text"])

    print("\nOCR output saved to ocr_output.txt")

else:
    print("OCR ERROR:", result["error"])

print("\n===================================")
print("             TEST COMPLETE")
print("===================================")
