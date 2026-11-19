from flask import Flask, jsonify
from flask_cors import CORS

from routes.translation import translation_bp
from routes.summary import summary_bp
from routes.vocabulary import vocabulary_bp
from routes.chatbot import chatbot_bp


app = Flask(__name__)
CORS(app)

app.register_blueprint(translation_bp)
app.register_blueprint(summary_bp)
app.register_blueprint(vocabulary_bp)
app.register_blueprint(chatbot_bp)


@app.route("/")
def home():
    return jsonify({
        "message": "Lipi Lens API is running!",
        "services": [
            "Kannada to English Translation",
            "Gemini Smart Summary",
            "Kannada Vocabulary Explorer",
            "Kannada Chatbot"
        ]
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
