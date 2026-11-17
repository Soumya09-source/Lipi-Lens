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

### Start the frontend

```bash
cd frontend
npm install
npm run dev
```

By default, the frontend connects to the local API ports above. Set
`VITE_OCR_API_URL` or `VITE_TRANSLATION_API_URL` if the APIs run at different
base URLs; each value should include the `/api` path.

### API smoke tests

```bash
curl -F "image=@/path/to/kannada-document.jpg" http://127.0.0.1:5001/api/ocr
curl -H "Content-Type: application/json" \
  -d '{"kannada_text":"ನಮಸ್ಕಾರ"}' \
  http://127.0.0.1:5000/api/translate
```
