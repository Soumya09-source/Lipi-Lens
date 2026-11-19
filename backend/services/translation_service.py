
import threading

import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from IndicTransToolkit import IndicProcessor

MODEL_NAME = "ai4bharat/indictrans2-indic-en-dist-200M"

if torch.cuda.is_available():
    device = "cuda"
elif hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
    device = "mps"
else:
    device = "cpu"

processor = IndicProcessor(inference=True)
tokenizer = None
model = None
model_lock = threading.Lock()

print(f"IndicTrans2 will load on the first translation request using {device}.")


def _load_model():
    global tokenizer, model

    if model is not None:
        return

    with model_lock:
        if model is not None:
            return

        print(f"Loading IndicTrans2 on {device}...")
        loaded_tokenizer = AutoTokenizer.from_pretrained(
            MODEL_NAME,
            trust_remote_code=True
        )
        loaded_model = AutoModelForSeq2SeqLM.from_pretrained(
            MODEL_NAME,
            trust_remote_code=True,
            torch_dtype=torch.float16 if device == "cuda" else torch.float32
        ).to(device)
        loaded_model.eval()

        tokenizer = loaded_tokenizer
        model = loaded_model
        print("IndicTrans2 loaded successfully!")


def translate_kannada_to_english(text):
    if not text or not text.strip():
        return {
            "success": False,
            "error": "No text provided"
        }

    try:
        _load_model()
        sentences = [text.strip()]

        batch = processor.preprocess_batch(
            sentences,
            src_lang="kan_Knda",
            tgt_lang="eng_Latn"
        )

        inputs = tokenizer(
            batch,
            truncation=True,
            padding="longest",
            return_tensors="pt"
        ).to(device)

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

        translations = processor.postprocess_batch(
            decoded,
            lang="eng_Latn"
        )

        return {
            "success": True,
            "english_text": translations[0]
        }

    except Exception as e:
        message = str(e)
        if "gated repo" in message.lower() or "access is restricted" in message.lower():
            message = (
                f"Access to {MODEL_NAME} is restricted. Request model access and "
                "authenticate with an authorized Hugging Face account using HF_TOKEN."
            )
        return {
            "success": False,
            "error": message
        }
