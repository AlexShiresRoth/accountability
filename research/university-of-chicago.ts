// University of Chicago (main campus, Hyde Park): Annual Security Report transcription.
//
// Transcribed 2026-10-12 by Claude from the PDFs below. Status after import: pending_review.
// A human must check every figure against the PDF before verifying (admin → Colleges → University of Chicago → report).
// The college is not yet in the database; `college.create` adds it as a draft.
//
// Which reports: UChicago names its reports by academic year. The "Annual Security and Fire Safety Report 2026–2027"
// (calendar years 2023–2025) is entered as the 2026 report and the "Annual Security and Fire Safety Report
// 2025–2026" (2022–2024) as the 2025 report. Both were downloaded directly on 2026-10-12 from the links on
// https://safety-security.uchicago.edu/stay-informed/annual-security-and-fire-safety-reports (labelled "2026 - 2027
// Annual Security & Fire Safety Report" and "2025 - 2026 Annual Security & Fire Safety Report"). Neither report
// prints a publication date; the PDF metadata is recorded in internalNotes.
//
// Archived copies: the Wayback Machine has no capture of the 2025 PDF (CDX query, 2026-10-12). Whether it has the 2026
// PDF could not be checked (the Internet Archive returned rate-limit errors and was then offline), so both
// `archivedUrl`s are null; keep the downloaded files (SHA-256 in internalNotes) and recheck before verifying.
// The listing page that links both PDFs has a Wayback capture of 2026-10-09 (HTTP 200):
// https://web.archive.org/web/20261009150945/https://safety-security.uchicago.edu/stay-informed/annual-security-and-fire-safety-reports
// That captures the page, not the PDFs, so it is not used as an `archivedUrl`.
//
// Pages: "p. N" is the page number printed in the footer; "PDF p. N" is the page in the PDF file. In both reports
// PDF page = printed page + 2 (unnumbered cover and contents page).
//
// Which table: each report covers the main campus in Hyde Park and the University's separate campuses.
//   2026 report: Table 1, "CRIME STATISTICS FOR MAIN CAMPUS 2023-25", pp. 7–9 (PDF pp. 9–11), with the sexual
//                offenses on p. 7, the VAWA offenses on p. 8 and hate crimes, hazing and unfounded on p. 9. Table 3,
//                "CRIME STATISTICS FOR GLEACHER CENTER 2023-25" (the downtown Chicago Gleacher Center), pp. 10–12
//                (PDF pp. 12–14), is NOT entered; every rape, fondling, incest, statutory rape, dating violence,
//                domestic violence and stalking cell in it is 0. (Table 2 is Chicago Police data for the Hyde
//                Park–South Kenwood neighborhood, not Clery statistics; not entered.) The report says there were
//                no reported Clery crimes in 2023–2025 at the Marine Biological Laboratory, the Centers in Paris,
//                Beijing and Delhi, the Yuen Campus in Hong Kong or the Chicago Booth Europe Campus in London
//                (p. 6); no tables are printed for them.
//   2025 report: one table, Table 1, "Incidence of Crime: Main Campus 2022–24", p. 7 (PDF p. 9). The report says
//                there were no reported Clery crimes in 2022–2024 at the Gleacher Center or the separate campuses
//                listed above (p. 6).
// Only the main campus table is entered, as for the other universities in this project. Neither report says
// whether UChicago Medicine facilities are included in the main campus figures; a human may want to confirm with
// the University's Clery compliance office.
//
// Column mapping, as printed: "Campus Residence Halls (CRH)" → on_campus_residential; "Total on Campus (includes
// CRH)" → on_campus; "Non-Campus Buildings or Property" → noncampus; "Public Property" → public_property. The
// "Total (campus, non-campus, and public property)" column and the 2025 report's "Hate Crimes" column are not
// entered. The 2026 table lists years newest first (2025, 2024, 2023) within each offense; the 2025 table prints
// "22 23 24" under each column. Arrays below are oldest first to match `years`.
//
// How this was read: each table was read three ways and all three agreed in every cell entered: (1) renderings
// of the pages at 110 dpi, read visually; (2) PyMuPDF word extraction with x/y coordinates, used to assign each
// number to its row and column; (3) pypdf text extraction. Both tables are text in the PDF (no images).
// Arithmetic checks, all of which hold in every year: Total on Campus + Non-Campus + Public Property = printed
// Total; "Sex Offenses – Forcible" = Rape + Fondling, in both the residence hall and on-campus columns; no
// residence hall figure exceeds its on-campus figure.
// Overlapping years: 2023 and 2024 appear in both reports and match in every cell entered (no revisions).
//
// Federal cross-check: every cell for 2022–2024 was compared with the figures UChicago submitted to the U.S.
// Department of Education (Campus Safety and Security data, Crime2025EXCEL.zip downloaded 2026-10-12 from
// https://ope.ed.gov/campussafety/api/dataFiles/file?fileName=Crime2025EXCEL.zip, SHA-256
// 28143ab29f9f9d43235800a3f1f4061b8f2928a7d11bce0e8327d2889ab6f007; institution "University of Chicago", branch
// "Main Campus", UNITID_P 144050001, i.e. IPEDS unitid 144050 confirmed). The 2025 report matches the federal data
// in all 84 cells entered (7 offenses × 4 geographies × 3 years), and so do the 2026 report's 2023 and 2024
// figures. No differences. The federal file also reports 0 unfounded crimes for the main campus in 2022–2024,
// as the 2025 report states. The federal Gleacher Center rows (UNITID_P 144050002) are 0 for every offense
// entered here. (The federal data is not entered.)
//
// Things a reviewer should know:
// - Dating violence (2025 report): the row is marked "*" with the note "The reported crimes of dating violence are
//   also included in the category of forcible sex offenses." (recorded verbatim). The 2026 report prints no such
//   note. Read literally, some incidents may be counted in both a dating violence row and the rape or fondling
//   row; the reports do not say how many.
// - Domestic violence: the 2026 table labels the row "Under Illinois law may include dating relationships or
//   roommate relationships" (recorded as a note); the 2025 table has no such label.
// - The 2026 Gleacher Center table (not entered) has internal inconsistencies outside this project's offenses:
//   2025 aggravated assault prints a Total of 2 although every other cell is 0, and 2024 burglary prints 6 in Total
//   on Campus but 0 in Total. The 2025 report said Gleacher had no Clery crimes in 2022–2024 and the federal data
//   has 0 Gleacher burglaries in 2024, while the main campus had 6 that year. This suggests the Gleacher table was
//   prepared with errors; it does not affect any figure entered here.
// - The footnotes under both main campus tables point to the wrong appendix for definitions ("Appendix VIII" in the
//   2026 report, "Appendix IX" in the 2025 report); the definitions are in Appendix XI, "Clery Act Definitions"
//   (2026 report p. 91, PDF p. 93; 2025 report p. 87, PDF p. 89). The 2026 report's p. 6 also says Tables 1–3 are
//   "on pages 7–11", though Table 3 continues to p. 12.
//
// Not entered:
// - Unfounded counts as per-cell figures: the database has a per-cell unfounded column, but the bundle format has
//   no field for it, and neither report gives unfounded counts per offense or geography. The 2026 table prints a
//   single "Unfounded" row with 0 for each of 2023–2025 (p. 9); the 2025 report states there were zero unfounded
//   reports in 2022–2024 (p. 7). Both are recorded as notes.
// - Enrollment: neither report states an enrollment figure.
// - Other Clery offenses, hate crimes, hazing, arrests and disciplinary referrals, and the Hyde Park–South Kenwood
//   neighborhood table: outside this project's scope.

import type { ResearchBundle } from "@/lib/admin/research-bundle";

const zeros = [0, 0, 0];

const residentialNote = {
  originalText:
    "On-Campus Student Housing Facilities (Subset of On-Campus Geography): Residence halls that are located within on-campus property.",
  summary:
    "Residence hall figures are already included in the on-campus figures (the column is headed \"Total on Campus (includes CRH)\") and must not be added to them.",
};

export const uchicagoAsr: ResearchBundle = {
  college: {
    slug: "university-of-chicago",
    create: { name: "University of Chicago", aliases: ["UChicago", "U of C"], city: "Chicago", state: "IL" },
  },

  sources: {
    asr2026: {
      type: "university",
      publisher: "University of Chicago Department of Safety and Security",
      title: "Annual Security and Fire Safety Report 2026–2027",
      url: "https://safety-security.uchicago.edu/-/media/project/uchicago-tenant/dss/pdfs/annual-reports/fire-safety/annual-security-and-fire-safety-report-2026-2027_91726_2.pdf",
      archivedUrl: null,
      publicationDate: null,
      retrievedAt: "2026-10-12",
      documentPath: null,
      notes:
        "Crime statistics for calendar years 2023–2025. Main campus (Hyde Park) statistics: Table 1, pp. 7–9 (PDF pp. 9–11); Gleacher Center: Table 3, pp. 10–12 (PDF pp. 12–14). Preparation of the report and list of separate campuses: p. 6 (PDF p. 8). Clery Act definitions: Appendix XI, pp. 91–92 (PDF pp. 93–94). PDF page = printed page + 2.",
      internalNotes:
        "Downloaded directly with curl on 2026-10-12 from `url`, linked as \"2026 - 2027 Annual Security & Fire Safety Report\" from https://safety-security.uchicago.edu/stay-informed/annual-security-and-fire-safety-reports. 96 pages; PDF page = printed page + 2. SHA-256: 5427b9291336738968c24f9dafaa893e5ce717551707feacdb7f73fa53b43b08. No publication date printed; PDF metadata: title \"ANNUAL Security and Fire Safety REPORT 2026–2027\", subject \"Annual Security and Fire Safety Report 2026–2027_9.17.26_2\", created 2026-09-21, modified 2026-09-23. The statistics tables are text, not images. Wayback Machine: not checked successfully; on 2026-10-12 the availability and CDX APIs returned \"429 Too Many Requests\" and then \"Temporarily Offline\", so `archivedUrl` is null pending a recheck (and a Save Page Now request if there is still no capture). The URL is version-specific (\"_91726_2\"), so a later revision may be posted under a different file name.",
    },
    asr2025: {
      type: "university",
      publisher: "University of Chicago Department of Safety and Security",
      title: "Annual Security and Fire Safety Report 2025–2026",
      url: "https://safety-security.uchicago.edu/-/media/project/uchicago-tenant/dss/pdfs/annual-reports/fire-safety/2025-2026-annual-security-and-fire-safety-report.pdf",
      archivedUrl: null,
      publicationDate: null,
      retrievedAt: "2026-10-12",
      documentPath: null,
      notes:
        "Crime statistics for calendar years 2022–2024. Main campus (Hyde Park) statistics: Table 1, p. 7 (PDF p. 9). Preparation of the report and list of separate campuses: p. 6 (PDF p. 8). Clery Act definitions: Appendix XI, pp. 87–88 (PDF pp. 89–90). PDF page = printed page + 2.",
      internalNotes:
        "Downloaded directly with curl on 2026-10-12 from `url`, linked as \"2025 - 2026 Annual Security & Fire Safety Report\" from https://safety-security.uchicago.edu/stay-informed/annual-security-and-fire-safety-reports. 92 pages; PDF page = printed page + 2. SHA-256: 2b4357577529515a9b09894982dffb59775947475596d9270115b03093947aa1. No publication date printed; PDF metadata: title \"ANNUAL Security and Fire Safety REPORT 2025–2026\", subject \"Annual Security and Fire Safety Report 2025–2026_9.16.25\", created 2025-09-16, modified 2025-09-25. The statistics table is text, not an image. The Wayback Machine CDX index returned no captures of this URL (queried twice on 2026-10-12), so `archivedUrl` is null.",
    },
  },

  reports: [
    {
      reportYear: 2026,
      title: "Annual Security and Fire Safety Report 2026–2027 (main campus, Hyde Park)",
      source: "asr2026",
      years: [2023, 2024, 2025],
      // Table 1, "CRIME STATISTICS FOR MAIN CAMPUS 2023-25": sexual offenses p. 7 (PDF p. 9), VAWA offenses p. 8
      // (PDF p. 10). Years printed newest first; reversed here.
      figures: {
        on_campus: {
          rape: [5, 1, 4],
          fondling: [3, 3, 3],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [0, 1, 0],
          domestic_violence: [12, 7, 14],
          stalking: [16, 6, 1],
        },
        on_campus_residential: {
          rape: [5, 1, 3],
          fondling: [1, 1, 1],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [0, 1, 0],
          domestic_violence: [1, 2, 1],
          stalking: [2, 2, 0],
        },
        public_property: {
          rape: zeros,
          fondling: [0, 0, 1],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: zeros,
          domestic_violence: [4, 3, 1],
          stalking: zeros,
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
          page: "p. 9 (PDF p. 11)",
          originalText: "Unfounded 2025 0 2024 0 2023 0",
          summary:
            "The table's single \"Unfounded\" row reports no unfounded crimes in 2023, 2024 or 2025 (one figure per year for the whole table, not per offense or location).",
        },
        {
          page: "p. 8 (PDF p. 10)",
          originalText: "Domestic Violence Under Illinois law may include dating relationships or roommate relationships",
          summary:
            "The table's label for the domestic violence row says that under Illinois law domestic violence may include dating or roommate relationships.",
        },
        {
          page: "p. 6 (PDF p. 8)",
          originalText:
            "Incidents of crime for the University of Chicago’s main campus in Hyde Park and the Downtown Chicago Gleacher Center are reflected in Tables 1–3 on pages 7–11 and include crime statistics from 2023, 2024, and 2025. Statistics were gathered from UCPD reports, Chicago Police Department reports, and reports made by Campus Security Authorities.",
          summary:
            "The figures come from University of Chicago Police reports, Chicago Police reports and reports to campus officials designated to receive them. The Gleacher Center has its own table (Table 3), not entered here.",
        },
        { page: "p. 92 (PDF p. 94)", ...residentialNote },
      ],
      citations: [
        {
          source: "asr2026",
          pinpoint: "pp. 7–8 (PDF pp. 9–10)",
          claim: "Main campus crime statistics for calendar years 2023–2025",
          excerpt: "TABLE 1 CRIME STATISTICS FOR MAIN CAMPUS 2023-25",
        },
        {
          source: "asr2026",
          pinpoint: "p. 9 (PDF p. 11)",
          claim: "No unfounded crimes in 2023–2025",
          excerpt: "Unfounded 2025 0 2024 0 2023 0",
        },
      ],
    },
    {
      reportYear: 2025,
      title: "Annual Security and Fire Safety Report 2025–2026 (main campus, Hyde Park)",
      source: "asr2025",
      years: [2022, 2023, 2024],
      // Table 1, "Incidence of Crime: Main Campus 2022–24", p. 7 (PDF p. 9).
      figures: {
        on_campus: {
          rape: [3, 5, 1],
          fondling: [3, 3, 3],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [4, 0, 1],
          domestic_violence: [7, 12, 7],
          stalking: [8, 16, 6],
        },
        on_campus_residential: {
          rape: [2, 5, 1],
          fondling: [3, 1, 1],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [3, 0, 1],
          domestic_violence: [0, 1, 2],
          stalking: [4, 2, 2],
        },
        public_property: {
          rape: zeros,
          fondling: zeros,
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: zeros,
          domestic_violence: [5, 4, 3],
          stalking: zeros,
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
          marker: "*",
          page: "p. 7 (PDF p. 9)",
          originalText: "*The reported crimes of dating violence are also included in the category of forcible sex offenses.",
          summary:
            "The report says dating violence incidents are also counted under forcible sex offenses (rape and fondling), so the same incident may appear in both rows; they should not be added together. It does not say how many overlap.",
        },
        {
          page: "p. 7 (PDF p. 9)",
          originalText: "There were zero (0) unfounded reports in 2022, 2023, and 2024.",
          summary: "No reports in the table were found to be false or baseless (unfounded) in 2022, 2023 or 2024.",
        },
        {
          page: "p. 6 (PDF p. 8)",
          originalText:
            "Incidents of crime for the University of Chicago’s main campus in Hyde Park are reflected in Table 1 and include crime statistics from 2022, 2023, and 2024. Statistics were gathered from UCPD reports, Chicago Police Department reports, and reports made by Campus Security Authorities.",
          summary:
            "The figures come from University of Chicago Police reports, Chicago Police reports and reports to campus officials designated to receive them.",
        },
        { page: "p. 88 (PDF p. 90)", ...residentialNote },
      ],
      citations: [
        {
          source: "asr2025",
          pinpoint: "p. 7 (PDF p. 9)",
          claim: "Main campus crime statistics for calendar years 2022–2024",
          excerpt: "TABLE 1 Incidence of Crime: Main Campus 2022–24",
        },
        {
          source: "asr2025",
          pinpoint: "p. 7 (PDF p. 9)",
          claim: "No unfounded crimes in 2022–2024",
          excerpt: "There were zero (0) unfounded reports in 2022, 2023, and 2024.",
        },
      ],
    },
  ],
};
