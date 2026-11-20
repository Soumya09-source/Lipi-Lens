import React, { useState } from "react";
import { FileText } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import SummaryComponent from "../components/Summary";
import { useDocument } from "../context/DocumentContext";
import { generateSummary } from "../services/api";

export default function SummaryPage() {
  const {
    setSummary,
    extractedText,
    translatedText,
    documentName,
    showToast
  } = useDocument();
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleGenerateSummary = async () => {
    if (!extractedText || !extractedText.trim()) {
      showToast("ದಯವಿಟ್ಟು ಮೊದಲು ಸಾರಾಂಶ ರಚಿಸಲು ದಾಖಲೆಯನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ", "warning");
      return;
    }

    setIsGenerating(true);
    setErrorMessage("");
    try {
      const response = await generateSummary(extractedText, translatedText || "");
      if (response.success && response.summary) {
        setSummary(response.summary);
        showToast("ದಾಖಲೆಯ ಬುದ್ಧಿವಂತ ಸಾರಾಂಶ ಯಶಸ್ವಿಯಾಗಿ ರಚಿತವಾಗಿದೆ!", "success");
      } else {
        const message = response.error || "Summary generation failed.";
        setErrorMessage(message);
        showToast(message, "error");
      }
    } catch (err) {
      console.error(err);
      const message = err.message || "The summary service is unavailable. Please try again.";
      setErrorMessage(message);
      showToast(message, "error");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <DashboardLayout
      title="Smart Summary"
      kannadaTitle="ಬುದ್ಧಿವಂತ ಸಾರಾಂಶ"
      subtitle="AI-driven structured intelligence: deadlines, amounts, organizations, and key instructions"
    >
      {/* Document info banner */}
      <div className="context-document-bar">
        <div className="context-document-info">
          <FileText size={16} color="var(--color-primary)" />
          <span>
            {documentName
              ? `ದಾಖಲೆ: ${documentName}`
              : "ಕನ್ನಡ ದಾಖಲೆ (Active Context)"}
          </span>
        </div>
        <div className="context-document-actions">
          <span className="badge badge-primary">
            {extractedText ? `${extractedText.length} chars` : "No Text"}
          </span>
        </div>
      </div>

      {errorMessage && (
        <div
          role="alert"
          aria-live="assertive"
          className="card"
          style={{
            border: "1px solid var(--color-danger)",
            color: "var(--color-danger)",
            marginBottom: 20,
            padding: "14px 18px",
          }}
        >
          {errorMessage}
        </div>
      )}

      <SummaryComponent
        isGenerating={isGenerating}
        onGenerate={handleGenerateSummary}
      />
    </DashboardLayout>
  );
}
