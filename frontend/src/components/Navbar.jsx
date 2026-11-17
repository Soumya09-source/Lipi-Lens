import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        <div className="brand-icon">
          <span>ಲಿ</span>
        </div>
        <div className="brand-text">
          <span className="brand-name">Lipi Lens</span>
          <span className="brand-tagline">ಕನ್ನಡ AI Document Intelligence</span>
        </div>
      </Link>

      <nav className="navbar-links">
        <Link to="/" className="nav-link">Home</Link>
        <a href="#features" className="nav-link">Features</a>
        <a href="#about" className="nav-link">About</a>
        <Link to="/vocabulary" className="nav-link">Vocabulary</Link>
        <Link to="/regional-kannada" className="nav-link">Regional AI</Link>
      </nav>

      <div className="navbar-actions">
        <Link to="/document" className="btn btn-outline-primary btn-sm">
          Quick OCR
        </Link>
        <Link to="/dashboard" className="btn btn-primary btn-sm">
          <span>Get Started</span>
          <ArrowRight size={15} />
        </Link>
      </div>
    </header>
  );
}
