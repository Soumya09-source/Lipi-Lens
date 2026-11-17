import React, { useState } from "react";
import {
  FileText,
  Info,
  CheckCircle,
  FolderOpen
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import ImageUpload from "../components/ImageUpload";
import ExtractedText from "../components/ExtractedText";
import { useDocument } from "../context/DocumentContext";

export default function DocumentPage() {
  const { documentName, extractedText } = useDocument();
  const [isExtracting, setIsExtracting] = useState(false);

  return (
    <DashboardLayout
      title="Document Workspace"
      kannadaTitle="ದಾಖಲೆ ಕಾರ್ಯಕ್ಷೇತ್ರ"
      subtitle="Upload Kannada documents, extract OCR Unicode text, and apply AI intelligence"
    >
      {/* Help Banner */}
      <div className="context-document-bar">
        <div className="context-document-info">
          <Info size={16} color="var(--color-primary)" />
          <span>
            {extractedText
              ? `ಪ್ರಸ್ತುತ ದಾಖಲೆ: ${documentName || "ಕನ್ನಡ ದಾಖಲೆ"} • ${extractedText.length} ಅಕ್ಷರಗಳು ಹೊರತೆಗೆಯಲಾಗಿದೆ`
              : "ಕನ್ನಡ ದಾಖಲೆ (JPG, PNG, PDF) ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಅಥವಾ ತ್ವರಿತ ಪರೀಕ್ಷೆಗೆ ಕೆಳಗಿನ ಮಾದರಿ ದಾಖಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ."}
          </span>
        </div>
        <div className="context-document-actions">
          <span className="badge badge-gold">Unicode Kannada OCR</span>
        </div>
      </div>

      {/* Main Workspace Grid: Left = Upload / Preview, Right = OCR Textarea & Actions */}
      <div className="workspace-grid">
        {/* Left Card: Document Upload & Preview */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <FolderOpen size={18} style={{ color: "var(--color-primary)" }} />
              <span>ದಾಖಲೆ ಅಪ್‌ಲೋಡ್ (Document Upload)</span>
            </div>
            <span className="badge badge-primary">JPG, PNG, PDF</span>
          </div>

          <ImageUpload
            isExtracting={isExtracting}
            setIsExtracting={setIsExtracting}
          />
        </div>

        {/* Right Card: Extracted Text Editor & Actions */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <FileText size={18} style={{ color: "var(--color-primary)" }} />
              <span>OCR ಫಲಿತಾಂಶ (Extracted Kannada Text)</span>
            </div>
            {extractedText && (
              <span className="badge badge-success">
                <CheckCircle size={12} />
                <span>Text Ready</span>
              </span>
            )}
          </div>

          <ExtractedText isExtracting={isExtracting} />
        </div>
      </div>
    </DashboardLayout>
  );
}
