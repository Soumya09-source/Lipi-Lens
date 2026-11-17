import React from "react";
import DashboardLayout from "../components/DashboardLayout";
import RegionalAnalysis from "../components/RegionalAnalysis";
import { Compass } from "lucide-react";

export default function RegionalKannadaPage() {
  return (
    <DashboardLayout
      title="Regional Kannada Intelligence"
      kannadaTitle="ಪ್ರಾದೇಶಿಕ ಕನ್ನಡ ಭಾಷಾ ಬುದ್ಧಿವಂತಿಕೆ"
      subtitle="Novelty AI engine mapping regional dialects (North, Coastal, Mysuru) to standard Kannada"
    >
      <div className="context-document-bar">
        <div className="context-document-info">
          <Compass size={16} color="var(--color-primary)" />
          <span>
            ಕರಾವಳಿ (Coastal), ಉತ್ತರ ಕರ್ನಾಟಕ (North Karnataka), ಮತ್ತು ಮೈಸೂರು ಪ್ರಾಂತ್ಯಗಳ ವಿಶಿಷ್ಟ ಪದಗಳನ್ನು ಗುರುತಿಸುವ ನವೀನ ತಂತ್ರಜ್ಞಾನ.
          </span>
        </div>
        <div className="context-document-actions">
          <span className="badge badge-primary">Novelty Engine</span>
        </div>
      </div>

      <RegionalAnalysis />
    </DashboardLayout>
  );
}
