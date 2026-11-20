import React, { useState } from "react";
import {
  Check,
  Compass,
  Copy,
  FileText,
  BookOpen,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useDocument } from "../context/DocumentContext";
import { analyseRegionalKannada } from "../services/regionalApi";

const REGION_LABELS = {
  coastal: "Coastal Kannada (ಕರಾವಳಿ)",
  north_karnataka: "North Karnataka Kannada (ಉತ್ತರ ಕರ್ನಾಟಕ)",
  mysuru: "Mysuru Kannada (ಮೈಸೂರು)",
};
const DATASET_TYPE_LABELS = {
  word: "Vocabulary",
  sentence: "Sentence",
  paragraph: "Paragraph",
};

const getRegionBadgeClass = (region = "") => {
  if (region.includes("Coastal") || region.includes("ಕರಾವಳಿ")) return "region-coastal";
  if (region.includes("North") || region.includes("ಉತ್ತರ")) return "region-north";
  if (region.includes("Mysuru") || region.includes("ಮೈಸೂರು")) return "region-mysuru";
  return "region-neutral";
};

const getCandidateRegions = (analysis) =>
  Object.entries(analysis?.regional_evidence || {})
    .filter(([, evidence]) => evidence?.matched_expressions?.length)
    .map(([region, evidence]) => ({
      id: region,
      label: evidence.label || REGION_LABELS[region] || region,
      evidence,
    }));

const getVerificationStatus = (expression) =>
  expression.is_shared
    ? "shared"
    : expression.verification_status || "unknown";

const VerificationBadge = ({ expression }) => {
  const status = getVerificationStatus(expression);
  return (
    <span className={`regional-verification is-${status}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function RegionalAnalysis() {
  const { extractedText, documentName, showToast } = useDocument();
  const [inputOverride, setInputOverride] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisState, setAnalysisState] = useState(null);
  const [inputErrorState, setInputErrorState] = useState(null);
  const [requestErrorState, setRequestErrorState] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const inputText =
    inputOverride &&
    inputOverride.documentName === documentName &&
    inputOverride.documentText === extractedText
      ? inputOverride.text
      : extractedText || "";
  const analysisResult =
    analysisState &&
    analysisState.documentName === documentName &&
    analysisState.documentText === extractedText &&
    analysisState.inputText === inputText
      ? analysisState.result
      : null;
  const inputError =
    inputErrorState &&
    inputErrorState.documentName === documentName &&
    inputErrorState.documentText === extractedText &&
    inputErrorState.inputText === inputText
      ? inputErrorState.message
      : "";
  const requestError =
    requestErrorState &&
    requestErrorState.documentName === documentName &&
    requestErrorState.documentText === extractedText &&
    requestErrorState.inputText === inputText
      ? requestErrorState.message
      : "";

  const updateInput = (text) => {
    setInputOverride({ documentName, documentText: extractedText, text });
    setInputErrorState(null);
    setRequestErrorState(null);
    setAnalysisState(null);
  };

  const handleAnalyze = async (event) => {
    event.preventDefault();
    if (loading) return;
    if (!inputText.trim()) {
      const message = "ದಯವಿಟ್ಟು ವಿಶ್ಲೇಷಿಸಲು ಕನ್ನಡ ಪಠ್ಯವನ್ನು ಒದಗಿಸಿ";
      setInputErrorState({
        documentName,
        documentText: extractedText,
        inputText,
        message,
      });
      showToast(message, "warning");
      return;
    }

    const sourceText = inputText.trim();
    setLoading(true);
    setRequestErrorState(null);
    setAnalysisState(null);
    try {
      const response = await analyseRegionalKannada(sourceText);
      if (!response?.success) {
        throw new Error("Regional analysis returned an unsuccessful response.");
      }
      setAnalysisState({
        documentName,
        documentText: extractedText,
        inputText,
        result: response,
      });
      showToast("ಪ್ರಾದೇಶಿಕ ಭಾಷಾ ವಿಶ್ಲೇಷಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ!", "success");
    } catch (error) {
      const message = error.message || "Regional analysis failed. Please try again.";
      setRequestErrorState({
        documentName,
        documentText: extractedText,
        inputText,
        message,
      });
      showToast("ಪ್ರಾದೇಶಿಕ ವಿಶ್ಲೇಷಣೆ ವಿಫಲವಾಗಿದೆ", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyExpression = async (expression, index) => {
    const text = [
      `${expression.original_text || expression.expression} (${expression.region || "region not identified"})`,
      `ಪ್ರಮಾಣಿತ ಕನ್ನಡ: ${expression.standard_kannada || "ಲಭ್ಯವಿಲ್ಲ"}`,
      `English: ${expression.english_meaning || "Not available"}`,
      `Verification: ${expression.verification_status || "unknown"}`,
      `Source: ${expression.source || "Not available"}`,
      `Standard Kannada source: ${expression.standard_kannada_source || "unavailable"}`,
      `English meaning source: ${expression.english_meaning_source || "unavailable"}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      showToast("ಪ್ರಾದೇಶಿಕ ಪದದ ವಿವರವನ್ನು ನಕಲಿಸಲಾಗಿದೆ", "success");
      window.setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error("Copy failed", error);
      showToast("ವಿವರವನ್ನು ನಕಲಿಸಲಾಗಲಿಲ್ಲ", "error");
    }
  };

  const candidateRegions = analysisResult
    ? getCandidateRegions(analysisResult)
    : [];
  const matchedExpressions = Array.isArray(analysisResult?.matched_expressions)
    ? analysisResult.matched_expressions.filter(Boolean)
    : [];
  const identifiedVariety = analysisResult?.identified_variety;

  return (
    <div className="regional-container">
      <form className="card regional-input-card" onSubmit={handleAnalyze}>
        <div className="card-header">
          <div className="card-title">
            <div
              className="feature-icon-box"
              style={{
                width: 36,
                height: 36,
                backgroundColor: "var(--color-gold-light)",
                color: "#8C6500",
              }}
            >
              <Compass size={18} />
            </div>
            <span>ಪ್ರಾದೇಶಿಕ ಕನ್ನಡ ಭಾಷಾ ಬುದ್ಧಿವಂತಿಕೆ (Regional Dialect Intelligence)</span>
          </div>
          <span className="badge badge-gold">Regional Evidence Analysis</span>
        </div>

        <p className="regional-description">
          ಉತ್ತರ ಕರ್ನಾಟಕ, ಕರಾವಳಿ ಮತ್ತು ಮೈಸೂರು ಪ್ರಾಂತ್ಯಗಳ ಪದಪ್ರಯೋಗಗಳ ಸಾಕ್ಷ್ಯ ಹಾಗೂ
          ಪರಿಶೀಲನಾ ಸ್ಥಿತಿಯನ್ನು ತೋರಿಸುತ್ತದೆ. ಸಾಕಷ್ಟು ಸಾಕ್ಷ್ಯವಿಲ್ಲದಿದ್ದರೆ ಫಲಿತಾಂಶವನ್ನು
          Unknown ಎಂದು ತೋರಿಸಲಾಗುತ್ತದೆ.
        </p>

        <div className="regional-input-toolbar">
          <span className="regional-toolbar-label">ಪಠ್ಯ ಮೂಲ (Text source):</span>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => updateInput(extractedText)}
            disabled={!extractedText || loading}
          >
            <FileText size={14} />
            <span>OCR ಪಠ್ಯ ಬಳಸಿ (Use extracted text)</span>
          </button>
          {extractedText && (
            <span className="regional-source-note">
              {extractedText.length} ಅಕ್ಷರಗಳು ಲಭ್ಯವಿದೆ
            </span>
          )}
        </div>

        <div className="regional-samples">
          <span className="regional-toolbar-label">ಪರೀಕ್ಷಿಸಿ (Examples):</span>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled={loading}
            onClick={() =>
              updateInput(
                "ಯಪ್ಪಾ, ನಮ್ಮ ಹುಬ್ಬಳ್ಳ್ಯಾಗ ಭಾಳ ಚಳಿ ಬಿದ್ದೈತಿ ನೋಡ್ರಿ! ಅಟ್ಟಿ ಮಂದಿ ಎಲ್ಲ ಕೂಡಿ ಗಮ್ಮತ್ತಿನಾಗಿರ್ರಿ ಅಂದ್ರು.",
              )
            }
          >
            ಉತ್ತರ ಕರ್ನಾಟಕ
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled={loading}
            onClick={() =>
              updateInput(
                "ನಮ್ಮ ಕುಡ್ಲದ ಊರಿನಲ್ಲಿ ಎಂಚಿತ್ತಿನ ಪೊರ್ಲು ಕಂಬಳ ನಡೀತಿದೆ ಬೊಕ್ಕ ಬಯ್ಯದ ಹೊತ್ತಿಗೆ ಕೋರಿ ರೊಟ್ಟಿ ಊಟ!",
              )
            }
          >
            ಕರಾವಳಿ ಕನ್ನಡ
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled={loading}
            onClick={() =>
              updateInput(
                "ಬನ್ನಿ ಸ್ವಾಮಿ, ಉಪಚಾರ ಸ್ವೀಕರಿಸಿ ಕಣ್ರೀ. ತಿಂಡಿ ತೀರ್ಥ ಮುಗಿಸಿಕೊಂಡು ಆಮೇಲೆ ಮಾತನಾಡೋಣ ಕಣಯ್ಯ.",
              )
            }
          >
            ಮೈಸೂರು ಶೈಲಿ
          </button>
        </div>

        <label className="regional-text-label" htmlFor="regional-analysis-text">
          ವಿಶ್ಲೇಷಿಸಲು ಕನ್ನಡ ಪಠ್ಯ
        </label>
        <textarea
          id="regional-analysis-text"
          className="form-textarea kannada-text"
          value={inputText}
          onChange={(event) => updateInput(event.target.value)}
          disabled={loading}
          placeholder="ಕನ್ನಡ ಪಠ್ಯವನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ, ಅಂಟಿಸಿ ಅಥವಾ OCR ಪಠ್ಯವನ್ನು ಬಳಸಿ..."
          aria-invalid={Boolean(inputError)}
          aria-describedby={inputError ? "regional-input-error" : undefined}
          rows={5}
        />
        {inputError && (
          <p id="regional-input-error" className="regional-error" role="alert">
            {inputError}
          </p>
        )}

        <div className="regional-submit-row">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? <Loader2 className="regional-spinner" size={16} /> : <Sparkles size={16} />}
            <span>
              {loading
                ? "ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ..."
                : "ಪ್ರಾದೇಶಿಕತೆ ವಿಶ್ಲೇಷಿಸಿ (Analyze Dialect)"}
            </span>
          </button>
        </div>
      </form>

      {requestError && (
        <div className="regional-error regional-request-error" role="alert">
          {requestError}
        </div>
      )}

      {analysisResult && (
        <section className="regional-results" aria-live="polite">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <span className="badge badge-primary">
              Language: {analysisResult.detected_language || "Unavailable"}
            </span>
            <span className="badge badge-primary">
              Identified variety:{" "}
              {identifiedVariety === "unknown"
                ? "Unknown"
                : REGION_LABELS[identifiedVariety] || identifiedVariety || "Unavailable"}
            </span>
            <span className="badge badge-gold">
              Confidence: {analysisResult.confidence || "Unavailable"}
            </span>
          </div>

          <div className="regional-explanation">
            <h4>ವಿಶ್ಲೇಷಣೆಯ ವಿವರಣೆ (Explanation)</h4>
            <p>{analysisResult.explanation || "Explanation unavailable."}</p>
          </div>

          <div className="regional-candidate-section">
            <h4>ಪರಿಗಣಿಸಲಾದ ಪ್ರದೇಶಗಳು (Candidate regions)</h4>
            {candidateRegions.length ? (
              <div className="regional-candidate-list">
                {candidateRegions.map(({ id, label, evidence }) => (
                  <div className="regional-candidate" key={id}>
                    <span className={`region-badge-pill ${getRegionBadgeClass(label)}`}>
                      {label}
                    </span>
                    <span className="regional-candidate-counts">
                      {evidence.verified_expression_count || 0} verified ·{" "}
                      {evidence.unverified_expression_count || 0} unverified ·{" "}
                      {evidence.shared_expression_count || 0} shared
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="regional-no-candidates">
                No candidate region is supported by matched expressions.
              </p>
            )}
          </div>

          <div className="regional-expression-section">
            <h4>
              ಗುರುತಿಸಲಾದ ಪದಪ್ರಯೋಗಗಳು (Matched expressions)
            </h4>
            {matchedExpressions.length ? (
              matchedExpressions.map((expression, index) => (
                <article
                  className="expression-card regional-match-card"
                  key={`${expression.expression}-${index}`}
                >
                  <div className="expression-header">
                    <div className="regional-expression-title">
                      <span className="expression-word regional-original-expression kannada-text">
                        {expression.original_text || expression.expression}
                      </span>
                      {expression.dataset_type && (
                        <span className="regional-dataset-type">
                          {DATASET_TYPE_LABELS[expression.dataset_type] || expression.dataset_type}
                        </span>
                      )}
                      {expression.region && (
                        <span className="region-badge-pill regional-variety-pill">
                          {REGION_LABELS[expression.region] || expression.region}
                        </span>
                      )}
                    </div>
                    <div className="regional-expression-actions">
                      <VerificationBadge expression={expression} />
                      <button
                        type="button"
                        onClick={() => handleCopyExpression(expression, index)}
                        className="btn-icon-only btn-secondary"
                        title="Copy expression details"
                        aria-label="Copy expression details"
                      >
                        {copiedIndex === index ? (
                          <Check size={14} color="#1B8354" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="regional-expression-details">
                    <div className="regional-detail-box regional-standard">
                      <span>Standard Kannada</span>
                      <strong>{expression.standard_kannada || "Not available"}</strong>
                      {expression.standard_kannada_source && (
                        <small>Source: {expression.standard_kannada_source}</small>
                      )}
                    </div>
                    <div className="regional-detail-box regional-english">
                      <span>English meaning</span>
                      <strong>{expression.english_meaning || "Not available"}</strong>
                      {expression.english_meaning_source && (
                        <small>Source: {expression.english_meaning_source}</small>
                      )}
                    </div>
                  </div>

                  {expression.candidate_regions?.length > 0 && (
                    <div className="regional-expression-candidates">
                      <span>Candidate regions:</span>
                      {expression.candidate_regions.map((region) => (
                        <span className="badge badge-secondary" key={region}>
                          {REGION_LABELS[region] || region}
                        </span>
                      ))}
                    </div>
                  )}
                  {(expression.source || expression.locality || expression.source_page != null) && (
                    <section className="regional-source-card" aria-label="Source information">
                      <BookOpen className="regional-source-icon" size={20} aria-hidden="true" />
                      <div className="regional-source-content">
                        <span className="regional-source-heading">Source information</span>
                        <strong className="regional-source-title">
                          {expression.source || "Source not available"}
                        </strong>
                        {expression.source_page != null && (
                          <span className="regional-source-page">
                            Page {expression.source_page}
                          </span>
                        )}
                        {expression.locality && (
                          <div className="regional-source-locality">
                            <span>Locality / source-level attribution</span>
                            <p>{expression.locality}</p>
                          </div>
                        )}
                      </div>
                    </section>
                  )}
                  {expression.occurrences > 1 && (
                    <p className="regional-occurrences">
                      Matched {expression.occurrences} times
                    </p>
                  )}
                </article>
              ))
            ) : (
              <p className="regional-no-candidates">
                No dataset expressions matched this text.
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
