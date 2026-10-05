// Penn State University (University Park campus): Annual Security Report transcription.
//
// Transcribed 2026-10-05 by Claude from the PDFs below. Status after import: pending_review.
// A human must check every figure against the PDF before verifying (admin → Colleges → Penn State → report).
//
// Which reports: the 2026 report (calendar years 2023–2025) and the 2025 report (2022–2024), both titled
// "Policies, Safety, & U" in the running footer. Penn State publishes a separate report for each of its campus
// locations; these are the University Park reports. Both PDFs downloaded directly from police.psu.edu (the PDF
// files are served; the HTML listing page https://www.police.psu.edu/annual-security-reports returns HTTP 403 to
// automated requests and was read from its Wayback capture of 2026-07-30, which predates the 2026 reports).
//
// Two versions exist of each report. The statistics pages are identical in both versions of each:
// - 2026: .../2026-09/penn-state-university-park-2026_0.pdf (84 pages, Last-Modified 2026-09-29) and
//   .../2026-10/penn-state-university-park-2026a.pdf (83 pages, Last-Modified 2026-10-01). A full-text diff shows
//   the later "a" file changes one e-mail address (p. 45 of the earlier file: "studentaccountability@psu.edu" →
//   "studentconduct@psu.edu"), moves one page and renumbers pages after p. 71. The text of pp. 68–69 (the
//   statistics) is byte-identical in both. Which file the live listing page links could not be confirmed (no
//   capture after 2026-07-30); the later "a" file is used, following Penn State's earlier pattern of linking the
//   "a" revision (2025a, 2024a on the 2026-07-30 listing).
// - 2025: .../2025-09/penn-state-university-park-2025_0.pdf (Last-Modified 2025-09-25) and
//   .../2025-11/penn-state-university-park-2025a.pdf (Last-Modified 2025-11-14). The listing captured 2026-07-30
//   links the "a" file, which is used. A full-text diff shows changes only in the fire-safety tables (Hamilton
//   Hall / Geary Hall rows); the crime statistics on pp. 60–61 are identical.
//
// Pages: "p. N" is the page number printed in the footer. In both reports the printed page equals the PDF page.
//
// Which table: each report contains a single crime-statistics table, "CRIME STATISTICS: CLERY DATA", for
// University Park only (2026 report p. 68; 2025 report p. 60), continued on the next page with hate crimes and
// unfounded crimes (2026 p. 69; 2025 p. 61). There are no tables for other locations in these reports.
// Penn State Dickinson Law and the Hershey Medical Center / College of Medicine, which the federal data lists
// under the same institution as University Park, publish their own reports and are not in these figures (the
// 2026-07-30 listing links, e.g., /sites/police/files/2025-11/penn-state-dickinson-law-2025a.pdf and
// /sites/police/files/2025-11/penn-state-hershey-medical-center-2025a.pdf). Those reports were not read.
//
// Column mapping, as printed (each year has four columns): "On Campus Residence Hall" (2025 report: "Residence
// Hall" under "On-Campus Property") → on_campus_residential; "Total On Campus" → on_campus; "Public Property" →
// public_property; "Non Campus" → noncampus. The table prints years oldest first, matching `years`.
//
// How this was read: each table was read twice independently, from a rendering of the page (150 dpi, read
// visually) and from the PDF's embedded text (PyMuPDF), and the two agreed in every cell. No residential figure
// exceeds its on-campus figure.
//
// Overlapping years: 2023 and 2024 appear in both reports and match in every cell entered (no revisions).
//
// Federal cross-check (not entered): every figure entered for 2022–2024 was compared with what Penn State
// submitted to the U.S. Department of Education for "Pennsylvania State University-Main Campus (University Park
// Campus Penn State)" (Campus Safety and Security data, Crime2025EXCEL.zip). All 84 overlapping cells
// (7 offenses × 4 geographies × 3 years) match both reports. No differences.
//
// Not entered:
// - Unfounded counts. The reports print only a yearly total of unfounded crimes across all offenses and
//   locations, with a footnote naming the offenses, not a count per offense and geography. Recorded as notes.
//   (2026 report: the 2024 total includes one rape, one statutory rape and two dating violence reports; the 2025
//   total includes one dating violence report. The 2025 report gives the 2024 total, eight, without a breakdown.)
// - Hate crimes, other Clery offenses, hazing, arrests and disciplinary referrals: outside this project's scope.
//   (The 2026 report's hate-crime list for 2025 includes "1- Intimidation based on gender identity, on campus";
//   intimidation is not one of the offenses entered.)
// - Enrollment. Neither report states a University Park enrollment figure. The report's statement that UPPS
//   serves "more than 100,000 of Penn State's students, employees, and visitors at 22 campus communities" (p. 8)
//   is not an enrollment figure. The federal file's enrollment figure is not entered.
//
// Wording is verbatim from the PDF text; line breaks are joined.

import type { ResearchBundle } from "@/lib/admin/research-bundle";

const zeros = [0, 0, 0];

const statisticsIntro =
  "The following annual security report provides crime statistics for selected crimes that have been reported to local police agencies or to campus security authorities. The statistics reported here generally reflect the number of criminal incidents reported to the various authorities.";
const unfoundedDefinition =
  "For each unfounded incident, a law enforcement investigation determined that the crime never occurred. A crime is considered unfounded for Clery Act purposes only if sworn or commissioned law enforcement personnel make a formal determination that the report is false or baseless and only if the evidence from a complete and thorough investigation establishes that the crime reported was not completed or attempted in any manner.";

export const pennStateAsr: ResearchBundle = {
  college: {
    slug: "penn-state-university",
    create: {
      name: "Penn State University",
      aliases: ["The Pennsylvania State University", "Penn State", "Penn State University Park"],
      city: "University Park",
      state: "PA",
    },
    citations: [
      {
        source: "asr2026",
        pinpoint: "p. 8",
        claim: "Formal name of the institution",
        excerpt: "University Police & Public Safety has primary jurisdiction on all property owned, operated by, under the control of, or leased by the Pennsylvania State University.",
      },
      {
        source: "asr2026",
        pinpoint: "p. 83",
        claim: "Campus location",
        excerpt: "University Support Building 1 University Park, PA 16802",
      },
    ],
  },

  sources: {
    asr2026: {
      type: "university",
      publisher: "Penn State University Police and Public Safety",
      title: "Penn State University Park 2026 Annual Security Report and Annual Fire Safety Report (Policies, Safety, & U)",
      url: "https://www.police.psu.edu/sites/police/files/2026-10/penn-state-university-park-2026a.pdf",
      archivedUrl:
        "https://web.archive.org/web/20261005152745/https://www.police.psu.edu/sites/police/files/2026-10/penn-state-university-park-2026a.pdf",
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes:
        "University Park campus only. Crime statistics: p. 68; hate crimes and unfounded crimes: p. 69. Penn State's response to domestic violence, dating violence, sexual assault and stalking: pp. 14–38. Printed page numbers equal PDF page numbers.",
      internalNotes:
        "Downloaded directly with curl on 2026-10-05 (HTTP 200, application/pdf; Last-Modified: Thu, 01 Oct 2026 14:39:19 GMT). URL found by testing Penn State's file-naming pattern after a web search returned 2026 reports for other campuses at /sites/police/files/2026-09/; the listing page returns 403 to automated requests and its latest Wayback capture (2026-07-30) predates the 2026 reports. An earlier version exists at https://www.police.psu.edu/sites/police/files/2026-09/penn-state-university-park-2026_0.pdf (84 pages, Last-Modified 2026-09-29, SHA-256 862cb33326f53d303ccf9766000da73ac2f417b8828736b076f9d7a271efb747); its statistics pages (pp. 68–69) have identical text. The Wayback snapshot in archivedUrl was created by a Save Page Now request on 2026-10-05 and is byte-identical to the download. 83 pages; printed page = PDF page. SHA-256: 36ee62c78456c0a5be5596cb0b8279ce588076686de4fe7552a3820696e95629. Publication date not stated in the document (PDF metadata: created 2026-09-29, modified 2026-09-30).",
    },
    asr2025: {
      type: "university",
      publisher: "Penn State University Police and Public Safety",
      title: "Penn State University Park 2025 Annual Security Report and Annual Fire Safety Report (Policies, Safety, & U)",
      url: "https://www.police.psu.edu/sites/police/files/2025-11/penn-state-university-park-2025a.pdf",
      archivedUrl:
        "https://web.archive.org/web/20251205101533/https://www.police.psu.edu/sites/police/files/2025-11/penn-state-university-park-2025a.pdf",
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes:
        "University Park campus only. Crime statistics: p. 60; hate crimes and unfounded crimes: p. 61. Printed page numbers equal PDF page numbers.",
      internalNotes:
        "Downloaded directly with curl on 2026-10-05 (HTTP 200, application/pdf; Last-Modified: Fri, 14 Nov 2025 17:31:34 GMT). Linked from https://www.police.psu.edu/annual-security-reports (Wayback capture of 2026-07-30). The Wayback snapshot of 2025-12-05 was also downloaded and is byte-identical. An earlier version exists at https://www.police.psu.edu/sites/police/files/2025-09/penn-state-university-park-2025_0.pdf (Last-Modified 2025-09-25; Wayback 20251007130032; SHA-256 1b07f307e6b7203f310f6a562950ade38ac82f797683afc118bd6084b1ac8b28); a full-text diff shows changes only in the fire-safety tables, and the crime statistics are identical. 75 pages; printed page = PDF page. SHA-256: aef612d7216400978e90962e6b2a212d83c58393765e96f9d9bd391ed1253df3. Publication date not stated in the document (PDF metadata: created and modified 2025-09-26).",
    },
  },

  reports: [
    {
      reportYear: 2026,
      title: "2026 Annual Security Report (University Park campus)",
      source: "asr2026",
      years: [2023, 2024, 2025],
      // p. 68, "CRIME STATISTICS: CLERY DATA". Columns per year: On Campus Residence Hall, Total On Campus,
      // Public Property, Non Campus.
      figures: {
        on_campus: {
          rape: [42, 50, 28],
          fondling: [25, 17, 21],
          incest: zeros,
          statutory_rape: [2, 0, 0],
          dating_violence: [25, 30, 20],
          domestic_violence: [0, 2, 1],
          stalking: [36, 45, 34],
        },
        on_campus_residential: {
          rape: [38, 40, 26],
          fondling: [16, 7, 10],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [19, 24, 13],
          domestic_violence: [0, 0, 1],
          stalking: [14, 19, 15],
        },
        public_property: {
          rape: zeros,
          fondling: zeros,
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: zeros,
          domestic_violence: zeros,
          stalking: zeros,
        },
        noncampus: {
          rape: [17, 7, 4],
          fondling: [4, 3, 4],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [1, 1, 5],
          domestic_violence: zeros,
          stalking: [1, 0, 0],
        },
      },
      notes: [
        {
          page: "p. 68",
          originalText: statisticsIntro,
          summary: "The figures count crimes reported to police or to campus security authorities, not crimes proven.",
        },
        {
          page: "p. 8",
          originalText:
            "This report provides statistics for the previous three years concerning reported crimes that occurred on Clery reportable locations (Clery geography).",
          summary: "The table covers only locations within Penn State's Clery geography for University Park.",
        },
        {
          page: "p. 11",
          originalText: "Reports filed in this manner are counted and disclosed in this report.",
          summary: "Voluntary, confidential reports are included in the figures.",
        },
        {
          page: "p. 69",
          originalText: "Unfounded Crimes 2025: Nine unfounded crimes 2024: Eight unfounded crimes 2023: Five unfounded crimes",
          summary:
            "The report gives one total of unfounded crimes per year across all offenses and locations, not per offense and location; those counts are not entered as figures.",
        },
        {
          marker: "5",
          page: "p. 69",
          originalText: `The Penn State Police and Public Safety Department unfounded nine crimes in 2025. These crimes were: six Motor Vehicle Thefts, one Dating Violence, and two Hazing. The Penn State Police and Public Safety Department unfounded eight crimes in 2024. These crimes were: one Rape, one Statutory Rape, one Aggravated Assault, three Motor Vehicle Thefts, and two Dating Violence. The Penn State Police and Public Safety Department unfounded five crimes in 2023. These crimes were: one Aggravated Assault, one Burglary, and three Motor Vehicle Thefts. ${unfoundedDefinition}`,
          summary:
            "Police determined that one rape, one statutory rape and two dating violence reports in 2024, and one dating violence report in 2025, were false or baseless; these are excluded from the figures. The locations are not given.",
        },
      ],
      citations: [
        {
          source: "asr2026",
          pinpoint: "p. 68",
          claim: "University Park crime statistics for calendar years 2023–2025",
          excerpt: "CRIME STATISTICS: CLERY DATA",
        },
        {
          source: "asr2026",
          pinpoint: "p. 68",
          claim: "The report is for the University Park campus",
          excerpt: "POLICIES, SAFETY, & U • PENN STATE UNIVERSITY PARK • 2026",
        },
      ],
    },
    {
      reportYear: 2025,
      title: "2025 Annual Security Report (University Park campus)",
      source: "asr2025",
      years: [2022, 2023, 2024],
      // p. 60, "CRIME STATISTICS: CLERY DATA". Columns per year: On-Campus Property (Residence Hall, Total On
      // Campus), Public Property, Non Campus.
      figures: {
        on_campus: {
          rape: [43, 42, 50],
          fondling: [26, 25, 17],
          incest: zeros,
          statutory_rape: [0, 2, 0],
          dating_violence: [20, 25, 30],
          domestic_violence: [0, 0, 2],
          stalking: [32, 36, 45],
        },
        on_campus_residential: {
          rape: [27, 38, 40],
          fondling: [17, 16, 7],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [19, 19, 24],
          domestic_violence: zeros,
          stalking: [11, 14, 19],
        },
        public_property: {
          rape: zeros,
          fondling: zeros,
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: zeros,
          domestic_violence: [1, 0, 0],
          stalking: zeros,
        },
        noncampus: {
          rape: [16, 17, 7],
          fondling: [8, 4, 3],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [0, 1, 1],
          domestic_violence: zeros,
          stalking: [1, 1, 0],
        },
      },
      notes: [
        {
          page: "p. 60",
          originalText: statisticsIntro,
          summary: "The figures count crimes reported to police or to campus security authorities, not crimes proven.",
        },
        {
          page: "p. 8",
          originalText:
            "This report provides statistics for the previous three years concerning reported crimes that occurred on Clery reportable locations (Clery geography).",
          summary: "The table covers only locations within Penn State's Clery geography for University Park.",
        },
        {
          page: "p. 11",
          originalText: "Reports filed in this manner are counted and disclosed in this report.",
          summary: "Voluntary, confidential reports are included in the figures.",
        },
        {
          page: "p. 61",
          originalText: "Unfounded Crimes 2024: Eight unfounded crimes 2023: Five unfounded crimes 2022: Four unfounded crimes",
          summary:
            "The report gives one total of unfounded crimes per year across all offenses and locations, not per offense and location; those counts are not entered as figures.",
        },
        {
          marker: "5",
          page: "p. 61",
          originalText: `The Penn State Police and Public Safety Department unfounded five crimes in 2023. These crimes were: one Aggravated Assault, one Burglary, and three Motor Vehicle Thefts. The Penn State Police and Public Safety Department unfounded four crimes in 2022. These crimes were: one Aggravated Assault and three Burglaries. ${unfoundedDefinition}`,
          summary:
            "No sexual or relationship offense was unfounded in 2022 or 2023. The footnote does not list the eight crimes unfounded in 2024 (the 2026 report does).",
        },
      ],
      citations: [
        {
          source: "asr2025",
          pinpoint: "p. 60",
          claim: "University Park crime statistics for calendar years 2022–2024",
          excerpt: "CRIME STATISTICS: CLERY DATA",
        },
        {
          source: "asr2025",
          pinpoint: "p. 60",
          claim: "The report is for the University Park campus",
          excerpt: "POLICIES, SAFETY, & U • PENN STATE UNIVERSITY PARK • 2025",
        },
      ],
    },
  ],
};
