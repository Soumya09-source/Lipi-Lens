import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Languages,
  Sparkles,
  MessageSquareText,
  Compass,
  BookOpen,
  X,
  FileSearch
} from "lucide-react";
import { useDocument } from "../context/DocumentContext";

export default function Sidebar({ isOpen, onClose }) {
  const { documentName, extractedText } = useDocument();

  const navItems = [
    {
      to: "/dashboard",
      label: "Dashboard",
      labelKn: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      icon: LayoutDashboard
    },
    {
      to: "/document",
      label: "My Documents",
      labelKn: "ದಾಖಲೆ ಕಾರ್ಯಕ್ಷೇತ್ರ",
      icon: FileText
    },
    {
      to: "/translation",
      label: "Translation",
      labelKn: "ಕನ್ನಡ ಅನುವಾದ",
      icon: Languages
    },
    {
      to: "/summary",
      label: "Smart Summary",
      labelKn: "ಬುದ್ಧಿವಂತ ಸಾರಾಂಶ",
      icon: Sparkles
    },
    {
      to: "/chatbot",
      label: "AI Chatbot",
      labelKn: "AI ಸಂವಾದಿ",
      icon: MessageSquareText
    },
    {
      to: "/regional-kannada",
      label: "Regional Kannada",
      labelKn: "ಪ್ರಾದೇಶಿಕ ಕನ್ನಡ",
      icon: Compass
    },
    {
      to: "/vocabulary",
      label: "Vocabulary Explorer",
      labelKn: "ಪದಕೋಶ",
      icon: BookOpen
    }
  ];

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div>
        <div className="sidebar-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="brand-icon" style={{ width: 36, height: 36, fontSize: 17 }}>
              <span>ಲಿ</span>
            </div>
            <div className="brand-text">
              <span className="brand-name" style={{ fontSize: 18 }}>Lipi Lens</span>
              <span className="brand-tagline" style={{ fontSize: 9 }}>Kannada AI Platform</span>
            </div>
          </Link>
          {onClose && (
            <button
              onClick={onClose}
              className="btn-icon-only mobile-menu-btn"
              style={{ display: "none" }}
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Active Document Status Mini-Card */}
        {extractedText ? (
          <div style={{ margin: "14px 12px 6px", padding: "10px 12px", background: "#FAF0F1", borderRadius: 10, border: "1px solid #F5D3D6" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: "var(--color-primary)" }}>
              <FileSearch size={13} />
              <span>ACTIVE DOCUMENT</span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-main)", marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {documentName || "ಕನ್ನಡ ದಾಖಲೆ (Active)"}
            </div>
            <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 2 }}>
              {extractedText.length} characters loaded
            </div>
          </div>
        ) : (
          <div style={{ margin: "14px 12px 6px", padding: "10px 12px", background: "#FAF5EB", borderRadius: 10, border: "1px dashed var(--color-border)" }}>
            <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>
              No document loaded yet
            </div>
            <Link to="/document" style={{ fontSize: 12, fontWeight: 600, color: "var(--color-primary)", display: "inline-block", marginTop: 4 }}>
              + Upload Kannada Document
            </Link>
          </div>
        )}

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                onClick={onClose}
              >
                <Icon size={18} />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span>{item.label}</span>
                  <span style={{ fontSize: 10, opacity: 0.8 }} className="kannada-text">
                    {item.labelKn}
                  </span>
                </div>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">LL</div>
          <div className="user-info">
            <span className="user-name">Modalapada 2.0</span>
            <span className="user-role">Kannada AI Hackathon</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
