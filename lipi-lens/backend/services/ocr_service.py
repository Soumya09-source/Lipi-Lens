
import pytesseract
import cv2
import os

# Tesseract executable path
pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)


def preprocess_image(image_path):

    image = cv2.imread(image_path)

    if image is None:
        raise ValueError("Unable to read image")

    # Resize image
    height, width = image.shape[:2]

    image = cv2.resize(
        image,
        (width * 3, height * 3),
        interpolation=cv2.INTER_CUBIC
    )

    # Convert to grayscale
    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )

    # Improve contrast
    clahe = cv2.createCLAHE(
        clipLimit=2.0,
        tileGridSize=(8, 8)
    )

    enhanced = clahe.apply(gray)

    # Invert image and apply thresholding
    inverted = cv2.bitwise_not(enhanced)

    _, processed = cv2.threshold(
        inverted,
        0,
        255,
        cv2.THRESH_BINARY + cv2.THRESH_OTSU
    )

    return processed


def extract_kannada_text(image_path):

    try:

        if not os.path.exists(image_path):
            raise FileNotFoundError("Image not found")

        # Preprocess image
        processed_image = preprocess_image(image_path)

        # Extract Kannada and English text
        extracted_text = pytesseract.image_to_string(
            processed_image,
            lang="kan+eng",
            config="--oem 1 --psm 6"
        )

        return {
    "success": True,
    "kannada_text": extracted_text.strip()
}

    except Exception as e:

        return {
            "success": False,
            "error": str(e)
        }
