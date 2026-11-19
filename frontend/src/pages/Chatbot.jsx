import React from "react";
import DashboardLayout from "../components/DashboardLayout";
import AIChat from "../components/AIChat";
import { useDocument } from "../context/DocumentContext";
import { MessageSquareText } from "lucide-react";

export default function ChatbotPage() {
  const { documentName, extractedText } = useDocument();

  return (
    <DashboardLayout
      title="AI Chatbot"
      kannadaTitle="AI ಸಂವಾದಿ"
      subtitle="Context-aware conversation grounded in your uploaded Kannada document"
    >
      <div className="context-document-bar">
        <div className="context-document-info">
          <MessageSquareText size={16} color="var(--color-primary)" />
          <span>
            {extractedText
              ? `ಸಕ್ರಿಯ ದಾಖಲೆ: ${documentName || "ಕನ್ನಡ ದಾಖಲೆ"} • ಈ ದಾಖಲೆಯ ಆಧಾರದ ಮೇಲೆ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಲಾಗುತ್ತದೆ.`
              : "ಯಾವುದೇ ದಾಖಲೆ ಲೋಡ್ ಆಗಿಲ್ಲ. ಸಾಮಾನ್ಯ ಕನ್ನಡ ಸಹಾಯಕ ಮೋಡ್‌ನಲ್ಲಿದೆ."}
          </span>
        </div>
        <div className="context-document-actions">
          <span className="badge badge-gold">Text-Only Chat</span>
        </div>
      </div>

      <AIChat />
    </DashboardLayout>
  );
}
