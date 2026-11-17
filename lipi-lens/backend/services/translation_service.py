
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from IndicTransToolkit import IndicProcessor

MODEL_NAME = "ai4bharat/indictrans2-indic-en-dist-200M"

device = "cuda" if torch.cuda.is_available() else "cpu"

print(f"Loading IndicTrans2 on {device}...")

tokenizer = AutoTokenizer.from_pretrained(
    MODEL_NAME,
    trust_remote_code=True
)

model = AutoModelForSeq2SeqLM.from_pretrained(
    MODEL_NAME,
    trust_remote_code=True,
    torch_dtype=torch.float16 if device == "cuda" else torch.float32
).to(device)

model.eval()

processor = IndicProcessor(inference=True)

print("IndicTrans2 loaded successfully!")


def translate_kannada_to_english(text):
    if not text or not text.strip():
        return {
            "success": False,
            "error": "No text provided"
        }

    try:
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
        return {
            "success": False,
            "error": str(e)
        }
