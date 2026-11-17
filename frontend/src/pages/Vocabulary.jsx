import React, { useState } from "react";
import {
  Search,
  BookOpen,
  Copy,
  Check,
  History,
  Filter
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useDocument } from "../context/DocumentContext";

const INITIAL_VOCABULARY = [
  {
    id: "vocab-1",
    word: "ಪಹಣಿ (RTC)",
    transliteration: "Pahaṇi",
    category: "Administrative / Land",
    categoryKn: "ಕಂದಾಯ ಮತ್ತು ಭೂ ದಾಖಲೆ",
    kannadaMeaning: "ಜಮೀನಿನ ಮಾಲೀಕತ್ವ, ಸರ್ವೇ ನಂಬರ್ ಮತ್ತು ಬೆಳೆ ವಿವರಗಳನ್ನು ಒಳಗೊಂಡ ಅಧಿಕೃತ ಹಕ್ಕುಪತ್ರ (Record of Rights, Tenancy and Crops).",
    englishMeaning: "Land Record of Rights, Tenancy and Crop verification document issued by the Karnataka Revenue Department.",
    example: "ರೈತರು ಕೃಷಿ ಪರಿಹಾರ ಪಡೆಯಲು ಪ್ರಸ್ತುತ ಸಾಲಿನ ಪಹಣಿ ನಕಲನ್ನು ಕಡ್ಡಾಯವಾಗಿ ಸಲ್ಲಿಸಬೇಕು.",
    exampleEn: "Farmers must mandatorily submit a copy of this year's RTC to claim agricultural relief."
  },
  {
    id: "vocab-2",
    word: "ಸುತ್ತೋಲೆ",
    transliteration: "Suttōle",
    category: "Administrative",
    categoryKn: "ಆಡಳಿತಾತ್ಮಕ",
    kannadaMeaning: "ಸರ್ಕಾರಿ ಅಥವಾ ಖಾಸಗಿ ಸಂಸ್ಥೆಯು ತನ್ನ ಅಧೀನ ಕಚೇರಿಗಳಿಗೆ ಅಥವಾ ನೌಕರರಿಗೆ ಹೊರಡಿಸುವ ಅಧಿಕೃತ ಆದೇಶ ಅಥವಾ ಸೂಚನಾ ಪತ್ರ (Circular).",
    englishMeaning: "An official governmental circular or memorandum distributed to departmental officers.",
    example: "ಕೃಷಿ ಇಲಾಖೆಯ ನಿರ್ದೇಶಕರು ಮುಂಗಾರು ಸಮೀಕ್ಷೆ ಕುರಿತು ಹೊಸ ಸುತ್ತೋಲೆ ಹೊರಡಿಸಿದ್ದಾರೆ.",
    exampleEn: "The Director of Agriculture has issued a new circular regarding the Kharif survey."
  },
  {
    id: "vocab-3",
    word: "ಬಿದ್ದೈತಿ",
    transliteration: "Biddaiti",
    category: "Regional Dialect",
    categoryKn: "ಉತ್ತರ ಕರ್ನಾಟಕ ಆಡುನುಡಿ",
    kannadaMeaning: "ಉತ್ತರ ಕರ್ನಾಟಕದಲ್ಲಿ 'ಬಿದ್ದಿದೆ' ಎಂಬ ಅರ್ಥದಲ್ಲಿ ಬಳಸುವ ಕ್ರಿಯಾಪದ ರೂಪ (ಉದಾ: ಮಳೆ ಬಿದ್ದೈತಿ, ಚಳಿ ಬಿದ್ದೈತಿ).",
    englishMeaning: "Colloquial North Karnataka dialect form meaning 'has fallen / has occurred' (e.g., rainfall has occurred).",
    example: "ನಮ್ಮ ಊರ ಕಡೆ ಈ ಸಲ ಮಸ್ತ್ ಮಳೆ ಬಿದ್ದೈತಿ ನೋಡ್ರಿ!",
    exampleEn: "In our region, heavy rains have fallen this season, see!"
  },
  {
    id: "vocab-4",
    word: "ಪೊರ್ಲು",
    transliteration: "Porlu",
    category: "Regional Dialect",
    categoryKn: "ಕರಾವಳಿ ಆಡುನುಡಿ",
    kannadaMeaning: "ಕರಾವಳಿ ಕರ್ನಾಟಕ (ದಕ್ಷಿಣ ಕನ್ನಡ ಮತ್ತು ಉಡುಪಿ) ಭಾಗದಲ್ಲಿ 'ಸುಂದರ', 'ಚೆಂದ' ಎಂಬ ಅರ್ಥದಲ್ಲಿ ಬಳಸುವ ಪದ.",
    englishMeaning: "Tulu-influenced Coastal Kannada term meaning 'beautiful', 'picturesque', or 'lovely'.",
    example: "ಮಲ್ಪೆ ಕಡಲತೀರದಲ್ಲಿ ಸೂರ್ಯಾಸ್ತ ಎಂಚಿತ್ತಿನ ಪೊರ್ಲು ಕಾಣುತ್ತದೆ!",
    exampleEn: "How beautiful the sunset looks at Malpe beach!"
  },
  {
    id: "vocab-5",
    word: "ಫಲಾನುಭವಿ",
    transliteration: "Phalānubhavī",
    category: "Legal & Governance",
    categoryKn: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
    kannadaMeaning: "ಸರ್ಕಾರದ ಕಲ್ಯಾಣ ಯೋಜನೆ ಅಥವಾ ಸೌಲಭ್ಯದ ಪ್ರಯೋಜನ ಪಡೆಯಲು ಅರ್ಹನಾದ ವ್ಯಕ್ತಿ (Beneficiary).",
    englishMeaning: "An eligible person who receives benefits from government welfare schemes.",
    example: "ನೇರ ನಗದು ವರ್ಗಾವಣೆ ಮೂಲಕ ಪ್ರತಿ ಫಲಾನುಭವಿಯ ಖಾತೆಗೆ ಅನುದಾನ ಜಮೆಯಾಗುತ್ತದೆ.",
    exampleEn: "Grants are deposited into each beneficiary's account via Direct Benefit Transfer."
  },
  {
    id: "vocab-6",
    word: "ಗಮ್ಮತ್ತು",
    transliteration: "Gammathu",
    category: "Regional Dialect",
    categoryKn: "ಉತ್ತರ ಕರ್ನಾಟಕ ಆಡುನುಡಿ",
    kannadaMeaning: "ಸಂತೋಷ, ಸಂಭ್ರಮ, ಮೋಜು ಅಥವಾ ಮಜಾ ಎಂಬ ಅರ್ಥದಲ್ಲಿ ಪ್ರೀತಿಯಿಂದ ಬಳಸುವ ಪದ.",
    englishMeaning: "Colloquial term for enjoyment, merrymaking, fun, or celebration.",
    example: "ಎಲ್ಲರೂ ಕೂಡಿ ಹಬ್ಬದ ದಿನ ಭಾಳ ಗಮ್ಮತ್ತಿನಾಗ ಕಾಲ ಕಳೆದರು.",
    exampleEn: "Everyone gathered together and had a jolly, delightful time on festival day."
  },
  {
    id: "vocab-7",
    word: "ಅನುದಾನ",
    transliteration: "Anudāna",
    category: "Finance & Governance",
    categoryKn: "ಹಣಕಾಸು",
    kannadaMeaning: "ನಿರ್ದಿಷ್ಟ ಸಾರ್ವಜನಿಕ ಅಥವಾ ಅಭಿವೃದ್ಧಿ ಕಾರ್ಯಕ್ಕಾಗಿ ಸರ್ಕಾರ ಅಥವಾ ಸಂಸ್ಥೆ ನೀಡುವ ಧನಸಹಾಯ (Grant/Fund).",
    englishMeaning: "Government grant or budgetary fund allocated for a specific development project.",
    example: "ಬರ ಪರಿಹಾರ ಕಾಮಗಾರಿಗಳಿಗಾಗಿ ಸರ್ಕಾರವು ₹೨೫೦ ಕೋಟಿ ಅನುದಾನ ಬಿಡುಗಡೆ ಮಾಡಿದೆ.",
    exampleEn: "The government released a ₹250 Crore grant for drought relief works."
  },
  {
    id: "vocab-8",
    word: "ಕಣ್ರೀ / ಕಣಯ್ಯ",
    transliteration: "Kanree / Kanayya",
    category: "Regional Dialect",
    categoryKn: "ಮೈಸೂರು ಆಡುನುಡಿ",
    kannadaMeaning: "ಹಳೆ ಮೈಸೂರು ಹಾಗೂ ಮಂಡ್ಯ ಭಾಗದಲ್ಲಿ ಆಪ್ತತೆ ಮತ್ತು ವಿಶ್ವಾಸ ಸೂಚಿಸಲು ವಾಕ್ಯದ ಕೊನೆಯಲ್ಲಿ ಬಳಸುವ ಧ್ವನಿಪದ.",
    englishMeaning: "Southern Old Mysore affirmative conversational particle conveying affection ('You see!', 'Indeed!').",
    example: "ನಾವು ಹೇಳಿದ್ದು ಸತ್ಯ ಕಣ್ರೀ, ನೀವು ಬಂದು ಖುದ್ದಾಗಿ ನೋಡಿ.",
    exampleEn: "What we said is the plain truth, you see! Come and inspect it yourself."
  }
];

export default function Vocabulary() {
  const { showToast } = useDocument();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchHistory, setSearchHistory] = useState(["ಪಹಣಿ", "ಸುತ್ತೋಲೆ", "ಬಿದ್ದೈತಿ", "ಪೊರ್ಲು"]);
  const [copiedId, setCopiedId] = useState(null);

  const categories = ["All", "Administrative", "Regional Dialect", "Legal & Governance", "Finance & Governance"];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() && !searchHistory.includes(searchQuery.trim())) {
      setSearchHistory([searchQuery.trim(), ...searchHistory.slice(0, 5)]);
    }
  };

  const handleSelectHistoryTag = (tag) => {
    setSearchQuery(tag);
  };

  const handleCopyWord = async (item) => {
    const text = `${item.word} (${item.transliteration})\nಕನ್ನಡ ಅರ್ಥ: ${item.kannadaMeaning}\nEnglish: ${item.englishMeaning}\nಉದಾಹರಣೆ: ${item.example}`;
    await navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    showToast(`"${item.word}" ವಿವರವನ್ನು ನಕಲಿಸಲಾಗಿದೆ`, "success");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredWords = INITIAL_VOCABULARY.filter((item) => {
    const matchesSearch =
      item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kannadaMeaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.englishMeaning.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout
      title="Vocabulary Explorer"
      kannadaTitle="ಕನ್ನಡ ಪದಕೋಶ"
      subtitle="Search administrative terms, cultural glossaries, and regional Kannada definitions"
    >
      {/* Search Header Area */}
      <div className="card" style={{ marginBottom: 24, padding: "28px 24px" }}>
        <form onSubmit={handleSearchSubmit} className="vocab-search-bar">
          <div style={{ position: "relative", flex: 1 }}>
            <input
              type="text"
              className="form-input kannada-text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ಕನ್ನಡ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಪದವನ್ನು ಹುಡುಕಿ (Search words e.g. ಪಹಣಿ, ಸುತ್ತೋಲೆ, ಬಿದ್ದೈತಿ)..."
              style={{ paddingLeft: 44, fontSize: 15 }}
            />
            <Search
              size={18}
              style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--color-primary)" }}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            <span>ಹುಡುಕಿ (Search)</span>
          </button>
        </form>

        {/* Search History & Filter Badges */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "var(--color-text-secondary)" }}>
            <History size={14} />
            <span>ಇತ್ತೀಚಿನ ಹುಡುಕಾಟಗಳು (Recent):</span>
          </div>

          {searchHistory.map((tag, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectHistoryTag(tag)}
              className="badge badge-gold"
              style={{ cursor: "pointer", border: "1px solid var(--color-gold-border)" }}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Category Pills */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--color-border-light)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "var(--color-text-muted)", marginRight: 4 }}>
            <Filter size={13} />
            <span>ವಿಭಾಗ (Filter):</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn btn-sm ${selectedCategory === cat ? "btn-primary" : "btn-secondary"}`}
              style={{ fontSize: 12, padding: "5px 12px" }}
            >
              {cat === "All" ? "ಎಲ್ಲವೂ (All)" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Vocabulary Results Grid */}
      <div className="vocab-cards-grid">
        {filteredWords.map((item) => (
          <div key={item.id} className="vocab-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h3 className="vocab-word-title kannada-text">{item.word}</h3>
                <span className="vocab-english">{item.transliteration}</span>
              </div>
              <button
                onClick={() => handleCopyWord(item)}
                className="btn-icon-only btn-secondary"
                title="Copy word and definition"
              >
                {copiedId === item.id ? <Check size={14} color="#1B8354" /> : <Copy size={14} />}
              </button>
            </div>

            <span className="badge badge-primary" style={{ alignSelf: "flex-start", fontSize: 11 }}>
              {item.categoryKn}
            </span>

            <div className="vocab-definition kannada-text">
              <strong style={{ display: "block", fontSize: 11, color: "var(--color-primary)", textTransform: "uppercase", marginBottom: 3 }}>
                ಕನ್ನಡ ವಿವರಣೆ (Kannada Meaning):
              </strong>
              {item.kannadaMeaning}
            </div>

            <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
              <strong style={{ color: "var(--color-text-main)" }}>English: </strong>
              {item.englishMeaning}
            </div>

            <div className="vocab-example kannada-text">
              <strong style={{ display: "block", fontSize: 11, color: "#8C6500", textTransform: "uppercase", marginBottom: 2 }}>
                ಬಳಕೆ ಉದಾಹರಣೆ (Example):
              </strong>
              "{item.example}"
            </div>
          </div>
        ))}

        {filteredWords.length === 0 && (
          <div
            className="card"
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "48px 24px",
              backgroundColor: "#FAF6EF"
            }}
          >
            <BookOpen size={36} color="var(--color-primary)" style={{ margin: "0 auto 12px" }} />
            <h4 style={{ fontSize: 18, marginBottom: 6 }}>ಯಾವುದೇ ಫಲಿತಾಂಶ ಕಂಡುಬಂದಿಲ್ಲ</h4>
            <p style={{ fontSize: 14, color: "var(--color-text-secondary)" }}>
              "{searchQuery}" ಪದಕ್ಕೆ ಸಂಬಂಧಿಸಿದ ದಾಖಲೆಗಳು ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಬೇರೆ ಪದವನ್ನು ಹುಡುಕಿ.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
