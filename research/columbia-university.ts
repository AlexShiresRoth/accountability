// Columbia University (Morningside Campus): Annual Security Report transcription.
//
// Transcribed 2026-10-05 by Claude from the PDFs below. Status after import: pending_review.
// A human must check every figure against the PDF before verifying (admin → Colleges → Columbia → report).
//
// Pages: "p. N" is the page number printed in the report's footer; "PDF p. N" is the page in the PDF file
// (printed page + 4 in both reports, because the PDF has unnumbered cover and contents pages).
//
// Which table: Columbia's report applies to seven campuses and prints a separate statistics table for each
// (2026 report p. 2: "As such, this report applies to the following campuses"). For consistency with Cornell
// (Ithaca campus only), only the principal campus table, "Crime Statistics – Morningside Campus", is entered.
// The other tables, at the same pages in both reports, are not entered and remain for a human to decide on:
// - Manhattanville Campus: p. 50 (PDF p. 54)
// - Medical Center Campus (Irving Medical Center): p. 51 (PDF p. 55)
// - Baker Athletics Complex: p. 52 (PDF p. 56); separate table from 2024 (earlier years are in Morningside)
// - Lamont-Doherty Earth Observatory Campus: p. 53 (PDF p. 57)
// - Nevis Laboratories Campus: p. 54 (PDF p. 58)
// - CU Paris / Reid Hall: p. 55 (PDF p. 59); separate table from 2024 (earlier years are in Morningside)
// Morningside's own noncampus locations (e.g. Arbor House in the Bronx, Columbia Business School space on West
// 60th Street) are in the Morningside table's Noncampus column, as the report describes (p. 47).
// Barnard College and Teachers College publish their own Clery statistics and are not in these figures (p. 45).
//
// How this was read: the Morningside table in each report was read three ways and all three agreed in every cell:
// (1) a rendering of the page, read visually; (2) the PDF's embedded text (pypdf and pdfplumber text extraction);
// (3) pdfplumber's geometry-based table extraction. In every row the printed Total equals On-Campus + Noncampus +
// Public Property, and no residential figure exceeds its on-campus figure. The table prints years newest first
// (e.g. 2025, 2024, 2023) and orders its columns On-Campus, On-Campus Student Housing, Noncampus, Public Property,
// Total; the arrays below are in oldest-first order to match `years`. The Total column is not entered.
// The 2023 and 2024 figures appear in both reports and match in every cell (no revisions).
//
// Not entered:
// - Unfounded counts. The bundle format has no field for them. Each report states under the Morningside table
//   that no unfounded crimes were reported in its three years; that statement is recorded as a note.
// - Other Clery offenses (burglary, hazing, etc.), hate crimes, and arrests/disciplinary referrals: outside this
//   project's scope. (The 2024 hate-crime list includes one sexual orientation–based stalking on on-campus
//   residential property; it is already counted in the stalking row.)
// - Enrollment: neither report states an enrollment figure.
//
// Line-break artifacts from the PDF text ("New Y ork", "T otals") are joined; wording is otherwise verbatim,
// including the 2025 report's spelling "reclasssify".

import type { ResearchBundle } from "@/lib/admin/research-bundle";

const zeros = [0, 0, 0];

export const columbiaAsr: ResearchBundle = {
  college: { slug: "columbia-university" },

  sources: {
    asr2026: {
      type: "university",
      publisher: "Columbia University Department of Public Safety",
      title: "2026 Annual Security and Fire Safety Report",
      url: "https://publicsafety.columbia.edu/sites/publicsafety.columbia.edu/files/content/AnnualSecurityReport2026.pdf",
      archivedUrl:
        "https://web.archive.org/web/20261002040235/https://publicsafety.columbia.edu/sites/publicsafety.columbia.edu/files/content/AnnualSecurityReport2026.pdf",
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes:
        "Covers seven campuses with a separate statistics table for each. Morningside Campus statistics: p. 49 (PDF p. 53). Clery geography and campus descriptions: pp. 47–48. Page numbers are as printed; PDF page = printed page + 4.",
      internalNotes:
        "Downloaded directly from the URL above (the PDF itself is served; the publicsafety.columbia.edu HTML pages return 403 to automated requests). The URL was found through the Wayback Machine's index, since the live landing page could not be read. The Wayback snapshot of 2026-10-02 was also downloaded and is byte-identical. SHA-256: e1c7ec8e3bf3d9ca1f021d3f9819d5161c418532d185ea2c078e581eed452bd2 (88 pages). Publication date not stated in the document.",
    },
    asr2025: {
      type: "university",
      publisher: "Columbia University Department of Public Safety",
      title: "2025 Annual Security and Fire Safety Report",
      url: "https://publicsafety.columbia.edu/sites/publicsafety.columbia.edu/files/content/SecurityReport2025.pdf",
      archivedUrl:
        "https://web.archive.org/web/20260114173954/https://publicsafety.columbia.edu/sites/publicsafety.columbia.edu/files/content/SecurityReport2025.pdf",
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes:
        "Covers seven campuses with a separate statistics table for each. Morningside Campus statistics: p. 49 (PDF p. 53). Clery geography and campus descriptions: pp. 47–48. Page numbers are as printed; PDF page = printed page + 4.",
      internalNotes:
        "Downloaded directly from the URL above (linked from the archived publicsafety.columbia.edu/annualsecurityreport page of 2026-02-04). The Wayback snapshot of 2026-01-14 was also downloaded and is byte-identical. SHA-256: e4feafe2094f826288c3f0884e74170d2901f266a8f724d00af579350da6c6a6 (96 pages). Publication date not stated in the document.",
    },
  },

  reports: [
    {
      reportYear: 2026,
      title: "2026 Annual Security Report (Morningside Campus)",
      source: "asr2026",
      years: [2023, 2024, 2025],
      // p. 49 (PDF p. 53), "Crime Statistics – Morningside Campus". Column groups as printed: "On-Campus",
      // "On-Campus Student Housing¹", "Noncampus", "Public Property", "Total²".
      figures: {
        on_campus: {
          rape: [11, 21, 16],
          fondling: [5, 6, 10],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [9, 11, 15],
          domestic_violence: [8, 12, 5],
          stalking: [16, 21, 33],
        },
        on_campus_residential: {
          rape: [11, 21, 15],
          fondling: [3, 4, 5],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [6, 11, 13],
          domestic_violence: [5, 10, 5],
          stalking: [6, 10, 15],
        },
        public_property: {
          rape: zeros,
          fondling: [3, 5, 1],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [0, 1, 2],
          domestic_violence: zeros,
          stalking: [0, 0, 1],
        },
        noncampus: {
          rape: zeros,
          fondling: zeros,
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: zeros,
          domestic_violence: zeros,
          stalking: [1, 0, 0],
        },
      },
      notes: [
        {
          marker: "¹",
          page: "p. 49 (PDF p. 53)",
          originalText: "Campus Student Housing statistics are a subset of the On-Campus Statistics.",
          summary: "Residence-hall figures are already included in the on-campus figures.",
        },
        {
          page: "p. 49 (PDF p. 53)",
          originalText: "No unfounded crimes were reported in 2025, 2024, and 2023. Only law enforcement may reclassify a crime as “Unfounded.”",
          summary: "The report states that no crimes in this table were classified as unfounded.",
        },
        {
          page: "p. 2 (PDF p. 6)",
          originalText: "Statistics gathered for this report were requested from various Campus Security Authorities (CSAs) including local police precincts.",
          summary: "Figures come from university officials designated to receive reports and from local police.",
        },
        {
          page: "p. 45 (PDF p. 49)",
          originalText:
            "The crimes reported are not necessarily committed against members of the University community. Crimes that may have occurred on the campus of any affiliated educational institution (Barnard, Teachers College, Union Theological Seminary, Jewish Theological Seminary) are not included in the University’s statistics, as these institutions compile their own Clery crime statistics, unless there is an overlap in our campus or public property.",
          summary: "Barnard, Teachers College and other affiliated institutions report their own statistics separately.",
        },
        {
          page: "p. 47 (PDF p. 51)",
          originalText:
            "All Columbia-owned or controlled buildings that are used for educational purposes and that are located between Riverside Drive and Morningside Drive, and West 110th Street and Tiemann Place, are considered part of this campus. This includes dozens of apartment buildings used for student, staff, employee, and non-Columbia affiliate housing.",
          summary: "The Morningside campus for these statistics covers a wider area than the main campus, including many apartment buildings.",
        },
        {
          page: "p. 47 (PDF p. 51)",
          originalText:
            "Additionally, this campus has a handful of noncampus Clery Reportable locations including the Arbor House in the Bronx, leased space for Columbia Business School on West 60th Street, and the Center for Digital Research and Scholarship in Koreatown, among others.",
          summary: "The noncampus column covers Morningside-affiliated locations elsewhere in New York City.",
        },
        {
          page: "p. 52 (PDF p. 56)",
          originalText:
            "The 2023 statistics for this campus are included in the Morningside Campus statistics. 2024 is the first year this campus is reporting as its own campus.",
          summary: "Footnote to the Baker Athletics Complex table: Morningside's 2023 figures include Baker; from 2024 Baker is reported separately.",
        },
        {
          page: "p. 55 (PDF p. 59)",
          originalText:
            "The 2023 statistics for this campus are included in the Morningside Campus statistics. 2024 is the first year this campus is reporting as its own campus.",
          summary: "Footnote to the CU Paris / Reid Hall table: Morningside's 2023 figures include Reid Hall; from 2024 it is reported separately.",
        },
      ],
      citations: [
        {
          source: "asr2026",
          pinpoint: "p. 49 (PDF p. 53)",
          claim: "Morningside Campus crime statistics for calendar years 2023–2025",
          excerpt: "Crime Statistics – Morningside Campus",
        },
        {
          source: "asr2026",
          pinpoint: "p. 2 (PDF p. 6)",
          claim: "The report gives three years of statistics",
          excerpt: "three years’ worth of alleged Clery Act crimes reported within Columbia University’s Clery Reportable Geography",
        },
      ],
    },
    {
      reportYear: 2025,
      title: "2025 Annual Security Report (Morningside Campus)",
      source: "asr2025",
      years: [2022, 2023, 2024],
      // p. 49 (PDF p. 53), "Crime Statistics – Morningside Campus". Same column layout as the 2026 report.
      figures: {
        on_campus: {
          rape: [13, 11, 21],
          fondling: [6, 5, 6],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [24, 9, 11],
          domestic_violence: [0, 8, 12],
          stalking: [14, 16, 21],
        },
        on_campus_residential: {
          rape: [13, 11, 21],
          fondling: [4, 3, 4],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [22, 6, 11],
          domestic_violence: [0, 5, 10],
          stalking: [10, 6, 10],
        },
        public_property: {
          rape: zeros,
          fondling: [4, 3, 5],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [2, 0, 1],
          domestic_violence: zeros,
          stalking: zeros,
        },
        noncampus: {
          rape: [2, 0, 0],
          fondling: zeros,
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: zeros,
          domestic_violence: zeros,
          stalking: [0, 1, 0],
        },
      },
      notes: [
        {
          marker: "¹",
          page: "p. 49 (PDF p. 53)",
          originalText: "Campus Student Housing statistics are a subset of the On-Campus Statistics.",
          summary: "Residence-hall figures are already included in the on-campus figures.",
        },
        {
          marker: "*",
          page: "p. 49 (PDF p. 53)",
          originalText: "No unfounded crimes were reported in 2024, 2023, and 2022. Only law enforcement may reclasssify a crime as “Unfounded.”",
          summary: "The report states that no crimes in this table were classified as unfounded.",
        },
        {
          page: "p. 2 (PDF p. 6)",
          originalText: "Statistics gathered for this report were requested from various Campus Security Authorities (CSAs) including local police precincts.",
          summary: "Figures come from university officials designated to receive reports and from local police.",
        },
        {
          page: "p. 45 (PDF p. 49)",
          originalText:
            "The crimes reported are not necessarily committed against members of the University community. Crimes that may have occurred on the campus of any affiliated educational institution (Barnard, Teachers College, Union Theological Seminary, Jewish Theological Seminary) are not included in the University’s statistics, as these institutions compile their own Clery crime statistics, unless there is an overlap in our campus or public property.",
          summary: "Barnard, Teachers College and other affiliated institutions report their own statistics separately.",
        },
        {
          page: "p. 47 (PDF p. 51)",
          originalText:
            "All Columbia-owned or controlled buildings that are used for educational purposes and that are located between Riverside Drive and Morningside Drive, and West 110th Street and Tiemann Place, are considered part of this campus. This includes dozens of apartment buildings used for student, staff, employee, and non-Columbia affiliate housing.",
          summary: "The Morningside campus for these statistics covers a wider area than the main campus, including many apartment buildings.",
        },
        {
          page: "p. 47 (PDF p. 51)",
          originalText:
            "Additionally, this campus has a handful of noncampus Clery Reportable locations including the Arbor House in the Bronx, leased space for Columbia Business School on West 60th Street, and the Center for Digital Research and Scholarship in Koreatown, among others.",
          summary: "The noncampus column covers Morningside-affiliated locations elsewhere in New York City.",
        },
        {
          page: "p. 52 (PDF p. 56)",
          originalText:
            "The 2022 and 2023 statistics for this campus are included in the noncampus Morningside Campus statistics. 2024 is the first year this campus is reporting as its own campus.",
          summary: "Footnote to the Baker Athletics Complex table: Morningside's 2022 and 2023 noncampus figures include Baker; from 2024 Baker is reported separately.",
        },
        {
          page: "p. 55 (PDF p. 59)",
          originalText:
            "The 2022 and 2023 statistics for this campus are included in the noncampus Morningside Campus statistics. 2024 is the first year this campus is reporting as its own campus.",
          summary: "Footnote to the CU Paris / Reid Hall table: Morningside's 2022 and 2023 noncampus figures include Reid Hall; from 2024 it is reported separately.",
        },
      ],
      citations: [
        {
          source: "asr2025",
          pinpoint: "p. 49 (PDF p. 53)",
          claim: "Morningside Campus crime statistics for calendar years 2022–2024",
          excerpt: "Crime Statistics – Morningside Campus",
        },
        {
          source: "asr2025",
          pinpoint: "p. 2 (PDF p. 6)",
          claim: "The report gives three years of statistics",
          excerpt: "three years’ worth of alleged Clery Act crimes reported within Columbia University’s Clery Reportable Geography",
        },
      ],
    },
  ],
};
