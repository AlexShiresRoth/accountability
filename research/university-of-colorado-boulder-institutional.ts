// University of Colorado Boulder: institutional record.
//
// Transcribed 2026-10-05 by Claude from four official sources (see `sources`):
// - the 2026 Annual Security Report and Annual Fire Safety Report (PDF pp. 8, 18–19, 46–77, 85–86; same document as
//   research/university-of-colorado-boulder.ts);
// - University of Colorado Administrative Policy Statement 5014, "Sexual Misconduct, Intimate Partner Violence, and
//   Stalking" (CU system policy that applies to all campuses), "Last Reviewed/Updated: October 1, 2026";
// - the Office of Institutional Equity and Compliance (OIEC) "Student Respondent Statistical Report, Fiscal Year
//   2025-2026" (dated August 1, 2026);
// - the OIEC Statistical Reports web page that lists those reports.
// Status after import: pending_review. A human must check each record against the cited page before verifying.
//
// Pages: the ASR prints no page numbers, so it is cited by PDF page ("PDF p. N"). APS 5014 and the OIEC report print
// page numbers: APS 5014 printed page = PDF page; OIEC report printed page = PDF page − 1. Every excerpt was checked
// by script against the PDF's text (PyMuPDF), ignoring line breaks and spacing; line-break artifacts are joined
// ("303- 492-2127" → "303-492-2127"). The OIEC report's superscript footnote markers run into the numbers in the
// embedded text ("277", "278", "2612"); renderings of PDF pp. 6 and 8 show "27⁷", "27⁸" and "26¹²", so the figures
// are 27 and 26. Summaries are attributed to their source; they describe what CU Boulder says its process is, not
// an evaluation of how it works in practice.
//
// URLs: the ASR's resource tables print shortened addresses ("Colorado.EDU/OVA/"); the `url` fields use the link
// targets embedded in the PDF at those addresses (e.g. https://www.colorado.edu/ova/). Phone numbers are copied as
// printed in the ASR resource tables (PDF pp. 62–64), including the "(303)-" format.
//
// Confidentiality: "confidential" only where the ASR labels the resource "Confidential Service" or "Confidential
// Services" (PDF pp. 62–63; the ASR says these "are structured as confidential resources", PDF p. 61). OIEC and CUPD
// are reporting channels; the ASR says "The OIEC reporting process is not confidential" (PDF p. 58). Resources the
// ASR does not label (Boulder Community Health, the Sheriff's and Boulder Police victim advocates) are "unknown".
//
// Not entered, and why:
// - Timeline entries (institution actions): none of these sources describes a dated institutional action within
//   scope. APS 5014's revision history (effective September 2, 2021; technical changes October 1, 2026) is on the
//   policy record.
// - The OIEC Resolution Procedures and the Protected Class Nondiscrimination Policy (APS 5065): linked from the ASR
//   but not read for this record; the process summary relies on the ASR's description of them.
// - OIEC FY2025-26 employee and unaffiliated-respondent reports, and earlier fiscal years: not reviewed (follow-up).
// - The OIEC student report's Table 3 totals 236 student respondents while its text says 234 (PDF p. 6). Both
//   numbers are printed; the outcome record quotes the text figure and notes the table total.
// - Faculty and Staff Assistance Program (employees only), Student Outreach, Advocacy & Support, Department of Threat
//   Assessment, Boulder County Housing and Human Services, TRU Community Care, EFAA, and the state/national online
//   resources on PDF p. 64: not sexual-violence crisis services or not student-facing; a human may add them.
// - UCHealth Longs Peak Hospital (medical forensic exams, PDF p. 57): no phone number given in the ASR.
// - The 2024 Sexual Assault and Related Harms Survey (mentioned on PDF p. 54): survey results not reviewed here.

import type { ResearchBundle } from "@/lib/admin/research-bundle";

const asr = (pinpoint: string, excerpt: string, claim?: string) => ({ source: "asr2026", pinpoint, excerpt, claim });
const aps = (pinpoint: string, excerpt: string, claim?: string) => ({ source: "aps5014", pinpoint, excerpt, claim });
const oiec = (pinpoint: string, excerpt: string, claim?: string) => ({ source: "oiecStudent2026", pinpoint, excerpt, claim });

export const cuBoulderInstitutional: ResearchBundle = {
  college: { slug: "university-of-colorado-boulder" },
  sources: {
    // Same document as research/university-of-colorado-boulder.ts; the importer reuses the existing source by URL.
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
    },
    aps5014: {
      type: "university",
      publisher: "University of Colorado",
      title: "Administrative Policy Statement 5014: Sexual Misconduct, Intimate Partner Violence, and Stalking",
      url: "https://www.cu.edu/sites/default/files/aps/79746-aps-5014-sexual-misconduct-intimate-partner-violence-and-stalking/aps/5014.pdf",
      archivedUrl:
        "https://web.archive.org/web/20261005152829/https://www.cu.edu/sites/default/files/aps/79746-aps-5014-sexual-misconduct-intimate-partner-violence-and-stalking/aps/5014.pdf",
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes:
        "CU system policy; applies to all campuses. Effective September 2, 2021; \"Last Reviewed/Updated: October 1, 2026 (Technical Changes Made)\". Prevention and reporting: section V (pp. 3–8). Title IX Coordinator responsibilities, including annual reporting: section VI (pp. 8–9). History: section XII (p. 20).",
      internalNotes:
        "Downloaded directly with curl on 2026-10-05 from the PDF linked on https://www.cu.edu/ope/aps/5014. 20 pages; printed page = PDF page. SHA-256: df24b2e6927943997e960bb3fab5d6e7499b0ab57973cbb1d2ef27d060333c88 (PDF metadata: created 2026-09-30). The only earlier Wayback capture (2025-07-10) predates the October 2026 update, so a Save Page Now capture was made on 2026-10-05 (archivedUrl); it was downloaded and is byte-identical.",
    },
    oiecStudent2026: {
      type: "university",
      publisher: "University of Colorado Boulder Office of Institutional Equity and Compliance",
      title: "Student Respondent Statistical Report, Fiscal Year 2025-2026",
      url: "https://www.colorado.edu/oiec/media/209",
      archivedUrl: "https://web.archive.org/web/20261005152835/https://www.colorado.edu/oiec/media/209",
      publicationDate: "2026-08-01",
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes:
        "Covers complaints received July 1, 2025 – June 30, 2026 against CU Boulder student respondents. Sexual misconduct complaints: pp. 5–7 (PDF pp. 6–8). Printed page = PDF page − 1.",
      internalNotes:
        "Linked as \"Student Statistical Report\" under \"Fiscal Year 2025-26\" on https://www.colorado.edu/oiec/data/annual-oiec-statistics/oiec-statistical-reports. Downloaded directly with curl on 2026-10-05 (Last-Modified Fri, 21 Aug 2026). 8 pages. SHA-256: 48672f74bd8fcf83f1ba069c423930e0d373b99617973e73a93ddeeb08d7d8b8. No earlier Wayback capture; a Save Page Now capture was made on 2026-10-05 (archivedUrl), downloaded and byte-identical. Date \"8-1-2026\" on the cover and \"August 1, 2026\" in the running footer. Superscript footnote markers run into numbers in the embedded text; checked against renderings of PDF pp. 6–8.",
    },
    oiecReportsPage: {
      type: "university",
      publisher: "University of Colorado Boulder Office of Institutional Equity and Compliance",
      title: "OIEC Statistical Reports",
      url: "https://www.colorado.edu/oiec/data/annual-oiec-statistics/oiec-statistical-reports",
      archivedUrl:
        "https://web.archive.org/web/20261005153045/https://www.colorado.edu/oiec/data/annual-oiec-statistics/oiec-statistical-reports",
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes: "Lists OIEC statistical reports for fiscal years 2021-22 through 2025-26.",
      internalNotes: "Read with curl on 2026-10-05. Save Page Now capture made the same day (archivedUrl) and confirmed to contain the quoted text.",
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
          "According to the 2026 Annual Security Report, reports of sexual assault, dating and domestic violence and stalking are handled by CU Boulder's Office of Institutional Equity and Compliance (OIEC) under the University of Colorado Sexual Misconduct, Intimate Partner Violence, and Stalking Policy (APS 5014), a CU system policy that covers both Title IX sexual harassment and other sexual misconduct. The report says no complaint is automatically assigned a type of proceeding: depending on the case, the OIEC may use a formal grievance process, an adaptable (informal) resolution if both parties agree, a policy compliance process that involves no determination of whether the policy was violated, or a referral to an employee's disciplinary authority. A formal grievance requires a signed formal complaint from the complainant or the Title IX Coordinator. If a complainant does not want a formal process, the Title IX Coordinator weighs that request against listed safety factors before deciding whether to file one.",
      },
      citations: [
        asr(
          "PDF p. 64",
          "CU Boulder’s adjudication processes are administered through the OIEC and provide prompt, fair and impartial proceedings from the initial investigation to the final result.",
        ),
        aps(
          "p. 1",
          "including conduct prohibited by Title IX and other sexual misconduct.",
          "Scope of APS 5014: \"Prohibits all forms of Sexual Misconduct\" (footnote 1 omitted)",
        ),
        asr(
          "PDF p. 67",
          "No complaint is automatically addressed using a certain type of proceeding, but rather the totality of the circumstances is reviewed on a case-by-case basis.",
        ),
        asr(
          "PDF p. 65",
          "This type of approach allows CU Boulder the option to tailor responses to the unique facts and circumstances of an incident, particularly in cases where there is not a broader threat to individual or campus safety.",
          "Policy compliance process",
        ),
        asr(
          "PDF p. 66",
          "The OIEC may facilitate an adaptable resolution process when appropriate and when both parties voluntarily consent to participate.",
          "Adaptable resolution",
        ),
        asr(
          "PDF p. 68",
          "the Vice Chancellor for the OIEC and Title IX Coordinator or designee will weigh that request against CU Boulder’s obligation to provide a safe, non-discriminatory environment for all students, faculty, and staff.",
          "Requests not to proceed",
        ),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "disciplinary_procedures",
        findingKind: "documented",
        summary:
          "According to the 2026 Annual Security Report, in a formal grievance under the Sexual Misconduct Policy OIEC investigators gather evidence, the parties may review it and respond in writing within 14 days, and a live hearing by videoconference is held at which each party's advisor may cross-examine; CU Boulder provides an advisor at no cost to a party who has none. A trained hearing officer, who may not be the investigator, decides responsibility using a preponderance-of-the-evidence standard. Students found responsible are referred to a sanctioning board; listed sanctions range from a warning or written reprimand to suspension, expulsion and transcript notation. Either party may appeal within seven days, and a decision is issued within 21 days of receiving all final documentation. The report states CU Boulder will resolve formal complaints within a reasonably prompt timeframe, which may be extended for good cause with written notice.",
      },
      citations: [
        asr("PDF p. 71", "Parties will then have an opportunity to submit a written response within 14 days."),
        asr(
          "PDF p. 71",
          "If a party does not have an advisor for the live hearing, CU Boulder will provide that party an advisor for purposes of cross-examination without fee or cost to the party.",
        ),
        asr(
          "PDF p. 71",
          "Following the hearing, the hearing officer(s) will reach a determination regarding responsibility based on a preponderance of the evidence standard (whether it is more likely than not that the sexual misconduct occurred).",
        ),
        asr(
          "PDF p. 75",
          "will be referred to the CU Boulder sanctioning board for sanctions. These sanctions may include one or more of the following:",
          "Sanctions listed include Warning/written reprimand, Suspension, Expulsion and Transcript Notation",
        ),
        asr(
          "PDF p. 72",
          "Appeals must be submitted in writing to the Vice Chancellor for the OIEC and Title IX Coordinator or designee within seven (7) days after the determination regarding responsibility is issued.",
        ),
        asr(
          "PDF p. 72",
          "concurrently provide the parties with a written notice of appeal decision within 21 days of its receipt of all final documentation.",
        ),
        asr(
          "PDF p. 73",
          "CU Boulder will provide an equitable resolution of any formal complaints of sexual misconduct or a hate crime within a reasonably prompt timeframe, except that such timeframe may be extended for good cause with prior written notice to the complainant and respondent of the delay and reason for the delay.",
        ),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "law_enforcement_referrals",
        findingKind: "documented",
        summary:
          "According to the 2026 Annual Security Report, victims may report to the CU Boulder Police Department, or to the Boulder Police Department for incidents elsewhere in the city, and may decline to notify any authority. CU Boulder strongly encourages reporting criminal activity to law enforcement, and the confidential Office of Victim Assistance can help a victim notify police if they choose to. Reports of sexual assault, dating and domestic violence or stalking within the CU Boulder Police Department's primary jurisdiction are referred to the OIEC whether or not the victim pursues criminal charges. The report states the OIEC process is independent of police and court processes and will not be postponed while criminal or civil proceedings are pending unless there are extenuating circumstances.",
      },
      citations: [
        asr(
          "PDF p. 59",
          "Reports of criminal activity that occurred on the CU Boulder campus may be made directly to CUPD at 303-492-6666. Reports of criminal activity that occurred elsewhere in the city of Boulder can be made directly to the city of Boulder Police Department at 303-441-3333.",
        ),
        asr("PDF p. 59", "Victims can also decline to notify any or all of these authorities at any time."),
        asr("PDF p. 59", "CU Boulder strongly encourages all members of its community to report any criminal activity to law enforcement."),
        asr(
          "PDF p. 59",
          "Reports of sexual assault, domestic violence, dating violence, or stalking within the primary reporting jurisdiction of the CU Boulder Police Department will be referred to the OIEC for response regardless of whether the victim chooses to pursue criminal charges.",
        ),
        asr(
          "PDF p. 73",
          "The OIEC will not postpone or delay the formal grievance process while criminal or civil proceedings are pending, including for the availability of law enforcement or court records, unless there are extenuating circumstances, as determined by the OIEC.",
        ),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "prevention_programs",
        findingKind: "documented",
        summary:
          "According to the 2026 Annual Security Report, all new students, returning second-year undergraduates and new employees must complete online training from the OIEC on sexual misconduct, consent, reporting and bystander intervention; students must pass the course quiz with at least 90 percent, and employees must complete the training within 30 days of hire and at least every three years. The OIEC also runs bystander intervention workshops, sessions on sexual consent and sexual assault, and a consent awareness campaign called \"Just Because\", and the Office of Victim Assistance offers presentations, including on supporting survivors. The report says the OIEC administered the Sexual Assault and Related Harms Survey to all students in fall 2024.",
      },
      citations: [
        asr(
          "PDF p. 51",
          "CU Boulder requires that all new students and employees and returning second year undergraduate students complete the following required online education:",
        ),
        asr(
          "PDF p. 52",
          "All new (first-year and transfer) and second year returning undergraduate and graduate students are required to complete the Community Accountability course in Canvas and pass the quiz with a minimum score of 90 percent.",
        ),
        asr(
          "PDF p. 52",
          "CU Boulder requires all employees to complete the Nondiscrimination, Sexual Misconduct, and Reporting training within the first 30 days of employment.",
        ),
        asr("PDF pp. 54–55", "The OIEC also conducts an awareness campaign called “Just Because” that focuses on consent and combatting harmful social messages that undermine consent."),
        asr(
          "PDF p. 54",
          "In fall 2024, the OIEC administered the Sexual Assault and Related Harms Survey for all students, undergraduate and graduate,",
        ),
        asr("PDF p. 52", "OVA offers presentations on all its topic areas and how to support people who may be impacted by traumatic/disruptive life events."),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "reporting_procedures",
        findingKind: "documented",
        summary:
          "According to the 2026 Annual Security Report, reports to the OIEC can be made by phone, email, online through the OIEC website or through CU EthicsLine; the report states the OIEC reporting process is not confidential. Complainants can receive supportive measures whether or not they pursue a resolution process, and there is no time limit for filing a formal complaint or reporting to the OIEC. Concerns can also be reported anonymously through the OIEC online form, though the report notes limited action can be taken on anonymous reports, and the Office of Victim Assistance offers a confidential sharing page that is not a report to the university or police. Responsible employees and Campus Security Authorities must report to the OIEC or the CU Boulder Police Department. APS 5014 states the university will not discipline students who report in good faith or take part in an investigation for personal alcohol or drug use under the Student Code of Conduct.",
      },
      citations: [
        asr(
          "PDF p. 58",
          "the incident should be reported to the OIEC by phone at 303-492-2127, by email at OIEC@Colorado.EDU or online.",
        ),
        asr("PDF p. 58", "A report can also be filed using the CU EthicsLine webpage. The OIEC reporting process is not confidential."),
        asr("PDF p. 58", "Complainants can receive supportive measures regardless of whether they elect to pursue a resolution process through the OIEC."),
        asr("PDF p. 70", "There is no time limit for filing a formal complaint or reporting allegations to the OIEC."),
        asr(
          "PDF p. 18",
          "Individuals can also anonymously report a concern impacting them using the OIEC online reporting form. It should be noted that limited action can be taken based on anonymous reports, however.",
        ),
        asr(
          "PDF pp. 17–18",
          "This option allows people to provide information about harmful and/or traumatic events in a confidential manner that does not constitute a report to CU Boulder or CUPD or other law enforcement agencies.",
          "OVA confidential sharing page",
        ),
        asr("PDF p. 59", "Responsible employees and Campus Security Authorities are required to report to OIEC or CUPD."),
        aps(
          "p. 8",
          "the university will not pursue disciplinary action against an individual who makes a good faith report to the university or who participates in the investigation of an alleged incident of Sexual Misconduct, whether as a complainant, respondent, or witness, for a violation of the campus Student Code of Conduct’s prohibitions upon the personal consumption of alcohol or other drugs.",
          "Amnesty for alcohol and drug use",
        ),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "outcome_information",
        findingKind: "documented",
        summary:
          "According to the OIEC's Student Respondent Statistical Report for fiscal year 2025-2026 (July 1, 2025 to June 30, 2026), there were 221 cases under the Sexual Misconduct, Intimate Partner Violence, and Stalking Policy involving complaints against 234 student respondents (the report's Table 3 totals 236). Allegations against 27 respondents were addressed through the formal grievance process; in allegations against 96 respondents the complainant did not respond to the OIEC's outreach, and in allegations against 29 the complainant declined a resolution or asked that concerns only be documented. The most reported allegations were hostile environment sexual harassment (83) and sexual assault (rape) (63). Of the formal grievances, 23 were still in progress when the report was issued; 1 respondent was found not to have violated the policy and 2 were found responsible, with sanctions including suspension (2), exclusion from campus areas (2), behavioral assessment (2) and a no-contact order (1). One appeal was brought, and the decision and sanctions were upheld.",
      },
      citations: [
        oiec(
          "p. 5 (PDF p. 6)",
          "The 221 cases involving complaints against 234 student respondents under the Sexual Misconduct, Intimate Partner Violence, and Stalking Policy were addressed as follows (see Table 3):",
        ),
        oiec(
          "p. 5 (PDF p. 6)",
          "Allegations of sexual misconduct against 27 respondents were addressed through the formal grievance process.",
          "Printed \"27\" followed by superscript footnote 7 (embedded text reads \"277\"); Table 3 lists 27 and totals 236",
        ),
        oiec("p. 5 (PDF p. 6)", "In allegations against 96 respondents, the complainant did not respond to the OIEC’s outreach."),
        oiec(
          "p. 6 (PDF p. 7)",
          "the most reported allegations included hostile environment sexual harassment (83), followed by sexual assault (rape) (63), stalking (46), dating or domestic violence (30), and sexual assault (fondling) (26)",
        ),
        oiec(
          "p. 7 (PDF p. 8)",
          "23 cases continue to be in progress at the time of this report.",
          "Table 5: Pending 23; No policy violation 1; Found responsible 2; Suspension 2; Exclusion 2; Behavioral assessment 2; No-Contact Order 1; Expulsion 0",
        ),
        oiec(
          "p. 7 (PDF p. 8)",
          "There was one post-decision appeal brought by a respondent. In that case, the policy violation decision and sanctions were upheld in their entirety.",
        ),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "transparency_practices",
        findingKind: "documented",
        summary:
          "The OIEC publishes statistical reports each year on how it handled and resolved reported incidents, including the number of cases, types of allegations, informal resolutions, formal adjudications, sanctions and appeals, and the supportive and safety measures provided; reports for fiscal years 2021-22 through 2025-26 are listed on its website. APS 5014 requires each campus Title IX Coordinator to give an annual report to the university president and the campus chancellor documenting reports, policy violations found, appeals and examples of sanctions. The 2026 Annual Security Report states CU Boulder completes publicly available recordkeeping, including Clery Act reporting, without personally identifying information about victims.",
      },
      citations: [
        {
          source: "oiecReportsPage",
          pinpoint: "page text",
          excerpt:
            "Each year, OIEC produces statistical reports on how our office handled and resolved reported incidents and what safety and support measures were provided to mitigate the impact of incidents.",
        },
        aps(
          "p. 9",
          "Providing an annual report to the president and the appropriate campus chancellor documenting:",
          "Required contents: number of reports or formal complaints, categories of parties, policy violations found, appeals and outcomes, examples of sanctions",
        ),
        asr(
          "PDF p. 60",
          "CU Boulder will complete publicly available recordkeeping, including Clery Act reporting and disclosures, without the inclusion of personally identifying information about the victim.",
        ),
      ],
    },

    // -----------------------------------------------------------------------------------------------------------
    // Policies
    // -----------------------------------------------------------------------------------------------------------
    {
      key: "policy",
      input: {
        policyType: "sexual_misconduct",
        title: "Sexual Misconduct, Intimate Partner Violence, and Stalking (APS 5014)",
        summary:
          "University of Colorado system policy that applies to all campuses, including CU Boulder. It prohibits all forms of sexual misconduct, including conduct prohibited by Title IX and other sexual misconduct, and related misconduct such as retaliation, failure to report, and providing false or misleading information. It requires affirmative consent, requires responsible employees to report sexual misconduct to the Title IX Coordinator, and includes an amnesty provision for personal alcohol or drug use by those who report in good faith. Effective September 2, 2021 (superseding the August 14, 2020 version); last reviewed and updated October 1, 2026, with technical changes. At CU Boulder it is administered by the Office of Institutional Equity and Compliance.",
        effectiveDate: "2021-09-02",
      },
      citations: [
        aps(
          "p. 1",
          "This policy also defines and prohibits related misconduct, including retaliation, failure to report, providing false or misleading information, and failing to abide with the orders or sanctions of the Title IX Coordinator or other authorized officials.",
          "Scope",
        ),
        aps("p. 1", "September 2, 2021", "Effective date (\"Effective:\")"),
        aps("p. 1", "October 1, 2026 (Technical Changes Made)", "Last Reviewed/Updated"),
        aps("p. 1", "All campuses.", "Applies to"),
        aps(
          "p. 7",
          "are responsible employees, who must promptly report Sexual Misconduct to the Title IX Coordinator or designee.",
          "Responsible employees",
        ),
        asr("PDF p. 47", "APS 5014 requires “affirmative consent” with regard to sexual activity.", "Affirmative consent"),
      ],
    },

    // -----------------------------------------------------------------------------------------------------------
    // Resources: reporting channels
    // -----------------------------------------------------------------------------------------------------------
    {
      key: "student_resource",
      input: {
        category: "title_ix",
        confidentiality: "institutional_reporting",
        name: "Office of Institutional Equity and Compliance (OIEC) & Title IX Coordinator",
        description:
          "Administrative Research Center, 3100 Marine St., Second Floor. Email OIEC@Colorado.EDU. Reports can also be made online (\"Report to OIEC\" on the OIEC website). The ASR states the OIEC reporting process is not confidential.",
        phone: "(303)-492-2127",
        url: "https://www.colorado.edu/oiec/",
        hours: null,
        available247: null,
        sortOrder: 0,
      },
      citations: [
        asr(
          "PDF p. 62",
          "Office of Institutional Equity and Compliance & Title IX Coordinator Colorado.EDU/OIEC/ Administrative Research Center, 3100 Marine St., Second Floor (303)-492-2127",
          "Contact details",
        ),
        asr("PDF p. 58", "The OIEC reporting process is not confidential.", "Not confidential"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "campus_police",
        confidentiality: "institutional_reporting",
        name: "University of Colorado Boulder Police Department (CUPD)",
        description:
          "1050 Regent Drive. In an emergency, dial 911. The ASR describes (303) 492-6666 as the non-emergency line of the DPS Communications Center, reachable 24/7.",
        phone: "(303)-492-6666",
        url: "https://www.colorado.edu/police/",
        hours: "24/7 (DPS Communications Center)",
        available247: true,
        sortOrder: 0,
      },
      citations: [
        asr("PDF p. 62", "University of Colorado Boulder Police Department Colorado.EDU/Police/ 1050 Regent Drive (303)-492-6666", "Contact details"),
        asr(
          "PDF p. 8",
          "The DPS Communications Center and emergency dispatchers are reachable 24/7 by calling the non-emergency line at (303) 492-6666 or by dialing 911 if you are facing an emergency.",
          "24/7 availability",
        ),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "local_law_enforcement",
        confidentiality: "institutional_reporting",
        name: "Boulder Police Department",
        description: "1805 33rd Street, Boulder. For criminal activity elsewhere in the city of Boulder.",
        phone: "(303)-441-3333",
        url: "https://bouldercolorado.gov/government/departments/police",
        hours: null,
        available247: null,
        sortOrder: 0,
      },
      citations: [asr("PDF p. 63", "Boulder Police Department BoulderColorado.GOV/Government/Departments/Police 1805 33rd Street, Boulder (303)-441-3333", "Contact details")],
    },
    {
      key: "student_resource",
      input: {
        category: "local_law_enforcement",
        confidentiality: "institutional_reporting",
        name: "Boulder County Sheriff’s Office",
        description: "5600 Flatiron Parkway, Boulder.",
        phone: "(303)-441-4444",
        url: "https://www.bouldercounty.org/safety/sheriff/",
        hours: null,
        available247: null,
        sortOrder: 1,
      },
      citations: [asr("PDF p. 63", "Boulder County Sheriff’s Office BoulderCounty.ORG/Safety/Sheriff/ 5600 Flatiron Parkway, Boulder (303)-441-4444", "Contact details")],
    },
    {
      key: "student_resource",
      input: {
        category: "local_law_enforcement",
        confidentiality: "institutional_reporting",
        name: "Boulder County District Attorney’s Office",
        description: "1777 6th Street, Boulder.",
        phone: "(303)-441-3700",
        url: "https://www.bouldercounty.org/district-attorney/",
        hours: null,
        available247: null,
        sortOrder: 2,
      },
      citations: [asr("PDF p. 64", "Boulder County District Attorney’s Office BoulderCounty.ORG/District-Attorney/ 1777 6th Street, Boulder (303)-441-3700", "Contact details")],
    },

    // -----------------------------------------------------------------------------------------------------------
    // Resources: on campus, labelled "Confidential Service" (ASR PDF p. 62)
    // -----------------------------------------------------------------------------------------------------------
    {
      key: "student_resource",
      input: {
        category: "victim_advocacy",
        confidentiality: "confidential",
        name: "Office of Victim Assistance (OVA)",
        description:
          "Free, confidential information, support, advocacy and short-term trauma-focused counseling for students, faculty and staff. Center for Community (C4C), Suite N450. Email Assist@Colorado.EDU. Open weekdays, with drop-in hours; for after-hours phone support, call and press \"2\" to speak to a counselor. Can help victims notify police if they choose to.",
        phone: "(303)-492-8855",
        url: "https://www.colorado.edu/ova/",
        hours: "Weekdays; after-hours phone support (press 2)",
        available247: null,
        sortOrder: 0,
      },
      citations: [
        asr(
          "PDF p. 62",
          "Office of Victim Assistance Confidential Service Colorado.EDU/OVA/ Center for Community (C4C), Suite N450 (303)-492-8855 (Has after-hours phone coverage)",
          "Contact details and confidentiality",
        ),
        asr(
          "PDF p. 85",
          "The Office of Victim Assistance (OVA) provides free, confidential response services for students, faculty, and staff who experience traumatic, disturbing or disruptive life events.",
          "Services",
        ),
        asr("PDF p. 86", "For after-hours phone support when OVA is closed, call 303-492-8855 and press “2” to speak to a counselor.", "After-hours support"),
        asr("PDF p. 86", "OVA is open weekdays and has telehealth and in-person services, including drop-in hours for people without appointments.", "Hours"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "counseling",
        confidentiality: "confidential",
        name: "Counseling and Psychiatric Services (CAPS)",
        description:
          "Confidential mental health services for CU Boulder students, including individual counseling, crisis care and psychiatry. Center for Community (C4C), Suite N352. In-person and telehealth services Monday through Friday; after hours, call and press \"2\" to speak to a mental health professional.",
        phone: "(303)-492-CAPS (2277)",
        url: "https://www.colorado.edu/counseling/",
        hours: "Monday–Friday; after-hours phone support (press 2)",
        available247: null,
        sortOrder: 0,
      },
      citations: [
        asr(
          "PDF p. 62",
          "Counseling and Psychiatric Services Confidential Service Colorado.EDU/Counseling/ Center for Community (C4C), Suite N352 (303)-492-CAPS (2277) (Has after-hours phone coverage)",
          "Contact details and confidentiality",
        ),
        asr("PDF p. 85", "In-person and telehealth services are available Monday through Friday.", "Hours"),
        asr("PDF p. 85", "please call 303-492-CAPS (2277) and press “2” to speak to a mental health professional after-hours.", "After-hours support"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "counseling",
        confidentiality: "confidential",
        name: "Psychological Health & Performance (Athletics)",
        description:
          "Counseling in the Athletic Department. Dal Ward, Suite 130. After-hours phone coverage: call and press 9.",
        phone: "(303)-735-7182",
        url: "https://cubuffs.com/sports/php",
        hours: "After-hours phone coverage (press 9)",
        available247: null,
        sortOrder: 1,
      },
      citations: [
        asr(
          "PDF p. 62",
          "Psychological Health & Performance Confidential Service CUBuffs.COM/Sports/Php Dal Ward, Suite 130 (303)-735-7182 (Has after-hours phone coverage Call and Press 9)",
          "Contact details and confidentiality",
        ),
        asr("PDF p. 19", "Psychological Health and Performance in the Athletic Department.", "Part of the Athletic Department"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "confidential",
        confidentiality: "confidential",
        name: "Ombuds Office",
        description: "Center for Community (C4C), S484.",
        phone: "(303)-492-5077",
        url: "https://www.colorado.edu/ombuds/",
        hours: null,
        available247: null,
        sortOrder: 0,
      },
      citations: [asr("PDF p. 62", "Ombuds Office Confidential Service Colorado.EDU/Ombuds/ Center for Community (C4C), S484 (303)-492-5077", "Contact details and confidentiality")],
    },
    {
      key: "student_resource",
      input: {
        category: "confidential",
        confidentiality: "confidential",
        name: "CU Student Legal Services",
        description: "University Memorial Center (UMC) Room 311. The ASR says it may be able to provide legal resources, including on protection orders.",
        phone: "(303)-492-6813",
        url: "https://www.colorado.edu/studentlegal/",
        hours: null,
        available247: null,
        sortOrder: 1,
      },
      citations: [
        asr(
          "PDF p. 62",
          "CU Student Legal Services Confidential Service Colorado.EDU/StudentLegal/ University Memorial Center (UMC) Room 311 (303)-492-6813",
          "Contact details and confidentiality",
        ),
        asr("PDF p. 60", "CU Student Legal Services may also be able to provide legal resources.", "Legal resources"),
      ],
    },

    // -----------------------------------------------------------------------------------------------------------
    // Resources: off campus, Boulder County (ASR PDF pp. 63–64)
    // -----------------------------------------------------------------------------------------------------------
    {
      key: "student_resource",
      input: {
        category: "victim_advocacy",
        confidentiality: "confidential",
        name: "Safehouse Progressive Alliance for Nonviolence (SPAN)",
        description: "835 North Street, Boulder. Listed in the ASR as a confidential service.",
        phone: "(303)-444-2424",
        url: "https://www.safehousealliance.org/",
        hours: "24/7 hotline",
        available247: true,
        sortOrder: 1,
      },
      citations: [
        asr(
          "PDF p. 63",
          "Safehouse Progressive Alliance for Nonviolence (SPAN) Confidential Services SafeHouseAlliance.ORG 835 North Street, Boulder (303)-444-2424 (24/7 hotline)",
          "Contact details and confidentiality",
        ),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "victim_advocacy",
        confidentiality: "confidential",
        name: "MESA (Moving to End Sexual Assault)",
        description: "1455 Dixon Avenue, Lafayette. Listed in the ASR as a confidential service.",
        phone: "(303)-443-7300",
        url: "https://movingtoendsexualassault.org/",
        hours: "24/7 hotline",
        available247: true,
        sortOrder: 2,
      },
      citations: [
        asr(
          "PDF p. 63",
          "MESA (Moving to End Sexual Assault) Confidential Services MovingToEndSexualAssault.ORG 1455 Dixon Avenue, Lafayette (303)-443-7300 (24/7 hotline)",
          "Contact details and confidentiality",
        ),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "counseling",
        confidentiality: "confidential",
        name: "Mental Health Walk-In Crisis & Addiction Services Center for Boulder County",
        description: "1107 W Century Drive, Louisville, CO 80027. Alternatively call or text 988. Listed in the ASR as a confidential service.",
        phone: "(303)-447-1665",
        url: "https://mhpcolorado.org/locations/crisis-center",
        hours: "24/7 crisis hotline",
        available247: true,
        sortOrder: 2,
      },
      citations: [
        asr(
          "PDF p. 63",
          "Mental Health Walk-In Crisis & Addiction Services Center for Boulder County Confidential Services MHPColorado.ORG/Locations/Crisis-Center",
          "Name and confidentiality",
        ),
        asr("PDF p. 63", "1107 W Century Drive, Louisville, CO 80027 (303)-447-1665 (24/7 crisis hotline) or Call/text 988", "Address, phone and availability"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "medical",
        confidentiality: "unknown",
        name: "Boulder Community Health",
        description:
          "4747 Arapahoe Avenue, Boulder. One of two hospitals where the ASR says medical forensic exams are offered (the other is UCHealth Longs Peak Hospital, Longmont); an exam is recommended within 120 hours, and victims do not bear the cost of the forensic exam.",
        phone: "(720)-854-7000",
        url: "https://www.bch.org/",
        hours: null,
        available247: null,
        sortOrder: 0,
      },
      citations: [
        asr("PDF p. 63", "Boulder Community Health BCH.ORG 4747 Arapahoe Avenue, Boulder (720)-854-7000", "Contact details"),
        asr(
          "PDF p. 57",
          "Medical forensic exams (MFE) are offered at either Boulder Community Health (4747 Arapahoe Ave. Boulder, CO 80303) or UCHealth Longs Peak Hospital (1750 E. Ken Pratt Blvd. Longmont, CO 80504).",
          "Forensic exams",
        ),
        asr("PDF p. 57", "A victim of a sexual assault shall not bear the cost of a forensic medical examination;", "Cost"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "victim_advocacy",
        confidentiality: "unknown",
        name: "Boulder County Sheriff’s Victim Advocates",
        description: "5600 Flatiron Pkwy, Boulder.",
        phone: "(303)-441-3656",
        url: "https://www.bouldercounty.org/safety/victim/victim-assistance/",
        hours: null,
        available247: null,
        sortOrder: 3,
      },
      citations: [
        asr("PDF p. 64", "Boulder County Sheriff’s Victim Advocates BoulderCounty.ORG/Safety/Victim/Victim-Assistance/ 5600 Flatiron Pkwy, Boulder (303)-441-3656", "Contact details"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "victim_advocacy",
        confidentiality: "unknown",
        name: "Boulder Police Department Victim Advocates",
        description: "1805 33rd St, Boulder.",
        phone: "(303)-441-4048",
        url: "https://bouldercolorado.gov/services/victim-services",
        hours: null,
        available247: null,
        sortOrder: 4,
      },
      citations: [
        asr("PDF p. 64", "Boulder Police Department Victim Advocates BoulderColorado.GOV/Services/Victim-Services 1805 33rd St, Boulder (303)-441-4048", "Contact details"),
      ],
    },
  ],
};
