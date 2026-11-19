import logging
import os
from pathlib import Path
from typing import Any

from dotenv import load_dotenv


LOGGER = logging.getLogger(__name__)
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")


def explain_analysis(analysis: dict[str, Any]) -> str:
    """Optionally expand the rule-based explanation with Gemini."""
    fallback = analysis["explanation"]
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return fallback

    try:
        import httpx2 as httpx
        from google import genai
        from google.genai.errors import APIError
    except ImportError:
        LOGGER.warning(
            "Gemini explanation is configured but google-genai is unavailable"
        )
        return fallback

    evidence_summary = {
        region: {
            "verified_expression_count": details["verified_expression_count"],
            "unverified_expression_count": details["unverified_expression_count"],
            "shared_expression_count": details["shared_expression_count"],
        }
        for region, details in analysis["regional_evidence"].items()
    }
    prompt = (
        "Explain this Kannada regional-identification result in one or two short "
        "sentences. Do not change the result, infer Standard Kannada, translate "
        "text, or introduce vocabulary or facts not present in the evidence. "
        "Dataset-region labels are not proof of dialect usage. If the result is "
        "unknown, say evidence is insufficient. Return only the explanation.\n"
        f"Result: {analysis['identified_variety']}\n"
        f"Confidence: {analysis['confidence']}\n"
        f"Evidence counts: {evidence_summary}"
    )

    try:
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model=os.getenv("GEMINI_MODEL", "gemini-2.0-flash"),
            contents=prompt,
        )
        generated = response.text
    except (APIError, httpx.HTTPError, OSError, TimeoutError, ValueError):
        LOGGER.exception("Gemini explanation request failed; using rule-based text")
        return fallback

    if not generated or not generated.strip():
        LOGGER.warning("Gemini returned an empty explanation; using rule-based text")
        return fallback
    return generated.strip()


def generate_standard_kannada(text: str) -> str | None:
    """Generate a clearly attributable Standard Kannada rendering when configured."""
    if not text or not text.strip():
        return None

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None

    try:
        import httpx2 as httpx
        from google import genai
        from google.genai.errors import APIError
    except ImportError:
        LOGGER.warning(
            "Standard Kannada generation is configured but google-genai is unavailable"
        )
        return None

    prompt = (
        "Rewrite the Kannada text below in clear Standard Kannada while "
        "preserving its meaning. Do not add information, infer regional facts, "
        "or claim the rendering is from the source. If an equivalent cannot be "
        "produced without guessing, return exactly UNAVAILABLE. Return only the "
        "Kannada rendering or UNAVAILABLE.\n"
        f"Text: {text}"
    )

    try:
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model=os.getenv("GEMINI_MODEL", "gemini-2.0-flash"),
            contents=prompt,
        )
        generated = response.text
    except (APIError, httpx.HTTPError, OSError, TimeoutError, ValueError):
        LOGGER.exception("Standard Kannada generation failed")
        return None

    if not generated or not generated.strip():
        LOGGER.warning("Gemini returned an empty Standard Kannada rendering")
        return None

    generated = generated.strip()
    if generated.casefold() == "unavailable" or not any(
        0x0C80 <= ord(character) <= 0x0CFF for character in generated
    ):
        return None
    return generated