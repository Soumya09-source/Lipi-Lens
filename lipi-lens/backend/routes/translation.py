
from flask import Blueprint, request, jsonify
from services.translation_service import translate_kannada_to_english

translation_bp = Blueprint("translation", __name__)


@translation_bp.route("/api/translate", methods=["POST"])
def translate_text():
    data = request.get_json(silent=True) or {}

    kannada_text = data.get("kannada_text", "")

    if not kannada_text.strip():
        return jsonify({
            "success": False,
            "error": "Kannada text is required"
        }), 400

    result = translate_kannada_to_english(kannada_text)

    if not result["success"]:
        return jsonify(result), 500

    return jsonify(result), 200
