# Lipi Lens 💛❤️
### Kannada Multimodal AI – Making Kannada Digital, Accessible and Understandable

Lipi Lens is a Kannada-focused AI-powered document understanding application developed for **Modalapada 2.0 – Kannada Multimodal AI Hackathon**.

The application helps users understand Kannada text from images and documents through OCR, translation, text simplification, intelligent summaries, vocabulary exploration, AI-powered question answering, and pronunciation generation.

A key highlight of Lipi Lens is its focus on **distinguishing and exploring the three major regional varieties of Kannada – North Karnataka, South Karnataka, and Coastal Karnataka Kannada.**

Lipi Lens aims to make Kannada digital content more accessible while celebrating the linguistic diversity of Kannada.

---

## 📌 Table of Contents

1. Project Overview
2. Key Features
3. Technology Stack
4. System Architecture
5. Project Structure
6. Feature Description
7. Regional Kannada Vocabulary Dataset
8. Mithi Text-to-Speech Integration
9. Installation and Setup
10. Running the Application
11. Environment Configuration
12. API and Service Overview
13. Dataset Information
14. Important Notes
15. Future Enhancements

---

## 1. Project Overview

Kannada is spoken by millions of people, yet accessing and understanding digital Kannada content can still be challenging.

Kannada also has rich regional variations in vocabulary and expressions across Karnataka. The three major varieties addressed by Lipi Lens are:

- **North Karnataka Kannada**
- **South Karnataka Kannada**
- **Coastal Karnataka Kannada**

Words and expressions commonly used in one region may differ from those used in another.

Most conventional language-processing applications treat Kannada as a single uniform language, often overlooking these regional distinctions.

**Lipi Lens aims to bridge this gap by bringing regional Kannada vocabulary distinction and exploration into an AI-powered platform.**

Along with its primary focus on regional Kannada variations, Lipi Lens provides OCR, translation, intelligent summaries, vocabulary exploration, AI-powered question answering, and text-to-speech capabilities.

---

## 2. Key Features

### 🗺️ 2.1 Three-Region Kannada Distinction – Our Key Feature

The main highlight of Lipi Lens is its focus on exploring and distinguishing vocabulary across three major regional varieties of Kannada:

1. North Karnataka Kannada
2. South Karnataka Kannada
3. Coastal Karnataka Kannada

This feature focuses on identifying and understanding regional vocabulary differences using Kannada vocabulary resources extracted from novels.

**Key capabilities:**
- Explore vocabulary belonging to three regional varieties.
- Understand differences in regional Kannada words and expressions.
- View English meanings and Kannada explanations.
- Explore example sentences to understand word usage.
- Discover regional vocabulary extracted from Kannada literature.

This feature aims to help Kannada speakers understand the linguistic diversity of Karnataka and appreciate how vocabulary and expressions vary across regions.

### 📷 2.2 Kannada OCR

- Upload images containing Kannada text.
- Extract Kannada text using Tesseract OCR.
- Process the extracted text for further operations.
- Display the extracted content in the application.

### 🌐 2.3 Kannada–English Translation

- Translate Kannada text into English.
- Translate English text into Kannada.
- Help users understand unfamiliar Kannada content.
- Uses the translation backend powered by IndicTrans2.

### 📖 2.4 Meaning and Text Understanding

- Understand Kannada words and expressions.
- Display meanings in Kannada and English.
- Make unfamiliar vocabulary easier to understand.

### 📝 2.5 Smart Summary

Generate concise summaries of uploaded document content.

The summary functionality focuses on:
- Important information.
- Key points.
- Relevant details.
- Easier understanding of lengthy content.

An English summary option is also available.

### 📚 2.6 Kannada Vocabulary Explorer

The Vocabulary Explorer helps users discover and understand Kannada words.

Features include:
- Kannada vocabulary exploration.
- English meanings.
- Kannada explanations.
- Example sentences in Kannada.
- Corresponding English examples.
- Search functionality.

### 🤖 2.7 AI Chatbot

Users can interact with an AI-powered chatbot to understand their uploaded documents.

The chatbot helps users:
- Ask questions about extracted content.
- Understand difficult passages.
- Clarify information.
- Explore document-related topics.

The chatbot supports Kannada and English text interaction.

### 🔊 2.8 Kannada Text-to-Speech

Lipi Lens integrates Mithi V2 Flash for Kannada pronunciation generation.

- Uses extracted Kannada text as input.
- Generates spoken Kannada audio.
- Uses the Charvi voice configuration.
- Produces WAV audio at a 24 kHz sample rate.

This feature provides pronunciation of text rather than speech-to-text transcription.

---

## 3. Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React.js | Frontend application |
| JavaScript | Application logic |
| HTML5 | Structure |
| CSS3 | Styling |
| Vite | Development server and build tool |

### Backend

| Technology | Purpose |
|---|---|
| Python | Backend development |
| Flask | REST API development |
| Tesseract OCR | Kannada text extraction |
| IndicTrans2 | Kannada–English translation |
| Google Gemini API | AI-powered features |
| Mithi V2 Flash | Kannada text-to-speech |

### AI and NLP

- IndicTrans2
- Google Gemini
- Mithi V2 Flash

### Regional Vocabulary Resources

- Kannada vocabulary dataset extracted from novels.
- Regional Kannada vocabulary organization covering North, South and Coastal Karnataka.

### Development Tools

- Git and GitHub
- Visual Studio Code
- Python virtual environments
- npm

---

## 4. System Architecture

Lipi Lens follows a modular architecture with separate services for OCR, translation, AI processing, regional vocabulary resources, and speech generation.

### Application Workflow

1. The user uploads an image through the React frontend.
2. The OCR service processes the image using Tesseract.
3. Extracted Kannada text is returned to the frontend.
4. The user can select translation, summary, vocabulary, or chatbot functionality.
5. Requests are forwarded to the corresponding backend APIs.
6. The Mithi service generates Kannada pronunciation when requested.
7. Results are displayed to the user.

### Backend Services

| Service | Port | Responsibility |
|---|---:|---|
| OCR Backend | 5001 | Image processing and Kannada text extraction |
| Main Ubuntu Backend | 5000 | Translation, summary, vocabulary and chatbot |
| Mithi Speech Backend | 5002 | Kannada text-to-speech |
| React Frontend | 5173 | User interface |

The regional backend operates as a separate component for regional Kannada vocabulary-related functionality.

---

## 5. Project Structure

```text
Lipi-Lens/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   │   └── api.js
│   │   └── ...
│   ├── .env.example
│   └── package.json
│
├── backend/
│   ├── routes/
│   │   ├── chatbot.py
│   │   ├── speech.py
│   │   ├── summary.py
│   │   └── vocabulary.py
│   │
│   ├── services/
│   │   ├── ai_service.py
│   │   ├── image_processing.py
│   │   ├── ocr_service.py
│   │   ├── speech_service.py
│   │   ├── summary_service.py
│   │   ├── translation_service.py
│   │   └── vocabulary_service.py
│   │
│   ├── app.py
│   ├── ubuntu_app.py
│   ├── mithi_app.py
│   ├── requirements.txt
│   └── uploads/
│
├── regional-backend/
│   ├── routes/
│   ├── services/
│   ├── datasets/
│   └── ...
│
├── .gitignore
└── README.md
```

---

## 6. Feature Description

### 6.1 OCR Processing

The OCR service uses Tesseract to extract Kannada text from uploaded images.

The extracted text becomes the input for other application features.

### 6.2 Translation

IndicTrans2 is used for Kannada–English translation.

The translation service handles the language conversion required by the application.

### 6.3 Smart Summary

The summary service processes document text and generates a concise representation of the important information.

It also supports English summaries.

### 6.4 Vocabulary Explorer

The vocabulary service retrieves vocabulary information and presents it in an understandable format.

Vocabulary information includes:
- Word.
- English meaning.
- Kannada explanation.
- Kannada example.
- English example.

### 6.5 AI Chatbot

The chatbot uses AI-based processing to answer questions and provide explanations related to document content.

### 6.6 Text-to-Speech

The speech service passes Kannada text to the Mithi model and returns generated audio.

---

## 7. Regional Kannada Vocabulary Dataset

One of the important components of Lipi Lens is its regional Kannada vocabulary resource.

Kannada has distinct regional variations in vocabulary and everyday usage.

Lipi Lens focuses on three major regional varieties:

1. North Karnataka Kannada.
2. South Karnataka Kannada.
3. Coastal Karnataka Kannada.

The regional vocabulary dataset is extracted from Kannada novels and organized to support exploration of vocabulary across these three regions.

The dataset helps users:
- Discover region-specific Kannada words.
- Explore differences in vocabulary.
- Understand meanings and regional expressions.
- Compare linguistic variations across geographical regions.
- Appreciate the diversity of Kannada language and literature.

This regional vocabulary resource forms the foundation of Lipi Lens's key feature: **exploring and understanding the differences among the three regional varieties of Kannada.**

---

## 8. Mithi Text-to-Speech Integration

Lipi Lens integrates the **Mithi V2 Flash** model for Kannada pronunciation generation.

### Model Information

| Parameter | Configuration |
|---|---|
| Model | Mithi V2 Flash |
| Repository | Oomni/mithi-v2-flash |
| Language | Kannada (`kn`) |
| Voice | Charvi (`charvi`) |
| Sample Rate | 24000 Hz |
| Output Format | WAV |
| Original Implementation | `run.py` containing the `Mithi` class |

### Integration Architecture

```text
React Frontend
      |
      v
Speech API
      |
      v
Mithi Flask Server
      |
      v
Mithi V2 Flash
      |
      v
Generated WAV Audio
```

### Model Storage

The model is stored outside the project repository because of its size.

### Environment Isolation

Mithi and IndicTrans2 may require different Transformers versions.

Therefore, Mithi is maintained in a separate Python virtual environment to avoid dependency conflicts.

The model can use CUDA on a compatible NVIDIA system. Other supported execution environments require appropriate device configuration.

**Note:** The current verified integration is Kannada pronunciation generation. English speech generation has not yet been verified.

---

## 9. Installation and Setup

### Prerequisites

- Python and compatible dependencies.
- Node.js and npm.
- Git.
- Tesseract OCR with Kannada language data.
- Required AI model files.
- Google Gemini API key.

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Lipi-Lens
```

### Step 2: Setup Frontend

```bash
cd frontend
npm install
```

### Step 3: Setup Main Backend

```bash
cd backend
python -m venv venv
```

Activate the environment.

**macOS/Linux:**

```bash
source venv/bin/activate
```

**Windows:**

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

### Step 4: Configure Environment Variables

Create a `.env` file inside the backend directory.

```env
GEMINI_API_KEY=your_gemini_api_key
```

Never commit API keys to GitHub.

### Step 5: Configure Tesseract OCR

Install Tesseract OCR and ensure Kannada language support is available.

Verify:

```bash
tesseract --version
tesseract --list-langs
```

The language list should include:

```text
kan
```

### Step 6: Configure Mithi

Download the model from Hugging Face:

`Oomni/mithi-v2-flash`

Keep the model outside the Git repository.

Configure the model directory in the speech service and install its dependencies in a separate virtual environment.

### Step 7: Configure Regional Backend

Set up the regional backend using its own requirements and environment configuration.

Keep the regional Kannada vocabulary dataset in its designated dataset directory.

---

## 10. Running the Application

Lipi Lens uses separate services. Each service should run in its own terminal.

### Terminal 1: OCR Backend

Start the configured OCR Flask service on port `5001`.

### Terminal 2: Main Backend

```bash
cd backend
source venv/bin/activate
python ubuntu_app.py
```

The main backend runs on:

```text
http://127.0.0.1:5000
```

### Terminal 3: Mithi Speech Backend

Activate the separate Mithi environment and start:

```bash
python mithi_app.py
```

The speech backend runs on:

```text
http://127.0.0.1:5002
```

### Terminal 4: Frontend

```bash
cd frontend
npm run dev
```

Open the local development URL displayed by Vite, typically:

```text
http://localhost:5173
```

The exact OCR and regional backend startup commands depend on their configured application entry points.

---

## 11. Environment Configuration

The frontend API configuration uses separate service URLs.

Example:

```env
VITE_UBUNTU_API_URL=http://127.0.0.1:5000/api
VITE_SPEECH_API_URL=http://127.0.0.1:5002/api
```

The OCR service should also point to its configured port.

For deployment, update the service URLs to the corresponding deployed backend addresses.

Do not commit local `.env` files or API keys.

---

## 12. API and Service Overview

| Module | Responsibility |
|---|---|
| OCR Service | Extract text from uploaded images |
| Translation Service | Kannada–English translation |
| Summary Service | Generate document summaries |
| Vocabulary Service | Retrieve and generate vocabulary information |
| Chatbot Service | Answer document-related questions |
| Speech Service | Generate Kannada pronunciation audio |

The frontend communicates with the respective backend services through:

```text
frontend/src/services/api.js
```

The exact endpoint paths and request formats are defined in the corresponding route files.

---

## 13. Dataset Information

Lipi Lens uses a Kannada vocabulary dataset extracted from novels.

The dataset supports regional vocabulary exploration across North, South and Coastal Karnataka.

The dataset is maintained separately from the application source code where appropriate.

Large datasets and external model checkpoints should not be unnecessarily duplicated in Git.

---

## 14. Important Notes

1. Tesseract is used for OCR-based text extraction.
2. IndicTrans2 is used for translation.
3. Gemini powers AI-based application features.
4. Mithi V2 Flash is used for Kannada text pronunciation.
5. Mithi is not used for speech-to-text transcription.
6. The Mithi model files are stored outside the Git repository.
7. Mithi uses a separate Python environment to avoid dependency conflicts.
8. Regional vocabulary resources focus on three varieties of Kannada.
9. English speech generation has not yet been verified.
10. All backend services must be running for their corresponding frontend features to work.

---

## 15. Future Enhancements

- Improved Kannada OCR accuracy.
- Expanded regional Kannada vocabulary resources.
- Improved contextual translation.
- More advanced document understanding.
- Enhanced summary generation.
- Expanded multilingual speech support.
- Improved offline functionality.
- Deployment of all backend services to a unified production environment.

---

## 16. Project Objective

Lipi Lens aims to bridge the gap between Kannada digital content and accessible AI-powered language understanding.

By combining OCR, translation, AI-based document understanding, regional vocabulary resources, and text-to-speech technology, the project provides a unified platform for exploring and understanding Kannada content.

### Developed for Modalapada 2.0
**Kannada Multimodal AI Hackathon**

**Lipi Lens – Making Kannada Digital, Accessible and Understandable.** 💛❤️