import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  Languages,
  Sparkles,
  MessageSquareText,
  Compass,
  BookOpen,
  Upload,
  ArrowRight,
  FileCheck,
  Clock,
  CheckCircle2,
  Activity
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useDocument, SAMPLE_DOCUMENTS } from "../context/DocumentContext";

export default function Dashboard() {
  const {
    recentDocuments,
    loadSampleDocument
  } = useDocument();

  const navigate = useNavigate();

  const handleUploadClick = () => {
    navigate("/document");
  };

  const handleLoadSample = (id) => {
    loadSampleDocument(id);
    navigate("/document");
  };

  const statCards = [
    {
      title: "Total Documents Processed",
      value: "28",
      change: "+12% this week",
      icon: FileText,
      color: "var(--color-primary)",
      bgColor: "var(--color-primary-soft)"
    },
    {
      title: "Kannada OCR Accuracy",
      value: "99.2%",
      change: "Unicode standard",
      icon: CheckCircle2,
      color: "#1B8354",
      bgColor: "#E8F7EE"
    },
    {
      title: "Dialects Analyzed",
      value: "3 Regions",
      change: "Coastal, North, Mysuru",
      icon: Compass,
      color: "#8C6500",
      bgColor: "var(--color-gold-light)"
    },
    {
      title: "Characters Extracted",
      value: "42,850",
      change: "High throughput",
      icon: Activity,
      color: "#0D6EFD",
      bgColor: "#EAF2FF"
    }
  ];

  const quickFeatures = [
    {
      to: "/document",
      title: "Document OCR Workspace",
      titleKn: "ದಾಖಲೆ OCR ಕಾರ್ಯಕ್ಷೇತ್ರ",
      desc: "Upload Kannada PDFs or images, extract Unicode text, and edit in real time.",
      icon: FileText,
      badge: "Core OCR"
    },
    {
      to: "/translation",
      title: "Bidirectional Translation",
      titleKn: "ಕನ್ನಡ-ಇಂಗ್ಲಿಷ್ ಅನುವಾದ",
      desc: "Translate between Kannada and English with instant audio speech playback.",
      icon: Languages,
      badge: "Contextual"
    },
    {
      to: "/summary",
      title: "Smart AI Summary",
      titleKn: "ಬುದ್ಧಿವಂತ ದಾಖಲೆ ಸಾರಾಂಶ",
      desc: "Extract key deadlines, organizations, amounts, and executive takeaways.",
      icon: Sparkles,
      badge: "Structured"
    },
    {
      to: "/chatbot",
      title: "Document AI Chatbot",
      titleKn: "ದಾಖಲೆ ಆಧಾರಿತ ಸಂವಾದಿ",
      desc: "Ask contextual questions directly from the document's extracted text.",
      icon: MessageSquareText,
      badge: "Text AI"
    },
    {
      to: "/regional-kannada",
      title: "Regional Kannada Intelligence",
      titleKn: "ಪ್ರಾದೇಶಿಕ ಕನ್ನಡ ವಿಶ್ಲೇಷಣೆ",
      desc: "Detect North Karnataka, Coastal, and Mysuru colloquialisms with confidence scores.",
      icon: Compass,
      badge: "Novelty"
    },
    {
      to: "/vocabulary",
      title: "Vocabulary Explorer",
      titleKn: "ಕನ್ನಡ ಪದಕೋಶ ಶೋಧನೆ",
      desc: "Explore cultural terms, meanings, usage examples, and pronunciation notes.",
      icon: BookOpen,
      badge: "Glossary"
    }
  ];

  const recentActivity = [
    {
      action: "OCR Text Extraction Completed",
      actionKn: "ಕೃಷಿ ಇಲಾಖೆ ಸುತ್ತೋಲೆ ಪಠ್ಯ ಹೊರತೆಗೆಯಲಾಗಿದೆ",
      time: "10 minutes ago"
    },
    {
      action: "Smart Summary Generated",
      actionKn: "೬ ಪ್ರಮುಖ ದಿನಾಂಕಗಳು ಮತ್ತು ₹೨೫೦ ಕೋಟಿ ಅನುದಾನ ಗುರುತಿಸಲಾಗಿದೆ",
      time: "25 minutes ago"
    },
    {
      action: "Regional Dialect Analysis",
      actionKn: "ಉತ್ತರ ಕರ್ನಾಟಕ ನುಡಿಗಟ್ಟು 'ಬಿದ್ದೈತಿ' ವಿಶ್ಲೇಷಿಸಲಾಗಿದೆ (94% Possible Region)",
      time: "1 hour ago"
    },
    {
      action: "Speech Playback Rendered",
      actionKn: "ಅನುವಾದಿತ ಪಠ್ಯದ ಧ್ವನಿ ಆಲಿಸಲಾಗಿದೆ",
      time: "2 hours ago"
    }
  ];

  return (
    <DashboardLayout
      title="Dashboard"
      kannadaTitle="ಡ್ಯಾಶ್‌ಬೋರ್ಡ್"
      subtitle="Welcome to Lipi Lens Kannada Document Intelligence Platform"
    >
      {/* Welcome & Upload Hero Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #B4232F 0%, #8E1B25 100%)",
          borderRadius: "var(--radius-xl)",
          padding: "32px 36px",
          color: "#FFFFFF",
          marginBottom: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 10px 30px rgba(180, 35, 47, 0.25)",
          flexWrap: "wrap",
          gap: 20
        }}
      >
        <div style={{ maxWidth: 640 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", background: "rgba(255,255,255,0.18)", borderRadius: 99, fontSize: 12, fontWeight: 600, marginBottom: 12 }}>
            <Sparkles size={14} color="var(--color-gold)" />
            <span>Modalapada 2.0 • Kannada AI Hackathon</span>
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#FFFFFF", marginBottom: 8 }} className="kannada-text">
            ಸುಸ್ವಾಗತ! ನಿಮ್ಮ ಕನ್ನಡ ದಾಖಲೆಗಳನ್ನು ಸುಲಭವಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ
          </h2>
          <p style={{ fontSize: 14, color: "#FDECEE", lineHeight: 1.6 }}>
            Upload government circulars, legal deeds, or literary texts to extract Unicode Kannada, analyze regional dialects, or generate structured executive summaries.
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            onClick={handleUploadClick}
            className="btn btn-gold btn-lg"
            style={{ boxShadow: "0 4px 14px rgba(0,0,0,0.15)" }}
          >
            <Upload size={18} />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="stat-card">
              <div
                className="stat-card-icon"
                style={{ backgroundColor: stat.bgColor, color: stat.color }}
              >
                <Icon size={24} />
              </div>
              <div className="stat-card-info">
                <h3>{stat.value}</h3>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-main)" }}>
                  {stat.title}
                </div>
                <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
                  {stat.change}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Recent Documents & Activity */}
      <div className="dashboard-main-grid">
        {/* Recent Documents Table */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <FileCheck size={18} style={{ color: "var(--color-primary)" }} />
              <span>ಇತ್ತೀಚಿನ ದಾಖಲೆಗಳು (Recent Documents)</span>
            </div>
            <Link to="/document" className="btn btn-secondary btn-sm">
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {recentDocuments.map((doc) => (
              <div
                key={doc.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 14px",
                  borderRadius: 10,
                  backgroundColor: "#FAF6EF",
                  border: "1px solid var(--color-border-light)",
                  transition: "background 0.2s"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    className="feature-icon-box"
                    style={{ width: 36, height: 36, backgroundColor: "#FFF", color: "var(--color-primary)", borderRadius: 8 }}
                  >
                    <FileText size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-main)" }} className="kannada-text">
                      {doc.name}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>
                      {doc.size} • {doc.date}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="badge badge-success" style={{ fontSize: 11 }}>
                    {doc.status}
                  </span>
                  <button
                    onClick={() => handleLoadSample("sample-circular")}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: "4px 8px", fontSize: 11 }}
                  >
                    Open
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Demo Document Loader Strip */}
          <div style={{ marginTop: 20, paddingTop: 14, borderTop: "1px dashed var(--color-border)" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-secondary)" }}>
              ತ್ವರಿತ ಮಾದರಿ ದಾಖಲೆ ಪರೀಕ್ಷಿಸಿ (Instant Test Samples):
            </span>
            <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
              {SAMPLE_DOCUMENTS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleLoadSample(s.id)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: 11 }}
                >
                  <FileText size={12} color="var(--color-primary)" />
                  <span>{s.title.split("(")[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Clock size={18} style={{ color: "var(--color-gold)" }} />
              <span>ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ (Recent Activity)</span>
            </div>
            <span className="badge badge-gold" style={{ fontSize: 11 }}>Live</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {recentActivity.map((act, index) => (
              <div key={index} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "var(--color-primary)",
                    marginTop: 6,
                    flexShrink: 0
                  }}
                />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-main)" }}>
                    {act.action}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }} className="kannada-text">
                    {act.actionKn}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 2 }}>
                    {act.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Access Feature Cards */}
      <div style={{ marginTop: 8 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "var(--color-text-main)" }}>
          ತ್ವರಿತ ಪ್ರವೇಶ ಪರಿಕರಗಳು (Quick Access Features)
        </h3>
        <div className="features-grid">
          {quickFeatures.map((qf, i) => {
            const Icon = qf.icon;
            return (
              <Link key={i} to={qf.to} className="feature-card" style={{ padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div className="feature-icon-box" style={{ width: 42, height: 42 }}>
                    <Icon size={20} />
                  </div>
                  <span className="badge badge-primary" style={{ fontSize: 10 }}>
                    {qf.badge}
                  </span>
                </div>
                <div>
                  <h4 style={{ fontSize: 16, fontWeight: 700, color: "var(--color-text-main)" }}>
                    {qf.title}
                  </h4>
                  <div style={{ fontSize: 12, color: "var(--color-primary)", fontWeight: 600 }} className="kannada-text">
                    {qf.titleKn}
                  </div>
                </div>
                <p style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                  {qf.desc}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
