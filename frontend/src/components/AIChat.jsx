import React, { useState, useRef, useEffect } from "react";
import { Send, Trash2, Bot, User, Sparkles } from "lucide-react";
import { useDocument } from "../context/DocumentContext";
import { askChat } from "../services/api";

export default function AIChat() {
  const { chatHistory, setChatHistory, extractedText, documentName, showToast } = useDocument();
  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    "ಈ ದಾಖಲೆಯ ಮುಖ್ಯ ಉದ್ದೇಶವೇನು?",
    "ಯಾವ ದಿನಾಂಕದೊಳಗೆ ಕ್ರಮ ಕೈಗೊಳ್ಳಬೇಕು?",
    "ಪರಿಹಾರ ಮೊತ್ತ ಅಥವಾ ಅನುದಾನ ಎಷ್ಟು?",
    "ಯಾವ ಸಂಸ್ಥೆ ಅಥವಾ ಅಧಿಕಾರಿಗಳು ಜವಾಬ್ದಾರರು?",
    "ಸಾಮಾನ್ಯ ನಾಗರಿಕರಿಗೆ ನೀಡಲಾದ ಸೂಚನೆಗಳೇನು?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, loading]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query || !query.trim() || loading) return;

    const userMessage = {
      id: "msg-" + Date.now(),
      role: "user",
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const newHistory = [...chatHistory, userMessage];
    setChatHistory(newHistory);
    setInputQuery("");
    setLoading(true);

    try {
      const response = await askChat(query, extractedText, newHistory);

      const botMessage = {
        id: "msg-" + (Date.now() + 1),
        role: "assistant",
        content: response.answer || "ಕ್ಷಮಿಸಿ, ಈ ಪ್ರಶ್ನೆಗೆ ದಾಖಲೆಯಲ್ಲಿ ನಿಖರ ಉತ್ತರ ಲಭ್ಯವಿಲ್ಲ.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isDemo: response.isDemo
      };

      setChatHistory((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setChatHistory((prev) => [
        ...prev,
        {
          id: "msg-" + (Date.now() + 1),
          role: "assistant",
          content: "ಕ್ಷಮಿಸಿ, ಸರ್ವರ್‌ನೊಂದಿಗೆ ಸಂವಹನ ನಡೆಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setChatHistory([
      {
        id: "initial-welcome",
        role: "assistant",
        content: "ನಮಸ್ಕಾರ! ನಾನು ಲಿಪಿ ಲೆನ್ಸ್ AI ಸಹಾಯಕ. ನೀವು ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ದಾಖಲೆಯ ಆಧಾರದ ಮೇಲೆ ಯಾವುದೇ ವಿವರಗಳನ್ನು ಕೇಳಿ.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
    showToast("ಸಂಭಾಷಣೆಯನ್ನು ತೆರವುಗೊಳಿಸಲಾಗಿದೆ", "info");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="feature-icon-box" style={{ width: 36, height: 36, backgroundColor: "var(--color-primary-soft)", color: "var(--color-primary)" }}>
            <Bot size={20} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text-main)" }}>
              Lipi Lens Document Chat Assistant
            </div>
            <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>
              {extractedText ? `ಆಧಾರಿತ ದಾಖಲೆ: ${documentName || "ಕನ್ನಡ ದಾಖಲೆ"}` : "ಗಮನಿಸಿ: ಇನ್ನೂ ದಾಖಲೆ ಅಪ್‌ಲೋಡ್ ಮಾಡಿಲ್ಲ"}
            </div>
          </div>
        </div>

        <button onClick={handleClearChat} className="btn btn-secondary btn-sm" title="Clear chat history">
          <Trash2 size={14} />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Messages Window */}
      <div className="chat-messages">
        {chatHistory.map((msg) => (
          <div key={msg.id} className={`chat-bubble-row ${msg.role}`}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                backgroundColor: msg.role === "user" ? "var(--color-primary)" : "#FAF0F1",
                color: msg.role === "user" ? "#FFF" : "var(--color-primary)"
              }}
            >
              {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <div className={`chat-bubble ${msg.role} kannada-text`}>
                <div style={{ whiteSpace: "pre-wrap" }}>{msg.content}</div>
                <div className="chat-time" style={{ color: msg.role === "user" ? "rgba(255,255,255,0.8)" : "#9E9182" }}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="chat-bubble-row assistant">
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: "#FAF0F1",
                color: "var(--color-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Bot size={16} />
            </div>
            <div className="chat-bubble assistant kannada-text" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Sparkles size={16} className="spinning" style={{ color: "var(--color-primary)" }} />
              <span>ದಾಖಲೆಯನ್ನು ವಿಶ್ಲೇಷಿಸಿ ಉತ್ತರಿಸಲಾಗುತ್ತಿದೆ...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      <div className="suggested-questions-row">
        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text-secondary)", alignSelf: "center" }}>
          ಸಲಹೆಗಳು:
        </span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            className="suggested-btn kannada-text"
            onClick={() => handleSendMessage(q)}
            disabled={loading}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Input Field (Strictly Text-based: NO microphone or voice input) */}
      <div className="chat-input-area">
        <input
          type="text"
          className="chat-input kannada-text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="ಕನ್ನಡದಲ್ಲಿ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ದಾಖಲೆಯ ಕುರಿತು ಪ್ರಶ್ನೆ ಕೇಳಿ..."
          disabled={loading}
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputQuery.trim() || loading}
          className="btn btn-primary"
          style={{ padding: "10px 18px" }}
        >
          <Send size={16} />
          <span>ಕಳುಹಿಸಿ</span>
        </button>
      </div>
    </div>
  );
}
