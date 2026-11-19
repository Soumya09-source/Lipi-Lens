import axios from "axios";

// Read API URL from environment, defaulting to standard backend port
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const UBUNTU_API_URL = import.meta.env.VITE_UBUNTU_API_URL || "http://127.0.0.1:5000/api";
const SPEECH_API_URL = import.meta.env.VITE_SPEECH_API_URL || "http://127.0.0.1:5002/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Accept": "application/json",
  },
});

// Regional Kannada knowledge base for intelligent regional expression detection
export const REGIONAL_DICTIONARY = [
  // North Karnataka (ಉತ್ತರ ಕರ್ನಾಟಕ)
  {
    pattern: /ಬಿದ್ದೈತಿ|ಆಗೈತಿ|ಹೋಗೈತಿ|ಬಂದೈತಿ|ಮಾಡೈತಿ/i,
    word: "ಬಿದ್ದೈತಿ / ಬಂದೈತಿ (ಅಗೈತಿ)",
    region: "North Karnataka (ಉತ್ತರ ಕರ್ನಾಟಕ)",
    regionKannada: "ಉತ್ತರ ಕರ್ನಾಟಕ",
    standard: "ಬಿದ್ದಿದೆ / ಬಂದಿದೆ",
    englishMeaning: "Has fallen / Has arrived (Present perfect suffix '-ೈತಿ')",
    context: "Widely used in Hubballi, Dharwad, Belagavi, and Kalaburagi for state of completion.",
    alternatives: ["ಆಗಿದೆ (Standard)", "ಆಂಡ್ (Coastal)", "ಆಯ್ತು ಕಣ್ರೀ (Mysuru)"],
    confidence: "Possible Region: North Karnataka (Confidence: 94%)"
  },
  {
    pattern: /ಗಮ್ಮತ್ತು|ಗಮ್ಮತ್ತಿನಾಗ/i,
    word: "ಗಮ್ಮತ್ತು (Gammathu)",
    region: "North Karnataka (ಉತ್ತರ ಕರ್ನಾಟಕ)",
    regionKannada: "ಉತ್ತರ ಕರ್ನಾಟಕ",
    standard: "ಸಂಭ್ರಮ / ಮೋಜು / ಮಜಾ",
    englishMeaning: "Joyful enjoyment, fun, celebration, merriment",
    context: "Commonly used in informal conversations to describe having a wonderful, happy time.",
    alternatives: ["ಮಜಾ (Colloquial)", "ಸಂತೋಷ (Standard)", "ಖುಷಿ"],
    confidence: "Possible Region: North Karnataka (Confidence: 91%)"
  },
  {
    pattern: /ಬರ್ರಿ|ಕುಡೀರಿ|ಹೋಗ್ರಿ|ಮಾಡ್ರಿ/i,
    word: "ಬರ್ರಿ / ಕುಡೀರಿ (Honorific imperative '-ರಿ')",
    region: "North Karnataka (ಉತ್ತರ ಕರ್ನಾಟಕ)",
    regionKannada: "ಉತ್ತರ ಕರ್ನಾಟಕ",
    standard: "ಬನ್ನಿ / ಕುಡಿಯಿರಿ",
    englishMeaning: "Please come / Please drink (Polite regional invitation suffix '-ರಿ')",
    context: "Hallmark of hospitality in North Karnataka; warmer and more colloquial than formal 'ಬನ್ನಿ'.",
    alternatives: ["ಬನ್ನಿ (Standard)", "ಬನ್ನಿ ಸ್ವಾಮಿ (Mysuru)"],
    confidence: "Possible Region: North Karnataka (Confidence: 89%)"
  },
  {
    pattern: /ಅಟ್ಟಿ|ಅಟ್ಟಿ ಮಂದಿ/i,
    word: "ಅಟ್ಟಿ (Atti)",
    region: "North Karnataka (ಉತ್ತರ ಕರ್ನಾಟಕ)",
    regionKannada: "ಉತ್ತರ ಕರ್ನಾಟಕ",
    standard: "ಮನೆ / ಕುಟುಂಬದವರು",
    englishMeaning: "Household / Family members living together",
    context: "Refers to traditional joint family households or village dwellings.",
    alternatives: ["ಮನೆ (Standard)", "ಇಲ್ಲ (Coastal Tulu-influenced)", "ಸಂಸಾರ"],
    confidence: "Possible Region: North Karnataka (Confidence: 87%)"
  },
  {
    pattern: /ಹಿಂಗ್ಯಾಕ್|ಯಾಕೋ ಹಿಂಗ್ಯಾಕ್/i,
    word: "ಹಿಂಗ್ಯಾಕ್ (Hingyak)",
    region: "North Karnataka (ಉತ್ತರ ಕರ್ನಾಟಕ)",
    regionKannada: "ಉತ್ತರ ಕರ್ನಾಟಕ",
    standard: "ಹೀಗೇಕೆ / ಈ ರೀತಿ ಏಕೆ",
    englishMeaning: "Why like this?",
    context: "Interrogative expression used when surprised or questioning an unusual act.",
    alternatives: ["ಹೀಗೇಕೆ (Standard)", "ಯಾಕೆ ಹೀಗೆ (Colloquial)", "ಇಂಚೆನೆ (Coastal)"],
    confidence: "Possible Region: North Karnataka (Confidence: 92%)"
  },

  // Coastal Karnataka (ಕರಾವಳಿ)
  {
    pattern: /ಕುಡ್ಲ/i,
    word: "ಕುಡ್ಲ (Kudla)",
    region: "Coastal Karnataka (ಕರಾವಳಿ)",
    regionKannada: "ಕರಾವಳಿ ಕರ್ನಾಟಕ",
    standard: "ಮಂಗಳೂರು ನಗರ",
    englishMeaning: "Mangaluru city (Historical native Tulu/Kannada regional name)",
    context: "Widely used along Dakshina Kannada coastal districts.",
    alternatives: ["ಮಂಗಳೂರು (Official)", "ಮಿಕಾಲ (Historical)"],
    confidence: "Possible Region: Coastal Karnataka (Confidence: 98%)"
  },
  {
    pattern: /ಪೊರ್ಲು/i,
    word: "ಪೊರ್ಲು (Porlu)",
    region: "Coastal Karnataka (ಕರಾವಳಿ)",
    regionKannada: "ಕರಾವಳಿ ಕರ್ನಾಟಕ",
    standard: "ಅಂದ / ಸುಂದರ / ಚೆಂದ",
    englishMeaning: "Beautiful, picturesque, pleasant",
    context: "Common Tulu loanword deeply embedded in Coastal Kannada dialect.",
    alternatives: ["ಚಂದ (Standard)", "ಸುಂದರ (Formal)", "ಲಕ್ಷಣ (Mysuru)"],
    confidence: "Possible Region: Coastal Karnataka (Confidence: 96%)"
  },
  {
    pattern: /ಎಂಚಿತ್ತಿನ|ಎಂಚ/i,
    word: "ಎಂಚಿತ್ತಿನ (Enchittina)",
    region: "Coastal Karnataka (ಕರಾವಳಿ)",
    regionKannada: "ಕರಾವಳಿ ಕರ್ನಾಟಕ",
    standard: "ಯಾವ ರೀತಿಯ / ಎಂತಹ",
    englishMeaning: "What kind of / Such an amazing",
    context: "Used as an exclamation of wonder or curiosity in Udupi and Dakshina Kannada.",
    alternatives: ["ಎಂತಹ (Standard)", "ಹ್ಯಾಗೆ (Mysuru)", "ಯಾವ ತರಹ"],
    confidence: "Possible Region: Coastal Karnataka (Confidence: 93%)"
  },
  {
    pattern: /ಬಯ್ಯದ ಹೊತ್ತು|ಬಯ್ಯ/i,
    word: "ಬಯ್ಯದ ಹೊತ್ತು (Bayyada Hottu)",
    region: "Coastal Karnataka (ಕರಾವಳಿ)",
    regionKannada: "ಕರಾವಳಿ ಕರ್ನಾಟಕ",
    standard: "ಸಂಜೆ ಸಮಯ / ಮುಸ್ಸಂಜೆ",
    englishMeaning: "Evening time / Twilight hour",
    context: "Traditional time reference frequently heard in coastal villages and fishing towns.",
    alternatives: ["ಸಂಜೆ (Standard)", "ಮುಸ್ಸಂಜೆ", "ಸಂಜೇವೇಳೆ"],
    confidence: "Possible Region: Coastal Karnataka (Confidence: 90%)"
  },
  {
    pattern: /ಬೊಕ್ಕ/i,
    word: "ಬೊಕ್ಕ (Bokka)",
    region: "Coastal Karnataka (ಕರಾವಳಿ)",
    regionKannada: "ಕರಾವಳಿ ಕರ್ನಾಟಕ",
    standard: "ಮತ್ತು / ಆಮೇಲೆ / ನಂತರ",
    englishMeaning: "And / Afterwards / Later",
    context: "Tulu-Kannada coastal bridge conjunction connecting sequential events.",
    alternatives: ["ಮತ್ತು (Standard)", "ಆಮೇಲೆ", "ಆಮೇಲೆ ಕಣ್ರೀ (Mysuru)"],
    confidence: "Possible Region: Coastal Karnataka (Confidence: 91%)"
  },

  // Mysuru / Old Mysore (ಮೈಸೂರು ಭಾಗ)
  {
    pattern: /ಕಣ್ರೀ|ಕಣಯ್ಯ|ಕಣಮ್ಮ/i,
    word: "ಕಣ್ರೀ / ಕಣಯ್ಯ (Suffix '-ಕಣ್ರೀ')",
    region: "Mysuru Region (ಮೈಸೂರು ಭಾಗ)",
    regionKannada: "ಮೈಸೂರು ಭಾಗ",
    standard: "ನೋಡಿ / ತಿಳಿಯಿರಿ (ಆಪ್ತ ವಾಕ್ಯಾಂತ್ಯ)",
    englishMeaning: "You see! / Indeed! (Affirmative conversational tag)",
    context: "Classic signature tag of Mandya, Mysuru, Hassan, and Bengaluru southern Kannada.",
    alternatives: ["ನೋಡಿ (Standard)", "ನೋಡ್ರಿ (North Karnataka)", "ಗೊತ್ತಾ"],
    confidence: "Possible Region: Mysuru Region (Confidence: 92%)"
  },
  {
    pattern: /ಸ್ವಾಮಿ|ಬನ್ನಿ ಸ್ವಾಮಿ|ಹೌದು ಸ್ವಾಮಿ/i,
    word: "ಸ್ವಾಮಿ (Swami - as friendly address)",
    region: "Mysuru Region (ಮೈಸೂರು ಭಾಗ)",
    regionKannada: "ಮೈಸೂರು ಭಾಗ",
    standard: "ಸರ್ / ಮಹಾಶಯರೇ / ಸ್ನೇಹಿತರೇ",
    englishMeaning: "Sir / Dear friend (Respectful yet affectionate address)",
    context: "Traditional courtly and polite conversational address of the Old Mysore kingdom.",
    alternatives: ["ಸರ್ (Modern)", "ಗುರುಗಳೇ", "ಯಪ್ಪಾ (North Karnataka)"],
    confidence: "Possible Region: Mysuru Region (Confidence: 86%)"
  },
  {
    pattern: /ತಿಂಡಿ ಆಯಿತಾ|ತಿಂಡಿ ತೀರ್ಥ/i,
    word: "ತಿಂಡಿ ತೀರ್ಥ (Tindi Teertha)",
    region: "Mysuru Region (ಮೈಸೂರು ಭಾಗ)",
    regionKannada: "ಮೈಸೂರು ಭಾಗ",
    standard: "ಉಪಾಹಾರ ಹಾಗೂ ಕಾಫಿ",
    englishMeaning: "Breakfast and coffee / Refreshments",
    context: "Cultural staple greeting across South Karnataka cafes and households.",
    alternatives: ["ಉಪಾಹಾರ (Formal)", "ನಾಷ್ಟಾ (Colloquial North)", "ಚಾ-ತಿಂಡಿ"],
    confidence: "Possible Region: Mysuru Region (Confidence: 88%)"
  }
];

// Helper to provide realistic smart fallback when backend is not yet started by teammate
const generateSmartSummaryMock = (text) => {
  const isGovt = text.includes("ಸುತ್ತೋಲೆ") || text.includes("ಸರ್ಕಾರ") || text.includes("ಇಲಾಖೆ");
  const isRegional = text.includes("ಹುಬ್ಬಳ್ಳಿ") || text.includes("ಕುಡ್ಲ") || text.includes("ಬಿದ್ದೈತಿ");

  if (isRegional) {
    const kn = {
      overview: "ಉತ್ತರ ಕರ್ನಾಟಕ ಅಥವಾ ಕರಾವಳಿ ಪ್ರಾಂತ್ಯದ ವಿಶಿಷ್ಟ ಆಡುನುಡಿಯಲ್ಲಿರುವ ಪಠ್ಯವಾಗಿದ್ದು, ಸಾಂಸ್ಕೃತಿಕ ಮತ್ತು ಪ್ರಾದೇಶಿಕ ಜನಜೀವನದ ವಿವರಗಳನ್ನು ಒಳಗೊಂಡಿದೆ.",
      importantPoints: [
        "ಪ್ರಾದೇಶಿಕ ನುಡಿಗಟ್ಟುಗಳು ಹಾಗೂ ಉಪಭಾಷಾ ಪ್ರಯೋಗಗಳು ಪ್ರಮುಖವಾಗಿ ಕಂಡುಬರುತ್ತವೆ.",
        "ಸ್ಥಳೀಯ ಸಂಸ್ಕೃತಿ, ಆತಿಥ್ಯ ಮತ್ತು ಜೀವನಶೈಲಿಯ ಆಪ್ತ ಸಂಭಾಷಣೆ.",
        "ಸಂಬಂಧಪಟ್ಟ ಪ್ರಾದೇಶಿಕ ಪದಗಳನ್ನು ಪ್ರಮಾಣಿತ ಕನ್ನಡಕ್ಕೆ ಪರಿವರ್ತಿಸಿ ಓದಬಹುದು."
      ],
      datesAndDeadlines: [
        { label: "ವಿಶೇಷ ಸಂದರ್ಭ", value: "ಸ್ಥಳೀಯ ಉತ್ಸವ / ಕೃಷಿ ಕಾಲಾವಧಿ" }
      ],
      namesAndOrganizations: [
        "ಪ್ರಾದೇಶಿಕ ಸಮುದಾಯ",
        "ಸ್ಥಳೀಯ ಕೃಷಿ ವಲಯ"
      ],
      amountsAndNumbers: [
        { label: "ಭಾಷಾ ವೈವಿಧ್ಯ", value: "ಪ್ರಾದೇಶಿಕ ಕನ್ನಡ ಆಡುಮಾತು" }
      ],
      importantInstructions: [
        "ಹೆಚ್ಚಿನ ವಿವರಣೆಗಾಗಿ 'ಪ್ರಾದೇಶಿಕ ಕನ್ನಡ (Regional Kannada)' ವಿಭಾಗದಲ್ಲಿ ವಿಶ್ಲೇಷಿಸಿ."
      ]
    };
    const en = {
      overview: "Text written in regional Karnataka dialect, reflecting local cultural conversations, agricultural life, and regional vernacular traditions.",
      importantPoints: [
        "Features distinctive regional idioms and colloquial grammatical structures.",
        "Warm interpersonal conversations regarding local hospitality and rural lifestyle.",
        "Regional dialect words can be cross-referenced with standard Kannada."
      ],
      datesAndDeadlines: [
        { label: "Special Occasion", value: "Local festival / harvest season" }
      ],
      namesAndOrganizations: [
        "Regional Local Community",
        "Agricultural Rural Sector"
      ],
      amountsAndNumbers: [
        { label: "Linguistic Dialect", value: "Regional Kannada Colloquial" }
      ],
      importantInstructions: [
        "Analyze in the 'Regional Kannada' intelligence tab for detailed etymological context."
      ]
    };

    return { ...kn, kn, en };
  }

  if (isGovt) {
    const kn = {
      overview: "ಅಧಿಕೃತ ಸರ್ಕಾರಿ ದಾಖಲೆಯಾಗಿದ್ದು, ಇಲಾಖಾ ಆದೇಶಗಳು, ಕಾಲಮಿತಿ ಮತ್ತು ಹಣಕಾಸು ನೆರವಿನ ಕುರಿತ ವಿವರಗಳನ್ನು ಒಳಗೊಂಡಿದೆ.",
      importantPoints: [
        "ನಿಗದಿತ ಕಾಲಮಿತಿಯೊಳಗೆ ನಿಖರ ಸಮೀಕ್ಷೆ ಮತ್ತು ಪರಿಶೀಲನೆ ಪೂರ್ಣಗೊಳಿಸಬೇಕು.",
        "ಫಲಾನುಭವಿಗಳಿಗೆ ನೇರ ನಗದು ವರ್ಗಾವಣೆ ಮೂಲಕ ಸವಲತ್ತು ಹಂಚಿಕೆ.",
        "ನಿಯಮಾನುಸಾರ ಅಗತ್ಯ ಗುರುತಿನ ಚೀಟಿ ಹಾಗೂ ದಾಖಲಾತಿಗಳ ಸಲ್ಲಿಕೆ ಕಡ್ಡಾಯ."
      ],
      datesAndDeadlines: [
        { label: "ಅರ್ಜಿ/ಸಮೀಕ್ಷೆ ಕೊನೆಯ ದಿನ", value: "೨೦ ನವೆಂಬರ್ ೨೦೨೪" },
        { label: "ಅನುಷ್ಠಾನ ದಿನಾಂಕ", value: "ತಕ್ಷಣದಿಂದ ಜಾರಿಗೆ" }
      ],
      namesAndOrganizations: [
        "ಕರ್ನಾಟಕ ಸರ್ಕಾರ ಸಚಿವಾಲಯ",
        "ಜಂಟಿ ಇಲಾಖಾ ನಿರ್ದೇಶನಾಲಯ",
        "ಜಿಲ್ಲಾಡಳಿತ ಹಾಗೂ ತಾಲೂಕು ಕಚೇರಿ"
      ],
      amountsAndNumbers: [
        { label: "ಅಂದಾಜು ಅನುದಾನ", value: "₹೨೫೦ ಕೋಟಿ" },
        { label: "ವೈಯಕ್ತಿಕ ಪರಿಹಾರ ಧನ", value: "₹೧೨,೫೦೦" }
      ],
      importantInstructions: [
        "ಅಧಿಕೃತ ಕಚೇರಿಗಳಲ್ಲಿ ಮಾತ್ರ ನಿಗದಿತ ನಮೂನೆಯಲ್ಲಿ ವಿವರಗಳನ್ನು ಸಲ್ಲಿಸಬೇಕು.",
        "ಯಾವುದೇ ಮಧ್ಯವರ್ತಿಗಳ ಆಮಿಷಕ್ಕೆ ಒಳಗಾಗಬಾರದು."
      ]
    };

    const en = {
      overview: "Official government document containing departmental directives, procedural timelines, and financial assistance guidelines.",
      importantPoints: [
        "Surveys and verifications must be strictly completed within the prescribed timeline.",
        "Direct Benefit Transfer (DBT) will be utilized for transparent distribution to beneficiaries.",
        "Submission of verified identification and land records is strictly mandatory."
      ],
      datesAndDeadlines: [
        { label: "Survey/Application Deadline", value: "20 November 2024" },
        { label: "Effective Implementation", value: "With immediate effect" }
      ],
      namesAndOrganizations: [
        "Government of Karnataka Secretariat",
        "Joint Directorate of Agriculture",
        "District Administration & Taluk Offices"
      ],
      amountsAndNumbers: [
        { label: "Estimated Grant Allocation", value: "₹250 Crores" },
        { label: "Individual Relief Amount", value: "₹12,500" }
      ],
      importantInstructions: [
        "Applications must only be submitted at designated official service centers.",
        "Do not entertain unauthorized agents or middlemen under any circumstances."
      ]
    };

    return { ...kn, kn, en };
  }

  const kn = {
    overview: text.slice(0, 180) + (text.length > 180 ? "..." : ""),
    importantPoints: [
      "ಕನ್ನಡ ಭಾಷಾ ಪಠ್ಯದ ಪ್ರಮುಖ ಸಾರಾಂಶ ಮತ್ತು ಸಂದೇಶ.",
      "ಪಠ್ಯದಲ್ಲಿ ಉಲ್ಲೇಖಿಸಲಾದ ಮುಖ್ಯ ಪಾತ್ರಗಳು ಅಥವಾ ವಿಷಯಗಳು.",
      "ಸಾಮಾಜಿಕ ಅಥವಾ ಸಾಂಸ್ಕೃತಿಕ ಮಹತ್ವದ ಅಂಶಗಳ ಸಮಗ್ರ ವಿವರಣೆ."
    ],
    datesAndDeadlines: [
      { label: "ಉಲ್ಲೇಖಿತ ದಿನಾಂಕ", value: "ಪ್ರಸ್ತುತ ಅವಧಿ / ಮುಂಬರುವ ದಿನಗಳು" }
    ],
    namesAndOrganizations: [
      "ಕರ್ನಾಟಕ ಜನಪದ ಪರಿಷತ್",
      "ಸ್ಥಳೀಯ ಸಂಘಟನೆಗಳು",
      "ಲಿಪಿ ಲೆನ್ಸ್ ಭಾಷಾ ಸಂಶೋಧನಾ ವೇದಿಕೆ"
    ],
    amountsAndNumbers: [
      { label: "ಅಂಕಿ-ಅಂಶ", value: `${text.trim().split(/\s+/).length} ಪದಗಳು, ${text.length} ಅಕ್ಷರಗಳು` }
    ],
    importantInstructions: [
      "ಮೂಲ ದಾಖಲೆಯ ಪೂರ್ಣ ಆವೃತ್ತಿಯನ್ನು ಓದಿ ಸ್ಪಷ್ಟತೆ ಪಡೆದುಕೊಳ್ಳಿ.",
      "ವಿಷಯಕ್ಕೆ ಅನುಗುಣವಾಗಿ ಮುಂದಿನ ಹಂತದ ಕ್ರಮಗಳನ್ನು ಕೈಗೊಳ್ಳಿ."
    ]
  };

  const en = {
    overview: `[Summary in English]: ${text.slice(0, 160)}... An executive analytical summary generated by Lipi Lens AI.`,
    importantPoints: [
      "Key summary takeaways and primary messaging of the Kannada document.",
      "Primary entities, individuals, or subject matters referenced in the text.",
      "Comprehensive breakdown of socially or culturally significant points."
    ],
    datesAndDeadlines: [
      { label: "Referenced Timeline", value: "Current period / upcoming schedule" }
    ],
    namesAndOrganizations: [
      "Karnataka Heritage Council",
      "Local Organizations",
      "Lipi Lens Research Platform"
    ],
    amountsAndNumbers: [
      { label: "Metrics", value: `${text.trim().split(/\s+/).length} words, ${text.length} characters` }
    ],
    importantInstructions: [
      "Refer to the full original Kannada document for complete regulatory context.",
      "Proceed with appropriate follow-up actions as indicated."
    ]
  };

  return { ...kn, kn, en };
};

const OCR_API_URL = import.meta.env.VITE_OCR_API_URL || "http://127.0.0.1:5001/api";
const TRANSLATION_API_URL = import.meta.env.VITE_TRANSLATION_API_URL || UBUNTU_API_URL;

/**
 * OCR extraction API: extracts Kannada text from an uploaded image or PDF.
 * Endpoint: POST /ocr
 */
export const extractOCR = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await axios.post(`${OCR_API_URL}/ocr`, formData, {
      timeout: 120000,
      onUploadProgress,
    });
    const data = response.data;

    if (!data.success) {
      return {
        success: false,
        error: data.error || "OCR extraction failed"
      };
    }

    return {
      success: true,
      data,
      text: data.kannada_text || ""
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || error.message || "OCR service is unavailable"
    };
  }
};

/**
 * Translation API: Kannada to English
 * Endpoint: POST /translate
 */
export const translateText = async (text, sourceLang = "kn", targetLang = "en") => {
  if (!text || !text.trim()) {
    return { success: false, error: "Text cannot be empty" };
  }

  if (sourceLang !== "kn" || targetLang !== "en") {
    return {
      success: false,
      error: "The translation service currently supports Kannada to English only."
    };
  }

  try {
    const response = await axios.post(`${TRANSLATION_API_URL}/translate`, {
      kannada_text: text
    }, {
      timeout: 180000
    });
    const data = response.data;

    if (!data.success) {
      return {
        success: false,
        error: data.error || "Translation failed"
      };
    }

    return {
      success: true,
      data,
      translatedText: data.english_text || ""
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || error.message || "Translation service is unavailable"
    };
  }
};

/**
 * Speech generation API: generates speech audio for text
 * Endpoint: POST /api/speech
 */
export const generateSpeech = async (text, language = "kn") => {
  if (language !== "kn") {
    return {
      success: true,
      isDemo: true,
      fallbackToWebSpeech: true,
      demoNote: "Mithi TTS supports Kannada only"
    };
  }

  try {
    const response = await axios.post(`${SPEECH_API_URL}/speech`, { text }, {
      responseType: "blob",
      timeout: 120000
    });
    return {
      success: true,
      audioUrl: URL.createObjectURL(response.data),
      isDemo: false
    };
  } catch (error) {
    console.warn("Backend /api/speech unavailable. Utilizing client Web Speech API fallback.", error.message);
    return {
      success: true,
      isDemo: true,
      fallbackToWebSpeech: true,
      demoNote: "Using browser native speech synthesis"
    };
  }
};

/**
 * Text simplification API: simplifies complex or administrative Kannada
 * Endpoint: POST /simplify
 */
export const simplifyText = async (text) => {
  if (!text || !text.trim()) {
    return { success: false, error: "Text cannot be empty" };
  }

  try {
    const response = await apiClient.post("/simplify", { text });
    return {
      success: true,
      simplifiedText: response.data.simplified_text || response.data.result || response.data.text,
      isDemo: false
    };
  } catch (error) {
    console.warn("Backend /simplify unavailable. Using demo simplifier.", error.message);

    const simplified = `[ಸರಳೀಕೃತ ಕನ್ನಡ]:\nಈ ದಾಖಲೆಯು ಮುಖ್ಯವಾಗಿ ಹೇಳುವುದೇನೆಂದರೆ:\n೧. ಮಳೆಯಿಂದ ನಷ್ಟವಾದ ರೈತರಿಗೆ ಸರ್ಕಾರದಿಂದ ಪ್ರತಿ ಹೆಕ್ಟೇರ್‌ಗೆ ₹೧೨,೫೦೦ ಸಹಾಯಧನ ಸಿಗಲಿದೆ.\n೨. ನವೆಂಬರ್ ೧೦ ರೊಳಗೆ ಅಧಿಕಾರಿಗಳು ಜಮೀನಿಗೆ ಬಂದು ತಪಾಸಣೆ ಮಾಡುತ್ತಾರೆ.\n೩. ರೈತರು ತಮ್ಮ ಆಧಾರ್ ಕಾರ್ಡ್ ಮತ್ತು ಪಹಣಿ ಪತ್ರವನ್ನು ಕೃಷಿ ಇಲಾಖೆಗೆ ನವೆಂಬರ್ ೨೦ರ ಒಳಗೆ ನೀಡಬೇಕು.\n೪. ಹಣ ನೇರವಾಗಿ ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮೆಯಾಗುತ್ತದೆ. ಮಧ್ಯವರ್ತಿಗಳ ಬಳಿ ಹೋಗಬೇಡಿ.`;

    return {
      success: true,
      isDemo: true,
      simplifiedText: simplified,
      demoNote: "Preview Mode: Backend API offline at " + API_BASE_URL
    };
  }
};

/**
 * Document Summary API: generates structured summary of document
 * Endpoint: POST /api/summary
 */
export const generateSummary = async (text) => {
  if (!text || !text.trim()) {
    return { success: false, error: "Text cannot be empty" };
  }

  try {
    const response = await axios.post(`${UBUNTU_API_URL}/summary`, {
      kannada_text: text,
      english_text: ""
    }, {
      timeout: 120000
    });
    return {
      success: true,
      summary: response.data.summary || response.data,
      isDemo: false
    };
  } catch (error) {
    console.warn("Backend /api/summary unavailable. Generating structured demo summary.", error.message);
    const mockSummary = generateSmartSummaryMock(text);
    return {
      success: true,
      isDemo: true,
      summary: mockSummary,
      demoNote: "Preview Mode: Backend API offline at " + API_BASE_URL
    };
  }
};

export const generateVocabulary = async (kannadaText, englishText = "") => {
  if (!kannadaText || !kannadaText.trim()) {
    return { success: false, error: "Kannada document text is required" };
  }

  try {
    const response = await axios.post(`${UBUNTU_API_URL}/vocabulary`, {
      kannada_text: kannadaText,
      english_text: englishText
    }, {
      timeout: 120000
    });
    const data = response.data;

    if (!data?.success) {
      return {
        success: false,
        error: data?.error || "Vocabulary generation failed"
      };
    }

    if (!Array.isArray(data.vocabulary)) {
      return {
        success: false,
        error: "Vocabulary API returned an invalid response"
      };
    }

    return {
      success: true,
      vocabulary: data.vocabulary
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || error.message || "Vocabulary service is unavailable"
    };
  }
};

/**
 * Chatbot API: asks a question about the document
 * Endpoint: POST /api/chat
 */
export const askChat = async (query, contextText = "", history = []) => {
  if (!query || !query.trim()) {
    return { success: false, error: "Query cannot be empty" };
  }

  try {
    const response = await axios.post(`${UBUNTU_API_URL}/chat`, {
      document_text: contextText,
      question: query,
      history
    });
    return {
      success: true,
      answer: response.data.answer || response.data.reply || response.data.response,
      isDemo: false
    };
  } catch (error) {
    console.warn("Backend /api/chat unavailable. Generating intelligent demo response.", error.message);

    let answer = "";
    const qLower = query.toLowerCase();

    if (qLower.includes("ಪರಿಹಾರ") || qLower.includes("ಹಣ") || qLower.includes("amount") || qLower.includes("compensation")) {
      answer = "ದಾಖಲೆಯ ಪ್ರಕಾರ, ಮಳೆಯಿಂದ ಹಾನಿಗೊಳಗಾದ ಅರ್ಹ ರೈತರಿಗೆ ಪ್ರತಿ ಹೆಕ್ಟೇರ್‌ಗೆ ₹೧೨,೫೦೦ ಪರಿಹಾರ ಧನವನ್ನು ನೇರ ನಗದು ವರ್ಗಾವಣೆ (DBT) ಮೂಲಕ ನೀಡಲಾಗುತ್ತದೆ. ಒಟ್ಟು ಮಂಜೂರಾದ ಅನುದಾನ ₹೨೫೦ ಕೋಟಿ ಆಗಿದೆ.";
    } else if (qLower.includes("ದಿನಾಂಕ") || qLower.includes("ಕೊನೆ") || qLower.includes("date") || qLower.includes("deadline")) {
      answer = "ಮುಖ್ಯವಾದ ದಿನಾಂಕಗಳು:\n೧. ಬೆಳೆ ಸಮೀಕ್ಷೆ ಪೂರ್ಣಗೊಳ್ಳುವ ದಿನಾಂಕ: ನವೆಂಬರ್ ೧೦, ೨೦೨೪.\n೨. ಆಧಾರ್ ಕಾರ್ಡ್ ಮತ್ತು ಪಹಣಿ (RTC) ನಕಲು ಸಲ್ಲಿಸಲು ಕೊನೆಯ ದಿನಾಂಕ: ನವೆಂಬರ್ ೨೦, ೨೦೨೪.";
    } else if (qLower.includes("ದಾಖಲೆ") || qLower.includes("document") || qLower.includes("ಆಧಾರ್")) {
      answer = "ಫಲಾನುಭವಿಗಳು ತಮ್ಮ ಆಧಾರ್ ಕಾರ್ಡ್ ಮತ್ತು ಪಹಣಿ (RTC) ದೃಢೀಕೃತ ನಕಲನ್ನು ನವೆಂಬರ್ ೨೦ರೊಳಗೆ ಸ್ಥಳೀಯ ಕೃಷಿ ಇಲಾಖೆ ಸಂಪರ್ಕ ಕೇಂದ್ರಕ್ಕೆ ಸಲ್ಲಿಸಬೇಕು.";
    } else if (qLower.includes("ಯಾರು") || qLower.includes("ಅಧಿಕಾರಿ") || qLower.includes("who") || qLower.includes("officer")) {
      answer = "ಈ ಸುತ್ತೋಲೆಯನ್ನು ಕೃಷಿ ಇಲಾಖೆಯ ನಿರ್ದೇಶಕರಾದ ಡಾ. ರಾಜಶೇಖರ್ ಮೂರ್ತಿ, ಭಾ.ಆ.ಸೇ. (IAS) ಅವರು ಹೊರಡಿಸಿದ್ದಾರೆ. ಸ್ಥಳ ಪರಿಶೀಲನೆಯನ್ನು ಗ್ರಾಮ ಲೆಕ್ಕಾಧಿಕಾರಿಗಳು ಮತ್ತು ಕೃಷಿ ಅಧಿಕಾರಿಗಳು ಜಂಟಿಯಾಗಿ ನಡೆಸಲಿದ್ದಾರೆ.";
    } else if (contextText && contextText.trim().length > 0) {
      answer = `ನಿಮ್ಮ ಪ್ರಶ್ನೆ: "${query}"\n\nದಾಖಲೆಯನ್ನು ವಿಶ್ಲೇಷಿಸಿದಾಗ ಕಂಡುಬರುವ ಮುಖ್ಯ ಅಂಶವೆಂದರೆ, ನೀಡಲಾದ ಪಠ್ಯದಲ್ಲಿ ಸಂಬಂಧಿತ ಕಾರ್ಯವಿಧಾನಗಳು ಹಾಗೂ ನಿಯಮಗಳನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ವಿವರಿಸಲಾಗಿದೆ. ಅಗತ್ಯವಿದ್ದಲ್ಲಿ ಹೆಚ್ಚಿನ ನಿರ್ದಿಷ್ಟ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಬಹುದು.`;
    } else {
      answer = `ನಮಸ್ಕಾರ! ನೀವು ಕೇಳಿದ ಪ್ರಶ್ನೆಗೆ ಸಂಬಂಧಿಸಿದಂತೆ, ದಯವಿಟ್ಟು 'ದಾಖಲೆ (Document Workspace)' ವಿಭಾಗದಲ್ಲಿ ಕನ್ನಡ ದಾಖಲೆಯನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಅಥವಾ ಮಾದರಿ ದಾಖಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ. ಆಗ ನಾನು ದಾಖಲೆಯನ್ನು ಪರಿಶೀಲಿಸಿ ನಿಖರ ಉತ್ತರವನ್ನು ನೀಡಬಲ್ಲೆ.`;
    }

    return {
      success: true,
      isDemo: true,
      answer,
      demoNote: "Preview Mode: Backend API offline at " + API_BASE_URL
    };
  }
};
