import React, { useState } from "react";
import {
  FileText,
  Calendar,
  Building2,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  Languages
} from "lucide-react";
import { useDocument } from "../context/DocumentContext";

/**
 * Extracts Kannada and English summary objects from the shared state.
 * Supports { kn: {...}, en: {...} }, { overview_en: ... }, or single-language payloads.
 */
function resolveSummaryData(rawSummary) {
  if (!rawSummary) return { kn: null, en: null };

  // 1. Kannada Data
  let kn = rawSummary.kn || rawSummary.kannada;
  if (!kn && (rawSummary.overview || rawSummary.importantPoints)) {
    kn = {
      overview: rawSummary.overview || "",
      importantPoints: rawSummary.importantPoints || [],
      datesAndDeadlines: rawSummary.datesAndDeadlines || [],
      amountsAndNumbers: rawSummary.amountsAndNumbers || [],
      namesAndOrganizations: rawSummary.namesAndOrganizations || [],
      importantInstructions: rawSummary.importantInstructions || []
    };
  }

  // 2. English Data
  let en = rawSummary.en || rawSummary.english;
  if (!en && (rawSummary.overview_en || rawSummary.overviewEn)) {
    en = {
      overview: rawSummary.overview_en || rawSummary.overviewEn || "",
      importantPoints: rawSummary.importantPoints_en || rawSummary.importantPointsEn || [],
      datesAndDeadlines: rawSummary.datesAndDeadlines_en || rawSummary.datesAndDeadlinesEn || [],
      amountsAndNumbers: rawSummary.amountsAndNumbers_en || rawSummary.amountsAndNumbersEn || [],
      namesAndOrganizations: rawSummary.namesAndOrganizations_en || rawSummary.namesAndOrganizationsEn || [],
      importantInstructions: rawSummary.importantInstructions_en || rawSummary.importantInstructionsEn || []
    };
  }

  return { kn, en };
}

export default function SummaryComponent({ isGenerating, onGenerate }) {
  const { summary, extractedText, showToast } = useDocument();
  const [copied, setCopied] = useState(false);
  const [languageMode, setLanguageMode] = useState("kn"); // "kn" | "en" | "both"

  const { kn, en } = resolveSummaryData(summary);

  const handleCopySummary = async () => {
    if (!summary) return;

    try {
      let textToCopy = "";

      if (languageMode === "kn" || (languageMode === "both" && !en)) {
        textToCopy = `[ಲಿಪಿ ಲೆನ್ಸ್ - ಕನ್ನಡ ದಾಖಲೆ ಸಾರಾಂಶ]\n\n`;
        if (kn?.overview) textToCopy += `ದಾಖಲೆಯ ಅವಲೋಕನ (Overview):\n${kn.overview}\n\n`;
        if (kn?.importantPoints?.length) {
          textToCopy += `ಮುಖ್ಯ ಅಂಶಗಳು (Key Points):\n${kn.importantPoints.map((p, i) => `${i + 1}. ${p}`).join("\n")}\n\n`;
        }
        if (kn?.datesAndDeadlines?.length) {
          textToCopy += `ದಿನಾಂಕ ಮತ್ತು ಗಡುವು (Deadlines):\n${kn.datesAndDeadlines.map(d => `${d.label}: ${d.value}`).join("\n")}\n\n`;
        }
        if (kn?.amountsAndNumbers?.length) {
          textToCopy += `ಮೊತ್ತ ಮತ್ತು ಅಂಕಿ-ಅಂಶಗಳು (Amounts):\n${kn.amountsAndNumbers.map(a => `${a.label}: ${a.value}`).join("\n")}\n\n`;
        }
        if (kn?.namesAndOrganizations?.length) {
          textToCopy += `ಸಂಸ್ಥೆಗಳು ಮತ್ತು ಅಧಿಕಾರಿಗಳು (Entities):\n${kn.namesAndOrganizations.map(n => `• ${n}`).join("\n")}\n\n`;
        }
        if (kn?.importantInstructions?.length) {
          textToCopy += `ಮುಖ್ಯ ಸೂಚನೆಗಳು (Instructions):\n${kn.importantInstructions.map(inst => `• ${inst}`).join("\n")}\n\n`;
        }
        showToast("ಕನ್ನಡ ಸಾರಾಂಶವನ್ನು ನಕಲಿಸಲಾಗಿದೆ", "success");
      } else if (languageMode === "en" && en) {
        textToCopy = `[Lipi Lens - Document Smart Summary]\n\n`;
        if (en?.overview) textToCopy += `Document Overview:\n${en.overview}\n\n`;
        if (en?.importantPoints?.length) {
          textToCopy += `Important Points:\n${en.importantPoints.map((p, i) => `${i + 1}. ${p}`).join("\n")}\n\n`;
        }
        if (en?.datesAndDeadlines?.length) {
          textToCopy += `Dates & Deadlines:\n${en.datesAndDeadlines.map(d => `${d.label}: ${d.value}`).join("\n")}\n\n`;
        }
        if (en?.amountsAndNumbers?.length) {
          textToCopy += `Amounts & Numbers:\n${en.amountsAndNumbers.map(a => `${a.label}: ${a.value}`).join("\n")}\n\n`;
        }
        if (en?.namesAndOrganizations?.length) {
          textToCopy += `Entities & Organizations:\n${en.namesAndOrganizations.map(n => `• ${n}`).join("\n")}\n\n`;
        }
        if (en?.importantInstructions?.length) {
          textToCopy += `Important Instructions:\n${en.importantInstructions.map(inst => `• ${inst}`).join("\n")}\n\n`;
        }
        showToast("Summary copied to clipboard (English)", "success");
      } else if (languageMode === "both" && kn && en) {
        textToCopy = `[Lipi Lens - Bilingual Smart Summary / ದ್ವಿಭಾಷಾ ಸಾರಾಂಶ]\n\n`;
        textToCopy += `=== 1. DOCUMENT OVERVIEW / ದಾಖಲೆಯ ಅವಲೋಕನ ===\n[ಕನ್ನಡ]: ${kn.overview}\n[English]: ${en.overview}\n\n`;
        if (kn.importantPoints?.length) {
          textToCopy += `=== 2. IMPORTANT POINTS / ಮುಖ್ಯ ಅಂಶಗಳು ===\n`;
          kn.importantPoints.forEach((p, idx) => {
            textToCopy += `${idx + 1}. [ಕನ್ನಡ]: ${p}\n   [English]: ${en.importantPoints?.[idx] || ""}\n`;
          });
          textToCopy += `\n`;
        }
        if (kn.datesAndDeadlines?.length) {
          textToCopy += `=== 3. DATES & DEADLINES / ದಿನಾಂಕ ಮತ್ತು ಗಡುವು ===\n`;
          kn.datesAndDeadlines.forEach((d, idx) => {
            textToCopy += `• [ಕನ್ನಡ]: ${d.label}: ${d.value} | [English]: ${en.datesAndDeadlines?.[idx]?.label || ""}: ${en.datesAndDeadlines?.[idx]?.value || ""}\n`;
          });
          textToCopy += `\n`;
        }
        if (kn.amountsAndNumbers?.length) {
          textToCopy += `=== 4. AMOUNTS & NUMBERS / ಮೊತ್ತ ಮತ್ತು ಸಂಖ್ಯೆಗಳು ===\n`;
          kn.amountsAndNumbers.forEach((a, idx) => {
            textToCopy += `• [ಕನ್ನಡ]: ${a.label}: ${a.value} | [English]: ${en.amountsAndNumbers?.[idx]?.label || ""}: ${en.amountsAndNumbers?.[idx]?.value || ""}\n`;
          });
          textToCopy += `\n`;
        }
        showToast("ದ್ವಿಭಾಷಾ ಸಾರಾಂಶವನ್ನು ನಕಲಿಸಲಾಗಿದೆ (Bilingual summary copied)", "success");
      }

      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  if (!summary) {
    return (
      <div
        className="card"
        style={{
          textAlign: "center",
          padding: "50px 24px",
          border: "2px dashed var(--color-border)",
          backgroundColor: "#FAF6EF"
        }}
      >
        <div
          className="feature-icon-box"
          style={{ width: 64, height: 64, margin: "0 auto 16px", backgroundColor: "var(--color-primary-soft)" }}
        >
          <Sparkles size={32} />
        </div>
        <h3 style={{ fontSize: 20, marginBottom: 8 }}>ಯಾವುದೇ ಸಾರಾಂಶ ಸಿದ್ಧವಾಗಿಲ್ಲ (No Summary Generated)</h3>
        <p style={{ maxWidth: 500, margin: "0 auto 20px", fontSize: 14 }}>
          {extractedText
            ? "ದಾಖಲೆಯಿಂದ ಹೊರತೆಗೆದ ಪಠ್ಯ ಸಿದ್ಧವಿದೆ. ಬುದ್ಧಿವಂತ ಸಾರಾಂಶವನ್ನು ಪಡೆಯಲು ಕೆಳಗಿನ ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ."
            : "ದಯವಿಟ್ಟು ಮೊದಲು 'ದಾಖಲೆ (Document Workspace)' ವಿಭಾಗದಲ್ಲಿ ಕನ್ನಡ ಕಡತವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ."}
        </p>
        <button
          onClick={onGenerate}
          disabled={!extractedText || isGenerating}
          className="btn btn-primary btn-lg"
        >
          <Sparkles size={18} />
          <span>{isGenerating ? "ಸಾರಾಂಶ ರಚಿಸಲಾಗುತ್ತಿದೆ..." : "ಸಾರಾಂಶ ರಚಿಸಿ (Generate Smart Summary)"}</span>
        </button>
      </div>
    );
  }

  // Active data representation based on languageMode
  const hasEnglish = Boolean(en && (en.overview || en.importantPoints?.length));

  // Determine section titles based on mode
  const getSectionTitle = (knTitle, enTitle) => {
    if (languageMode === "kn") return knTitle;
    if (languageMode === "en") return enTitle;
    return `${knTitle} • ${enTitle}`;
  };

  return (
    <div className="summary-wrapper">
      {/* Top action row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 14
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span className="badge badge-primary">AI Analyzed</span>

          {/* Bilingual Language Toggle: ಕನ್ನಡ | English | Both */}
          <div className="summary-language-toggle">
            <button
              type="button"
              className={`lang-toggle-btn ${languageMode === "kn" ? "active" : ""}`}
              onClick={() => setLanguageMode("kn")}
            >
              ಕನ್ನಡ
            </button>
            <button
              type="button"
              className={`lang-toggle-btn ${languageMode === "en" ? "active" : ""}`}
              onClick={() => setLanguageMode("en")}
            >
              English
            </button>
            <button
              type="button"
              className={`lang-toggle-btn ${languageMode === "both" ? "active" : ""}`}
              onClick={() => setLanguageMode("both")}
            >
              Both
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleCopySummary} className="btn btn-secondary btn-sm">
            {copied ? <Check size={14} color="#1B8354" /> : <Copy size={14} />}
            <span>{copied ? "Copied!" : "Copy Summary"}</span>
          </button>
          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="btn btn-outline-primary btn-sm"
          >
            <Sparkles size={14} />
            <span>Regenerate</span>
          </button>
        </div>
      </div>

      {/* Notice when English is selected but unavailable in backend payload */}
      {!hasEnglish && languageMode === "en" && (
        <div
          className="card"
          style={{
            padding: "36px 24px",
            textAlign: "center",
            border: "1.5px dashed var(--color-border)",
            marginBottom: 24,
            backgroundColor: "#FFFDF9"
          }}
        >
          <div
            className="feature-icon-box"
            style={{ width: 48, height: 48, margin: "0 auto 14px", backgroundColor: "var(--color-primary-soft)", color: "var(--color-primary)" }}
          >
            <Languages size={24} />
          </div>
          <h4 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, color: "var(--color-text-main)" }}>
            English Summary Not Available (ಇಂಗ್ಲಿಷ್ ಸಾರಾಂಶ ಲಭ್ಯವಿಲ್ಲ)
          </h4>
          <p style={{ fontSize: 14, color: "var(--color-text-secondary)", maxWidth: 540, margin: "0 auto 18px", lineHeight: 1.6 }}>
            The backend API provided only a Kannada summary for this document. When a bilingual response is returned by the server, English content will automatically populate here.
          </p>
          <button onClick={() => setLanguageMode("kn")} className="btn btn-primary btn-sm">
            <span>View Kannada Summary (ಕನ್ನಡ ಸಾರಾಂಶ ವೀಕ್ಷಿಸಿ)</span>
          </button>
        </div>
      )}

      {/* Notice in Both mode if English is unavailable */}
      {!hasEnglish && languageMode === "both" && (
        <div className="summary-lang-notice">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <AlertCircle size={16} color="var(--color-primary)" />
            <span>ಗಮನಿಸಿ: ಈ ದಾಖಲೆಗೆ ಇಂಗ್ಲಿಷ್ ಅನುವಾದಿತ ಸಾರಾಂಶ ಸರ್ವರ್‌ನಿಂದ ಲಭ್ಯವಿಲ್ಲ; ಕೇವಲ ಕನ್ನಡ ಆವೃತ್ತಿಯನ್ನು ಪ್ರದರ್ಶಿಸಲಾಗಿದೆ.</span>
          </div>
          <span className="badge badge-gold">Kannada Only</span>
        </div>
      )}

      {/* Render Content when either Kannada is selected, Both is selected, or English is available */}
      {(languageMode !== "en" || hasEnglish) && (
        <div>
          {/* 1. Document Overview Card */}
          <div className="summary-overview-card">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div className="section-icon-badge" style={{ backgroundColor: "var(--color-primary-soft)", color: "var(--color-primary)" }}>
                <FileText size={18} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--color-primary)" }}>
                {getSectionTitle("ದಾಖಲೆಯ ಅವಲೋಕನ (Document Overview)", "Document Overview")}
              </h3>
            </div>

            {/* Mode: Kannada Only */}
            {languageMode === "kn" && (
              <p className="kannada-text" style={{ fontSize: 15, lineHeight: 1.8, color: "var(--color-text-main)" }}>
                {kn?.overview}
              </p>
            )}

            {/* Mode: English Only */}
            {languageMode === "en" && hasEnglish && (
              <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--color-text-main)" }}>
                {en?.overview}
              </p>
            )}

            {/* Mode: Both */}
            {languageMode === "both" && (
              <div>
                <div style={{ marginBottom: hasEnglish ? 12 : 0 }}>
                  {hasEnglish && <span className="bilingual-tag bilingual-tag-kn">ಕನ್ನಡ</span>}
                  <p className="kannada-text" style={{ fontSize: 15, lineHeight: 1.8, color: "var(--color-text-main)" }}>
                    {kn?.overview}
                  </p>
                </div>

                {hasEnglish && (
                  <>
                    <div className="bilingual-divider" />
                    <div>
                      <span className="bilingual-tag bilingual-tag-en">English</span>
                      <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--color-text-secondary)" }}>
                        {en?.overview}
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Structured Sections Grid */}
          <div className="summary-sections-grid">
            {/* 2. Important Points */}
            {kn?.importantPoints && kn.importantPoints.length > 0 && (
              <div className="summary-section-card" style={{ gridColumn: "span 2" }}>
                <div className="card-header">
                  <div className="card-title">
                    <div className="section-icon-badge" style={{ backgroundColor: "#E8F7EE", color: "#1B8354" }}>
                      <CheckCircle2 size={18} />
                    </div>
                    <span>{getSectionTitle("ಮುಖ್ಯ ಅಂಶಗಳು (Important Points)", "Key Important Points")}</span>
                  </div>
                  <span className="badge badge-success">
                    {languageMode === "en" && hasEnglish
                      ? `${en?.importantPoints?.length || kn.importantPoints.length} Points`
                      : `${kn.importantPoints.length} Points`}
                  </span>
                </div>

                <ul className="summary-list">
                  {/* Mode: Kannada Only */}
                  {languageMode === "kn" &&
                    kn.importantPoints.map((point, index) => (
                      <li key={index} className="summary-list-item">
                        <span className="summary-bullet" />
                        <span className="kannada-text" style={{ color: "var(--color-text-main)" }}>
                          {point}
                        </span>
                      </li>
                    ))}

                  {/* Mode: English Only */}
                  {languageMode === "en" &&
                    hasEnglish &&
                    (en?.importantPoints || []).map((point, index) => (
                      <li key={index} className="summary-list-item">
                        <span className="summary-bullet" />
                        <span style={{ color: "var(--color-text-main)", lineHeight: 1.6 }}>
                          {point}
                        </span>
                      </li>
                    ))}

                  {/* Mode: Both */}
                  {languageMode === "both" &&
                    kn.importantPoints.map((point, index) => (
                      <li key={index} className="summary-list-item" style={{ flexDirection: "column", gap: 4 }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                          <span className="summary-bullet" />
                          <span className="kannada-text" style={{ color: "var(--color-text-main)", fontWeight: 500 }}>
                            {point}
                          </span>
                        </div>
                        {hasEnglish && en?.importantPoints?.[index] && (
                          <div className="bilingual-subitem">
                            <span className="bilingual-tag bilingual-tag-en" style={{ marginRight: 6 }}>EN</span>
                            <span>{en.importantPoints[index]}</span>
                          </div>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* 3. Important Dates and Deadlines */}
            {kn?.datesAndDeadlines && kn.datesAndDeadlines.length > 0 && (
              <div className="summary-section-card">
                <div className="card-header">
                  <div className="card-title">
                    <div className="section-icon-badge" style={{ backgroundColor: "#FFF5D6", color: "#8C6500" }}>
                      <Calendar size={18} />
                    </div>
                    <span>{getSectionTitle("ದಿನಾಂಕ ಮತ್ತು ಗಡುವು (Dates & Deadlines)", "Dates & Deadlines")}</span>
                  </div>
                </div>

                <div>
                  {/* Mode: Kannada Only */}
                  {languageMode === "kn" &&
                    kn.datesAndDeadlines.map((item, idx) => (
                      <div key={idx} className="key-value-row">
                        <span className="key-label kannada-text">{item.label}</span>
                        <span className="key-value kannada-text">{item.value}</span>
                      </div>
                    ))}

                  {/* Mode: English Only */}
                  {languageMode === "en" &&
                    hasEnglish &&
                    (en?.datesAndDeadlines || []).map((item, idx) => (
                      <div key={idx} className="key-value-row">
                        <span className="key-label">{item.label}</span>
                        <span className="key-value">{item.value}</span>
                      </div>
                    ))}

                  {/* Mode: Both */}
                  {languageMode === "both" &&
                    kn.datesAndDeadlines.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          marginBottom: 10,
                          backgroundColor: "#FAF5EB",
                          borderRadius: "var(--radius-sm)",
                          padding: "10px 12px"
                        }}
                      >
                        <div
                          className="key-value-row"
                          style={{
                            padding: 0,
                            background: "transparent",
                            marginBottom: hasEnglish && en?.datesAndDeadlines?.[idx] ? 6 : 0
                          }}
                        >
                          <span className="key-label kannada-text">{item.label}</span>
                          <span className="key-value kannada-text">{item.value}</span>
                        </div>
                        {hasEnglish && en?.datesAndDeadlines?.[idx] && (
                          <div
                            className="bilingual-subitem"
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              borderColor: "var(--color-gold-border)"
                            }}
                          >
                            <span style={{ color: "#666" }}>{en.datesAndDeadlines[idx].label}</span>
                            <span style={{ fontWeight: 600, color: "var(--color-primary)" }}>
                              {en.datesAndDeadlines[idx].value}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* 4. Amounts and Numbers */}
            {kn?.amountsAndNumbers && kn.amountsAndNumbers.length > 0 && (
              <div className="summary-section-card">
                <div className="card-header">
                  <div className="card-title">
                    <div className="section-icon-badge" style={{ backgroundColor: "#EAF2FF", color: "#0D6EFD" }}>
                      <DollarSign size={18} />
                    </div>
                    <span>{getSectionTitle("ಮೊತ್ತ ಮತ್ತು ಸಂಖ್ಯೆಗಳು (Amounts & Numbers)", "Amounts & Figures")}</span>
                  </div>
                </div>

                <div>
                  {/* Mode: Kannada Only */}
                  {languageMode === "kn" &&
                    kn.amountsAndNumbers.map((item, idx) => (
                      <div key={idx} className="key-value-row">
                        <span className="key-label kannada-text">{item.label}</span>
                        <span className="key-value" style={{ color: "var(--color-primary)" }}>{item.value}</span>
                      </div>
                    ))}

                  {/* Mode: English Only */}
                  {languageMode === "en" &&
                    hasEnglish &&
                    (en?.amountsAndNumbers || []).map((item, idx) => (
                      <div key={idx} className="key-value-row">
                        <span className="key-label">{item.label}</span>
                        <span className="key-value" style={{ color: "var(--color-primary)" }}>{item.value}</span>
                      </div>
                    ))}

                  {/* Mode: Both */}
                  {languageMode === "both" &&
                    kn.amountsAndNumbers.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          marginBottom: 10,
                          backgroundColor: "#FAF5EB",
                          borderRadius: "var(--radius-sm)",
                          padding: "10px 12px"
                        }}
                      >
                        <div
                          className="key-value-row"
                          style={{
                            padding: 0,
                            background: "transparent",
                            marginBottom: hasEnglish && en?.amountsAndNumbers?.[idx] ? 6 : 0
                          }}
                        >
                          <span className="key-label kannada-text">{item.label}</span>
                          <span className="key-value" style={{ color: "var(--color-primary)" }}>{item.value}</span>
                        </div>
                        {hasEnglish && en?.amountsAndNumbers?.[idx] && (
                          <div
                            className="bilingual-subitem"
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              borderColor: "var(--color-border)"
                            }}
                          >
                            <span style={{ color: "#666" }}>{en.amountsAndNumbers[idx].label}</span>
                            <span style={{ fontWeight: 600, color: "var(--color-primary)" }}>
                              {en.amountsAndNumbers[idx].value}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* 5. Names and Organizations / Entities */}
            {kn?.namesAndOrganizations && kn.namesAndOrganizations.length > 0 && (
              <div className="summary-section-card">
                <div className="card-header">
                  <div className="card-title">
                    <div className="section-icon-badge" style={{ backgroundColor: "#FAF0F1", color: "var(--color-primary)" }}>
                      <Building2 size={18} />
                    </div>
                    <span>{getSectionTitle("ಹೆಸರು ಮತ್ತು ಸಂಸ್ಥೆಗಳು (Entities & Organizations)", "Entities & Organizations")}</span>
                  </div>
                </div>

                <ul className="summary-list">
                  {/* Mode: Kannada Only */}
                  {languageMode === "kn" &&
                    kn.namesAndOrganizations.map((name, idx) => (
                      <li key={idx} className="summary-list-item">
                        <span className="summary-bullet" style={{ backgroundColor: "#B4232F" }} />
                        <span className="kannada-text" style={{ fontSize: 13, fontWeight: 600 }}>{name}</span>
                      </li>
                    ))}

                  {/* Mode: English Only */}
                  {languageMode === "en" &&
                    hasEnglish &&
                    (en?.namesAndOrganizations || []).map((name, idx) => (
                      <li key={idx} className="summary-list-item">
                        <span className="summary-bullet" style={{ backgroundColor: "#B4232F" }} />
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{name}</span>
                      </li>
                    ))}

                  {/* Mode: Both */}
                  {languageMode === "both" &&
                    kn.namesAndOrganizations.map((name, idx) => (
                      <li key={idx} className="summary-list-item" style={{ flexDirection: "column", gap: 2 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span className="summary-bullet" style={{ backgroundColor: "#B4232F" }} />
                          <span className="kannada-text" style={{ fontSize: 13, fontWeight: 600 }}>{name}</span>
                        </div>
                        {hasEnglish && en?.namesAndOrganizations?.[idx] && (
                          <div className="bilingual-subitem" style={{ fontSize: 12 }}>
                            {en.namesAndOrganizations[idx]}
                          </div>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* 6. Important Instructions */}
            {kn?.importantInstructions && kn.importantInstructions.length > 0 && (
              <div className="summary-section-card">
                <div className="card-header">
                  <div className="card-title">
                    <div className="section-icon-badge" style={{ backgroundColor: "#FDECEE", color: "var(--color-danger)" }}>
                      <AlertCircle size={18} />
                    </div>
                    <span>{getSectionTitle("ಮುಖ್ಯ ಸೂಚನೆಗಳು (Important Instructions)", "Critical Instructions")}</span>
                  </div>
                </div>

                <ul className="summary-list">
                  {/* Mode: Kannada Only */}
                  {languageMode === "kn" &&
                    kn.importantInstructions.map((instruction, idx) => (
                      <li key={idx} className="summary-list-item">
                        <span className="summary-bullet" style={{ backgroundColor: "var(--color-danger)" }} />
                        <span className="kannada-text" style={{ fontSize: 13, color: "var(--color-text-main)" }}>
                          {instruction}
                        </span>
                      </li>
                    ))}

                  {/* Mode: English Only */}
                  {languageMode === "en" &&
                    hasEnglish &&
                    (en?.importantInstructions || []).map((instruction, idx) => (
                      <li key={idx} className="summary-list-item">
                        <span className="summary-bullet" style={{ backgroundColor: "var(--color-danger)" }} />
                        <span style={{ fontSize: 13, color: "var(--color-text-main)", lineHeight: 1.6 }}>
                          {instruction}
                        </span>
                      </li>
                    ))}

                  {/* Mode: Both */}
                  {languageMode === "both" &&
                    kn.importantInstructions.map((instruction, idx) => (
                      <li key={idx} className="summary-list-item" style={{ flexDirection: "column", gap: 4 }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                          <span className="summary-bullet" style={{ backgroundColor: "var(--color-danger)" }} />
                          <span className="kannada-text" style={{ fontSize: 13, color: "var(--color-text-main)" }}>
                            {instruction}
                          </span>
                        </div>
                        {hasEnglish && en?.importantInstructions?.[idx] && (
                          <div className="bilingual-subitem" style={{ fontSize: 12, borderColor: "#F7C0C5" }}>
                            <span className="bilingual-tag bilingual-tag-en" style={{ marginRight: 6 }}>EN</span>
                            <span>{en.importantInstructions[idx]}</span>
                          </div>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
