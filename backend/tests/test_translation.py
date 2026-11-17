
import torch
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
from IndicTransToolkit import IndicProcessor

MODEL_NAME = "ai4bharat/indictrans2-indic-en-dist-200M"

device = "cuda" if torch.cuda.is_available() else "cpu"
print("Using device:", device)

print("Loading tokenizer...")
tokenizer = AutoTokenizer.from_pretrained(
    MODEL_NAME,
    trust_remote_code=True
)

print("Loading model...")
model = AutoModelForSeq2SeqLM.from_pretrained(
    MODEL_NAME,
    trust_remote_code=True,
    torch_dtype=torch.float16 if device == "cuda" else torch.float32
).to(device)

ip = IndicProcessor(inference=True)

sentence = ["ನಮಸ್ಕಾರ, ನೀವು ಹೇಗಿದ್ದೀರಿ?"]

batch = ip.preprocess_batch(
    sentence,
    src_lang="kan_Knda",
    tgt_lang="eng_Latn"
)

inputs = tokenizer(
    batch,
    truncation=True,
    padding="longest",
    return_tensors="pt"
).to(device)

print("Translating...")

with torch.no_grad():
    generated_tokens = model.generate(
        **inputs,
        max_length=256,
        num_beams=5,
        use_cache=False
    )

decoded = tokenizer.batch_decode(
    generated_tokens,
    skip_special_tokens=True
)

translations = ip.postprocess_batch(
    decoded,
    lang="eng_Latn"
)

print("\nKannada:", sentence[0])
print("English:", translations[0])
print("GPU:", torch.cuda.get_device_name(0) if device == "cuda" else "CPU")
