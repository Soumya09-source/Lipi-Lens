import os
import uuid
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from services.ocr_service import extract_kannada_text

ocr_bp = Blueprint("ocr", __name__)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@ocr_bp.route("/api/ocr", methods=["POST"])
def perform_ocr():
    if "image" not in request.files:
        return jsonify({
            "success": False,
            "error": "No image uploaded"
        }), 400

    file = request.files["image"]

    if file.filename == "":
        return jsonify({
            "success": False,
            "error": "No file selected"
        }), 400

    filename = secure_filename(file.filename)
    unique_filename = f"{uuid.uuid4().hex}_{filename}"
    image_path = os.path.join(UPLOAD_FOLDER, unique_filename)

    try:
        file.save(image_path)
        result = extract_kannada_text(image_path)

        if not result["success"]:
            return jsonify(result), 500

        return jsonify({
            "success": True,
            "kannada_text": result["kannada_text"],
            "message": "Text extracted successfully"
        })

    finally:
        if os.path.exists(image_path):
            os.remove(image_path)