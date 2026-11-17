
from flask import Flask, jsonify
from flask_cors import CORS

from routes.ocr import ocr_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(ocr_bp)


@app.route("/")
def home():
    return jsonify({
        "message": "Lipi Lens Windows OCR API is running!",
        "service": "Kannada OCR"
    })


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5001,
        debug=False
    )
