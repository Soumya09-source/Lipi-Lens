import React, { useState } from "react";
import {
  Search,
  BookOpen,
  Copy,
  Check,
  History,
  Loader2
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useDocument } from "../context/DocumentContext";
import { generateVocabulary } from "../services/api";

export default function Vocabulary() {
  const { showToast, extractedText, translatedText, documentName } = useDocument();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [copiedWord, setCopiedWord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [vocabularyResult, setVocabularyResult] = useState(null);
  const [errorResult, setErrorResult] = useState(null);

  const vocabulary = vocabularyResult?.sourceText === extractedText
    ? vocabularyResult.entries
    : [];
  const error = errorResult?.sourceText === extractedText
    ? errorResult.message
    : "";

  const handleGenerateVocabulary = async () => {
    if (!extractedText?.trim()) {
      setErrorResult({
        sourceText: extractedText,
        message: "Load or extract a document before generating vocabulary."
      });
      return;
    }

    const sourceText = extractedText;
    setVocabularyResult(null);
    setErrorResult(null);
    setLoading(true);

    try {
      const result = await generateVocabulary(sourceText, translatedText || "");
      if (!result.success) {
        setErrorResult({
          sourceText,
          message: result.error || "Vocabulary generation failed."
        });
        return;
      }

      setVocabularyResult({
        sourceText,
        entries: result.vocabulary
      });

      if (result.vocabulary.length === 0) {
        setErrorResult({
          sourceText,
          message: "No vocabulary entries were returned for this document."
        });
      } else {
        showToast("Vocabulary generated from the current document.", "success");
      }
    } catch (requestError) {
      setErrorResult({
        sourceText,
        message: requestError.message || "Vocabulary service is unavailable."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (query && !searchHistory.includes(query)) {
      setSearchHistory([query, ...searchHistory.slice(0, 5)]);
    }
  };

  const handleCopyWord = async (item) => {
    const text = [
      item.word,
      `English meaning: ${item.english_meaning || ""}`,
      `Kannada explanation: ${item.kannada_explanation || ""}`,
      `Example: ${item.example_kannada || ""}`,
      `Example translation: ${item.example_english || ""}`
    ].join("\n");

    await navigator.clipboard.writeText(text);
    setCopiedWord(item.word);
    showToast(`"${item.word}" copied`, "success");
    setTimeout(() => setCopiedWord(null), 2000);
  };

  const query = searchQuery.trim().toLowerCase();
  const filteredWords = vocabulary.filter((item) =>
    [
      item.word,
      item.english_meaning,
      item.kannada_explanation,
      item.example_kannada,
      item.example_english
    ].some((value) => typeof value === "string" && value.toLowerCase().includes(query))
  );

  return (
    <DashboardLayout
      title="Vocabulary Explorer"
      kannadaTitle="ಕನ್ನಡ ಪದಕೋಶ"
      subtitle="Generate vocabulary from the active document"
    >
      <div className="card" style={{ marginBottom: 24, padding: "28px 24px" }}>
        <form onSubmit={handleSearchSubmit} className="vocab-search-bar">
          <div style={{ position: "relative", flex: 1 }}>
            <input
              type="text"
              className="form-input kannada-text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search generated words and examples..."
              style={{ paddingLeft: 44, fontSize: 15 }}
            />
            <Search
              size={18}
              style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--color-primary)" }}
            />
          </div>
          <button type="submit" className="btn btn-secondary">
            Search
          </button>
        </form>

        {searchHistory.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "var(--color-text-secondary)" }}>
              <History size={14} />
              <span>Recent searches:</span>
            </div>
            {searchHistory.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSearchQuery(tag)}
                className="badge badge-gold"
                style={{ cursor: "pointer", border: "1px solid var(--color-gold-border)" }}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginTop: 20 }}>
          <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
            {extractedText
              ? `Source: ${documentName || "current document"}`
              : "Load or extract a document to generate vocabulary."}
          </span>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleGenerateVocabulary}
            disabled={!extractedText?.trim() || loading}
          >
            {loading ? <Loader2 size={16} className="spinning" /> : <BookOpen size={16} />}
            {loading ? "Generating..." : "Generate vocabulary"}
          </button>
        </div>
      </div>

      {loading && (
        <div role="status" style={{ marginBottom: 20 }}>
          Generating vocabulary from the current document...
        </div>
      )}

      {error && (
        <div role="alert" className="card" style={{ marginBottom: 20, color: "var(--color-danger, #b42318)" }}>
          {error}
        </div>
      )}

      <div className="vocab-cards-grid">
        {filteredWords.map((item, index) => (
          <div key={`${item.word || "word"}-${index}`} className="vocab-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <div>
                <h3 className="vocab-word-title kannada-text">{item.word}</h3>
                <span className="vocab-english">{item.english_meaning}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyWord(item)}
                className="btn-icon-only btn-secondary"
                title="Copy vocabulary entry"
              >
                {copiedWord === item.word ? <Check size={14} color="#1B8354" /> : <Copy size={14} />}
              </button>
            </div>

            <div className="vocab-definition kannada-text">
              <strong>Kannada explanation:</strong>
              <div>{item.kannada_explanation}</div>
            </div>

            <div className="vocab-example kannada-text">
              <strong>Example:</strong>
              <div>{item.example_kannada}</div>
            </div>

            <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
              <strong>Example translation:</strong>
              <div>{item.example_english}</div>
            </div>
          </div>
        ))}

        {!loading && !error && vocabulary.length === 0 && (
          <div className="card" style={{ gridColumn: "1 / -1", textAlign: "center", padding: "32px 24px" }}>
            <BookOpen size={32} color="var(--color-primary)" style={{ margin: "0 auto 12px" }} />
            <p>{extractedText ? "Generate vocabulary to see words from this document." : "No document text is available yet."}</p>
          </div>
        )}

        {!loading && vocabulary.length > 0 && filteredWords.length === 0 && (
          <div className="card" style={{ gridColumn: "1 / -1", textAlign: "center", padding: "32px 24px" }}>
            No generated vocabulary matches “{searchQuery}”.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
