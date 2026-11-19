
from flask import Blueprint, request, jsonify
from services.ai_service import answer_document_question

chatbot_bp = Blueprint("chatbot", __name__)


@chatbot_bp.route("/api/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json(silent=True) or {}

        document_text = data.get("document_text", "")
        question = data.get("question", "")
        history = data.get("history", [])

        if not document_text.strip():
            return jsonify({
                "success": False,
                "error": "Please upload a document first."
            }), 400

        if not question.strip():
            return jsonify({
                "success": False,
                "error": "Please enter a question."
            }), 400

        if not isinstance(history, list):
            return jsonify({
                "success": False,
                "error": "History must be a list."
            }), 400

        result = answer_document_question(
            document_text=document_text,
            question=question,
            history=history
        )

        status_code = 200 if result.get("success") else 503

        return jsonify(result), status_code

    except Exception as e:
        print("Chatbot API Error:", str(e))

        return jsonify({
            "success": False,
            "error": "Something went wrong while processing your question."
        }), 500
