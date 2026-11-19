
from flask import Flask, jsonify
from flask_cors import CORS

from routes.speech import speech_bp

app = Flask(__name__)
CORS(app)
app.register_blueprint(speech_bp)


@app.route("/")
def home():
    return jsonify({
        "message": "Lipi Lens Kannada Speech API is running!",
        "service": "Mithi V2 Flash Kannada TTS"
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002, debug=False)
