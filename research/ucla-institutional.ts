// University of California, Los Angeles: institutional record.
//
// Transcribed 2026-10-05 by Claude from these official sources (see `sources`):
// - UCLA's 2026 Annual Security & Fire Safety Report (pp. 6, 11, 56–92; same document as research/ucla.ts);
// - the University of California's systemwide Interim Policy on Sexual Violence and Sexual Harassment (SVSH),
//   issued 12/22/2025, effective 1/1/2026 (UC Office of the President), pp. 1, 7, 10–11, 14, 23;
// - pages of the UCLA Title IX Office website (sexualharassment.ucla.edu): home, Filing a Report, Confidential
//   and Non-Confidential Resources, Contact Us, Reporting Statistics;
// - the UCLA CARE Program home page (careprogram.ucla.edu);
// - the UCLA Title IX Office's data report for July 2019–June 2020, linked from the Reporting Statistics page.
// Status after import: pending_review. A human must check each record against the cited page before verifying.
//
// The UC SVSH Policy is a systemwide policy that applies at every UC campus (p. 1, Scope); UCLA's campus
// procedures are taken from the ASR, which summarises them, and from the Title IX Office's pages.
//
// Pages: ASR and SVSH Policy pages are as printed, which equal the PDF page numbers in both documents. The
// 2019–2020 Title IX data report starts at printed "Page 4" (PDF p. 1), so printed = PDF + 3. Every PDF excerpt was
// checked by script against the PDF's text (PyMuPDF), ignoring line breaks and bullet characters; every web-page
// excerpt was checked against the page's text as downloaded on 2026-10-05. The two pie-chart figures in the
// 2019–2020 report were also checked against renderings of those pages. URLs printed without a scheme
// ("www.…") are given with "https://" added, except where a source printed "http://".
//
// Contact details that differ between sources (recorded here so a human can settle them):
// - Title IX Office phone: (310) 206-3417 on the Title IX website and in the ASR (pp. 3, 65, 66); the ASR also gives
//   (310) 825-7102, the Civil Rights Office number, for making a Title IX report (pp. 62, 72, 84). Both are on the
//   record. Email: titleix@equity.ucla.edu (Contact Us page), titleix@ucla.edu (Filing a Report page),
//   civilrights@ucla.edu (ASR p. 72). The Contact Us address is used.
// - CARE: the CARE and Title IX websites give 330 De Neve Dr., 205 Covel Commons; the ASR gives that address on
//   p. 62 but "A223 Murphy Hall" in its resource table (p. 71). The websites' address is used. CARE email:
//   advocate@careprogram.ucla.edu (CARE page; ASR p. 62), care@careprogram.ucla.edu (ASR p. 71),
//   CAREadvocate@careprogram.ucla.edu (Title IX resources page). The CARE page's address is used.
// - Rape Treatment Center phone: (424) 259-7208 in the ASR (pp. 62, 63, 73) and on the CARE page; the Title IX
//   resources page gives 424-259-6000. The ASR/CARE number is used and the other noted on the record.
//
// Confidentiality: marked "confidential" only where a cited source says so: CARE, CAPS and the Staff and Faculty
// Counseling Center (ASR p. 69); the Ombuds Office (SVSH Policy p. 7; Title IX resources page); Student Legal
// Services (ASR p. 71; Title IX resources page); the Rape Treatment Center (listed under "CONFIDENTIAL RESOURCES FOR
// STUDENTS" on the Title IX resources page); RAINN (ASR p. 73). The Title IX Office says it is "a non-confidential
// reporting office". The Arthur Ashe Student Health & Wellness Center is "unknown": the SVSH Policy (p. 7) lists
// licensed professionals "including health center employees" as Confidential Resources, but no source reviewed
// names the Ashe Center itself as confidential.
//
// Not entered, and why:
// - Timeline entries (institution actions): none of these sources describes a dated institutional action within
//   scope. The January 1, 2026 policy changes are described on the policy record and in the ASR summaries.
// - Outcome figures after June 2020: the Title IX Reporting Statistics page links data for fiscal years 2015–2016
//   through 2020–2021 only. The 2020–2021 link (a Box folder) returned no file on 2026-10-05, so the 2019–2020 report
//   is the most recent one read; equity.ucla.edu/public_accountability/ returned HTTP 404. No later UCLA or UC
//   systemwide Title IX outcome report was located on the Title IX site, the UC Systemwide Title IX Office site
//   (ucop.edu/title-ix, Overview and Systemwide Resources pages) or in the ASR. The outcome record says so.
// - Staff and Faculty Counseling Center, Respondent Support Services, Dashew Center, Economic Crisis Response Team
//   and the other services in the ASR's table (pp. 71–74): not sexual-violence victim services for students, or
//   (Respondent Services) for respondents; a human may add them. Respondent Services' phone also differs between
//   sources ((310) 825-3871 in the ASR p. 73; (310) 206-5575 on the Title IX resources page).
// - Legal Aid Foundation of Los Angeles, USCIS, Federal Student Aid, LA City Human Relations Commission: listed in
//   the ASR (pp. 73–74) but not sexual-violence crisis services.
// - Student-conduct procedures for non-SVSH matters and employee procedures: outside this record's focus.

import type { ResearchBundle } from "@/lib/admin/research-bundle";

const asr = (pinpoint: string, excerpt: string, claim?: string) => ({ source: "asr2026", pinpoint, excerpt, claim });
const svsh = (pinpoint: string, excerpt: string, claim?: string) => ({ source: "svshPolicy", pinpoint, excerpt, claim });

export const uclaInstitutional: ResearchBundle = {
  college: { slug: "ucla" },
  sources: {
    // Same document as research/ucla.ts; the importer reuses the existing source by URL.
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
        "One combined statistics table for the Westwood campus: p. 162. Sexual violence prevention: pp. 56–60. Reporting and responding to sexual assault and VAWA offenses: pp. 60–70. SVSH resource list: pp. 70–74. Title IX reporting, investigation and resolution: pp. 75–92. Printed page numbers equal PDF page numbers.",
    },
    svshPolicy: {
      type: "university",
      publisher: "University of California Office of the President",
      title: "Sexual Violence and Sexual Harassment (Interim Policy)",
      url: "https://policy.ucop.edu/doc/4000385/SVSH",
      archivedUrl: "https://web.archive.org/web/20261003060851/https://policy.ucop.edu/doc/4000385/SVSH",
      publicationDate: "2025-12-22",
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes:
        "UC systemwide policy; applies at all UC campuses. Issuance date 12/22/2025, effective date 1/1/2026; revision history (p. 30) lists a further FAQ update on August 24, 2026. Definitions and Confidential Resources: pp. 2–8. Amnesty: pp. 10–11. Reporting: p. 14. Campus responsibilities: pp. 22–24. Printed page numbers equal PDF page numbers.",
      internalNotes:
        "Downloaded with curl on 2026-10-05 from the URL above (the server sets a cookie and redirects to itself; served application/pdf). 43 pages. SHA-256: f0025bb51e961d5be960052272e6485b4ff12246a28bc75a5de7891522b015a8. The Wayback snapshot of 2026-10-03 was also downloaded and is byte-identical. UCLA's Title IX site links a copy labelled \"SVSH Policy (August 24, 2026)\" (https://sexualharassment.ucla.edu/media/96, SHA-256 df91e17cef45839014ea9da1ba97c52a359bde3d78681b297362d94b6b37fa4f); its text was compared and differs only in pages 19–30 layout (the same FAQ and revision-history text). publicationDate is the issuance date printed on p. 1.",
    },
    titleIxHome: {
      type: "university",
      publisher: "UCLA Title IX Office",
      title: "Welcome to the Title IX Civil Rights Office",
      url: "https://sexualharassment.ucla.edu/",
      archivedUrl: "https://web.archive.org/web/20260923040226/https://sexualharassment.ucla.edu/",
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes: "Title IX Office home page: SHAPE training requirement, confidential resources summary, office contact details.",
      internalNotes: "Read live with curl on 2026-10-05. The Wayback capture of 2026-09-23 contains the same SHAPE-hold and CARE crisis-line text.",
    },
    titleIxFiling: {
      type: "university",
      publisher: "UCLA Title IX Office",
      title: "Filing a Report",
      url: "https://sexualharassment.ucla.edu/reporting/filing-a-report",
      archivedUrl: "https://web.archive.org/web/20260921045452/https://sexualharassment.ucla.edu/reporting/filing-a-report",
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes: "Reporting options (Title IX Office, UCPD), timeline to report, responsible employees, retaliation.",
      internalNotes: "Read live with curl on 2026-10-05; the Wayback capture of 2026-09-21 shows the same contact details and \"NO timeline\" text.",
    },
    titleIxResources: {
      type: "university",
      publisher: "UCLA Title IX Office",
      title: "Confidential and Non-Confidential Resources",
      url: "https://sexualharassment.ucla.edu/resources/confidential-resources",
      archivedUrl: null,
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes: "Lists confidential resources for students and for faculty and staff, Respondent Support Services, UCPD and non-confidential support services.",
      internalNotes: "Read live with curl on 2026-10-05. No Wayback capture existed at the time.",
    },
    titleIxContact: {
      type: "university",
      publisher: "UCLA Title IX Office",
      title: "Contact Us",
      url: "https://sexualharassment.ucla.edu/contact-us",
      archivedUrl: "https://web.archive.org/web/20260921045009/https://sexualharassment.ucla.edu/contact-us",
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes: "Title IX Office address, phone and email.",
      internalNotes: "Read live with curl on 2026-10-05; the Wayback capture of 2026-09-21 shows the same phone and email.",
    },
    titleIxStatistics: {
      type: "university",
      publisher: "UCLA Title IX Office",
      title: "Reporting Statistics",
      url: "https://sexualharassment.ucla.edu/reporting-statistics",
      archivedUrl: "https://web.archive.org/web/20260921045006/https://sexualharassment.ucla.edu/reporting-statistics",
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes: "Links Title IX data for fiscal years 2015–2016 through 2020–2021.",
      internalNotes:
        "Read live with curl on 2026-10-05; the Wayback capture of 2026-09-21 lists the same fiscal years. The page's \"Public Accountability Report\" link (https://equity.ucla.edu/public_accountability/) returned HTTP 404 on 2026-10-05. The 2020–2021 link (https://ucla.app.box.com/s/eyri3lej5htfl7uwkv7huhp9o8y3revo) returned a Box page with no file.",
    },
    titleIxData2020: {
      type: "university",
      publisher: "UCLA Title IX Office",
      title: "Title IX Office data, July 2019–June 2020 (extract from UCLA Equity, Diversity and Inclusion Public Accountability Report)",
      url: "https://sexualharassment.ucla.edu/file/f49b1f79-6c40-46ee-b13d-b3330543350f",
      archivedUrl: null,
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes: "Six-page extract (printed pp. 4–9) linked as \"2019-2020\" from the Title IX Reporting Statistics page. Reports received: p. 4; initial assessment outcomes: p. 5; formal investigations: pp. 6–9.",
      internalNotes:
        "Downloaded with curl on 2026-10-05. 6 pages; printed page = PDF page + 3. SHA-256: 5ef9e8d030c025da34110b1b32b8f5396d141f49f93c8e1d629b3351a7b20e33. PDF metadata title \"Microsoft Word - Draft Public Accountability Report 6.0 - FINAL for Website .docx\", created 2021-09-21; publication date not printed. No Wayback capture. The footer reads \"UCLA Equity, Diversity and Inclusion\".",
    },
    careHome: {
      type: "university",
      publisher: "UCLA CARE Program",
      title: "Providing a safe place for survivors of sexual violence to get confidential support",
      url: "https://careprogram.ucla.edu/",
      archivedUrl: null,
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes: "CARE Program home page: how to reach an advocate, office hours, emergency contacts, address.",
      internalNotes: "Read live with curl on 2026-10-05 (www.careprogram.ucla.edu redirects here). No Wayback capture existed at the time.",
    },
  },
  reports: [],

  records: [
    // -----------------------------------------------------------------------------------------------------------
    // Institutional responses
    // -----------------------------------------------------------------------------------------------------------
    {
      key: "institutional_response",
      input: {
        topic: "title_ix_process",
        findingKind: "documented",
        summary:
          "According to UCLA's 2026 Annual Security Report, reports of sexual violence, relationship violence and stalking are handled by the Title IX Office under the University of California's systemwide Sexual Violence and Sexual Harassment (SVSH) Policy. After a report, the office sends the complainant written rights and options, refers them to the CARE advocacy office, and makes an initial assessment; responses may include administrative closure, an informal conversation, Alternative Resolution, a Formal Investigation, or an Other Inquiry. The report states that investigations are typically completed within 60 to 90 business days, which may be extended for good cause, and that Alternative Resolution is not available when the complainant is a student or patient and the respondent is an employee. From January 1, 2026, the Title IX Officer updates the parties on an investigation's status on request and every 30 business days.",
      },
      citations: [
        asr("p. 68", "Title IX sends an outreach email to the complainant, including written rights and options."),
        asr("p. 68", "Title IX sends a referral to the CARE Office on behalf of the Complainant."),
        asr(
          "p. 62",
          "After receiving a report, the Title IX Office will make an initial assessment, including a limited inquiry when appropriate, to determine how to proceed. Title IX responses may include: Administrative Closure, Informal Conversation, Alternative Resolution, Formal Investigation, or Other Inquiry.",
        ),
        asr("p. 79", "The Title IX Officer will complete the investigation promptly, typically within 60 to 90 business days of notifying the parties in writing of the charges."),
        asr("p. 77", "Alternative Resolution is not available when the Complainant is a student or patient and the Respondent is an employee."),
        asr(
          "p. 79",
          "Effective January 1, 2026, the Title IX Officer will update parties on the status of the investigation at the request of a Complainant or a Respondent and every 30 business days until the outcome of the complaint",
        ),
        svsh(
          "p. 1",
          "The Policy applies at all University campuses, the Lawrence Berkeley National Laboratory, Medical Centers, the Office of the President, Agriculture and Natural Resources, and to all University programs and activities.",
          "The UC SVSH Policy applies at UCLA",
        ),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "disciplinary_procedures",
        findingKind: "documented",
        summary:
          "According to the 2026 Annual Security Report, the Title IX investigator decides whether the SVSH Policy was violated using a preponderance-of-the-evidence standard; when the respondent is a student the determination is preliminary. The Office of Student Conduct proposes a sanction whenever a violation is preliminarily found, and if either party contests the preliminary determination within 20 business days a fact-finding hearing is held; a respondent facing proposed suspension or dismissal is presumed to contest. Sanctions range from censure or warning to suspension and dismissal (expulsion) from the University of California, with minimum sanctions: for example, a minimum two-year suspension for sexual assault involving penetration, domestic or dating violence, or stalking unless there are exceptional circumstances. Both parties may have an advisor throughout the process and may appeal on stated grounds.",
      },
      citations: [
        asr(
          "p. 82",
          "In determining whether the University of California Sexual Violence and Sexual Harassment Policy was violated, the Title IX Officer or designee will apply the preponderance of evidence standard.",
        ),
        asr("p. 82", "and any time the Respondent is a student, the determination is only preliminary."),
        asr("p. 85", "The Office of Student Conduct will propose a sanction in all cases where there is a preliminary determination that the policy was violated."),
        asr(
          "p. 85",
          "If either party contests the investigator’s preliminary determinations whether the policy was violated within 20 business days of the notice of the investigative findings and preliminary determination, there will be a factfinding hearing",
        ),
        asr("p. 85", "In cases where Student Conduct proposes suspension or dismissal as a sanction, the Respondent is presumed to contest"),
        asr("p. 92", "Dismissal (Expulsion) from the University of California;", "Range of sanctions"),
        asr(
          "p. 92",
          "Sexual Assault – Penetration, Domestic or Dating Violence, or Stalking will result in a minimum sanction of suspension for two calendar years unless there are exceptional circumstances.",
        ),
        asr("p. 80", "The Complainant and Respondent may have an advisor present throughout the process, including when they are interviewed and at meetings."),
        asr("p. 69", "Either Party may appeal on the following grounds:"),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "law_enforcement_referrals",
        findingKind: "documented",
        summary:
          "According to the 2026 Annual Security Report, survivors may report to the UCLA Police Department or, for incidents off university property, to the local law enforcement agency, but whether to make a police report is the victim's choice; Title IX and CARE staff can help notify police if the victim wishes. UCLA PD provides free transportation to the Santa Monica-UCLA Rape Treatment Center for medical treatment and evidence collection, and the report notes that in California evidence may be collected without a police report. UCLA PD may conduct joint interviews with Title IX to avoid repeated interviews. When police are also investigating, the Title IX Officer coordinates with them but does not wait for the criminal investigation to end.",
      },
      citations: [
        asr(
          "p. 61",
          "Please note that it is the victim’s choice whether or not to make a formal report to law enforcement, and victims have the right to decline to notify law enforcement involvement.",
        ),
        asr("p. 61", "University officials within Title IX and CARE can assist individuals in notifying law enforcement, if desired."),
        asr("p. 61", "UCLA PD will provide free transportation to Rape Treatment Center emergency medical treatment and evidence collection."),
        asr("p. 61", "In California, evidence may be collected even if you chose not to make a report to law enforcement."),
        asr("p. 64", "UCLA PD may also coordinate with Title IX to conduct joint interviews, in order to avoid multiple interviews."),
        asr(
          "p. 80",
          "If the police are also investigating the alleged conduct, the Title IX Officer will coordinate with the police but must nonetheless act promptly without delaying the investigation until the end of the criminal investigation.",
        ),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "prevention_programs",
        findingKind: "documented",
        summary:
          "According to the 2026 Annual Security Report, all new undergraduate, graduate and professional students must complete online prevention training on relationship violence, stalking and sexual assault, and for 2025–2026 all students were required to complete the UC systemwide SHAPE training. The UCLA Title IX Office states that students who miss the SHAPE deadline receive a hold on their student account. The report also describes workshops by the CARE program and the Office of Residential Life, sexual assault prevention workshops that the Office of Fraternity and Sorority Life ran with the Rape Treatment Center for 3,900 fraternity and sorority members, and UCLA PD crime-prevention training on sexual assault, domestic violence and stalking.",
      },
      citations: [
        asr(
          "p. 56",
          "All new students (undergraduate, graduate and professional) are required to complete an online prevention education training to prevent relationship violence, stalking, sexual assault and other Title IX prohibited conduct.",
        ),
        asr(
          "pp. 57–58",
          "For the 2025-2026 academic year, all UCLA undergraduate and graduate students will be required to complete SHAPE (Sexual Violence and Harassment, Anti-Discrimination, Prevention and Education) training.",
        ),
        {
          source: "titleIxHome",
          pinpoint: "SHAPE training section",
          excerpt: "Failure to complete the SHAPE Training by the REQUIRED DUE DATE will result in a Title IX Hold being placed on your student account.",
        },
        asr(
          "p. 58",
          "CARE (Campus Assault Resources & Education) offers an array of workshops and trainings to provide a pro-active preventive educational approach to sexual violence for the UCLA community.",
        ),
        asr(
          "p. 59",
          "the Office of Fraternity and Sorority Life (OFSL) partnered with the Rape Treatment Center to provide sexual assault prevention workshops for 3900 Greek students, with a 98% completion rate.",
        ),
        asr("p. 59", "The UCLA PD Crime Prevention Unit also offers training on the following topics:"),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "reporting_procedures",
        findingKind: "documented",
        summary:
          "According to the UC SVSH Policy, anyone can report prohibited conduct, including anonymously, to the Title IX Officer or any Responsible Employee, who must forward it to the Title IX Officer, and there is no time limit for reporting. The 2026 Annual Security Report states that a report can be made online or by phone, and that professionals at CARE, Counseling and Psychological Services (CAPS) and the Staff and Faculty Counseling Center can talk with survivors without identifying them to the Title IX Office or police without consent, except in limited circumstances. Accommodations and protective measures are available on request whether or not the victim reports to police. The policy's amnesty provision says complainants and witnesses will not be disciplined for alcohol- or drug-related student conduct violations around the time of the incident unless the violation was egregious.",
      },
      citations: [
        svsh("p. 14", "Any person can report Prohibited Conduct, including anonymously."),
        svsh("p. 14", "The person or office that receives the report must forward it to the Title IX Officer."),
        svsh("p. 14", "There is no time limit for reporting, and people should report incidents even if significant time has passed."),
        asr("pp. 61–62", "A formal report can be made to Title IX at https://ucla-ocr.caseiq.app/portal/reportonline or by calling (310) 825-7102."),
        asr(
          "p. 69",
          "Professionals at Campus Assault Resources & Education (CARE), the Counseling and Psychological Services (CAPS), and Staff and Faculty Counseling Center (SFCC) may talk to victims/survivors without revealing any identifying information about them to anyone else at the University, including the Title IX Office or the UCLA PD, without the victim’s consent.",
        ),
        asr(
          "p. 66",
          "The University will make such accommodations or protective measures, if the victim requests them and if they are reasonably available, regardless of whether the victim chooses to report the crime to UCLA PD or other local law enforcement.",
        ),
        svsh(
          "p. 10",
          "To encourage reporting, the University will not discipline Complainants or witnesses for student conduct policy violations that occur around the time of alleged Prohibited Conduct unless the University determines the violation was egregious.",
        ),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "outcome_information",
        findingKind: "documented",
        summary:
          "The most recent UCLA Title IX outcome data located covers July 2019 to June 2020. According to that report, the Title IX Office received 1,336 reports of prohibited conduct (covering sexual violence, sexual harassment and other gender-based discrimination and harassment). After initial assessment, 48% were administratively closed, 33% were closed, 16% were pending and 3% went to a formal investigation. Of the 39 formal investigations, the report's chart shows 15% with a finding of a policy violation, 13% with no violation and 72% still in progress. The Title IX Office's Reporting Statistics page links data for fiscal years 2015–2016 through 2020–2021; the 2020–2021 link did not return a file when checked on October 5, 2026, and no later report was located on the Title IX Office or UC Systemwide Title IX Office websites or in the 2026 Annual Security Report.",
      },
      citations: [
        {
          source: "titleIxData2020",
          pinpoint: "p. 4 (PDF p. 1)",
          excerpt: "The Title IX Office received 1336 reports of prohibited conduct between July 2019 and June 2020.",
        },
        {
          source: "titleIxData2020",
          pinpoint: "p. 5 (PDF p. 2), Figure 2",
          excerpt: "Figure 2. Initial Assessment Determination [n = 1336]",
          claim: "Chart labels: Matter Closed 33%; Formal Investigation 3%; Administrative Closure Following Initial Assessment 48%; Pending 16%",
        },
        {
          source: "titleIxData2020",
          pinpoint: "p. 6 (PDF p. 3)",
          excerpt:
            "The following overview provides summary statistics on the 39 reports of prohibited conduct that the Title IX Office received between July 2019 and June 2020 that resulted in a Formal Investigation.",
        },
        {
          source: "titleIxData2020",
          pinpoint: "p. 9 (PDF p. 6), Figure 5",
          excerpt: "Figure 5. Finding in Formal Investigations [n = 39]",
          claim: "Chart labels: No Violation 13%; Violation 15%; In Progress 72%",
        },
        {
          source: "titleIxStatistics",
          pinpoint: "Reporting Statistics",
          excerpt: "Fiscal Year 2020-2021 2019-2020 2018-2019 2017-2018 2016-2017 2015-2016",
          claim: "Fiscal years for which the page links Title IX data",
        },
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "transparency_practices",
        findingKind: "documented",
        summary:
          "The UCLA Title IX Office states that UCLA's Equity, Diversity and Inclusion office produces an annual Public Accountability Report that includes Title IX data, and its Reporting Statistics page links that data for fiscal years 2015–2016 through 2020–2021. According to the 2026 Annual Security Report, UCLA's Clery Act reporting and its daily crime and fire log do not include victims' names or other identifying information, and Title IX formal investigation reports shared with the parties are redacted to protect witnesses' identities.",
      },
      citations: [
        {
          source: "titleIxStatistics",
          pinpoint: "Reporting Statistics",
          excerpt:
            "UCLA Title IX is committed to transparency and accountability. The office of Equity, Diversity, and Inclusion produces an annual Public Accountability Report where Title IX data is included.",
        },
        asr(
          "p. 70",
          "UCLA does not publish the name of crime victims as part of its Clery-mandated reporting, nor does it house identifiable information regarding victims in the police department’s daily crime and fire activity log or Annual Security Report.",
        ),
        asr("pp. 69–70", "Also, any Title IX Formal Investigation Report shared with the parties is redacted to protect the identities of all witnesses."),
      ],
    },

    // -----------------------------------------------------------------------------------------------------------
    // Policies
    // -----------------------------------------------------------------------------------------------------------
    {
      key: "policy",
      input: {
        policyType: "sexual_misconduct",
        title: "University of California Sexual Violence and Sexual Harassment Policy (Interim)",
        summary:
          "The University of California's systemwide policy on sexual violence, sexual harassment, relationship violence, stalking, sexual exploitation, retaliation and other prohibited conduct. It applies to all UC employees, students and third parties at every UC campus, including UCLA, and to all University programs and activities. The current interim version was issued December 22, 2025 and took effect January 1, 2026; its revision history lists technical updates and changes for California laws AB 1905, AB 2987, AB 1575 and SB 1491 on that date, and an FAQ update on August 24, 2026. Student cases are resolved under the student investigation and adjudication frameworks (PACAOS Appendices E and F), summarised for UCLA in the Annual Security Report.",
        effectiveDate: "2026-01-01",
      },
      citations: [
        svsh("p. 1", "Issuance Date: 12/22/2025 Effective Date: 1/1/2026", "Issuance and effective dates"),
        svsh(
          "p. 1",
          "This Sexual Harassment and Sexual Violence Policy (“Policy”) applies to all University employees as well as undergraduate, graduate, and professional students (“students”), and third parties.",
          "Scope",
        ),
        svsh(
          "p. 30",
          "January 1, 2026: Technical updates and changes related to Assembly Bill (AB) 1905, AB 2987, AB 1575, and Senate Bill (SB) 1491.",
          "Revision history",
        ),
        svsh("p. 30", "August 24, 2026: The Frequently Asked Questions section was updated.", "Revision history"),
      ],
    },
    {
      key: "policy",
      input: {
        policyType: "amnesty",
        title: "Amnesty (UC Sexual Violence and Sexual Harassment Policy, Section III.E.1)",
        summary:
          "Part of the UC SVSH Policy. To encourage reporting, the University will not discipline complainants or witnesses for student conduct policy violations around the time of the alleged prohibited conduct unless it determines the violation was egregious, for example conduct that risked someone's health or safety or involved plagiarism, cheating or academic dishonesty. The provision applies to alcohol- and drug-related student violations.",
        effectiveDate: null,
      },
      citations: [
        svsh(
          "p. 10",
          "To encourage reporting, the University will not discipline Complainants or witnesses for student conduct policy violations that occur around the time of alleged Prohibited Conduct unless the University determines the violation was egregious.",
        ),
        svsh("p. 11", "This amnesty provision applies to alcohol- and drug-related student violations."),
        asr("p. 83", "This amnesty provision applies to alcohol- and drug-related student violations.", "Restated in the 2026 Annual Security Report"),
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
        name: "UCLA Title IX Office (Civil Rights Office)",
        description:
          "2255 Murphy Hall. Email titleix@equity.ucla.edu. Reports can be made online at https://ucla-ocr.caseiq.app/portal/reportonline. The Annual Security Report also gives the Civil Rights Office number, (310) 825-7102, for making a report. The office describes itself as a non-confidential reporting office.",
        phone: "(310) 206-3417",
        url: "https://sexualharassment.ucla.edu/",
        hours: null,
        available247: null,
        sortOrder: 0,
      },
      citations: [
        { source: "titleIxContact", pinpoint: "Contact Us", excerpt: "Title IX Office 2255 Murphy Hall Email: titleix@equity.ucla.edu Phone: (310) 206-3417", claim: "Contact details" },
        asr("pp. 61–62", "A formal report can be made to Title IX at https://ucla-ocr.caseiq.app/portal/reportonline or by calling (310) 825-7102.", "Online report and Civil Rights Office number"),
        { source: "titleIxResources", pinpoint: "Confidentiality", excerpt: "Title IX is a non-confidential reporting office.", claim: "Not confidential" },
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "campus_police",
        confidentiality: "institutional_reporting",
        name: "UCLA Police Department",
        description:
          "601 Westwood Plaza. In an emergency call 9-1-1. Officers take reports, can help obtain an Emergency Protective Order, and provide free transportation to the Rape Treatment Center.",
        phone: "(310) 825-1491",
        url: "https://www.ucpd.ucla.edu",
        hours: "24 hours a day, 365 days a year",
        available247: true,
        sortOrder: 0,
      },
      citations: [
        asr(
          "p. 11",
          "Reports may be made in person at the UCLA Police Department, located at 601 Westwood Plaza, Los Angeles, CA 90095, or by calling (310) 825-1491 to request that an officer be dispatched to your location.",
          "Contact details",
        ),
        asr("p. 11", "The UCLA Police Department operates 24 hours a day, 365 days a year.", "Hours"),
        { source: "titleIxFiling", pinpoint: "Reporting Options", excerpt: "601 Westwood Plaza • (310) 825-1491 www.ucpd.ucla.edu", claim: "Website" },
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "local_law_enforcement",
        confidentiality: "institutional_reporting",
        name: "Los Angeles Police Department (non-emergency reporting line)",
        description: "For assaults off university property, call 9-1-1 to reach the nearest agency in an emergency. The Annual Security Report lists this LAPD non-emergency line.",
        phone: "1-877-275-5273",
        url: null,
        hours: null,
        available247: null,
        sortOrder: 0,
      },
      citations: [asr("p. 61", "The non-emergency LAPD reporting line can be reached at 1-877-275-5273.", "Phone")],
    },

    // -----------------------------------------------------------------------------------------------------------
    // Resources: confidential (as stated in the cited sources)
    // -----------------------------------------------------------------------------------------------------------
    {
      key: "student_resource",
      input: {
        category: "victim_advocacy",
        confidentiality: "confidential",
        name: "CARE: Advocacy Office for Sexual and Gender-Based Violence and Misconduct (CARE Program)",
        description:
          "Confidential advocates for students, faculty and staff, regardless of where or when the violence occurred; no report or charges are required to receive support. 330 De Neve Dr., 205 Covel Commons. Email advocate@careprogram.ucla.edu. Appointments through the request form on the CARE website. The Title IX Office home page lists \"24 Hour Crisis Counseling (888) 200-6665\" with CARE; the CARE page itself does not list that number and refers urgent calls to the Rape Treatment Center.",
        phone: "(310) 206-2465",
        url: "https://careprogram.ucla.edu/",
        hours: "Monday - Friday, 9AM - 5PM",
        available247: null,
        sortOrder: 0,
      },
      citations: [
        asr(
          "p. 62",
          "CARE Advocates are University staff employees who are professionally trained and certified to provide confidential support and/or counseling services to victims of sexual violence, sexual assault, domestic violence, dating violence or stalking.",
          "Confidential",
        ),
        asr("p. 62", "Survivors are not required to file a report or press charges in order to receive needed care.", "No report required"),
        { source: "careHome", pinpoint: "Home page", excerpt: "General Office Hours are Monday - Friday, 9AM - 5PM.", claim: "Hours" },
        { source: "careHome", pinpoint: "Footer", excerpt: "330 De Neve Dr. 205 Covel Commons Los Angeles, CA, 90095 (310) 206-2465 advocate@careprogram.ucla.edu", claim: "Contact details" },
        { source: "titleIxHome", pinpoint: "Confidential resources for students", excerpt: "(310) 206-2465 || 24 Hour Crisis Counseling (888) 200-6665", claim: "Crisis line listed by the Title IX Office" },
        svsh("p. 7", "5. Confidential Resources: The following employees who receive information about Prohibited Conduct in their confidential capacity: a. CARE;", "Confidential Resource under the UC policy"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "counseling",
        confidentiality: "confidential",
        name: "Counseling and Psychological Services (CAPS)",
        description: "Free, confidential counseling for students, in person and by telehealth. Wooden Center West.",
        phone: "(310) 825-0768",
        url: "https://counseling.ucla.edu/services/our-services",
        hours: "24/7 (per the CARE and Title IX websites)",
        available247: true,
        sortOrder: 0,
      },
      citations: [
        asr("p. 71", "Free, confidential counseling for students (310) 825-0768 Wooden Center West", "Contact details"),
        asr("p. 62", "Students can learn more about CAPS Services and how to access them at https://counseling.ucla.edu/services/our-services.", "Website"),
        { source: "careHome", pinpoint: "Home page", excerpt: "If you need to speak to a counselor, please contact CAPS at 310-825-0768 (24/7) .", claim: "24/7" },
        { source: "titleIxResources", pinpoint: "Confidential resources for students", excerpt: "Reach safe & confidential advocacy, support, and counseling through CAPS 24 hours a day.", claim: "24 hours" },
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "medical",
        confidentiality: "confidential",
        name: "Rape Treatment Center, Santa Monica-UCLA Medical Center",
        description:
          "1250 16th Street, Santa Monica. Free emergency medical care, forensic examination, counseling and advocacy; a forensic exam does not require a police report. UCLA PD provides free transportation. The Title IX resources page gives the number as 424-259-6000.",
        phone: "(424) 259-7208",
        url: "https://www.uclahealth.org/medical-services/rtc",
        hours: "24 hours a day, 7 days a week",
        available247: true,
        sortOrder: 0,
      },
      citations: [
        asr(
          "p. 62",
          "RTC is located at 1250 16th Street in the city of Santa Monica and may be contacted via telephone at (424) 259-7208. For more information on the RTC please visit https://www.uclahealth.org/medical-services/rtc.",
          "Contact details",
        ),
        asr(
          "p. 61",
          "Victims can receive highly specialized emergency medical care, forensic services, counseling, advocacy, and information about their rights and options to support them in making informed choices and decisions 24 hours a day, 7 days a week, free of charge.",
          "Services and hours",
        ),
        asr("p. 61", "Having a forensic examination does not require them to subsequently file a police report.", "No police report required"),
        {
          source: "titleIxResources",
          pinpoint: "Confidential resources for students",
          excerpt: "1250 Sixteenth Street, Santa Monica CA 90404 | 424-259-6000 | https://www.uclahealth.org/medical-services/rtc",
          claim: "Listed under \"CONFIDENTIAL RESOURCES FOR STUDENTS\" (with a different phone number)",
        },
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "confidential",
        confidentiality: "confidential",
        name: "UCLA Office of Ombuds Services",
        description:
          "Informal help resolving conflicts, disputes or complaints for students, faculty and staff. Strathmore Building, 501 Westwood Plaza, Suite 105. Center for Health Sciences office: (310) 206-2427. Email ombuds@conet.ucla.edu.",
        phone: "(310) 825-7627",
        url: null,
        hours: "8:00 AM - 5:00 PM, Monday- Friday, or by appointment",
        available247: false,
        sortOrder: 0,
      },
      citations: [
        {
          source: "titleIxResources",
          pinpoint: "Confidential resources for students",
          excerpt: "In order to afford visitors the greatest freedom in using its services, the Office is independent, neutral and confidential.",
          claim: "Confidential",
        },
        {
          source: "titleIxResources",
          pinpoint: "Confidential resources for students",
          excerpt: "Main Office: Strathmore Building, 501 Westwood Plaza, Suite 105 | Phone: (310) 825-7627",
          claim: "Contact details",
        },
        {
          source: "titleIxResources",
          pinpoint: "Confidential resources for students",
          excerpt: "Hours: 8:00 AM - 5:00 PM, Monday- Friday, or by appointment E-mail: ombuds@conet.ucla.edu",
          claim: "Hours",
        },
        svsh("p. 7", "b. Ombuds;", "Confidential Resource under the UC policy"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "confidential",
        confidentiality: "confidential",
        name: "Student Legal Services",
        description: "Confidential legal advice for students, including how to obtain a restraining order in civil court and immigration-related issues. A239 Murphy Hall.",
        phone: "(310) 825-9894",
        url: "http://www.studentlegal.ucla.edu",
        hours: null,
        available247: null,
        sortOrder: 1,
      },
      citations: [
        asr("pp. 71–72", "Confidential legal advice to students, including information on how to obtain a restraining order in civil court", "Services"),
        { source: "titleIxResources", pinpoint: "Confidential resources for students", excerpt: "Confidential legal counseling and assistance A239 Murphy Hall 310-825-9894 http://www.studentlegal.ucla.edu", claim: "Contact details" },
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "medical",
        confidentiality: "unknown",
        name: "Arthur Ashe Student Health & Wellness Center",
        description:
          "Comprehensive healthcare services for students. 221 Westwood Plaza. The UC SVSH Policy lists licensed professionals \"including health center employees\" among its Confidential Resources, but the sources reviewed do not name this center as confidential.",
        phone: "(310) 825-4073",
        url: "https://www.studenthealth.ucla.edu/",
        hours: null,
        available247: null,
        sortOrder: 1,
      },
      citations: [
        asr("p. 71", "Comprehensive healthcare services for students 221 Westwood Plaza (310) 825-4073 https://www.studenthealth.ucla.edu/", "Contact details"),
        svsh(
          "p. 7",
          "d. Any persons with a professional license requiring confidentiality (including health center employees but excluding campus legal counsel), or someone who is supervised by such a person; and",
          "UC policy on health center employees",
        ),
      ],
    },

    // -----------------------------------------------------------------------------------------------------------
    // Resources: off-campus (as listed in the Annual Security Report)
    // -----------------------------------------------------------------------------------------------------------
    {
      key: "student_resource",
      input: {
        category: "victim_advocacy",
        confidentiality: "unknown",
        name: "Peace Over Violence, Los Angeles Rape and Battering Hotline",
        description: "Off-campus hotline listed in the Annual Security Report. Peace Over Violence also offers individual, group and family counseling.",
        phone: "(310) 392‐8381",
        url: "https://www.peaceoverviolence.org/emergency",
        hours: null,
        available247: null,
        sortOrder: 1,
      },
      citations: [asr("p. 74", "Peace Over Violence Los Angeles Rape and Battering Hotline (310) 392‐8381 www.peaceoverviolence.org/emergency", "Contact details")],
    },
    {
      key: "student_resource",
      input: {
        category: "victim_advocacy",
        confidentiality: "confidential",
        name: "RAINN (Rape, Abuse, and Incest National Network)",
        description: "National hotline and online chat for survivors of sexual assault and abuse.",
        phone: "(800) 656-4673",
        url: "https://www.rainn.org/",
        hours: "24/7",
        available247: true,
        sortOrder: 2,
      },
      citations: [
        asr(
          "p. 73",
          "National network supporting victims/survivors of sexual assault and abuse. 24/7 free and confidential hotline and chat services. (800) 656-4673 https://www.rainn.org/",
          "Services, confidentiality and contact details",
        ),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "victim_advocacy",
        confidentiality: "unknown",
        name: "Los Angeles City Attorney's Victim Assistance Program",
        description: "Crisis intervention, advocacy, information and referrals for victims and witnesses throughout the criminal justice process.",
        phone: "(213) 978-4537",
        url: "http://www.helplacrimevictims.org",
        hours: null,
        available247: null,
        sortOrder: 3,
      },
      citations: [
        asr("p. 73", "The Los Angeles City Attorney's Victim Assistance Program Crisis intervention, advocacy, information and referrals (213) 978-4537", "Contact details"),
        {
          source: "titleIxResources",
          pinpoint: "Confidential and Non-Confidential Resources",
          excerpt: "Through crisis intervention, advocacy, information and referral, the goal is to help alleviate the psychological and emotional trauma incurred from victimization.",
          claim: "Services",
        },
        {
          source: "titleIxResources",
          pinpoint: "Confidential and Non-Confidential Resources",
          excerpt: "Our aim is to also facilitate the victims', survivors', and witnesses' recovery and ability to actively participate in the criminal justice system. http://www.helplacrimevictims.org",
          claim: "Website",
        },
      ],
    },
  ],
};
