
import os
import shutil

import cv2
import numpy as np
import pytesseract
import pymupdf

TESSERACT_CMD = os.environ.get("TESSERACT_CMD") or shutil.which("tesseract")
if TESSERACT_CMD:
    pytesseract.pytesseract.tesseract_cmd = TESSERACT_CMD


def _extract_page_text(image):
    if image is None:
        raise ValueError("Unable to read image")

    return pytesseract.image_to_string(
        image,
        lang="kan+eng",
        config="--oem 1 --psm 6"
    ).strip()


def extract_kannada_text(image_path):
    try:
        if not os.path.exists(image_path):
            raise FileNotFoundError("Image not found")

        if os.path.splitext(image_path)[1].lower() == ".pdf":
            with pymupdf.open(image_path) as document:
                extracted_pages = []
                for page in document:
                    pixmap = page.get_pixmap(matrix=pymupdf.Matrix(2, 2), alpha=False)
                    image = np.frombuffer(pixmap.samples, dtype=np.uint8).reshape(
                        pixmap.height,
                        pixmap.width,
                        pixmap.n
                    )
                    if pixmap.n == 4:
                        image = cv2.cvtColor(image, cv2.COLOR_RGBA2BGR)
                    else:
                        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
                    extracted_pages.append(_extract_page_text(image))
            extracted_text = "\n".join(text for text in extracted_pages if text)
        else:
            image = cv2.imread(image_path)
            extracted_text = _extract_page_text(image)

        return {
            "success": True,
            "kannada_text": extracted_text
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
