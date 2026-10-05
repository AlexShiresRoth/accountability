// University of Colorado Boulder: Annual Security Report transcription.
//
// Transcribed 2026-10-05 by Claude from the PDFs below. Status after import: pending_review.
// A human must check every figure against the PDF before verifying (admin → Colleges → CU Boulder → report).
// The college does not exist in the database yet; `college.create` creates it as a draft.
//
// Which reports: the 2026 report (calendar years 2023–2025) and the 2025 report (2022–2024), both downloaded
// directly from colorado.edu (no blocking) and each byte-identical to a Wayback Machine capture (see internalNotes).
//
// Pages: the 2026 report prints no page numbers on its pages, so it is cited by PDF page ("PDF p. N"); its table
// of contents numbers pages as PDF page − 2 (e.g. contents "2025 Crime Statistics Table ... 35" = PDF p. 37). The
// 2025 report prints page numbers; "p. N" is the printed number and PDF page = printed page + 1.
//
// Which table: each report prints one statistics table per calendar year, headed "<year> University of Colorado
// Boulder" (2026 report: 2025 table PDF pp. 37–39, 2024 table PDF pp. 39–41, 2023 table PDF pp. 41–42; 2025 report:
// 2024 table p. 29, 2023 table p. 30, 2022 table p. 31). There are no separate campus or location tables (no other
// campus is mentioned in the statistics section), so these single combined tables are used. Each year's column
// becomes one position in the arrays below.
//
// Column mapping, as printed: "All On-Campus Property" → on_campus; "On-Campus Residential" (2025 report: "On-Campus
// Residential Only") → on_campus_residential; "Public Property" → public_property; "Non-Campus Property" → noncampus.
// The 2022 table (2025 report p. 31) also has a "Total" column (on-campus + non-campus + public), not entered.
// Column order differs from the bundle: the tables print On-Campus, Non-Campus, Public, Residential, Unfounded.
//
// How this was read: every table was read three ways and all readings agreed in every cell entered: (1) a rendering
// of the page (110–120 dpi), read visually; (2) PyMuPDF text extraction; (3) pypdf text extraction. No residential
// figure exceeds its on-campus figure.
//
// Revisions between reports (overlapping years 2023 and 2024): one cell differs.
// - 2024, Non-Campus Property, Fondling: 3 in the 2025 report (p. 29) and 2 in the 2026 report (PDF p. 39).
//   Neither report explains the change. Each report's figure is entered as printed.
// All other 2023 and 2024 cells match between the two reports.
//
// Cross-check against the federal data (U.S. Department of Education Campus Safety and Security data,
// Crime2025EXCEL.zip, calendar years 2022–2024, unitid 126614001), every overlapping cell compared:
// - 2025 report (2022, 2023, 2024): matches the federal data in every cell.
// - 2026 report (2023, 2024): matches in every cell except 2024 noncampus fondling: the 2026 report prints 2, the
//   federal data has 3 (the figure in the 2025 report). The bundle keeps 2 as printed.
// The federal data is not entered.
//
// The 2024 increase: on-campus rape goes from 36 (2023) to 96 (2024) and stalking from 25 to 65 in both reports.
// Both reports print an explanation under the 2024 table (recorded verbatim as a note): 2025 report p. 29,
// "**Statistics under the Sexual Assault & Stalking categories for the 2024 reporting year are notably higher than
// prior reporting years, due to one perpetrator committing multiple acts/strings of violence against a victim."; the
// 2026 report (PDF p. 41) repeats it, ending "against victim(s)." In both, no row of the 2024 table carries the "**"
// marker. In the 2026 report, "**" is also the marker of the separate 2025 fondling footnote on PDF p. 39. Searches
// for a separate university statement about the 2024 Clery figures (CU Boulder Today, the Clery and OIEC pages)
// found none; the April 2025 CU Boulder Today article found is about the 2024 campus climate survey, not these figures.
// The 2025 on-campus fondling figure (109, up from 17) has its own footnote, which says the figures and timeframe
// for those reports are estimated (PDF p. 39; recorded verbatim). There is no federal data for 2025 to compare.
//
// Not entered:
// - Unfounded counts. Each table has one "Unfounded Total" column per offense, not per geography, so it cannot be
//   placed in a geography cell without inference. For the offenses entered: 2025 table, rape 1 and stalking 1, the
//   other offenses "-"; 2024, 2023 and 2022 tables, 0 for every offense entered. Recorded in a note.
// - Enrollment: neither report states an enrollment figure. (The federal file's enrollment is not used.)
// - Other Clery offenses, hate crimes, arrests and disciplinary referrals: outside this project's scope.

import type { ResearchBundle } from "@/lib/admin/research-bundle";

const zeros = [0, 0, 0];

export const cuBoulderAsr: ResearchBundle = {
  college: {
    slug: "university-of-colorado-boulder",
    create: { name: "University of Colorado Boulder", aliases: ["CU Boulder"], city: "Boulder", state: "CO" },
    citations: [
      {
        source: "asr2026",
        pinpoint: "PDF p. 19",
        claim: "Location (Boulder, Colorado) and the short name \"CU Boulder\"",
        excerpt: "Reports can also be made to other campus offices as described elsewhere in this document, including the OIEC. The OIEC is located on the second floor of the ARCE Building, 3100 Marine Street, Boulder, CO 80309.",
      },
    ],
  },

  sources: {
    asr2026: {
      type: "university",
      publisher: "University of Colorado Boulder Office of Compliance, Ethics and Policy",
      title: "2026 Annual Security Report and Annual Fire Safety Report",
      url: "https://www.colorado.edu/clery/media/26",
      archivedUrl: "https://web.archive.org/web/20261005152459/https://www.colorado.edu/clery/media/26",
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes:
        "One combined table per calendar year: 2025 statistics PDF pp. 37–39, 2024 PDF pp. 39–41, 2023 PDF pp. 41–42. How statistics are collected: PDF p. 35. Policies on sexual assault, dating and domestic violence and stalking: PDF pp. 46–77. Pages carry no printed numbers; the table of contents numbers pages as PDF page − 2.",
      internalNotes:
        "Downloaded directly with curl on 2026-10-05 from https://www.colorado.edu/clery/media/26, the link on the report's cover image at https://www.colorado.edu/clery/annual-security-fire-safety-report-asfsr (served as application/pdf; Last-Modified Thu, 01 Oct 2026 14:16:55 GMT). No Wayback capture existed; a Save Page Now request on 2026-10-05 created the capture in archivedUrl, which was downloaded and is byte-identical. SHA-256: 81bf74c4695b3ca7782c6aa9954846575f10cde34c695dc89f36eaa2ee7e5d88. 126 pages. Pages are unnumbered; the table of contents numbers pages as PDF page − 2. Publication date not stated in the document (PDF metadata: created 2026-10-01). Title as printed on the cover: \"2026 Annual Security Report and Annual Fire Safety Report\", \"Containing information from calendar years 2023-2025\", \"Office of Compliance, Ethics and Policy\".",
    },
    asr2025: {
      type: "university",
      publisher: "University of Colorado Boulder Office of Compliance, Ethics, and Policy",
      title: "2025 Annual Security & Fire Safety Report",
      url: "https://www.colorado.edu/clery/2025ASFSR",
      archivedUrl: "https://web.archive.org/web/20251005074431/https://www.colorado.edu/clery/2025ASFSR",
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes:
        "One combined table per calendar year: 2024 statistics p. 29, 2023 p. 30, 2022 p. 31. How statistics are collected: p. 27. Page numbers are as printed; PDF page = printed page + 1.",
      internalNotes:
        "Downloaded directly with curl on 2026-10-05 from https://www.colorado.edu/clery/2025ASFSR, the link on the cover image of the ASFSR page in its Wayback capture of 2025-12-15 (https://web.archive.org/web/20251215210055/https://www.colorado.edu/clery/annual-security-fire-safety-report-asfsr). Still served live (Last-Modified Thu, 25 Sep 2025 22:37:53 GMT). The Wayback capture of 2025-10-05 was also downloaded and is byte-identical. SHA-256: 5788693765d8a7611bfa918bba80cd99e99f838dd8f5b44f4fd3b1a9a044bec0. 96 pages; PDF page = printed page + 1. Publication date not stated in the document (PDF metadata: created 2025-09-25). Cover: \"2025 Annual Security & Fire Safety Report\", \"Report Containing Information for the 2025-2026 Academic Year\", \"Office of Compliance, Ethics, and Policy\".",
    },
  },

  reports: [
    {
      reportYear: 2026,
      title: "2026 Annual Security Report (University of Colorado Boulder)",
      source: "asr2026",
      years: [2023, 2024, 2025],
      // PDF pp. 37–42: "2025 Crime Statistics Table", "2024 Crime Statistics Table", "2023 Crime Statistics Table".
      figures: {
        on_campus: {
          rape: [36, 96, 21],
          fondling: [25, 17, 109],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [17, 14, 6],
          domestic_violence: [2, 6, 1],
          stalking: [25, 65, 20],
        },
        on_campus_residential: {
          rape: [35, 54, 18],
          fondling: [10, 8, 2],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [9, 8, 3],
          domestic_violence: [1, 2, 1],
          stalking: [5, 26, 10],
        },
        public_property: {
          rape: zeros,
          fondling: zeros,
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [0, 1, 0],
          domestic_violence: [1, 0, 0],
          stalking: zeros,
        },
        noncampus: {
          rape: zeros,
          // 2024: 2 here; the 2025 report and the federal data have 3 (see header).
          fondling: [2, 2, 0],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: zeros,
          domestic_violence: [0, 1, 0],
          stalking: zeros,
        },
      },
      notes: [
        {
          marker: "*",
          page: "PDF p. 39",
          originalText:
            "* Rape: One report involved an incident that originally occurred in 2016 in a campus residence hall and was reported to CU Boulder in March 2025.",
          summary: "One of the 2025 rape reports concerns a 2016 incident in a residence hall, reported in March 2025.",
        },
        {
          marker: "**",
          page: "PDF p. 39",
          originalText:
            "**Fondling: The increase in reported fondling incidents is attributable to a report involving one perpetrator who committed the same act against one victim on multiple occasions over a two-year period. Because specific dates for the individual incidents are not available, the statistics and timeframe are estimated for purposes of this report.",
          summary:
            "The report attributes the rise in 2025 fondling figures to one report of repeated acts by one person against one victim over two years, and says the figures and timeframe are estimated.",
        },
        {
          marker: "***",
          page: "PDF p. 39",
          originalText: "*** Stalking: Two incidents occurred on campus in 2024 and were reported to CU Boulder in 2025.",
          summary: "Two of the 2025 stalking reports concern incidents from 2024; figures are counted in the year reported.",
        },
        {
          marker: "**",
          page: "PDF p. 41",
          originalText:
            "**Statistics under the Sexual Assault & Stalking categories for the 2024 reporting year are notably higher than prior reporting years, due to one perpetrator committing multiple acts/strings of violence against victim(s).",
          summary:
            "Printed under the 2024 table: the report attributes the higher 2024 sexual assault and stalking figures to one person committing multiple acts. No row in the table carries the marker.",
        },
        {
          page: "PDF pp. 37, 39, 41",
          originalText: "Unfounded Total",
          summary:
            "Each table prints one unfounded count per offense, not per location. For the offenses entered: 2025, rape 1 and stalking 1 (others shown as \"-\"); 2024 and 2023, 0. These counts are not entered as figures.",
        },
        {
          page: "PDF p. 35",
          originalText:
            "Campus crime, arrest, and referral statistics include those reported to the CU Boulder Police Department (CUPD), Student Conduct & Conflict Resolution (SCCR), the Office of Institutional Equity and Compliance (OIEC), Residence Life and University Housing, and other Campus Security Authorities as defined by the Clery Act. Other reporting sources include the Boulder Police Department, Boulder County Sheriff’s Office, and other local law enforcement agencies with jurisdiction over portions of CU Boulder geography as defined by the Clery Act.",
          summary: "Figures include reports to campus police, campus offices and officials, and local police agencies.",
        },
        {
          page: "PDF p. 36",
          originalText:
            "If CU Boulder officially recognizes Interfraternity Council member houses, any crimes that occur on those properties would be counted in the annual Clery statistics, as are the CU recognized sorority residences.",
          summary: "Non-campus figures include housing owned or controlled by officially recognized Greek organizations.",
        },
      ],
      citations: [
        {
          source: "asr2026",
          pinpoint: "PDF pp. 37–42",
          claim: "Crime statistics for calendar years 2023–2025, one table per year",
          excerpt: "2025 Crime Statistics Table",
        },
      ],
    },
    {
      reportYear: 2025,
      title: "2025 Annual Security Report (University of Colorado Boulder)",
      source: "asr2025",
      years: [2022, 2023, 2024],
      // p. 29 "2024 Crime Statistics Table", p. 30 "2023 Crime Statistics Table", p. 31 "2022 Crime Statistics Table".
      figures: {
        on_campus: {
          rape: [24, 36, 96],
          fondling: [17, 25, 17],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [4, 17, 14],
          domestic_violence: [5, 2, 6],
          stalking: [6, 25, 65],
        },
        on_campus_residential: {
          rape: [23, 35, 54],
          fondling: [13, 10, 8],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [3, 9, 8],
          domestic_violence: [5, 1, 2],
          stalking: [6, 5, 26],
        },
        public_property: {
          rape: zeros,
          fondling: zeros,
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [0, 0, 1],
          domestic_violence: [0, 1, 0],
          stalking: [1, 0, 0],
        },
        noncampus: {
          rape: zeros,
          fondling: [0, 2, 3],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: zeros,
          domestic_violence: [0, 0, 1],
          stalking: [2, 0, 0],
        },
      },
      notes: [
        {
          marker: "**",
          page: "p. 29 (PDF p. 30)",
          originalText:
            "**Statistics under the Sexual Assault & Stalking categories for the 2024 reporting year are notably higher than prior reporting years, due to one perpetrator committing multiple acts/strings of violence against a victim.",
          summary:
            "Printed under the 2024 table: the report attributes the higher 2024 sexual assault and stalking figures to one person committing multiple acts against a victim. No row in the table carries the marker.",
        },
        {
          page: "pp. 29–31 (PDF pp. 30–32)",
          originalText: "Unfounded Total",
          summary:
            "Each table prints one unfounded count per offense, not per location. It is 0 for every offense entered here in 2022, 2023 and 2024; those counts are not entered as figures.",
        },
        {
          page: "p. 27 (PDF p. 28)",
          originalText:
            "Campus crime, arrest, and referral statistics include those reported to CUPD, Student Conduct & Conflict Resolution, the Office of Institutional Equity and Compliance, Residence Life and Housing, and other Campus Security Authorities as defined by the Clery Act. Other reporting sources include the Boulder Police Department, Boulder County Sheriff’s Office, and other local law enforcement agencies with jurisdiction over portions of CU Boulder geography as defined by the Clery Act.",
          summary: "Figures include reports to campus police, campus offices and officials, and local police agencies.",
        },
      ],
      citations: [
        {
          source: "asr2025",
          pinpoint: "pp. 29–31 (PDF pp. 30–32)",
          claim: "Crime statistics for calendar years 2022–2024, one table per year",
          excerpt: "2024 Crime Statistics Table",
        },
      ],
    },
  ],
};
