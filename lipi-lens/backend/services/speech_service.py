
import sys
import os
import torch

# Mithi model location
MODEL_DIR = "/mnt/d/LipiLensModels/mithi-v2-flash"

# Add original model directory to Python path
if MODEL_DIR not in sys.path:
    sys.path.insert(0, MODEL_DIR)

from run import Mithi


class SpeechService:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"

        print(f"Loading Mithi TTS on {self.device}...")

        self.tts = Mithi(
            model_dir=MODEL_DIR,
            device=self.device
        )

        print("Mithi TTS loaded successfully!")

    def generate_speech(self, text, voice="charvi"):
        if not text or not text.strip():
            raise ValueError("Text cannot be empty")

        audio = self.tts.synthesize(
            text=text,
            lang="kn",
            voice=voice
        )

        return audio


# Create one reusable service instance
speech_service = SpeechService()
