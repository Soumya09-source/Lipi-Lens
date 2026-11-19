
from flask import Blueprint, request, jsonify
from services.summary_service import generate_summary

summary_bp = Blueprint("summary", __name__)

@summary_bp.route("/api/summary", methods=["POST"])
def summarize_document():
    data = request.get_json(silent=True) or {}

    kannada_text = data.get("kannada_text", "").strip()
    english_text = data.get("english_text", "").strip()

    if not kannada_text and not english_text:
        return jsonify({
            "success": False,
            "error": "Document text is required"
        }), 400

    result = generate_summary(kannada_text, english_text)

    if not result.get("success"):
        return jsonify(result), 500

    return jsonify(result), 200
