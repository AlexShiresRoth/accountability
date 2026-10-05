// Harvard University: institutional record.
//
// Transcribed 2026-10-05 by Claude from the 2025 Annual Security Report (pages 4–6, 22–23, 28–54), the Harvard
// Office for Community Support, Non-Discrimination, Rights and Responsibilities (CSNDR) policy and annual-report
// pages, and the Office for Dispute Resolution's FY19–23 complaint data. Status after import: pending_review.
// A human must check each record against the cited page before verifying.
//
// Retrieval: harvard.edu sites (hupd.harvard.edu, csndr.harvard.edu) return HTTP 403 to automated requests, so
// every source was read from a Wayback Machine capture; the capture used is the source's archivedUrl. The 2026
// Annual Security Report could not be retrieved (see research/harvard-university.ts), so the 2025 report is the
// most recent one used here.
//
// Every record is cited with a page or section and a short excerpt. ASR excerpts were checked against the PDF's
// embedded text with two extraction libraries (both matched exactly), and the pages with line-broken phone numbers
// and URLs (pp. 29, 31, 51, 54) were also checked against rendered page images. Line-break artifacts are joined
// ("(617) 496- 5636" → "(617) 496-5636", "confidential -support-share" → "confidential-support-share"); spacing
// printed within a line ("CSA- Confidential", "24- hour") is kept. Summaries are attributed to their source; they
// describe what Harvard says its process is, not an evaluation of how it works in practice.
//
// Confidentiality: marked "confidential" only where the report itself labels the resource confidential (p. 51
// list, p. 47 for SHARE, pp. 52–54 for community resources). The report lists HUPD, CSNDR, the Office for Dispute
// Resolution and Harvard University Health Services as "(CSA)" (Campus Security Authority).
//
// Not entered, and why:
// - Timeline entries: none of these sources gives a dated institutional action within scope. (The policy page
//   notes a September 2, 2025 update to the Title IX policy's definitions; it is recorded in the policy summary.)
// - Full policy texts: the current Interim Title IX Sexual Harassment Policy PDF (2025-09 file) has no Wayback
//   capture, so the policy summary relies on the policy web page and the ASR. Effective dates are left blank: the
//   sources state the conduct the policies cover ("on or after August 14, 2020"), not an adoption date.
// - School-level Title IX Resource Coordinators (e.g. the Harvard College Title IX Office): listed on
//   csndr.harvard.edu/local-title-ix-resource-coordinators, not reviewed; follow-up for a researcher.
// - Other community resources on pp. 52–54 (AVP, ATASK, DOVE, Fenway Health, GLAD, Immigration Equality, MAPS,
//   National Domestic Violence Hotline, RAINN, Saheli, VRLC, TNLR, REACH, RIAC, RESPOND): omitted to keep the list
//   to Cambridge/Massachusetts crisis lines; a human may add them from the same pages.
// - Outcome figures beyond the FY19–23 dashboard: the CSNDR annual-reports page (captured 2026-08-26) lists FY23 as
//   its most recent report; nothing later was located.

import type { ResearchBundle } from "@/lib/admin/research-bundle";

const asr = (pinpoint: string, excerpt: string, claim?: string) => ({ source: "asr2025", pinpoint, excerpt, claim });

export const harvardInstitutional: ResearchBundle = {
  college: { slug: "harvard-university" },
  sources: {
    // Same document as research/harvard-university.ts; the importer reuses the existing source by URL.
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
    },
    titleIxPolicyPage: {
      type: "university",
      publisher: "Harvard University Office for Community Support, Non-Discrimination, Rights and Responsibilities",
      title: "Interim Title IX Sexual Harassment Policy",
      url: "https://csndr.harvard.edu/interim-title-ix-sexual-harassment-policy",
      archivedUrl: "https://web.archive.org/web/20260826113002/https://csndr.harvard.edu/interim-title-ix-sexual-harassment-policy",
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes: "Policy landing page with links to the policy PDF and to the version that applied from 8.14.20 to 9.1.25.",
      internalNotes:
        "Read from the Wayback Machine capture of 2026-08-26 (live site returns HTTP 403 to automated requests). The current policy PDF it links (csndr.harvard.edu/sites/g/files/omnuum12116/files/2025-09/Interim_Title_IX_Sexual_Harassment_Policy.pdf) has no Wayback capture and was not read.",
    },
    otherMisconductPolicyPage: {
      type: "university",
      publisher: "Harvard University Office for Community Support, Non-Discrimination, Rights and Responsibilities",
      title: "Interim Other Sexual Misconduct Policy",
      url: "https://csndr.harvard.edu/interim-other-sexual-misconduct-policy",
      archivedUrl: "https://web.archive.org/web/20260826113002/https://csndr.harvard.edu/interim-other-sexual-misconduct-policy",
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes: "Policy landing page with a link to the policy PDF.",
      internalNotes: "Read from the Wayback Machine capture of 2026-08-26 (live site returns HTTP 403 to automated requests).",
    },
    annualReportsPage: {
      type: "university",
      publisher: "Harvard University Office for Community Support, Non-Discrimination, Rights and Responsibilities",
      title: "Annual Reports and Data",
      url: "https://csndr.harvard.edu/annual-reports",
      archivedUrl: "https://web.archive.org/web/20260826161255/https://csndr.harvard.edu/annual-reports",
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes: "Lists annual reports FY16–FY23.",
      internalNotes: "Read from the Wayback Machine capture of 2026-08-26 (live site returns HTTP 403 to automated requests).",
    },
    odrFy23: {
      type: "university",
      publisher: "Harvard University Office for Gender Equity and Office for Dispute Resolution",
      title: "Annual Report FY23 (FY19–23 Education and Disclosure Data; FY19–23 Complaint Data)",
      url: "https://csndr.harvard.edu/sites/g/files/omnuum12116/files/2025-07/FY23%20Data%20Dashboard%20OGE%20ODR.pdf",
      archivedUrl:
        "https://web.archive.org/web/20250804191545/https://csndr.harvard.edu/sites/g/files/omnuum12116/files/2025-07/FY23%20Data%20Dashboard%20OGE%20ODR.pdf",
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes:
        "10-page data dashboard. Office for Gender Equity education and disclosure data: PDF pp. 1–3. Office for Dispute Resolution complaint data (its own page numbering starts at 1 on PDF p. 4): PDF pp. 4–10.",
      internalNotes:
        "Linked as \"FY23 (PDF)\" from https://csndr.harvard.edu/annual-reports via the resource page https://csndr.harvard.edu/resource/annual-report-fy23 (Wayback capture 2025-08-23; it gives \"Size: 396.99 KB\" and \"Date: 07/25/2025\", which matches the retrieved file's 406,522 bytes). Retrieved via the Wayback Machine snapshot of 2025-08-04. SHA-256: e1333d332c14ede255c86b5b49abc5efa7db2d9fe62f5f511669dbf6c202ff0f. Publication date not stated in the document (PDF metadata: created 2024-08-15).",
    },
  },
  reports: [],

  records: [
    // -----------------------------------------------------------------------------------------------------------
    // Institutional response
    // -----------------------------------------------------------------------------------------------------------
    {
      key: "institutional_response",
      input: {
        topic: "title_ix_process",
        findingKind: "documented",
        summary:
          "According to the 2025 Annual Security Report, Harvard addresses sexual assault, dating violence, domestic violence and stalking under two university-wide policies covering conduct on or after August 14, 2020: the Interim Title IX Sexual Harassment Policy and the Interim Other Sexual Misconduct Policy, for conduct outside the Title IX policy's jurisdiction. Formal complaints are filed with the University Title IX Coordinator and investigated by the Office for Dispute Resolution (ODR), which the report describes as a neutral body. The report states that the student procedures under the Title IX policy ordinarily conclude within 90 business days of receipt of a formal complaint, and the investigation under the other-misconduct procedures within 75 business days, with extensions possible.",
      },
      citations: [
        asr("p. 28", "The University’s Interim Title IX Sexual Harassment Policy, as linked below, addresses conduct prohibited by Title IX of the Education Amendments of 1972 and the Clery Act as amended by the Violence Against Women Act."),
        asr("p. 32", "ODR is a neutral body that impartially investigates formal complaints of sexual harassment and/or other sexual misconduct against students, staff, and, for most Schools, faculty."),
        asr("p. 39", "ordinarily within 90 business days of receipt of the formal complaint."),
        asr("p. 39", "ordinarily within 75 business days of receipt of the formal complaint."),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "disciplinary_procedures",
        findingKind: "documented",
        summary:
          "According to the 2025 Annual Security Report, findings use a preponderance-of-the-evidence standard. Under the Title IX policy, a trained panel of decision-makers holds a live hearing and determines responsibility; discipline is then decided by the respondent's School or unit through its own process. Parties may appeal to a panel drawn from annually trained faculty and administrators. The report lists the available sanctions for students as warning, reprimand, probation, involuntary leave of absence, suspension, requirement to withdraw, dismissal and expulsion, and for employees as verbal or written warning, suspension or termination; the 2025 report states these for calendar years 2021–2023.",
      },
      citations: [
        asr("p. 41", "The standard of evidence used is a preponderance of the evidence, which means a finding by the University that it is “more likely than not” that the violation occurred."),
        asr("p. 41", "Following the conclusion of the investigation, the investigative report will be provided to a trained panel of decision-makers (comprised of trained experts within and outside the Harvard community), who conduct a live hearing."),
        asr("p. 42", "In all instances, the administration of discipline rests with the School or unit of the Respondent and imposition of discipline is handled through the School/unit process."),
        asr("p. 42", "During calendar years 2021, 2022, and 2023, the available sanctions for domestic violence, dating violence, sexual assault, and stalking were: warning, reprimand, probation, involuntary leave of absence, suspension, requirement to withdraw, dismissal, and expulsion."),
        asr("p. 42", "Appeals are considered by an impartial panel selected from a pool of annually trained faculty and administrators."),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "law_enforcement_referrals",
        findingKind: "documented",
        summary:
          "According to the 2025 Annual Security Report, people who have experienced sexual misconduct may report to the university, to state or local law enforcement, both, or neither, and may ask the university for help making a report to police. Contacting the Harvard University Police Department (HUPD) does not commit a person to filing charges or testifying. Reports to HUPD are assigned to its Sensitive Crime Unit. A person may pursue a university formal complaint whether or not they pursue criminal prosecution.",
      },
      citations: [
        asr("p. 29", "Those who have experienced sexual misconduct have the right to report to the University and/or to state or local law enforcement, the right to seek assistance from the University in making a report to University, state, or local law enforcement, and the right not to report."),
        asr("p. 30", "By contacting HUPD, you are not making a commitment to file charges or to testify in court."),
        asr("p. 32", "The HUPD’s Sensitive Crime Unit, which includes detectives from the Criminal Investigation Division and selected patrol officers, will be assigned to the case."),
        asr("p. 37", "Regardless of whether you choose to pursue criminal prosecution, you may decide to initiate a formal complaint under Harvard’s Interim Title IX Sexual Harassment Policy"),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "prevention_programs",
        findingKind: "documented",
        summary:
          "According to the 2025 Annual Security Report, all incoming and returning students must complete School-level eLearning modules each year covering university policies, procedures, supports, bystander intervention and resources, and benefits-eligible faculty and staff are regularly required to complete an eLearning module on the university's anti-discrimination and Title IX policies. Incoming undergraduates attend a live event called Communities of Care, followed by small-group Entryway Conversations. The report also says HUPD and the Schools offer approximately 200 crime prevention and security awareness programs each academic year.",
      },
      citations: [
        asr("p. 48", "Each year, all incoming and all returning students are required to complete custom School-level eLearning modules that reviews the University’s Policies, procedures, supports, bystander intervention, and resources."),
        asr("p. 48", "each year all benefits-eligible faculty and staff are regularly required to complete an eLearning module that reviews the University’s anti-discrimination policies, including the University’s Title IX Policies, procedures, supports, and resources, including their roles as responsible employees."),
        asr("p. 49", "all incoming undergraduate students participate in a large format live event called Communities of Care"),
        asr("p. 22", "HUPD, in conjunction with the various Harvard Schools, offers approximately 200 crime prevention and security awareness educational programs each academic year."),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "reporting_procedures",
        findingKind: "documented",
        summary:
          "According to the 2025 Annual Security Report, reports can be made to HUPD, to local police, to a School or unit Title IX Resource Coordinator, or as a formal complaint to the University Title IX Coordinator. Contacting a Title IX Resource Coordinator is not the same as filing a formal complaint. University officers, other than those with a legal confidentiality obligation, must notify the School or unit Title IX Resource Coordinator about possible sexual misconduct whether or not a complaint is filed. A person who reports receives a written explanation of rights, options and resources, and supportive measures are available without a formal complaint or a police report.",
      },
      citations: [
        asr("p. 29", "University officers, other than those who are prohibited from reporting because of a legal confidentiality obligation or prohibition against reporting, must promptly notify the School or unit Title IX Resource Coordinator about possible sexual harassment or other sexual misconduct, regardless of whether a complaint is filed."),
        asr("p. 33", "Contacting your School or unit Title IX Resource Coordinator is not the same as filing a formal complaint with the University Title IX Coordinator."),
        asr("p. 30", "If you report that you have been the victim of dating violence, domestic violence, sexual assault or stalking, whether on or off campus, you will be provided with a written explanation of your rights and options as well as resources and services available both at Harvard and in the community."),
        asr("p. 34", "It is important to know that you do not have to file a formal complaint with the University Title IX Coordinator or a report with HUPD in order to receive supportive measures."),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "outcome_information",
        findingKind: "documented",
        summary:
          "Harvard publishes aggregate outcome data for sexual harassment and other sexual misconduct complaints. The Office for Dispute Resolution's FY19–23 complaint data, covering formal complaints filed between July 1, 2018 and June 30, 2023, reports that of 85 complaints opened for investigation, 40% resulted in a policy violation finding, 38% in no policy violation, 2% in no policy violation but sanctions under local School policies, and 7% in informal resolution, with 13% pending as of December 31, 2023. The CSNDR annual reports page (captured August 2026) lists FY23 as its most recent report. According to the 2025 Annual Security Report, the parties are notified simultaneously in writing of the outcome, any change on appeal, and when results become final.",
      },
      citations: [
        { source: "odrFy23", pinpoint: "PDF p. 4 (ODR section p. 1)", excerpt: "Outcomes of Complaints Opened for Investigation (n = 85)", claim: "Outcome breakdown (percentages as printed on the chart)" },
        { source: "odrFy23", pinpoint: "PDF p. 4 (ODR section p. 1)", excerpt: "Formal complaints filed between July 1, 2018 - June 30, 2023.", claim: "Period covered" },
        {
          source: "annualReportsPage",
          pinpoint: "Annual Reports and Data",
          excerpt:
            "Read comprehensive yearly reports on the Office for Community Support, Non-Discrimination, Rights and Responsibilities, (formerly the Office for Gender Equity; and the Title IX Office) and the Office for Dispute Resolution’s activities, growth, and statistics.",
          claim: "Harvard publishes yearly reports with statistics",
        },
        asr("p. 42", "The parties will be simultaneously notified of the process to appeal, any change to the result following an appeal, and when the results become final."),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "transparency_practices",
        findingKind: "documented",
        summary:
          "According to the 2025 Annual Security Report, HUPD does not publish victims' names or identifying information in its crime log, timely warnings, online, or in the annual Clery statistics, and training materials for the Title IX Coordinator, investigators, decision-makers and others are publicly available. Harvard's CSNDR publishes yearly reports with statistics on its and the Office for Dispute Resolution's work (most recent listed: FY23).",
      },
      citations: [
        asr("p. 43", "HUPD does not publish the name of crime victims nor does it include identifiable information regarding victims in the HUPD crime log, in campus Timely Warnings, online, or in the annual crime statistics that are disclosed in compliance with the Jeanne Clery Campus Safety Act."),
        asr("p. 42", "Consistent with State and federal law, training materials are publicly available at:"),
        {
          source: "annualReportsPage",
          pinpoint: "Annual Reports and Data",
          excerpt:
            "Read comprehensive yearly reports on the Office for Community Support, Non-Discrimination, Rights and Responsibilities, (formerly the Office for Gender Equity; and the Title IX Office) and the Office for Dispute Resolution’s activities, growth, and statistics.",
        },
      ],
    },

    // -----------------------------------------------------------------------------------------------------------
    // Policies
    // -----------------------------------------------------------------------------------------------------------
    {
      key: "policy",
      input: {
        policyType: "title_ix",
        title: "Interim Title IX Sexual Harassment Policy",
        summary:
          "Harvard's university-wide policy for sexual harassment within the scope of Title IX, including sexual assault, dating violence, domestic violence and stalking, for conduct on or after August 14, 2020. According to Harvard's policy page, the definitions of sexual assault, dating violence, domestic violence and stalking in the policy's Appendix A were updated on September 2, 2025; an earlier version applies to conduct between August 14, 2020 and September 1, 2025. Complete policies and procedures are published at https://csndr.harvard.edu/university-title-ix-policies.",
        effectiveDate: null,
      },
      citations: [
        {
          source: "titleIxPolicyPage",
          pinpoint: "Policy page",
          excerpt:
            "This Policy is designed to address conduct that falls within Title IX of the Education Amendments of 1972 and other federal and state laws and regulations. This Policy addresses misconduct occurring on or after August 14, 2020.",
        },
        {
          source: "titleIxPolicyPage",
          pinpoint: "Policy page, note",
          excerpt:
            "The definitions of sexual assault, dating violence, domestic violence, and stalking in Appendix A of the Interim Title IX Sexual Harassment Policy were updated consistent with federal law on September 2, 2025.",
          claim: "September 2025 update",
        },
        asr("p. 28", "The University’s Interim Title IX Sexual Harassment Policy, as linked below, addresses conduct prohibited by Title IX of the Education Amendments of 1972 and the Clery Act as amended by the Violence Against Women Act."),
        asr("p. 28", "The Policies may be viewed in their entirety at this website: https://csndr.harvard.edu/university-title-ix-policies.", "Where the full policies are published"),
      ],
    },
    {
      key: "policy",
      input: {
        policyType: "sexual_misconduct",
        title: "Interim Other Sexual Misconduct Policy",
        summary:
          "Harvard's university-wide policy for sexual misconduct that falls outside the jurisdiction of the Interim Title IX Sexual Harassment Policy, for conduct on or after August 14, 2020. The 2025 Annual Security Report says it addresses misconduct that may still be covered by the Clery Act and other laws.",
        effectiveDate: null,
      },
      citations: [
        {
          source: "otherMisconductPolicyPage",
          pinpoint: "Policy page",
          excerpt:
            "This Policy is designed to address sexual misconduct that falls outside the jurisdiction of the Interim Sexual Harassment Policy. This Policy addresses misconduct occurring on or after August 14, 2020.",
        },
        asr("p. 28", "The University’s Interim Other Sexual Misconduct Policy is designed to address sexual misconduct that falls outside the jurisdiction of the Interim Title IX Sexual Harassment Policy, but may still be covered by the Clery Act and other laws"),
      ],
    },
    {
      key: "policy",
      input: {
        policyType: "supportive_measures",
        title: "Supportive measures",
        summary:
          "According to the 2025 Annual Security Report, Harvard offers individualized supportive measures, in writing, to people affected by sexual harassment or other sexual misconduct, whether the harm occurred on or off campus and whether or not they file a formal complaint or report to police. Examples listed include course-related extensions and adjustments, university-issued no contact orders, work or course schedule adjustments, changes in housing and seating, leaves of absence, and increased monitoring of certain areas of campus. Requests go to the School or unit Title IX Resource Coordinator or the University Title IX Coordinator.",
        effectiveDate: null,
      },
      citations: [
        asr("p. 35", "The University will offer the impacted person supportive measures, in writing, and will make clear that they are available regardless of whether harm occurred on or off campus and regardless of whether the impacted person files a formal complaint or makes a report to HUPD or local law enforcement."),
        asr("p. 33", "Supportive measures may be implemented at any time and may include:"),
      ],
    },

    // -----------------------------------------------------------------------------------------------------------
    // Resources: reporting channels
    // -----------------------------------------------------------------------------------------------------------
    {
      key: "student_resource",
      input: {
        category: "campus_police",
        confidentiality: "institutional_reporting",
        name: "Harvard University Police Department (HUPD)",
        description:
          "Cambridge campus: 617-495-1212. Longwood campus: 617-432-1212. Headquarters at 1033 Massachusetts Avenue, sixth floor. The report's resource list gives 617-495-1796 for HUPD's personal and violent crime page.",
        phone: "617-495-1212",
        url: "http://www.hupd.harvard.edu/personal-and-violent-crime",
        hours: "24 hours a day",
        available247: true,
        sortOrder: 0,
      },
      citations: [
        asr("p. 30", "Call the HUPD at 617-495-1212 (Cambridge Campus) or 617-432-1212 (Longwood Campus) to report the incident.", "Contact details"),
        asr("p. 23", "If you are the victim of a theft, report it immediately to the HUPD at 617-495-1212. We are available 24 hours a day.", "24-hour availability"),
        asr("p. 51", "Harvard University Police Department (HUPD) (CSA) 617-495-1796", "Resource list entry"),
        asr("p. 4", "HUPD’s headquarters is located at 1033 Massachusetts Avenue, on the sixth floor.", "Headquarters"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "title_ix",
        confidentiality: "institutional_reporting",
        name: "University Title IX Coordinator (NDAB & Title IX Compliance Team, CSNDR)",
        description:
          "Formal complaints are filed with the University Title IX Coordinator. Email CSNDR_TitleIX@harvard.edu. Smith Campus Center, Suite 901, 1350 Massachusetts Avenue, Cambridge. Each School also has Title IX Resource Coordinators, listed at https://csndr.harvard.edu/local-title-ix-resource-coordinators.",
        phone: "(617)-496-0200",
        url: "https://csndr.harvard.edu/title-ix",
        hours: null,
        available247: null,
        sortOrder: 0,
      },
      citations: [
        asr("p. 32", "The NDAB & Title IX Compliance Team can be reached by email at CSNDR_TitleIX@harvard.edu, or by telephone: (617)-496-0200, and is located in the Smith Campus Center, Suite 901, 1350 Massachusetts Avenue, Cambridge.", "Contact details"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "title_ix",
        confidentiality: "institutional_reporting",
        name: "Office for Dispute Resolution (ODR)",
        description:
          "Investigates formal complaints of sexual harassment and other sexual misconduct; can also give information about filing a complaint or seeking informal resolution. Email odr@harvard.edu. Smith Campus Center, Suite 901, 1350 Massachusetts Avenue, Cambridge.",
        phone: "(617) 495-3786",
        url: "http://odr.harvard.edu",
        hours: null,
        available247: null,
        sortOrder: 1,
      },
      citations: [
        asr("p. 32", "ODR can be reached by email at odr@harvard.edu, or by telephone at (617) 495-3786, and is located in the Smith Campus Center, Suite 901, 1350 Massachusetts Avenue, Cambridge.", "Contact details"),
        asr("p. 51", "Office for Dispute Resolution (CSA) 617-495-3786", "Resource list entry"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "local_law_enforcement",
        confidentiality: "institutional_reporting",
        name: "Cambridge Police Department Sexual Assault Unit",
        description: "A report may be made to local police even if the incident occurred on campus.",
        phone: "617-349-3381",
        url: null,
        hours: null,
        available247: null,
        sortOrder: 0,
      },
      citations: [asr("p. 30", "The Cambridge Police Department’s Sexual Assault Unit may be reached directly by calling 617-349-3381.", "Contact details")],
    },
    {
      key: "student_resource",
      input: {
        category: "local_law_enforcement",
        confidentiality: "institutional_reporting",
        name: "Boston Police Department Sexual Assault Unit",
        description: "A report may be made to local police even if the incident occurred on campus.",
        phone: "617-343-4400",
        url: null,
        hours: null,
        available247: null,
        sortOrder: 1,
      },
      citations: [asr("p. 30", "The Boston Police Department’s Sexual Assault Unit may be reached directly by calling 617-343-4400.", "Contact details")],
    },
    {
      key: "student_resource",
      input: {
        category: "local_law_enforcement",
        confidentiality: "institutional_reporting",
        name: "Somerville Police Department Family Services Unit",
        description: "A report may be made to local police even if the incident occurred on campus.",
        phone: "617-625-1600 ext. 7237",
        url: null,
        hours: null,
        available247: null,
        sortOrder: 2,
      },
      citations: [asr("p. 30", "The Somerville Police Department’s Family Services Unit may be reached directly by calling 617-625-1600 ext. 7237.", "Contact details")],
    },

    // -----------------------------------------------------------------------------------------------------------
    // Resources: confidential (as labeled in the report)
    // -----------------------------------------------------------------------------------------------------------
    {
      key: "student_resource",
      input: {
        category: "victim_advocacy",
        confidentiality: "confidential",
        name: "SHARE Team (Sexual Harassment/Assault Resources and Education)",
        description:
          "Confidential counseling, groups, advocacy, accompaniment, safety planning and referrals for students, staff, faculty and post-doctoral fellows. 24/7 confidential hotline 617-495-9100; from June 1 through August 14 the hotline is forwarded to the Boston Area Rape Crisis Center. Office (non-urgent): (617) 496-5636. Email CommunitySupport_SHARE@harvard.edu. Smith Campus Center Suite 624.",
        phone: "617-495-9100",
        url: "https://csndr.harvard.edu/confidential-support-share",
        hours: "24/7 hotline",
        available247: true,
        sortOrder: 0,
      },
      citations: [
        asr("p. 30", "For immediate assistance, SHARE maintains a confidential hotline, 617-495-9100, which is staffed 24 hours a day, 7 days a week by SHARE counselors.", "Hotline"),
        asr("p. 47", "Meetings with the SHARE Team are free, voluntary, confidential, and privileged.", "Confidentiality"),
        asr("p. 31", "Please note, from June 1st through August 14th, the SHARE confidential Hotline is forwarded to the Boston Area Rape Crisis Center (BARCC).", "Summer forwarding"),
        asr("p. 31", "For all non-urgent matters, please contact the SHARE main line at (617) 496-5636", "Office line"),
        asr("p. 29", "Additional information regarding confidential resources can be found at: https://csndr.harvard.edu/confidential-support-share.", "URL"),
        asr("p. 47", "Smith Campus Center Suite 624", "Office location"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "counseling",
        confidentiality: "confidential",
        name: "Counseling and Mental Health Services (CAMHS), Harvard University Health Services",
        description: "The CAMHS Cares Line is available 24/7/365; CAMHS staff are available for urgent care during business hours at the same number.",
        phone: "617-495-2042",
        url: "https://huhs.harvard.edu/counseling-and-mental-health",
        hours: "Cares Line 24/7/365",
        available247: true,
        sortOrder: 0,
      },
      citations: [
        asr("p. 51", "Counseling & Mental Health Services, HUHS (confidential and privileged) 617-495-2042", "Confidential resource"),
        asr("p. 35", "If you need mental health support, the CAMHS Cares Line is available 24/7/365 at 617-495-2042.", "24/7 availability"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "counseling",
        confidentiality: "confidential",
        name: "Behavioral Health, Harvard University Health Services",
        description: null,
        phone: "617-495-2323",
        url: "https://huhs.harvard.edu/behavioral-health",
        hours: null,
        available247: null,
        sortOrder: 1,
      },
      citations: [asr("p. 51", "Behavioral Health, HUHS (confidential and privileged) 617-495-2323", "Confidential resource")],
    },
    {
      key: "student_resource",
      input: {
        category: "counseling",
        confidentiality: "confidential",
        name: "Harvard Chaplains",
        description: "Website: www.chaplains.harvard.edu (as printed in the report).",
        phone: "617-495-5529",
        url: null,
        hours: null,
        available247: null,
        sortOrder: 2,
      },
      citations: [asr("p. 51", "Harvard Chaplains (confidential and privileged) 617-495-5529", "Confidential resource")],
    },
    {
      key: "student_resource",
      input: {
        category: "counseling",
        confidentiality: "confidential",
        name: "Harvard Employee Assistance Program",
        description: "For Harvard University staff and faculty.",
        phone: "877-327-4278",
        url: "https://hr.harvard.edu/wellbeing",
        hours: null,
        available247: null,
        sortOrder: 3,
      },
      citations: [asr("p. 51", "Harvard Employee Assistance Program (for Harvard University staff and faculty) (confidential) 877-327-4278", "Confidential resource")],
    },
    {
      key: "student_resource",
      input: {
        category: "confidential",
        confidentiality: "confidential",
        name: "Harvard Ombuds Office",
        description:
          "Listed in the report as \"CSA- Confidential\". Cambridge office: confidential telephone 617-495-7748, ombuds_cambridge@harvard.edu. Longwood office: 164 Longwood Ave., First Floor, Boston, MA 02115, confidential telephone 617-432-4041.",
        phone: "617-495-7748",
        url: null,
        hours: null,
        available247: null,
        sortOrder: 0,
      },
      citations: [
        asr("p. 51", "Harvard Ombuds Office, Cambridge (CSA- Confidential)", "Confidentiality label"),
        asr("p. 51", "Confidential Telephone: 617-495-7748", "Contact details"),
      ],
    },

    // -----------------------------------------------------------------------------------------------------------
    // Resources: medical
    // -----------------------------------------------------------------------------------------------------------
    {
      key: "student_resource",
      input: {
        category: "medical",
        confidentiality: "unknown",
        name: "Harvard University Health Services (HUHS)",
        description:
          "Medical care including a physical exam, STI testing and emergency contraception; not a Sexual Assault Nurse Examiner (SANE) site. Urgent Care at Smith Campus Center, 8:00 a.m.–6:00 p.m., Monday through Sunday and most holidays; after hours, the Urgent Care Nurse Advice Line at the same number. The report lists HUHS as a Campus Security Authority (CSA) and states that, under Massachusetts law, HUHS forwards a report without the victim's name or identifying information to the police in the jurisdiction where an assault occurred. Website: www.huhs.harvard.edu (as printed).",
        phone: "617-495-5711",
        url: null,
        hours: "Urgent Care 8:00 a.m.–6:00 p.m. daily; nurse advice line after hours",
        available247: null,
        sortOrder: 0,
      },
      citations: [
        asr("p. 35", "Please call 617-495-5711 to seek care and discuss further options with HUHS:", "Contact details"),
        asr("p. 35", "Urgent Care is located at Smith Campus Center 8:00 a.m.- 6:00 pm, Monday through Sunday and most Holidays.", "Hours"),
        asr("p. 51", "Harvard University Health Services (HUHS) (CSA) 617-495-5711", "Listed as CSA"),
        asr("p. 44", "HUHS is required to forward a confidential report to the Police Chief or Commissioner in the jurisdiction in which the alleged assault occurred. This report will not include the victim’s name, address, or other identifying information", "Report to police without identifying information"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "medical",
        confidentiality: "unknown",
        name: "Beth Israel Deaconess Medical Center (BIDMC): Center for Violence Prevention and Recovery",
        description:
          "Independent of Harvard. Rape Crisis Intervention Program: emergency room services open 24/7 with medical care, forensic evidence collection and crisis counseling; follow-up care, counseling and support groups. The report notes that community resources are not legally required to report crimes to the university.",
        phone: "617-667-8141",
        url: null,
        hours: "Emergency room open 24/7",
        available247: true,
        sortOrder: 1,
      },
      citations: [
        asr("p. 52", "Beth Israel Deaconess Medical Center (BIDMC): Center for Violence Prevention and Recovery Phone: 617-667-8141", "Contact details"),
        asr("p. 52", "Emergency room services, open 24/7, offering medical care, forensic evidence collection, and crisis counseling", "24/7 availability"),
        asr("p. 52", "Community Resources are not legally required to report crimes to the University", "Not a university reporting channel"),
      ],
    },

    // -----------------------------------------------------------------------------------------------------------
    // Resources: community crisis lines (pp. 52–54; "not legally required to report crimes to the University")
    // -----------------------------------------------------------------------------------------------------------
    {
      key: "student_resource",
      input: {
        category: "victim_advocacy",
        confidentiality: "confidential",
        name: "Boston Area Rape Crisis Center (BARCC)",
        description:
          "Independent of Harvard. Free, confidential, 24-hour hotline for anyone who has experienced sexual assault, and their families and friends; also medical advocacy, legal services, counseling and case management. TTY: 800-439-2370.",
        phone: "800-841-8371",
        url: null,
        hours: "24-hour hotline",
        available247: true,
        sortOrder: 1,
      },
      citations: [
        asr("p. 52", "Boston Area Rape Crisis Center (BARCC) Hotline: 800-841-8371; TTY: 800-439-2370", "Contact details"),
        asr("p. 52", "The Boston Area Rape Crisis Center operates a free, confidential, 24-hour hotline for anyone who has experienced sexual assault, their", "Confidential 24-hour hotline"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "victim_advocacy",
        confidentiality: "confidential",
        name: "SafeLink Domestic Violence Hotline (Casa Myrna)",
        description:
          "Independent of Harvard. Statewide 24/7 toll-free hotline for anyone in Massachusetts affected by domestic violence; calls are free, confidential and anonymous. TTY: 1-877-521-2601.",
        phone: "1-877-785-2020",
        url: null,
        hours: "24/7",
        available247: true,
        sortOrder: 2,
      },
      citations: [
        asr("p. 54", "SafeLink is a statewide, 24/7 toll-free hotline for anyone in Massachusetts who is affected by domestic violence. Calls are free, confidential, and anonymous.", "Confidential 24/7 hotline"),
        asr("p. 54", "SafeLink Domestic Violence Hotline: 1-877-785-2020; TTY: 1-877-521-2601 (both operated by Casa Myrna)", "Contact details"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "victim_advocacy",
        confidentiality: "confidential",
        name: "Transition House",
        description:
          "Independent of Harvard. Emergency shelter, transitional and supported housing, and youth prevention education for the Cambridge community, with a confidential 24-hour crisis line. Email info@transitionhouse.org.",
        phone: "617-661-7203",
        url: null,
        hours: "24-hour crisis line",
        available247: true,
        sortOrder: 3,
      },
      citations: [
        asr("p. 54", "Transition House Hotline: 617-661-7203; info@transitionhouse.org", "Contact details"),
        asr("p. 54", "Transition House operates a confidential, 24- hour crisis line.", "Confidential 24-hour line"),
      ],
    },
  ],
};
