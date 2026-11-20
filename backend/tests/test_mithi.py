
import os
import sys
import torch
import soundfile as sf

MODEL_DIR = "/mnt/d/LipiLensModels/mithi-v2-flash"
OUTPUT_FILE = "/mnt/d/LipiLensModels/mithi-tts/kannada_test.wav"

# Import the official Mithi implementation
sys.path.insert(0, MODEL_DIR)

from run import Mithi

print("Loading Mithi model onto GPU...")

tts = Mithi(
    model_dir=MODEL_DIR,
    device="cuda"
)

print("Model loaded successfully!")

text = "ನಮಸ್ಕಾರ! ಲಿಪಿ ಲೆನ್ಸ್‌ಗೆ ಸ್ವಾಗತ. ಕನ್ನಡ ಭಾಷೆಯನ್ನು ಸುಲಭವಾಗಿ ಕಲಿಯೋಣ."

print("Generating Kannada speech...")

audio = tts.synthesize(
    text=text,
    lang="kn",
    voice="charvi"
)

tts.save(audio, OUTPUT_FILE)

print("Speech generated successfully!")
print("Audio location:", OUTPUT_FILE)
print("Duration:", round(len(audio) / 24000, 2), "seconds")
print("GPU memory used:", round(torch.cuda.memory_allocated() / 1024**3, 2), "GB")
