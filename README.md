# Lipi-Lens
AI-powered Kannada OCR, translation and speech application

## Run on macOS

### Backend prerequisites

Install Tesseract and ensure its Kannada and English language data are available:

```bash
brew install tesseract tesseract-lang
tesseract --list-langs
```

The language list must include `kan` and `eng`. If Tesseract is installed outside
`PATH`, set `TESSERACT_CMD` to its executable path before starting the OCR server.

Create a Python environment and install the backend packages:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

### Start the APIs

Run each command in a separate terminal from the repository root:

```bash
cd backend
source .venv/bin/activate
python app.py
```

The OCR API listens on `http://127.0.0.1:5001` and accepts multipart requests at
`/api/ocr`, with the uploaded image (or PDF) in the `image` field.

```bash
cd backend
source .venv/bin/activate
python ubuntu_app.py
```

The Kannada-to-English translation API listens on `http://127.0.0.1:5000` and
accepts JSON requests at `/api/translate`. The IndicTrans2 model is downloaded
when the first translation request arrives. Its Hugging Face model repository
is gated: request access to `ai4bharat/indictrans2-indic-en-dist-200M` and
authenticate with an authorized Hugging Face account before translating. To
provide a token without putting it in shell history:

```bash
read -s -p "Hugging Face token: " HF_TOKEN; echo; export HF_TOKEN
```

The OCR API can run without this model access; translation requests return an
error until access is granted and authentication is configured.

The same Ubuntu API also provides `/api/summary`, `/api/vocabulary`, and
`/api/chat`. Set `GEMINI_API_KEY` in the backend process environment to use
these Gemini-powered endpoints.

Mithi text-to-speech is served by its separate Flask application:

```bash
cd backend
source .venv/bin/activate
python mithi_app.py
```

It listens on port `5002`, exposes `POST /api/speech`, and requires the Mithi
model code and weights at the configured model location. It can run alongside
`ubuntu_app.py`, which listens on port `5000`.

### Start the frontend

```bash
cd frontend
npm install
npm run dev
```

By default, the frontend connects to the local API ports above. Set
`VITE_OCR_API_URL`, `VITE_TRANSLATION_API_URL`, `VITE_UBUNTU_API_URL`, or
`VITE_SPEECH_API_URL` if an API runs at a different base URL; each value should
include the `/api` path.

### Regional Kannada analysis

The Regional Kannada Intelligence API runs independently on port 8001:

```bash
cd regional-backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8001
```

In `frontend/.env`, set `VITE_REGIONAL_API_URL=http://localhost:8001` and
restart Vite after changing the value. The frontend calls
`POST /api/regional/analyse`; the regional backend's default CORS configuration
allows the local Vite origin at `http://localhost:5173`. If using another
frontend origin, add it to the regional backend's comma-separated
`CORS_ORIGINS` setting.

Regional matching checks vocabulary, complete sentence, and paragraph records
with Unicode-normalized, punctuation-insensitive matching. Responses identify
the dataset type and source. Unverified or shared evidence remains candidate-only;
unmatched text is not classified as Standard Kannada.

Matched expressions retain dataset-provided meanings. When a complete matched
expression has no meaning in the dataset, the regional API uses the local
translation endpoint at `http://127.0.0.1:5000/api/translate` for English and
the configured Gemini service for a Standard Kannada rendering. Override the
translation endpoint with `REGIONAL_TRANSLATION_API_URL`; generated and
dataset-provided values carry separate provenance fields in the API response.
If a generator is unavailable or fails, the corresponding value and provenance
are reported as unavailable.

### API smoke tests

```bash
curl -F "image=@/path/to/kannada-document.jpg" http://127.0.0.1:5001/api/ocr
curl -H "Content-Type: application/json" \
  -d '{"kannada_text":"ನಮಸ್ಕಾರ"}' \
  http://127.0.0.1:5000/api/translate
curl -H "Content-Type: application/json" \
  -d '{"text":"ನಮಸ್ಕಾರ"}' \
  http://localhost:8001/api/regional/analyse
```
