// Cornell University (Ithaca campus): Annual Security Report transcription.
//
// Transcribed 2026-10-01 by Claude from the PDFs below. Status after import: pending_review.
// A human must check every figure against the PDF before verifying (admin → Colleges → Cornell → report).
//
// How this was read: each statistics table was read twice, from a rendering of the page and from the PDF's
// embedded text, and the two agreed in every cell. The 2023 and 2024 figures appear in both reports and
// match in every cell (no revisions).
//
// Not entered:
// - Unfounded counts. Each report lists all unfounded crimes (p. 7); none are sexual offenses or VAWA offenses,
//   but the reports print no zero for them, so the fields are left blank rather than inferred.
// - Other Clery offenses (burglary, arson, hazing, etc.) and arrests/disciplinary referrals: outside this
//   project's scope.
// - Cornell's other campuses (Cornell Tech, Weill Cornell Medicine) publish separate reports.
//
// Line-break artifacts from the PDF ("inci - dents", "cornell. edu") are joined; wording is otherwise verbatim.

import type { ResearchBundle } from "@/lib/admin/research-bundle";

const zeros = [0, 0, 0];

export const cornellAsr: ResearchBundle = {
  college: {
    slug: "cornell-university",
    updates: {
      enrollment: 26000,
      enrollmentNote: "Approximately 26,000 students in the Ithaca campus community, as stated in the 2026 Annual Security Report.",
    },
    citations: [
      {
        source: "asr2026",
        pinpoint: "p. 5",
        claim: "Enrollment (approximately 26,000 students, Ithaca campus)",
        excerpt: "serves a campus community of approximately 26,000 students and 10,000 faculty and staff.",
      },
    ],
  },

  sources: {
    asr2026: {
      type: "university",
      publisher: "Cornell University Division of Public Safety",
      title: "Campus Watch: 2026 Annual Security Report",
      url: "https://publicsafety.cornell.edu/clery/wp-content/uploads/sites/5/2026-Campus_Watch_2026_FINAL-ua.pdf",
      archivedUrl:
        "https://web.archive.org/web/20260910214221/https://publicsafety.cornell.edu/clery/wp-content/uploads/sites/5/2026-Campus_Watch_2026_FINAL-ua.pdf",
      publicationDate: null,
      retrievedAt: "2026-10-01",
      documentPath: null,
      notes: "Ithaca campus. Crime statistics: p. 6. Unfounded crimes: p. 7. How statistics are collected: p. 5.",
      internalNotes:
        "Retrieved via the Wayback Machine snapshot of 2026-09-10 because the original URL serves a Cloudflare challenge to automated downloads. SHA-256 of the retrieved PDF: 60645f197e24de6279b4164ae2526c5a75cd9750f065036073aae2f372e70cba. Publication date not stated in the document.",
    },
    asr2025: {
      type: "university",
      publisher: "Cornell University Division of Public Safety",
      title: "Campus Watch: 2025 Annual Security Report",
      url: "https://publicsafety.cornell.edu/clery/wp-content/uploads/sites/5/2025_Campus_Watch_FINAL-ua.pdf",
      archivedUrl:
        "https://web.archive.org/web/20251001223713/https://publicsafety.cornell.edu/clery/wp-content/uploads/sites/5/2025_Campus_Watch_FINAL-ua.pdf",
      publicationDate: null,
      retrievedAt: "2026-10-01",
      documentPath: null,
      notes: "Ithaca campus. Crime statistics: p. 6. Unfounded crimes: p. 7. How statistics are collected: p. 5.",
      internalNotes:
        "Retrieved via the Wayback Machine snapshot of 2025-10-01 (original URL blocks automated downloads). SHA-256 of the retrieved PDF: 135738eb467660173c93abaf1a2f8f6cfca92492afd964bc54c5641d97131d8b. Publication date not stated in the document.",
    },
  },

  reports: [
    {
      reportYear: 2026,
      title: "2026 Annual Security Report (Ithaca campus)",
      source: "asr2026",
      years: [2023, 2024, 2025],
      // p. 6, "Cornell University Statistical Crime Reporting". Column groups as printed:
      // "On Campus: including Residential Facilities", "Residential Facilities Only", "Public Property",
      // "Non-Campus Building or Property".
      figures: {
        on_campus: {
          rape: [28, 23, 6],
          fondling: [22, 21, 7],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [35, 24, 14],
          domestic_violence: [7, 1, 1],
          stalking: [40, 22, 31],
        },
        on_campus_residential: {
          rape: [25, 21, 5],
          fondling: [6, 11, 1],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [35, 19, 10],
          domestic_violence: [7, 1, 0],
          stalking: [19, 5, 12],
        },
        public_property: {
          rape: zeros,
          fondling: zeros,
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [1, 0, 1],
          domestic_violence: zeros,
          stalking: zeros,
        },
        noncampus: {
          rape: [0, 1, 5],
          fondling: [1, 1, 0],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [3, 0, 7],
          domestic_violence: [2, 1, 0],
          stalking: [3, 0, 3],
        },
      },
      notes: [
        {
          page: "p. 5",
          originalText:
            "The crime statistics contained in this report are collected from a number of sources and include: (1) crimes reported directly to CUPD, regardless of whether there has been a criminal adjudication of the matter; (2) crimes provided by local municipal police departments with jurisdiction over the university’s Clery geography; and (3) incidents reported to designated Campus Security Authorities, regardless of whether the incident has been investigated.",
          summary: "Figures include reports whether or not they were investigated or led to any court or disciplinary outcome.",
        },
        {
          page: "p. 6",
          originalText:
            "For information regarding all reports of prohibited sexual and related misconduct made to the University in 2025 see https://officeofcivilrights.cornell.edu/data-statistics/.",
          summary: "Cornell publishes a separate count of all sexual misconduct reports made to the university.",
        },
      ],
      citations: [
        {
          source: "asr2026",
          pinpoint: "p. 6",
          claim: "Crime statistics for calendar years 2023–2025",
          excerpt: "Reported in compliance with the Jeanne Clery Campus Safety Act for calendar years 2023, 2024, and 2025.",
        },
      ],
    },
    {
      reportYear: 2025,
      title: "2025 Annual Security Report (Ithaca campus)",
      source: "asr2025",
      years: [2022, 2023, 2024],
      figures: {
        on_campus: {
          rape: [25, 28, 23],
          fondling: [24, 22, 21],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [40, 35, 24],
          domestic_violence: [0, 7, 1],
          stalking: [28, 40, 22],
        },
        on_campus_residential: {
          rape: [21, 25, 21],
          fondling: [22, 6, 11],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [35, 35, 19],
          domestic_violence: [0, 7, 1],
          stalking: [12, 19, 5],
        },
        public_property: {
          rape: zeros,
          fondling: zeros,
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [0, 1, 0],
          domestic_violence: zeros,
          stalking: zeros,
        },
        noncampus: {
          rape: [5, 0, 1],
          fondling: [2, 1, 1],
          incest: zeros,
          statutory_rape: zeros,
          dating_violence: [3, 3, 0],
          domestic_violence: [0, 2, 1],
          stalking: [1, 3, 0],
        },
      },
      notes: [
        {
          page: "p. 5",
          originalText:
            "The crime statistics contained in this report are collected from a number of sources and include: (1) crimes reported directly to CUPD, regardless of whether there has been a criminal adjudication of the matter; (2) crimes provided by local municipal police departments with jurisdiction over the university’s Clery geography; and (3) incidents reported to designated Campus Security Authorities (university staff members with significant responsibility for student and campus affairs, including disciplinary matters), regardless of whether the incident has been investigated.",
          summary: "Figures include reports whether or not they were investigated or led to any court or disciplinary outcome.",
        },
        {
          page: "p. 6",
          originalText:
            "For information regarding all reports of prohibited sexual and related misconduct made to the University in 2024 see https://officeofcivilrights.cornell.edu/data-statistics/.",
          summary: "Cornell publishes a separate count of all sexual misconduct reports made to the university.",
        },
      ],
      citations: [
        {
          source: "asr2025",
          pinpoint: "p. 6",
          claim: "Crime statistics for calendar years 2022–2024",
          excerpt: "Reported in compliance with the Jeanne Clery Campus Safety Act for calendar years 2022, 2023, and 2024.",
        },
      ],
    },
  ],
};
