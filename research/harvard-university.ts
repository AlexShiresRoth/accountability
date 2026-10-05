// Harvard University (Cambridge campus): Annual Security Report transcription.
//
// Transcribed 2026-10-05 by Claude from the PDFs below. Status after import: pending_review.
// A human must check every figure against the PDF before verifying (admin → Colleges → Harvard → report).
//
// Which reports: the two most recent reports that could be retrieved, the 2025 report (calendar years 2022–2024)
// and the 2024 report (2021–2023). The 2026 report (2023–2025) was released around 2026-10-01 (reported by The
// Harvard Crimson on 2026-10-02) but could not be retrieved: hupd.harvard.edu returns HTTP 403 to automated
// requests, the Wayback Machine's newest capture of https://www.hupd.harvard.edu/annual-security-report is from
// 2026-09-02 and still links only the 2025 report, no 2026 report file is in the Wayback index, and two Save Page
// Now requests for the page failed (HTTP 520). Follow-up for a researcher: add the 2026 report when a copy can be
// obtained.
//
// Which table: Harvard prints a separate statistics table for each of its seven campuses (Appendix 1). This file
// transcribes only the table titled "Cambridge Campus Clery Act Criminal Statistics" (2025 report p. 70; 2024
// report p. 65), the campus that includes Harvard College. The report prints no separate Allston table; the
// Cambridge Campus Clery Geography map (2025 report p. 82; 2024 report p. 78) covers property on both sides of the
// Charles River, and the 2024 map's embedded labels include Allston locations (e.g. "Allston Mobility Hub",
// "Barry's Corner"). Whether Allston is part of the Cambridge table should be confirmed by a human from the map.
// Other campus tables, not entered (a human may decide later whether to add them):
//   2025 report: Longwood Campus p. 71; Arnold Arboretum Campus p. 72; Concord Field Station Campus p. 73;
//                Harvard Forest p. 74; Center for Hellenic Studies - Nafplion, Greece p. 75;
//                David Rockefeller Center for Latin American Studies (DRCLAS) Santiago Chile p. 76.
//   2024 report: Longwood Campus p. 66; Arnold Arboretum Campus p. 67; Concord Field Station Campus p. 68;
//                Harvard Forest p. 69; Center for Hellenic Studies - Nafplion, Greece p. 70;
//                DRCLAS Santiago Chile p. 71.
//   (Only the 2025 report's Longwood, Arnold Arboretum and Concord Field Station tables were looked at, and not
//   double-read: Longwood shows some non-zero figures for these offenses, e.g. domestic violence and stalking in
//   2024; Arnold Arboretum and Concord Field Station show zeros. The rest were not read cell by cell.)
//
// How this was read: each Cambridge table was read twice, from a rendering of the page (150 dpi) and from the
// PDF's embedded text (extracted with two libraries, pypdf and PyMuPDF), and all readings agreed in every cell.
// The 2025 Cambridge table was also checked against HUPD's separately published single-page PDF of the same table
// (see asr2025 internal notes); it matches. No cell disagreed at any stage.
// Overlapping years: 2022 and 2023 appear in both reports and match in every cell entered (no revisions).
//
// Column mapping, as printed: "Campus (1)" → on_campus (footnote 1: "including residence halls");
// "Resid. (5)" → on_campus_residential (footnote 5: "a subset of campus crime"); "Public (3)" → public_property;
// "Non-Campus (2)" → noncampus. The "Total (4)" column (campus + non-campus + public) is not entered.
//
// Not entered:
// - Unfounded counts. The tables print one "Un-founded (6)" column per year, per offense, not per geography, so it
//   cannot be placed in a geography cell without inference. For the offenses entered it is 0 in every year in
//   both reports except rape in 2021 (2024 report), which shows 1. Recorded in the report notes instead.
// - Enrollment. The 2025 report (p. 4) says HUPD is responsible for "more than 19,000 students", but that is a
//   lower bound covering every campus, not a Cambridge enrollment figure, so it is not entered.
// - Other Clery offenses, hate crimes, arrests and disciplinary referrals: outside this project's scope.

import type { ResearchBundle } from "@/lib/admin/research-bundle";

const zeros = [0, 0, 0];

export const harvardAsr: ResearchBundle = {
  college: { slug: "harvard-university" },

  sources: {
    asr2025: {
      type: "university",
      publisher: "Harvard University Police Department",
      title: "2025 Annual Security Report: Containing Crime Statistics for 2022, 2023, and 2024",
      url: "https://www.hupd.harvard.edu/sites/g/files/omnuum12486/files/2025-10/2025%20ASR%20VF%20Compressed.pdf",
      archivedUrl:
        "https://web.archive.org/web/20251201022431/https://www.hupd.harvard.edu/sites/g/files/omnuum12486/files/2025-10/2025%20ASR%20VF%20Compressed.pdf",
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes:
        "Statistics are printed per campus. Cambridge Campus statistics: p. 70. Other campuses: pp. 71–76. How statistics are collected: pp. 5–6. Sexual assault, domestic violence, dating violence and stalking policies: pp. 28–54.",
      internalNotes:
        "Retrieved via the Wayback Machine snapshot of 2025-12-01 because hupd.harvard.edu returns HTTP 403 to automated downloads. Linked as \"2025 Annual Security Report\" from https://www.hupd.harvard.edu/annual-security-report (Wayback capture of 2026-09-02). 91 pages; printed page numbers equal PDF page numbers. SHA-256 of the retrieved PDF: c52024d2154a422a975890555ad0e11fd19790bcfc5d9cf405305edfa6031c3a. Publication date not stated in the document (PDF metadata: created 2025-10-03). The Cambridge table was cross-checked against HUPD's single-page PDF https://www.hupd.harvard.edu/sites/g/files/omnuum12486/files/2025-10/2025%20ASR%20Cambridge%20Campus%20Clery%20Act%20Criminal%20Statistics.pdf (Wayback snapshot 20251211035808; SHA-256 db3d0bd1d2703cf92b8796b9005796b79198adc88edf4394d893ec39089b3ea1), which is identical in every cell.",
    },
    asr2024: {
      type: "university",
      publisher: "Harvard University Police Department",
      title: "2024 Annual Security Report: Containing Crime Statistics for 2021, 2022, and 2023",
      url: "https://www.hupd.harvard.edu/sites/g/files/omnuum2276/files/2024-10/2024%20Annual%20Security%20Report%20101724.pdf",
      archivedUrl:
        "https://web.archive.org/web/20241107165541/https://www.hupd.harvard.edu/sites/g/files/omnuum2276/files/2024-10/2024%20Annual%20Security%20Report%20101724.pdf",
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes:
        "Statistics are printed per campus. Cambridge Campus statistics: p. 65. Other campuses: pp. 66–71. How statistics are collected: pp. 5–6.",
      internalNotes:
        "Retrieved via the Wayback Machine snapshot of 2024-11-07 (hupd.harvard.edu returns HTTP 403 to automated downloads). Linked from https://www.hupd.harvard.edu/resource/annual-security-report (Wayback capture of 2024-11-15). 86 pages; printed page numbers equal PDF page numbers. SHA-256 of the retrieved PDF: a4d067c04b947bcfa9536f0bc111282a80014e63d95be142a6feffdb837d2f7a. Publication date not stated in the document (PDF metadata: modified 2024-10-17).",
    },
  },

  reports: [
    {
      reportYear: 2025,
      title: "2025 Annual Security Report (Cambridge campus)",
      source: "asr2025",
      years: [2022, 2023, 2024],
      // p. 70, "Appendix 1 – Cambridge Campus Clery Act Criminal Statistics".
      figures: {
        on_campus: {
          rape: [15, 16, 7],
          fondling: [20, 6, 3],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [4, 4, 4],
          domestic_violence: [0, 2, 0],
          stalking: [6, 4, 9],
        },
        on_campus_residential: {
          rape: [13, 16, 6],
          fondling: [13, 2, 0],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [4, 3, 3],
          domestic_violence: [0, 2, 0],
          stalking: [2, 0, 5],
        },
        public_property: {
          rape: [1, 1, 0],
          fondling: [3, 1, 4],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [1, 0, 0],
          domestic_violence: [4, 8, 4],
          stalking: [1, 0, 0],
        },
        noncampus: {
          rape: zeros,
          fondling: zeros,
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: zeros,
          domestic_violence: zeros,
          stalking: zeros,
        },
      },
      notes: [
        {
          page: "p. 6",
          originalText:
            "For statistical purposes, crime statistics reported to any of these sources are recorded in the calendar year the crime was reported. A written request for statistical information is made on an annual basis to all Campus Security Authorities. Reporting for the purposes of the Clery Act does not require initiating an investigation or disclosing identifying information about the reporting victim.",
          summary:
            "Each figure is counted in the year it was reported, and includes reports to police and to campus officials whether or not an investigation followed.",
        },
        {
          marker: "(5)",
          page: "p. 70",
          originalText: "(5) Residence: a subset of campus crime. Crimes are counted in both categories.",
          summary: "Residential figures are already included in the on-campus figures and must not be added to them.",
        },
        {
          marker: "(6)",
          page: "p. 70",
          originalText:
            "(6) Unfounded - after an investigation by a law enforcement agency any report of a crime that is found to be false or baseless the crime is considered “unfounded.”",
          summary:
            "The table prints one unfounded count per offense and year (not per location). It is 0 for every offense entered here in 2022, 2023 and 2024; those counts are not entered as figures.",
        },
        {
          page: "p. 70",
          originalText: "Statistics Updated 10/01/25",
          summary: "The report gives October 1, 2025 as the date the statistics were last updated.",
        },
      ],
      citations: [
        {
          source: "asr2025",
          pinpoint: "p. 70",
          claim: "Cambridge Campus crime statistics for calendar years 2022–2024",
          excerpt: "Appendix 1 - Cambridge Campus Clery Act Criminal Statistics",
        },
        {
          source: "asr2025",
          pinpoint: "p. 5",
          claim: "Harvard reports statistics for its Cambridge and Longwood campuses and five additional campuses",
          excerpt: "In addition to its Cambridge and Longwood campuses, Harvard University also maintains five additional campuses:",
        },
      ],
    },
    {
      reportYear: 2024,
      title: "2024 Annual Security Report (Cambridge campus)",
      source: "asr2024",
      years: [2021, 2022, 2023],
      // p. 65, "Appendix 1 – Cambridge Campus Clery Act Criminal Statistics". Same column layout as the 2025 report.
      figures: {
        on_campus: {
          rape: [21, 15, 16],
          fondling: [5, 20, 6],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [4, 4, 4],
          domestic_violence: [4, 0, 2],
          stalking: [4, 6, 4],
        },
        on_campus_residential: {
          rape: [15, 13, 16],
          fondling: [0, 13, 2],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [1, 4, 3],
          domestic_violence: [2, 0, 2],
          stalking: [1, 2, 0],
        },
        public_property: {
          rape: [1, 1, 1],
          fondling: [2, 3, 1],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [0, 1, 0],
          domestic_violence: [3, 4, 8],
          stalking: [0, 1, 0],
        },
        noncampus: {
          rape: zeros,
          fondling: zeros,
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: zeros,
          domestic_violence: zeros,
          stalking: zeros,
        },
      },
      notes: [
        {
          page: "p. 6",
          originalText:
            "For statistical purposes, crime statistics reported to any of these sources are recorded in the calendar year the crime was reported. A written request for statistical information is made on an annual basis to all Campus Security Authorities. Reporting for the purposes of the Clery Act does not require initiating an investigation or disclosing identifying information about the reporting victim.",
          summary:
            "Each figure is counted in the year it was reported, and includes reports to police and to campus officials whether or not an investigation followed.",
        },
        {
          marker: "(5)",
          page: "p. 65",
          originalText: "(5) Residence: a subset of campus crime. Crimes are counted in both categories.",
          summary: "Residential figures are already included in the on-campus figures and must not be added to them.",
        },
        {
          marker: "(6)",
          page: "p. 65",
          originalText:
            "(6) Unfounded - after an investigation by a law enforcement agency any report of a crime that is found to be false or baseless the crime is considered “unfounded.”",
          summary:
            "The table prints one unfounded count per offense and year (not per location). For the offenses entered here it shows 1 unfounded rape report in 2021 and 0 otherwise; those counts are not entered as figures.",
        },
        {
          page: "p. 65",
          originalText: "Statistics Updated 10/16/24",
          summary: "The report gives October 16, 2024 as the date the statistics were last updated.",
        },
      ],
      citations: [
        {
          source: "asr2024",
          pinpoint: "p. 65",
          claim: "Cambridge Campus crime statistics for calendar years 2021–2023",
          excerpt: "Appendix 1 - Cambridge Campus Clery Act Criminal Statistics",
        },
        {
          source: "asr2024",
          pinpoint: "p. 5",
          claim: "Harvard reports statistics for its Cambridge and Longwood campuses and five additional campuses",
          excerpt: "In addition to its Cambridge and Longwood campuses, Harvard University also maintains five additional campuses:",
        },
      ],
    },
  ],
};
