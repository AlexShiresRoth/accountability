// Penn State University (University Park): institutional record.
//
// Transcribed 2026-10-05 by Claude from official Penn State sources (see `sources`):
// - the 2026 University Park Annual Security Report, "Policies, Safety, & U" (pp. 8–40, 43, 62–63, 83; same
//   document as research/penn-state-university.ts);
// - Penn State Policy AD85, Title IX Sexual Harassment (policy.psu.edu), read 2026-10-05;
// - Office of Ethics and Compliance pages: Title IX, Confidential Resources, Sexual Misconduct Climate Survey,
//   Reporting Data, and the Q4 2025 Compliance Reporting Data PDF;
// - Student Affairs pages: Victim-Survivor Support (R-VOICE) and Mental Health Services (CAPS).
// Status after import: pending_review. A human must check each record against the cited page before verifying.
//
// Retrieval: every source downloaded directly with curl on 2026-10-05 (Penn State's policy, Ethics and Student
// Affairs sites returned HTTP 200; only the police.psu.edu HTML listing returns 403). Wayback snapshots were
// requested on 2026-10-05 where none existed and each archivedUrl was confirmed to resolve; the AD85 request
// resolved to an existing capture of 2026-09-29, which contains the same "Most Recent Changes" entry
// (September 10, 2026) as the live page. The Reporting Data page's only capture (2026-09-20) is used; a new
// capture request failed (HTTP 520).
//
// Pages: "p. N" is the page number printed in the ASR footer, which equals the PDF page. Every ASR excerpt was
// checked by script against the PDF's text (PyMuPDF), ignoring line breaks; web excerpts were checked against the
// pages' text. Runs of spaces from the PDF's justified text are collapsed to one, and hyphenated words split across
// lines are joined ("cross-examination", p. 28; "non-business", p. 17). The Q4 2025 dashboard label contains a
// zero-width space in the PDF text, which is dropped. Phone numbers on the two-column resource tables (ASR pp. 10, 62, 63) were also checked against
// rendered page images. Summaries are attributed to their source; they describe what Penn State says its process
// is, not an evaluation of how it works in practice.
//
// Confidentiality: marked "confidential" only where a source says so: R-VOICE, CAPS and University Health
// Services (ASR pp. 15, 19, 39; Confidential Resources page), the Center for Sexual and Gender Diversity
// (Confidential Resources page) and Centre Safe (Victim-Survivor page: "confidential counselor advocates").
//
// Discrepancies between sources, recorded rather than resolved:
// - Office of Student Accountability & Conflict Response phone: the ASR's Campus Security Authority table (p. 10)
//   prints 814-867-5088 (the Title IX Coordinator's number), while pp. 18 and 62 print 814-863-0342. That office
//   is not entered as a resource; it is named in the disciplinary-procedures summary only.
// - R-VOICE room: ASR p. 62 and the Student Affairs page give "222U Boucke Building"; the Ethics and Compliance
//   Confidential Resources page gives "22U Boucke Building". The resource record uses 222U (two sources).
// - AD85 dates: the policy page's metadata shows "Effective Date Mon, 09/09/2024", while its revision history
//   lists later changes (September 15, 2025; June 2, 2026; and "Most Recent Changes: September 10, 2026").
//   effectiveDate is left blank; the history is described in the policy summary.
// - Appeal officer for faculty: ASR p. 30 says "the Senior Vice Provost"; the current AD85 page says "the Vice
//   Provost for Faculty Affairs". Not used in any record.
//
// Not entered, and why:
// - Timeline entries (institution actions): none of these sources gives a dated institutional action within
//   scope. AD85's 2026 revisions are described on the policy record.
// - The ASR's "Pennsylvania Coalition Against Domestic Violence – 24-hour hotline (1-800-799-7233) - PCADV"
//   (p. 20): the number printed is that of a national hotline, not one PCADV is shown to operate in these sources;
//   left out until a source settles it.
// - Victim Resource Officer (ASR p. 15): no contact details given.
// - Centre County CAN HELP Line / Center for Community Resources mobile crisis line (ASR p. 83: "800-643-5432";
//   p. 63: "1-800-643-5432 (24 hour mobile crisis line)"): a general crisis line, not a sexual-violence service.
// - Penn State Hotline (1-888-778-8173, text), Office of Equal Opportunity and Access, Human Resources,
//   Residence Life, SupportLinc (employees), Disability Services and community drug and alcohol services: not
//   student sexual-violence resources, or employee-only; OEOA is named in the Title IX summary.
// - Outcome figures: the Ethics and Compliance quarterly dashboards chart report counts and outcomes, but in the
//   Q4 2025 and Q1 2026 dashboards reviewed the outcome totals combine several offices (OEOA, Educational
//   Equity/Report Bias, OSMRR, OSACR) and are not broken out for sexual misconduct, and the per-category counts
//   are bar-chart labels whose association with categories cannot be read with certainty from the PDF text. No
//   figures are entered from them. The 2022 climate survey results were not read.
// - Policy AD91 (Non-Discrimination Policy) is entered from the ASR's description only; its full text was not
//   reviewed.

import type { ResearchBundle } from "@/lib/admin/research-bundle";

const asr = (pinpoint: string, excerpt: string, claim?: string) => ({ source: "asr2026", pinpoint, excerpt, claim });
const ad85 = (pinpoint: string, excerpt: string, claim?: string) => ({ source: "ad85", pinpoint, excerpt, claim });

export const pennStateInstitutional: ResearchBundle = {
  college: { slug: "penn-state-university" },
  sources: {
    // Same document as research/penn-state-university.ts; the importer reuses the existing source by URL.
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
    },
    ad85: {
      type: "university",
      publisher: "The Pennsylvania State University",
      title: "AD85 Title IX Sexual Harassment",
      url: "https://policy.psu.edu/policies/ad85",
      archivedUrl: "https://web.archive.org/web/20260929152246/https://policy.psu.edu/policies/ad85",
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes:
        "University policy page. Sections cited by heading (e.g. \"V. Amnesty for Students\"). Revision history at the foot of the page; most recent change listed: September 10, 2026.",
      internalNotes:
        "Read from the live page with curl on 2026-10-05 (HTTP 200). A Save Page Now request on 2026-10-05 resolved to the existing capture of 2026-09-29, which includes the same September 10, 2026 change entry.",
    },
    titleIxPage: {
      type: "university",
      publisher: "Penn State Office of Ethics and Compliance",
      title: "Title IX: Sexual Harassment and Sexual Misconduct",
      url: "https://universityethics.psu.edu/our-expertise/title-ix",
      archivedUrl: "https://web.archive.org/web/20261005154000/https://universityethics.psu.edu/our-expertise/title-ix",
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes: "Title IX landing page describing which offices handle reports involving students and employees.",
      internalNotes: "Read from the live page with curl on 2026-10-05; Wayback capture created the same day.",
    },
    confidentialResources: {
      type: "university",
      publisher: "Penn State Office of Ethics and Compliance",
      title: "Confidential Resources",
      url: "https://universityethics.psu.edu/our-expertise/title-ix/t9-resources/confidential",
      archivedUrl:
        "https://web.archive.org/web/20261005153402/https://universityethics.psu.edu/our-expertise/title-ix/t9-resources/confidential",
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes: "Lists Penn State's designated confidential resources (linked from AD85 section IX.d).",
      internalNotes: "Read from the live page with curl on 2026-10-05; Wayback capture created the same day.",
    },
    victimSurvivor: {
      type: "university",
      publisher: "Penn State Student Affairs",
      title: "Victim-Survivor Support",
      url: "https://studentaffairs.psu.edu/support-safety/victim-survivor",
      archivedUrl: "https://web.archive.org/web/20261005153300/https://studentaffairs.psu.edu/support-safety/victim-survivor",
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes: "Student Affairs page for the R-VOICE Center: immediate steps, evidence collection, medical care and contacts.",
      internalNotes: "Linked as \"R-VOICE\" from the 2026 ASR p. 19. Read from the live page with curl on 2026-10-05; Wayback capture created the same day.",
    },
    capsPage: {
      type: "university",
      publisher: "Penn State Student Affairs",
      title: "Mental Health Services (Counseling and Psychological Services)",
      url: "https://studentaffairs.psu.edu/health-wellbeing/mental-health-services",
      archivedUrl:
        "https://web.archive.org/web/20261005153555/https://studentaffairs.psu.edu/health-wellbeing/mental-health-services",
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes: "CAPS page with contact numbers and the 24/7 Penn State Crisis Line.",
      internalNotes:
        "The 2026 ASR p. 19 links \"CAPS\" to http://studentaffairs.psu.edu/counseling, which redirects to this URL. Read with curl on 2026-10-05; Wayback capture created the same day.",
    },
    climateSurvey: {
      type: "university",
      publisher: "Penn State Office of Ethics and Compliance",
      title: "Sexual Misconduct Climate Survey",
      url: "https://universityethics.psu.edu/our-expertise/title-ix/sexual-misconduct-climate-survey",
      archivedUrl:
        "https://web.archive.org/web/20261005153424/https://universityethics.psu.edu/our-expertise/title-ix/sexual-misconduct-climate-survey",
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes: "Survey description, 2025 update, and links to 2015, 2018 and 2022 results by campus.",
      internalNotes: "Read from the live page with curl on 2026-10-05; Wayback capture created the same day. The results PDFs were not read.",
    },
    reportingData: {
      type: "university",
      publisher: "Penn State Office of Ethics and Compliance",
      title: "Reporting Data",
      url: "https://universityethics.psu.edu/our-expertise/reporting-data",
      archivedUrl: "https://web.archive.org/web/20260920183253/https://universityethics.psu.edu/our-expertise/reporting-data",
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes: "Links quarterly Compliance Reporting Data (2024 Q1 to 2026 Q1), the 2025 Hotline Summary and the Campus Hazing Transparency Report.",
      internalNotes:
        "Read from the live page with curl on 2026-10-05. A Save Page Now request failed (HTTP 520); the capture of 2026-09-20 in archivedUrl lists the same Q4 2025 report.",
    },
    complianceQ4_2025: {
      type: "university",
      publisher: "Penn State Office of Ethics and Compliance",
      title: "Compliance Reporting at Penn State, October–December 2025 (Q4)",
      url: "https://universityethics.psu.edu/assets/uploads/documents/Q4-2025-Compliance-Reporting-Data.pdf",
      archivedUrl:
        "https://web.archive.org/web/20261005154115/https://universityethics.psu.edu/assets/uploads/documents/Q4-2025-Compliance-Reporting-Data.pdf",
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes: "Three-page dashboard: issues reported (p. 1), outcomes (p. 2), reports by region (p. 3).",
      internalNotes:
        "Linked as \"Q4 2025 Compliance Reporting Data\" from the Reporting Data page. Downloaded with curl on 2026-10-05 (Last-Modified: Wed, 06 May 2026 16:39:35 GMT); Wayback capture created the same day is byte-identical. SHA-256: 2f2a71532c9d4ea115752da2355dd844113eae32c98295402b4b7cb7cda17729. 3 pages. Publication date not stated (PDF metadata: created 2026-05-06).",
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
          "According to the 2026 Annual Security Report, Penn State addresses sexual harassment, sexual assault, dating violence, domestic violence and stalking under its Title IX Sexual Harassment Policy, AD85, and all student sexual misconduct proceeds under AD85 even where it falls outside Title IX's jurisdiction. Penn State's Office of Ethics and Compliance says the Office of Sexual Misconduct Reporting and Response (OSMRR) handles reports involving students, and the Office of Equal Opportunity and Access handles reports involving employees. The report states that the University seeks to complete the investigation and related processes typically within 120 days, a timeline it describes as not binding.",
      },
      citations: [
        asr("p. 14", "The University has implemented the Title IX Sexual Harassment Policy, AD85, to address complaints of sexual harassment as defined under the 2020 Title IX regulations."),
        asr("p. 30", "All student sexual misconduct will proceed under AD85 even if they do not meet the jurisdictional criteria of Title IX."),
        {
          source: "titleIxPage",
          pinpoint: "Partnership",
          excerpt:
            "Penn State’s Office of Sexual Misconduct Reporting and Response (OSMRR) addresses Title IX reports involving students, as well as other reports of student sexual misconduct otherwise prohibited by University policy.",
        },
        asr(
          "p. 24",
          "The University will seek to complete the investigation and any additional necessary processes within a prompt and reasonable amount of time, typically not to exceed 120 days. This timeline is not binding and creates no rights for the parties.",
        ),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "disciplinary_procedures",
        findingKind: "documented",
        summary:
          "According to the 2026 Annual Security Report and Policy AD85, formal complaints that are not dismissed or resolved informally go to a live hearing before a three-person Title IX Hearing Panel of trained hearing officers (students may not serve), which decides responsibility by a preponderance of the evidence. Each party may have an advisor, and the University provides one to conduct cross-examination if a party's advisor does not appear. For student respondents found responsible, the Senior Director of the Office of Student Accountability & Conflict Response assigns sanctions, which may include formal warning, conduct probation, suspension or expulsion; expulsion carries a permanent negative transcript notation. Both parties may appeal within five business days.",
      },
      citations: [
        asr("p. 27", "Render a decision using a preponderance of the evidence standard"),
        ad85(
          "IX. Title IX Terms and Definitions, j. Hearing Panel",
          "The mixed-gender, three (3)-person panel who are members of the University’s Title IX Hearing Board (i.e., trained Title IX hearing officers) charged with adjudicating alleged violations of this Policy.",
        ),
        ad85("IX. Title IX Terms and Definitions, j. Hearing Panel", "Students are not permitted to serve on Title IX Hearing Panels."),
        asr(
          "p. 28",
          "If a party’s Advisor does not appear at the time of the hearing, the University will provide an Advisor for that party without fee or charge, to conduct cross-examination on behalf of that party.",
        ),
        asr(
          "p. 28",
          "Sanctions may include, without limitation, formal warning, conduct probation, suspension or expulsion from the University.",
        ),
        asr("p. 37", "A permanent Negative Transcript Notation is applied."),
        asr(
          "p. 29",
          "Appeals must be submitted in writing to the Title IX Coordinator or their designee within five (5) business days of the date of the Notice of Outcome or Notice of Dismissal.",
        ),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "law_enforcement_referrals",
        findingKind: "documented",
        summary:
          "According to the 2026 Annual Security Report, Penn State encourages reporting to law enforcement but states that it is the victim's choice whether to do so, and that victims have the right to decline involvement with the police. The University will help a victim notify police and make a report if they wish, and filing a police report does not mean the victim must pursue criminal charges. Whether or not a crime is reported to police, a victim may seek University discipline against an offender who is a member of the University community. The report notes that in Pennsylvania evidence may be collected even if a victim chooses not to report to law enforcement.",
      },
      citations: [
        asr(
          "p. 18",
          "Although the University strongly encourages all members of its community to report violations of this policy to law enforcement, it is the victim’s choice whether or not to make such a report, and victims have the right to decline involvement with the police.",
        ),
        asr("p. 18", "The University will assist any victim with notifying local police if they so desire, including assisting a victim with making a police report."),
        asr("p. 19", "Filing a police report does not mean the victim must pursue criminal charges."),
        asr(
          "p. 18",
          "Whether a victim reports the crime to the police, or not, if the alleged offender is a member of the University community, the victim has a right to proceed to seek University discipline against the offender",
        ),
        asr("p. 17", "In Pennsylvania, evidence may be collected even if a victim chooses not to make a report to law enforcement."),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "prevention_programs",
        findingKind: "documented",
        summary:
          "According to the 2026 Annual Security Report, all incoming first-year students must complete the sexual misconduct content of Penn State Safe & Aware, an online module on alcohol and sexual misconduct, and all new employees must complete a \"Title IX for Penn State\" training module. The report states that 8,101 University Park students completed the module in 2025–2026. The R-VOICE Center provides programs on sexual assault, relationship violence and stalking, and bystander intervention training; other listed programs include Welcome Week/New Student Orientation events and Greeks CARE.",
      },
      citations: [
        asr("p. 15", "All incoming first-year students, regardless of age, are required to complete the sexual misconduct content."),
        asr("p. 15", "All new employees are required to complete the “Title IX for Penn State” online training module."),
        asr("p. 43", "2025-2026: 8,101 students from University Park and 3,870 students from Commonwealth Campuses completed the Safe and Aware Module."),
        asr(
          "p. 40",
          "R-VOICE now has specialized trainings on Bystander Intervention, which focuses on interrupting situations related to sexual and relationship violence, acts of bias, and sexual or gender-based harassment.",
        ),
        asr("p. 38", "Welcome Week/New Student Orientation – events with invited speakers to address issues of sexual and gender-based violence."),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "reporting_procedures",
        findingKind: "documented",
        summary:
          "According to the 2026 Annual Security Report, anyone may report sex discrimination, including sexual harassment, to the Title IX Coordinator in person, by mail, by telephone, by email or online, at any time. Notice to the Title IX Coordinator or an official with authority to institute corrective measures triggers the University's response: the Coordinator contacts the complainant about supportive measures and how to file a formal complaint. A person who reports being a victim receives a written explanation of rights and options. Policy AD85 designates certain employees (including deans, department heads, directors, coaches and full-time supervisors) as mandatory reporters, and lists confidential resources for those who do not want to make a report. Crimes may also be reported to University Police, anonymously online, or as a voluntary confidential report.",
      },
      citations: [
        asr(
          "p. 17",
          "Any person may report any type of sex discrimination, including sexual harassment (whether or not the individual reporting is the person alleged to be the victim of conduct that could constitute sex discrimination or sexual harassment), in person, by mail, by telephone, online at https://universityethics.psu.edu/our-expertise/title-ix/report, or by email, using the contact information listed below.",
        ),
        asr(
          "p. 21",
          "Notice to a Title IX Coordinator or to an official with authority to institute corrective measures on the University's behalf triggers the University's response obligations.",
        ),
        asr(
          "p. 19",
          "the University will provide you with a written explanation of your rights and options.",
        ),
        ad85(
          "IX. Title IX Terms and Definitions, k. Mandatory Reporters",
          "The University has designated specific employees as mandatory reporters under this policy.",
        ),
        asr(
          "p. 11",
          "If you are interested in reporting a crime anonymously, you can use the University Police and Public Safety’s online crime reporting form.",
        ),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "outcome_information",
        findingKind: "documented",
        summary:
          "According to the 2026 Annual Security Report, the Title IX Coordinator sends the parties a written Notice of Outcome simultaneously, including findings of fact, the result of each allegation, any sanctions and how to appeal, and outcomes are disclosed to alleged victims of domestic violence, dating violence, sexual assault or stalking without a written request. Penn State's Office of Ethics and Compliance publishes quarterly Compliance Reporting Data showing the number and category of reports, including a Title IX/sexual misconduct category and reports to OSMRR, and report outcomes. In the Q4 2025 report reviewed, outcomes are given as combined totals for several offices rather than separately for sexual misconduct cases.",
      },
      citations: [
        asr(
          "p. 29",
          "the Title IX Coordinator will review the decision of the Hearing Panel and the sanctions, if applicable, and will send written notice (“Notice of Outcome”) of both simultaneously to the parties.",
        ),
        asr(
          "p. 29",
          "Written request is not required, however, from an alleged victim of domestic violence, dating violence, sexual assault or stalking.",
        ),
        {
          source: "reportingData",
          pinpoint: "Compliance Reporting Data",
          excerpt:
            "The reports below illustrate the number and category of reports received by the hotline and other institutional compliance areas, the distribution of reports by region, and report outcomes.",
        },
        {
          source: "complianceQ4_2025",
          pinpoint: "p. 1",
          excerpt: "Title IX/Sexual or Gender-based Misconduct",
          claim: "The dashboard has a Title IX/sexual misconduct report category",
        },
        {
          source: "complianceQ4_2025",
          pinpoint: "p. 2, Outcomes (Non-Hotline)",
          excerpt:
            "Includes data from the Office of Equal Opportunity and Access, the Office of the Vice President for Educational Equity (Including Report Bias), the Office of Sexual Misconduct Reporting and Response, and the Office of Student Accountability and Conflict Resolution.",
          claim: "Outcome totals combine several offices",
        },
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "transparency_practices",
        findingKind: "documented",
        summary:
          "According to the 2026 Annual Security Report, Penn State does not publish crime victims' personally identifiable information in the report or other public disclosures. Policy AD85 states that Title IX training materials are published at titleix.psu.edu. Penn State has run a Sexual Misconduct Climate Survey and publishes results by campus for 2015, 2018 and 2022; for the 2025 survey, its Coalition to Address Relationship and Sexual Violence decided the quantitative data will not be reported or used, citing low participation (5% of invited students gave usable responses) and a technical issue that prevented campus-level reporting.",
      },
      citations: [
        asr(
          "p. 38",
          "The University does not publish the personally identifiable information of the crime victims in its Annual Security Report or other publicly available disclosures",
        ),
        ad85(
          "II. Policy Statement",
          "The University will publish training materials on https://titleix.psu.edu/ which are up to date and reflect the latest training provided to Title IX personnel.",
        ),
        {
          source: "climateSurvey",
          pinpoint: "2022 Survey Instrument and Results",
          excerpt: "Links to the summary reports for all 23 campus locations can be accessed below.",
        },
        {
          source: "climateSurvey",
          pinpoint: "2025 Sexual Misconduct Climate Survey Update",
          excerpt:
            "After review of the available survey data, the Penn State Coalition to Address Relationship and Sexual Violence (CARSV) determined that the quantitative data collected will not be reported or used.",
        },
        {
          source: "climateSurvey",
          pinpoint: "2025 Sexual Misconduct Climate Survey Update",
          excerpt: "Despite multiple invitations and reminders, only 5% of invited students provided usable responses.",
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
        title: "AD85 Title IX Sexual Harassment",
        summary:
          "Penn State's university-wide policy prohibiting sexual harassment and misconduct, including sexual violence, domestic violence, dating violence and stalking, under Title IX. It applies to students, faculty, staff and others in University programs, for conduct in the United States on Penn State property or in a Penn State-sanctioned program off campus. The policy page states that Penn State implemented the current procedures effective August 14, 2020, under the 2020 Title IX regulations; its revision history lists later changes including updated terms and definitions (September 15, 2025), an updated definition of consent (June 2, 2026), and editorial and contact updates (September 10, 2026).",
        effectiveDate: null,
      },
      citations: [
        ad85(
          "Purpose",
          "To establish The Pennsylvania State University’s (“Penn State” or the “University”) policy prohibiting sexual harassment and misconduct, including, but not limited to, acts of sexual violence, sexual harassment, domestic violence, dating violence and stalking, in accordance with Title IX of the Education Amendments of 1972 (“Title IX”).",
        ),
        ad85(
          "III. Applicability",
          "This Policy applies to conduct which occurs within the United States, either on Penn State property or off campus in a Penn State-sanctioned education program or activity.",
        ),
        ad85(
          "Introduction",
          "Effective August 14, 2020 the University implemented the policy and procedural requirements described below to address complaints of sexual harassment as defined under the 2020 Title IX implementing regulations.",
        ),
        ad85("Revision History", "June 2, 2026 - Updated definition of Consent.", "Most recent substantive revision"),
        ad85(
          "Most Recent Changes",
          "September 10, 2026 – Editorial changes, Updated name of Title IX Coordinator, Updated contact information for Office of Equal Opportunity and Access.",
        ),
      ],
    },
    {
      key: "policy",
      input: {
        policyType: "other",
        title: "AD91 Non-Discrimination Policy",
        summary:
          "According to the 2026 Annual Security Report, Policy AD91 addresses reports of sexual misconduct not addressed under the Title IX policy, AD85. The report states that student sexual misconduct proceeds under AD85 even outside Title IX's jurisdiction, while non-Title IX sexual misconduct by employees is handled by the Office of Equal Opportunity and Access.",
        effectiveDate: null,
      },
      citations: [
        asr("p. 20", "AD 91 addresses other reports of sexual misconduct that are not addressed under the Title IX Policy AD85, in addition to sexual orientation and gender identity."),
        asr("p. 30", "All student sexual misconduct will proceed under AD85 even if they do not meet the jurisdictional criteria of Title IX."),
        asr(
          "p. 30",
          "The Office of Equal Opportunity and Access implements the procedures below to ensure an objective, equitable and timely resolution of complaints of discrimination, harassment, non-Title IX sex and gender-based harassment",
        ),
      ],
    },
    {
      key: "policy",
      input: {
        policyType: "amnesty",
        title: "Amnesty for Students (AD85, section V)",
        summary:
          "Policy AD85 states that a student who reports experiencing sexual misconduct, or reports another person's experience, will typically not be subject to student conduct action for their own alcohol or drug possession or use connected with the reported incident. Students may be required to complete an educational intervention, with any fees waived.",
        effectiveDate: null,
      },
      citations: [
        ad85(
          "V. Amnesty for Students",
          "A student who makes a report to the University or other appropriate authority (e.g., law enforcement) about experiencing sexual misconduct, or is reporting the experience of another, will typically not be subject to student conduct action related to their own possession or consumption of alcohol or other drugs in connection with the reported incident.",
        ),
        ad85(
          "V. Amnesty for Students",
          "As appropriate, involved students may be required to complete an educational intervention to address concerns about the student’s substance use; any associated fees will be waived.",
        ),
      ],
    },
    {
      key: "policy",
      input: {
        policyType: "supportive_measures",
        title: "Supportive measures",
        summary:
          "According to the 2026 Annual Security Report, supportive measures are non-disciplinary, individualized services offered without fee to complainants and respondents, before or after a formal complaint or where none is filed; a formal complaint is not required to receive them. Examples listed include confidential counseling, deadline extensions and course adjustments, changes to work or class schedules, campus escorts, mutual contact restrictions, changes in work or housing locations, leaves of absence, increased security and monitoring, and no-contact directives. The report states they are available whether or not the complainant reports the crime to police, and options are provided in writing on request.",
        effectiveDate: null,
      },
      citations: [
        asr("p. 21", "The party is not required to file a Formal Complaint to receive Supportive Measures."),
        asr(
          "p. 21",
          "Supportive Measures may include emotional support and counseling with a confidential resource, extensions of deadlines or other course-related adjustments, modifications of work or class schedules, campus escort services, mutual restrictions on contact between the parties, changes in work or housing locations, leaves of absence, increased security and monitoring of certain areas of the campus, no-contact directives, emergency removal and other similar measures.",
        ),
        asr(
          "p. 19",
          "The University will make available accommodations or provide supportive measures regardless of whether the complainant chooses to report the crime to campus police or local law enforcement.",
        ),
        asr("p. 19", "All options for accommodations and supportive measures will be provided to the complainant in writing upon request."),
      ],
    },

    // -----------------------------------------------------------------------------------------------------------
    // Resources: emergency and reporting channels
    // -----------------------------------------------------------------------------------------------------------
    {
      key: "student_resource",
      input: {
        category: "emergency",
        confidentiality: "institutional_reporting",
        name: "Emergency (911)",
        description:
          "For immediate danger. On campus, University Police can also be reached by dialing 3-1111 from any campus phone or by pressing the emergency button on campus emergency phones.",
        phone: "911",
        url: null,
        hours: null,
        available247: null,
        sortOrder: 0,
      },
      citations: [
        asr("p. 83", "DIAL: 911 on any telephone"),
        asr("p. 18", "If you are in immediate danger, or if you believe there could be an ongoing threat to you or the community, please call 911."),
        asr("p. 83", "you can reach University Police and Public Safety by dialing 3-1111 from any campus phone or 814-863-1111 from any other phone."),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "campus_police",
        confidentiality: "institutional_reporting",
        name: "Penn State University Police and Public Safety (University Park)",
        description:
          "Dispatch center by phone at 814-863-1111, or in person at 8 University Drive, 101 University Support Building I. Crimes can also be reported online at http://police.psu.edu/report-crime. Safe Walk escort: 814-865-WALK (9255), dusk to dawn.",
        phone: "814-863-1111",
        url: "https://www.police.psu.edu/",
        hours: "24 hours a day",
        available247: true,
        sortOrder: 0,
      },
      citations: [
        asr(
          "p. 10",
          "University Police and Public Safety have a dispatch center that is available by phone at 814-863-1111, in person 24 hours a day at 8 University Drive, 101 University Support Building I or by completing a Report a Crime Form.",
        ),
        asr(
          "p. 18",
          "To criminally report an incident involving a sexual assault, domestic violence, stalking, and dating violence, contact the Penn State University Police and Public Safety Department at 814-863-1111 or http://police.psu.edu/report-crime and/or local law enforcement.",
        ),
        asr("p. 40", "If walking on campus feels unsafe, please call 814-865-WALK (9255)."),
        asr("p. 19", "University Police and Public Safety – safety, support, and referrals - UPPS", "Linked to https://www.police.psu.edu/ in the PDF"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "local_law_enforcement",
        confidentiality: "institutional_reporting",
        name: "State College Borough Police Department",
        description: "South Allen Street, State College.",
        phone: "814-234-7150",
        url: null,
        hours: null,
        available247: null,
        sortOrder: 0,
      },
      citations: [asr("p. 83", "State College Borough Police Department 814-234-7150")],
    },
    {
      key: "student_resource",
      input: {
        category: "title_ix",
        confidentiality: "institutional_reporting",
        name: "Title IX Coordinator (Office of Ethics and Compliance)",
        description:
          "Rider Building, 227 West Beaver Ave., Suite 212, State College, PA 16801. Email titleix@psu.edu. Reports can be made online at https://universityethics.psu.edu/our-expertise/title-ix/report. The report says reports may be made at any time, including outside business hours, by phone, email or mail.",
        phone: "814-867-5088",
        url: "https://universityethics.psu.edu/our-expertise/title-ix/report",
        hours: null,
        available247: null,
        sortOrder: 0,
      },
      citations: [
        asr("p. 18", "Title IX Coordinator Office of Ethics and Compliance Rider Building, 227 West Beaver Ave., Suite 212, State College, PA 16801 814-867-5088 titleix@psu.edu"),
        asr(
          "p. 17",
          "Such a report may be made at any time, including during non-business hours, by using the telephone number or email address, or by mail to the office address, listed for the Title IX Coordinator.",
        ),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "title_ix",
        confidentiality: "institutional_reporting",
        name: "Office of Sexual Misconduct Reporting and Response (OSMRR)",
        description:
          "Handles matters involving student respondents on behalf of the Title IX Coordinator. 120 Boucke Building, University Park, PA 16802. Can also issue University no-contact directives (814-867-0099 or titleix@psu.edu).",
        phone: "814-867-0099",
        url: "https://studentaffairs.psu.edu/about/directory/titleix",
        hours: null,
        available247: null,
        sortOrder: 1,
      },
      citations: [
        asr("p. 18", "Matters Involving Student Respondents Office of Sexual Misconduct Reporting and Response 120 Boucke Building, University Park, PA 16802 814-867-0099"),
        asr(
          "p. 18",
          "To request a University-issued no contact directive, individuals may contact the Office of Sexual Misconduct Reporting and Response, (814-867-0099 or titleix@psu.edu)",
        ),
        asr(
          "p. 19",
          "Office of Sexual Misconduct Reporting and Response – response to reports of sexual harassment and sexual misconduct, coordination of resources and support services, education and training.- Title IX",
          "Linked to https://studentaffairs.psu.edu/about/directory/titleix in the PDF",
        ),
      ],
    },

    // -----------------------------------------------------------------------------------------------------------
    // Resources: confidential support
    // -----------------------------------------------------------------------------------------------------------
    {
      key: "student_resource",
      input: {
        category: "victim_advocacy",
        confidentiality: "confidential",
        name: "R-VOICE Center (Relationship Violence Outreach, Intervention, and Community Education)",
        description:
          "Confidential advocacy, crisis intervention and support, academic accommodation, referrals, and legal, medical or disciplinary accompaniment for students. 222U Boucke Building, 325 Pollock Rd., University Park. Email r-voice@psu.edu.",
        phone: "814-863-2027",
        url: "https://studentaffairs.psu.edu/support-safety/victim-survivor",
        hours: "Monday–Friday, 8:00 a.m.–5:00 p.m.",
        available247: false,
        sortOrder: 0,
      },
      citations: [
        asr("p. 15", "the Relationship Violence Outreach, Intervention and Community Education (R-VOICE) Center provides confidential advocacy and crisis intervention."),
        asr(
          "p. 19",
          "The Relationship Violence Outreach, Intervention, and Community Education Center – confidential advocacy, crisis intervention/support, academic accommodation, referrals, education, legal, medical, or disciplinary accompaniment - R-VOICE",
        ),
        asr("p. 62", "222U Boucke Building 814-863-2027", "Address and phone (resource table)"),
        {
          source: "victimSurvivor",
          pinpoint: "Get to a safe space",
          excerpt:
            "R-VOICE Center is available for all students during business hours, Monday–Friday, 8:00 a.m.–5:00 p.m. Complete an online intake form, call 814-863-2027, or email r-voice@psu.edu for guidance.",
          claim: "Hours and contact",
        },
        {
          source: "confidentialResources",
          pinpoint: "Confidential Resources",
          excerpt: "Education, advocacy, referrals, and crisis intervention/support counseling for victim survivors Free and confidential",
        },
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "counseling",
        confidentiality: "confidential",
        name: "Counseling and Psychological Services (CAPS), University Park",
        description:
          "Confidential counseling, support groups, crisis intervention and referrals for students. 501 Student Health Center. Outside business hours, the 24/7 Penn State Crisis Line: 1-877-229-6400.",
        phone: "814-863-0395",
        url: "https://studentaffairs.psu.edu/health-wellbeing/mental-health-services",
        hours: "Penn State Crisis Line 1-877-229-6400 available 24/7",
        available247: null,
        sortOrder: 0,
      },
      citations: [
        asr("p. 15", "On-campus, confidential counseling services are available to students through Counseling and Psychological Services (CAPS)."),
        asr("p. 62", "501 Student Health Center 814-863-0395 877-229-6400 (24-hour crisis line)", "Address and phones (resource table)"),
        {
          source: "confidentialResources",
          pinpoint: "Confidential Resources",
          excerpt: "Counseling and Psychological Services at University Park Counseling, support groups, and crisis intervention (814) 863-0395 501 Student Health Center",
        },
        { source: "capsPage", pinpoint: "Crisis Intervention", excerpt: "Call the 24/7 Penn State Crisis Line at 1-877-229-6400 or call 911." },
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "medical",
        confidentiality: "confidential",
        name: "University Health Services (UHS)",
        description:
          "Confidential, trauma-informed medical care for students after sexual assault, whether or not they report, including STI testing and treatment, pregnancy testing, emergency contraception and gynecological care. Student Health Center, University Park. According to Student Affairs, UHS does not conduct forensic evidence collection exams; students can obtain one at Mount Nittany Medical Center or Penn Highlands Healthcare.",
        phone: "814-865-4847",
        url: "https://studentaffairs.psu.edu/health",
        hours: null,
        available247: null,
        sortOrder: 0,
      },
      citations: [
        asr("p. 19", "University Health Services – confidential medical services - UHS", "Linked to https://studentaffairs.psu.edu/health in the PDF"),
        asr("p. 83", "University Health Services 814-865-4847 Student Health Center, University Park"),
        {
          source: "victimSurvivor",
          pinpoint: "Get Medical Treatment",
          excerpt:
            "University Health Services provides confidential, trauma-informed medical care for students following sexual assault. Students can choose which services they want and may receive care whether or not they decide to report.",
        },
        {
          source: "victimSurvivor",
          pinpoint: "Get Medical Treatment",
          excerpt:
            "University Health Services does not conduct forensic evidence collection exams. Students who wish to obtain a forensic evidence collection exam, sometimes called a Sexual Assault Response Team exam, can seek care at Mount Nittany Medical Center or Penn Highlands Healthcare.",
        },
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "medical",
        confidentiality: "unknown",
        name: "Mount Nittany Medical Center",
        description:
          "Hospital in State College (East Park Avenue). Student Affairs names it as the nearest emergency department for University Park and as a place to obtain a forensic evidence collection exam.",
        phone: "814-231-7000",
        url: null,
        hours: null,
        available247: null,
        sortOrder: 1,
      },
      citations: [
        asr("p. 83", "Mount Nittany Medical Center 814-231-7000 East Park Avenue, State College"),
        {
          source: "victimSurvivor",
          pinpoint: "Get to a safe space",
          excerpt: "At University Park that is Mount Nittany Medical Center or Penn Highlands State College.",
        },
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "confidential",
        confidentiality: "confidential",
        name: "Center for Sexual and Gender Diversity",
        description:
          "Listed by Penn State's Office of Ethics and Compliance as a confidential resource: education, information and advocacy services. LL011 HUB-Robeson Center.",
        phone: "(814) 863-1248",
        url: "https://universityethics.psu.edu/our-expertise/title-ix/t9-resources/confidential",
        hours: null,
        available247: null,
        sortOrder: 0,
      },
      citations: [
        {
          source: "confidentialResources",
          pinpoint: "Confidential Resources",
          excerpt: "Center for Sexual and Gender Diversity Education, information and advocacy services (814) 863-1248 LL011 HUB-Robeson Center",
        },
        {
          source: "confidentialResources",
          pinpoint: "Confidential Resources",
          excerpt:
            "Confidential resources will not disclose information about the incident, and seeking advice from a confidential counselor does not constitute a report to the University or law enforcement.",
        },
      ],
    },

    // -----------------------------------------------------------------------------------------------------------
    // Resources: community
    // -----------------------------------------------------------------------------------------------------------
    {
      key: "student_resource",
      input: {
        category: "victim_advocacy",
        confidentiality: "confidential",
        name: "Centre Safe",
        description:
          "Community agency at 140 W. Nittany Ave., State College. 24-hour hotline 814-234-5050; toll-free 877-234-5050; resource information 814-238-7066; TTY 814-272-0660. Student Affairs describes the hotline as staffed by confidential counselor advocates.",
        phone: "814-234-5050",
        url: null,
        hours: "24-hour hotline",
        available247: true,
        sortOrder: 1,
      },
      citations: [
        asr("p. 63", "Centre Safe 140 W. Nittany Ave. State College, PA 16801", "Address (community resources table)"),
        asr("p. 63", "814-234-5050 (24-hour Hotline) 877-234-5050 (toll-free)", "Phones (community resources table)"),
        {
          source: "victimSurvivor",
          pinpoint: "Get to a safe space",
          excerpt: "Centre Safe has a 24/7 hotline with confidential counselor advocates. Call 1-877-234-5050 toll free. TTY service is available at 814-272-0660.",
        },
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "victim_advocacy",
        confidentiality: "unknown",
        name: "Pennsylvania Coalition to Advance Respect (PCAR) hotline",
        description: "Statewide 24-hour hotline listed in the Annual Security Report.",
        phone: "1-888-772-7227",
        url: "https://www.pcar.org/",
        hours: "24-hour hotline",
        available247: true,
        sortOrder: 2,
      },
      citations: [asr("p. 20", "Pennsylvania Coalition to Advance Respect 24-hour hotline (1-888-772-7227) - PCAR", "Linked to https://www.pcar.org/ in the PDF")],
    },
  ],
};
