import React, { useState, useEffect } from "react";
import { Volume2, Square, Loader2 } from "lucide-react";
import { generateSpeech } from "../services/api";

export default function SpeechPlayer({ text, language = "kn" }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const fallbackBrowserSpeech = () => {
    if (!window.speechSynthesis) {
      alert("ನಿಮ್ಮ ಬ್ರೌಸರ್ ಧ್ವನಿ ಪ್ಲೇಬ್ಯಾಕ್ ಬೆಂಬಲಿಸುವುದಿಲ್ಲ (Speech synthesis not supported in this browser).");
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "kn" ? "kn-IN" : "en-US";
    utterance.rate = 0.95; // Slightly slower for clarity
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const handlePlaySpeech = async () => {
    if (!text || !text.trim()) return;

    // If currently playing, stop it
    if (isPlaying) {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);

    try {
      // First attempt backend generation endpoint if available
      const apiResult = await generateSpeech(text, language);

      if (apiResult.audioUrl) {
        const audio = new Audio(apiResult.audioUrl);
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => fallbackBrowserSpeech();
        audio.play();
        setIsPlaying(true);
        setIsLoading(false);
        return;
      }

      // If backend is in preview or Web Speech fallback requested
      fallbackBrowserSpeech();
    } catch (err) {
      console.warn("Audio generation fallback to browser speech synthesis", err);
      fallbackBrowserSpeech();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePlaySpeech}
      disabled={!text || isLoading}
      className={`btn btn-sm ${isPlaying ? "btn-primary" : "btn-secondary"}`}
      title={isPlaying ? "ಧ್ವನಿಯನ್ನು ನಿಲ್ಲಿಸಿ (Stop audio)" : "ಧ್ವನಿಯಲ್ಲಿ ಆಲಿಸಿ (Listen aloud)"}
      style={{ gap: 6 }}
    >
      {isLoading ? (
        <Loader2 size={14} className="spinning" />
      ) : isPlaying ? (
        <Square size={13} fill="currentColor" />
      ) : (
        <Volume2 size={15} />
      )}
      <span>{isPlaying ? "ಧ್ವನಿ ನಿಲ್ಲಿಸಿ" : "ಧ್ವನಿ ಆಲಿಸಿ (Listen)"}</span>
    </button>
  );
}
