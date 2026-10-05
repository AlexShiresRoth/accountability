// University of Utah: institutional record.
//
// Transcribed 2026-10-05 by Claude from official University of Utah sources (see `sources`):
// - the 2026 Annual Security Report, Fire Report, and Campus Safety Plan (pp. 3, 8–9, 13, 31–46, 76–79, and
//   Appendices 2–3; same document as research/university-of-utah.ts), which reproduces Rule R1-012B and parts of
//   Policy 6-400;
// - the Regulations Library pages for Policy 1-012 (University Non-Discrimination Policy) and Rule R1-012B
//   (Complaint Process Rule);
// - the Office of Equal Opportunity and Title IX (OEO) Sexual Misconduct and Campus Resources pages;
// - the Department of Public Safety post "2023 Clery Report explained" (2024-09-19).
// Status after import: pending_review. A human must check each record against the cited page before verifying.
//
// Pages: printed page numbers equal PDF page numbers in the ASR. Every excerpt was checked by script against the
// source text (PyMuPDF text for the ASR; page text for web pages), ignoring whitespace and line-break hyphens. The ASR's
// text layer inserts spaces in web addresses ("oeo. utah. edu"); excerpts and URLs are written without them.
// Spelling and wording errors in the sources are kept in excerpts (e.g. "guide the victim though", "Domestic
// Violation Coalition, there phone is"). Summaries are attributed to their source; they describe what the
// university says its process is, not an evaluation of how it works in practice.
//
// Office names: the ASR uses both "Office of Equal Opportunity and Affirmative Action (OEO/AA)" and "Office of Equal
// Opportunity and Title IX"; the Policy 1-012 page notes an editorial revision on February 14, 2025 "to update the
// name of the Office of Equal Opportunity and Title IX". Records use the current name.
//
// Confidentiality: marked "confidential" only where a source says so: the Center for Campus Wellness Victim-Survivor
// Advocates (ASR pp. 46, 77), the University Counseling Center and the University Hospitals Chaplain (ASR pp. 9, 39,
// 46). The ASR describes University Police, the Office of the Dean of Students and OEO as "private but not
// confidential" (p. 46); they are entered as reporting channels with that wording in the description. Off-campus
// services' confidentiality is not stated in the sources, so it is "unknown".
//
// Not entered, and why:
// - Outcome information: entered as "not located" (see that record for what was searched).
// - Timeline entries: no dated institutional action within scope was documented in these sources. Policy and rule
//   revision dates are recorded on the policy records.
// - The ASR (p. 40) refers to an example "OEO/TIX letter in Appendix of this report"; the 2026 report has
//   Appendices 1–3 only (Rules R1-012A and R1-012B, hazing response), and no such letter was found in it.
// - ASR Appendix 1 reproduces "[Interim] Rule 1-012A: Discrimination Complaint Process Rule. Revision 2. Effective
//   Date: March 16, 2022", whereas the Regulations Library lists Rule R1-012A as the "Non-Discrimination Rule". The
//   Rule R1-012A page was not read; a human should check which version is current.
// - Student Health Center: the ASR (p. 76) lists it with 801-581-6826, the same number it gives for the University
//   Counseling Center (p. 77); left out until a source settles its number.
// - University of Utah Emergency Room: the ASR prints "healthcare.utah.edu/emergency", which returned HTTP 404 on
//   2026-10-05, so the record's URL is left blank.
// - Utah Domestic Violence Coalition LINKLine hours conflict ("(8:30 a.m.-9 p.m.)" in the ASR, p. 79; "24-Hour" in the
//   2024 DPS post); both are quoted and available247 is left blank.
// - National and general lines listed in the ASR (RAINN, Safe Horizon stalking helpline, SafeUT app and its
//   1-800-273-8255 number, Valley Behavioral Health, Legal Aid, Utah Legal Services, Utah Office for Victims of
//   Crimes, Family Justice Center, YWCA) and Housing & Residential Education: omitted to keep the list to sexual-
//   violence services and reporting channels for the Salt Lake City campus; a human may add them from pp. 77–79.
// - Contacts for the Sandy, Herriman, St. George and field-station locations (ASR pp. 8, 76): the record follows the
//   Salt Lake City statistics.
// - process.oeo.utah.edu and attheu.utah.edu blocked automated requests (Cloudflare) and were not read. The OEO
//   Contact Us page was downloaded but not reviewed in detail.

import type { ResearchBundle } from "@/lib/admin/research-bundle";

const asr = (pinpoint: string, excerpt: string, claim?: string) => ({ source: "asr2026", pinpoint, excerpt, claim });
const policy = (excerpt: string, claim?: string) => ({ source: "policy1012", pinpoint: "web page", excerpt, claim });
const rule = (excerpt: string, claim?: string) => ({ source: "rule1012b", pinpoint: "web page", excerpt, claim });
const dps = (excerpt: string, claim?: string) => ({ source: "dps2023Explained", pinpoint: "web page", excerpt, claim });

const confidentialList =
  "If you wish to speak with someone confidentially about this incident and your reporting options, please directly contact one of the following resources: Center for Campus Wellness Victim-Survivor Advocates (801-581-7776) University Counseling Center (801-581-6826) University Hospitals Chaplain (801-587-0949)";

export const utahInstitutional: ResearchBundle = {
  college: { slug: "university-of-utah" },
  sources: {
    // Same document as research/university-of-utah.ts; the importer reuses the existing source by URL.
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
    },
    policy1012: {
      type: "university",
      publisher: "University of Utah",
      title: "Policy 1-012: University Non-Discrimination Policy (Revision 4)",
      url: "https://regulations.utah.edu/general/1-012.php",
      archivedUrl: "https://web.archive.org/web/20260915075211/https://regulations.utah.edu/general/1-012.php",
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes: "Regulations Library page. \"Revision 4. Effective date: August 1, 2024\". History section lists approvals and editorial revisions.",
      internalNotes:
        "Read live on 2026-10-05 (page footer \"Last Updated: 10/1/26\"). The Wayback capture of 2026-09-15 resolves and shows the same revision line (its footer reads \"Last Updated: 10/29/25\", so editorial details may differ from the live page).",
    },
    rule1012b: {
      type: "university",
      publisher: "University of Utah",
      title: "Rule R1-012B: Complaint Process Rule (Revision 5)",
      url: "https://regulations.utah.edu/general/rules/R1-012B.php",
      archivedUrl: null,
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes: "Regulations Library page. \"Revision 5. Effective date: February 13, 2025\". Also reproduced as Appendix 2 of the 2026 Annual Security Report.",
      internalNotes: "Read live on 2026-10-05. No Wayback capture was found by the availability API.",
    },
    oeoSexualMisconduct: {
      type: "university",
      publisher: "University of Utah Office of Equal Opportunity and Title IX",
      title: "Title IX - Sexual Misconduct",
      url: "https://oeo.utah.edu/how-can-we-help/sexual-misconduct.php",
      archivedUrl: "https://web.archive.org/web/20260614125054/https://oeo.utah.edu/how-can-we-help/sexual-misconduct.php",
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes: "OEO page with Title IX Coordinator contact details and a link to the online report form. Footer: \"Last Updated: 1/7/26\".",
      internalNotes: "Read live on 2026-10-05. Wayback capture of 2026-06-14 found by the availability API (not opened).",
    },
    oeoCampusResources: {
      type: "university",
      publisher: "University of Utah Office of Equal Opportunity and Title IX",
      title: "Campus Resources",
      url: "https://oeo.utah.edu/resources/campus-resources.php",
      archivedUrl: "https://web.archive.org/web/20260614134425/https://oeo.utah.edu/resources/campus-resources.php",
      publicationDate: null,
      retrievedAt: "2026-10-05",
      documentPath: null,
      notes: "OEO list of campus resources with phone numbers and links. Footer: \"Last Updated: 4/3/26\".",
      internalNotes: "Read live on 2026-10-05. Wayback capture of 2026-06-14 found by the availability API (not opened).",
    },
    // Same source as research/university-of-utah.ts.
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
          "According to the 2026 Annual Security Report, the University of Utah's policies on sexual misconduct are Policy 1-012 and its associated rules, and its Title IX Coordinator, the Director of the Office of Equal Opportunity and Title IX (OEO), oversees the university's response to reports and complaints of possible sex discrimination, including sexual misconduct. Complaints are resolved under Rule R1-012B, the Complaint Process Rule, reproduced in the report. The rule states that the university will attempt to decide whether to accept or dismiss a complaint within 30 calendar days and to complete the process within 150 calendar days of acceptance (60 days for the OEO investigation, 60 for any hearing and 30 for any appeal), with extensions for good cause on written notice. A person may pursue an investigation through the criminal justice system, through Policy 1-012, or both, and the university does not require a complainant to participate. Complaints raised by patients of University of Utah healthcare providers are handled under separate procedures.",
      },
      citations: [
        asr(
          "p. 31",
          "The University of Utah has designated the following individual as the Title IX Coordinator to oversee the university’s response to reports and complaints that involve possible sex discrimination (which includes sexual misconduct)",
        ),
        asr("p. 31", "The overarching university policies concerning all forms of sexual misconduct can be found in the Regulations Library at Policies 1-012"),
        asr(
          "p. 90",
          "The university shall attempt to conclude the evaluation for the acceptance or dismissal of a Complaint in 30 calendar days. Upon acceptance of a Complaint, the university shall attempt to complete the Complaint resolution process within 150 calendar days of the acceptance of the Complaint; this includes completion of the OEO investigation within 60 calendar days, 60 calendar days to conclude any related hearing, and 30 calendar days to conclude any appeal, if applicable.",
        ),
        asr("p. 90", "A person may choose for an investigation to be pursued either through the criminal justice system, through Policy 1-012, or both."),
        asr(
          "p. 91",
          "The university does not require a Complainant to participate in any investigation or proceeding; however, failure to participate may limit the university’s ability to respond to allegations of Discrimination.",
        ),
        asr(
          "p. 89",
          "Allegations of Discrimination raised by patients of University of Utah healthcare providers/facilities (University Hospitals & Clinics) are not governed by this rule",
        ),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "disciplinary_procedures",
        findingKind: "documented",
        summary:
          "According to Rule R1-012B as reproduced in the 2026 Annual Security Report, all investigations of sexual misconduct are decided at a hearing by a Hearing Committee, which acts as the university's decision-maker, using the preponderance-of-the-evidence standard. The report states that each party may be accompanied by an advisor of their choice, including an attorney, and that the university will appoint an advisor to ask cross-examination questions for a party who does not bring one; both parties are notified of the outcome simultaneously in writing and may appeal. Sanctions listed for dating violence, domestic violence, sexual assault and stalking include probation, no-contact directives, eviction from housing, suspension from one semester to five years, dismissal, a permanent ban from campus and termination of employment; the report states that dismissal is reflected on a student's transcript.",
      },
      citations: [
        asr(
          "p. 98",
          "Investigations of Sexual Misconduct. Such matters shall be resolved by the determination of a Hearing Committee, which acts as the university’s decision-maker regarding potential policy violations.",
        ),
        asr(
          "p. 93",
          "The university uses the Preponderance of the Evidence standard as the standard of proof to determine responsibility for Discrimination, including Sexual Misconduct or Retaliation.",
        ),
        asr("p. 41", "If either party does not bring an advisor, the University will appoint an advisor for that individual, to ask cross-examination questions."),
        asr("p. 41", "The complainant and respondent will be notified simultaneously in writing of the outcome and results of any disciplinary proceedings."),
        asr(
          "p. 41",
          "Sexual Assault- probation, payment of restitution, community service, education requirements, counseling, behavioral coaching, no contact directive, eviction from housing, suspension from one semester to five years, dismissal,",
        ),
        asr("p. 42", "Dismissal is permanent separation from the university and is reflected on a student’s transcript."),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "law_enforcement_referrals",
        findingKind: "documented",
        summary:
          "According to the 2026 Annual Security Report, individuals are encouraged, but not required, to file a police report with the Department of Public Safety or 911, and university officials, including those in the Office of Equal Opportunity and Title IX, will on request help a victim notify law enforcement. If a campus authority reports on a victim's behalf, the victim may decline to have law enforcement notified or to speak with officers. When a victim of sexual misconduct contacts University Police, the department notifies the Office of Equal Opportunity and/or the Office of the Dean of Students. The report states that filing a police report does not oblige the victim to pursue a criminal complaint, and that victims do not pay for a physical examination and medical attention whether or not they report to police.",
      },
      citations: [
        asr("p. 39", "Individuals are encouraged, but not required, to file a police report by calling the Department of Public Safety at 801-585-2677 or 911."),
        asr(
          "p. 39",
          "If so requested, the official/office shall provide such assistance and will help to guide the victim though the available options and support the victim in their decision.",
        ),
        asr(
          "p. 40",
          "If a Campus Safety Authority reports on behalf of the victim, the victim has the ability to decline that law enforcement is notified or decline speaking with law enforcement once contacted.",
        ),
        asr(
          "p. 40",
          "When a sexual misconduct victim contacts the University Police, the department will notify the Office of Equal Opportunity and Affirmative Action and/or the Office of the Dean of Students.",
        ),
        asr("p. 40", "Filing a police report will not obligate the victim to pursue a complaint through the criminal process"),
        asr("p. 39", "You will not be required to pay for a physical examination and medical attention, whether or not you file a police report."),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "prevention_programs",
        findingKind: "documented",
        summary:
          "According to the 2026 Annual Security Report, all new undergraduate students take an online course called \"Voices 4 Change\" and all new graduate students take \"Graduate Upstanders\"; incoming students have a registration hold until they complete it and must complete a refresher each year. New employees take \"Addressing Discrimination & Sexual Misconduct on Campus\" and repeat it annually. Recognized student organizations must have at least three members complete bystander intervention training each year. The Center for Campus Wellness runs bystander intervention training, annual mandatory presentations to all student athletes, and Domestic Violence and Sexual Assault Awareness Month campaigns, and the McCluskey Center for Violence Prevention offers programs focused on primary prevention of sexual violence.",
      },
      citations: [
        asr(
          "p. 31",
          "All new undergraduate students take a course called “Voices 4 Change” and all new graduate students take a core called “Graduate Upstanders”.",
        ),
        asr(
          "p. 31",
          "New employees take a course called “Addressing Discrimination & Sexual Misconduct on Campus” and are required to take this course annually as long as employed at the University of Utah.",
        ),
        asr(
          "p. 44",
          "Incoming students have a hold placed on their record that is removed after they have completed this course. Students are thereafter required to complete a refresher training annually.",
        ),
        asr("p. 32", "A minimum of three students per organization are required to complete the training annually."),
        asr("p. 43", "The Center for Campus Wellness provides annual, mandatory presentations to all student athletes on consent, sexual health, and bystander intervention."),
        asr("p. 32", "CCW annually hosts two awareness campaigns in October and April: Domestic Violence and Sexual Assault Awareness Months, respectively (DVAM and SAAM)."),
        asr("p. 44", "The University of Utah also has the McCluskey Center for Violence Prevention (MCVP) that focuses on primary prevention of sexual violence"),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "reporting_procedures",
        findingKind: "documented",
        summary:
          "According to the 2026 Annual Security Report, sexual misconduct may be reported to the Department of Public Safety, the Office of Equal Opportunity and Title IX, the Office of the Dean of Students, or Housing & Residential Education, and victims who do not wish to report to police may report directly to the Office of Equal Opportunity to access resources and accommodations. Under Rule R1-012A, all employees who are not Confidential Employees are mandatory reporters. Crimes may be reported to University Police anonymously, which the report says may limit the help police can provide. Victims may explore reporting options confidentially with a Center for Campus Wellness Victim-Survivor Advocate. The report states that the university must provide requested accommodations or protective measures that are reasonably available, regardless of whether the complainant reports the crime to campus police, local law enforcement or the university.",
      },
      citations: [
        asr(
          "p. 39",
          "An assault or other forms of sexual misconduct should be reported to the Department of Public Safety (801-585-2677), the Office of Equal Opportunity (801-581-8365), and/or the Office of the Dean of Students (801-581-7066) and/or to the Housing & Residential Education Office (801-587-2002).",
        ),
        asr(
          "p. 40",
          "Victims of dating violence, domestic violence, sexual assault, or stalking may also report directly to the Office of Equal Opportunity/Title IX (OEO) if they do not wish to report to police.",
        ),
        asr("p. 46", "Per University Interim Rule R1-012A, all employees who are not Confidential Employees are Mandatory Reporters."),
        asr("p. 8", "Individuals who witness or are the victim of crime, but who wish to remain anonymous, may report the crime to the University Police anonymously."),
        asr("p. 8", "Filing an anonymous report may limit the ability of the police to provide specific assistance or to investigate or solve a crime."),
        asr(
          "p. 39",
          "If an individual is unsure if they would like to report, they may also contact the Center for Campus Wellness and explore the reporting options confidentially with a Victim-Survivor Advocate.",
        ),
        asr(
          "p. 42",
          "the university must make such accommodations or provide protective measures if the victim requests them and if they are reasonably available, regardless of whether the complainant chooses to report the crime to campus police, local law enforcement or the university.",
        ),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "outcome_information",
        findingKind: "not_located",
        summary:
          "No public aggregate data on the outcomes of University of Utah sexual misconduct complaints (such as numbers of investigations, findings or sanctions) was located. On 2026-10-05 researchers checked the 2026 Annual Security Report; the Office of Equal Opportunity and Title IX website (home, Sexual Misconduct, Policies, Campus Resources, FAQ and About Us pages); and Department of Public Safety news posts. The OEO process site (process.oeo.utah.edu) and the university news site could not be read by automated request. The Annual Security Report states that the university will, on written request, disclose to the alleged victim of a crime of violence the results of any disciplinary proceeding against the respondent student.",
      },
      citations: [
        asr(
          "p. 42",
          "The University of Utah will, upon written request, disclose to the alleged victim of a crime of violence or an incident of incest or statutory rape, the results of any disciplinary proceeding against the respondent student alleged to have committed such an offense.",
        ),
        {
          source: "oeoSexualMisconduct",
          pinpoint: "web page",
          excerpt: "Complaints of sexual misconduct should be made directly to the Office of Equal Opportunity and Title IX.",
          claim: "OEO page reviewed; it gives contact and reporting information but no outcome data",
        },
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "transparency_practices",
        findingKind: "documented",
        summary:
          "According to the 2026 Annual Security Report, the university completes its publicly available Clery Act record-keeping without identifying information about victims, and University Police add reported crimes to a Daily Crime Log within two business days. The report states that its 2025 statistics include the medical campus and gives the number of incidents for several offenses that occurred within the medical campus community. In September 2024 the Department of Public Safety published an explanation of the increase in rapes reported for 2023, stating that 150 of the reports came from a single relationship and that, after consulting the Clery Center and Westat, its Clery team was counting each sexual assault the victim-survivor confirmed rather than a single case.",
      },
      citations: [
        asr(
          "pp. 39–40",
          "The university will complete publicly available record-keeping as required by the Clery Act without including identifying information concerning the victim.",
        ),
        asr("p. 9", "Crimes reported to University Police will be added to the Daily Crime log within two business days of a report."),
        asr("p. 13", "The statistics reported in the 2025 crime columns reflect incidents that occurred across both the main academic campus and the medical campus."),
        dps("But looking closer at the numbers, 150 of those reported sexual assaults occurred in a single relationship plagued by a history of coercion and interpersonal violence."),
        dps(
          "In consultation with the Clery Center and Westat, an advisor for institutions working to comply with the federal law, the U Public Safety Clery team is reporting the total number of sexual assaults the victim-survivor confirmed, rather than a single case.",
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
        title: "Policy 1-012: University Non-Discrimination Policy",
        summary:
          "The University of Utah's primary policy prohibiting discrimination, including harassment and sexual misconduct, in all university programs and activities and for all members of the university community. Its definitions are in Rule R1-012A and its complaint procedures in Rule R1-012B, and inquiries go to the Director of the Office of Equal Opportunity and Title IX, who is the Title IX Coordinator. Revision 4 took effect August 1, 2024 as an interim policy and was approved by the Board of Trustees on September 10, 2024. The 2026 Annual Security Report states that sexual misconduct includes the crimes of dating violence, domestic violence, sexual assault and stalking as defined by state and federal law.",
        effectiveDate: "2024-08-01",
      },
      citations: [
        policy("Revision 4. Effective date: August 1, 2024", "Current revision and effective date"),
        policy(
          "This is the primary Policy that informs the University community of the University’s commitment to preventing prohibited Discrimination and fostering an academic, employment, and healthcare environment that is free from prohibited Discrimination, including Harassment and Sexual Misconduct.",
          "Purpose",
        ),
        policy(
          "Initially approved by President Randall as an interim policy with an effective date of August 1, 2024. Approved by the Academic Senate Executive Committee under summer authority August 12, 2024 and approved by Board of Trustees September 10, 2024 with no changes.",
          "Approval history",
        ),
        policy("Director, Office of Equal Opportunity and Title IX Title IX Coordinator", "Contact for inquiries"),
        asr("p. 33", "Sexual Misconduct also includes the crimes of dating violence, domestic violence, sexual assault and stalking as defined by state and federal law.", "Scope of sexual misconduct"),
      ],
    },
    {
      key: "policy",
      input: {
        policyType: "title_ix",
        title: "Rule R1-012B: Complaint Process Rule",
        summary:
          "The procedure for resolving complaints of discrimination, including sexual misconduct and retaliation, under Policy 1-012: acceptance or dismissal of complaints, investigation by the Office of Equal Opportunity and Title IX, hearings, sanctions, remedies and appeals. Complaints raised by patients of University of Utah healthcare providers are handled under separate procedures. According to the Regulations Library, Revision 5 took effect as an interim rule on February 13, 2025 and as a final rule on February 9, 2026. The 2026 Annual Security Report reproduces it as Appendix 2.",
        effectiveDate: "2025-02-13",
      },
      citations: [
        rule("Revision 5. Effective date: February 13, 2025", "Current revision and effective date"),
        rule("Approved as an interim rule by President Randall with effective day of February 13, 2025. Effective as a final rule February 9, 2026.", "Approval history"),
        asr(
          "p. 89",
          "These Complaint procedures address Complaints of Discrimination, including Sex-Based Harassment allegations.",
          "Scope",
        ),
        asr("p. 88", "Rule R1-012B: Complaint Process Rule Revision 5. Effective date: February 13, 2025", "Reproduced in the 2026 Annual Security Report"),
      ],
    },
    {
      key: "policy",
      input: {
        policyType: "amnesty",
        title: "Amnesty for Seeking Medical Attention or Reporting Violent Acts (Policy 6-400)",
        summary:
          "Part of Policy 6-400, Student Rights and Responsibilities, as reproduced in the 2026 Annual Security Report. A person who in good faith reports a violent act against themselves or another person, including domestic violence, stalking, hazing or sexual misconduct, is not disciplined for alcohol or drug use or another minor Behavior Standards Violation at or near the time of the incident. The amnesty generally does not apply when the contact is initiated by law enforcement, Housing and Residential Education staff or other university employees, and the university may still address egregious or repeated violations.",
        effectiveDate: null,
      },
      citations: [
        asr("p. 111", "Policy 6-400: Student Rights and Responsibilities", "Policy reproduced in the report"),
        asr(
          "p. 113",
          "If an individual acts in good faith to report a violent act against the individual or another person, including domestic violence, stalking, hazing, or sexual misconduct, the individual will not be subject to disciplinary action for alcohol and/or drug use or another minor Behavior Standards Violation occurring at or near the time of the incident being reported.",
        ),
        asr(
          "p. 114",
          "Amnesty described in this section generally does not apply to a Student who comes into contact with law enforcement, Housing and Residential Education staff, or other University employees if the contact is initiated by the law enforcement, Housing and Residential Education, or other University employee.",
        ),
        asr(
          "p. 114",
          "If a Student engages in egregious or repeated Behavior Standards Violations, the University may address the Behavior Standards Violations regardless of the manner in which an incident was reported.",
        ),
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
        name: "Office of Equal Opportunity and Title IX (Title IX Coordinator)",
        description:
          "383 S. University Street, Level One OEO Suite. Email oeo@utah.edu. Reports can be made in person, by phone or online (the OEO website links an online report form). The Annual Security Report describes the office as private but not confidential.",
        phone: "801-581-8365",
        url: "https://oeo.utah.edu",
        hours: null,
        available247: null,
        sortOrder: 0,
      },
      citations: [
        asr("p. 31", "383 S. University Street, Level One OEO Suite Salt Lake City, UT 84112 801-581-8365", "Address and phone"),
        asr("p. 78", "oeo.utah.edu 801-581-8365", "Website"),
        {
          source: "oeoSexualMisconduct",
          pinpoint: "web page",
          excerpt: "oeo@utah.edu 383 South University Street, Level 1 OEO Suite Salt Lake City, UT 84112 Phone: 801-581-8365",
          claim: "Email, address and phone",
        },
        asr(
          "p. 46",
          "The Office of Equal Opportunity & Title IX welcomes community members to make a report in-person, on the phone, or online. This office is private but not confidential.",
          "Ways to report; private but not confidential",
        ),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "title_ix",
        confidentiality: "institutional_reporting",
        name: "Office of the Dean of Students (Deputy Title IX Coordinator)",
        description:
          "200 S. Central Campus Drive, Room 270. The Dean of Students is a Deputy Title IX Coordinator, and the office coordinates the student accountability process. The Annual Security Report describes the office as private but not confidential.",
        phone: "801-581-7066",
        url: "https://deanofstudents.utah.edu",
        hours: null,
        available247: null,
        sortOrder: 1,
      },
      citations: [
        asr(
          "p. 31",
          "Deputy Title IX Coordinator/Associate Vice President, Student Affairs Dean of Students 200 South Central Campus Dr. Room 270 Salt Lake City, UT 84112 801-581-7066",
          "Role, address and phone",
        ),
        asr("p. 77", "The Office of the Dean of Students coordinates the Student Accountability process", "Role"),
        asr("p. 77", "deanofstudents.utah.edu 801-581-7066", "Website"),
        asr(
          "p. 46",
          "The Office of the Dean of Students welcomes community members to make a report in-person, on the phone, or online. This office is private but not confidential.",
          "Private but not confidential",
        ),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "campus_police",
        confidentiality: "institutional_reporting",
        name: "University of Utah Police (Department of Public Safety)",
        description:
          "1658 East 500 South. In an emergency, call 911. On campus, call 801-585-COPS (2677). Reports can be made in person, by phone or online, and anonymously through the online silent witness form. Campus security escorts: main campus 801-585-2677, University Hospital 801-581-2294. The Annual Security Report describes the department as private but not confidential.",
        phone: "801-585-2677",
        url: "https://safety.utah.edu",
        hours: "24/7",
        available247: true,
        sortOrder: 0,
      },
      citations: [
        asr("p. 39", "Find a safe place. Call 911 or if on campus, 801-585-COPS (801-585-2677).", "Emergency procedure and phone"),
        asr("p. 43", "University of Utah Police Department, 1658 East 500 South, Salt Lake City, UT, 84112, 801-585-2677.", "Address"),
        asr("p. 76", "Department of Public Safety safety.utah.edu 801-585-2677 Campus Security Escorts Main Campus: 801-585-2677 | University Hospital: 801-581-2294", "Website and escorts"),
        asr(
          "p. 46",
          "The police department welcomes community members to make a report in-person, on the phone, or online. This office is private but not confidential.",
          "Ways to report; private but not confidential",
        ),
        dps("They are available 24/7 and have on-call crime victim advocates who can support survivors and report to police.", "24/7 availability"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "local_law_enforcement",
        confidentiality: "institutional_reporting",
        name: "Salt Lake City Police Department",
        description: "Municipal police for Salt Lake City. For emergencies, call 911.",
        phone: "801-799-3000",
        url: "https://slcpd.com",
        hours: null,
        available247: null,
        sortOrder: 0,
      },
      citations: [asr("p. 76", "Salt Lake City Police Department slcpd.com 801-799-3000", "Contact details")],
    },

    // -----------------------------------------------------------------------------------------------------------
    // Resources: confidential (ASR pp. 9, 39, 46, 77)
    // -----------------------------------------------------------------------------------------------------------
    {
      key: "student_resource",
      input: {
        category: "victim_advocacy",
        confidentiality: "confidential",
        name: "Center for Campus Wellness Victim-Survivor Advocates",
        description:
          "Free, confidential and trauma-informed support for students, faculty and staff who have experienced interpersonal violence, including sexual assault, stalking, and dating and domestic violence. Advocates can explain reporting options confidentially and help with protective orders. Email advocate@sa.utah.edu.",
        phone: "801-581-7776",
        url: "https://wellness.utah.edu/programs/violence-harm-support/vsa.php",
        hours: null,
        available247: null,
        sortOrder: 0,
      },
      citations: [
        asr(
          "p. 77",
          "The CCW’s Victim-Survivor advocates provide free, confidential and trauma-informed services to support students, faculty and staff who have experienced interpersonal violence (e.g. sexual assault, rape, gender-based harassment, stalking, dating and domestic violence).",
          "Confidential services",
        ),
        asr("p. 46", "The Center for Campus Wellness has Victim Support Advocates imbedded in the department. The office welcomes report in-person or via phone. This office is confidential.", "Confidential"),
        asr("p. 77", "wellness.utah.edu 801-581-7776", "Phone"),
        dps("Contact a victim survivor advocate at 801-581-7776 or by emailing advocate@sa.utah.edu.", "Phone and email"),
        { source: "oeoCampusResources", pinpoint: "web page", excerpt: "Victim-Survivor Advocates 801-581-7776", claim: "Linked to the Victim-Survivor Advocacy page (URL)" },
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "counseling",
        confidentiality: "confidential",
        name: "University Counseling Center",
        description:
          "Individual and group counseling for students. The Annual Security Report states that confidentiality is honored when speaking to its counselors unless disclosure is specifically required by law (e.g., reports of child abuse).",
        phone: "801-581-6826",
        url: "https://counselingcenter.utah.edu",
        hours: null,
        available247: null,
        sortOrder: 0,
      },
      citations: [
        asr(
          "p. 39",
          "An assault or other form of sexual misconduct may also be reported to a university professional or pastoral counselor such as the University Counseling Center. Confidentiality will be honored when speaking to these counsellors unless disclosure is specifically required by law (e.g., reports of child abuse).",
          "Confidentiality",
        ),
        asr("p. 46", confidentialList, "Listed as a confidential resource"),
        asr("p. 77", "counselingcenter.utah.edu 801-581-6826", "Website and phone"),
        dps("University Counseling Center (students only): 801-581-6826", "Students only"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "counseling",
        confidentiality: "confidential",
        name: "University Hospitals Chaplain",
        description:
          "The Annual Security Report lists the University Hospitals Chaplain as a resource for speaking confidentially about an incident and reporting options, and states that the Chaplain, acting in that role, is not required to report crimes disclosed for the annual crime statistics.",
        phone: "801-587-0949",
        url: null,
        hours: null,
        available247: null,
        sortOrder: 1,
      },
      citations: [
        asr("p. 46", confidentialList, "Listed as a confidential resource; phone"),
        asr(
          "p. 9",
          "pastoral and professional counselors working at the University Counseling Center, and University Hospital as the Chaplain, when acting in their professional designated roles, are not required to report crimes disclosed to them for inclusion in the annual disclosure of crime statistics.",
          "Exempt from Clery reporting",
        ),
      ],
    },

    // -----------------------------------------------------------------------------------------------------------
    // Resources: confidentiality not stated in the sources
    // -----------------------------------------------------------------------------------------------------------
    {
      key: "student_resource",
      input: {
        category: "victim_advocacy",
        confidentiality: "unknown",
        name: "University of Utah Police Crime Victim Advocates",
        description:
          "Advocates in the Department of Public Safety for people reporting crimes to University Police; the Annual Security Report says they can assist in getting a court order. Reach them through University Police. The sources do not state whether they are confidential.",
        phone: null,
        url: null,
        hours: null,
        available247: null,
        sortOrder: 1,
      },
      citations: [
        asr("p. 40", "There are Crime Support Advocates in the University of Utah Police Department who can assist in getting a court order", "Role"),
        dps("The U’s Department of Public Safety also provides crime victim advocates for those reporting crimes to University of Utah Police.", "Role"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "victim_advocacy",
        confidentiality: "unknown",
        name: "Rape Recovery Center (Salt Lake City)",
        description:
          "Off-campus center supporting survivors and victims of sexual violence. The Annual Security Report lists a Rape Sexual Assault Hotline at 801-467-7273 and the Salt Lake Rape Recovery Center at 801-467-7282.",
        phone: "801-467-7273",
        url: "https://raperecoverycenter.com",
        hours: null,
        available247: null,
        sortOrder: 2,
      },
      citations: [
        asr(
          "p. 79",
          "Rape Sexual Assault Hotline raperecoverycenter.com 801-467-7273 Salt Lake Rape Recovery Center raperecoverycenter.com 801-467-7282",
          "Contact details",
        ),
        dps(
          "Rape Recovery Center. The Rape Recovery Center supports and empowers survivors and victims of sexual violence and educates the community about the cause, impact, and prevention of sexual violence.",
          "Description",
        ),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "victim_advocacy",
        confidentiality: "unknown",
        name: "Utah Domestic Violence Coalition LINKLine",
        description:
          "Statewide domestic violence line; the Annual Security Report says the coalition can also assist with protective orders. Hours differ between sources: the 2026 Annual Security Report lists \"(8:30 a.m.-9 p.m.)\", while the Department of Public Safety's 2024 post calls it a \"24-Hour LINKLine\".",
        phone: "1-800-897-5465",
        url: "https://udvc.org",
        hours: "8:30 a.m.–9 p.m. per the 2026 ASR; \"24-Hour\" per the 2024 DPS post",
        available247: null,
        sortOrder: 3,
      },
      citations: [
        asr("p. 79", "Domestic Violence Hotline udvc.org/resources/get-help-now.html OR bit.ly/2LnjUWL 1-800-897-5465 (8:30 a.m.-9 p.m.)", "Phone and hours as listed in the ASR"),
        asr("p. 40", "The Utah Domestic Violation Coalition can also assist with protective orders, there phone is 800-897-5465", "Protective orders"),
        dps("Their 24-Hour LINKLine is 1-800-897-LINK (5465)", "Hours as listed in the DPS post"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "counseling",
        confidentiality: "unknown",
        name: "Huntsman Mental Health Institute crisis line",
        description: "Crisis line listed by the Department of Public Safety among counseling and support services.",
        phone: "801-587-3000",
        url: null,
        hours: "24/7",
        available247: true,
        sortOrder: 2,
      },
      citations: [dps("Huntsman Mental Health Institute crisis line (available 24/7): 801-587-3000", "Phone and availability")],
    },
    {
      key: "student_resource",
      input: {
        category: "medical",
        confidentiality: "unknown",
        name: "University of Utah Hospital Emergency Room",
        description:
          "The Annual Security Report states that University Hospital and Clinics use nurses highly trained in medical and forensic examinations and interviews of sexual assault victims, and that victims are not required to pay for a physical examination and medical attention whether or not they file a police report. University Hospital main line: 801-585-2031.",
        phone: "801-581-2291",
        url: null,
        hours: null,
        available247: null,
        sortOrder: 0,
      },
      citations: [
        asr("p. 76", "University of Utah Emergency Room healthcare.utah.edu/emergency 801-581-2291", "Phone"),
        asr("p. 76", "University of Utah Hospital healthcare.utah.edu/hospital 801-585-2031", "Hospital main line"),
        asr(
          "p. 39",
          "The University Hospital and Clinics utilizes nurses who are highly trained in performing medical and forensic examinations and interviews of sexual assault victims.",
          "Forensic examinations",
        ),
        asr("p. 39", "You will not be required to pay for a physical examination and medical attention, whether or not you file a police report.", "No cost"),
      ],
    },
  ],
};
