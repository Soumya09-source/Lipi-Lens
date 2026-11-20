import React, { useState, useRef, useEffect } from "react";
import { Send, Trash2, Bot, User, Sparkles } from "lucide-react";
import { useDocument } from "../context/DocumentContext";
import { askChat } from "../services/api";

export default function AIChat() {
  const { chatHistory, setChatHistory, extractedText, documentName, showToast } = useDocument();
  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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
    const query = (textToSend || inputQuery).trim();
    if (!query || loading) return;

    if (!extractedText?.trim()) {
      const message = "Upload a document before asking questions.";
      setErrorMessage(message);
      showToast(message, "warning");
      return;
    }

    const userMessage = {
      id: "msg-" + Date.now(),
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const newHistory = [...chatHistory, userMessage];
    setChatHistory(newHistory);
    setInputQuery("");
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await askChat(query, extractedText, chatHistory);
      if (!response.success || !response.answer?.trim()) {
        const message = response.error || "Chatbot returned no answer.";
        setChatHistory((prev) =>
          prev.map((item) =>
            item.id === userMessage.id ? { ...item, requestFailed: true } : item,
          ),
        );
        setErrorMessage(message);
        showToast(message, "error");
        return;
      }

      const botMessage = {
        id: "msg-" + (Date.now() + 1),
        role: "assistant",
        content: response.answer.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setChatHistory((prev) => [...prev, botMessage]);
      setErrorMessage("");
    } catch (err) {
      console.error(err);
      const message = err.message || "Chatbot service is unavailable.";
      setChatHistory((prev) =>
        prev.map((item) =>
          item.id === userMessage.id ? { ...item, requestFailed: true } : item,
        ),
      );
      setErrorMessage(message);
      showToast(message, "error");
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
    setErrorMessage("");
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

        <button
          onClick={handleClearChat}
          disabled={loading}
          className="btn btn-secondary btn-sm"
          title="Clear chat history"
        >
          <Trash2 size={14} />
          <span>Clear Chat</span>
        </button>
      </div>

      {errorMessage && (
        <div
          role="alert"
          aria-live="assertive"
          className="card"
          style={{
            border: "1px solid var(--color-danger)",
            color: "var(--color-danger)",
            margin: "12px 0",
            padding: "12px 16px"
          }}
        >
          {errorMessage}
        </div>
      )}

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
                {msg.requestFailed && (
                  <div style={{ color: "var(--color-danger)", fontSize: 11, marginTop: 6 }}>
                    No response received. This message was not added to conversation context.
                  </div>
                )}
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
            disabled={loading || !extractedText?.trim()}
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
          placeholder={
            extractedText
              ? "ಕನ್ನಡದಲ್ಲಿ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ದಾಖಲೆಯ ಕುರಿತು ಪ್ರಶ್ನೆ ಕೇಳಿ..."
              : "Upload a document to start chatting..."
          }
          disabled={loading || !extractedText?.trim()}
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputQuery.trim() || loading || !extractedText?.trim()}
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
