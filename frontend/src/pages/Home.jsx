import React from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Languages,
  Sparkles,
  Compass,
  ArrowRight,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";

export default function Home() {
  const featureCards = [
    {
      icon: FileText,
      title: "Kannada OCR",
      titleKn: "ಕನ್ನಡ ಅಕ್ಷರ ಗುರುತಿಸುವಿಕೆ",
      desc: "State-of-the-art optical character recognition tailored for complex Kannada script ligatures, vowel signs, and historical fonts.",
      link: "/document",
      badge: "99.2% Accuracy"
    },
    {
      icon: Languages,
      title: "Smart Translation",
      titleKn: "ದ್ವಿಮುಖ ಕನ್ನಡ ಅನುವಾದ",
      desc: "Bi-directional Kannada to English and English to Kannada translation preserving grammatical nuances and administrative context.",
      link: "/translation",
      badge: "Contextual AI"
    },
    {
      icon: Sparkles,
      title: "Document Intelligence",
      titleKn: "ಬುದ್ಧಿವಂತ ದಾಖಲೆ ಸಾರಾಂಶ",
      desc: "Extract key entities, dates, deadlines, financial amounts, and structured action items from lengthy government orders and circulars.",
      link: "/summary",
      badge: "Instant Summary"
    },
    {
      icon: Compass,
      title: "Regional Kannada Understanding",
      titleKn: "ಪ್ರಾದೇಶಿಕ ಉಪಭಾಷಾ ವಿಶ್ಲೇಷಣೆ",
      desc: "Unique AI detection for Coastal (ಕುಡ್ಲ/ಕರಾವಳಿ), North Karnataka (ಹುಬ್ಬಳ್ಳಿ/ಧಾರವಾಡ), and Mysuru regional dialects with standard equivalents.",
      link: "/regional-kannada",
      badge: "Novelty Feature"
    }
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-cream)" }}>
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <section id="features" className="landing-section">
        <div className="section-header">
          <span className="section-tag">Core Capabilities</span>
          <h2 className="section-title">ಕನ್ನಡಕ್ಕಾಗಿ ವಿಶೇಷವಾಗಿ ರೂಪಿಸಲಾದ AI ಸಾಮರ್ಥ್ಯಗಳು</h2>
          <p className="section-subtitle">
            Engineered specifically for the nuances, compound letters, and regional expressions of the Kannada language.
          </p>
        </div>

        <div className="features-grid">
          {featureCards.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="feature-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div className="feature-icon-box">
                    <Icon size={24} />
                  </div>
                  <span className="badge badge-gold" style={{ fontSize: 11 }}>
                    {feat.badge}
                  </span>
                </div>

                <div>
                  <h3 className="feature-title">{feat.title}</h3>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-primary)", marginTop: 2 }} className="kannada-text">
                    {feat.titleKn}
                  </div>
                </div>

                <p className="feature-desc">{feat.desc}</p>

                <Link
                  to={feat.link}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--color-primary)",
                    marginTop: "auto"
                  }}
                >
                  <span>Explore Feature</span>
                  <ChevronRight size={15} />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Hackathon Showcase / About Section */}
      <section id="about" style={{ backgroundColor: "#FFFFFF", padding: "80px 32px", borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 50, alignItems: "center" }}>
          <div>
            <span className="badge badge-primary" style={{ marginBottom: 12 }}>
              Modalapada 2.0 • Kannada AI Hackathon
            </span>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: "var(--color-text-main)", marginBottom: 16 }}>
              Bridging Heritage Language with Next-Gen Intelligence
            </h2>
            <p style={{ fontSize: 15, color: "var(--color-text-secondary)", lineHeight: 1.7, marginBottom: 20 }}>
              Kannada administrative circulars, judicial orders, and cultural manuscripts often feature dense phrasing, obsolete legal terms, or localized dialects that general translation engines fail to interpret correctly.
            </p>
            <p style={{ fontSize: 15, color: "var(--color-text-secondary)", lineHeight: 1.7, marginBottom: 24 }}>
              <strong>Lipi Lens</strong> solves this through specialized document models: instant OCR, dialect normalization (North Karnataka, Coastal, Mysuru), structured key-value extraction, and plain-language simplification.
            </p>

            <div style={{ display: "flex", gap: 14 }}>
              <Link to="/document" className="btn btn-primary">
                <span>Try Workspace Now</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/vocabulary" className="btn btn-secondary">
                <span>Explore Vocabulary</span>
              </Link>
            </div>
          </div>

          <div style={{ background: "linear-gradient(135deg, #FFF9F0 0%, #FAF0F1 100%)", padding: 32, borderRadius: 20, border: "1.5px solid var(--color-border)" }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--color-primary)", marginBottom: 16 }}>
              ಏಕೆ ಲಿಪಿ ಲೆನ್ಸ್? (Why Lipi Lens?)
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <CheckCircle2 size={20} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong style={{ fontSize: 14 }}>ಯುನಿಕೋಡ್ ಕಂಪ್ಲೈಯಂಟ್ ಕನ್ನಡ OCR:</strong>
                  <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
                    ವತ್ತಕ್ಷರಗಳು ಮತ್ತು ಸ್ವರ ಚಿಹ್ನೆಗಳನ್ನು ನಿಖರವಾಗಿ ಹೊರತೆಗೆಯುತ್ತದೆ.
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <CheckCircle2 size={20} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong style={{ fontSize: 14 }}>ಉಪಭಾಷಾ ಗುರುತಿಸುವಿಕೆ (Dialect Detection):</strong>
                  <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
                    ಕರಾವಳಿ, ಉತ್ತರ ಕರ್ನಾಟಕ, ಮೈಸೂರು ಭಾಗದ ವಿಶಿಷ್ಟ ಪದಗಳನ್ನು ಗುರುತಿಸಿ ಪ್ರಮಾಣಿತ ರೂಪ ನೀಡುತ್ತದೆ.
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <CheckCircle2 size={20} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong style={{ fontSize: 14 }}>ಸ್ಮಾರ್ಟ್ ಸಾರಾಂಶ & ದಿನಾಂಕ ಪಟ್ಟಿ:</strong>
                  <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
                    ಸರ್ಕಾರಿ ಸುತ್ತೋಲೆಗಳಲ್ಲಿನ ದಿನಾಂಕಗಳು, ಗಡುವು ಮತ್ತು ಅನುದಾನಗಳನ್ನು ಪ್ರತ್ಯೇಕಿಸಿ ನೀಡುತ್ತದೆ.
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <CheckCircle2 size={20} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong style={{ fontSize: 14 }}>AI ಸಂವಾದಿ ಚಾಟ್‌ಬಾಟ್:</strong>
                  <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
                    ದಾಖಲೆಯ ಪಠ್ಯದ ಆಧಾರದ ಮೇಲೆ ಕೇವಲ ಪಠ್ಯ ಮೂಲಕ ಸಂವಾದ ನಡೆಸಿ ನಿಖರ ಉತ್ತರ ಪಡೆಯಬಹುದು.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="brand-icon" style={{ width: 34, height: 34, fontSize: 16 }}>
                <span>ಲಿ</span>
              </div>
              <span className="brand-name" style={{ fontSize: 20 }}>Lipi Lens</span>
            </div>
            <p style={{ fontSize: 13, color: "#9E9388", lineHeight: 1.6 }}>
              An AI-powered Kannada document intelligence platform developed for Modalapada 2.0 Kannada AI Hackathon.
            </p>
            <div style={{ fontSize: 12, color: "var(--color-gold)", fontWeight: 600 }}>
              “ನಿಮ್ಮ ಕನ್ನಡ, ನಿಮ್ಮ ಜ್ಞಾನ”
            </div>
          </div>

          <div className="footer-col">
            <h4>Application Pages</h4>
            <ul className="footer-links">
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/document">Document Workspace</Link></li>
              <li><Link to="/translation">Translation</Link></li>
              <li><Link to="/summary">Smart Summary</Link></li>
              <li><Link to="/chatbot">AI Chatbot</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Intelligence Tools</h4>
            <ul className="footer-links">
              <li><Link to="/regional-kannada">Regional Kannada Intelligence</Link></li>
              <li><Link to="/vocabulary">Vocabulary Explorer</Link></li>
              <li><Link to="/document">Simplify Kannada</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2024-2026 Lipi Lens. All rights reserved.</span>
          <span>Modalapada 2.0 Kannada AI Hackathon Project</span>
        </div>
      </footer>
    </div>
  );
}
