import React, { useState } from "react";
import { Wand2, X, Copy, Check, Sparkles } from "lucide-react";
import { simplifyText } from "../services/api";
import { useDocument } from "../context/DocumentContext";

export default function SimplifyPanel({ onClose }) {
  const { extractedText, showToast } = useDocument();
  const [loading, setLoading] = useState(false);
  const [simplifiedResult, setSimplifiedResult] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSimplify = async () => {
    if (!extractedText) {
      showToast("ದಯವಿಟ್ಟು ಸರಳೀಕರಿಸಲು ಪಠ್ಯವನ್ನು ಒದಗಿಸಿ", "warning");
      return;
    }

    setLoading(true);
    try {
      const response = await simplifyText(extractedText);
      if (response.success) {
        setSimplifiedResult(response.simplifiedText);
        showToast("ಕನ್ನಡ ಪಠ್ಯವನ್ನು ಸರಳೀಕರಿಸಲಾಗಿದೆ!", "success");
      } else {
        showToast("ಸರಳೀಕರಣ ವಿಫಲವಾಗಿದೆ", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("ದೋಷ ಸಂಭವಿಸಿದೆ", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!simplifiedResult) return;
    try {
      await navigator.clipboard.writeText(simplifiedResult);
      setCopied(true);
      showToast("ಸರಳೀಕೃತ ಪಠ್ಯವನ್ನು ನಕಲಿಸಲಾಗಿದೆ", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div
      style={{
        marginTop: 20,
        backgroundColor: "#FFFFFF",
        border: "1.5px solid var(--color-gold-border)",
        borderRadius: "var(--radius-lg)",
        padding: 22,
        boxShadow: "var(--shadow-md)"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="feature-icon-box" style={{ width: 36, height: 36, backgroundColor: "var(--color-gold-light)", color: "#8C6500" }}>
            <Wand2 size={18} />
          </div>
          <div>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: "var(--color-text-main)" }}>
              ಸರಳೀಕೃತ ಕನ್ನಡ ವಿವರಣೆ (Kannada Simplification)
            </h4>
            <p style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
              ಕ್ಲಿಷ್ಟಕರ ಸರ್ಕಾರಿ ಆದೇಶ ಅಥವಾ ಹಳಗನ್ನಡ ಶೈಲಿಯನ್ನು ಸುಲಭವಾಗಿ ಅರ್ಥವಾಗುವ ಸಾಮಾನ್ಯ ಕನ್ನಡಕ್ಕೆ ಪರಿವರ್ತಿಸುತ್ತದೆ.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {!simplifiedResult && (
            <button
              onClick={handleSimplify}
              disabled={loading}
              className="btn btn-gold btn-sm"
            >
              <Sparkles size={14} />
              <span>{loading ? "ಸರಳೀಕರಿಸಲಾಗುತ್ತಿದೆ..." : "ಸರಳೀಕರಿಸಿ (Simplify Now)"}</span>
            </button>
          )}
          {simplifiedResult && (
            <button onClick={handleCopy} className="btn btn-secondary btn-sm">
              {copied ? <Check size={14} color="#1B8354" /> : <Copy size={14} />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="btn-icon-only btn-secondary" title="Close panel">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div style={{ padding: "30px 20px", textAlign: "center", color: "var(--color-text-secondary)" }}>
          <Sparkles size={24} className="spinning" style={{ color: "var(--color-primary)", marginBottom: 8 }} />
          <div>ಕ್ಲಿಷ್ಟಕರ ವಾಕ್ಯಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಿ ಸರಳೀಕರಿಸಲಾಗುತ್ತಿದೆ...</div>
        </div>
      )}

      {simplifiedResult && !loading && (
        <div
          className="kannada-text"
          style={{
            backgroundColor: "#FFFDF9",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            padding: "16px 20px",
            fontSize: 15,
            lineHeight: 1.8,
            whiteSpace: "pre-wrap",
            color: "var(--color-text-main)"
          }}
        >
          {simplifiedResult}
        </div>
      )}
    </div>
  );
}
