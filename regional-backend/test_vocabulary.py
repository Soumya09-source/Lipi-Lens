import asyncio
import json
import unicodedata
import unittest
from unittest.mock import patch

from main import app
from routes.regional import AnalysisRequest
from services.dialect_service import analyze_dialect
from services.enrichment_service import enrich_matched_expressions
from services.vocabulary_service import (
    find_expression_matches,
    load_paragraphs,
)


class EnrichmentServiceTests(unittest.TestCase):
    def test_dataset_meanings_are_preserved_and_marked_as_dataset(self) -> None:
        match = next(
            item
            for item in find_expression_matches("ಸುಳ್ಳುಪಳ್ಳು")
            if item["dataset_type"] == "word"
        )
        source_standard = match["standard_kannada"]
        source_english = match["english_meaning"]

        with (
            patch(
                "services.enrichment_service.generate_standard_kannada"
            ) as generate_standard,
            patch("services.enrichment_service._translate_to_english") as translate,
        ):
            enriched = enrich_matched_expressions([match], "ಸುಳ್ಳುಪಳ್ಳು")[0]

        generate_standard.assert_not_called()
        translate.assert_not_called()
        self.assertEqual(enriched["standard_kannada"], source_standard)
        self.assertEqual(enriched["english_meaning"], source_english)
        self.assertEqual(enriched["standard_kannada_source"], "dataset")
        self.assertEqual(enriched["english_meaning_source"], "dataset")
        self.assertEqual(enriched["translation_source"], "dataset")

    def test_generated_meanings_are_labeled_per_field(self) -> None:
        match = next(
            item
            for item in find_expression_matches("ನಾನೂ ಒಬ್ಬ ವಿದ್ಯಾವಂತನೇ.")
            if item["dataset_type"] == "sentence"
        )

        with (
            patch(
                "services.enrichment_service.generate_standard_kannada",
                return_value="AI-generated standard Kannada",
            ),
            patch(
                "services.enrichment_service._translate_to_english",
                return_value="AI-generated English meaning",
            ),
        ):
            enriched = enrich_matched_expressions(
                [match], "ನಾನೂ ಒಬ್ಬ ವಿದ್ಯಾವಂತನೇ."
            )[0]

        self.assertEqual(
            enriched["standard_kannada"], "AI-generated standard Kannada"
        )
        self.assertEqual(
            enriched["english_meaning"], "AI-generated English meaning"
        )
        self.assertEqual(enriched["standard_kannada_source"], "AI-generated")
        self.assertEqual(enriched["english_meaning_source"], "AI-generated")
        self.assertEqual(enriched["translation_source"], "AI-generated")

    def test_failed_generators_mark_missing_meanings_unavailable(self) -> None:
        match = next(
            item
            for item in find_expression_matches("ನಾನೂ ಒಬ್ಬ ವಿದ್ಯಾವಂತನೇ.")
            if item["dataset_type"] == "sentence"
        )

        with (
            patch(
                "services.enrichment_service.generate_standard_kannada",
                return_value=None,
            ),
            patch(
                "services.enrichment_service._translate_to_english",
                return_value=None,
            ),
        ):
            enriched = enrich_matched_expressions(
                [match], "ನಾನೂ ಒಬ್ಬ ವಿದ್ಯಾವಂತನೇ."
            )[0]

        self.assertIsNone(enriched["standard_kannada"])
        self.assertIsNone(enriched["english_meaning"])
        self.assertEqual(enriched["standard_kannada_source"], "unavailable")
        self.assertEqual(enriched["english_meaning_source"], "unavailable")
        self.assertEqual(enriched["translation_source"], "unavailable")


class VocabularyServiceTests(unittest.TestCase):
    def test_expression_matches_punctuation_but_not_substrings(self) -> None:
        matches = find_expression_matches("ಇಂದು, ಮ್ಯಾಲ ಇದೆ; ಅಮ್ಯಾಲ ಪದವಲ್ಲ.")
        expressions = [match["expression"] for match in matches]

        self.assertIn("ಮ್ಯಾಲ", expressions)
        self.assertEqual(expressions.count("ಮ್ಯಾಲ"), 2)
        vocabulary_matches = [
            match for match in matches if match["expression"] == "ಮ್ಯಾಲ"
        ]
        self.assertTrue(all(match["occurrences"] == 1 for match in matches))
        self.assertTrue(
            all(match["dataset_type"] == "word" for match in vocabulary_matches)
        )

    def test_sentence_containing_known_vocabulary_matches_word_record(self) -> None:
        matches = find_expression_matches("ಇಂದು, ಮ್ಯಾಲ ಇದೆ.")
        vocabulary_match = next(
            match
            for match in matches
            if match["dataset_type"] == "word" and match["expression"] == "ಮ್ಯಾಲ"
        )

        self.assertEqual(vocabulary_match["occurrences"], 1)

    def test_exact_sentence_matches_with_punctuation_variations(self) -> None:
        query = unicodedata.normalize("NFD", "ನಾನೂ, ಒಬ್ಬ ವಿದ್ಯಾವಂತನೇ")
        matches = find_expression_matches(f"“{query}!”")
        sentence = next(
            match
            for match in matches
            if match["dataset_type"] == "sentence"
            and match["original_text"] == "ನಾನೂ ಒಬ್ಬ ವಿದ್ಯಾವಂತನೇ."
        )

        self.assertEqual(sentence["region"], "coastal")
        self.assertEqual(sentence["verification_status"], "unverified")
        self.assertTrue(sentence["source"])

    def test_exact_paragraph_matches_with_source_metadata(self) -> None:
        paragraph = next(
            record
            for record in load_paragraphs()
            if record["id"] == "coastal_paragraph_00001"
        )
        matches = find_expression_matches(paragraph["text"])
        paragraph_match = next(
            match
            for match in matches
            if match["dataset_type"] == "paragraph"
            and match["entry_id"] == paragraph["original_id"]
        )

        self.assertEqual(paragraph_match["original_text"], paragraph["text"])
        self.assertEqual(paragraph_match["region"], "coastal")
        self.assertEqual(paragraph_match["verification_status"], "unverified")
        self.assertEqual(paragraph_match["source"], paragraph["source"])

    def test_shared_unverified_expression_does_not_identify_a_region(self) -> None:
        result = analyze_dialect("ಸೋಮಪ್ಪರ ಮೂಗಿನ ಮ್ಯಾಲ")
        shared_matches = [
            match for match in result["matched_expressions"] if match["is_shared"]
        ]

        self.assertEqual(result["identified_variety"], "unknown")
        self.assertEqual({match["region"] for match in shared_matches}, {
            "north_karnataka",
            "mysuru",
        })
        self.assertEqual(
            result["regional_evidence"]["north_karnataka"]["shared_expression_count"],
            1,
        )

    def test_unverified_region_specific_expression_is_only_a_candidate(self) -> None:
        result = analyze_dialect("ಸುಳ್ಳುಪಳ್ಳು")

        self.assertEqual(result["identified_variety"], "unknown")
        self.assertEqual(
            result["regional_evidence"]["coastal"]["unverified_expression_count"],
            1,
        )

    def test_unverified_sentence_match_keeps_classification_unknown(self) -> None:
        result = analyze_dialect("ನಾನೂ ಒಬ್ಬ ವಿದ್ಯಾವಂತನೇ.")
        sentence_matches = [
            match
            for match in result["matched_expressions"]
            if match["dataset_type"] == "sentence"
        ]

        self.assertTrue(sentence_matches)
        self.assertTrue(
            all(
                match["verification_status"] == "unverified"
                for match in sentence_matches
            )
        )
        self.assertEqual(result["identified_variety"], "unknown")

    def test_multiple_verified_region_specific_expressions_can_classify(self) -> None:
        matches = [
            {"expression": "first", "region": "coastal", "verification_status": "verified"},
            {"expression": "second", "region": "coastal", "verification_status": "verified"},
        ]
        with patch(
            "services.dialect_service.analyze_vocabulary",
            return_value={"matches": matches},
        ):
            result = analyze_dialect("sample")

        self.assertEqual(result["identified_variety"], "coastal")
        self.assertEqual(result["confidence"], "medium")

    def test_shared_verified_expressions_are_not_region_specific(self) -> None:
        matches = [
            {"expression": "shared", "region": "coastal", "verification_status": "verified"},
            {"expression": "shared", "region": "mysuru", "verification_status": "verified"},
            {"expression": "other", "region": "coastal", "verification_status": "verified"},
        ]
        with patch(
            "services.dialect_service.analyze_vocabulary",
            return_value={"matches": matches},
        ):
            result = analyze_dialect("sample")

        self.assertEqual(result["identified_variety"], "unknown")


async def _post_json(path: str, payload: object) -> tuple[int, dict[str, object]]:
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    messages: list[dict[str, object]] = []
    received = False

    async def receive() -> dict[str, object]:
        nonlocal received
        if received:
            return {"type": "http.disconnect"}
        received = True
        return {"type": "http.request", "body": body, "more_body": False}

    async def send(message: dict[str, object]) -> None:
        messages.append(message)

    scope = {
        "type": "http",
        "asgi": {"version": "3.0", "spec_version": "2.3"},
        "http_version": "1.1",
        "method": "POST",
        "scheme": "http",
        "path": path,
        "raw_path": path.encode("ascii"),
        "query_string": b"",
        "root_path": "",
        "headers": [
            (b"host", b"testserver"),
            (b"content-type", b"application/json"),
        ],
        "client": ("testclient", 50000),
        "server": ("testserver", 80),
    }
    await app(scope, receive, send)
    status = next(
        message["status"]
        for message in messages
        if message["type"] == "http.response.start"
    )
    response_body = b"".join(
        message.get("body", b"")
        for message in messages
        if message["type"] == "http.response.body"
    )
    return int(status), json.loads(response_body)


class RegionalApiTests(unittest.TestCase):
    def test_analyse_endpoint_returns_kannada_unknown_response(self) -> None:
        status, response = asyncio.run(
            _post_json(
                "/api/regional/analyse",
                {"text": "ಇಂದು ನಾನು ಶಾಲೆಗೆ ಹೋಗುತ್ತಿದ್ದೇನೆ."},
            )
        )

        self.assertEqual(status, 200)
        self.assertTrue(response["success"])
        self.assertEqual(response["detected_language"], "Kannada")
        self.assertEqual(response["identified_variety"], "unknown")
        self.assertEqual(response["confidence"], "low")
        self.assertEqual(response["matched_expressions"], [])
        self.assertIn("coastal", response["regional_evidence"])

    def test_analyse_endpoint_returns_sentence_match_metadata(self) -> None:
        with (
            patch(
                "services.enrichment_service.generate_standard_kannada",
                return_value=None,
            ),
            patch(
                "services.enrichment_service._translate_to_english",
                return_value=None,
            ),
        ):
            status, response = asyncio.run(
                _post_json(
                    "/api/regional/analyse",
                    {"text": "ನಾನೂ ಒಬ್ಬ ವಿದ್ಯಾವಂತನೇ."},
                )
            )

        self.assertEqual(status, 200)
        sentence = next(
            match
            for match in response["matched_expressions"]
            if match["dataset_type"] == "sentence"
            and match["original_text"] == "ನಾನೂ ಒಬ್ಬ ವಿದ್ಯಾವಂತನೇ."
        )
        self.assertEqual(sentence["region"], "coastal")
        self.assertEqual(sentence["verification_status"], "unverified")
        self.assertTrue(sentence["source"])
        self.assertIsNone(sentence["standard_kannada"])
        self.assertIsNone(sentence["english_meaning"])
        self.assertEqual(sentence["translation_source"], "unavailable")
        self.assertEqual(sentence["standard_kannada_source"], "unavailable")
        self.assertEqual(sentence["english_meaning_source"], "unavailable")

    def test_analyse_endpoint_returns_paragraph_match_metadata(self) -> None:
        paragraph = load_paragraphs()[0]
        with (
            patch(
                "services.enrichment_service.generate_standard_kannada",
                return_value=None,
            ),
            patch(
                "services.enrichment_service._translate_to_english",
                return_value=None,
            ),
        ):
            status, response = asyncio.run(
                _post_json("/api/regional/analyse", {"text": paragraph["text"]})
            )

        self.assertEqual(status, 200)
        paragraph_match = next(
            match
            for match in response["matched_expressions"]
            if match["dataset_type"] == "paragraph"
            and match["entry_id"] == paragraph["original_id"]
        )
        self.assertEqual(paragraph_match["original_text"], paragraph["text"])
        self.assertEqual(paragraph_match["region"], paragraph["region"])
        self.assertEqual(paragraph_match["source"], paragraph["source"])

    def test_analyse_endpoint_rejects_blank_text(self) -> None:
        status, response = asyncio.run(
            _post_json("/api/regional/analyse", {"text": "   "})
        )

        self.assertEqual(status, 422)
        self.assertIn("detail", response)

    def test_request_validation_enforces_text_length(self) -> None:
        with self.assertRaises(ValueError):
            AnalysisRequest(text="x" * 10_001)


if __name__ == "__main__":
    unittest.main()
