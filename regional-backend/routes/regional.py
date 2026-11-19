import logging
import unicodedata
from typing import Any, Literal

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, ConfigDict, Field, field_validator

from services.ai_service import explain_analysis
from services.dialect_service import analyze_dialect
from services.enrichment_service import (
    TranslationSource,
    enrich_matched_expressions,
)


LOGGER = logging.getLogger(__name__)
router = APIRouter(prefix="/api/regional", tags=["regional"])


class AnalysisRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    text: str = Field(min_length=1, max_length=10_000)

    @field_validator("text")
    @classmethod
    def reject_blank_text(cls, value: str) -> str:
        if not value:
            raise ValueError("text must contain at least one non-whitespace character")
        return value


class MatchedExpression(BaseModel):
    expression: str
    original_text: str
    dataset_type: Literal["word", "sentence", "paragraph"]
    standard_kannada: str | None = None
    english_meaning: str | None = None
    standard_kannada_source: TranslationSource = "unavailable"
    english_meaning_source: TranslationSource = "unavailable"
    translation_source: TranslationSource = "unavailable"
    region: str | None = None
    source_region: str | None = None
    dataset_region: str | None = None
    locality: str | None = None
    verification_status: str
    source: str | None = None
    source_page: int | None = None
    occurrences: int
    entry_id: str | int | None = None
    candidate_regions: list[str] = Field(default_factory=list)
    is_shared: bool = False
    is_region_specific: bool = False


class AnalysisResponse(BaseModel):
    success: bool
    detected_language: Literal["Kannada", "unknown"]
    identified_variety: Literal[
        "coastal", "north_karnataka", "mysuru", "unknown"
    ]
    confidence: Literal["low", "medium", "high"]
    matched_expressions: list[MatchedExpression]
    regional_evidence: dict[str, dict[str, Any]]
    explanation: str


def _detect_language(text: str) -> Literal["Kannada", "unknown"]:
    for character in text:
        if (
            0x0C80 <= ord(character) <= 0x0CFF
            and unicodedata.category(character).startswith("L")
        ):
            return "Kannada"
    return "unknown"


@router.post("/analyse", response_model=AnalysisResponse)
def analyse_regional_text(request: AnalysisRequest) -> AnalysisResponse:
    try:
        result = analyze_dialect(request.text)
        result["matched_expressions"] = enrich_matched_expressions(
            result["matched_expressions"], request.text
        )
    except (OSError, ValueError):
        LOGGER.exception("Regional datasets could not be loaded or analyzed")
        raise HTTPException(
            status_code=503,
            detail="Regional analysis data is temporarily unavailable",
        ) from None

    result["explanation"] = explain_analysis(result)
    return AnalysisResponse(
        success=True,
        detected_language=_detect_language(request.text),
        **result,
    )