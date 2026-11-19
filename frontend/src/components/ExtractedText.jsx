import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Copy,
  Trash2,
  Check,
  Languages,
  Sparkles,
  MessageSquareText,
  FileText
} from "lucide-react";
import { useDocument } from "../context/DocumentContext";

export default function ExtractedText({ isExtracting }) {
  const { extractedText, setExtractedText, setTranslatedText, showToast } = useDocument();
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleCopy = async () => {
    if (!extractedText) return;
    try {
      await navigator.clipboard.writeText(extractedText);
      setCopied(true);
      showToast("ಪಠ್ಯವನ್ನು ನಕಲಿಸಲಾಗಿದೆ (Copied to clipboard)", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const handleClear = () => {
    setExtractedText("");
    setTranslatedText("");
    showToast("ಪಠ್ಯವನ್ನು ತೆರವುಗೊಳಿಸಲಾಗಿದೆ (Cleared)", "info");
  };

  const wordCount = extractedText ? extractedText.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = extractedText ? extractedText.length : 0;

  return (
    <div className="text-editor-container">
      <div className="editor-toolbar">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <FileText size={16} style={{ color: "var(--color-primary)" }} />
          <span style={{ fontWeight: 600 }}>ಹೊರತೆಗೆದ ಕನ್ನಡ ಪಠ್ಯ (Extracted Kannada Text)</span>
          <span className="badge badge-gold" style={{ fontSize: 11 }}>
            {wordCount} ಪದಗಳು • {charCount} ಅಕ್ಷರಗಳು
          </span>
        </div>

        <div className="editor-toolbar-actions">
          <button
            onClick={handleCopy}
            disabled={!extractedText}
            className="btn btn-secondary btn-sm"
            title="Copy text"
          >
            {copied ? <Check size={14} color="#1B8354" /> : <Copy size={14} />}
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>
          <button
            onClick={handleClear}
            disabled={!extractedText}
            className="btn btn-secondary btn-sm"
            title="Clear text"
          >
            <Trash2 size={14} />
            <span>Clear</span>
          </button>
        </div>
      </div>

      <textarea
        className="form-textarea kannada-text"
        value={extractedText}
        onChange={(e) => {
          setExtractedText(e.target.value);
          setTranslatedText("");
        }}
        placeholder={
          isExtracting
            ? "ಕನ್ನಡ ದಾಖಲೆಯಿಂದ ಅಕ್ಷರಗಳನ್ನು ಓದಲಾಗುತ್ತಿದೆ, ದಯವಿಟ್ಟು ನಿರೀಕ್ಷಿಸಿ... (Extracting OCR text...)"
            : "ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ದಾಖಲೆಯಿಂದ ಹೊರತೆಗೆದ ಕನ್ನಡ ಪಠ್ಯ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ. ಅಗತ್ಯವಿದ್ದರೆ ನೀವು ನೇರವಾಗಿ ಇಲ್ಲಿ ತಿದ್ದಬಹುದು ಅಥವಾ ಟೈಪ್ ಮಾಡಬಹುದು..."
        }
        style={{
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          minHeight: 260,
          fontSize: 15,
          lineHeight: 1.8
        }}
      />

      {/* Quick Intelligence Action Buttons */}
      <div className="workspace-actions">
        <button
          onClick={() => {
            if (!extractedText) {
              showToast("ದಯವಿಟ್ಟು ಮೊದಲು ಪಠ್ಯವನ್ನು ಒದಗಿಸಿ ಅಥವಾ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ", "warning");
              return;
            }
            navigate("/translation");
          }}
          className="btn btn-primary btn-sm"
        >
          <Languages size={15} />
          <span>Translate (ಅನುವಾದ)</span>
        </button>

        <button
          onClick={() => {
            if (!extractedText) {
              showToast("ದಯವಿಟ್ಟು ಮೊದಲು ಪಠ್ಯವನ್ನು ಒದಗಿಸಿ", "warning");
              return;
            }
            navigate("/summary");
          }}
          className="btn btn-secondary btn-sm"
        >
          <Sparkles size={15} style={{ color: "#B37400" }} />
          <span>Generate Summary</span>
        </button>

        <button
          onClick={() => {
            if (!extractedText) {
              showToast("ದಯವಿಟ್ಟು ಮೊದಲು ಪಠ್ಯವನ್ನು ಒದಗಿಸಿ", "warning");
              return;
            }
            navigate("/chatbot");
          }}
          className="btn btn-secondary btn-sm"
        >
          <MessageSquareText size={15} style={{ color: "var(--color-primary)" }} />
          <span>Ask AI Chatbot</span>
        </button>
      </div>
    </div>
  );
}
