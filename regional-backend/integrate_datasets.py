import json
from pathlib import Path
from collections import defaultdict
import unicodedata

BASE_DIR = Path(__file__).parent
RAW_DIR = BASE_DIR / "data" / "raw"
PROCESSED_DIR = BASE_DIR / "data" / "processed"
METADATA_DIR = BASE_DIR / "data" / "metadata"

PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
METADATA_DIR.mkdir(parents=True, exist_ok=True)

DATASETS = {
    "coastal": {
        "base": RAW_DIR / "coastal" / "regional_kannada_dataset",
        "vocabulary": "vocabulary/regional_words.json",
        "sentences": "sentences/regional_sentences.json",
        "paragraphs": "paragraphs/regional_paragraphs.json"
    },
    "north_karnataka": {
        "base": RAW_DIR / "north_karnataka",
        "vocabulary": "vocabulary/regional_words.json",
        "sentences": "sentences/regional_sentences.json",
        "paragraphs": "paragraphs/regional_paragraphs.json"
    },
    "mysuru": {
        "base": RAW_DIR / "mysuru",
        "vocabulary": "regional_words.json",
        "sentences": "regional_sentences.json",
        "paragraphs": "regional_paragraphs.json"
    }
}


def load_json(path):
    if not path.exists():
        print(f"WARNING: Missing file: {path}")
        return []

    with open(path, "r", encoding="utf-8") as file:
        data = json.load(file)

    if not isinstance(data, list):
        raise ValueError(f"Expected a JSON list in {path}")

    return data


def normalize_text(text):
    if not isinstance(text, str):
        return ""

    text = unicodedata.normalize("NFC", text)
    return " ".join(text.split())


def load_dataset(region, config, data_type):
    path = config["base"] / config[data_type]
    records = load_json(path)

    for record in records:
        record = dict(record)

        # Preserve the original region label.
        record["source_region"] = record.get("region")

        # Add the dataset's source region without overwriting
        # the original label.
        record["dataset_region"] = region

        record["dataset_type"] = data_type
        record["original_id"] = record.get("id")

        if "text" in record:
            record["normalized_text"] = normalize_text(record["text"])

        if "expression" in record:
            record["normalized_expression"] = normalize_text(
                record["expression"]
            )

        yield record


def collect_records(data_type):
    combined = []

    for region, config in DATASETS.items():
        records = list(load_dataset(region, config, data_type))
        combined.extend(records)

        print(f"{region}: {len(records)} {data_type}")

    return combined


def find_duplicate_expressions(records):
    expression_groups = defaultdict(list)

    for record in records:
        expression = record.get("normalized_expression", "")

        if expression:
            expression_groups[expression].append({
                "id": record.get("original_id"),
                "dataset_region": record.get("dataset_region"),
                "source_region": record.get("source_region"),
                "verification_status": record.get(
                    "verification_status"
                ),
                "source": record.get("source")
            })

    duplicates = []

    for expression, entries in expression_groups.items():
        regions = sorted({
            entry["dataset_region"] for entry in entries
        })

        if len(entries) > 1:
            duplicates.append({
                "expression": expression,
                "occurrences": len(entries),
                "regions": regions,
                "entries": entries
            })

    return duplicates


def save_json(filename, data):
    path = PROCESSED_DIR / filename

    with open(path, "w", encoding="utf-8") as file:
        json.dump(
            data,
            file,
            ensure_ascii=False,
            indent=2
        )

    print(f"Saved: {path}")


def main():
    print("\n========== DATASET INTEGRATION ==========\n")

    vocabulary = collect_records("vocabulary")
    sentences = collect_records("sentences")
    paragraphs = collect_records("paragraphs")

    duplicates = find_duplicate_expressions(vocabulary)

    save_json("regional_words.json", vocabulary)
    save_json("regional_sentences.json", sentences)
    save_json("regional_paragraphs.json", paragraphs)

    report = {
        "dataset_name": "Lipi Lens Regional Kannada Dataset",
        "version": "1.0",
        "regions": {},
        "total_vocabulary": len(vocabulary),
        "total_sentences": len(sentences),
        "total_paragraphs": len(paragraphs),
        "duplicate_expression_groups": len(duplicates),
        "duplicate_expressions": duplicates
    }

    for region, config in DATASETS.items():
        report["regions"][region] = {
            "vocabulary": sum(
                1 for r in vocabulary
                if r["dataset_region"] == region
            ),
            "sentences": sum(
                1 for r in sentences
                if r["dataset_region"] == region
            ),
            "paragraphs": sum(
                1 for r in paragraphs
                if r["dataset_region"] == region
            )
        }

    report_path = METADATA_DIR / "integration_report.json"

    with open(report_path, "w", encoding="utf-8") as file:
        json.dump(report, file, ensure_ascii=False, indent=2)

    print("\n========== INTEGRATION COMPLETE ==========")
    print(f"Vocabulary: {len(vocabulary)}")
    print(f"Sentences: {len(sentences)}")
    print(f"Paragraphs: {len(paragraphs)}")
    print(f"Duplicate groups: {len(duplicates)}")
    print(f"Report: {report_path}")


if __name__ == "__main__":
    main()