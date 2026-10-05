// Columbia University: institutional record.
//
// Transcribed 2026-10-05 by Claude from three official Columbia documents (see `sources`):
// - the 2026 Annual Security and Fire Safety Report (pp. 3, 8, 21–41; same document as research/columbia-university.ts);
// - the Title IX and Related Misconduct Policy and Procedures for Students, "Revised September 30, 2026"
//   (Office of Institutional Equity), pp. 1, 16–20, 26–27, 66 and Appendix A (pp. 69–70);
// - the Office of Institutional Equity's 2024–2025 Annual Report, pp. 16–20.
// Status after import: pending_review. A human must check each record against the cited page before verifying.
//
// Pages: "p. N" is the page number printed on the page; "PDF p. N" is the page in the PDF file
// (ASR: printed + 4; policy: printed + 3; OIE report: same). Every excerpt was checked by script against the
// PDF's text (PyMuPDF), ignoring line breaks; PDF text artifacts ("New Y ork", "h ealthcare") are corrected.
// The OIE report's findings chart (p. 19) is an image; its labels were read from renderings at two resolutions.
// Summaries are attributed to the document; they describe what Columbia says its process is, not an evaluation
// of how it works in practice.
//
// Not entered, and why:
// - Timeline entries (institution actions): none of these documents describes a dated institutional action
//   that belongs on the timeline. The policy's 2026 revision is recorded on the policy record.
// - Other campuses' contacts (Manhattanville, Medical Center, Lamont-Doherty, Nevis, Reid Hall), Barnard and
//   Teachers College contacts: the record follows the Morningside statistics. Lamont-Doherty and Nevis numbers
//   appear in the ASR but are not entered; note the ASR prints Nevis Public Safety as "914-591-28780" on p. 30
//   (one digit too many) and "914-591-2870" on pp. 3 and 6.
// - Nightline (peer listening): the ASR gives two different hours ("9:00 p.m. to 2:00 a.m.", p. 4;
//   "10:00 p.m.–3:00 a.m.", p. 30). Left out until a current source settles it.
// - Columbia Health Medical Services hours: the ASR lists 212-854-7426 with "(24/7 support)" (p. 30) while the
//   policy lists Mon–Thu 9:00 a.m.–4:30 p.m., Fri 8:00 a.m.–3:30 p.m. (p. 69). Both are quoted on the record and
//   `available247` is left blank.
// - Off-campus hotlines (Safe Horizon, NYC Domestic Violence Hotline): the sources do not say these specific
//   services are confidential, so confidentiality is "unknown".
// - Disability Services, Ombuds (CUIMC), CUIMC Mental Health Services and other listed services: Disability
//   Services is a confidential resource but not a sexual-violence service; CUIMC services are noted in
//   descriptions rather than entered separately.
// - Earlier Title IX annual reports and the Faculty and Staff policy: not reviewed for this record.
// - The policy web page (universitypolicies.columbia.edu) and the Sexual Respect and SVR web pages return 403 to
//   automated requests; the policy PDF itself downloaded directly.

import type { ResearchBundle } from "@/lib/admin/research-bundle";

const asr = (pinpoint: string, excerpt: string, claim?: string) => ({ source: "asr2026", pinpoint, excerpt, claim });
const policy = (pinpoint: string, excerpt: string, claim?: string) => ({ source: "policy2026", pinpoint, excerpt, claim });
const oie = (pinpoint: string, excerpt: string, claim?: string) => ({ source: "oie2025", pinpoint, excerpt, claim });

export const columbiaInstitutional: ResearchBundle = {
  college: { slug: "columbia-university" },
  sources: {
    // Same document as research/columbia-university.ts; the importer reuses the existing source by URL.
    asr2026: {
      type: "university",
      publisher: "Columbia University Department of Public Safety",
      title: "2026 Annual Security and Fire Safety Report",
      url: "https://publicsafety.columbia.edu/sites/publicsafety.columbia.edu/files/content/AnnualSecurityReport2026.pdf",
      archivedUrl:
        "https://web.archive.org/web/20261002040235/https://publicsafety.columbia.edu/sites/publicsafety.columbia.edu/files/content/AnnualSecurityReport2026.pdf",
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes:
        "Covers seven campuses with a separate statistics table for each. Morningside Campus statistics: p. 49 (PDF p. 53). Clery geography and campus descriptions: pp. 47–48. Page numbers are as printed; PDF page = printed page + 4.",
    },
    policy2026: {
      type: "university",
      publisher: "Columbia University Office of Institutional Equity",
      title: "Title IX and Related Misconduct Policy and Procedures for Students (2026)",
      url: "https://institutionalequity.columbia.edu/sites/institutionalequity.columbia.edu/files/content/Documents/Policies/TitleIX_and_Related_Misconduct_Policy_and_Procedures_for_Students.pdf",
      archivedUrl:
        "https://web.archive.org/web/20261004132438/https://institutionalequity.columbia.edu/sites/institutionalequity.columbia.edu/files/content/Documents/Policies/TitleIX_and_Related_Misconduct_Policy_and_Procedures_for_Students.pdf",
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes:
        "Marked \"Revised September 30, 2026\". Resources: pp. 16–17 and Appendix A (pp. 69–70). Reporting: pp. 17–20. Amnesty: pp. 26–27. Statistics and annual reporting: p. 66. PDF page = printed page + 3.",
    },
    oie2025: {
      type: "university",
      publisher: "Columbia University Office of Institutional Equity",
      title: "Office of Institutional Equity 2024–2025 Annual Report",
      url: "https://institutionalequity.columbia.edu/sites/institutionalequity.columbia.edu/files/content/Documents/AnnualReports/OIE/2024-2025_OIE_Annual_Report.pdf",
      archivedUrl:
        "https://web.archive.org/web/20260418223533/https://institutionalequity.columbia.edu/sites/institutionalequity.columbia.edu/files/content/Documents/AnnualReports/OIE/2024-2025_OIE_Annual_Report.pdf",
      publicationDate: "2025-12-02",
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes: "Student Title IX section: pp. 16–20 (cases, resolutions, formal investigation findings, sanctions). 2024–2025 academic year.",
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
          "According to the 2026 Annual Security Report and Columbia's Title IX and Related Misconduct Policy and Procedures for Students, reports of sexual assault, dating and domestic violence, stalking and related misconduct by students are handled by the Title IX Division of the Office of Institutional Equity, which administers the policy in partnership with the Title IX Coordinator. The report describes the Division as a neutral resource that refers students to resources, offers protections, and investigates and adjudicates or otherwise resolves reports. The policy states that the Office strives to complete the investigation and determination process within 120 business days of a Formal Complaint. Allegations against employees and third parties are handled under separate policies for faculty and staff.",
      },
      citations: [
        policy("p. 1 (PDF p. 4)", "This Policy is administered by the Office of Institutional Equity (“Office”) in partnership with the Title IX Coordinator."),
        asr(
          "p. 27 (PDF p. 31)",
          "The Office refers students to available resources, offers appropriate protections, and is responsible for investigating and adjudicating or otherwise resolving reports of Prohibited Conduct involving students, and coordinating the disciplinary process when necessary.",
        ),
        policy("p. 27 (PDF p. 30)", "The Office strives to complete the investigation and determination process within 120 business days after receiving a Formal Complaint of Prohibited Conduct."),
        asr(
          "p. 21 (PDF p. 25)",
          "allegations made against a Columbia University employee or third party are addressed under the University’s Anti-Discrimination and Discriminatory Harassment Policies and Procedures for Faculty and Staff",
        ),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "disciplinary_procedures",
        findingKind: "documented",
        summary:
          "According to the 2026 Annual Security Report, findings in student cases are made by a hearing panel using a preponderance-of-the-evidence standard. Sanctions available against students range from a reprimand or disciplinary warning to disciplinary suspension, expulsion, and revocation of a degree, and a permanent transcript notation is made in cases resulting in disciplinary suspension, expulsion, degree suspension, degree revocation, or withdrawal with disciplinary action pending. Each party may have one advisor of their choice, and on request the University provides a student party to a formal investigation with an attorney-advisor at no cost.",
      },
      citations: [
        asr(
          "pp. 31–32 (PDF pp. 35–36)",
          "Preponderance of the evidence means that a hearing panel must determine whether, based on the evidence presented, the Respondent was more likely than not to have engaged in the conduct at issue.",
        ),
        asr("p. 33 (PDF p. 37)", "The University may impose one or more of the following sanctions on a student determined to have violated the Policy:"),
        asr(
          "p. 33 (PDF p. 37)",
          "Upon conclusion of the appeal process, a permanent transcript notation will be indicated on the Respondent’s record for cases resulting in disciplinary suspension, expulsion, disciplinary degree suspension, degree revocation, or withdrawal with disciplinary action pending.",
        ),
        asr(
          "p. 31 (PDF p. 35)",
          "The University will provide, upon request by a student Party to a formal investigation, an attorney-advisor at no cost to the student from a predetermined pool of trained attorney-advisors.",
        ),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "law_enforcement_referrals",
        findingKind: "documented",
        summary:
          "According to the 2026 Annual Security Report, survivors may report dating violence, domestic violence, sexual assault, and stalking to the New York City Police Department or the local law enforcement agency where the incident occurred, and Public Safety personnel can assist and accompany them. The report states the University strongly encourages pressing criminal charges but respects the survivor's choice whether to report. The policy states the University does not require a complainant to report to law enforcement, and that a University investigation may be temporarily delayed while law enforcement gathers evidence, generally for no more than ten days.",
      },
      citations: [
        asr(
          "pp. 30–31 (PDF pp. 34–35)",
          "Survivors have the option to report dating violence, domestic violence, sexual assault, and stalking to the New York City Police Department or the local law enforcement agency where the incident occurred.",
        ),
        asr("p. 31 (PDF p. 35)", "Although the University strongly encourages pressing criminal charges, it respects the survivor’s choice in deciding to report or not report to law enforcement."),
        asr("p. 8 (PDF p. 12)", "The Department of Public Safety assists complainants and witnesses in filing reports with local police if the complainant elects to make such a report."),
        policy("p. 19 (PDF p. 22)", "The University does not require a Complainant to report misconduct to law enforcement"),
        policy("p. 20 (PDF p. 23)", "Temporary delays should not last more than ten (10) days except when law enforcement specifically requests and justifies a longer delay."),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "prevention_programs",
        findingKind: "documented",
        summary:
          "According to the 2026 Annual Security Report, all incoming students and new employees receive programming intended to prevent sexual assault, domestic violence, dating violence, and stalking. Listed programs include the New Student Orientation Program, bystander intervention and prevention programs, social media campaigns, the Sexual Respect and Community Citizenship Initiative, and Title IX training for student leaders and student athletes as required by New York State's \"Enough is Enough\" law. Columbia Health's bystander intervention model is Step UP!, and Sexual Violence Response runs prevention training and education programs.",
      },
      citations: [
        asr(
          "p. 39 (PDF p. 43)",
          "All incoming students and new employees are provided with programming and strategies intended to prevent rape, acquaintance rape, sexual assault, domestic violence, dating violence, and stalking before such conduct occurs through the changing of social norms and other approaches.",
        ),
        asr(
          "p. 40 (PDF p. 44)",
          "These programs include the New Student Orientation Program (NSOP), bystander intervention and prevention educational programs to disrupt gender- and power-based violence, social media campaigns, educational materials distributed throughout the campus, the Sexual Respect and Community Citizenship Initiative (SRI), and Title IX training for student leaders and student athletes as required by New York State’s “Enough is Enough” law.",
        ),
        asr(
          "p. 41 (PDF p. 45)",
          "Step UP! is Columbia Health’s Bystander Intervention model, which aims to equip our community with bystander intervention approaches for responding to harassment and other crimes.",
        ),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "reporting_procedures",
        findingKind: "documented",
        summary:
          "According to Columbia's Title IX and Related Misconduct Policy, reports can be made online, in person, by mail, email, or phone at any time, and all reports are forwarded to the Office of Institutional Equity for review; the University does not set a time limit for reporting. The 2026 Annual Security Report states that all employees must report incidents to the Office, while confidential resources such as counseling staff and Sexual Violence Response are not obligated to report except as aggregate, non-identifying data. Reports to Public Safety can be made anonymously. Students may request supportive accommodations even if no investigation takes place, and the policy grants amnesty from alcohol and drug policy violations to students who report in good faith.",
      },
      citations: [
        policy(
          "p. 17 (PDF p. 20)",
          "you can make a report online, in-person, by mail, email, or phone, twenty-four hours a day, seven days a week, using the contact information listed below.",
        ),
        policy("p. 17 (PDF p. 20)", "All reports will be automatically forwarded to the Office for review."),
        policy("p. 20 (PDF p. 23)", "Although the University does not limit the time for submitting a report"),
        asr("p. 28 (PDF p. 32)", "All employees are required to report the incident to the Office, either directly or through the appropriate Title IX Coordinator(s) or a designee."),
        asr(
          "p. 28 (PDF p. 32)",
          "Confidential resources, such as counseling staff, Disability Services staff, and staff from Sexual Violence Response, are not obligated to report disclosures of Prohibited Conduct except for aggregate statistical data that does not include individuals’ names or identifying information.",
        ),
        asr("p. 3 (PDF p. 7)", "It is possible to file a report while maintaining your anonymity."),
        asr(
          "p. 32 (PDF p. 36)",
          "Students may request supportive accommodations even in cases where an investigation is not undertaken or either Party has declined to participate in the University disciplinary process.",
        ),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "outcome_information",
        findingKind: "documented",
        summary:
          "According to the Office of Institutional Equity's 2024–2025 Annual Report, the Student Title IX Division reviewed 803 incident reports in the 2024–2025 academic year, which led to 471 cases containing 510 allegations. The report states that 82% of respondent case files were administratively closed, most commonly because the complainant did not respond to outreach (235), the respondent was unknown (182), or the complaint did not meet the definition of a policy violation (42). Eight cases reported in earlier years were resolved through a formal investigation after July 1, 2024; a chart in the report shows 4 findings of responsible and 4 of not responsible. Cases resolved through a formal investigation took a median of 393 days. The report lists expulsion and disciplinary suspension among the sanctions imposed in cases resolved between July 1, 2024 and June 30, 2025, without giving counts.",
      },
      citations: [
        oie("p. 16", "The Student Title IX Division reviewed a total of 803 incident reports in the 2024-2025 academic year."),
        oie("p. 16", "These incident reports led to 471 cases managed by the Student Title IX Division in partnership with Case Management. These 471 cases included a total of 510 allegations"),
        oie("p. 18", "A majority of Respondent case files, 82%, were administratively closed."),
        oie("p. 18", "The Complainant was unresponsive to outreach (235);"),
        oie("p. 19", "Since July 1, 2024, an additional 8 cases reported in prior academic years have been resolved through a Formal Investigation.", "Eight formal investigations resolved; findings shown in the chart \"Investigation & Hearing Panel Findings\" (4 Responsible, 4 Not Responsible)"),
        oie("p. 19", "By contrast, cases resolved through a Formal Investigation take a median of 393 days to resolve."),
        oie("p. 20", "Amongst the cases resolved between July 1, 2024, and June 30, 2025, the following sanctions or disciplinary measures were imposed:"),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "transparency_practices",
        findingKind: "documented",
        summary:
          "According to Columbia's Title IX and Related Misconduct Policy, the University reports aggregate information to the University community each year on reported incidents and the results of student disciplinary proceedings, without identifying individual students; the Office of Institutional Equity's 2024–2025 Annual Report is one such report. The policy notes that Columbia, Barnard College, and Teachers College report Clery Act statistics separately. The 2026 Annual Security Report states that Public Safety never includes a complainant's identifying information in the Crime Log.",
      },
      citations: [
        policy(
          "p. 66 (PDF p. 69)",
          "Additionally, the University annually reports aggregate information to the University community concerning reported incidents of Prohibited Conduct and the results of student disciplinary proceedings. Such disclosures and reports do not contain information identifying individual student participants.",
        ),
        policy("p. 66 (PDF p. 69)", "For purposes of the Clery Act, Columbia University, Barnard College, and Teachers College separately report Clery data."),
        asr("p. 8 (PDF p. 12)", "Public Safety will never include any complainant’s identifiable information in the Crime Log."),
      ],
    },

    // -----------------------------------------------------------------------------------------------------------
    // Policies
    // -----------------------------------------------------------------------------------------------------------
    {
      key: "policy",
      input: {
        policyType: "title_ix",
        title: "Title IX and Related Misconduct Policy and Procedures for Students",
        summary:
          "Columbia's policy for sexual harassment, sexual assault, dating and domestic violence, stalking, sexual exploitation, and retaliation where the respondent is a Columbia University or Teachers College student. It covers both Title IX Sexual Harassment as defined by federal regulation and \"Related Misconduct\" outside that definition, and is administered by the Office of Institutional Equity. The 2026–2027 version is marked \"Revised September 30, 2026\" and applies to misconduct allegedly occurring on or after that date; earlier misconduct is judged under the definitions in place at the time. Allegations against employees and third parties fall under the Anti-Discrimination and Discriminatory Harassment Policies and Procedures for Faculty and Staff.",
        effectiveDate: "2026-09-30",
      },
      citations: [
        policy("p. 1 (PDF p. 4)", "This Policy applies to misconduct allegedly occurring on or after September 30, 2026.", "Applies from September 30, 2026"),
        policy("contents, PDF p. 3", "Revised September 30, 2026", "Revision date"),
        asr(
          "p. 21 (PDF p. 25)",
          "The Policy governs Title IX Sexual Harassment and Related Misconduct when the accused person (the Respondent) is a Columbia University or Teachers College student at the time a report is made",
          "Scope",
        ),
      ],
    },
    {
      key: "policy",
      input: {
        policyType: "amnesty",
        title: "Amnesty Policy for Students: Related Alcohol and Drug Violations",
        summary:
          "Part of the Title IX and Related Misconduct Policy. Students, including complainants, respondents, witnesses, and bystanders, who report Prohibited Conduct in good faith to a University employee or law enforcement are not disciplined by the University for alcohol or drug policy violations at or near the time of the incident. It does not apply to anyone who used alcohol or drugs as a weapon or to facilitate an assault.",
        effectiveDate: null,
      },
      citations: [
        policy(
          "p. 26 (PDF p. 29)",
          "Students (including Complainants, Respondents, witnesses, and bystanders) acting in good faith who disclose any incident of Prohibited Conduct to a University employee or law enforcement will not be subject to subsequent disciplinary action by the University for violations of alcohol and/or drug use policies",
        ),
        policy("p. 27 (PDF p. 30)", "This does not apply to those who use alcohol or drugs as a weapon or to facilitate an assault."),
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
        name: "Title IX Coordinator, Office of Institutional Equity",
        description:
          "80 Claremont Avenue, 4th Floor. Email titleix@columbia.edu. Reports can also be made online through the Sexual Respect or Office of Institutional Equity websites. The policy describes the Title IX Coordinator as non-confidential but private: information is shared only on a need-to-know basis.",
        phone: "212-853-1276",
        url: "https://institutionalequity.columbia.edu/",
        hours: null,
        available247: null,
        sortOrder: 0,
      },
      citations: [
        asr("p. 28 (PDF p. 32)", "Title IX Coordinator 80 Claremont Ave, 4th Floor New York, NY 10027 212-853-1276 titleix@columbia.edu", "Contact details"),
        asr("p. 28 (PDF p. 32)", "https://institutionalequity.columbia.edu/", "Website"),
        policy(
          "p. 17 (PDF p. 20)",
          "Other resources are required by the University to provide information about Prohibited Conduct to the Office, but will protect privacy to the greatest extent possible and share information only on a need-to-know basis",
          "Non-confidential but private",
        ),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "campus_police",
        confidentiality: "institutional_reporting",
        name: "Columbia University Department of Public Safety (Morningside)",
        description:
          "111 Low Library, 535 West 116th Street. In an emergency, call 911 first, then Public Safety. Non-emergency line 212-854-2797; Manhattanville 212-853-3333 (24/7); Medical Center 212-305-7979 (24/7). Reports can also be made through the Lion Safe app or an emergency call box.",
        phone: "212-854-5555",
        url: "https://publicsafety.columbia.edu",
        hours: "24/7",
        available247: true,
        sortOrder: 0,
      },
      citations: [
        asr("p. 3 (PDF p. 7)", "Tel: 212-854-5555 (24/7)", "Contact details"),
        asr("p. 3 (PDF p. 7)", "If you find yourself in an emergency, first contact the police by dialing 911 and then report the incident to Public Safety.", "Emergency procedure"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "local_law_enforcement",
        confidentiality: "institutional_reporting",
        name: "NYPD Special Victims Unit",
        description: "New York City Police Department. For emergencies, call 911.",
        phone: "646-610-7272",
        url: null,
        hours: "24 hours",
        available247: true,
        sortOrder: 0,
      },
      citations: [asr("p. 31 (PDF p. 35)", "NYPD Special Victims Unit, 646-610-7272 (24 Hours)", "Contact details")],
    },
    {
      key: "student_resource",
      input: {
        category: "local_law_enforcement",
        confidentiality: "institutional_reporting",
        name: "New York County District Attorney's Office Sex Crimes Hotline",
        description: "Manhattan District Attorney's Office.",
        phone: "212-335-9373",
        url: null,
        hours: null,
        available247: null,
        sortOrder: 1,
      },
      citations: [asr("p. 31 (PDF p. 35)", "Sex Crimes Hotline, 212-335-9373", "Contact details")],
    },
    {
      key: "student_resource",
      input: {
        category: "local_law_enforcement",
        confidentiality: "institutional_reporting",
        name: "New York State Campus Sexual Assault Victims Unit",
        description: "New York State Police unit for campus sexual assault.",
        phone: "1-844-845-7269",
        url: "https://troopers.ny.gov/campus-sexual-assault-victims-unit",
        hours: null,
        available247: null,
        sortOrder: 2,
      },
      citations: [
        asr("p. 31 (PDF p. 35)", "New York State Campus Sexual Assault Victims Unit (https://troopers.ny.gov/campus-sexual-assault-victims-unit)", "Website"),
        policy("p. 70 (PDF p. 73)", "New York Campus Sexual Assault Victims Unit Hotline 1-844-845-7269", "Phone"),
      ],
    },

    // -----------------------------------------------------------------------------------------------------------
    // Resources: confidential (as listed in the policy, p. 16, and the ASR, pp. 28–30, 40)
    // -----------------------------------------------------------------------------------------------------------
    {
      key: "student_resource",
      input: {
        category: "victim_advocacy",
        confidentiality: "confidential",
        name: "Sexual Violence Response & Rape Crisis/Anti-Violence Support Center (SVR)",
        description:
          "A department of Columbia Health and a New York State Department of Health certified rape crisis center. Trained advocates can accompany students to an emergency department, the police, or court, and explain resources and reporting options. Morningside: Alfred Lerner Hall, Suite 700; CUIMC: 60 Haven Ave, Bard Hall, Suite 206.",
        phone: "212-854-HELP (4357)",
        url: "https://health.columbia.edu/svr",
        hours: "24/7, year-round",
        available247: true,
        sortOrder: 0,
      },
      citations: [
        asr(
          "p. 40 (PDF p. 44)",
          "Sexual Violence Response (SVR), a department of Columbia Health, provides trauma-informed, confidential (New York Civil Practice Law 4510) support and prevention programs focused on ending gender- and power-based violence.",
          "Confidentiality",
        ),
        asr("p. 29 (PDF p. 33)", "Sexual Violence Response provides 24/7 year-round advocacy.", "24/7 availability"),
        asr("p. 29 (PDF p. 33)", "To reach an advocate, you may call 212-854-HELP (4357).", "Phone"),
        asr("p. 40 (PDF p. 44)", "SVR is a New York State Department of Health (NYS-DOH) certified rape crisis center and has maintained this status since 1998.", "Certification"),
        asr("p. 40 (PDF p. 44)", "For more information, please visit https://health.columbia.edu/svr.", "Website"),
        policy("p. 69 (PDF p. 72)", "Morningside: Alfred Lerner Hall, Suite 700", "Location"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "counseling",
        confidentiality: "confidential",
        name: "Counseling and Psychological Services (Morningside/Manhattanville)",
        description:
          "Counseling, consultations, and crisis intervention. Morningside: Alfred Lerner Hall, 5th and 8th Floors. At CUIMC, Mental Health Services: 212-305-3400.",
        phone: "212-854-2878",
        url: "https://health.columbia.edu/content/individual-counseling",
        hours: "24/7 support",
        available247: true,
        sortOrder: 0,
      },
      citations: [
        asr(
          "p. 30 (PDF p. 34)",
          "Counseling and Psychological Services supports the psychological and emotional well-being of the campus community by providing counseling, consultations, and crisis interventions—all of which adhere to strict standards of confidentiality.",
          "Confidentiality",
        ),
        asr("p. 30 (PDF p. 34)", "Columbia Morningside/Manhattanville, 212-854-2878 (24/7 support)", "Phone and availability"),
        asr("p. 39 (PDF p. 43)", "Visit its website at https://health.columbia.edu/content/individual-counseling.", "Website"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "medical",
        confidentiality: "confidential",
        name: "Columbia Health Medical Services (Morningside)",
        description:
          "John Jay Hall, 4th Floor. Can treat injuries, provide emergency contraception and testing, and help preserve evidence, including finding a Sexual Assault Nurse Examiner. At CUIMC: 100 Haven Ave, Tower 2, 2nd Floor, 212-305-3400. The ASR lists this number with \"(24/7 support)\" (p. 30); the policy lists the hours shown here.",
        phone: "212-854-7426",
        url: null,
        hours: "Mon–Thu 9:00 a.m.–4:30 p.m.; Fri 8:00 a.m.–3:30 p.m. (per the policy)",
        available247: null,
        sortOrder: 0,
      },
      citations: [
        policy("p. 69 (PDF p. 72)", "Morningside: John Jay, 4th Floor | 212-854-7426 Mon – Thu 9:00 a.m. – 4:30 p.m. | Fri 8:00 a.m. – 3:30 p.m.", "Contact details and hours"),
        asr("p. 30 (PDF p. 34)", "Morningside/Manhattanville, 212-854-7426 (24/7 support)", "Phone as listed in the ASR"),
        asr("p. 30 (PDF p. 34)", "All Columbia Health units/offices are confidential resources for students.", "Confidentiality"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "counseling",
        confidentiality: "confidential",
        name: "Office of the University Chaplain",
        description: "Ordained clergy. W710 Lerner Hall. The policy lists University Chaplains as a confidential resource with no reporting obligation unless acting in another role.",
        phone: "212-854-1493",
        url: null,
        hours: null,
        available247: null,
        sortOrder: 1,
      },
      citations: [
        policy("p. 69 (PDF p. 72)", "Office of the University Chaplain: (Ordained Clergy) W710 Lerner Hall | 212-854-1493", "Contact details"),
        policy(
          "p. 16 (PDF p. 19)",
          "Confidential resources on campus include Sexual Violence Response, University Chaplains, Counseling and Psychological Services (Morningside), Mental Health Services (CUIMC), Disability Services, the Ombuds Office, and healthcare providers.",
          "Confidential resource",
        ),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "confidential",
        confidentiality: "confidential",
        name: "Ombuds Office (Morningside)",
        description: "660 Schermerhorn Ext. CUIMC office: 154 Haven Ave, Room 412, 212-304-7026.",
        phone: "212-854-1234",
        url: null,
        hours: null,
        available247: null,
        sortOrder: 0,
      },
      citations: [
        policy("p. 69 (PDF p. 72)", "Morningside: 660 Schermerhorn Ext. | 212-854-1234", "Contact details"),
        policy(
          "p. 16 (PDF p. 19)",
          "Confidential resources on campus include Sexual Violence Response, University Chaplains, Counseling and Psychological Services (Morningside), Mental Health Services (CUIMC), Disability Services, the Ombuds Office, and healthcare providers.",
          "Confidential resource",
        ),
      ],
    },

    // -----------------------------------------------------------------------------------------------------------
    // Resources: off-campus hotlines (confidentiality not stated for these specific services)
    // -----------------------------------------------------------------------------------------------------------
    {
      key: "student_resource",
      input: {
        category: "victim_advocacy",
        confidentiality: "unknown",
        name: "Safe Horizon Rape, Sexual Assault & Incest Hotline",
        description: "Off-campus hotline listed in the Annual Security Report.",
        phone: "212-227-3000",
        url: null,
        hours: "24/7",
        available247: true,
        sortOrder: 1,
      },
      citations: [asr("p. 30 (PDF p. 34)", "Safe Horizon’s Rape, Sexual Assault & Incest Hotline, 212-227-3000 (24/7 support)", "Contact details")],
    },
    {
      key: "student_resource",
      input: {
        category: "victim_advocacy",
        confidentiality: "unknown",
        name: "NYC Domestic Violence Hotline",
        description: "Off-campus hotline listed in the Annual Security Report.",
        phone: "1-800-621-HOPE (4673)",
        url: null,
        hours: "24 hours",
        available247: true,
        sortOrder: 2,
      },
      citations: [asr("p. 30 (PDF p. 34)", "NYC Domestic Violence Hotline, (24-HOUR NUMBER) 1-800-621-HOPE (4673)", "Contact details")],
    },
  ],
};
