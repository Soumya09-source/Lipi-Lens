
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import soundfile as sf
import io

from services.speech_service import speech_service

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return jsonify({
        "message": "Lipi Lens Kannada Speech API is running!",
        "service": "Mithi V2 Flash Kannada TTS"
    })


@app.route("/api/speech", methods=["POST"])
def generate_speech():
    try:
        data = request.get_json(silent=True) or {}
        text = data.get("text", "").strip()

        if not text:
            return jsonify({
                "success": False,
                "error": "Text is required"
            }), 400

        audio = speech_service.generate_speech(text)

        audio_buffer = io.BytesIO()
        sf.write(audio_buffer, audio, 24000, format="WAV")
        audio_buffer.seek(0)

        return send_file(
            audio_buffer,
            mimetype="audio/wav",
            as_attachment=False,
            download_name="kannada_speech.wav"
        )

    except Exception as e:
        print("Speech generation error:", str(e))
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002, debug=False)
