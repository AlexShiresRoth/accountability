// The Ohio State University: institutional record (Columbus campus).
//
// Transcribed 2026-10-05 by Claude from official Ohio State documents (see `sources`):
// - the 2026 Annual Security Report (pp. 4–5, 7–9, 14, 19–21, 29, 31, 34–38; same document as
//   research/ohio-state-university.ts; these pages are all before the inserted pages, so printed page = PDF page);
// - the Non-Discrimination, Harassment, and Sexual Misconduct policy PDF (23 pages, "Reviewed: 06/01/2026");
// - four Civil Rights Compliance Office (CRCO) web pages: Support Resources, Confidentiality, Resolutions, and
//   "Ohio State's Progress on Sexual Misconduct Prevention and Reporting".
// Status after import: pending_review. A human must check each record against the cited page before verifying.
//
// Every excerpt was checked by script against the source text (PyMuPDF for the PDFs, the page HTML for the web
// pages), ignoring line breaks. Line-break artifacts are joined ("614-247- 5838" → "614-247-5838"). Each archived
// copy was confirmed to resolve: the policy snapshot is byte-identical to the live PDF, and the text of each CRCO
// snapshot matches the live page read on 2026-10-05. Summaries are attributed to their source; they describe what
// Ohio State says its process is, not an evaluation of how it works in practice.
//
// Confidentiality: marked "confidential" only where a source says so: the 2026 ASR's resource list (p. 4) labels
// SARNCO, BRAVO, LSS CHOICES, the Employee Assistance Program, Student Legal Services, Counseling and Consultation
// Service and Wilce Student Health Center "Confidential"; the CRCO Support Resources page lists the STAR program
// under "Confidential Counseling". The ASR (p. 31) adds that Ohio public records law limits the confidentiality the
// university can promise to reporters.
//
// Discrepancies found, for a human to resolve:
// - LSS CHOICES hotline: the ASR (p. 4) prints "614-224-4663"; the CRCO Support Resources page prints
//   "614-244-HOME (4663)" (its tel: link is 614-244-4663). The phone field is left empty and both are quoted.
// - The ASR (p. 4) lists "844-644-6435 (844-OHIOHELP)" under the SARNCO entry; the ASR (p. 21) and the CRCO page
//   give 844-OHIO-HELP (844-644-6435) as the statewide Ohio Sexual Violence Helpline. It is entered as the Ohio
//   Sexual Violence Helpline, as both of the more specific sources say.
// - The CRCO page's BRAVO entry shows "866-86-BRAVO or 614-333-1907" but both tel: links point to 614-294-7867.
//   The printed numbers (which match the ASR) are used.
//
// Not entered, and why:
// - Timeline entries (institution actions): the CRCO "Progress" page lists dated measures (e.g. the 2014 Office for
//   Civil Rights Resolution Agreement, the 2019 Task Force on Sexual Abuse after the Strauss investigation report).
//   These are the university's own account and were not checked against primary documents (the agreement itself,
//   the Perkins Coie report, court records), so they are left for a researcher; the page is cited only for the
//   transparency record. Strauss-related litigation and settlements were not researched.
// - Aggregate outcome data: none located (see the outcome_information record for what was searched).
// - Amnesty policy: neither the ASR nor the policy contains an amnesty provision ("amnesty" does not appear).
// - Regional-campus resources (Lima, Mansfield, Marion, Newark, Wooster; ASR p. 5): the record follows the
//   Columbus statistics.
// - Other listed services: Mount Carmel Crime and Trauma Assistance Program (614-234-5900), Psychological Services
//   Center, Behavioral Health Immediate Care, Student Advocacy Center (614-292-1111; the ASR p. 20 calls it a
//   non-confidential resource), Housing and Residence Education, Student Wellness Center, Alcoholics Anonymous.
// - The CRCO Process Standards (which set the investigation timelines) and Code of Student Conduct were not read;
//   the timelines are taken from the ASR (p. 36).

import type { ResearchBundle } from "@/lib/admin/research-bundle";

const asr = (pinpoint: string, excerpt: string, claim?: string) => ({ source: "asr2026", pinpoint, excerpt, claim });
const policy = (pinpoint: string, excerpt: string, claim?: string) => ({ source: "policy2026", pinpoint, excerpt, claim });
const resources = (excerpt: string, claim?: string) => ({ source: "crcoResources", pinpoint: "Support Resources page", excerpt, claim });

export const ohioStateInstitutional: ResearchBundle = {
  college: { slug: "ohio-state-university" },
  sources: {
    // Same document as research/ohio-state-university.ts; the importer reuses the existing source by URL.
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
    },
    policy2026: {
      type: "university",
      publisher: "The Ohio State University Civil Rights Compliance Office",
      title: "Non-Discrimination, Harassment, and Sexual Misconduct (University Policy)",
      url: "https://policies.osu.edu/sites/default/files/documents/2026/05/Policy-NDH-Sexual-Misconduct.pdf",
      archivedUrl:
        "https://web.archive.org/web/20261002214617/https://policies.osu.edu/sites/default/files/documents/2026/05/Policy-NDH-Sexual-Misconduct.pdf",
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes:
        "23-page policy and procedure. Page numbers are as printed (\"Page N of 23\"), equal to PDF pages. Header: \"Issued: 10/01/1980 Reviewed: 06/01/2026\"; revision history on p. 23 (last revision 09/08/2025).",
      internalNotes:
        "Downloaded directly on 2026-10-05; linked from the 2026 ASR (p. 9, \"Download the Non-Discrimination, Harassment, and Sexual Misconduct Policy\"). The Wayback snapshot of 2026-10-02 was also downloaded and is byte-identical. SHA-256: ad18d366f90327f6c2b22b9778d5a20ae8eea90692dec9313b5ad702c7ed8504. PDF metadata: created 2026-05-15, modified 2026-05-27.",
    },
    crcoResources: {
      type: "university",
      publisher: "The Ohio State University Civil Rights Compliance Office",
      title: "Support Resources",
      url: "https://civilrights.osu.edu/support-options-and-accommodations/support-resources",
      archivedUrl:
        "https://web.archive.org/web/20260928161252/https://civilrights.osu.edu/support-options-and-accommodations/support-resources",
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes: "Lists confidential advocacy, counseling and legal resources.",
      internalNotes: "Read live on 2026-10-05; the Wayback capture of 2026-09-28 has the same text.",
    },
    crcoConfidentiality: {
      type: "university",
      publisher: "The Ohio State University Civil Rights Compliance Office",
      title: "Confidentiality",
      url: "https://civilrights.osu.edu/reporting/confidentiality",
      archivedUrl: "https://web.archive.org/web/20260928161251/https://civilrights.osu.edu/reporting/confidentiality",
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes: null,
      internalNotes: "Read live on 2026-10-05; the Wayback capture of 2026-09-28 has the same text.",
    },
    crcoResolutions: {
      type: "university",
      publisher: "The Ohio State University Civil Rights Compliance Office",
      title: "Resolutions",
      url: "https://civilrights.osu.edu/reporting/resolutions",
      archivedUrl: "https://web.archive.org/web/20260418161842/https://civilrights.osu.edu/reporting/resolutions",
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes: "Hearings and informal resolution.",
      internalNotes: "Read live on 2026-10-05; the Wayback capture of 2026-04-18 has the same text.",
    },
    crcoProgress: {
      type: "university",
      publisher: "The Ohio State University Civil Rights Compliance Office",
      title: "Ohio State’s Progress on Sexual Misconduct Prevention and Reporting",
      url: "https://civilrights.osu.edu/about/ohio-states-progress-sexual-misconduct-prevention-and-reporting",
      archivedUrl:
        "https://web.archive.org/web/20260521080329/https://civilrights.osu.edu/about/ohio-states-progress-sexual-misconduct-prevention-and-reporting",
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes: "The university's year-by-year account of its sexual misconduct prevention and response measures, 1998–2019 and later. Undated page.",
      internalNotes:
        "Read live on 2026-10-05 (linked from civilrights.osu.edu/about as \"steps Ohio State has taken to address sexual misconduct\"); the Wayback capture of 2026-05-21 has the same text.",
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
          "According to the 2026 Annual Security Report, allegations that an Ohio State student or employee committed sexual assault, domestic violence, dating violence or stalking are investigated and adjudicated by the Civil Rights Compliance Office (CRCO), which houses the university's Title IX functions, under the university-wide Non-Discrimination, Harassment, and Sexual Misconduct policy. The report gives approximate timeframes: 90 business days for the investigation (including 10 business days for the parties to review the evidence), 45 business days for a hearing and written determination or for the investigative report, and 30 business days for appeals, with extensions possible. The policy distinguishes Title IX complaints from other CRCO complaints and allows the CRCO to proceed without a complainant's participation in some circumstances.",
      },
      citations: [
        asr("p. 36", "Allegations that an Ohio State student or employee has committed sexual assault, domestic violence, dating violence, or stalking are investigated and adjudicated by the Civil Rights Compliance Office, 1501 Neil Ave., Columbus OH 43201, 614-247-5838."),
        asr("p. 7", "This centralized office houses the university’s Americans with Disabilities Act (ADA), Equal Employment Opportunity (EEO), Youth Activities and Programs, and Title IX functions."),
        asr("p. 36", "Conducting the investigation, which includes interviewing parties and witnesses and reviewing documentation (90 business days).", "Investigation timeframe"),
        asr("p. 36", "Scheduling and conducting hearing (if applicable) and written determination issuance or preparation and finalization of investigative report (45 business days).", "Hearing and determination timeframe"),
        asr("p. 36", "Appeals (30 business days)", "Appeal timeframe"),
        policy("p. 2", "A broad term that encompasses two types of complaints: a Civil Rights Compliance Office (CRCO) complaint and a Title IX complaint.", "Two complaint types"),
        policy("p. 12", "There may be instances where CRCO moves forward with an investigative or other resolution without the participation of a complainant"),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "disciplinary_procedures",
        findingKind: "documented",
        summary:
          "According to the 2026 Annual Security Report, allegations of sexual assault, domestic violence, dating violence and stalking against a student are adjudicated through a hearing before a resolutions officer, using a preponderance-of-the-evidence standard; the respondent is presumed not responsible until the process concludes. Available student sanctions include dismissal (permanent separation), suspension (from one semester), probation, formal reprimand and educational sanctions; employee corrective actions include reduction in supervisory duties, changes in salary and termination. Both parties receive the written determination simultaneously and may appeal on grounds of procedural irregularity, new evidence, or conflict of interest or bias. According to the policy and the CRCO, informal resolution is voluntary and is not offered for allegations that an employee sexually harassed a student.",
      },
      citations: [
        asr("p. 37", "The legal rules of evidence do not apply, and the standard of proof is the preponderance of the evidence standard. The hearing body will be a resolutions officer or designee."),
        asr("p. 37", "The respondent is presumed not responsible for the alleged conduct, and a determination regarding responsibility is made at the conclusion of the resolution process."),
        asr("p. 37", "Available sanctions include separation from the university. Dismissal is a permanent separation.", "Student sanctions"),
        asr("p. 37", "Other available sanctions less than separation include probation for one or more semesters or a formal reprimand.", "Student sanctions"),
        asr("p. 38", "Corrective actions include reduction in supervisory duties and leadership responsibilities, changes in salary, termination, and other appropriate corrective actions.", "Employee corrective action"),
        asr("p. 37", "the Civil Rights Compliance Office promptly communicates simultaneously, in writing, to both parties a written determination that includes the outcome of the hearing, the institution’s appeal procedures, and other information as outlined in the Non-Discrimination, Harassment, and Sexual Misconduct policy.", "Simultaneous written determination"),
        asr("p. 37", "Procedural irregularity that affected the outcome of the matter;", "First of three appeal grounds (with new evidence, and conflict of interest or bias)"),
        policy("p. 12", "The university does not offer or facilitate an informal resolution process to resolve allegations that an employee sexually harassed a student."),
        { source: "crcoResolutions", pinpoint: "Informal Resolutions", excerpt: "Informal Resolution is not permitted for complaints involving an employee respondent and a student complainant." },
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "law_enforcement_referrals",
        findingKind: "documented",
        summary:
          "According to the 2026 Annual Security Report, complainants may pursue a criminal investigation and the university disciplinary process, and the university will help a complainant notify University Police or other local police on request. A complainant may decline to notify law enforcement, but the report states that the university must follow state law requirements to report known felony crimes to the appropriate law enforcement agency. Reporting to police does not necessarily require filing criminal charges. The policy states that a report to the university does not prevent a report to law enforcement and does not extend criminal time limits.",
      },
      citations: [
        asr("p. 34", "The university also will assist complainants in notifying the University Police or other local police if the complainant requests the assistance of law enforcement."),
        asr("p. 34", "The complainant may choose to decline to notify law enforcement, but the university is required to follow state law requirements to report known felony crimes to the appropriate law enforcement agency."),
        asr("p. 34", "Reporting an offense to the University Police or other law enforcement or campus security authorities does not necessarily require filing criminal charges"),
        asr("p. 38", "Complainants of sexual assault, domestic violence, dating violence, and stalking have the right to initiate a criminal investigation and initiate the disciplinary process through the Civil Rights Compliance Office"),
        policy("p. 10", "Making a report to the university does not preclude the individual from filing a report of a crime with law enforcement nor does it extend time limits that may apply in criminal processes."),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "prevention_programs",
        findingKind: "documented",
        summary:
          "According to the 2026 Annual Security Report, all students and employees must complete online sexual misconduct training each year; the required module, STEP UP Against Sexual Misconduct, covers bystander intervention, reporting options, resources, supportive measures, disciplinary procedures and consent. First-year and undergraduate students are also assigned RespectEdu, a module on healthy relationships, and students and parents view a bystander intervention video at orientation. The Relationship Education and Violence Prevention (REVP) program in the Student Wellness Center runs other prevention programs and workshops.",
      },
      citations: [
        asr("p. 8", "by requiring that all students and employees complete online sexual misconduct training annually."),
        asr("p. 8", "A central component of this work is STEP UP Against Sexual Misconduct, Ohio State’s required online learning module."),
        asr("p. 9", "RespectEdu is assigned to all first-year and undergraduate students and is accessible through BuckeyeLearn"),
        asr("p. 14", "Students and parents view a bystander intervention video during orientation that is aimed at preventing sexual assault."),
        asr("p. 8", "the Relationship Education and Violence Prevention (REVP) program in the Student Life Student Wellness Center is responsible for the creation of other evidence-based primary prevention programs and awareness campaigns"),
        policy("p. 15", "All faculty, staff, student employees, graduate associates, and students are required to take annual sexual misconduct training and other anti-discrimination and harassment training as directed by the university."),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "reporting_procedures",
        findingKind: "documented",
        summary:
          "According to the 2026 Annual Security Report and the policy, reports of sexual misconduct may be made to the Civil Rights Compliance Office by online form, phone, email or mail, to University Police, or anonymously through the EthicsPoint reporting line. Under the policy, all university employees except those with a legal privilege of confidentiality or designated confidential must immediately report sexual assault, and human resource professionals, supervisors, chairs/directors and faculty must report other discrimination, harassment and sexual misconduct within five workdays. When a report is received, the Title IX Coordinator or designee contacts the complainant about supportive measures, which are available with or without a formal complaint.",
      },
      citations: [
        asr("p. 31", "Reports of sexual assault, domestic violence, dating violence, and stalking may be made to the university:"),
        asr("p. 31", "Anonymous reports through EthicsPoint, 866-294-9350, ohio-state.ethicspoint.com"),
        policy("p. 8", "All university employees, except those exempted by legal privilege of confidentiality (see Policy Details III.G) or expressly identified as a confidential reporter, must report incidents of sexual assault."),
        policy("p. 8", "These individuals must report all known information as soon as practicable but at most within five workdays of becoming aware of such information:"),
        asr("p. 35", "Upon receipt of a report of sexual misconduct, the Title IX Coordinator or designee will promptly contact the complainant to discuss the availability of supportive measures, consider the complainant’s wishes with respect to supportive measures, inform the complainant of the availability of supportive measures with or without the filing of a formal complaint, and explain to the complainant the process for filing a formal complaint."),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "outcome_information",
        findingKind: "not_located",
        summary:
          "Aggregate information on the outcomes of sexual misconduct complaints was not located in the public sources reviewed: the 2026 Annual Security Report, the Non-Discrimination, Harassment, and Sexual Misconduct policy, and the Civil Rights Compliance Office website (the About, Policies and Standards, News, Reporting and Support Resources pages, and the site map, searched for annual reports, data or statistics). The report and policy state that both parties receive the written determination simultaneously, and the policy says the parties are informed of the outcome and any sanction in accordance with FERPA and other applicable law.",
      },
      citations: [
        policy("p. 19", "The university must provide the written determination to the parties simultaneously."),
        policy("p. 19", "the parties will be informed of the outcome and imposed sanction or corrective action in accordance with FERPA and other applicable law."),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "transparency_practices",
        findingKind: "documented",
        summary:
          "The 2026 Annual Security Report prints reports concerning former university physician Richard Strauss as separate rows in its Columbus statistics, with notes explaining how they were counted, and says the university will publish updated statistics if the figures change. Public Safety Notices do not include the names of crime victims. The Civil Rights Compliance Office says that as a public institution the university cannot promise complete confidentiality: for example, reports about faculty and staff may be subject to public records requests, while reports against students are protected under FERPA. The Civil Rights Compliance Office publishes a year-by-year account of the university's sexual misconduct prevention and reporting measures.",
      },
      citations: [
        asr("p. 44 (PDF p. 64)", "Should such modifications occur, the university will publish updated statistics to keep the campus community informed.", "Updated statistics"),
        asr("p. 29", "Public Safety Notices do not include the names of crime victims."),
        { source: "crcoConfidentiality", pinpoint: "Confidentiality page", excerpt: "As a public institution, the university cannot promise complete confidentiality." },
        { source: "crcoConfidentiality", pinpoint: "Confidentiality page", excerpt: "For example, reports about faculty and staff may be subject to public records requests." },
        { source: "crcoConfidentiality", pinpoint: "Confidentiality page", excerpt: "Reports against students are protected under federal law, the Family Educational Rights and Privacy Act" },
        {
          source: "crcoProgress",
          pinpoint: "Introduction",
          excerpt:
            "Developed and implemented by many different stakeholders across the university, these wide-ranging efforts include new policies, programs, staffing and tools, which are summarized below.",
          claim: "The university publishes an account of its measures",
        },
      ],
    },

    // -----------------------------------------------------------------------------------------------------------
    // Policies
    // -----------------------------------------------------------------------------------------------------------
    {
      key: "policy",
      input: {
        policyType: "sexual_misconduct",
        title: "Non-Discrimination, Harassment, and Sexual Misconduct",
        summary:
          "Ohio State's university-wide policy, administered by the Civil Rights Compliance Office, covering protected-class discrimination and harassment and sexual misconduct, defined to include sexual harassment (university and Title IX definitions), sexual assault, relationship violence (dating and domestic violence), stalking and sexual exploitation. It applies to faculty, staff, students, student employees, graduate associates, suppliers/contractors, program participants, volunteers and visitors, and sets out employee reporting duties, supportive measures, informal and investigative resolution, hearings, sanctions and appeals. The policy was first issued 10/01/1980 (as Sexual Harassment), renamed in 2022, last revised 09/08/2025 and reviewed 06/01/2026, according to its history.",
        effectiveDate: null,
      },
      citations: [
        policy("p. 4", "A broad term that encompasses sexual harassment (university definition and/or Title IX), sexual assault, relationship violence, stalking, and sexual exploitation.", "Definition of sexual misconduct"),
        policy("p. 1", "Applies to: Faculty, staff, students, student employees, graduate associates, suppliers/contractors, program participants, volunteers, and visitors"),
        policy("p. 23", "Revised: 01/25/2022 Renamed Non-Discrimination, Harassment, and Sexual Misconduct", "Policy history"),
        policy("p. 23", "Revised: 09/08/2025 Minor revision Reviewed: 06/01/2026", "Policy history"),
        asr("p. 9", "The Ohio State University prohibits sexual assault, domestic violence, dating violence, and stalking as well as other forms of sexual misconduct."),
      ],
    },
    {
      key: "policy",
      input: {
        policyType: "reporting",
        title: "Employee duty to report",
        summary:
          "Under Section III of the Non-Discrimination, Harassment, and Sexual Misconduct policy, all university employees must immediately report all known information about a sexual assault, except professional and pastoral counselors, other employees with a professional license requiring confidentiality acting in that role, and staff they supervise (for example, student health services and medical center employees). Human resource professionals, supervisors, chairs/directors and faculty must also report other discrimination, harassment, sexual misconduct and prohibited relationships within five workdays. Disclosures at public survivor events, to student employees outside their work capacity, or in approved research are exempt unless the person seeks university assistance. Anonymous reports do not fulfil the duty.",
        effectiveDate: null,
      },
      citations: [
        policy("p. 8", "Any employee who receives a disclosure of a sexual assault or becomes aware of information that would lead a reasonable person to believe that a sexual assault may have occurred involving anyone covered under this policy must report all known information immediately."),
        policy("p. 8", "These individuals must report all known information as soon as practicable but at most within five workdays of becoming aware of such information:"),
        policy("p. 9", "The following categories of employees are exempt from the duty to report sexual assault and other sexual misconduct, due to their legal or professional privilege of confidentiality or their designation by the university as a confidential reporter."),
        policy("p. 10", "Note that anonymous reports do not fulfill an employee’s duty to report."),
      ],
    },
    {
      key: "policy",
      input: {
        policyType: "supportive_measures",
        title: "Supportive measures",
        summary:
          "Under Section VI of the Non-Discrimination, Harassment, and Sexual Misconduct policy, the Civil Rights Compliance Office contacts a complainant on receipt of a report to discuss supportive measures, which are available with or without a complaint and are offered to both parties. Measures listed include mutual no contact directives, referrals to campus and community resources, deadline extensions and course adjustments, changes to work or class schedules, changes in work or housing location, leave requests and help with academic petitions. According to the 2026 Annual Security Report, measures are provided regardless of whether the complainant reports to police, and the university keeps them confidential to the extent that does not impair providing them.",
        effectiveDate: null,
      },
      citations: [
        policy("p. 11", "Supportive measures may include, but are not limited to: 1. Mutual no contact directives;"),
        policy("p. 11", "The university treats complainants and respondents equitably by offering supportive measures to both parties, if and when a respondent is identified."),
        asr("p. 35", "regardless of whether the complainant chooses to report the crime to campus police or local law enforcement."),
        asr("p. 35", "The university maintains as confidential any supportive measures provided to the complainant or respondent, to the extent that maintaining such confidentiality would not impair the ability of the university to provide the supportive measures."),
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
        name: "The Ohio State University Police Division (OSUPD)",
        description:
          "Emergency: 9-1-1. Non-emergency: 614-292-2121. Columbus office: Blankenship Hall, 901 Woody Hayes Drive. Walk-in service every hour of every day. Email police@osu.edu. Can provide information and help with No Contact Orders and civil protection orders.",
        phone: "614-292-2121",
        url: "https://dps.osu.edu/police",
        hours: "24 hours a day, every day of the year",
        available247: true,
        sortOrder: 0,
      },
      citations: [
        asr("p. 7", "University Police are available 24 hours a day, every day of the year, to receive reports and investigate crimes that are reported to have occurred on university property."),
        asr("p. 7", "Columbus – Blankenship Hall, 901 Woody Hayes Drive, 614-292-2121", "Contact details"),
        asr("p. 7", "Specific questions may be directed to University Police through email at police@osu.edu.", "Email"),
        asr("p. 38", "OSUPD can provide information and assistance with No Contact Orders, Civil Protection Orders (CPO), Civil Stalking Protection Orders (CSPO), Civil Sexually Oriented Offense Protection Orders (CSOOPO), Temporary Protection Orders (TPO), or Juvenile Civil Protection Orders", "Protection orders"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "title_ix",
        confidentiality: "institutional_reporting",
        name: "Civil Rights Compliance Office (Title IX Coordinator)",
        description:
          "Receives reports of sexual misconduct and investigates and adjudicates complaints. 1501 Neil Ave., Columbus OH 43201. TTY 614-688-8605. Email civilrights@osu.edu or titleIX@osu.edu. Online reporting form at civilrights.osu.edu. Civil Rights Intake Coordinators help with supportive measures, referrals and reporting options.",
        phone: "614-247-5838",
        url: "https://civilrights.osu.edu/",
        hours: null,
        available247: null,
        sortOrder: 0,
      },
      citations: [
        asr("p. 7", "Title IX Coordinator: 614-247-5838, TTY 614-688-8605, 1501 Neil Ave., Columbus OH 43201, civilrights@osu.edu", "Contact details"),
        policy("p. 9", "Email: civilrights@osu.edu or titleIX@osu.edu", "Email"),
        asr("p. 7", "Complete an online reporting form at civilrights.osu.edu", "Online form"),
        asr("p. 7", "Civil Rights Intake Coordinators are available to support Ohio State students and employees who experience sexual misconduct or other forms of harassment and discrimination."),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "title_ix",
        confidentiality: "institutional_reporting",
        name: "Anonymous Reporting Line (EthicsPoint)",
        description:
          "Anonymous reports, by phone or online at ohio-state.ethicspoint.com. The policy notes that anonymous reports do not satisfy an employee's duty to report, and the CRCO notes that without the complainant's identity and contact information the university's ability to investigate may be limited.",
        phone: "866-294-9350",
        url: "https://secure.ethicspoint.com/domain/media/en/gui/7689/index.html",
        hours: null,
        available247: null,
        sortOrder: 1,
      },
      citations: [
        asr("p. 31", "Anonymous reports through EthicsPoint, 866-294-9350, ohio-state.ethicspoint.com", "Contact details"),
        policy("p. 10", "Note that anonymous reports do not fulfill an employee’s duty to report."),
        {
          source: "crcoConfidentiality",
          pinpoint: "Confidentiality page",
          excerpt:
            "However, without the identity and contact information of the complainant and the ability to obtain additional information, the university's ability to investigate and resolve the situation may be limited.",
        },
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "local_law_enforcement",
        confidentiality: "institutional_reporting",
        name: "Columbus Division of Police",
        description:
          "Non-emergency line. Emergency: 9-1-1. The report states that Columbus Division of Police, the Franklin County Sheriff's Office and the Ohio State Highway Patrol have jurisdiction on the Columbus campus.",
        phone: "614-645-4545",
        url: "https://www.columbus.gov/police/",
        hours: null,
        available247: null,
        sortOrder: 0,
      },
      citations: [
        asr("p. 5", "Columbus Police Non-Emergency – 614-645-4545", "Contact details"),
        asr("p. 6", "Columbus Division of Police, Franklin County Sheriff’s Office, and Ohio State Highway Patrol have jurisdiction on the Columbus campus and other university property"),
      ],
    },

    // -----------------------------------------------------------------------------------------------------------
    // Resources: confidential (as labeled in the sources)
    // -----------------------------------------------------------------------------------------------------------
    {
      key: "student_resource",
      input: {
        category: "victim_advocacy",
        confidentiality: "confidential",
        name: "Sexual Assault Response Network of Central Ohio (SARNCO)",
        description:
          "Independent of the university (OhioHealth). Confidential advocacy for survivors of sexual violence, including students, faculty, staff and visitors of the Columbus campus: on-campus advocacy 614-688-2518, sarncocampus@ohiohealth.com, 33 W. 11th Avenue, Room 202. 24/7 confidential sexual violence helpline: 614-267-7020. Also provides advocates in local emergency departments during forensic and medical exams.",
        phone: "614-688-2518",
        url: "https://www.ohiohealth.com/community-health/sarnco",
        hours: "Helpline 24/7 (614-267-7020)",
        available247: true,
        sortOrder: 0,
      },
      citations: [
        asr("p. 21", "24/7 confidential sexual violence helpline: 614-267-7020", "Helpline"),
        asr("p. 21", "SARNCO On-Campus Advocacy Services, 614-688-2518, provide confidential support for survivors of sexual violence, including students, faculty, staff, and visitors of Ohio State’s Columbus campus.", "On-campus advocacy"),
        resources("In person: The on-campus office is at 33 W. 11th Avenue, Room 202, Columbus, OH 43201.", "Office location"),
        resources("Email: sarncocampus@ohiohealth.com.", "Email"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "victim_advocacy",
        confidentiality: "confidential",
        name: "Ohio Sexual Violence Helpline",
        description:
          "Independent of the university. Statewide 24/7 confidential helpline and online chat for survivors of sexual violence and those supporting them. Also written 844-OHIO-HELP.",
        phone: "844-644-6435",
        url: "https://www.ohiosexualviolencehelpline.com/",
        hours: "24/7",
        available247: true,
        sortOrder: 1,
      },
      citations: [
        asr("p. 21", "The Ohio Sexual Violence Helpline is the 24/7 confidential helpline serving the state – 844-OHIO-HELP (844-644-6435).", "Contact details"),
        resources("This confidential, statewide helpline serves all survivors of sexual violence as well as those who care and support them.", "Confidential"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "victim_advocacy",
        confidentiality: "confidential",
        name: "Buckeye Region Anti-Violence Organization (BRAVO)",
        description:
          "Independent of the university. Advocacy and support for LGBTQI survivors of hate and bias violence, intimate partner violence, stalking and sexual assault; calls are confidential and may be anonymous. Helpline 1-866-862-7286 (1-866-86-BRAVO); text line 614-333-1907. The CRCO page gives helpline hours as weekdays 9 a.m. to 5 p.m.",
        phone: "1-866-862-7286",
        url: "http://bravo.equitashealth.org/",
        hours: "Weekdays 9 a.m. to 5 p.m. (phone/text/chat)",
        available247: false,
        sortOrder: 2,
      },
      citations: [
        asr("p. 4", "Buckeye Region Anti-Violence Organization (BRAVO) – 1-866-862-7286 (1-866-86-BRAVO). Confidential – 614-333-1907, BRAVO text message line", "Contact details; labeled confidential"),
        resources("All calls are kept strictly confidential and can be made anonymously.", "Confidential"),
        resources("Weekdays: 9 a.m. to 5 p.m. (phone/text/chat)", "Hours"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "victim_advocacy",
        confidentiality: "confidential",
        name: "LSS CHOICES for Victims of Domestic Violence",
        description:
          "Independent of the university. 24-hour domestic violence hotline; counseling, emergency shelter, and legal and community advocacy in Franklin County. The sources disagree on the hotline number: the 2026 Annual Security Report (p. 4) prints 614-224-4663; the CRCO Support Resources page prints 614-244-HOME (4663). Confirm before publishing.",
        phone: null,
        url: "https://lssnetworkofhope.org/choices/",
        hours: "24/7",
        available247: true,
        sortOrder: 3,
      },
      citations: [
        asr("p. 4", "LSS Choices for Victims of Domestic Violence – 614-224-4663. Confidential, 24/7", "Number as printed in the ASR; labeled confidential"),
        resources("LSS CHOICES for Victims of Domestic Violence 24-hour Hotline 614-244-HOME (4663)", "Number as printed on the CRCO page"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "victim_advocacy",
        confidentiality: "confidential",
        name: "Student Legal Services",
        description:
          "Non-profit law office for eligible Ohio State students (degree-seeking Columbus students who have not opted out). Can represent survivors in obtaining protection orders and through criminal proceedings. The CRCO page says its attorneys are not university employees and contacting them will not result in a report to the university. 20 E 11th. Ave, Columbus. Appointments online or by call or text.",
        phone: "614-247-5853",
        url: "https://studentlegal.osu.edu/",
        hours: null,
        available247: null,
        sortOrder: 4,
      },
      citations: [
        asr("p. 4", "Student Legal Services – 614-247-5853. Confidential", "Labeled confidential"),
        asr("p. 19", "Legal professionals are required to keep clients’ information confidential (with very limited exceptions)."),
        asr("p. 19", "Depending on the matter, SLS attorneys can represent (or when necessary provide referral resources to) survivors in obtaining protection orders and throughout the criminal process and proceedings."),
        resources("Attorneys are not university employees and will not result in a report to the university.", "Not a reporting channel"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "counseling",
        confidentiality: "confidential",
        name: "Student Life Counseling and Consultation Service (CCS)",
        description:
          "Counseling for enrolled students, including for sexual assault and relationship violence. Main office: 4th floor of the Younkin Success Center, 1640 Neil Avenue; also 1030 Lincoln Tower. The ASR (p. 31) names CCS counselors among the few to whom the university can promise confidentiality under Ohio public records law.",
        phone: "614-292-5766",
        url: "https://ccs.osu.edu/",
        hours: "24/7 (as listed in the ASR)",
        available247: true,
        sortOrder: 0,
      },
      citations: [
        asr("p. 4", "Student Life Counseling and Consultation Service – 614-292-5766. Confidential, 24/7", "Contact details; labeled confidential, 24/7"),
        asr("p. 31", "Ohio’s public records law (Ohio Revised Code §149.43) generally does not permit the university to promise confidentiality to those who report crimes to anyone except counselors at the Counseling and Consultation Service or the Employee Assistance Program as provided by law", "Confidentiality under Ohio law"),
        resources("Main office: 4th floor of the Younkin Success Center at 1640 Neil Avenue.", "Location"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "counseling",
        confidentiality: "confidential",
        name: "Ohio State Employee Assistance Program (EAP)",
        description: "For Ohio State benefits-eligible faculty, staff and family members. Email eap@osumc.edu.",
        phone: "(800) 678-6265",
        url: "https://osuhealthplan.com/eap",
        hours: "24/7",
        available247: true,
        sortOrder: 1,
      },
      citations: [
        asr("p. 4", "Ohio State Employee Assistance Program (EAP) – (800) 678-6265. Confidential, 24/7", "Contact details; labeled confidential, 24/7"),
        resources("The Ohio State EAP, available 24/7/365 for Ohio State benefits-eligible faculty, staff, and family members", "Eligibility"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "counseling",
        confidentiality: "confidential",
        name: "Stress, Trauma and Resilience Program (STAR), Ohio State Wexner Medical Center",
        description:
          "Trauma-focused treatment for survivors and the people who support them; open to everyone. Choose option 1 for emergencies. Email STARTraumaRecoveryCenter@osumc.edu. Listed by the CRCO under \"Confidential Counseling\"; the ASR lists it without a confidentiality label.",
        phone: "614-293-STAR (7827)",
        url: "https://wexnermedical.osu.edu/mental-behavioral/stress-trauma-resilience",
        hours: null,
        available247: null,
        sortOrder: 2,
      },
      citations: [
        asr("p. 5", "Wexner Medical Center Stress, Trauma and Resilience (STAR) – 614-293-STAR (7827)", "Contact details"),
        resources("For information on the STAR Program, call 614-293-STAR (7827). Please choose option 1 for emergencies.", "Contact details"),
        resources("The following resources are available for individuals to discuss incidents and issues related to discrimination, harassment, and sexual misconduct on a confidential basis.", "Introduction to the page's Confidential Support section, under which STAR is listed (Confidential Counseling)"),
      ],
    },

    // -----------------------------------------------------------------------------------------------------------
    // Resources: medical
    // -----------------------------------------------------------------------------------------------------------
    {
      key: "student_resource",
      input: {
        category: "medical",
        confidentiality: "confidential",
        name: "Student Health Services (Wilce Student Health Center)",
        description:
          "Care for student survivors of sexual assault regardless of how long ago it occurred, including STI treatment and pregnancy care, and referral to the SHS embedded counselor; SHS exams do not include evidence collection. Within 96 hours of an assault, students are encouraged to seek a Sexual Assault Nurse Examiner (SANE) exam at the Ohio State Wexner Medical Center emergency department. Email shs@osu.edu.",
        phone: "614-292-4321",
        url: "https://shs.osu.edu/",
        hours: null,
        available247: null,
        sortOrder: 0,
      },
      citations: [
        asr("p. 4", "Wilce Student Health Center – 614-292-4321. Confidential", "Labeled confidential"),
        asr("p. 20", "The care received at SHS will be confidential."),
        asr("p. 19", "If the sexual assault occurred within the last 96 hours, the student is encouraged to seek care at the OSUWMC emergency department for a Sexual Assault Nurse Examiner (SANE) exam for evidence collection."),
        asr("p. 20", "If the student chooses to be seen at SHS, this exam does not include evidence collection"),
        asr("p. 20", "For information, call 614-292-4321, email shs@osu.edu, or visit shs.osu.edu.", "Contact details"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "medical",
        confidentiality: "unknown",
        name: "Ohio State Wexner Medical Center: University Hospital emergency department and Forensic Nursing Program",
        description:
          "SANE program at University Hospital, 410 West 10th Avenue, Columbus (East Hospital, 181 Taylor Avenue, also has one). The Forensic Nursing Program provides medical care, crisis intervention, emotional support and referrals for survivors of sexual assault and domestic violence, with a social worker and patient advocate available 24/7 if the patient wishes. Evidence collection is paid for by a fund in the Ohio Attorney General's office. The report notes that in cases of sexual assault or severe injuries the hospital will call the police, and the survivor can decide whether to speak with them.",
        phone: "614-293-8333",
        url: "https://wexnermedical.osu.edu/",
        hours: null,
        available247: null,
        sortOrder: 1,
      },
      citations: [
        asr("p. 5", "Wexner Medical Center 614-293-8333 emergency 614-293-8000 non-emergency", "Contact details"),
        asr("p. 21", "University Hospital – 410 West 10th Avenue, Columbus OH 43210", "SANE program location"),
        asr("p. 20", "Interaction with a social worker and volunteer patient advocate, if the patient desires (coverage 24/7)."),
        asr("p. 20", "The sexual assault evidence collection exam is paid for by a fund within the Ohio Attorney General’s office."),
        asr("p. 20", "In cases of sexual assault or severe injuries, the hospital will call the police. The survivor can decide to speak with the police at that time or officially report what has happened.", "Police notification"),
      ],
    },
  ],
};
