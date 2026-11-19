import logging
import os
from typing import Any, Literal

import requests

from services.ai_service import generate_standard_kannada
from services.vocabulary_service import normalize_for_matching


LOGGER = logging.getLogger(__name__)
TranslationSource = Literal["dataset", "AI-generated", "unavailable"]
TRANSLATION_API_URL = os.getenv(
    "REGIONAL_TRANSLATION_API_URL",
    "http://127.0.0.1:5000/api/translate",
)
TRANSLATION_TIMEOUT_SECONDS = 12


def _translate_to_english(text: str) -> str | None:
    try:
        response = requests.post(
            TRANSLATION_API_URL,
            json={"kannada_text": text},
            timeout=TRANSLATION_TIMEOUT_SECONDS,
        )
        response.raise_for_status()
        payload = response.json()
    except requests.RequestException:
        LOGGER.warning("Local translation service request failed", exc_info=True)
        return None
    except ValueError:
        LOGGER.warning("Local translation service returned invalid JSON", exc_info=True)
        return None

    if not isinstance(payload, dict) or not payload.get("success"):
        LOGGER.warning("Local translation service did not return a translation")
        return None

    translation = payload.get("english_text")
    return translation.strip() if isinstance(translation, str) and translation.strip() else None


def _has_value(value: object) -> bool:
    return isinstance(value, str) and bool(value.strip())


def _translation_source(
    standard_source: TranslationSource,
    english_source: TranslationSource,
) -> TranslationSource:
    if "AI-generated" in (standard_source, english_source):
        return "AI-generated"
    if "dataset" in (standard_source, english_source):
        return "dataset"
    return "unavailable"


def enrich_matched_expressions(
    matches: list[dict[str, Any]], input_text: str
) -> list[dict[str, Any]]:
    """Fill missing meanings only for a complete match, retaining per-field provenance."""
    normalized_input = normalize_for_matching(input_text)
    enriched_matches = []

    for match in matches:
        enriched = dict(match)
        original_text = enriched.get("original_text") or enriched.get("expression") or ""
        is_complete_match = (
            bool(normalized_input)
            and normalize_for_matching(original_text) == normalized_input
        )

        standard_source: TranslationSource = (
            "dataset" if _has_value(enriched.get("standard_kannada")) else "unavailable"
        )
        english_source: TranslationSource = (
            "dataset" if _has_value(enriched.get("english_meaning")) else "unavailable"
        )

        if is_complete_match and standard_source == "unavailable":
            standard = generate_standard_kannada(original_text)
            if _has_value(standard):
                enriched["standard_kannada"] = standard
                standard_source = "AI-generated"

        if is_complete_match and english_source == "unavailable":
            english = _translate_to_english(original_text)
            if _has_value(english):
                enriched["english_meaning"] = english
                english_source = "AI-generated"

        enriched["standard_kannada_source"] = standard_source
        enriched["english_meaning_source"] = english_source
        enriched["translation_source"] = _translation_source(
            standard_source, english_source
        )
        enriched_matches.append(enriched)

    return enriched_matches
