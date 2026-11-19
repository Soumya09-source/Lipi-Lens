
from flask import Blueprint, request, jsonify
from services.vocabulary_service import generate_vocabulary

vocabulary_bp = Blueprint("vocabulary", __name__)

@vocabulary_bp.route("/api/vocabulary", methods=["POST"])
def get_vocabulary():

    data = request.get_json(silent=True) or {}
    kannada_text = data.get("kannada_text", "").strip()

    if not kannada_text:
        return jsonify({
            "success": False,
            "error": "Kannada text is required"
        }), 400

    result = generate_vocabulary(kannada_text)

    if not result.get("success"):
        return jsonify(result), 500

    return jsonify(result), 200
