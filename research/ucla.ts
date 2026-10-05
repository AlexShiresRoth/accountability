// University of California, Los Angeles: Annual Security Report transcription.
//
// Transcribed 2026-10-05 by Claude from the PDFs below. Status after import: pending_review.
// A human must check every figure against the PDF before verifying (admin → Colleges → UCLA → report).
// UCLA was not yet in the database, so `college.create` sets it up as a draft.
//
// Which reports: the 2026 Annual Security & Fire Safety Report (calendar years 2023–2025) and the 2025 report
// (2022–2024), both downloaded directly from the UCLA Box links on compliance.ucla.edu's "Annual Security and Fire
// Safety Report" page. The 2025 report linked there is the April 2026 republication ("2025 Annual Security and Fire
// Safety Report - Updated April 2026"). Its revision history (p. 3, PDF p. 4) says the republication updated policy
// text only: "No changes have been made to the crime or fire statistics from when they were originally published in
// September 2025." The original September 2025 file could not be retrieved separately: the old Box link
// (ucla.app.box.com/v/2025-clery-report) now serves the same republished file (identical SHA-256), and no Wayback
// capture of the PDF itself was found. Neither PDF is on the Wayback Machine (Box serves them through a viewer), so
// `archivedUrl` is null for both.
//
// Pages: "p. N" is the page number printed in the footer ("Page N of …"); "PDF p. N" is the page in the PDF file.
// 2026 report: printed page = PDF page. 2025 report: PDF page = printed page + 1 (unnumbered cover).
//
// Which table: UCLA prints one combined statistics table, "Crime Statistics: Clery Data", for the Westwood campus
// (2026 report p. 162; 2025 report p. 161, PDF p. 162), with the Clery map on the preceding page (2026 p. 161: "CLERY
// MAP July 2026", Westwood campus with on-campus, student housing, noncampus and public property shaded). The report
// says statistics from UCLA PD, other Campus Security Authorities and outside police "is integrated into a single
// crime table" (2026 report p. 6). There are no separate tables for other locations. The report does not say
// whether or how the UCLA Health facilities away from Westwood (e.g. UCLA Santa Monica Medical Center, p. 9) are
// represented in the table; a human may want to check this with UCLA's Clery Compliance Officer.
// Also printed with the statistics, not entered: hate crimes (2026 p. 163, an image; 2025 p. 162, PDF p. 163),
// unfounded crimes and notes (2026 p. 164; 2025 p. 162, PDF p. 163).
//
// How this was read:
// - 2026 report: the table on p. 162 is an embedded picture, so the PDF has no text for it. It was read twice
//   from renderings: once as a full-page rendering (100 dpi) plus a 220 dpi crop of the offense rows, and again as
//   separate 400 dpi crops of each year's columns. Both readings agreed in every cell. As an arithmetic check, in
//   every year and column the printed "Sexual Assault" row equals Rape + Fondling + Statutory Rape + Incest
//   (e.g. 2025 on campus: 48 + 77 + 75 + 0 = 200), and no residential figure exceeds its on-campus figure.
// - 2025 report: the table on p. 161 (PDF p. 162) has embedded text. It was read from a rendering (100 dpi), from
//   PyMuPDF's word positions (rows grouped by height) and from pypdf's text extraction; all three agreed in every
//   cell, and the Sexual Assault row check above also holds.
// Column mapping, as printed under each year: "Residential Facility" → on_campus_residential; "Total On-Campus
// (Including Residential)" → on_campus; "Public Property" → public_property; "Noncampus Property" → noncampus. The
// years run oldest to newest from left to right, matching `years`.
// Overlapping years: 2023 and 2024 appear in both reports and match in every cell entered (no revisions). The
// 2025 report marks 2023 on-campus rape (61) and fondling (58) with "*", the 2026 report with "***"; the note
// text is the same.
//
// Federal cross-check: every cell for 2022–2024 was compared with the figures UCLA submitted to the U.S. Department
// of Education (Campus Safety and Security data, Crime2025EXCEL.zip, institution "University of California-Los
// Angeles (UCLA)", unitid 110662001). Both reports match the federal data in every overlapping cell, including the
// on-campus rape figures of 11 (2022), 61 (2023) and 40 (2024). No differences. (The federal data is not entered.)
//
// The 2022 → 2023 increase in on-campus rape (11 → 61) and fondling (15 → 58): both reports print the same
// explanation (2025 report note "*", 2026 report note "***"), recorded verbatim in the notes: one report received
// in 2023 described a series of assaults between the same two people over several months, and 36 of the 61 rapes
// and an estimated 36 of the 58 fondling incidents are attributed to it. The 2026 report prints a similar note
// ("*") for 2025 (several reports each counted as many separate incidents), also recorded.
//
// Dating violence: the 2025 report's note "***" says that "Beginning in 2022, the statistics for Dating Violence
// were included in Domestic Violence statistics" under California's definition, which is why its dating violence
// row is 0 in every column. The 2026 report does not print that note; it repeats the 0s for 2023 and 2024 and shows
// non-zero dating violence figures for 2025 (on campus 3, residential 2, noncampus 1). The 2026 report does not say
// whether 2025 domestic violence figures still include dating violence. Recorded as printed; a reader comparing
// years should treat domestic and dating violence together.
//
// Not entered:
// - Unfounded counts. Each report prints one total per year for all crimes in the table ("Six Unfounded Crimes"
//   for 2025, "Two Unfounded Crimes" for 2024 and 2023 in the 2026 report; "Two" for 2024 and 2023 and "No
//   Unfounded Crimes" for 2022 in the 2025 report), not per offense or geography. Recorded as notes; in those
//   notes the year labels, which are printed sideways beside each row, are placed before the row text.
// - Enrollment: neither report states an enrollment figure.
// - Other Clery offenses, hate crimes, arrests and disciplinary referrals, hazing: outside this project's scope.

import type { ResearchBundle } from "@/lib/admin/research-bundle";

const zeros = [0, 0, 0];

const sexualAssault2023Note =
  "In 2023, the University received a report disclosing a series of On-Campus Sexual Assaults as having occurred over a several month time period, between the same complainant and respondent. This report was received by the University several years after the Assaults reportedly took place. In accordance with federal guidance, the University is recording the estimated number of Assaults during this time period as separate and individual incidents. As a result, 36 of the 61 incidents of On-Campus Rape and an estimated 36 of the 58 incidents of On-Campus Fondling are attributed to this single report. The purpose of this note is to provide the community with an explanation for the increase in reported incidents from years prior, and to promote transparency in statistical reporting.";

const sexualAssault2023Summary =
  "UCLA attributes most of the 2023 increase in on-campus rape and fondling to a single delayed report of repeated assaults between the same two people, counted as separate incidents: 36 of the 61 rapes and an estimated 36 of the 58 fondling incidents.";

const singleTableNote = {
  originalText:
    "Statistical crime information from UCLA PD, other campus CSAs, and outside law enforcement agencies, is integrated into a single crime table, included within this report.",
  summary: "The report has one combined statistics table; figures come from UCLA police, campus officials designated to receive reports, and outside police agencies.",
};

const residentialNote = {
  originalText:
    "Note: On-campus Student Housing Facilities is a subset of On-Campus. Statistics are recorded and included in both the On-campus category and the On-campus Student Housing Facilities category.",
  summary: "Residential figures are already included in the on-campus figures and must not be added to them.",
};

export const uclaAsr: ResearchBundle = {
  college: {
    slug: "ucla",
    create: { name: "University of California, Los Angeles", aliases: ["UCLA"], city: "Los Angeles", state: "CA" },
  },

  sources: {
    asr2026: {
      type: "university",
      publisher: "University of California, Los Angeles",
      title: "2026 Annual Security & Fire Safety Report",
      url: "https://ucla.box.com/s/kbqx69vvfnldq30oym1642uof6qkj5g8",
      archivedUrl: null,
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes:
        "One combined statistics table for the Westwood campus: p. 162 (Clery map p. 161; hate crimes p. 163; unfounded crimes and notes p. 164). Preparation of the report: p. 6. Clery geography definitions: pp. 157–158. Printed page numbers equal PDF page numbers.",
      internalNotes:
        "Downloaded directly with curl on 2026-10-05 from the Box shared link in `url` (linked as \"2026 Annual Security and Fire Safety Report\" from https://compliance.ucla.edu/clery-act-compliance/annual-security-fire-report), via Box's shared-file download endpoint (file id f_2495953677349, file name \"2026 ASFSR 9.29.2026--Final.pdf\"). 203 pages; printed page numbers equal PDF page numbers. SHA-256: 967179868245fe9a939c9001ea6eb6821ef0366808ff1b8d65072e88b7a67ec5. No Wayback capture of the file exists (checked 2026-10-05). Publication date not printed (PDF metadata: created 2026-10-01). The report's own statement of who prepares it: Administrative Policies and Compliance with the Office of Campus & Community Safety (p. 6). The statistics table on p. 162 is an embedded image with no text layer.",
    },
    asr2025: {
      type: "university",
      publisher: "University of California, Los Angeles",
      title: "2025 Annual Security & Fire Safety Report (republished April 29, 2026)",
      url: "https://ucla.box.com/s/m1j7kqdidebn85p5xykuz5znafdnlwck",
      archivedUrl: null,
      publicationDate: "2026-04-29",
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes:
        "Republication of the 2025 report; statistics unchanged from the September 29, 2025 original (revision history, p. 3). One combined statistics table for the Westwood campus: p. 161 (PDF p. 162); hate crimes, unfounded crimes and notes: p. 162 (PDF p. 163). PDF page = printed page + 1.",
      internalNotes:
        "Downloaded directly with curl on 2026-10-05 from the Box shared link in `url` (linked as \"2025 Annual Security and Fire Safety Report - Updated April 2026\" from https://compliance.ucla.edu/clery-act-compliance/annual-security-fire-report), via Box's shared-file download endpoint (file id f_2212992275577, file name \"2025 Republication - Final.pdf\"). 201 pages; PDF page = printed page + 1. SHA-256: a584413bd02e129feadc9c5357acfedfa8d76fa159cd19f62ec7a3edd4fdc8cf. The earlier link to the 2025 report (https://ucla.app.box.com/v/2025-clery-report, linked from the compliance page in Wayback captures of 2025-12-25 and 2026-02-17) now serves a byte-identical file (same SHA-256), so the original September 2025 version could not be obtained; the Wayback capture of that link (20260512033033) is of Box's HTML viewer, not the PDF. publicationDate is the republication date from the revision history (p. 3): \"04.29.2026\"; original publication \"09.29.2025\".",
    },
  },

  reports: [
    {
      reportYear: 2026,
      title: "2026 Annual Security & Fire Safety Report (Westwood campus)",
      source: "asr2026",
      years: [2023, 2024, 2025],
      // p. 162, "Crime Statistics: Clery Data" (image). Columns per year, as printed: "Residential Facility",
      // "Total On-Campus (Including Residential)", "Public Property", "Noncampus Property".
      figures: {
        on_campus: {
          rape: [61, 40, 48],
          fondling: [58, 55, 77],
          incest: zeros,
          statutory_rape: [0, 0, 75],
          dating_violence: [0, 0, 3],
          domestic_violence: [20, 41, 153],
          stalking: [32, 40, 50],
        },
        on_campus_residential: {
          rape: [15, 10, 14],
          fondling: [8, 16, 10],
          incest: zeros,
          statutory_rape: [0, 0, 72],
          dating_violence: [0, 0, 2],
          domestic_violence: [13, 18, 113],
          stalking: [16, 12, 25],
        },
        public_property: {
          rape: [0, 0, 1],
          fondling: [3, 0, 0],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: zeros,
          domestic_violence: [2, 0, 1],
          stalking: zeros,
        },
        noncampus: {
          rape: [11, 12, 3],
          fondling: [14, 11, 13],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [0, 0, 1],
          domestic_violence: [16, 15, 8],
          stalking: [6, 6, 8],
        },
      },
      notes: [
        {
          marker: "*",
          page: "p. 164",
          originalText:
            "In 2025, the University received several reports with high volumes of crimes reported. In accordance with federal guidance, the University is recording each allegation as separate and individual incidents: •One report alleged 25 counts of rape and 26 counts of domestic violence between two individuals in a romantic/social relationship, as occurring over several years. •One report alleged 75 counts of sexual assault (73 statutory rape, and 2 rape), and 75 counts of domestic violence between two individuals in a romantic/social relationship, as occurring over several years. •One report alleged 39 counts of fondling involving two individuals over the course of several months. •One individual suspect (non‐affiliate) was responsible for 24 counts of hate crime (5 burglary, 14 vandalism/damage/destruction of property, 5 larceny). These incidents took place over the course of several months. The purpose of this note is to provide the community with an explanation for the increase in reported incidents from years prior, and to promote transparency in statistical reporting.",
          summary:
            "UCLA attributes much of the 2025 increase to three reports that were each counted as many separate incidents (51 counts of rape and domestic violence; 75 counts of sexual assault, mostly statutory rape, plus 75 of domestic violence; 39 counts of fondling). The note marks the 2025 on-campus and residential figures for sexual assault, fondling, statutory rape and domestic violence.",
        },
        {
          marker: "***",
          page: "p. 164",
          originalText: sexualAssault2023Note,
          summary: sexualAssault2023Summary,
        },
        {
          page: "p. 164",
          originalText: "UNFOUNDED CRIMES 2025 Six Unfounded Crimes 2024 Two Unfounded Crimes 2023 Two Unfounded Crimes",
          summary:
            "The report gives one count of unfounded crimes per year for the whole table (6 in 2025, 2 in 2024, 2 in 2023), without saying which offenses or locations they were; they are not entered as figures.",
        },
        { page: "p. 6", ...singleTableNote },
        { page: "p. 157", ...residentialNote },
      ],
      citations: [
        {
          source: "asr2026",
          pinpoint: "p. 162",
          claim: "Crime statistics for calendar years 2023–2025",
          excerpt: "Crime Statistics: Clery Data",
        },
        {
          source: "asr2026",
          pinpoint: "p. 6",
          claim: "The report has a single combined statistics table",
          excerpt: singleTableNote.originalText,
        },
      ],
    },
    {
      reportYear: 2025,
      title: "2025 Annual Security & Fire Safety Report (Westwood campus)",
      source: "asr2025",
      years: [2022, 2023, 2024],
      // p. 161 (PDF p. 162), "Crime Statistics: Clery Data". Same column layout as the 2026 report.
      figures: {
        on_campus: {
          rape: [11, 61, 40],
          fondling: [15, 58, 55],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: zeros,
          domestic_violence: [5, 20, 41],
          stalking: [9, 32, 40],
        },
        on_campus_residential: {
          rape: [2, 15, 10],
          fondling: [6, 8, 16],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: zeros,
          domestic_violence: [1, 13, 18],
          stalking: [0, 16, 12],
        },
        public_property: {
          rape: [1, 0, 0],
          fondling: [1, 3, 0],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: zeros,
          domestic_violence: [1, 2, 0],
          stalking: zeros,
        },
        noncampus: {
          rape: [11, 11, 12],
          fondling: [6, 14, 11],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: zeros,
          domestic_violence: [7, 16, 15],
          stalking: [2, 6, 6],
        },
      },
      notes: [
        {
          marker: "*",
          page: "p. 162 (PDF p. 163)",
          originalText: sexualAssault2023Note,
          summary: sexualAssault2023Summary,
        },
        {
          marker: "***",
          page: "p. 162 (PDF p. 163)",
          originalText:
            "Beginning in 2022, the statistics for Dating Violence were included in Domestic Violence statistics per the definition of Domestic Violence which includes \"By any other person against an adult or youth victim who is protected from that person's acts under the domestic or family laws of the jurisdiction in which the crime of violence occurred.\" Per California Family Code Section 6211, \"domestic violence\" includes abuse perpetrated against \"a person with whom the respondent is having or has had a dating or engagement relationship.\"",
          summary:
            "From 2022 UCLA counts dating violence within domestic violence, so the dating violence row shows 0 and the domestic violence figures include dating violence.",
        },
        {
          page: "p. 162 (PDF p. 163)",
          originalText: "UNFOUNDED CRIMES 2024 Two Unfounded Crimes 2023 Two Unfounded Crimes 2022 No Unfounded Crimes",
          summary:
            "The report gives one count of unfounded crimes per year for the whole table (2 in 2024, 2 in 2023, none in 2022), without saying which offenses or locations they were; they are not entered as figures.",
        },
        {
          page: "p. 3 (PDF p. 4)",
          originalText: "No changes have been made to the crime or fire statistics from when they were originally published in September 2025.",
          summary: "This April 2026 republication changed policy text only; the statistics are those first published in September 2025.",
        },
        { page: "p. 6 (PDF p. 7)", ...singleTableNote },
        { page: "p. 157 (PDF p. 158)", ...residentialNote },
      ],
      citations: [
        {
          source: "asr2025",
          pinpoint: "p. 161 (PDF p. 162)",
          claim: "Crime statistics for calendar years 2022–2024",
          excerpt: "Crime Statistics: Clery Data",
        },
        {
          source: "asr2025",
          pinpoint: "p. 3 (PDF p. 4)",
          claim: "Statistics unchanged in the April 2026 republication",
          excerpt: "No changes have been made to the crime or fire statistics from when they were originally published in September 2025.",
        },
      ],
    },
  ],
};
