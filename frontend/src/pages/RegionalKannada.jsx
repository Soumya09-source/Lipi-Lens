import React from "react";
import DashboardLayout from "../components/DashboardLayout";
import RegionalAnalysis from "../components/RegionalAnalysis";
import { Compass } from "lucide-react";

export default function RegionalKannadaPage() {
  return (
    <DashboardLayout
      title="Regional Kannada Intelligence"
      kannadaTitle="ಪ್ರಾದೇಶಿಕ ಕನ್ನಡ ಭಾಷಾ ಬುದ್ಧಿವಂತಿಕೆ"
      subtitle="Evidence-based analysis of regional Kannada expressions without guessing when evidence is limited"
    >
      <div className="context-document-bar">
        <div className="context-document-info">
          <Compass size={16} color="var(--color-primary)" />
          <span>
            ಕರಾವಳಿ (Coastal), ಉತ್ತರ ಕರ್ನಾಟಕ (North Karnataka), ಮತ್ತು ಮೈಸೂರು ಪ್ರಾಂತ್ಯಗಳ ಪದಪ್ರಯೋಗಗಳನ್ನು ಸಾಕ್ಷ್ಯ ಆಧಾರದಲ್ಲಿ ವಿಶ್ಲೇಷಿಸಿ, ಸಾಕಷ್ಟು ಸಾಕ್ಷ್ಯವಿಲ್ಲದಿದ್ದರೆ ಪ್ರದೇಶವನ್ನು ಊಹಿಸುವುದಿಲ್ಲ.
          </span>
        </div>
        <div className="context-document-actions">
          <span className="badge badge-primary">Regional Evidence</span>
        </div>
      </div>

      <RegionalAnalysis />
    </DashboardLayout>
  );
}
