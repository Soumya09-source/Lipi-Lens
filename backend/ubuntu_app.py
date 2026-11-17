
from flask import Flask, jsonify
from flask_cors import CORS
from routes.translation import translation_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(translation_bp)

@app.route("/")
def home():
    return jsonify({
        "message": "Lipi Lens Translation API is running!",
        "service": "Kannada to English Translation"
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002, debug=False)
