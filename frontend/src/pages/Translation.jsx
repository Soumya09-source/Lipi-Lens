import React, { useState } from "react";
import {
  ArrowRightLeft,
  Copy,
  Check,
  Trash2,
  Sparkles,
  FileText
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import SpeechPlayer from "../components/SpeechPlayer";
import { useDocument } from "../context/DocumentContext";
import { translateText } from "../services/api";

export default function Translation() {
  const { extractedText, translatedText, setTranslatedText, showToast } = useDocument();

  const [sourceLang, setSourceLang] = useState("kn"); // 'kn' or 'en'
  const [targetLang, setTargetLang] = useState("en"); // 'en' or 'kn'
  const [inputText, setInputText] = useState(extractedText || "");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    // Swap text values
    const currentInput = inputText;
    setInputText(translatedText);
    setTranslatedText(currentInput);
    showToast("ಭಾಷೆಯ ದಿಕ್ಕನ್ನು ಅದಲು-ಬದಲು ಮಾಡಲಾಗಿದೆ", "info");
  };

  const handleTranslate = async () => {
    if (!inputText || !inputText.trim()) {
      showToast("ದಯವಿಟ್ಟು ಭಾಷಾಂತರಿಸಲು ಪಠ್ಯವನ್ನು ನಮೂದಿಸಿ", "warning");
      return;
    }

    setLoading(true);
    try {
      const result = await translateText(inputText, sourceLang, targetLang);
      if (result.success && result.translatedText) {
        setTranslatedText(result.translatedText);
        showToast("ಯಶಸ್ವಿಯಾಗಿ ಅನುವಾದಿಸಲಾಗಿದೆ!", "success");
      } else {
        showToast(result.error || "ಅನುವಾದ ಪ್ರಕ್ರಿಯೆ ವಿಫಲವಾಗಿದೆ", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("ದೋಷ ಕಂಡುಬಂದಿದೆ", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyOutput = async () => {
    if (!translatedText) return;
    try {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      showToast("ಅನುವಾದಿತ ಪಠ್ಯವನ್ನು ನಕಲಿಸಲಾಗಿದೆ", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearInput = () => {
    setInputText("");
    showToast("ಇನ್‌ಪುಟ್ ತೆರವುಗೊಳಿಸಲಾಗಿದೆ", "info");
  };

  return (
    <DashboardLayout
      title="Translation"
      kannadaTitle="ಕನ್ನಡ ಅನುವಾದ"
      subtitle="Context-aware neural translation between Kannada and English"
    >
      {/* Language Switcher Control Banner */}
      <div className="translation-header-controls">
        <div className={`language-pill ${sourceLang === "kn" ? "active" : ""}`}>
          <span>{sourceLang === "kn" ? "ಕನ್ನಡ (Kannada)" : "English (ಇಂಗ್ಲಿಷ್)"}</span>
        </div>

        <button
          onClick={handleSwapLanguages}
          className="swap-lang-btn"
          title="Swap Languages (ಭಾಷೆ ಅದಲು-ಬದಲು)"
          aria-label="Swap translation directions"
        >
          <ArrowRightLeft size={16} />
        </button>

        <div className={`language-pill ${targetLang === "en" ? "active" : ""}`}>
          <span>{targetLang === "en" ? "English (ಇಂಗ್ಲಿಷ್)" : "ಕನ್ನಡ (Kannada)"}</span>
        </div>
      </div>

      {/* Side-by-Side Translation Workspace */}
      <div className="translation-container">
        {/* Source Text Area */}
        <div className="card" style={{ display: "flex", flexDirection: "column" }}>
          <div className="card-header">
            <div className="card-title">
              <span className="badge badge-primary">Source</span>
              <span>{sourceLang === "kn" ? "ಕನ್ನಡ ಮೂಲ ಪಠ್ಯ" : "English Source Text"}</span>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              {extractedText && inputText !== extractedText && (
                <button
                  onClick={() => setInputText(extractedText)}
                  className="btn btn-secondary btn-sm"
                  title="Load OCR document text"
                >
                  <FileText size={13} />
                  <span>Use OCR Doc</span>
                </button>
              )}
              <button
                onClick={handleClearInput}
                disabled={!inputText}
                className="btn btn-secondary btn-sm"
              >
                <Trash2 size={13} />
                <span>Clear</span>
              </button>
            </div>
          </div>

          <textarea
            className={`form-textarea ${sourceLang === "kn" ? "kannada-text" : ""}`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              sourceLang === "kn"
                ? "ಇಲ್ಲಿ ಕನ್ನಡ ಪಠ್ಯವನ್ನು ನಮೂದಿಸಿ ಅಥವಾ ದಾಖಲೆ ಕಾರ್ಯಕ್ಷೇತ್ರದಿಂದ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಲೋಡ್ ಆಗುತ್ತದೆ..."
                : "Type or paste English text to translate into Kannada..."
            }
            style={{ flex: 1, minHeight: 280, fontSize: 15 }}
          />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
            <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
              {inputText.length} characters
            </span>
            <button
              onClick={handleTranslate}
              disabled={!inputText.trim() || loading}
              className="btn btn-primary"
            >
              <Sparkles size={16} />
              <span>{loading ? "ಅನುವಾದಿಸಲಾಗುತ್ತಿದೆ..." : "ಅನುವಾದಿಸಿ (Translate)"}</span>
            </button>
          </div>
        </div>

        {/* Translated Output Area */}
        <div className="card" style={{ display: "flex", flexDirection: "column" }}>
          <div className="card-header">
            <div className="card-title">
              <span className="badge badge-gold">Target</span>
              <span>{targetLang === "en" ? "English Translated Output" : "ಕನ್ನಡ ಅನುವಾದಿತ ಫಲಿತಾಂಶ"}</span>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              {/* Strictly Speech Output Playback (NO Microphone/Input) */}
              <SpeechPlayer text={translatedText} language={targetLang} />

              <button
                onClick={handleCopyOutput}
                disabled={!translatedText}
                className="btn btn-secondary btn-sm"
              >
                {copied ? <Check size={14} color="#1B8354" /> : <Copy size={14} />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>

          <textarea
            className={`form-textarea ${targetLang === "kn" ? "kannada-text" : ""}`}
            value={translatedText}
            readOnly
            placeholder={
              loading
                ? "ಅನುವಾದ ಪ್ರಕ್ರಿಯೆ ನಡೆಯುತ್ತಿದೆ... (Translating, please wait...)"
                : "ಅನುವಾದಿತ ಪಠ್ಯ ಇಲ್ಲಿ ಕಾಣಿಸಿಕೊಳ್ಳುತ್ತದೆ..."
            }
            style={{
              flex: 1,
              minHeight: 280,
              fontSize: 15,
              backgroundColor: "#FCFAF6",
              cursor: "default"
            }}
          />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
            <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
              {translatedText ? `${translatedText.length} characters translated` : "Ready"}
            </span>

            {translatedText && (
              <span className="badge badge-success" style={{ fontSize: 11 }}>
                Translated with Lipi Lens
              </span>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
