from flask import Flask, jsonify
from flask_cors import CORS
from routes.ocr import ocr_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(ocr_bp)

@app.route("/")
def home():
    return jsonify({
        "message": "Lipi Lens API is running!"
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)