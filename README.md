# Lipi Lens

Lipi Lens is a Kannada document and language application. The root-level
`backend/` and `frontend/` directories are the application sources. Regional
Kannada intelligence runs as a separate service in `regional-backend/`.

The legacy `lipi-lens/` directory is not used by the startup commands below.
Its remaining local configuration, environment, and test artifacts have been
preserved.

## Requirements

- Python 3.10 or later and Node.js/npm.
- Tesseract OCR with both Kannada (`kan`) and English (`eng`) language data for
  image/PDF OCR. Configure `TESSERACT_CMD` if Tesseract is not on `PATH`.
- `backend/requirements.txt` provides `IndicTransToolkit`, `transformers`, and
  `torch` for IndicTrans2 Kannada-to-English translation. The
  `ai4bharat/indictrans2-indic-en-dist-200M` model is gated and requires approved
  Hugging Face access and authentication via `HF_TOKEN`.
- `google-genai` and `GEMINI_API_KEY` are used by the summary, chatbot, and
  vocabulary services; Gemini is not the translation engine. Because the
  combined Flask app imports these services at startup, configure
  `GEMINI_API_KEY` before starting `ubuntu_app.py`, including when using its
  translation endpoint.
- Mithi model code, weights, and its runtime dependencies for Kannada
  text-to-speech. The Python dependencies in `backend/requirements.txt` do not
  include the external `run.Mithi` implementation or its model files.

Create a new backend environment without changing the existing root `venv/`:

```powershell
py -m venv backend\.venv
.\backend\.venv\Scripts\Activate.ps1
python -m pip install -r backend\requirements.txt
```

In PowerShell, if script activation is unavailable, use the environment's
Python directly, for example `backend\.venv\Scripts\python.exe`.

## Start the backend services

Run each service in a separate terminal. Activate `backend\.venv` in each
terminal, then start the corresponding process from the `backend/` directory:

```powershell
Set-Location backend
python app.py
```

This starts the OCR Flask API on port `5001`.

```powershell
Set-Location backend
python ubuntu_app.py
```

This starts the translation, summary, vocabulary, and chatbot Flask API on
port `5000`. Summary, chatbot, and vocabulary use Gemini; their shared service
requires `GEMINI_API_KEY` at startup. Translation uses IndicTrans2 and loads
the gated Hugging Face model on the first request. Set `HF_TOKEN` using an
authorized Hugging Face account with access to
`ai4bharat/indictrans2-indic-en-dist-200M`.

```powershell
Set-Location backend
python mithi_app.py
```

This starts the Mithi speech Flask API on port `5002`. The current service
expects Mithi model code and weights at
`/mnt/d/LipiLensModels/mithi-v2-flash`, as configured in
`backend/services/speech_service.py`. The model is not included in this
repository. Startup depends on that external model and its runtime
dependencies.

`backend/windows_ocr_app.py` is an alternate launcher for the OCR app on port
`5001`; it is not a separate API.

## Start regional Kannada intelligence

The regional service and its corpus are in `regional-backend/`. From the
repository root, create a separate environment and install its dependencies:

```powershell
py -m venv regional-backend\.venv
.\regional-backend\.venv\Scripts\Activate.ps1
python -m pip install -r regional-backend\requirements.txt
Set-Location regional-backend
python -m uvicorn main:app --host 127.0.0.1 --port 8001
```

The health endpoint is `GET /health`; regional analysis is
`POST /api/regional/analyse`. The regional service reads `CORS_ORIGINS` for
allowed browser origins (defaulting to localhost ports 3000 and 5173).
`REGIONAL_TRANSLATION_API_URL` can override its local translation fallback;
the default is `http://127.0.0.1:5000/api/translate`. Optional Gemini
explanations and Standard Kannada enrichment use `GEMINI_API_KEY` and
`GEMINI_MODEL` (default `gemini-2.0-flash`). Without a configured Gemini key,
rule-based explanations are returned and Gemini enrichment is unavailable.

## Start the frontend

In a separate terminal:

```powershell
Set-Location frontend
npm install
npm run dev
```

Vite prints the local development URL (normally `http://localhost:5173`).
Frontend service base URLs can be overridden with these Vite environment
variables; each change requires restarting Vite:

| Variable | Default |
| --- | --- |
| `VITE_API_URL` | `http://localhost:8000/api` |
| `VITE_OCR_API_URL` | `http://127.0.0.1:5001/api` |
| `VITE_UBUNTU_API_URL` | `http://127.0.0.1:5000/api` |
| `VITE_TRANSLATION_API_URL` | The Ubuntu API URL |
| `VITE_SPEECH_API_URL` | `http://127.0.0.1:5002/api` |
| `VITE_REGIONAL_API_URL` | `http://localhost:8001` |

`frontend/.env.example` contains the regional API URL example. Do not put
secrets in frontend variables; Vite exposes `VITE_*` values to browser code.
`VITE_API_URL` is used by the frontend simplifier, but no matching backend
route is currently implemented.

## API map and current limitations

| Feature | Endpoint | Service |
| --- | --- | --- |
| Kannada OCR (image/PDF) | `POST /api/ocr` | Flask, port 5001 |
| Kannada to English translation | `POST /api/translate` | Flask, port 5000 |
| Smart summary | `POST /api/summary` | Flask, port 5000 |
| Vocabulary | `POST /api/vocabulary` | Flask, port 5000 |
| Document chatbot | `POST /api/chat` | Flask, port 5000 |
| Kannada speech | `POST /api/speech` | Flask/Mithi, port 5002 |
| Regional Kannada analysis | `POST /api/regional/analyse` | FastAPI, port 8001 |

The translation API currently supports Kannada-to-English only; English-to-
Kannada translation is not implemented. There is no backend `/api/simplify`
route, although the frontend currently calls one and can display demo fallback
content when it is unavailable. Summary and chatbot frontend helpers also have
demo fallbacks. Kannada speech uses Mithi when available; English speech uses
the browser's speech synthesis fallback. Vocabulary and regional analysis
provide meaning fields; there is no separate meaning endpoint.

These are implementation notes, not a claim that the services have been
started or end-to-end tested in every environment. The required OCR language
data, model access, API credentials, and external Mithi files must be available
for their corresponding features.

## Tests

Backend tests and test utilities are under `backend/tests/` and `backend/`.
`backend/tests/test_mithi.py` is a manual Mithi test moved from the legacy
directory. Tests requiring downloaded models, credentials, OCR language data,
or Mithi hardware/model files need those prerequisites configured before they
can run.
