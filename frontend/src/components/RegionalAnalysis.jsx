import React, { useState } from "react";
import {
  Compass,
  MapPin,
  Sparkles,
  Copy,
  Check
} from "lucide-react";
import { useDocument } from "../context/DocumentContext";
import { analyseRegionalKannada } from "../services/api";

export default function RegionalAnalysis() {
  const { extractedText, showToast } = useDocument();
  const [inputText, setInputText] = useState(extractedText || "");
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleAnalyze = async () => {
    if (!inputText || !inputText.trim()) {
      showToast("ದಯವಿಟ್ಟು ವಿಶ್ಲೇಷಿಸಲು ಕನ್ನಡ ಪಠ್ಯವನ್ನು ಒದಗಿಸಿ", "warning");
      return;
    }

    setLoading(true);
    try {
      const response = await analyseRegionalKannada(inputText);
      if (response.success && response.analysis) {
        setAnalysisResult(response.analysis);
        showToast("ಪ್ರಾದೇಶಿಕ ಭಾಷಾ ವಿಶ್ಲೇಷಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ!", "success");
      } else {
        showToast("ವಿಶ್ಲೇಷಣೆ ವಿಫಲವಾಗಿದೆ", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("ದೋಷ ಕಂಡುಬಂದಿದೆ", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSampleDialect = (sampleDialectText) => {
    setInputText(sampleDialectText);
    setAnalysisResult(null);
  };

  const handleCopyExpression = async (expr, index) => {
    const text = `${expr.word} (${expr.region})\nಪ್ರಮಾಣಿತ ರೂಪ: ${expr.standard}\nEnglish: ${expr.englishMeaning}\nಸಂದರ್ಭ: ${expr.context}`;
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    showToast("ಪ್ರಾದೇಶಿಕ ಪದದ ವಿವರವನ್ನು ನಕಲಿಸಲಾಗಿದೆ", "success");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getRegionBadgeClass = (regionName = "") => {
    if (regionName.includes("Coastal") || regionName.includes("ಕರಾವಳಿ")) return "region-coastal";
    if (regionName.includes("North") || regionName.includes("ಉತ್ತರ")) return "region-north";
    return "region-mysuru";
  };

  return (
    <div className="regional-container">
      {/* Input & Control Card */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div className="card-title">
            <div className="feature-icon-box" style={{ width: 36, height: 36, backgroundColor: "var(--color-gold-light)", color: "#8C6500" }}>
              <Compass size={18} />
            </div>
            <span>ಪ್ರಾದೇಶಿಕ ಕನ್ನಡ ಭಾಷಾ ಬುದ್ಧಿವಂತಿಕೆ (Regional Dialect Intelligence)</span>
          </div>
          <span className="badge badge-gold">Novelty AI Feature</span>
        </div>

        <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 14 }}>
          ಉತ್ತರ ಕರ್ನಾಟಕ (North Karnataka), ಕರಾವಳಿ (Coastal Karnataka), ಮತ್ತು ಹಳೆ ಮೈಸೂರು (Mysuru) ಪ್ರಾಂತ್ಯಗಳ ವಿಶಿಷ್ಟ ಆಡುನುಡಿ, ಪದಪುಂಜಗಳು ಹಾಗೂ ನುಡಿಗಟ್ಟುಗಳನ್ನು ಗುರುತಿಸಿ ಪ್ರಮಾಣಿತ ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್ ಅರ್ಥವನ್ನು ನೀಡುತ್ತದೆ.
        </p>

        {/* Quick sample dialect buttons */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 600, alignSelf: "center", color: "var(--color-text-secondary)" }}>
            ಪರೀಕ್ಷಿಸಿ:
          </span>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleSampleDialect("ಯಪ್ಪಾ, ನಮ್ಮ ಹುಬ್ಬಳ್ಳ್ಯಾಗ ಭಾಳ ಚಳಿ ಬಿದ್ದೈತಿ ನೋಡ್ರಿ! ಅಟ್ಟಿ ಮಂದಿ ಎಲ್ಲ ಕೂಡಿ ಗಮ್ಮತ್ತಿನಾಗಿರ್ರಿ ಅಂದ್ರು.")}
          >
            ಉತ್ತರ ಕರ್ನಾಟಕ (North Dialect)
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleSampleDialect("ನಮ್ಮ ಕುಡ್ಲದ ಊರಿನಲ್ಲಿ ಎಂಚಿತ್ತಿನ ಪೊರ್ಲು ಕಂಬಳ ನಡೀತಿದೆ ಬೊಕ್ಕ ಬಯ್ಯದ ಹೊತ್ತಿಗೆ ಕೋರಿ ರೊಟ್ಟಿ ಊಟ!")}
          >
            ಕರಾವಳಿ ಕನ್ನಡ (Coastal Dialect)
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleSampleDialect("ಬನ್ನಿ ಸ್ವಾಮಿ, ಉಪಚಾರ ಸ್ವೀಕರಿಸಿ ಕಣ್ರೀ. ತಿಂಡಿ ತೀರ್ಥ ಮುಗಿಸಿಕೊಂಡು ಆಮೇಲೆ ಮಾತನಾಡೋಣ ಕಣಯ್ಯ.")}
          >
            ಮೈಸೂರು ಶೈಲಿ (Mysuru Dialect)
          </button>
        </div>

        <textarea
          className="form-textarea kannada-text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="ವಿಶ್ಲೇಷಿಸಬೇಕಾದ ಕನ್ನಡ ಪಠ್ಯವನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಅಂಟಿಸಿ..."
          style={{ minHeight: 130 }}
        />

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
          <button
            onClick={handleAnalyze}
            disabled={!inputText.trim() || loading}
            className="btn btn-primary"
          >
            <Sparkles size={16} />
            <span>{loading ? "ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ..." : "ಪ್ರಾದೇಶಿಕತೆ ವಿಶ್ಲೇಷಿಸಿ (Analyze Dialect)"}</span>
          </button>
        </div>
      </div>

      {/* Analysis Results View */}
      {analysisResult && (
        <div>
          {/* Main Detected Region Banner */}
          <div
            style={{
              background: "linear-gradient(135deg, #FFFDF8 0%, #FAF1E3 100%)",
              border: "1.5px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              padding: "20px 24px",
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                className="feature-icon-box"
                style={{ width: 48, height: 48, backgroundColor: "var(--color-primary-soft)", color: "var(--color-primary)" }}
              >
                <MapPin size={24} />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  AI DIALECT ESTIMATION
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--color-text-main)" }} className="kannada-text">
                  {analysisResult.primaryRegion}
                </h3>
                <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 2 }}>
                  {analysisResult.summary}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
              <span className="badge badge-gold" style={{ fontSize: 12 }}>
                {analysisResult.detectedExpressions?.length || 0} Regional Expressions Found
              </span>
              <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
                Carefully indicated as "Possible Region"
              </span>
            </div>
          </div>

          {/* List of Detected Expressions */}
          <div style={{ marginBottom: 16 }}>
            <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: "var(--color-text-main)" }}>
              ಗುರುತಿಸಲಾದ ಪ್ರಾದೇಶಿಕ ನುಡಿಗಟ್ಟುಗಳು ಮತ್ತು ಪದ ವಿವರಣೆಗಳು (Identified Expressions):
            </h4>

            {analysisResult.detectedExpressions?.map((expr, idx) => (
              <div key={idx} className="expression-card">
                <div className="expression-header">
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span className="expression-word kannada-text">{expr.word}</span>
                    <span className={`region-badge-pill ${getRegionBadgeClass(expr.region)}`}>
                      {expr.region}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span className="badge badge-primary" style={{ fontSize: 11 }}>
                      {expr.confidence}
                    </span>
                    <button
                      onClick={() => handleCopyExpression(expr, idx)}
                      className="btn-icon-only btn-secondary"
                      title="Copy expression detail"
                    >
                      {copiedIndex === idx ? <Check size={14} color="#1B8354" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 12 }}>
                  <div style={{ background: "#FAF5EB", padding: "12px 14px", borderRadius: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-primary)", marginBottom: 4 }}>
                      ಪ್ರಮಾಣಿತ ಕನ್ನಡ ರೂಪ (Standard Kannada Equivalent):
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "var(--color-text-main)" }} className="kannada-text">
                      {expr.standard}
                    </div>
                  </div>

                  <div style={{ background: "#F5F8FA", padding: "12px 14px", borderRadius: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#0B638A", marginBottom: 4 }}>
                      English Meaning:
                    </div>
                    <div style={{ fontSize: 14, color: "var(--color-text-main)" }}>
                      {expr.englishMeaning}
                    </div>
                  </div>
                </div>

                {expr.context && (
                  <div style={{ marginTop: 12, fontSize: 13, color: "var(--color-text-secondary)" }}>
                    <strong>ಸಂದರ್ಭ ಮತ್ತು ಬಳಕೆ (Context & Usage):</strong> {expr.context}
                  </div>
                )}

                {expr.alternatives && expr.alternatives.length > 0 && (
                  <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-muted)" }}>
                      ಪ್ರಾದೇಶಿಕ ಪರ್ಯಾಯಗಳು (Alternatives):
                    </span>
                    {expr.alternatives.map((alt, altIdx) => (
                      <span key={altIdx} className="badge badge-secondary kannada-text" style={{ fontSize: 12, background: "#FFF", border: "1px solid var(--color-border)" }}>
                        {alt}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
