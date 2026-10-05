// The Ohio State University (Columbus campus): Annual Security Report transcription.
//
// Transcribed 2026-10-05 by Claude from the PDFs below. Status after import: pending_review.
// A human must check every figure against the PDF before verifying (admin → Colleges → Ohio State → report).
// The college is not yet in the database; `college.create` adds it as a draft.
//
// Which reports: the 2026 report (calendar years 2023–2025) and the 2025 report (2022–2024). Ohio State publishes
// both at the same URL, which is replaced each year: the 2026 report was downloaded directly from it on 2026-10-05;
// the 2025 report was retrieved from the Wayback Machine capture of 2025-10-02 of that URL. Because the importer
// reuses sources by URL, the 2025 source has no `url` (only the archived copy), so it stays a separate source.
// The 2026 report had no Wayback capture on 2026-10-05 and Save Page Now failed, so it has no archived copy:
// keep the downloaded file (SHA-256 in internalNotes), since the live URL will serve the 2027 report next year.
//
// Pages: "p. N" is the page number printed in the footer ("Page N of 104/124"). In the 2025 report printed page =
// PDF page. In the 2026 report printed page = PDF page for pp. 1–40, but PDF pp. 41–60 are inserted documents
// with their own page numbering (the Alcohol and Other Drugs policy, 10 pages, and two Office of Student Life
// handouts, 5 pages each), so from PDF p. 61 on, PDF page = printed page + 20. 2026 pinpoints give both.
//
// Which table: one report covers the Columbus campus and five regional campuses (2026 report title page:
// "COLUMBUS, LIMA, MANSFIELD, MARION, NEWARK, WOOSTER"; p. 4: "Reports for regional campuses of The Ohio State
// University are incorporated into this document."). Only the table titled "Columbus - Crimes Reported" is
// entered (2026 report pp. 42–43, PDF pp. 62–63; 2025 report pp. 61–62). Columbus has one combined table; no
// separate Wexner Medical Center table is printed (the DPS Clery page says the statistics include "Wexner Medical
// Center facilities", so they are taken to be within the Columbus figures; a human may wish to confirm).
// Other campus tables, not entered (each begins on the page given):
//   2026 report: Lima p. 47 (PDF p. 67); Mansfield p. 49 (PDF p. 69); Marion p. 51 (PDF p. 71);
//                Newark p. 53 (PDF p. 73); Wooster p. 55 (PDF p. 75).
//   2025 report: Lima p. 66; Mansfield p. 68; Marion p. 70; Newark p. 72; Wooster p. 74.
//
// Column mapping, as printed: "Campus Total" → on_campus; "Campus Crime Reported (residence facilities only)" →
// on_campus_residential; "Noncampus [c,e]" → noncampus; "Public Property [d,e]" → public_property. The column
// "Campus Crime Reported (not including residence facilities)" is not entered (it is Campus Total minus residence).
//
// Strauss rows: for rape and fondling the table prints three rows per year: the year (e.g. "2025"), "2025 Strauss
// [a,b]" (reports of acts by Richard Strauss, a university physician from 1978 to 1998, counted in the year
// reported; notes a and b), and "2025 Total" (in bold). The "Total" rows are entered, because they are the
// table's complete count and match the figures Ohio State submitted to the Department of Education. The Strauss
// rows are non-zero only in Campus (not including residence facilities): 2023 rape 1 and fondling 1 (both
// reports), 2025 rape 1 (2026 report, printed "2025 Stauss [a,b]", a typo). The other offenses have one row per year.
// The years are printed newest first; the arrays below are oldest first to match `years`.
//
// How this was read: each Columbus table was read three ways and all agreed in every cell: (1) renderings of each
// page at 130 dpi, read visually; (2) the embedded text extracted with PyMuPDF; (3) the embedded text extracted
// with pypdf. Both extractions were parsed by script and compared row by row (33 rows per report, identical). In
// every row Campus Total equals the two campus sub-columns, each "Total" row equals its base row plus its Strauss
// row, and no residential figure exceeds its on-campus figure.
// Overlapping years: 2023 and 2024 appear in both reports and match in all 56 cells entered (no revisions).
//
// Federal cross-check: the figures Ohio State submitted to the U.S. Department of Education for 2022–2024
// ("Ohio State University-Main Campus", Campus Safety and Security data file Crime2025EXCEL.zip) were compared
// with the 2025 report's figures for every offense and geography entered here (84 cells; the 2026 report's
// 2023–2024 figures are the same). There were no differences.
//
// Things a reviewer should know:
// - Fondling on campus in 2023 is 366 (355 in Campus, not including residence facilities, plus 1 Strauss, plus 10
//   in residence facilities), against 53 in 2022 and 62 in 2024. Neither report prints an explanation for this
//   figure beyond the general notes recorded below; no explanation is entered.
// - Unfounded counts: printed only as a yearly total across all crimes (2026 report p. 46: 11 in 2025, 15 in 2024,
//   8 in 2023; 2025 report p. 65: 15 in 2024, 8 in 2023, 15 in 2022), not per offense or geography, so they are
//   not entered as figures; the statements are recorded as notes.
// - The 2025 report's hate-crime list (p. 64) includes, for 2022, "One (1) Campus (not including residence
//   facility) Fondling characterized by gender identity"; it is already counted in the fondling row.
//
// Not entered:
// - Enrollment: neither report states an enrollment figure.
// - Other Clery offenses, hazing, hate crimes, arrests and disciplinary referrals: outside this project's scope.

import type { ResearchBundle } from "@/lib/admin/research-bundle";

const zeros = [0, 0, 0];

const sharedNotes = (page: { notes: string; notes2: string; methods: string; confidentiality: string }) => [
  {
    page: page.notes,
    originalText:
      "To the extent any of the crime statistics differ from previous reports, the figures in this year’s report reflect the most current data provided to the university. Statistics include reports that have been made to campus security authorities in addition to the University Police or municipal or county law enforcement agencies, including but not limited to Student Conduct and Housing and Residence Education. Although these reports are not always reported to or independently investigated and verified by university, municipal, or county law enforcement agencies as having occurred, lack of verification does not necessarily reflect on the report’s veracity. Reported crimes may involve individuals not associated with The Ohio State University.",
    summary:
      "The figures include reports to university officials as well as to police, whether or not police verified them, and the latest report's figures supersede earlier ones.",
  },
  {
    marker: "c",
    page: page.notes,
    originalText:
      "Noncampus statistics include but are not limited to police reports taken from suburban municipalities, county law enforcement, and Columbus Division of Police. Every effort has been made to comply with the definitions contained in 34 CFR 668.46(a), but noncampus statistics provided by outside agencies are not independently verified by the university and may include reports of crimes that occurred in private residences or businesses or in other noncampus locations. Noncampus statistics may include statistics from foreign law enforcement agencies for properties used during study abroad trips or other foreign activities involving students or for Ohio State’s county extension offices. Statistics reported by foreign law enforcement agencies are not independently verified by the university.",
    summary:
      "Noncampus figures come partly from outside police agencies, are not verified by the university, and may include incidents at private residences or businesses.",
  },
  {
    marker: "e",
    page: page.notes2,
    originalText:
      "Municipal and county law enforcement agencies provide statistics according to F.B.I. Uniform Crime Reporting (U.C.R.) requirements. Requested statistics that were not provided in a usable format have not been included.",
    summary: "Statistics from outside police agencies that were not provided in a usable format are not included.",
  },
  {
    marker: "g",
    page: page.notes2,
    originalText:
      "“Unfounded” crimes are reported crimes investigated by law enforcement authorities and found to be false or baseless. Only sworn or commissioned law enforcement personnel may “unfound” a crime. When a crime statistic has been disclosed and is “unfounded” in a subsequent year, the crime statistics will be revised and a notation will be made to explain the revision.",
    summary: "Defines unfounded crimes; only police may classify a report as unfounded.",
  },
  {
    page: page.methods,
    originalText:
      "Each year, we request crime statistics from the offices and individuals listed above and from other campus offices and local law enforcement agencies for inclusion in the annual report. No formal police report is required for a crime to be included in the statistics.",
    summary: "The statistics are gathered from campus offices and police agencies, and a police report is not required for a crime to be counted.",
  },
  {
    page: page.confidentiality,
    originalText:
      "Reports that are confidential by law will not be considered for issuance of a public safety notice or reported to the university for inclusion in the annual crime statistics report.",
    summary: "Reports made to legally confidential resources, such as counselors, are not included in these statistics.",
  },
];

export const ohioStateAsr: ResearchBundle = {
  college: {
    slug: "ohio-state-university",
    create: { name: "The Ohio State University", aliases: ["Ohio State", "Ohio State University"], city: "Columbus", state: "OH" },
  },

  sources: {
    asr2026: {
      type: "university",
      publisher: "The Ohio State University Department of Public Safety",
      title: "2026 Annual Security Report (Columbus, Lima, Mansfield, Marion, Newark, Wooster)",
      url: "https://dps.osu.edu/sites/default/files/documents/annual_security_fire_safety_report.pdf",
      archivedUrl: null,
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes:
        "Covers the Columbus campus and five regional campuses, with a separate statistics table for each. Columbus statistics: pp. 42–43 (PDF pp. 62–63); notes to the statistics: pp. 44–46 (PDF pp. 64–66). PDF pp. 41–60 are an inserted Alcohol and Other Drugs policy and two Student Life handouts with their own page numbers, so from PDF p. 61 on, PDF page = printed page + 20.",
      internalNotes:
        "Downloaded directly with curl on 2026-10-05 from the URL above, which is linked as \"View the Annual Security Report\" from https://dps.osu.edu/crime/clery-act. The URL is reused each year (the 2025 report was served from it until the 2026 report replaced it). No Wayback capture of the 2026 version existed on 2026-10-05 (the capture nearest that date is the 2025 report of 2025-10-02), and a Save Page Now request on 2026-10-05 failed (HTTP 523), so archivedUrl is empty. Keep a copy of this file: the URL will serve the 2027 report next year. 124 PDF pages; footer reads \"Page N of 104\" (printed page = PDF page for pp. 1–40; PDF page = printed + 20 from PDF p. 61). SHA-256: f713a7d1283741993da46522bd2d1ba4f61529d1908caa28e7eb64ae9281032d. Publication date not stated in the document (PDF metadata: created 2026-09-16, modified 2026-09-24). Title page: \"ANNUAL SECURITY REPORT 2026 COLUMBUS, LIMA, MANSFIELD, MARION, NEWARK, WOOSTER\".",
    },
    asr2025: {
      type: "university",
      publisher: "The Ohio State University Department of Public Safety",
      title: "2025 Annual Security and Fire Safety Report",
      // Deliberately null: the original URL now serves the 2026 report, and the importer reuses sources by URL,
      // so giving it here would attach this report to the 2026 document. The archived copy is the only link.
      url: null,
      archivedUrl:
        "https://web.archive.org/web/20251002224708/https://dps.osu.edu/sites/default/files/documents/annual_security_fire_safety_report.pdf",
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes:
        "Covers the Columbus campus and five regional campuses, with a separate statistics table for each. Columbus statistics: pp. 61–62; notes to the statistics: pp. 63–65. Printed page numbers equal PDF page numbers. Originally published at https://dps.osu.edu/sites/default/files/documents/annual_security_fire_safety_report.pdf, which now serves the 2026 report; this report is available from the archived copy.",
      internalNotes:
        "Retrieved via the Wayback Machine snapshot of 2025-10-02 (https://web.archive.org/web/20251002224708id_/https://dps.osu.edu/sites/default/files/documents/annual_security_fire_safety_report.pdf), the last capture of the DPS URL before the 2026 report replaced it. `url` is left empty on purpose so the importer (which reuses sources by URL) does not merge this source with the 2026 report's. 124 pages; printed page numbers equal PDF page numbers. SHA-256: 8492cc76790761caad104ab8710f242d2810f4b28ef3a3164324b71c3a3a8a1f. Publication date not stated in the document (PDF metadata title \"2025 Annual Security and Fire Safety Report\"; created 2025-09-24, modified 2025-09-30).",
    },
  },

  reports: [
    {
      reportYear: 2026,
      title: "2026 Annual Security Report (Columbus campus)",
      source: "asr2026",
      years: [2023, 2024, 2025],
      // pp. 42–43 (PDF pp. 62–63), "Columbus - Crimes Reported". Rape and fondling: "Total" rows.
      figures: {
        on_campus: {
          rape: [59, 58, 35],
          fondling: [366, 62, 77],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [24, 31, 27],
          domestic_violence: [12, 20, 22],
          stalking: [76, 71, 82],
        },
        on_campus_residential: {
          rape: [34, 43, 28],
          fondling: [10, 14, 26],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [15, 12, 21],
          domestic_violence: [1, 1, 2],
          stalking: [22, 14, 30],
        },
        public_property: {
          rape: zeros,
          fondling: [1, 0, 1],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [1, 0, 0],
          domestic_violence: [1, 0, 1],
          stalking: [1, 0, 0],
        },
        noncampus: {
          rape: [1, 9, 4],
          fondling: [12, 5, 10],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [0, 3, 1],
          domestic_violence: [2, 3, 4],
          stalking: [2, 2, 3],
        },
      },
      notes: [
        {
          marker: "a",
          page: "p. 44 (PDF p. 64)",
          originalText:
            "The Annual Security Report and the Annual Fire Safety Report comply with the Jeanne Clery Campus Safety Act, and, in accordance with federal law, counts incidents in the year that they were reported rather than the year in which they occurred. As such, any reports made in 2023, 2024, or 2025 of acts committed by Richard Strauss in the specified locations during his 20-year employment as a physician at Ohio State, from 1978 to 1998, are included in the 2023, 2024, and 2025 statistics, respectively. Strauss’ abuse was the subject of a year-long, independent investigation by law firm Perkins Coie, which was commissioned by the university. The findings were released publicly in May 2019. Additionally: • Per federal law, statistics reflect total incidents reported rather than total number of victims. One individual could report multiple crimes or multiple occurrences of a single crime, for example, and all of those reports would be counted. As evident in the findings of Perkins Coie’s Strauss investigation, several survivors reported recurring abuse. • To help ensure an accurate accounting for Strauss’ abuse, all reports of incidents have been included. In some instances, former student-athletes indicated that, along with themselves, their teammates had been abused by Strauss decades ago. If no further details were available, a determination was made based on the characterization of the reporting party. These determinations were made by Perkins Coie using Clery Act definitions, based on reports received during its independent investigation and from guidance sought by the university from the U.S. Department of Education. Perkins Coie provided the majority of Strauss-related data for Ohio State’s 2024, 2025, and 2026 Annual Security Report.",
          summary:
            "Figures are counted in the year reported, so reports made in 2023–2025 of abuse by former university physician Richard Strauss (1978–1998) are included in those years; the table shows them in separate \"Strauss\" rows for rape and fondling, and the figures entered here are the \"Total\" rows that include them.",
        },
        {
          marker: "b",
          page: "p. 44 (PDF p. 64)",
          originalText:
            "The figures in this year’s report reflect the most current data provided to the university. It is possible that the university may learn new information through various means, including but not limited to additional reports or litigation that could cause these figures to increase, decrease, or be reclassified in accordance with federal law. Should such modifications occur, the university will publish updated statistics to keep the campus community informed. In 2023, Perkins Coie reviewed allegations in the litigation documents. As a result, one count of rape and one count of fondling were reported. In 2024 Perkins Coie received no new or revised allegations in litigation pertaining to the Strauss matter. In 2025 Perkins Coie received no new or revised allegations in litigation pertaining to the Strauss matter, however, Ohio State University directly received one new allegation pertaining to the Strauss matter.",
          summary:
            "The Strauss-related counts are one rape and one fondling in 2023 (from litigation documents) and one rape in 2025 (an allegation received directly by the university); the university says these figures may change.",
        },
        {
          marker: "d",
          page: "pp. 44–45 (PDF pp. 64–65)",
          originalText:
            "“Public Property” statistics include but are not limited to police reports taken from suburban municipalities, county law enforcement, and Columbus Division of Police. Every effort has been made to comply with the definitions contained in 34 CFR 668.46(a), but public property statistics provided by outside agencies are not independently verified by the university and may include reports of crimes that occurred in private residences or businesses or in other noncampus locations. The figures in this year’s report reflect the most current data provided to the university. Columbus Division of Police statistics are available at columbus.gov/police.",
          summary:
            "Public-property figures come partly from outside police agencies, are not verified by the university, and may include incidents at private residences or businesses.",
        },
        {
          page: "p. 46 (PDF p. 66)",
          originalText:
            "Unfounded Crimes [g] 2025:There were eleven (11) unfounded crimes. 2024: There were fifteen (15) unfounded crimes. 2023: There were eight (8) unfounded crimes.",
          summary:
            "The report gives only a yearly total of unfounded crimes across all offenses, not counts per offense or location; they are not entered as figures.",
        },
        ...sharedNotes({
          notes: "p. 44 (PDF p. 64)",
          notes2: "p. 45 (PDF p. 65)",
          methods: "p. 32",
          confidentiality: "p. 31",
        }),
      ],
      citations: [
        {
          source: "asr2026",
          pinpoint: "pp. 42–43 (PDF pp. 62–63)",
          claim: "Columbus campus crime statistics for calendar years 2023–2025",
          excerpt: "Columbus - Crimes Reported",
        },
        {
          source: "asr2026",
          pinpoint: "p. 4",
          claim: "The report covers the regional campuses as well as Columbus",
          excerpt: "Reports for regional campuses of The Ohio State University are incorporated into this document.",
        },
      ],
    },
    {
      reportYear: 2025,
      title: "2025 Annual Security Report (Columbus campus)",
      source: "asr2025",
      years: [2022, 2023, 2024],
      // pp. 61–62, "Columbus - Crimes Reported". Same column layout as the 2026 report. Rape and fondling: "Total" rows.
      figures: {
        on_campus: {
          rape: [86, 59, 58],
          fondling: [53, 366, 62],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [22, 24, 31],
          domestic_violence: [9, 12, 20],
          stalking: [70, 76, 71],
        },
        on_campus_residential: {
          rape: [63, 34, 43],
          fondling: [8, 10, 14],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [17, 15, 12],
          domestic_violence: [0, 1, 1],
          stalking: [26, 22, 14],
        },
        public_property: {
          rape: zeros,
          fondling: [1, 1, 0],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [0, 1, 0],
          domestic_violence: [2, 1, 0],
          stalking: [1, 1, 0],
        },
        noncampus: {
          rape: [15, 1, 9],
          fondling: [12, 12, 5],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [2, 0, 3],
          domestic_violence: [6, 2, 3],
          stalking: [5, 2, 2],
        },
      },
      notes: [
        {
          marker: "a",
          page: "p. 63",
          originalText:
            "The Annual Security Report and the Annual Fire Safety Report comply with the Jeanne Clery Campus Safety Act, and, in accordance with federal law, counts incidents in the year that they were reported rather than the year in which they occurred. As such, any reports made in 2022, 2023, or 2024 of acts committed by Richard Strauss in the specified locations during his 20-year employment as a physician at Ohio State, from 1978 to 1998, are included in the 2022, 2023, and 2024 statistics, respectively. Strauss’ abuse was the subject of a year-long, independent investigation by law firm Perkins Coie, which was commissioned by the university. The findings were released publicly in May 2019. Additionally: • Per federal law, statistics reflect total incidents reported rather than total number of victims. One individual could report multiple crimes or multiple occurrences of a single crime, for example, and all of those reports would be counted. As evident in the findings of Perkins Coie’s Strauss investigation, several survivors reported recurring abuse. • To help ensure an accurate accounting for Strauss’ abuse, all reports of incidents have been included. In some instances, former student-athletes indicated that, along with themselves, their teammates had been abused by Strauss decades ago. If no further details were available, a determination was made based on the characterization of the reporting party. These determinations were made by Perkins Coie using Clery Act definitions, based on reports received during its independent investigation and from guidance sought by the university from the U.S. Department of Education. Perkins Coie provided the majority of Strauss-related data for Ohio State’s 2023, 2024, and 2025 Annual Security Report.",
          summary:
            "Figures are counted in the year reported, so reports made in 2022–2024 of abuse by former university physician Richard Strauss (1978–1998) are included in those years; the table shows them in separate \"Strauss\" rows for rape and fondling, and the figures entered here are the \"Total\" rows that include them.",
        },
        {
          marker: "b",
          page: "p. 63",
          originalText:
            "The figures in this year’s report reflect the most current data provided to the university. It is possible that the university may learn new information through various means, including but not limited to additional reports or litigation that could cause these figures to increase, decrease, or be reclassified in accordance with federal law. Should such modifications occur, the university will publish updated statistics to keep the campus community informed. In 2022 Perkins Coie received no new or revised allegations in litigation pertaining to the Strauss matter. As a result, there are no reportable incidents relating to the Strauss matter for calendar year 2022. In 2023, Perkins Coie reviewed allegations in the litigation documents. As a result, one count of rape and one count of fondling were reported. In 2024 Perkins Coie received no new or revised allegations in litigation pertaining to the Strauss matter.",
          summary:
            "The only Strauss-related counts in this report are one rape and one fondling in 2023, from litigation documents; the university says these figures may change.",
        },
        {
          marker: "d",
          page: "pp. 63–64",
          originalText:
            "“Public Property” statistics include but are not limited to police reports taken from suburban municipalities, county law enforcement, and Columbus Division of Police. Every effort has been made to comply with the definitions contained in 34 CFR 668.46(a), but public property statistics provided by outside agencies are not verified independently by the university and may include reports of crimes that occurred in private residences or businesses or in other noncampus locations. The figures in this year’s report reflect the most current data provided to the university. Columbus Division of Police statistics are available at columbus.gov/police.",
          summary:
            "Public-property figures come partly from outside police agencies, are not verified by the university, and may include incidents at private residences or businesses.",
        },
        {
          page: "p. 65",
          originalText:
            "Unfounded Crimes [g] 2024: There were fifteen (15) unfounded crimes. 2023: There were eight (8) unfounded crimes. 2022: There were fifteen (15) unfounded crimes.",
          summary:
            "The report gives only a yearly total of unfounded crimes across all offenses, not counts per offense or location; they are not entered as figures.",
        },
        {
          marker: "f",
          page: "p. 64",
          originalText:
            "2022: There were five (5) reportable hate crimes. One (1) Campus (not including residence facility) Fondling characterized by gender identity",
          summary: "One 2022 on-campus fondling (not in a residence facility) was classified as a hate crime; it is already counted in the fondling figures.",
        },
        ...sharedNotes({ notes: "p. 63", notes2: "p. 64", methods: "p. 32", confidentiality: "p. 31" }),
      ],
      citations: [
        {
          source: "asr2025",
          pinpoint: "pp. 61–62",
          claim: "Columbus campus crime statistics for calendar years 2022–2024",
          excerpt: "Columbus - Crimes Reported",
        },
      ],
    },
  ],
};
