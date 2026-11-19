import { createContext, useContext, useState } from "react";

const DocumentContext = createContext();

// Sample documents for instant preview & demonstration
export const SAMPLE_DOCUMENTS = [
  {
    id: "sample-circular",
    title: "ಕರ್ನಾಟಕ ಸರ್ಕಾರ ಕೃಷಿ ಇಲಾಖೆ ಸುತ್ತೋಲೆ (Govt Circular)",
    category: "Government / Official",
    date: "2024-10-15",
    text: `ಕರ್ನಾಟಕ ಸರ್ಕಾರ - ಕೃಷಿ ಇಲಾಖೆ
ಸುತ್ತೋಲೆ ಸಂಖ್ಯೆ: ಕೃಇ/ಯೋ/೨೦೨೪/೪೫೨
ದಿನಾಂಕ: ೧೫ ಅಕ್ಟೋಬರ್ ೨೦೨೪

ವಿಷಯ: ೨೦೨೪-೨೫ನೇ ಸಾಲಿನ ಮುಂಗಾರು ಬೆಳೆ ಹಾನಿ ಪರಿಹಾರ ಮತ್ತು 'ಕೃಷಿ ಭಾಗ್ಯ' ಯೋಜನೆ ಅನುಷ್ಠಾನ ಕುರಿತು.

ರಾಜ್ಯದ ಎಲ್ಲಾ ಜಿಲ್ಲೆಗಳ ಜಂಟಿ ಕೃಷಿ ನಿರ್ದೇಶಕರು ಹಾಗೂ ಸಹಾಯಕ ಕೃಷಿ ನಿರ್ದೇಶಕರಿಗೆ ಈ ಮೂಲಕ ಸೂಚಿಸುವುದೇನೆಂದರೆ, ಇತ್ತೀಚಿನ ಅತಿಯಾದ ಮಳೆಯಿಂದಾಗಿ ಹಾನಿಗೊಳಗಾದ ರೈತರ ಬೆಳೆ ಸಮೀಕ್ಷೆಯನ್ನು ನವೆಂಬರ್ ೧೦ ರೊಳಗೆ ಪೂರ್ಣಗೊಳಿಸಬೇಕು. ಅರ್ಹ ರೈತರ ಖಾತೆಗೆ ನೇರ ನಗದು ವರ್ಗಾವಣೆ (DBT) ಮೂಲಕ ₹೧೨,೫೦೦ ಪ್ರತಿ ಹೆಕ್ಟೇರ್‌ಗೆ ಪರಿಹಾರ ಜಮೆ ಮಾಡಲಾಗುವುದು.

ಮುಖ್ಯ ಅಂಶಗಳು:
೧. ಗ್ರಾಮ ಲೆಕ್ಕಾಧಿಕಾರಿಗಳು ಮತ್ತು ಕೃಷಿ ಅಧಿಕಾರಿಗಳು ಜಂಟಿ ಪರಿಶೀಲನೆ ನಡೆಸಬೇಕು.
೨. ಫಲಾನುಭವಿಗಳು ಆಧಾರ್ ಕಾರ್ಡ್ ಮತ್ತು ಪಹಣಿ (RTC) ನಕಲನ್ನು ನವೆಂಬರ್ ೨೦ರೊಳಗೆ ಸಲ್ಲಿಸಬೇಕು.
೩. ಯಾವುದೇ ಮಧ್ಯವರ್ತಿಗಳಿಗೆ ಹಣ ನೀಡಬಾರದು.
೪. ಒಟ್ಟು ಮಂಜೂರಾದ ಅನುದಾನ ₹೨೫೦ ಕೋಟಿ.

ಸಹಿ/-
ಡಾ. ರಾಜಶೇಖರ್ ಮೂರ್ತಿ, ಭಾ.ಆ.ಸೇ.
ನಿರ್ದೇಶಕರು, ಕೃಷಿ ಇಲಾಖೆ, ಬೆಂಗಳೂರು.`,
    sampleSummary: {
      overview: "೨೦೨೪-೨೫ನೇ ಸಾಲಿನ ಮುಂಗಾರು ಬೆಳೆ ಹಾನಿಗೆ ಸಂಬಂಧಿಸಿದಂತೆ ಕರ್ನಾಟಕ ಕೃಷಿ ಇಲಾಖೆಯು ಹೊರಡಿಸಿದ ಅಧಿಕೃತ ಪರಿಹಾರ ಸುತ್ತೋಲೆ.",
      importantPoints: [
        "ಅತಿವೃಷ್ಟಿ ಬೆಳೆ ಸಮೀಕ್ಷೆಯನ್ನು ನವೆಂಬರ್ ೧೦ರೊಳಗೆ ಕಡ್ಡಾಯವಾಗಿ ಮುಗಿಸಬೇಕು.",
        "ನೇರ ನಗದು ವರ್ಗಾವಣೆ (DBT) ಮೂಲಕ ರೈತರ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಪರಿಹಾರ ಸಂದಾಯವಾಗಲಿದೆ.",
        "ಗ್ರಾಮ ಲೆಕ್ಕಾಧಿಕಾರಿ ಮತ್ತು ಕೃಷಿ ಅಧಿಕಾರಿಗಳ ಜಂಟಿ ಸ್ಥಳ ತಪಾಸಣೆ ಅನಿವಾರ್ಯ."
      ],
      datesAndDeadlines: [
        { label: "ಸಮೀಕ್ಷೆ ಮುಕ್ತಾಯ ದಿನಾಂಕ", value: "೧೦ ನವೆಂಬರ್ ೨೦೨೪" },
        { label: "ದಾಖಲೆ ಸಲ್ಲಿಸಲು ಕೊನೆ ದಿನಾಂಕ", value: "೨೦ ನವೆಂಬರ್ ೨೦೨೪" },
        { label: "ಸುತ್ತೋಲೆ ಹೊರಡಿಸಿದ ದಿನಾಂಕ", value: "೧೫ ಅಕ್ಟೋಬರ್ ೨೦೨೪" }
      ],
      namesAndOrganizations: [
        "ಕರ್ನಾಟಕ ಸರ್ಕಾರ - ಕೃಷಿ ಇಲಾಖೆ",
        "ಡಾ. ರಾಜಶೇಖರ್ ಮೂರ್ತಿ, ಭಾ.ಆ.ಸೇ. (ನಿರ್ದೇಶಕರು)",
        "ಜಂಟಿ ಕೃಷಿ ನಿರ್ದೇಶಕರು, ಬೆಂಗಳೂರು"
      ],
      amountsAndNumbers: [
        { label: "ಪ್ರತಿ ಹೆಕ್ಟೇರ್ ಪರಿಹಾರ ಧನ", value: "₹೧೨,೫೦೦" },
        { label: "ಒಟ್ಟು ಮಂಜೂರಾದ ಅನುದಾನ", value: "₹೨೫೦ ಕೋಟಿ" },
        { label: "ಸುತ್ತೋಲೆ ಸಂಖ್ಯೆ", value: "ಕೃಇ/ಯೋ/೨೦೨೪/೪೫೨" }
      ],
      importantInstructions: [
        "ರೈತರು ಆಧಾರ್ ಕಾರ್ಡ್ ಹಾಗೂ ಪಹಣಿ (RTC) ದೃಢೀಕೃತ ಪ್ರತಿಯನ್ನು ಕೃಷಿ ಸಂಪರ್ಕ ಕೇಂದ್ರಕ್ಕೆ ಸಲ್ಲಿಸಬೇಕು.",
        "ಯಾವುದೇ ಕಾರಣಕ್ಕೂ ಅನಧಿಕೃತ ವ್ಯಕ್ತಿಗಳು ಅಥವಾ ಮಧ್ಯವರ್ತಿಗಳ ಸಂಪರ್ಕಕ್ಕೆ ಹೋಗಬಾರದು."
      ],
      kn: {
        overview: "೨೦೨೪-೨೫ನೇ ಸಾಲಿನ ಮುಂಗಾರು ಬೆಳೆ ಹಾನಿಗೆ ಸಂಬಂಧಿಸಿದಂತೆ ಕರ್ನಾಟಕ ಕೃಷಿ ಇಲಾಖೆಯು ಹೊರಡಿಸಿದ ಅಧಿಕೃತ ಪರಿಹಾರ ಸುತ್ತೋಲೆ.",
        importantPoints: [
          "ಅತಿವೃಷ್ಟಿ ಬೆಳೆ ಸಮೀಕ್ಷೆಯನ್ನು ನವೆಂಬರ್ ೧೦ರೊಳಗೆ ಕಡ್ಡಾಯವಾಗಿ ಮುಗಿಸಬೇಕು.",
          "ನೇರ ನಗದು ವರ್ಗಾವಣೆ (DBT) ಮೂಲಕ ರೈತರ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಪರಿಹಾರ ಸಂದಾಯವಾಗಲಿದೆ.",
          "ಗ್ರಾಮ ಲೆಕ್ಕಾಧಿಕಾರಿ ಮತ್ತು ಕೃಷಿ ಅಧಿಕಾರಿಗಳ ಜಂಟಿ ಸ್ಥಳ ತಪಾಸಣೆ ಅನಿವಾರ್ಯ."
        ],
        datesAndDeadlines: [
          { label: "ಸಮೀಕ್ಷೆ ಮುಕ್ತಾಯ ದಿನಾಂಕ", value: "೧೦ ನವೆಂಬರ್ ೨೦೨೪" },
          { label: "ದಾಖಲೆ ಸಲ್ಲಿಸಲು ಕೊನೆ ದಿನಾಂಕ", value: "೨೦ ನವೆಂಬರ್ ೨೦೨೪" },
          { label: "ಸುತ್ತೋಲೆ ಹೊರಡಿಸಿದ ದಿನಾಂಕ", value: "೧೫ ಅಕ್ಟೋಬರ್ ೨೦೨೪" }
        ],
        namesAndOrganizations: [
          "ಕರ್ನಾಟಕ ಸರ್ಕಾರ - ಕೃಷಿ ಇಲಾಖೆ",
          "ಡಾ. ರಾಜಶೇಖರ್ ಮೂರ್ತಿ, ಭಾ.ಆ.ಸೇ. (ನಿರ್ದೇಶಕರು)",
          "ಜಂಟಿ ಕೃಷಿ ನಿರ್ದೇಶಕರು, ಬೆಂಗಳೂರು"
        ],
        amountsAndNumbers: [
          { label: "ಪ್ರತಿ ಹೆಕ್ಟೇರ್ ಪರಿಹಾರ ಧನ", value: "₹೧೨,೫೦೦" },
          { label: "ಒಟ್ಟು ಮಂಜೂರಾದ ಅನುದಾನ", value: "₹೨೫೦ ಕೋಟಿ" },
          { label: "ಸುತ್ತೋಲೆ ಸಂಖ್ಯೆ", value: "ಕೃಇ/ಯೋ/೨೦೨೪/೪೫೨" }
        ],
        importantInstructions: [
          "ರೈತರು ಆಧಾರ್ ಕಾರ್ಡ್ ಹಾಗೂ ಪಹಣಿ (RTC) ದೃಢೀಕೃತ ಪ್ರತಿಯನ್ನು ಕೃಷಿ ಸಂಪರ್ಕ ಕೇಂದ್ರಕ್ಕೆ ಸಲ್ಲಿಸಬೇಕು.",
          "ಯಾವುದೇ ಕಾರಣಕ್ಕೂ ಅನಧಿಕೃತ ವ್ಯಕ್ತಿಗಳು ಅಥವಾ ಮಧ್ಯವರ್ತಿಗಳ ಸಂಪರ್ಕಕ್ಕೆ ಹೋಗಬಾರದು."
        ]
      },
      en: {
        overview: "Official relief circular issued by the Karnataka Department of Agriculture regarding 2024-25 Kharif crop damage relief and implementation of the 'Krishi Bhagya' scheme.",
        importantPoints: [
          "Excess rainfall crop damage survey must be compulsorily completed by November 10.",
          "Compensation will be credited to eligible farmers' bank accounts via Direct Benefit Transfer (DBT).",
          "Joint on-site inspection by Village Accountants and Agriculture Officers is mandatory."
        ],
        datesAndDeadlines: [
          { label: "Survey Completion Deadline", value: "10 November 2024" },
          { label: "Document Submission Deadline", value: "20 November 2024" },
          { label: "Circular Issue Date", value: "15 October 2024" }
        ],
        namesAndOrganizations: [
          "Government of Karnataka - Department of Agriculture",
          "Dr. Rajashekar Murthy, IAS (Director)",
          "Joint Directors of Agriculture, Bengaluru"
        ],
        amountsAndNumbers: [
          { label: "Relief Grant per Hectare", value: "₹12,500" },
          { label: "Total Sanctioned Grant", value: "₹250 Crores" },
          { label: "Circular Number", value: "DOA/PLAN/2024/452" }
        ],
        importantInstructions: [
          "Beneficiaries must submit certified copies of their Aadhaar card and RTC (Pahani) to the Raitha Samparka Kendra.",
          "Under no circumstances should farmers approach or make payments to unauthorized middlemen."
        ]
      }
    },
    sampleTranslation: `Government of Karnataka - Department of Agriculture
Circular No: DOA/PLAN/2024/452
Date: 15 October 2024

Subject: Regarding 2024-25 Kharif crop damage relief and implementation of 'Krishi Bhagya' scheme.

All Joint Directors of Agriculture and Assistant Directors of Agriculture across the state districts are hereby instructed to complete the crop survey of rain-affected farmers before November 10. Direct Benefit Transfer (DBT) relief of ₹12,500 per hectare will be deposited into eligible farmers' accounts.

Key Points:
1. Village Accountants and Agriculture Officers must conduct joint inspections.
2. Beneficiaries must submit Aadhaar card and RTC copies by November 20.
3. No payments should be made to middlemen.
4. Total sanctioned grant is ₹250 Crores.

Sd/-
Dr. Rajashekar Murthy, IAS
Director, Department of Agriculture, Bengaluru.`
  },
  {
    id: "sample-north-karnatak",
    title: "ಉತ್ತರ ಕರ್ನಾಟಕ ಜಾನಪದ ಮಾತುಕತೆ (North Karnataka Dialect)",
    category: "Regional Literature / Culture",
    date: "2024-11-01",
    text: `ಯಪ್ಪಾ, ನಮ್ಮ ಹುಬ್ಬಳ್ಳ್ಯಾಗ ಭಾಳ ಚಳಿ ಬಿದ್ದೈತಿ ನೋಡ್ರಿ! ಆತನ್ ಮನೆಗೆ ಹೋದೆ, ಅವ್ರು "ಬರ್ರಿ ಬರ್ರಿ, ಚಾ ಕುಡೀರಿ" ಅಂದ್ರು. ಅಟ್ಟಿ ಮಂದಿ ಎಲ್ಲ ಕೂಡಿ ಜಗಳ ಮಾಡ್ಕೋತಿದ್ರು, "ಯಾಕೋ ಹಿಂಗ್ಯಾಕ್ ಮಾಡ್ತೀರಿ, ಗಮ್ಮತ್ತಿನಾಗಿರ್ರಿ" ಅಂತ ಬುದ್ಧಿವಾದ ಹೇಳಿದೆ. ಹೊಲದಾಗ ಜೋಳದ ತೆನೆ ಮಸ್ತ್ ಬಂದೈತಿ, ನಾಳೀ ಹೊತ್ತಿನಾಗ ನೀರು ಹಾಯಿಸಬೇಕಂತ ಮಾಡೇವ್ರಿ. ನಿನ್ನೇ ದಿನ ಧಾರವಾಡ ಪೇಡಾ ತರಲಿಕ್ಕೆ ಹೋಗಿದ್ದೆ, ಅಲ್ರೀ ಅಲ್ಲಿ ಭಾಳ ಗದ್ದಲ ಇತ್ತು!`,
    sampleSummary: {
      overview: "ಉತ್ತರ ಕರ್ನಾಟಕದ ಆಡುಭಾಷೆಯ ಶೈಲಿಯಲ್ಲಿ ಬರೆದ ಆಪ್ತ ಸಂಭಾಷಣೆ ಹಾಗೂ ಕೃಷಿ ಚಟುವಟಿಕೆಗಳ ವಿವರ.",
      importantPoints: [
        "ಹುಬ್ಬಳ್ಳಿ-ಧಾರವಾಡ ಭಾಗದ ವಿಶಿಷ್ಟ ಪ್ರಾದೇಶಿಕ ಪದಗಳ ಬಳಕೆ (ಬಿದ್ದೈತಿ, ಗಮ್ಮತ್ತು, ಅಟ್ಟಿ).",
        "ಹೊಲದಲ್ಲಿ ಜೋಳದ ಬೆಳೆ ಸಮೃದ್ಧವಾಗಿ ಬಂದಿದ್ದು ನೀರು ಹಾಯಿಸುವ ಕಾರ್ಯ ಬಾಕಿ ಇದೆ.",
        "ಧಾರವಾಡ ಪೇಡಾ ತರಲು ಹೋದಾಗ ಆದ ಜನಸಂದಣಿಯ ಅನುಭವ."
      ],
      datesAndDeadlines: [
        { label: "ಮುಂದಿನ ಕೆಲಸ", value: "ನಾಳೆ ಬೆಳಿಗ್ಗೆ ನೀರು ಹಾಯಿಸುವುದು" },
        { label: "ಹಿಂದಿನ ದಿನ", value: "ನಿನ್ನೆ ಧಾರವಾಡಕ್ಕೆ ಭೇಟಿ" }
      ],
      namesAndOrganizations: [
        "ಹುಬ್ಬಳ್ಳಿ ಪಟ್ಟಣ",
        "ಧಾರವಾಡ ಪೇಡಾ ಮಳಿಗೆ",
        "ಉತ್ತರ ಕರ್ನಾಟಕ ಕೃಷಿಕ ವಲಯ"
      ],
      amountsAndNumbers: [
        { label: "ಪ್ರಮುಖ ಬೆಳೆ", value: "ಜೋಳ (Sorghum)" }
      ],
      importantInstructions: [
        "ಉತ್ತರ ಕರ್ನಾಟಕದ ಗ್ರಾಮೀಣ ಭಾಷಾ ವೈಶಿಷ್ಟ್ಯಗಳನ್ನು ಅರ್ಥೈಸಿಕೊಳ್ಳಲು ಈ ಪಠ್ಯ ಸಹಕಾರಿಯಾಗಿದೆ."
      ],
      kn: {
        overview: "ಉತ್ತರ ಕರ್ನಾಟಕದ ಆಡುಭಾಷೆಯ ಶೈಲಿಯಲ್ಲಿ ಬರೆದ ಆಪ್ತ ಸಂಭಾಷಣೆ ಹಾಗೂ ಕೃಷಿ ಚಟುವಟಿಕೆಗಳ ವಿವರ.",
        importantPoints: [
          "ಹುಬ್ಬಳ್ಳಿ-ಧಾರವಾಡ ಭಾಗದ ವಿಶಿಷ್ಟ ಪ್ರಾದೇಶಿಕ ಪದಗಳ ಬಳಕೆ (ಬಿದ್ದೈತಿ, ಗಮ್ಮತ್ತು, ಅಟ್ಟಿ).",
          "ಹೊಲದಲ್ಲಿ ಜೋಳದ ಬೆಳೆ ಸಮೃದ್ಧವಾಗಿ ಬಂದಿದ್ದು ನೀರು ಹಾಯಿಸುವ ಕಾರ್ಯ ಬಾಕಿ ಇದೆ.",
          "ಧಾರವಾಡ ಪೇಡಾ ತರಲು ಹೋದಾಗ ಆದ ಜನಸಂದಣಿಯ ಅನುಭವ."
        ],
        datesAndDeadlines: [
          { label: "ಮುಂದಿನ ಕೆಲಸ", value: "ನಾಳೆ ಬೆಳಿಗ್ಗೆ ನೀರು ಹಾಯಿಸುವುದು" },
          { label: "ಹಿಂದಿನ ದಿನ", value: "ನಿನ್ನೆ ಧಾರವಾಡಕ್ಕೆ ಭೇಟಿ" }
        ],
        namesAndOrganizations: [
          "ಹುಬ್ಬಳ್ಳಿ ಪಟ್ಟಣ",
          "ಧಾರವಾಡ ಪೇಡಾ ಮಳಿಗೆ",
          "ಉತ್ತರ ಕರ್ನಾಟಕ ಕೃಷಿಕ ವಲಯ"
        ],
        amountsAndNumbers: [
          { label: "ಪ್ರಮುಖ ಬೆಳೆ", value: "ಜೋಳ (Sorghum)" }
        ],
        importantInstructions: [
          "ಉತ್ತರ ಕರ್ನಾಟಕದ ಗ್ರಾಮೀಣ ಭಾಷಾ ವೈಶಿಷ್ಟ್ಯಗಳನ್ನು ಅರ್ಥೈಸಿಕೊಳ್ಳಲು ಈ ಪಠ್ಯ ಸಹಕಾರಿಯಾಗಿದೆ."
        ]
      },
      en: {
        overview: "An intimate narrative and agricultural conversation written in the distinctive North Karnataka dialect.",
        importantPoints: [
          "Prominent use of regional Hubballi-Dharwad dialect terms (biddaiti, gammathu, atti).",
          "Sorghum (Jowar) crop has flourished bountifully in the field; irrigation is scheduled for tomorrow.",
          "Experience navigating the bustling crowds while purchasing Dharwad Peda."
        ],
        datesAndDeadlines: [
          { label: "Upcoming Task", value: "Tomorrow morning irrigation" },
          { label: "Previous Day", value: "Yesterday's visit to Dharwad" }
        ],
        namesAndOrganizations: [
          "Hubballi City",
          "Dharwad Peda Outlets",
          "North Karnataka Farming Community"
        ],
        amountsAndNumbers: [
          { label: "Primary Crop", value: "Sorghum (Jowar / ಜೋಳ)" }
        ],
        importantInstructions: [
          "Helpful text for appreciating rural North Karnataka linguistic nuances and idioms."
        ]
      }
    },
    sampleTranslation: `Brother, it has gotten very cold in Hubballi! I visited their house, and they warmly welcomed me saying "Come in, please have some tea". The household folks were bickering among themselves, so I advised them: "Why do you behave like this, let's live cheerfully". In the farm, the sorghum crop has yielded wonderfully, and we plan to irrigate it tomorrow morning. Yesterday I went to purchase Dharwad Peda, oh boy, there was so much crowd there!`
  },
  {
    id: "sample-coastal",
    title: "ಕರಾವಳಿ ಆಹ್ವಾನ ಪತ್ರಿಕೆ (Coastal Kannada Dialect)",
    category: "Coastal Kannada / Culture",
    date: "2024-11-12",
    text: `ಮಂಗಳೂರು ಮತ್ತು ಉಡುಪಿ ಭಾಗದ ಪ್ರಿಯ ಬಂಧುಗಳೇ, ನಮ್ಮ ಕುಡ್ಲದ ಊರಿನಲ್ಲಿ ಈ ಭಾನುವಾರ ಬಯ್ಯದ ಹೊತ್ತಿಗೆ ಕಂಬಳ ಹಾಗೂ ಯಕ್ಷಗಾನ ಬಯಲಾಟ ಕಾರ್ಯಕ್ರಮ ಆಯೋಜಿಸಲಾಗಿದೆ. ಎಂಚಿತ್ತಿನ ಪೊರ್ಲು ಕಾರ್ಯಕ್ರಮ ಗೊತ್ತಾ! ಎಲ್ಲರೂ ಮಾರಿಗುಡಿ ಬೊಕ್ಕ ಕಡಲ ತೀರಕ್ಕೆ ಒಟ್ಟಿಗೆ ಬನ್ನಿ. ಮಧ್ಯಾಹ್ನ ಕೋರಿ ರೊಟ್ಟಿ ಮತ್ತು ಮೀನಿನ ಊಟದ ವ್ಯವಸ್ಥೆ ಮಾಡಲಾಗಿದೆ. ಬಾರದಿದ್ದರೆ ಭಾರಿ ಬೇಜಾರಾಗುವುದು ನೋಡ್ರಿ!`,
    sampleSummary: {
      overview: "ದಕ್ಷಿಣ ಕನ್ನಡ ಹಾಗೂ ಉಡುಪಿ ಕರಾವಳಿ ಭಾಗದ ಸಾಂಸ್ಕೃತಿಕ ಹಬ್ಬ, ಕಂಬಳ ಮತ್ತು ಯಕ್ಷಗಾನ ಕಾರ್ಯಕ್ರಮದ ಆಹ್ವಾನ.",
      importantPoints: [
        "ಕರಾವಳಿಯ ಹೆಮ್ಮೆಯ ಕಂಬಳ ಮತ್ತು ಯಕ್ಷಗಾನ ಬಯಲಾಟದ ಆಯೋಜನೆ.",
        "ಕರಾವಳಿ ಭಾಷಾ ಪದಗಳಾದ 'ಕುಡ್ಲ', 'ಬಯ್ಯದ ಹೊತ್ತು', 'ಪೊರ್ಲು', 'ಬೊಕ್ಕ' ಬಳಕೆ.",
        "ಪಾರಂಪರಿಕ ಕರಾವಳಿ ಖಾದ್ಯಗಳಾದ ಕೋರಿ ರೊಟ್ಟಿ ಹಾಗೂ ಭೋಜನ ವ್ಯವಸ್ಥೆ."
      ],
      datesAndDeadlines: [
        { label: "ಕಾರ್ಯಕ್ರಮ ದಿನ", value: "ಈ ಬರುವ ಭಾನುವಾರ" },
        { label: "ಸಮಯ", value: "ಬಯ್ಯದ ಹೊತ್ತು (ಸಂಜೆ ವೇಳೆ)" }
      ],
      namesAndOrganizations: [
        "ಕುಡ್ಲ (ಮಂಗಳೂರು) ಸಾಂಸ್ಕೃತಿಕ ಸಮಿತಿ",
        "ಮಾರಿಗುಡಿ ದೇವಸ್ಥಾನ ಕ್ಷೇತ್ರ",
        "ಕರಾವಳಿ ಯಕ್ಷಗಾನ ಮಂಡಳಿ"
      ],
      amountsAndNumbers: [
        { label: "ಮುಖ್ಯ ಆಕರ್ಷಣೆ", value: "ಕಂಬಳ & ಯಕ್ಷಗಾನ ಬಯಲಾಟ" }
      ],
      importantInstructions: [
        "ಎಲ್ಲಾ ಕಲಾಭಿಮಾನಿಗಳು ಸಂಜೆ ವೇಳೆಗೆ ಸಮವಸ್ತ್ರ/ಸಾಂಪ್ರದಾಯಿಕ ಉಡುಪಿನಲ್ಲಿ ಹಾಜರಾಗಲು ಕೋರಲಾಗಿದೆ."
      ],
      kn: {
        overview: "ದಕ್ಷಿಣ ಕನ್ನಡ ಹಾಗೂ ಉಡುಪಿ ಕರಾವಳಿ ಭಾಗದ ಸಾಂಸ್ಕೃತಿಕ ಹಬ್ಬ, ಕಂಬಳ ಮತ್ತು ಯಕ್ಷಗಾನ ಕಾರ್ಯಕ್ರಮದ ಆಹ್ವಾನ.",
        importantPoints: [
          "ಕರಾವಳಿಯ ಹೆಮ್ಮೆಯ ಕಂಬಳ ಮತ್ತು ಯಕ್ಷಗಾನ ಬಯಲಾಟದ ಆಯೋಜನೆ.",
          "ಕರಾವಳಿ ಭಾಷಾ ಪದಗಳಾದ 'ಕುಡ್ಲ', 'ಬಯ್ಯದ ಹೊತ್ತು', 'ಪೊರ್ಲು', 'ಬೊಕ್ಕ' ಬಳಕೆ.",
          "ಪಾರಂಪರಿಕ ಕರಾವಳಿ ಖಾದ್ಯಗಳಾದ ಕೋರಿ ರೊಟ್ಟಿ ಹಾಗೂ ಭೋಜನ ವ್ಯವಸ್ಥೆ."
        ],
        datesAndDeadlines: [
          { label: "ಕಾರ್ಯಕ್ರಮ ದಿನ", value: "ಈ ಬರುವ ಭಾನುವಾರ" },
          { label: "ಸಮಯ", value: "ಬಯ್ಯದ ಹೊತ್ತು (ಸಂಜೆ ವೇಳೆ)" }
        ],
        namesAndOrganizations: [
          "ಕುಡ್ಲ (ಮಂಗಳೂರು) ಸಾಂಸ್ಕೃತಿಕ ಸಮಿತಿ",
          "ಮಾರಿಗುಡಿ ದೇವಸ್ಥಾನ ಕ್ಷೇತ್ರ",
          "ಕರಾವಳಿ ಯಕ್ಷಗಾನ ಮಂಡಳಿ"
        ],
        amountsAndNumbers: [
          { label: "ಮುಖ್ಯ ಆಕರ್ಷಣೆ", value: "ಕಂಬಳ & ಯಕ್ಷಗಾನ ಬಯಲಾಟ" }
        ],
        importantInstructions: [
          "ಎಲ್ಲಾ ಕಲಾಭಿಮಾನಿಗಳು ಸಂಜೆ ವೇಳೆಗೆ ಸಮವಸ್ತ್ರ/ಸಾಂಪ್ರದಾಯಿಕ ಉಡುಪಿನಲ್ಲಿ ಹಾಜರಾಗಲು ಕೋರಲಾಗಿದೆ."
        ]
      },
      en: {
        overview: "Cultural invitation for the grand Kambala (buffalo race) and Yakshagana open-air performance in the coastal region of Dakshina Kannada and Udupi.",
        importantPoints: [
          "Grand organization of Coastal Karnataka's pride events: Kambala and Yakshagana theatre.",
          "Prominent usage of coastal Kannada/Tulu terms: 'Kudla', 'Bayyada Hottu', 'Porlu', and 'Bokka'.",
          "Traditional coastal culinary arrangement including authentic Kori Rotti and festive lunch."
        ],
        datesAndDeadlines: [
          { label: "Event Date", value: "This coming Sunday" },
          { label: "Event Time", value: "Evening / Twilight hours (ಬಯ್ಯದ ಹೊತ್ತು)" }
        ],
        namesAndOrganizations: [
          "Kudla (Mangaluru) Cultural Committee",
          "Marigudi Temple Precincts",
          "Coastal Yakshagana Troupe"
        ],
        amountsAndNumbers: [
          { label: "Main Attractions", value: "Kambala Buffalo Race & Yakshagana" }
        ],
        importantInstructions: [
          "All art enthusiasts and guests are cordially requested to attend in traditional attire by evening."
        ]
      }
    },
    sampleTranslation: `Dear relatives of Mangaluru and Udupi region, in our town of Kudla (Mangaluru), this Sunday evening we have organized a grand Kambala (buffalo race) and Yakshagana open-air performance. What a beautiful event it is going to be! Please join us at the Marigudi temple and beachside together. Lunch featuring traditional Kori Rotti and fish curry has been arranged. We would be very sad if you missed it!`
  }
];

export const DocumentProvider = ({ children }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [summary, setSummary] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      id: "initial-welcome",
      role: "assistant",
      content: "ನಮಸ್ಕಾರ! ನಾನು ಲಿಪಿ ಲೆನ್ಸ್ AI ಸಹಾಯಕ. ನಿಮ್ಮ ದಾಖಲೆಗಳ ಕುರಿತು ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ, ನಾನು ಉತ್ತರಿಸುತ್ತೇನೆ.",
      timestamp: "10:00 AM"
    }
  ]);
  const [recentDocuments, setRecentDocuments] = useState([
    {
      id: "recent-1",
      name: "ಕೃಷಿ_ಇಲಾಖೆ_ಸುತ್ತೋಲೆ_೨೦೨೪.pdf",
      size: "1.4 MB",
      date: "ಇಂದು, 10:30 AM",
      type: "application/pdf",
      status: "Processed",
      charCount: 942
    },
    {
      id: "recent-2",
      name: "ಉತ್ತರ_ಕರ್ನಾಟಕ_ಜಾನಪದ_ಪತ್ರ.png",
      size: "820 KB",
      date: "ನಿನ್ನೆ",
      type: "image/png",
      status: "Processed",
      charCount: 410
    },
    {
      id: "recent-3",
      name: "ಕರಾವಳಿ_ಆಹ್ವಾನ_ಕುಡ್ಲ.jpg",
      size: "2.1 MB",
      date: "14 Nov 2024",
      type: "image/jpeg",
      status: "Ready",
      charCount: 380
    }
  ]);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const loadSampleDocument = (sampleId) => {
    const sample = SAMPLE_DOCUMENTS.find(s => s.id === sampleId) || SAMPLE_DOCUMENTS[0];
    setDocumentName(sample.title);
    setExtractedText(sample.text);
    setTranslatedText(sample.sampleTranslation || "");
    setSummary(sample.sampleSummary || null);
    setUploadedFile({
      name: `${sample.title}.txt`,
      size: `${(sample.text.length * 1.5).toFixed(0)} bytes`,
      type: "text/plain",
      isSample: true
    });
    setFilePreview(null);
    showToast(`ಮಾದರಿ ದಾಖಲೆ ಲೋಡ್ ಮಾಡಲಾಗಿದೆ: ${sample.title.slice(0, 30)}...`, "success");
  };

  const clearDocument = () => {
    setUploadedFile(null);
    setFilePreview(null);
    setExtractedText("");
    setTranslatedText("");
    setSummary(null);
    setDocumentName("");
    setChatHistory([
      {
        id: "initial-welcome",
        role: "assistant",
        content: "ನಮಸ್ಕಾರ! ನಾನು ಲಿಪಿ ಲೆನ್ಸ್ AI ಸಹಾಯಕ. ನಿಮ್ಮ ದಾಖಲೆಗಳ ಕುರಿತು ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ, ನಾನು ಉತ್ತರಿಸುತ್ತೇನೆ.",
        timestamp: "10:00 AM"
      }
    ]);
    showToast("ದಾಖಲೆಯನ್ನು ತೆರವುಗೊಳಿಸಲಾಗಿದೆ", "info");
  };

  return (
    <DocumentContext.Provider
      value={{
        uploadedFile,
        setUploadedFile,
        filePreview,
        setFilePreview,
        extractedText,
        setExtractedText,
        translatedText,
        setTranslatedText,
        summary,
        setSummary,
        documentName,
        setDocumentName,
        chatHistory,
        setChatHistory,
        recentDocuments,
        setRecentDocuments,
        clearDocument,
        loadSampleDocument,
        toast,
        showToast
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocument = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error("useDocument must be used within a DocumentProvider");
  }
  return context;
};
