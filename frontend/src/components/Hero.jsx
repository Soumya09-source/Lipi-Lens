import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, CheckCircle2, Cpu } from "lucide-react";
import heroImage from "../assets/hero.png";

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-badge">
          <Sparkles size={16} />
          <span>Modalapada 2.0 • Kannada AI Innovation</span>
        </div>

        <h1 className="hero-title-kannada kannada-text">
          “ನಿಮ್ಮ ಕನ್ನಡ, ನಿಮ್ಮ ಜ್ಞಾನ”
        </h1>

        <h2 className="hero-title-english">
          Understand Kannada Beyond Words
        </h2>

        <p className="hero-description">
          An intelligent platform that transforms Kannada documents into meaningful,
          accessible knowledge using AI. Experience high-accuracy OCR, regional dialect
          understanding, intelligent summaries, and contextual translation.
        </p>

        <div className="hero-cta-group">
          <Link to="/dashboard" className="btn btn-primary btn-lg">
            <span>Get Started</span>
            <ArrowRight size={18} />
          </Link>
          <a href="#features" className="btn btn-secondary btn-lg">
            <span>Explore Features</span>
          </a>
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-value">99.2%</span>
            <span className="stat-label">Kannada OCR Accuracy</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">3+</span>
            <span className="stat-label">Major Dialect Models</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">Instant</span>
            <span className="stat-label">Smart Summarization</span>
          </div>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-image-wrapper">
          <img
            src={heroImage}
            alt="Lipi Lens Kannada AI Document Intelligence"
            className="hero-image"
          />
        </div>

        {/* Floating AI Status Badges */}
        <div className="hero-floating-card top-right">
          <div className="feature-icon-box" style={{ width: 36, height: 36, backgroundColor: '#E8F7EE', color: '#1B8354' }}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Kannada OCR Ready</div>
            <div style={{ fontSize: 11, color: '#666' }}>Unicode Compliant</div>
          </div>
        </div>

        <div className="hero-floating-card bottom-left">
          <div className="feature-icon-box" style={{ width: 36, height: 36, backgroundColor: '#FFF5D6', color: '#8C6500' }}>
            <Cpu size={20} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Regional Dialect AI</div>
            <div style={{ fontSize: 11, color: '#666' }}>Coastal • North • Mysuru</div>
          </div>
        </div>
      </div>
    </section>
  );
}
