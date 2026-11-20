import assert from "node:assert/strict";
import test from "node:test";

import {
  hasSummaryContent,
  mapSummaryResponse,
} from "./summaryMapping.js";

test("maps the backend summary response to the bilingual view model", () => {
  const mapped = mapSummaryResponse({
    success: true,
    summary: {
      kannada_summary: "ಕನ್ನಡ ಸಾರಾಂಶ",
      english_summary: "English summary",
      key_points: ["ಮುಖ್ಯ ಅಂಶ", "Second point"],
      summary_source: "gemini",
      important_details: [
        { label: "Deadline", value: "30 June" },
        "Additional detail",
      ],
    },
  });

  assert.equal(mapped.kn.overview, "ಕನ್ನಡ ಸಾರಾಂಶ");
  assert.equal(mapped.en.overview, "English summary");
  assert.deepEqual(mapped.keyPoints, ["ಮುಖ್ಯ ಅಂಶ", "Second point"]);
  assert.deepEqual(mapped.importantDetails, [
    "Deadline: 30 June",
    "Additional detail",
  ]);
  assert.equal(mapped.summarySource, "gemini");
  assert.equal(hasSummaryContent(mapped), true);
});

test("maps the local summary source", () => {
  const mapped = mapSummaryResponse({
    success: true,
    summary: {
      kannada_summary: "ಸ್ಥಳೀಯ ಸಾರಾಂಶ",
      summary_source: "local",
    },
  });

  assert.equal(mapped.summarySource, "local");
});

test("normalizes missing and empty backend fields without inventing content", () => {
  const mapped = mapSummaryResponse({
    kannada_summary: " ",
    english_summary: null,
    key_points: [],
    important_details: null,
  });

  assert.equal(mapped.kn.overview, "");
  assert.equal(mapped.en.overview, "");
  assert.deepEqual(mapped.keyPoints, []);
  assert.deepEqual(mapped.importantDetails, []);
  assert.equal(hasSummaryContent(mapped), false);
});

test("preserves existing bilingual sample summary shapes", () => {
  const mapped = mapSummaryResponse({
    kn: { overview: "ಕನ್ನಡ", importantPoints: ["ಅಂಶ"] },
    en: { overview: "English", importantPoints: ["Point"] },
  });

  assert.equal(mapped.kn.overview, "ಕನ್ನಡ");
  assert.equal(mapped.en.overview, "English");
  assert.deepEqual(mapped.kn.importantPoints, ["ಅಂಶ"]);
  assert.deepEqual(mapped.en.importantPoints, ["Point"]);
  assert.equal(hasSummaryContent(mapped), true);
});
