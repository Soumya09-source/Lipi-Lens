import axios from "axios";

const REGIONAL_API_URL =
  import.meta.env.VITE_REGIONAL_API_URL || "http://localhost:8001";

const regionalApiClient = axios.create({
  baseURL: REGIONAL_API_URL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const analyseRegionalKannada = async (text) => {
  if (!text || !text.trim()) {
    throw new Error("ದಯವಿಟ್ಟು ವಿಶ್ಲೇಷಿಸಲು ಕನ್ನಡ ಪಠ್ಯವನ್ನು ಒದಗಿಸಿ");
  }

  try {
    const response = await regionalApiClient.post("/api/regional/analyse", {
      text,
    });
    return response.data;
  } catch (error) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") {
      throw new Error(detail);
    }

    if (Array.isArray(detail)) {
      throw new Error(detail.map((item) => item.msg).filter(Boolean).join(", "));
    }

    if (error.code === "ECONNABORTED") {
      throw new Error("Regional analysis request timed out. Please try again.");
    }

    if (!error.response) {
      throw new Error(
        "Unable to reach the regional analysis service. Check that it is running at " +
          REGIONAL_API_URL,
      );
    }

    throw new Error(
      `Regional analysis failed (HTTP ${error.response.status}). Please try again.`,
    );
  }
};
