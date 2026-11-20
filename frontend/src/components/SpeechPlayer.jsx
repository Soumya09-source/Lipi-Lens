import React, { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, Square, Loader2 } from "lucide-react";
import { generateSpeech } from "../services/api";

export default function SpeechPlayer({
  text,
  language = "kn",
  listenLabel,
  buttonVariant = "secondary"
}) {
  const [playback, setPlayback] = useState({
    text,
    language,
    status: "idle",
    error: ""
  });
  const audioRef = useRef(null);
  const audioUrlRef = useRef(null);
  const requestIdRef = useRef(0);

  const currentPlayback =
    playback.text === text && playback.language === language ? playback : null;
  const isPlaying = currentPlayback?.status === "playing";
  const isLoading = currentPlayback?.status === "loading";
  const errorMessage = currentPlayback?.error || "";

  const releaseAudio = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.onended = null;
      audio.onerror = null;
      audio.onplay = null;
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }

    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
    }

    audioRef.current = null;
    audioUrlRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      requestIdRef.current += 1;
      releaseAudio();
    };
  }, [text, language, releaseAudio]);

  const stopSpeech = () => {
    requestIdRef.current += 1;
    releaseAudio();
    setPlayback({ text, language, status: "idle", error: "" });
  };

  const handlePlaySpeech = async () => {
    if (!text?.trim() || isLoading) return;

    if (isPlaying) {
      stopSpeech();
      return;
    }

    if (language !== "kn") {
      setPlayback({
        text,
        language,
        status: "error",
        error: "Mithi speech currently supports Kannada only."
      });
      return;
    }

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setPlayback({ text, language, status: "loading", error: "" });

    try {
      const result = await generateSpeech(text, language);
      if (requestId !== requestIdRef.current) return;

      if (!result.success || !result.audioBlob) {
        setPlayback({
          text,
          language,
          status: "error",
          error: result.error || "Speech generation failed."
        });
        return;
      }

      const audioUrl = URL.createObjectURL(result.audioBlob);
      audioUrlRef.current = audioUrl;

      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onplay = () => {
        if (audioRef.current === audio) {
          setPlayback({ text, language, status: "playing", error: "" });
        }
      };
      audio.onended = () => {
        if (audioRef.current !== audio) return;
        releaseAudio();
        setPlayback({ text, language, status: "idle", error: "" });
      };
      audio.onerror = () => {
        if (audioRef.current !== audio) return;
        releaseAudio();
        setPlayback({
          text,
          language,
          status: "error",
          error: "The generated audio could not be played."
        });
      };

      await audio.play();
      if (requestId === requestIdRef.current) {
        setPlayback({ text, language, status: "playing", error: "" });
      }
    } catch (error) {
      if (requestId === requestIdRef.current) {
        releaseAudio();
        setPlayback({
          text,
          language,
          status: "error",
          error: error.message || "Mithi speech service is unavailable."
        });
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setPlayback((current) =>
          current.text === text &&
          current.language === language &&
          current.status === "loading"
            ? { ...current, status: "idle" }
            : current,
        );
      }
    }
  };

  return (
    <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
      <button
        onClick={handlePlaySpeech}
        disabled={!text?.trim() || isLoading}
        className={`btn btn-sm ${
          isPlaying || buttonVariant === "primary" ? "btn-primary" : "btn-secondary"
        }`}
        title={
          language !== "kn"
            ? "Mithi supports Kannada speech only"
            : isPlaying
              ? "ಧ್ವನಿಯನ್ನು ನಿಲ್ಲಿಸಿ (Stop audio)"
              : "ಧ್ವನಿಯಲ್ಲಿ ಆಲಿಸಿ (Listen aloud)"
        }
        aria-label={
          isPlaying
            ? "Stop speech playback"
            : listenLabel || "Play speech"
        }
        style={{ gap: 6 }}
      >
        {isLoading ? (
          <Loader2 size={14} className="spinning" />
        ) : isPlaying ? (
          <Square size={13} fill="currentColor" />
        ) : (
          <Volume2 size={15} />
        )}
        <span>
          {isLoading
            ? "ರಚಿಸಲಾಗುತ್ತಿದೆ..."
            : isPlaying
              ? "ಧ್ವನಿ ನಿಲ್ಲಿಸಿ"
              : listenLabel || "ಧ್ವನಿ ಆಲಿಸಿ (Listen)"}
        </span>
      </button>
      {errorMessage && (
        <span role="alert" style={{ maxWidth: 240, color: "var(--color-danger)", fontSize: 11 }}>
          {errorMessage}
        </span>
      )}
    </span>
  );
}
