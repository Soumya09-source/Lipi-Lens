import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  FileText,
  Sparkles,
  Upload
} from "lucide-react";
import Sidebar from "./Sidebar";
import { useDocument } from "../context/DocumentContext";

export default function DashboardLayout({ children, title, subtitle, kannadaTitle }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { documentName, extractedText, loadSampleDocument } = useDocument();

  return (
    <div className="dashboard-layout">
      {/* Responsive Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="btn-icon-only btn-secondary mobile-menu-btn"
              aria-label="Toggle menu"
            >
              <Menu size={20} />
            </button>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: "var(--color-text-main)" }}>
                  {title}
                </span>
                {kannadaTitle && (
                  <span className="badge badge-primary kannada-text" style={{ fontSize: 11 }}>
                    {kannadaTitle}
                  </span>
                )}
              </div>
              {subtitle && (
                <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
                  {subtitle}
                </span>
              )}
            </div>
          </div>

          <div className="topbar-right">
            {/* Quick Document Status / Sample Loader */}
            {extractedText ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="badge badge-success" style={{ fontSize: 11 }}>
                  ● Document Loaded
                </span>
                <Link to="/document" className="btn btn-secondary btn-sm" style={{ fontSize: 12 }}>
                  <FileText size={13} />
                  <span>{documentName ? documentName.slice(0, 18) + "..." : "Active File"}</span>
                </Link>
              </div>
            ) : (
              <button
                onClick={() => loadSampleDocument("sample-circular")}
                className="btn btn-gold btn-sm"
                title="Load sample document for demo"
                style={{ fontSize: 12 }}
              >
                <Sparkles size={13} />
                <span>Quick Demo Doc</span>
              </button>
            )}

            <Link to="/document" className="btn btn-primary btn-sm" style={{ fontSize: 12 }}>
              <Upload size={14} />
              <span>Upload</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-wrapper">{children}</div>
      </div>
    </div>
  );
}
