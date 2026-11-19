import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Document from "./pages/Document";
import Translation from "./pages/Translation";
import SummaryPage from "./pages/SummaryPage";
import Chatbot from "./pages/Chatbot";
import RegionalKannada from "./pages/RegionalKannada";
import Vocabulary from "./pages/Vocabulary";

import { DocumentProvider, useDocument } from "./context/DocumentContext";

import "./styles/global.css";
import "./styles/components.css";

function GlobalToast() {
  const { toast } = useDocument();
  if (!toast) return null;

  return (
    <div className="toast-container">
      <div className={`toast toast-${toast.type || "info"}`}>
        <span>{toast.message}</span>
      </div>
    </div>
  );
}

function App() {
  return (
    <DocumentProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/document" element={<Document />} />
          <Route path="/translation" element={<Translation />} />
          <Route path="/summary" element={<SummaryPage />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/regional-kannada" element={<RegionalKannada />} />
          <Route path="/vocabulary" element={<Vocabulary />} />
          {/* Fallback to home */}
          <Route path="*" element={<Home />} />
        </Routes>
        <GlobalToast />
      </BrowserRouter>
    </DocumentProvider>
  );
}

export default App;
