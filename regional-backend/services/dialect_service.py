from collections import defaultdict
from typing import Any

from services.vocabulary_service import analyze_vocabulary, normalize_for_matching


REGION_LABELS = {
    "coastal": "Coastal Kannada",
    "north_karnataka": "North Karnataka Kannada",
    "mysuru": "Mysuru Kannada",
}
VERIFIED_STATUS = "verified"
UNVERIFIED_WEIGHT = 0.1
MIN_VERIFIED_EXPRESSIONS = 2


def _is_verified(match: dict[str, Any]) -> bool:
    status = match.get("verification_status")
    return isinstance(status, str) and status.strip().casefold() == VERIFIED_STATUS


def _group_by_expression(
    matches: list[dict[str, Any]],
) -> dict[str, list[dict[str, Any]]]:
    grouped: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for match in matches:
        expression = (
            match.get("original_text")
            or match["expression"]
        )
        grouped[normalize_for_matching(expression)].append(match)
    return dict(grouped)


def analyze_dialect(text: str) -> dict[str, Any]:
    """Assess regional candidates without treating dataset labels as proof."""
    analysis = analyze_vocabulary(text)
    matches = analysis["matches"]
    expression_groups = _group_by_expression(matches)

    for expression_matches in expression_groups.values():
        regions = sorted(
            {
                match["region"]
                for match in expression_matches
                if match.get("region") in REGION_LABELS
            }
        )
        shared = len(regions) > 1
        for match in expression_matches:
            match["candidate_regions"] = regions
            match["is_shared"] = shared
            match["is_region_specific"] = not shared and len(regions) == 1

    evidence: dict[str, dict[str, Any]] = {
        region: {
            "label": label,
            "matched_expressions": [],
            "verified_expression_count": 0,
            "unverified_expression_count": 0,
            "shared_expression_count": 0,
            "evidence_score": 0.0,
            "candidate_only": True,
        }
        for region, label in REGION_LABELS.items()
    }

    region_expressions: dict[str, dict[str, bool]] = {
        region: {} for region in REGION_LABELS
    }
    for expression_key, expression_matches in expression_groups.items():
        expression = (
            expression_matches[0].get("original_text")
            or expression_matches[0]["expression"]
        )
        regions = {
            match.get("region")
            for match in expression_matches
            if match.get("region") in REGION_LABELS
        }
        shared = len(regions) > 1

        for region in regions:
            region_matches = [
                match for match in expression_matches if match.get("region") == region
            ]
            verified = any(_is_verified(match) for match in region_matches)
            evidence[region]["matched_expressions"].append(
                {
                    "expression": expression,
                    "shared": shared,
                    "verification_status": (
                        VERIFIED_STATUS if verified else "unverified"
                    ),
                    "entry_ids": [
                        match.get("entry_id") for match in region_matches
                    ],
                    "sources": [match.get("source") for match in region_matches],
                }
            )
            if shared:
                evidence[region]["shared_expression_count"] += 1
            else:
                region_expressions[region][expression_key] = verified

    for region, expressions in region_expressions.items():
        verified_count = sum(expressions.values())
        unverified_count = len(expressions) - verified_count
        evidence[region]["verified_expression_count"] = verified_count
        evidence[region]["unverified_expression_count"] = unverified_count
        evidence[region]["evidence_score"] = round(
            verified_count + unverified_count * UNVERIFIED_WEIGHT, 2
        )

    verified_counts = {
        region: details["verified_expression_count"]
        for region, details in evidence.items()
    }
    ranked_regions = sorted(
        verified_counts, key=verified_counts.__getitem__, reverse=True
    )
    best_region = ranked_regions[0]
    best_count = verified_counts[best_region]
    second_count = verified_counts[ranked_regions[1]]

    identified_variety = "unknown"
    confidence = "low"
    if (
        best_count >= MIN_VERIFIED_EXPRESSIONS
        and best_count - second_count >= 2
    ):
        identified_variety = best_region
        confidence = (
            "high"
            if best_count >= 5 and best_count - second_count >= 3
            else "medium"
        )
        evidence[best_region]["candidate_only"] = False

    return {
        "identified_variety": identified_variety,
        "confidence": confidence,
        "matched_expressions": matches,
        "regional_evidence": evidence,
        "explanation": _build_explanation(
            matches, identified_variety, confidence
        ),
    }


def _build_explanation(
    matches: list[dict[str, Any]], variety: str, confidence: str
) -> str:
    if variety != "unknown":
        return (
            f"{REGION_LABELS[variety]} is a tentative match based on multiple "
            f"verified, region-specific expressions ({confidence} confidence)."
        )
    if not matches:
        return (
            "No dataset expressions matched. The reference corpus does "
            "not support a regional or Standard Kannada classification."
        )
    return (
        "Expressions matched, but the available entries are unverified or shared "
        "across regions. Dataset source labels are not proof of dialect usage; "
        "therefore the result is unknown. Standard Kannada is not inferred from "
        "missing regional matches."
    )