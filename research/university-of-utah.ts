// University of Utah (Salt Lake City campus): Annual Security Report transcription.
//
// Transcribed 2026-10-05 by Claude from the PDFs below. Status after import: pending_review.
// A human must check every figure against the PDF before verifying (admin → Colleges → University of Utah → report).
// The college does not exist in the database yet; `college.create` creates it as a draft.
//
// Which reports: the 2026 report (calendar years 2023–2025; cover: "PUBLISHED SEPTEMBER 2026") and the 2025 report
// (2022–2024; cover: "PUBLISHED SEPTEMBER 2025"), both titled "Annual Security Report, Fire Report, and Campus Safety
// Plan" and both downloaded directly from publicsafety.utah.edu on 2026-10-05 (linked from
// https://publicsafety.utah.edu/safetyreport/ for the 2026 report). Printed page numbers equal PDF page numbers in both.
//
// Which table: each report covers the Salt Lake City main campus, the Sandy Center, the Graduate Center at St. George,
// the Herriman Campus, the Bonderman Field Station at Rio Mesa, the Range Creek Field Station and the Taft-Nicholson
// Environmental Humanities Center (p. 3 of both); the Utah Asia Campus (Incheon, South Korea) has its own separate
// report, which was not reviewed. Only the table titled "Salt Lake City Campus" ("Salt Lake City, Utah Campus") is
// entered: 2026 report p. 13; 2025 report p. 14. The 2026 report states that its 2025 columns include the medical
// campus (see notes), and the 2025 report marks UHealth incidents in red, so the University of Utah Health
// hospitals and clinics are part of these figures. Other campus tables and statements, not entered:
//   2026 report: Sandy, Utah Campus p. 14; Herriman, Utah Campus p. 15; St. George, Utah Campus p. 16; text
//                statements that no criminal incidents were reported for the St. George Center (p. 12), Range Creek
//                Field Station and Taft-Nicholson Center (p. 17). Those statements in the 2026 report still say
//                "For the past three years (2022, 2023, and 2024)", the same wording as the 2025 report.
//   2025 report: Sandy, Utah Campus p. 15; St. George, Utah Campus and Herriman, Utah Campus p. 16; the same text
//                statements on pp. 13 and 17.
//   No separate statistics for Bonderman Field Station at Rio Mesa were located in either report.
//
// How this was read: each Salt Lake City table was read three ways, and all three agreed in every cell entered:
// (1) a rendering of the page (110 dpi full page and 260 dpi crop of the table), read visually; (2) PyMuPDF word
// extraction with x-coordinates, used to assign each number to its column; (3) pypdf text extraction. In addition,
// for every offense and year, On-Campus + Public Property + Non-Campus equals the printed Total, and no residential
// figure exceeds its on-campus figure. Column order as printed: On-Campus, Residence Hall, Public Property,
// Non-Campus, Total, with years newest first (2026 report: 2025, 2024, 2023); arrays below are oldest first.
// "Residence Hall" → on_campus_residential. The Total column is not entered.
//
// 2025 report, red figures: that table prints, next to some cells, a red number in parentheses (e.g. "76 (47)").
// The table states "Numbers in red in the 2022, 2023, and 2024 data indicate incidents that happened in the UHealth
// system." The printed totals equal the sums of the black numbers, so the red numbers are read as subsets of the
// cell, not additions; the black number is entered. One cell, 2022 domestic violence Non-Campus, prints "5" itself
// in red with no parentheses; 5 is entered. The red figures are listed in that report's notes.
//
// Overlapping years (2023, 2024): identical in both reports in every cell entered EXCEPT 2024 domestic violence:
//   2025 report: On-Campus 16, Residence Hall 7, Public Property 0, Non-Campus 3 (Total 19)
//   2026 report: On-Campus 16, Residence Hall 0, Public Property 3, Non-Campus 0 (Total 19)
// Neither report explains the change. Each report's figures are entered as printed.
//
// Cross-check against federal data (U.S. Department of Education Campus Safety and Security data, Crime2025EXCEL.zip,
// main campus, 2022–2024; not entered): every overlapping cell agrees except 2024 domestic violence:
//   - Residence Hall: federal 7; 2025 report 7 (agrees); 2026 report 0 (differs).
//   - Public Property: federal 0; 2025 report 0 (agrees); 2026 report 3 (differs).
//   - Non-Campus: federal 0; 2025 report 3 (differs); 2026 report 0 (agrees).
//   (On-Campus: 16 in all three.) No figure was changed to match the federal data.
//
// The large changes: rape and dating violence figures for 2023 and 2024 are far higher than in 2022 or 2025.
// Both reports explain this in footnotes printed under the table (recorded verbatim in the notes): one
// victim/survivor reported being raped by an intimate partner 150 times (counted in 2023) and one victim/survivor
// 110 times (counted in 2024), in on-campus student housing, and these incidents are also counted as dating
// violence. A Department of Public Safety statement of 2024-09-19 (source `dps2023Explained`) gives more detail on
// the 2023 figure and is cited on both reports. No university statement specific to the 2024 figure was located
// (the publicsafety.utah.edu news posts since 2025-08-01 were searched; attheu.utah.edu blocks automated requests).
//
// Not entered:
// - Unfounded counts. Each table prints one line of unfounded crimes per year for all offenses combined (2026 report:
//   "2025- 4 unfounded crimes, 2024- 7 unfounded crimes, 2023- 6 unfounded crimes"), not per offense or geography.
//   Recorded as a note.
// - Enrollment: neither report states an enrollment figure.
// - Other Clery offenses, hate crimes, arrests and disciplinary referrals: outside this project's scope.

import type { ResearchBundle } from "@/lib/admin/research-bundle";

const zeros = [0, 0, 0];

const cleryExplainedExcerpt =
  "But looking closer at the numbers, 150 of those reported sexual assaults occurred in a single relationship plagued by a history of coercion and interpersonal violence.";

export const utahAsr: ResearchBundle = {
  college: {
    slug: "university-of-utah",
    create: { name: "University of Utah", aliases: ["U of U"], city: "Salt Lake City", state: "UT" },
  },

  sources: {
    asr2026: {
      type: "university",
      publisher: "University of Utah Department of Public Safety",
      title: "Annual Security Report, Fire Report, and Campus Safety Plan (includes crime statistics for 2023, 2024, and 2025)",
      url: "https://publicsafety.utah.edu/wp-content/uploads/sites/10/2026/09/ADMIN27-8-DPS-Annual-Security-Report-Main-Campus-V5.pdf",
      archivedUrl: null,
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes:
        "Cover: \"PUBLISHED SEPTEMBER 2026\". Salt Lake City Campus statistics: p. 13. Sandy p. 14, Herriman p. 15, St. George p. 16. Sexual misconduct policies and procedures: pp. 31–46; resources: pp. 76–79; Rule R1-012B: Appendix 2, pp. 88–107. Printed page numbers equal PDF page numbers.",
      internalNotes:
        "Downloaded directly with curl on 2026-10-05 from the URL above, linked as the main-campus report from https://publicsafety.utah.edu/safetyreport/. 124 pages; printed page = PDF page. SHA-256: 3989612e8607dc539bbd8e2f191abc4c16cbcbe7880d96e259fdb4fea5a0502b. PDF metadata: created 2026-09-14. No Wayback capture existed on 2026-10-05, and two Save Page Now requests that day failed (HTTP 523), so archivedUrl is null.",
    },
    asr2025: {
      type: "university",
      publisher: "University of Utah Department of Public Safety",
      title: "Annual Security Report, Fire Report, and Campus Safety Plan (includes crime statistics for 2022, 2023, and 2024)",
      url: "https://publicsafety.utah.edu/wp-content/uploads/sites/10/2025/10/26-0074-DPS-Fire-Safety-Clery-Report-WEB.pdf",
      archivedUrl:
        "https://web.archive.org/web/20260207131814/https://publicsafety.utah.edu/wp-content/uploads/sites/10/2025/10/26-0074-DPS-Fire-Safety-Clery-Report-WEB.pdf",
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes:
        "Cover: \"PUBLISHED SEPTEMBER 2025\". Salt Lake City Campus statistics: p. 14 (red figures mark UHealth incidents). Sandy p. 15; St. George and Herriman p. 16. Printed page numbers equal PDF page numbers.",
      internalNotes:
        "Downloaded directly with curl on 2026-10-05 from the URL above (found by web search; the current safetyreport page links only the 2026 report). The Wayback snapshot of 2026-02-07 (id_ capture) was also downloaded and is byte-identical. 88 pages; printed page = PDF page. SHA-256: ce4202218d638d3f02cfbe11b285d37c60e5bed6caf237168d338470cd1a5dfe. PDF metadata: created 2025-10-01.",
    },
    dps2023Explained: {
      type: "university",
      publisher: "University of Utah Department of Public Safety",
      title: "2023 Clery Report explained",
      url: "https://publicsafety.utah.edu/home-safety-news/2023-clery-report-explained/",
      archivedUrl: "https://web.archive.org/web/20260314133533/https://publicsafety.utah.edu/home-safety-news/2023-clery-report-explained/",
      publicationDate: "2024-09-19",
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes: "Department of Public Safety news post explaining the increase in reported rapes in the 2023 statistics.",
      internalNotes:
        "Read live on 2026-10-05 (page and WordPress API). Publication date from the WordPress post date (2024-09-19T06:00:09). The Wayback capture of 2026-03-14 resolves and contains the excerpt quoted.",
    },
  },

  reports: [
    {
      reportYear: 2026,
      title: "2026 Annual Security Report (Salt Lake City campus)",
      source: "asr2026",
      years: [2023, 2024, 2025],
      // p. 13, "Salt Lake City Campus". 2024 domestic violence differs from the 2025 report (see header).
      figures: {
        on_campus: {
          rape: [172, 140, 23],
          fondling: [52, 76, 40],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [158, 122, 6],
          domestic_violence: [28, 16, 19],
          stalking: [116, 128, 80],
        },
        on_campus_residential: {
          rape: [161, 122, 16],
          fondling: [5, 7, 2],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [156, 113, 2],
          domestic_violence: [16, 0, 2],
          stalking: [22, 21, 15],
        },
        public_property: {
          rape: zeros,
          fondling: zeros,
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: zeros,
          domestic_violence: [0, 3, 0],
          stalking: zeros,
        },
        noncampus: {
          rape: [3, 6, 0],
          fondling: [3, 7, 12],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: zeros,
          domestic_violence: [2, 0, 1],
          stalking: [1, 3, 1],
        },
      },
      notes: [
        {
          marker: "#",
          page: "p. 13",
          originalText:
            "# One victim/survivor reported being raped by their intimate partner 110 times in on-campus student housing over the course of their relationship in 2022-2023. The inclusion of these 110 incidents significantly increased the total number of rape cases reported in 2024. These incidents also count in the dating violence section.",
          summary:
            "Of the 2024 on-campus rape figure (140), 110 reports came from one victim/survivor about one intimate partner; they are also counted as dating violence.",
        },
        {
          marker: "##",
          page: "p. 13",
          originalText:
            "## One victim/survivor reported being raped by their intimate partner 150 times in on-campus student housing over the course of their relationship in 2021-2022. The inclusion of these 150 incidents significantly increased the total number of rape cases reported in 2023. These incidents also count in the dating violence section.",
          summary:
            "Of the 2023 on-campus rape figure (172), 150 reports came from one victim/survivor about one intimate partner; they are also counted as dating violence.",
        },
        {
          marker: "*",
          page: "p. 13",
          originalText:
            "*The statistics reported in the 2025 crime columns reflect incidents that occurred across both the main academic campus and the medical campus. To provide additional context and assist readers in interpreting the data, the following breakdown identifies the number of incidents that occurred within the medical campus community: Rape: 5 of 23 reported cases on the medical campus. Fondling: 44 of 52 reported cases on the medical campus. Stalking: 21 of 81 reported cases on the medical campus. Aggravated Assault: 4 of 10 reported cases on the medical campus. Domestic Violence: 16 of 20 reported cases on the medical campus. Drug Arrests: 15 of 33 reported cases on the medical campus.",
          summary:
            "The 2025 figures include the medical campus, which accounts for 5 of 23 rapes, 44 of 52 fondling, 21 of 81 stalking and 16 of 20 domestic violence reports (totals across all geographies).",
        },
        {
          marker: "*",
          page: "p. 13",
          originalText:
            "* Under the Clery Act, an institution that has on-campus student housing facilities must separately disclose two sets of on-campus statistics: » The total number of crimes that occurred on campus, including crimes that occurred in student housing facilities. » The number of crimes that occurred in on-campus student housing facilities as a subset of the total.",
          summary: "Residence-hall figures are already included in the on-campus figures and must not be added to them.",
        },
        {
          page: "p. 13",
          originalText: "Unfounded Crimes: 2025- 4 unfounded crimes, 2024- 7 unfounded crimes, 2023- 6 unfounded crimes",
          summary:
            "The report gives one unfounded count per year for all offenses combined, not per offense or location; these counts are not entered as figures.",
        },
      ],
      citations: [
        {
          source: "asr2026",
          pinpoint: "p. 13",
          claim: "Salt Lake City Campus crime statistics for calendar years 2023–2025",
          excerpt: "Salt Lake City Campus",
        },
        {
          source: "asr2026",
          pinpoint: "p. 3",
          claim: "Locations covered by the report; the Asia Campus has a separate report",
          excerpt: "The University of Utah Asia Campus in Incheon, South Korea, is covered in a separate Annual Security Report.",
        },
        {
          source: "dps2023Explained",
          claim: "University explanation of the 2023 rape figure",
          excerpt: cleryExplainedExcerpt,
        },
      ],
    },
    {
      reportYear: 2025,
      title: "2025 Annual Security Report (Salt Lake City campus)",
      source: "asr2025",
      years: [2022, 2023, 2024],
      // p. 14, "Salt Lake City Campus". Black figures entered; red UHealth subsets are listed in the notes.
      figures: {
        on_campus: {
          rape: [24, 172, 140],
          fondling: [44, 52, 76],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [4, 158, 122],
          domestic_violence: [15, 28, 16],
          stalking: [67, 116, 128],
        },
        on_campus_residential: {
          rape: [19, 161, 122],
          fondling: [8, 5, 7],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [4, 156, 113],
          domestic_violence: [7, 16, 7],
          stalking: [8, 22, 21],
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
          rape: [6, 3, 6],
          fondling: [7, 3, 7],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: zeros,
          domestic_violence: [5, 2, 3],
          stalking: [2, 1, 3],
        },
      },
      notes: [
        {
          marker: "*",
          page: "p. 14",
          originalText:
            "* One victim/survivor reported being raped by their intimate partner 110 times in on-campus student housing over the course of their relationship in 2022-2023. The inclusion of these 110 incidents significantly increased the total number of rape cases reported in 2024. These incidents also count in the dating violence section.",
          summary:
            "Of the 2024 on-campus rape figure (140), 110 reports came from one victim/survivor about one intimate partner; they are also counted as dating violence.",
        },
        {
          marker: "**",
          page: "p. 14",
          originalText:
            "** One victim/survivor reported being raped by their intimate partner 150 times in on-campus student housing over the course of their relationship in 2021-2022. The inclusion of these 150 incidents significantly increased the total number of rape cases reported in 2023. These incidents also count in the dating violence section.",
          summary:
            "Of the 2023 on-campus rape figure (172), 150 reports came from one victim/survivor about one intimate partner; they are also counted as dating violence.",
        },
        {
          page: "p. 14",
          originalText: "Numbers in red in the 2022, 2023, and 2024 data indicate incidents that happened in the UHealth system.",
          summary:
            "Red figures (UHealth incidents, included in the cell): fondling on campus (25) 2022, (32) 2023, (47) 2024; fondling noncampus (1), (3), (4); domestic violence on campus (6), (11), (5); domestic violence noncampus 2022 printed \"5\" in red, (2) 2023, (3) 2024; dating violence on campus (3) 2024; stalking on campus (8), (35), (37); stalking noncampus (2), (1), none in 2024. No rape figure is marked red.",
        },
        {
          marker: "*",
          page: "p. 14",
          originalText:
            "* Under the Clery Act, an institution that has on-campus student housing facilities must separately disclose two sets of on-campus statistics: » The total number of crimes that occurred on campus, including crimes that occurred in student housing facilities. » The number of crimes that occurred in on-campus student housing facilities as a subset of the total.",
          summary: "Residence-hall figures are already included in the on-campus figures and must not be added to them.",
        },
        {
          page: "p. 14",
          originalText: "Unfounded Crimes: 2024- 7 unfounded crimes, 2023- 6 unfounded crimes, 2022- 6 unfounded crimes",
          summary:
            "The report gives one unfounded count per year for all offenses combined, not per offense or location; these counts are not entered as figures.",
        },
      ],
      citations: [
        {
          source: "asr2025",
          pinpoint: "p. 14",
          claim: "Salt Lake City Campus crime statistics for calendar years 2022–2024",
          excerpt: "Salt Lake City Campus",
        },
        {
          source: "asr2025",
          pinpoint: "p. 3",
          claim: "Locations covered by the report; the Asia Campus has a separate report",
          excerpt: "The University of Utah Asia Campus in Incheon, South Korea, is covered in a separate Annual Security Report.",
        },
        {
          source: "dps2023Explained",
          claim: "University explanation of the 2023 rape figure",
          excerpt: cleryExplainedExcerpt,
        },
        {
          source: "dps2023Explained",
          claim: "How the 2023 reports were counted",
          excerpt:
            "In consultation with the Clery Center and Westat, an advisor for institutions working to comply with the federal law, the U Public Safety Clery team is reporting the total number of sexual assaults the victim-survivor confirmed, rather than a single case.",
        },
      ],
    },
  ],
};
