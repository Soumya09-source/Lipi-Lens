import json
import unicodedata
from functools import lru_cache
from pathlib import Path
from typing import Any


BASE_DIR = Path(__file__).resolve().parent.parent
VOCABULARY_PATH = BASE_DIR / "data" / "processed" / "regional_words.json"
SENTENCES_PATH = BASE_DIR / "data" / "processed" / "regional_sentences.json"
PARAGRAPHS_PATH = BASE_DIR / "data" / "processed" / "regional_paragraphs.json"


def normalize_text(text: str) -> str:
    """Normalize Unicode and whitespace without changing Kannada text."""
    if not isinstance(text, str):
        raise TypeError("text must be a string")
    return " ".join(unicodedata.normalize("NFC", text).split())


@lru_cache(maxsize=3)
def _read_dataset(path: Path) -> tuple[dict[str, Any], ...]:
    if not path.is_file():
        raise FileNotFoundError(f"Regional dataset file not found: {path}")

    with path.open(encoding="utf-8") as file:
        records = json.load(file)

    if not isinstance(records, list) or not all(
        isinstance(entry, dict) for entry in records
    ):
        raise ValueError(f"Expected a JSON list of objects in {path}")
    return tuple(records)


def load_vocabulary() -> list[dict[str, Any]]:
    """Load vocabulary records once while returning a fresh list to callers."""
    return list(_read_dataset(VOCABULARY_PATH))


def load_sentences() -> list[dict[str, Any]]:
    """Load complete sentence records from the processed regional dataset."""
    return list(_read_dataset(SENTENCES_PATH))


def load_paragraphs() -> list[dict[str, Any]]:
    """Load complete paragraph records from the processed regional dataset."""
    return list(_read_dataset(PARAGRAPHS_PATH))


def _is_word_character(character: str) -> bool:
    category = unicodedata.category(character)
    return character == "_" or character.isalnum() or category.startswith("M")


def normalize_for_matching(text: str) -> str:
    normalized = normalize_text(text).casefold()
    without_punctuation = "".join(
        " " if unicodedata.category(character).startswith("P") else character
        for character in normalized
    )
    return " ".join(without_punctuation.split())


def _find_occurrences(normalized_text: str, normalized_expression: str) -> int:
    count = 0
    start = 0

    while (index := normalized_text.find(normalized_expression, start)) != -1:
        end = index + len(normalized_expression)
        left_is_word = index > 0 and _is_word_character(normalized_text[index - 1])
        right_is_word = end < len(normalized_text) and _is_word_character(
            normalized_text[end]
        )
        if not left_is_word and not right_is_word:
            count += 1
        start = end

    return count


def find_expression_matches(text: str) -> list[dict[str, Any]]:
    """Find matching words, complete sentences, and paragraphs with provenance."""
    normalized_text = normalize_for_matching(text)
    matches = []
    datasets = (
        ("word", "expression", load_vocabulary()),
        ("sentence", "text", load_sentences()),
        ("paragraph", "text", load_paragraphs()),
    )

    for dataset_type, text_field, records in datasets:
        for entry in records:
            original_text = entry.get(text_field)
            if not isinstance(original_text, str) or not original_text.strip():
                continue

            normalized_expression = normalize_for_matching(original_text)
            if not normalized_expression:
                continue

            occurrences = _find_occurrences(normalized_text, normalized_expression)
            if not occurrences:
                continue

            matches.append(
                {
                    "expression": original_text,
                    "original_text": original_text,
                    "dataset_type": dataset_type,
                    "standard_kannada": entry.get("standard_kannada"),
                    "english_meaning": entry.get("english_meaning"),
                    "region": entry.get("dataset_region") or entry.get("region"),
                    "source_region": entry.get("source_region"),
                    "dataset_region": entry.get("dataset_region"),
                    "locality": entry.get("locality"),
                    "verification_status": entry.get(
                        "verification_status", "unverified"
                    ),
                    "source": entry.get("source"),
                    "source_page": entry.get("source_page"),
                    "occurrences": occurrences,
                    "entry_id": entry.get("original_id") or entry.get("id"),
                }
            )

    return matches


def group_matches_by_region(
    matches: list[dict[str, Any]],
) -> dict[str, list[dict[str, Any]]]:
    regional_matches: dict[str, list[dict[str, Any]]] = {}
    for match in matches:
        region = match.get("region")
        if region:
            regional_matches.setdefault(region, []).append(match)
    return regional_matches


def analyze_vocabulary(text: str) -> dict[str, Any]:
    """Return exact expression matches and their dataset-region groupings."""
    matches = find_expression_matches(text)
    return {
        "total_matches": len(matches),
        "matches": matches,
        "regional_matches": group_matches_by_region(matches),
    }
