
import json
import os
import re
import sqlite3
import unicodedata

import yaml


# --------------------------------------------------
# PATH CONFIGURATION
# --------------------------------------------------

BACKEND_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

YAML_PATH = os.path.join(
    BACKEND_DIR,
    "data",
    "alar-dataset",
    "alar.yml"
)

DB_PATH = os.path.join(
    BACKEND_DIR,
    "data",
    "alar_dictionary.sqlite3"
)


# --------------------------------------------------
# WORD NORMALIZATION
# --------------------------------------------------

def normalize_word(word):
    """Normalize Kannada words for dictionary lookup."""

    word = unicodedata.normalize("NFC", word.strip())

    return re.sub(
        r"[^\u0C80-\u0CFF]",
        "",
        word
    )


# --------------------------------------------------
# BUILD SQLITE DICTIONARY
# --------------------------------------------------

def build_dictionary():
    """Build SQLite database from Alar YAML dataset."""

    if not os.path.exists(YAML_PATH):
        raise FileNotFoundError(
            f"Alar dictionary dataset not found: {YAML_PATH}"
        )

    if (
        os.path.exists(DB_PATH)
        and os.path.getmtime(DB_PATH) >= os.path.getmtime(YAML_PATH)
    ):
        return

    os.makedirs(
        os.path.dirname(DB_PATH),
        exist_ok=True
    )

    print("Building local Kannada dictionary...")

    with open(YAML_PATH, "r", encoding="utf-8") as file:
        entries = yaml.safe_load(file)

    connection = sqlite3.connect(DB_PATH)

    try:
        connection.execute("""
            CREATE TABLE IF NOT EXISTS dictionary (
                word TEXT PRIMARY KEY,
                definitions TEXT
            )
        """)

        connection.execute("DELETE FROM dictionary")

        for index, item in enumerate(entries):

            word = normalize_word(item.get("entry", ""))

            if not word:
                continue

            definitions = []

            for definition in item.get("defs", []) or []:

                meaning = definition.get("entry", "").strip()

                part_of_speech = definition.get(
                    "type", ""
                ).strip()

                if meaning:
                    definitions.append({
                        "meaning": meaning,
                        "type": part_of_speech
                    })

            if not definitions:
                continue

            existing = connection.execute(
                """
                SELECT definitions
                FROM dictionary
                WHERE word = ?
                """,
                (word,)
            ).fetchone()

            if existing:
                old_definitions = json.loads(existing[0])
                definitions = old_definitions + definitions

            # Remove duplicate definitions.
            unique = {}

            for definition in definitions:

                key = (
                    definition["meaning"].strip().lower(),
                    definition["type"].strip().lower()
                )

                unique[key] = definition

            definitions = list(unique.values())

            connection.execute(
                """
                INSERT OR REPLACE INTO dictionary
                (word, definitions)
                VALUES (?, ?)
                """,
                (
                    word,
                    json.dumps(
                        definitions,
                        ensure_ascii=False
                    )
                )
            )

            # Commit periodically to avoid a huge transaction.
            if index % 5000 == 0:
                connection.commit()
                print(f"Processed {index} dictionary entries...")

        connection.execute("""
            CREATE INDEX IF NOT EXISTS idx_dictionary_word
            ON dictionary(word)
        """)

        connection.commit()

        print("Kannada dictionary built successfully!")

    finally:
        connection.close()


# --------------------------------------------------
# LOOKUP KANNADA WORD
# --------------------------------------------------

def lookup_word(word):
    """Return English definitions for a Kannada word."""

    word = normalize_word(word)

    if not word:
        return None

    if not os.path.exists(DB_PATH):
        build_dictionary()

    connection = sqlite3.connect(DB_PATH)

    try:
        result = connection.execute(
            """
            SELECT definitions
            FROM dictionary
            WHERE word = ?
            """,
            (word,)
        ).fetchone()

        if not result:
            return None

        definitions = json.loads(result[0])

        # Return only the first 5 definitions.
        return definitions[:5]

    finally:
        connection.close()
