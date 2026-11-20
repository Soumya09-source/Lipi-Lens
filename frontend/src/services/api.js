import axios from "axios";
import {
  hasSummaryContent,
  mapSummaryResponse,
} from "./summaryMapping.js";

// Read API URL from environment, defaulting to standard backend port
const UBUNTU_API_URL = import.meta.env.VITE_UBUNTU_API_URL || "http://127.0.0.1:5000/api";
const SPEECH_API_URL = import.meta.env.VITE_SPEECH_API_URL || "http://127.0.0.1:5002/api";

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

    if (!data?.success) {
      return {
        success: false,
        error: data?.error || data?.message || "Translation failed"
      };
    }

    const translatedText =
      typeof data.english_text === "string" ? data.english_text.trim() : "";
    if (!translatedText) {
      return {
        success: false,
        error: "Translation API returned an empty response."
      };
    }

    return {
      success: true,
      data,
      translatedText
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Translation service is unavailable"
    };
  }
};

/**
 * Mithi speech API: returns a WAV audio response for Kannada text.
 * Endpoint: POST http://127.0.0.1:5002/api/speech with { text }
 */
export const generateSpeech = async (text, language = "kn") => {
  if (!text || !text.trim()) {
    return { success: false, error: "Text is required for speech generation." };
  }

  if (language !== "kn") {
    return {
      success: false,
      error: "Mithi speech currently supports Kannada only."
    };
  }

  try {
    const response = await axios.post(`${SPEECH_API_URL}/speech`, { text }, {
      responseType: "blob",
      timeout: 120000
    });

    const audioBlob = response.data;
    const contentType = response.headers?.["content-type"]?.split(";")[0] || "";
    if (
      typeof Blob === "undefined" ||
      !(audioBlob instanceof Blob) ||
      audioBlob.size === 0 ||
      !contentType.startsWith("audio/")
    ) {
      return {
        success: false,
        error: "Speech API did not return a valid audio response."
      };
    }

    return {
      success: true,
      audioBlob,
      contentType
    };
  } catch (error) {
    let responseError = "";
    const responseData = error?.response?.data;
    if (typeof Blob !== "undefined" && responseData instanceof Blob) {
      try {
        const payload = JSON.parse(await responseData.text());
        responseError = payload?.error || payload?.message || "";
      } catch {
        responseError = "";
      }
    } else {
      responseError = responseData?.error || responseData?.message || "";
    }

    return {
      success: false,
      error:
        responseError ||
        error?.message ||
        "Mithi speech service is unavailable."
    };
  }
};

export const simplifyText = async (text) => {
  if (!text || !text.trim()) {
    return { success: false, error: "Text cannot be empty" };
  }

  return {
    success: false,
    error: "Kannada simplification is unavailable until its backend endpoint is implemented."
  };
};

/**
 * Document Summary API: generates structured summary of document
 * Endpoint: POST /api/summary
 */
export const generateSummary = async (kannadaText, englishText = "") => {
  const kannada = typeof kannadaText === "string" ? kannadaText.trim() : "";
  const english = typeof englishText === "string" ? englishText.trim() : "";

  if (!kannada && !english) {
    return { success: false, error: "Document text cannot be empty" };
  }

  try {
    const response = await axios.post(`${UBUNTU_API_URL}/summary`, {
      kannada_text: kannada,
      english_text: english
    }, {
      timeout: 120000
    });

    if (!response.data?.success) {
      return {
        success: false,
        error:
          response.data?.error ||
          response.data?.message ||
          "The summary service returned an unsuccessful response."
      };
    }

    const summary = mapSummaryResponse(response.data);
    if (!hasSummaryContent(summary)) {
      return {
        success: false,
        error: "The summary service returned no usable summary content."
      };
    }

    return { success: true, summary };
  } catch (error) {
    return {
      success: false,
      error:
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "The summary service is unavailable. Please try again."
    };
  }
};

export const generateVocabulary = async (kannadaText) => {
  if (!kannadaText || !kannadaText.trim()) {
    return { success: false, error: "Kannada document text is required" };
  }

  try {
    const response = await axios.post(`${UBUNTU_API_URL}/vocabulary`, {
      kannada_text: kannadaText
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

    if (data.vocabulary_source !== "gemini" && data.vocabulary_source !== "local") {
      return {
        success: false,
        error: "Vocabulary API returned an unsupported vocabulary source"
      };
    }

    const vocabulary = data.vocabulary
      .filter((item) => item && typeof item === "object" && !Array.isArray(item))
      .map((item) => ({
        word: typeof item.word === "string" ? item.word.trim() : "",
        english_meaning:
          typeof item.english_meaning === "string" ? item.english_meaning.trim() : "",
        kannada_explanation:
          typeof item.kannada_explanation === "string"
            ? item.kannada_explanation.trim()
            : "",
        example_kannada:
          typeof item.example_kannada === "string" ? item.example_kannada.trim() : "",
        example_english:
          typeof item.example_english === "string" ? item.example_english.trim() : ""
      }))
      .filter((item) => item.word);

    return {
      success: true,
      vocabulary,
      vocabularySource: data.vocabulary_source,
      message: typeof data.message === "string" ? data.message : ""
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Vocabulary service is unavailable"
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

  if (!contextText || !contextText.trim()) {
    return { success: false, error: "Please upload a document first." };
  }

  const conversationHistory = Array.isArray(history)
    ? history
        .filter(
          (message) =>
            message &&
            message.id !== "initial-welcome" &&
            !message.requestFailed &&
            (message.role === "user" || message.role === "assistant") &&
            typeof message.content === "string" &&
            message.content.trim(),
        )
        .slice(-10)
        .map(({ role, content }) => ({ role, content }))
    : [];

  try {
    const response = await axios.post(`${UBUNTU_API_URL}/chat`, {
      document_text: contextText,
      question: query,
      history: conversationHistory
    }, {
      timeout: 120000
    });

    const data = response.data;
    if (!data?.success) {
      return {
        success: false,
        error: data?.error || data?.message || "Chatbot request failed."
      };
    }

    const answer = typeof data.answer === "string" ? data.answer.trim() : "";
    if (!answer) {
      return {
        success: false,
        error: "Chatbot returned an empty response."
      };
    }

    return {
      success: true,
      answer
    };
  } catch (error) {
    return {
      success: false,
      error:
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Chatbot service is unavailable."
    };
  }
};
