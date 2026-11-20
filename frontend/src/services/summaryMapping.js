const isRecord = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const textValue = (value) => (typeof value === "string" ? value.trim() : "");

const formatValue = (value) => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map(formatValue).filter(Boolean).join(", ");
  }
  if (isRecord(value)) {
    const label = formatValue(value.label);
    const detail = formatValue(value.value);
    if (label || detail) return [label, detail].filter(Boolean).join(": ");

    return Object.entries(value)
      .map(([key, item]) => {
        const formatted = formatValue(item);
        return formatted ? `${key}: ${formatted}` : "";
      })
      .filter(Boolean)
      .join("; ");
  }
  return "";
};

const normalizeList = (value) => {
  const items = Array.isArray(value) ? value : value == null ? [] : [value];
  return items.map(formatValue).filter(Boolean);
};

const normalizeSection = (section) => {
  if (!isRecord(section)) return null;

  return {
    overview: textValue(section.overview),
    importantPoints: normalizeList(section.importantPoints),
    datesAndDeadlines: Array.isArray(section.datesAndDeadlines)
      ? section.datesAndDeadlines.filter(isRecord)
      : [],
    amountsAndNumbers: Array.isArray(section.amountsAndNumbers)
      ? section.amountsAndNumbers.filter(isRecord)
      : [],
    namesAndOrganizations: normalizeList(section.namesAndOrganizations),
    importantInstructions: normalizeList(section.importantInstructions),
  };
};

export const mapSummaryResponse = (rawResponse) => {
  if (!isRecord(rawResponse)) return null;

  const data = isRecord(rawResponse.summary) ? rawResponse.summary : rawResponse;
  const hasBackendShape = [
    "kannada_summary",
    "english_summary",
    "key_points",
    "important_details",
  ].some((key) => Object.prototype.hasOwnProperty.call(data, key));

  let kn = normalizeSection(data.kn || data.kannada);
  let en = normalizeSection(data.en || data.english);

  if (hasBackendShape) {
    kn = normalizeSection({ overview: data.kannada_summary });
    en = normalizeSection({ overview: data.english_summary });
  } else {
    if (!kn && (data.overview || data.importantPoints)) {
      kn = normalizeSection(data);
    }

    if (!en && (data.overview_en || data.overviewEn)) {
      en = normalizeSection({
        overview: data.overview_en || data.overviewEn,
        importantPoints: data.importantPoints_en || data.importantPointsEn,
        datesAndDeadlines:
          data.datesAndDeadlines_en || data.datesAndDeadlinesEn,
        amountsAndNumbers:
          data.amountsAndNumbers_en || data.amountsAndNumbersEn,
        namesAndOrganizations:
          data.namesAndOrganizations_en || data.namesAndOrganizationsEn,
        importantInstructions:
          data.importantInstructions_en || data.importantInstructionsEn,
      });
    }
  }

  return {
    kn,
    en,
    keyPoints: normalizeList(data.key_points ?? data.keyPoints),
    importantDetails: normalizeList(
      data.important_details ?? data.importantDetails,
    ),
    summarySource:
      data.summary_source === "gemini" || data.summary_source === "local"
        ? data.summary_source
        : data.summarySource === "gemini" || data.summarySource === "local"
          ? data.summarySource
          : null,
  };
};

export const hasSummaryContent = (summary) => {
  if (!summary) return false;

  const sectionHasContent = (section) =>
    Boolean(
      section &&
        (section.overview ||
          section.importantPoints.length ||
          section.datesAndDeadlines.length ||
          section.amountsAndNumbers.length ||
          section.namesAndOrganizations.length ||
          section.importantInstructions.length),
    );

  return Boolean(
    sectionHasContent(summary.kn) ||
      sectionHasContent(summary.en) ||
      summary.keyPoints?.length ||
      summary.importantDetails?.length,
  );
};
