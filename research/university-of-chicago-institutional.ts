// University of Chicago: institutional record.
//
// Transcribed 2026-10-12 by Claude from these official sources (see `sources`):
// - the University's Annual Security and Fire Safety Report 2026–2027 (Department of Safety and Security), the latest
//   linked from the official Annual Security & Fire Safety Reports page; statistics for 2023–2025. Used here for its
//   "UChicago HELP" section (pp. 3–5), "Title IX and Sexual Misconduct" section (pp. 23–28), Appendix I (Policy on
//   Harassment, Discrimination, and Sexual Misconduct, pp. 29–47), Appendix II (Policy on Title IX Sexual Harassment,
//   pp. 48–63) and Important Contact Information (p. 93). Same document as research/university-of-chicago.ts is
//   expected to use; the importer reuses the source by URL;
// - the Policy on Harassment, Discrimination, and Sexual Misconduct (harassmentpolicy.uchicago.edu, "Last updated:
//   October 3, 2024") and the Policy on Title IX Sexual Harassment as published in the Student Manual
//   (studentmanual.uchicago.edu, "Policy last updated: October 2, 2024");
// - the Student Manual's University-Wide Disciplinary System page and Disciplinary Reports page;
// - "Student Disciplinary Actions: 2024-2025" (Dean of Students in the University, presented to the Council of the
//   University Senate on March 3, 2026);
// - the University's Preventing Sexual Violence in Higher Education Act (IPSVHE) Annual Report dated November 1, 2023
//   (calendar-year 2022 data), the most recent one linked from the UChicago CARES Annual Reporting pages;
// - UChicago CARES pages (cares.uchicago.edu: home, Annual Reporting, Confidential Support Services, Community
//   Resources, Reporting Information for Students, Complaints Against Students, Campus-Wide Annual Training
//   Requirement); the UChicago HELP Sexual Assault Dean-on-Call confidentiality page; and UChicago Student Wellness
//   pages (Get Help Now; Resources for Sexual Assault and Interpersonal Violence Survivors).
// Status after import: pending_review. A human must check each record against the cited page before verifying.
//
// Pages: "p. N" is the page number printed on the page. ASR: PDF page = printed page + 2 (cover and contents are
// unnumbered). Disciplinary Actions 2024-2025 and the IPSVHE report: printed page = PDF page. Every PDF excerpt was
// checked by script against the PDF's text (PyMuPDF), ignoring line breaks, soft hyphens and bullet characters; every
// web-page excerpt was checked against the page's text as downloaded on 2026-10-12, ignoring line breaks and the
// invisible zero-width characters the Student Manual pages contain. The ASR prints some URLs with a space at a line
// break ("titleixpolicy. uchicago.edu"); URLs on records are given without the space and with "https://" added where
// none was printed, except where a source printed "http://".
//
// Contact details that differ between sources (recorded here so a human can settle them):
// - Title IX Coordinator / UChicago CARES phone: 773.702.5671 for the Associate Provost and Title IX Coordinator
//   (ASR pp. 25, 32, 41, 46, 49; both policy pages); 773.834.6367 for "Title IX Coordinator for the University" and
//   "Deputy Title IX Coordinator for Students" (ASR p. 93) and "(773) 834-OEOP (6367)" on the CARES home page. The
//   CARES line is used on the record and the Coordinator's direct line is noted.
// - Title IX Coordinator address: "5525 S. Ellis Ave., Suite B" (ASR p. 25; IPSVHE report p. 1) vs "6030 S. Ellis
//   Ave." (ASR pp. 32, 41, 46, 49; both policy web pages). The policies' 6030 address is used.
// - UChicago Medicine Adult Emergency Department address: "5655 S. Maryland Ave." (ASR p. 26) vs "5656 S. Maryland
//   Ave." (ASR pp. 43, 44, 59; Student Wellness pages). 5656 is used.
// - Ordained Religious Advisors phone: 773.702.2100 (ASR p. 26) vs 773-834-1885 (ASR pp. 32, 50; policy pages).
//   Both are on the record.
// - Student Wellness phone: "773-834-WELL" (= 773.834.9355) in most places, but "773-702-WELL" on ASR p. 60 and the
//   Student Manual Title IX policy page. The Student Wellness site's 773.834.9355 is used.
// - Student Wellness nurse line: the survivors page says "Call the 24/7 Nurse Line at 773.834.9355"; the Get Help Now
//   page gives 773.834.9355 for business hours and a separate "Nurse Advice Line (24/7): Call 866.243.1242". Not
//   settled; both noted on the record and `available247` left blank for medical care.
// - Sexual Assault Dean-on-Call: 773.702.8181 via UCPD (ASR pp. 4–5, 26, 32, 44; CARES); ASR p. 93 and the Student
//   Wellness survivors page also give 773.834.HELP (4357). Both noted.
// - Chicago Police from a campus phone: "9.911" (ASR p. 25), "9-1-1 from a campus phone" (ASR p. 43), "911 from a
//   campus phone" (ASR p. 59), "9-9-1-1 from a campus phone" (Student Wellness survivors page). Not settled; the
//   record gives 911 and leaves the campus-phone prefix to the verifier.
// - YWCA: "YWCA: 866.525.9922" in the ASR's Confidential Resources list (p. 26); "YWCA Metropolitan Chicago:
//   312-372-6600" and "Parks Francis YWCA: 773-955-3100" in the policy resource lists (pp. 45, 61). All three noted.
// - 888-293-2080 is listed as the "Chicago Rape Crisis Hotline" (ASR pp. 26, 45, 61, 93; CARES) and, on the Student
//   Wellness survivors page, as RAINN's number "for Chicago Region". Noted on both records.
// - Staff titles of deputy Title IX coordinators differ between the ASR and the two policy web pages (e.g. the
//   harassment policy page lists an Executive Director of CARES not named in the ASR). Individual deputies are not
//   entered.
//
// Confidentiality: marked "confidential" only where a cited source says so: the Sexual Assault Dean-on-Call, Student
// Wellness, Ordained Religious Advisors, Chicago Rape Crisis Hotline and YWCA (listed under "Confidential Resources",
// ASR p. 26); the Confidential Advisor (communication "considered privileged", ASR p. 44); Resilience and Greenlight
// Family Services ("Off-Campus Confidential", Student Wellness survivors page); RAINN ("a confidential National
// Sexual Assault Hotline", same page). The SADoC's confidentiality is qualified: UChicago HELP says a disclosure "may
// lead to the University launching an investigation", without identifying the student; this is on the record. The
// Title IX office (UChicago CARES) is "institutional_reporting": the policy calls a report to it "private" (ASR
// p. 32), not confidential. The UChicago Medicine Emergency Department is "unknown": the ASR says city police are
// notified by law (p. 43). UCPD Victim and Witness Services and the Mayor's Office Domestic Violence Help Line are
// "unknown": no source reviewed says either way.
//
// Not entered, and why:
// - The yearly "Report on Harassment and Sexual Misconduct to the Council of the University Senate" that both
//   policies require (ASR pp. 46, 62): not located on the CARES, Equal Opportunity Programs or Student Manual sites or
//   by web search on 2026-10-12. The outcome record uses the Dean of Students' annual "Student Disciplinary Actions"
//   report and the IPSVHE report instead. No separately titled "UMAC" report was found.
// - IPSVHE reports for calendar years 2023 onward: none linked from the CARES or Equal Opportunity Programs Annual
//   Reporting pages on 2026-10-12; the November 1, 2023 report (2022 data) is the latest found.
// - Climate survey results (cares.uchicago.edu/overview/annual-reporting/climate-survey/): not reviewed.
// - Disciplinary case narratives in the 2024-2025 Disciplinary Actions report: only counts and sanction types are
//   entered, to avoid reproducing details of individual cases.
// - Separate campuses (Gleacher Center, Beijing, Delhi, Hong Kong, London, Paris, Singapore) and their hospitals and
//   crisis centres: the record follows the Hyde Park campus. Northwestern Memorial Hospital (Gleacher Center) is not
//   entered. The ASR's Paris hospital address also differs (185 Rue Raymond Losserand, p. 43; 85, p. 59).
// - Policy on Consensual Relationships (ASR Appendix III): not a sexual-violence policy; a human may add it.
// - Employee-only resources (Perspectives/AllOne Health EAP, Human Resources Employee and Labor Relations), IDHR,
//   IHRC, EEOC, Chicago Bar Association, Office of International Affairs, Bias Education and Support Team,
//   Chicago Women's Health Center, Center on Halsted, LGBTQ Crisis Hotline, CAASE, Illinois Legal Aid and the
//   culturally specific services on the CARES and Student Wellness pages: not entered to keep the list to core
//   sexual-violence services; a human may add them. (Note: the ASR's Dean of Students contacts give the same phone,
//   773-702-7994, for two different officials, pp. 42, 51.)
// - Timeline: one dated institutional action is entered (adoption of the Policy on Title IX Sexual Harassment on
//   August 14, 2020, per the IPSVHE report). The policies' 2024 "last updated" dates are recorded on the policy
//   records, not as timeline entries, because no source describes what changed.

import type { ResearchBundle } from "@/lib/admin/research-bundle";

const asr = (pinpoint: string, excerpt: string, claim?: string) => ({ source: "asr", pinpoint, excerpt, claim });
const disc = (pinpoint: string, excerpt: string, claim?: string) => ({ source: "disciplinaryActions2025", pinpoint, excerpt, claim });
const ipsvhe = (pinpoint: string, excerpt: string, claim?: string) => ({ source: "ipsvhe2023", pinpoint, excerpt, claim });
const web = (source: string, pinpoint: string, excerpt: string, claim?: string) => ({ source, pinpoint, excerpt, claim });

/** ASR p. 26: the "Confidential Resources" list, cited on each resource it names. */
const asrConfidentialList = asr(
  "p. 26",
  "Confidential Resources Sexual Assault Dean-on-Call: 773.702.8181 and ask for the Sexual Assault Dean-on-Call (no identifying information needs to be shared) Student Wellness: 773.834.WELL (wellness.uchicago.edu) Ordained Religious Advisors: 773.702.2100 (spirit.uchicago.edu) Chicago Rape Crisis Hotline: 888.293.2080 YWCA: 866.525.9922",
  "Listed under \"Confidential Resources\"",
);

export const uchicagoInstitutional: ResearchBundle = {
  college: {
    slug: "university-of-chicago",
    create: { name: "University of Chicago", aliases: ["UChicago", "U of C"], city: "Chicago", state: "IL" },
  },
  sources: {
    // Expected to be the same document as research/university-of-chicago.ts; the importer reuses a source by URL.
    asr: {
      type: "university",
      publisher: "University of Chicago Department of Safety and Security",
      title: "Annual Security and Fire Safety Report 2026–2027",
      url: "https://safety-security.uchicago.edu/-/media/project/uchicago-tenant/dss/pdfs/annual-reports/fire-safety/annual-security-and-fire-safety-report-2026-2027_91726_2.pdf",
      archivedUrl: null,
      publicationDate: null,
      retrievedAt: "2026-10-12",
      documentPath: null,
      access: "free",
      notes:
        "Statistics for calendar years 2023, 2024 and 2025. UChicago HELP and Sexual Assault Dean-on-Call: pp. 3–5. Title IX and Sexual Misconduct: pp. 23–28. Appendix I, Policy on Harassment, Discrimination, and Sexual Misconduct: pp. 29–47. Appendix II, Policy on Title IX Sexual Harassment: pp. 48–63. Important Contact Information: p. 93. Page numbers are as printed; PDF page = printed page + 2.",
      internalNotes:
        "Linked as \"2026 - 2027 Annual Security & Fire Safety Report\" from https://safety-security.uchicago.edu/stay-informed/annual-security-and-fire-safety-reports (read 2026-10-12; securityreport.uchicago.edu redirects to the Clery Act Reporting page). Downloaded with curl on 2026-10-12; served application/pdf; 96 pages. SHA-256: 5427b9291336738968c24f9dafaa893e5ce717551707feacdb7f73fa53b43b08. PDF metadata title \"ANNUAL Security and Fire Safety REPORT 2026–2027\", modified 2026-09-23; back cover code DSS260212. No Wayback capture of the PDF URL existed on 2026-10-12. Publication date not printed.",
    },
    harassmentPolicy: {
      type: "university",
      publisher: "University of Chicago Office of the Provost, Equal Opportunity Programs",
      title: "Policy on Harassment, Discrimination, and Sexual Misconduct",
      url: "https://harassmentpolicy.uchicago.edu/policy/",
      archivedUrl: "https://web.archive.org/web/20260922170810/https://harassmentpolicy.uchicago.edu/policy/",
      publicationDate: null,
      retrievedAt: "2026-10-12",
      documentPath: null,
      access: "free",
      notes: "The University's comprehensive policy on discrimination, harassment and sexual misconduct; page ends \"Last updated: October 3, 2024\". Reprinted as Appendix I of the Annual Security and Fire Safety Report.",
      internalNotes:
        "https://harassmentpolicy.uchicago.edu/page/policy redirects here. Read with curl on 2026-10-12. Latest Wayback capture 2026-09-22 (not compared). The page lists deputy Title IX coordinators with titles that differ from the ASR's Appendix I.",
    },
    titleIxPolicy: {
      type: "university",
      publisher: "University of Chicago (Student Manual)",
      title: "The University of Chicago Policy on Title IX Sexual Harassment",
      url: "https://studentmanual.uchicago.edu/university-policies/the-university-of-chicago-policy-on-title-ix-sexual-harassment/",
      archivedUrl:
        "https://web.archive.org/web/20260423030409/https://studentmanual.uchicago.edu/university-policies/the-university-of-chicago-policy-on-title-ix-sexual-harassment/",
      publicationDate: null,
      retrievedAt: "2026-10-12",
      documentPath: null,
      access: "free",
      notes: "Student Manual text of the Policy on Title IX Sexual Harassment; page ends \"Policy last updated: October 2, 2024\". Also published at titleixpolicy.uchicago.edu and as Appendix II of the Annual Security and Fire Safety Report.",
      internalNotes:
        "Read with curl on 2026-10-12. The page text contains invisible zero-width non-joiner characters (U+200C), ignored when checking excerpts. The titleixpolicy.uchicago.edu/policy/ copy was also downloaded; it gives Student Wellness as \"773-702-WELL\" in its resource list, as does this page. Latest Wayback capture 2026-04-23 (not compared).",
    },
    disciplinarySystem: {
      type: "university",
      publisher: "University of Chicago (Student Manual)",
      title: "University-Wide Disciplinary System",
      url: "https://studentmanual.uchicago.edu/student-life-conduct/university-disciplinary-systems/university-wide-disciplinary-system/",
      archivedUrl:
        "https://web.archive.org/web/20260516113847/https://studentmanual.uchicago.edu/student-life-conduct/university-disciplinary-systems/university-wide-disciplinary-system/",
      publicationDate: null,
      retrievedAt: "2026-10-12",
      documentPath: null,
      access: "free",
      notes: "Student disciplinary procedure for complaints under the Policy on Harassment, Discrimination, and Sexual Misconduct: investigation, administrative resolution, the University-wide Disciplinary Committee, sanctions and review.",
      internalNotes: "Read with curl on 2026-10-12. Latest Wayback capture 2026-05-16 (not compared).",
    },
    disciplinaryReports: {
      type: "university",
      publisher: "University of Chicago (Student Manual)",
      title: "Disciplinary Reports",
      url: "https://studentmanual.uchicago.edu/disciplinary-reports/",
      archivedUrl: "https://web.archive.org/web/20260925003057/https://studentmanual.uchicago.edu/disciplinary-reports/",
      publicationDate: null,
      retrievedAt: "2026-10-12",
      documentPath: null,
      access: "free",
      notes: "Links the annual University Disciplinary Actions reports to the Council of the University Senate, 2007-2008 through 2024-2025.",
      internalNotes: "Read with curl on 2026-10-12. Linked as \"Annual Incident Report Statistics\" from the CARES Annual Reporting page. Latest Wayback capture 2026-09-25 (not compared).",
    },
    disciplinaryActions2025: {
      type: "university",
      publisher: "University of Chicago Campus and Student Life",
      title: "Student Disciplinary Actions: 2024-2025",
      url: "https://d3qi0qp55mx5f5.cloudfront.net/studentmanual/i/basic_pages/University_Disciplinary_Actions_2024-2025_(pdf).pdf",
      archivedUrl:
        "https://web.archive.org/web/20260512115411/https://d3qi0qp55mx5f5.cloudfront.net/studentmanual/i/basic_pages/University_Disciplinary_Actions_2024-2025_(pdf).pdf",
      publicationDate: "2026-03-03",
      retrievedAt: "2026-10-12",
      documentPath: null,
      access: "free",
      notes:
        "Report by the Dean of Students in the University to the Council of the University Senate covering July 1, 2024–June 30, 2025. University-wide Student Disciplinary System (Policy on Harassment, Discrimination and Sexual Misconduct matters): pp. 4–5, Table 2 on p. 5. Printed page = PDF page.",
      internalNotes:
        "Linked as \"University Disciplinary Actions 2024-2025 (pdf)\" from the Student Manual Disciplinary Reports page; the link carries the query string ?mtime=1772727804, omitted from the URL here. Downloaded with curl on 2026-10-12; 6 pages. SHA-256: 35bc6ad2f040185f30eebd4e61def4d00b73ed3e5927bb6a6a3937b740778b47. The Wayback capture of 2026-05-12 was downloaded and is byte-identical. publicationDate is the date it was presented to the Council, printed on p. 1.",
    },
    ipsvhe2023: {
      type: "university",
      publisher: "University of Chicago",
      title: "Preventing Sexual Violence in Higher Education Act Annual Report (November 1, 2023)",
      url: "https://bpb-us-w2.wpmucdn.com/voices.uchicago.edu/dist/f/3453/files/2023/12/University-of-Chicago-IPSVHE-Report-2022.pdf",
      archivedUrl:
        "https://web.archive.org/web/20241022173101/https://bpb-us-w2.wpmucdn.com/voices.uchicago.edu/dist/f/3453/files/2023/12/University-of-Chicago-IPSVHE-Report-2022.pdf",
      publicationDate: "2023-11-01",
      retrievedAt: "2026-10-12",
      documentPath: null,
      access: "free",
      notes:
        "Report to the Illinois Attorney General under the Preventing Sexual Violence in Higher Education Act, with data for January 1–December 31, 2022. Reports and outcomes: pp. 9–11. Printed page = PDF page.",
      internalNotes:
        "Linked as \"IPSVHE Report 2022\" from https://cares.uchicago.edu/overview/annual-reporting/preventing-violence-reports/ (whose visible headings still list the November 1, 2021 report as the latest). Downloaded with curl on 2026-10-12; 103 pages (pp. 14 onward reproduce policies). SHA-256: f2424b7e4daeae159241d09664121d582e7c91e848ed957313921e4647356547. The Wayback capture of 2024-10-22 was downloaded and is byte-identical. publicationDate is the date printed on p. 1.",
    },
    caresHome: {
      type: "university",
      publisher: "UChicago CARES (Center for Awareness, Resolution, Education, and Support)",
      title: "UChicago CARES",
      url: "https://cares.uchicago.edu/",
      archivedUrl: "https://web.archive.org/web/20260916070932/https://cares.uchicago.edu/",
      publicationDate: null,
      retrievedAt: "2026-10-12",
      documentPath: null,
      access: "free",
      notes: "Home page of the University's office for preventing and responding to harassment, discrimination and sexual misconduct (Title IX): contact phone and email.",
      internalNotes: "Read with curl on 2026-10-12. The page's HTML title reads \"UChicago CARES Website – Sandbox | University of Chicago\". Wayback capture 2026-09-16 (not compared).",
    },
    caresAnnualReporting: {
      type: "university",
      publisher: "UChicago CARES",
      title: "Annual Reporting",
      url: "https://cares.uchicago.edu/overview/annual-reporting/",
      archivedUrl: "https://web.archive.org/web/20250420103424/https://cares.uchicago.edu/overview/annual-reporting/",
      publicationDate: null,
      retrievedAt: "2026-10-12",
      documentPath: null,
      access: "free",
      notes: "Describes the IPSVHE annual reports, the Dean of Students' annual incident statistics, the Annual Security and Fire Safety Report and the climate survey.",
      internalNotes: "Read with curl on 2026-10-12. Latest Wayback capture 2025-04-20 (not compared).",
    },
    caresConfidential: {
      type: "university",
      publisher: "UChicago CARES",
      title: "Confidential Support Services",
      url: "https://cares.uchicago.edu/support-and-resources/confidential-support-services/",
      archivedUrl: "https://web.archive.org/web/20260916070938/https://cares.uchicago.edu/support-and-resources/confidential-support-services/",
      publicationDate: null,
      retrievedAt: "2026-10-12",
      documentPath: null,
      access: "free",
      notes: "Confidential resources for students (Sexual Assault Dean on Call, Student Wellness, Spiritual Life advisors) and for academics and staff.",
      internalNotes: "Read with curl on 2026-10-12. Wayback capture 2026-09-16 (not compared).",
    },
    caresCommunity: {
      type: "university",
      publisher: "UChicago CARES",
      title: "Community Resources",
      url: "https://cares.uchicago.edu/support-and-resources/community-resources/",
      archivedUrl: "https://web.archive.org/web/20241221215023/https://cares.uchicago.edu/support-and-resources/community-resources/",
      publicationDate: null,
      retrievedAt: "2026-10-12",
      documentPath: null,
      access: "free",
      notes: "Off-campus resources: Chicago Rape Crisis Hotline, Resilience, YWCA, Greenlight, CAASE, Illinois Legal Aid and culturally specific services.",
      internalNotes: "Read with curl on 2026-10-12. Latest Wayback capture 2024-12-21 (not compared).",
    },
    caresReportingStudents: {
      type: "university",
      publisher: "UChicago CARES",
      title: "Reporting Information for Students",
      url: "https://cares.uchicago.edu/reporting/reporting-information-for-students/",
      archivedUrl: "https://web.archive.org/web/20241221213648/https://cares.uchicago.edu/reporting/reporting-information-for-students/",
      publicationDate: null,
      retrievedAt: "2026-10-12",
      documentPath: null,
      access: "free",
      notes: "Reporting options for students (CARES, formal complaint, anonymous, law enforcement, no report), resolution options by respondent status, and reporting responsibilities.",
      internalNotes: "Read with curl on 2026-10-12. Latest Wayback capture 2024-12-21 predates the page's last modification (2026-08-17, per the site's API); not compared.",
    },
    caresTraining: {
      type: "university",
      publisher: "UChicago CARES",
      title: "Campus-Wide Annual Training Requirement",
      url: "https://cares.uchicago.edu/prevention-education-and-training/training-requirement/",
      archivedUrl: "https://web.archive.org/web/20260608220814/https://cares.uchicago.edu/prevention-education-and-training/training-requirement/",
      publicationDate: null,
      retrievedAt: "2026-10-12",
      documentPath: null,
      access: "free",
      notes: "Annual sexual misconduct prevention training requirement for students and employees; registration hold for students; links Title IX Personnel training materials 2020–2025.",
      internalNotes: "Read with curl on 2026-10-12. Wayback capture 2026-06-08 (not compared).",
    },
    sadocConfidentiality: {
      type: "university",
      publisher: "UChicago HELP (Campus and Student Life)",
      title: "Sexual Assault Dean-on-Call: Confidentiality",
      url: "https://help.uchicago.edu/sexual-assault-dean-on-call/confidentiality-2/",
      archivedUrl: "https://web.archive.org/web/20250927162022/https://help.uchicago.edu/sexual-assault-dean-on-call/confidentiality-2/",
      publicationDate: null,
      retrievedAt: "2026-10-12",
      documentPath: null,
      access: "free",
      notes: "What the Sexual Assault Dean-on-Call keeps confidential and when the University may investigate.",
      internalNotes: "Read with curl on 2026-10-12. Latest Wayback capture 2025-09-27 (not compared).",
    },
    wellnessSurvivors: {
      type: "university",
      publisher: "UChicago Student Wellness",
      title: "Resources for Sexual Assault and Interpersonal Violence Survivors",
      url: "https://wellness.uchicago.edu/mental-health/resources-for-sexual-assault-and-interpersonal-violence-survivors/",
      archivedUrl:
        "https://web.archive.org/web/20260413043027/https://wellness.uchicago.edu/mental-health/resources-for-sexual-assault-and-interpersonal-violence-survivors/",
      publicationDate: null,
      retrievedAt: "2026-10-12",
      documentPath: null,
      access: "free",
      notes: "On-campus confidential resources, other on-campus resources (CARES, UCPD Victim and Witness Services), off-campus confidential resources, reporting options and emergency resources.",
      internalNotes: "Read with curl on 2026-10-12. Latest Wayback capture 2026-04-13 (not compared).",
    },
    wellnessGetHelp: {
      type: "university",
      publisher: "UChicago Student Wellness",
      title: "Get Help Now",
      url: "https://wellness.uchicago.edu/get-help-now/",
      archivedUrl: "https://web.archive.org/web/20260914164547/https://wellness.uchicago.edu/get-help-now/",
      publicationDate: null,
      retrievedAt: "2026-10-12",
      documentPath: null,
      access: "free",
      notes: "Urgent medical and mental health care options, including the 24/7 Therapist-On-Call.",
      internalNotes: "Read with curl on 2026-10-12. Wayback capture 2026-09-14 (not compared).",
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
          "The University of Chicago handles reports of sexual misconduct under two policies: the Policy on Title IX Sexual Harassment, for conduct that meets the federal Title IX definition and occurs in a University program in the United States, and the broader Policy on Harassment, Discrimination, and Sexual Misconduct for other matters, which the Annual Security and Fire Safety Report says uses the same evidentiary standard and range of sanctions. Reports go to the Title IX Coordinator (the Associate Provost for Equal Opportunity Programs) or her designees at UChicago CARES. After a report, the University gives the person a written summary of rights and options; CARES says it emails outreach about confidential resources, supportive measures and resolution options, and that students need not respond. Formal Title IX complaints are heard by a Title IX Hearing Panel; for a student respondent it generally has five decisionmakers (two faculty, one student, one staff member and a Decisionmaker on Relevance). The report says the formal process is complete in most cases within 60–90 days, which may be extended for good cause with written notice.",
      },
      citations: [
        web(
          "titleIxPolicy",
          "Section II, Policy Basis and Application",
          "This policy only applies to Title IX Sexual Harassment, as defined in this policy, that takes place in an educational program or activity of the University against a person in the United States.",
        ),
        asr(
          "p. 27",
          "The Policy on Harassment, Discrimination, and Sexual Misconduct uses the same evidentiary standard and range of possible sanctions as the Policy on Title IX Harassment.",
        ),
        asr(
          "p. 25",
          "Students and employees should report any form of sexual misconduct, including allegations of Title IX Sexual Harassment, to the University’s Title IX Coordinator or to an Official with Authority.",
        ),
        asr(
          "p. 33",
          "When the University receives a report that someone in our community experienced sexual misconduct (including sexual harassment), dating violence, domestic violence, or stalking, the University will provide that person with a written summary of their rights and options, including information on contacting local law enforcement and community-based resources.",
        ),
        web(
          "caresReportingStudents",
          "Who on campus is required to report incidents to the University?",
          "If an incident is reported to UChicago CARES, students can expect to receive an email outreach outlining information on confidential resources, supportive measures, resolution options, and resources and referrals. Students are not obligated to respond to this outreach or engage with the UChicago CARES team.",
        ),
        asr(
          "p. 27",
          "In matters involving a student Respondent, the Panel generally consists of five Decisionmakers, including two faculty members (one who serves as chair), one student, one staff member, and one Decisionmaker on Relevance.",
        ),
        asr(
          "p. 27",
          "In most cases, the University’s Formal Resolution Process will be complete within 60–90 days of receiving a Formal Title IX Complaint.",
        ),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "disciplinary_procedures",
        findingKind: "documented",
        summary:
          "According to the Student Manual, student cases under the Policy on Harassment, Discrimination, and Sexual Misconduct go through the University-Wide Disciplinary System. The Associate Dean of Students in the University (Center for Student Integrity) investigates and may resolve a complaint administratively, but cannot impose suspension, expulsion or degree revocation that way; either party can ask for referral to the University-wide Disciplinary Committee, which generally has three faculty members, one student and one staff member and decides by majority vote on a preponderance of the evidence. Only the Committee may suspend or expel; suspensions are recorded on the transcript. Both parties are notified of the outcome within 5 business days and may request review within fifteen calendar days. Mediation is not used for sexual assault, dating violence, domestic violence or stalking. For Title IX matters the Annual Security and Fire Safety Report applies the same standard of proof, allows review requests within ten days, and lists sanctions from written warnings to expulsion and revocation of degree.",
      },
      citations: [
        web(
          "disciplinarySystem",
          "(a) Administrative Resolution of Complaints",
          "The Associate Dean cannot issue a disciplinary sanction of suspension, expulsion, or revocation of a degree through the administrative process.",
        ),
        web(
          "disciplinarySystem",
          "(a) Administrative Resolution of Complaints",
          "Before the conclusion of the administrative process, at the request of either party, the Associate Dean will refer the matter to the Disciplinary Committee.",
        ),
        web(
          "disciplinarySystem",
          "Composition and Training of the University-wide Disciplinary Committee",
          "The Disciplinary Committee consists generally of three faculty members, one student, one staff member, and the Associate Dean (or designee).",
        ),
        web(
          "disciplinarySystem",
          "Resolution",
          "The Disciplinary Committee will apply a preponderance of evidence standard in making its determinations.",
        ),
        web("disciplinarySystem", "Sanctions for Misconduct of Individual Students", "Only the Disciplinary Committee may expel a student."),
        web(
          "disciplinarySystem",
          "Notification of Outcome and Requests for Review",
          "The complainant and respondent will receive simultaneous formal and written notification of the outcome, including information regarding requesting review, within 5 business days of the hearing. Decisions of disciplinary suspension will be recorded on the student's transcript",
        ),
        web(
          "disciplinarySystem",
          "Notification of Outcome and Requests for Review",
          "The complainant and the respondent both may request a review of the outcome within fifteen calendar days of being informed, in writing, of the decision.",
        ),
        web(
          "disciplinarySystem",
          "Mediation",
          "Mediation is not appropriate, even on a voluntary basis, in matters involving allegations of sexual assault, dating violence, domestic violence, and stalking.",
        ),
        asr(
          "p. 28",
          "Within ten (10) days of being informed, in writing, of the decision of the Title IX Hearing Panel, the Complainant and Respondent may request a review of the outcome and any sanctions.",
        ),
        asr(
          "p. 28",
          "Violations of the Title IX Policy may result in discipline, which can include written warnings, loss of privileges, discretionary sanctions such as educational training on topics such as consent or use of alcohol, probation, suspension, demotion, expulsion, revocation of degree, and termination of employment (including revocation of tenure).",
        ),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "law_enforcement_referrals",
        findingKind: "documented",
        summary:
          "According to the Annual Security and Fire Safety Report, the University encourages reporting sexual misconduct that may be a crime to law enforcement, offers help in doing so, and says victims may decline to notify the police. Reports can be made to the University of Chicago Police Department (UCPD) or the Chicago Police Department. When UCPD receives a report of sexual assault, dating violence, domestic violence or stalking it notifies the Title IX Coordinator if a community member is involved and the Sexual Assault Dean-on-Call if the victim is a student. At the UChicago Medicine Emergency Department, city police are notified by law, the victim may choose whether to file a report, and a medical forensic examination is available at no cost. The University's own investigation may run alongside a law enforcement investigation. Student Wellness lists a UCPD Director of Victim and Witness Services who helps survivors through the criminal justice process.",
      },
      citations: [
        asr("p. 25", "Students and employees are encouraged to report sexual misconduct that may constitute a crime to local law enforcement immediately."),
        asr(
          "p. 26",
          "Individuals have many options with regard to reporting prohibited behavior under Title IX, including the option to be assisted by University officials in reporting these crimes to law enforcement. Victims also have the option to decline to notify such authorities.",
        ),
        asr("p. 50", "Notifying the Title IX Coordinator for the University when a report involves a member of the campus community."),
        asr("p. 50", "Notifying the Sexual Assault Dean-on-Call if the victim is a student."),
        asr("p. 43", "By law, city police are notified, and the victim may choose to file a report."),
        asr(
          "p. 43",
          "The victim may have a medical forensic examination completed at no cost, pursuant to the Sexual Assault Survivors Emergency Treatment Act.",
        ),
        asr("p. 33", "Such an investigation may occur alongside an independent law enforcement investigation."),
        web(
          "wellnessSurvivors",
          "Other On-Campus Resources",
          "The Director of Victim and Witness Services helps survivors navigate the criminal justice process, from filing an initial report, if that is what the survivor wants to do, all the way through to sentencing.",
        ),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "prevention_programs",
        findingKind: "documented",
        summary:
          "According to the Annual Security and Fire Safety Report, incoming College students take an online \"Sexual Assault Prevention for Undergraduates\" course and AlcoholEdu, new graduate and professional students take \"Sexual Assault Prevention–Graduate\", and continuing students take \"Sexual Assault Prevention–Ongoing\". UChicago CARES says the training takes about an hour, is required annually for all students, and that students who miss the deadline get a service indicator that blocks course registration. Employees must complete at least one hour of sexual harassment prevention training and one hour of bystander training each year. The report also describes awareness months (Sexual Assault Awareness Month in April, Domestic Violence Awareness Month in October, Stalking Awareness Month in January), One Love and Bringing in the Bystander workshops, and the Resources for Sexual Violence Prevention Programming Center (RSVP PC), which trains peer educators through a 20-hour program.",
      },
      citations: [
        asr(
          "p. 24",
          "All incoming students in the College receive training called “Sexual Assault Prevention for Undergraduates” (an online training program that addresses relationships, sexual health, consent, and sexual assault)",
        ),
        asr("p. 24", "All new graduate and professional students receive training called “Sexual Assault Prevention–Graduate”"),
        asr(
          "p. 24",
          "All continuing students in the College and continuing graduate and professional students receive training called",
          "Course title printed as “Sexual Assault Prevention–Ongoing” (split across a line break in the PDF)",
        ),
        web(
          "caresTraining",
          "Information for Students",
          "Sexual harassment prevention training is required annually for all students and will take approximately one hour to complete.",
        ),
        web(
          "caresTraining",
          "New College Students",
          "A service indicator will be placed on your UChicago Account following the course deadline. This should not impact any access to resources and services you are using during Autumn Quarter. However, it will block Spring Quarter course registration.",
        ),
        asr("p. 38", "All employees must participate in a minimum of one hour of sexual harassment prevention training and one hour of bystander training annually."),
        asr("p. 24", "Sexual Assault Awareness Month (SAAM): SAAM is a national annual month of programming that occurs in April"),
        asr(
          "p. 25",
          "Bringing in the Bystander®: the Bringing in the Bystander Workshop is an interactive bystander intervention workshop.",
        ),
        asr("p. 25", "For example, RSVP PC teaches students to be peer educators through a 20-hour training program"),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "reporting_procedures",
        findingKind: "documented",
        summary:
          "According to the University's policies as printed in the Annual Security and Fire Safety Report, anyone may report a potential violation through an online form, which is anonymous if no name or contact details are given; CARES notes its ability to act on anonymous reports is very limited. Faculty, instructors, resident assistants and heads, teaching assistants, UCPD staff and other employees are Individuals with Reporting Responsibilities who must pass reports to the Title IX Coordinator; the policy describes a report to the Coordinator as private rather than confidential. Students can instead speak to confidential resources (the Sexual Assault Dean-on-Call, the Confidential Advisor, Student Wellness and ordained religious advisors), who will not report to the Title IX Coordinator without explicit consent. There is no time limit for filing a complaint. Supportive measures such as no-contact orders and changes to academic, living or working arrangements are offered on request whether or not the victim reports to police. Under the amnesty provision, a student who reports in good faith will normally not be disciplined for other conduct violations, such as underage drinking, unless the violation was egregious.",
      },
      citations: [
        asr("p. 26", "Such a report will be anonymous if filled out without disclosing one’s name or contact information."),
        web(
          "caresReportingStudents",
          "Anonymous Reporting",
          "Students can share information with UChicago CARES anonymously by using the Report an Incident form and omitting identifying information. Please note that our ability to address behavior shared via an anonymous report is very limited.",
        ),
        asr(
          "p. 32",
          "Individuals with Reporting Responsibilities include (among others) faculty and instructors, Resident Assistants, Resident Heads, Resident Deans, Teaching Assistants, preceptors, UCPD staff, and other university employees.",
        ),
        asr(
          "p. 32",
          "Please note that reporting an incident to the Associate Provost/Title IX Coordinator for the University (or their designees) is private, and it does not mean the person who experienced sexual misconduct, dating violence, domestic violence, or stalking somehow loses control of the process.",
        ),
        asr(
          "p. 50",
          "The Confidential Resources listed in this Policy do not have an obligation to report any form of sexual misconduct (including Title IX Sexual Harassment, sexual assault, dating violence, domestic violence, or stalking) or retaliation to the Title IX Coordinator or designees and will not do so without the explicit consent of the complaining party.",
        ),
        asr("p. 37", "There is no time limit for filing a complaint under this Policy."),
        asr(
          "p. 26",
          "The University will offer to provide supportive measures and accommodations, which may include, but are not limited to, University no-contact orders, changes to academic, living, dining, transportation, and working situations, and honoring an order or protection or no-contact order entered by a State civil or criminal court, to any victim who asks for them, so long as they are reasonably available, regardless of whether the victim reports the incident to campus police and local law enforcement.",
        ),
        asr(
          "p. 38",
          "For example, the University ordinarily will not pursue disciplinary charges related to underage drinking by the reporting person if that policy violation comes to light as the result of a sexual assault complaint.",
        ),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "outcome_information",
        findingKind: "documented",
        summary:
          "The Dean of Students' report to the Council of the University Senate for July 2024–June 2025 says the University-wide Disciplinary Committee, which hears student cases under the Policy on Harassment, Discrimination and Sexual Misconduct, was convened three times, for three students: one was found not responsible, one responsible for stalking (suspension for four quarters) and one responsible for sexual abuse (disciplinary probation for eight quarters). The report's table of matters referred to that committee shows 6 in 2019-20, 3 in 2020-21, 11 in 2021-22, 4 in 2022-23, 7 in 2023-24 and 3 in 2024-25. The most recent Preventing Sexual Violence in Higher Education Act report located (November 1, 2023) covers calendar 2022: 70 student reports to the Title IX Coordinator and employees with reporting obligations (36 sexual violence, 0 domestic violence, 12 dating violence, 22 stalking, including 21 in an unknown location), plus 35 reports to the Sexual Assault Deans on Call and 10 incidents reported in aggregate by Student Counseling Service. Six complainants pursued the formal process; of six complaints resolved by the committee, one ended in a finding of not responsible and five in findings of responsible, with four suspensions, four educational components and one disciplinary probation assigned. The yearly Report on Harassment and Sexual Misconduct that the policies require be made to the Council of the University Senate was not located publicly.",
      },
      citations: [
        disc("p. 1", "Presented to the Council of the University Senate on March 3, 2026"),
        disc(
          "p. 5",
          "Between July 1, 2024 and June 30, 2025, the University-wide Disciplinary Committee (Committee) was convened on three occasions to consider allegations brought against three students.",
        ),
        disc("p. 5", "The Committee concluded the respondent was not responsible."),
        disc("p. 5", "The Committee concluded the respondent was responsible for stalking and issued disciplinary suspension for four quarters"),
        disc("p. 5", "The Committee concluded the respondent was responsible for sexual abuse and issued disciplinary probation for eight quarters"),
        disc(
          "p. 5, Table 2",
          "Table 2. Student matters referred to the University-wide Student Disciplinary Committee, 2014-15 to 2024-25",
          "Totals: 2019-20, 6; 2020-21, 3; 2021-22, 11; 2022-23, 4; 2023-24, 7; 2024-25, 3",
        ),
        ipsvhe("p. 1", "November 1, 2023", "Report date"),
        ipsvhe(
          "p. 9",
          "Reports to the Title IX Coordinator/Individuals with Reporting Obligations3 Sexual Violence4 36 Domestic Violence 0 Dating Violence 12 Stalking 22",
          "Student reports, January 1–December 31, 2022",
        ),
        ipsvhe("p. 9", "The total number of reports include 21 incidents where the alleged incident took place in an unknown location."),
        ipsvhe("p. 9", "There were 35 reports to the Sexual Assault Deans on Call, which are considered the University’s primary confidential resource."),
        ipsvhe(
          "p. 9",
          "Student Counseling Service, another confidential resource which houses our “confidential advisor,” reported 10 incidents in aggregate form for the same timeframe of January 1, 2022 – December 31, 2022.",
        ),
        ipsvhe(
          "p. 10",
          "Of the 70 reports to the Title IX Coordinator/Responsible Employees during the January 1, 2022 – December 31, 2022 timeframe and defined by IPSVA, 6 complainants chose to engage with the formal reporting process.",
        ),
        ipsvhe(
          "p. 11",
          "One matter concluded with a decision of not responsible for the respondent, while the other five matters concluded with a decision of responsible for the respondent. Of the matters that resulted in a decision of responsible, the following outcomes were assigned: four suspensions, four educational components, and one instance of disciplinary probation.",
        ),
        asr(
          "p. 46",
          "A yearly report will be made to the Council of the University Senate: (1) detailing the number of different types of incidents of harassment and sexual misconduct brought to the attention of the University-wide Student Disciplinary Committee, Title IX Coordinators, Human Resources, and the University-Wide Disciplinary Committee",
          "Required by the policy; not located publicly",
        ),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "transparency_practices",
        findingKind: "documented",
        summary:
          "The University publishes an annual report on student disciplinary proceedings, prepared by Campus and Student Life for the Council of the University Senate, with editions from 2007-2008 to 2024-2025 on the Student Manual site; since 2014-15 it has included matters heard by the University-wide Disciplinary Committee. UChicago CARES links the University's reports to the Illinois Attorney General under the Preventing Sexual Violence in Higher Education Act; the most recent posted is dated November 1, 2023 (2022 data). Both policies call for a yearly report on harassment and sexual misconduct to the Council of the University Senate, which was not found online. The Title IX policy says training materials for Title IX personnel are published, and CARES links them for 2020 through 2025. According to the Annual Security and Fire Safety Report, publicly available Clery Act records do not include identifying information about victims.",
      },
      citations: [
        web(
          "disciplinaryReports",
          "Reports on University Disciplinary Actions",
          "Annually, the Council of the University Senate asks Campus and Student Life to provide a report of all student disciplinary proceedings, as required by actions taken by the Council on May 23, 1970, and June 8, 1976.",
        ),
        web("disciplinaryReports", "Reports on University Disciplinary Actions", "University Disciplinary Actions 2024-2025 (pdf)", "Most recent report listed"),
        web(
          "caresAnnualReporting",
          "Annual Incident Report Statistics",
          "Annual report by the Office of the Dean of Students in the University regarding reports of harassment, discrimination and sexual misconduct involving University students, which includes matters heard by the University-wide Student Disciplinary Committee in which a student is the respondent.",
        ),
        web(
          "caresAnnualReporting",
          "Preventing Sexual Violence in Higher Education Act Annual Reports",
          "The University of Chicago submits an annual report to the Illinois Attorney General’s Office, which includes information on its policies and processes for resolving complaints of sexual misconduct, confidential resources, participation in a sexual misconduct prevention task force, annual sexual misconduct prevention training for students, faculty, and staff, and data of reports received.",
        ),
        asr(
          "p. 58",
          "The University will make all materials used to train Title IX Team members publicly available on the Equal Opportunity Programs website.",
        ),
        web("caresTraining", "Title IX Personnel Training", "Title IX Personnel Foundational Training 2025", "Most recent training materials linked"),
        asr(
          "p. 26",
          "Publicly available record-keeping for the purpose of Clery Act reporting and disclosures will be made without inclusion of identifying information about the victim.",
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
        title: "Policy on Harassment, Discrimination, and Sexual Misconduct",
        summary:
          "The University of Chicago's comprehensive policy on discrimination, unlawful harassment and sexual misconduct, including sexual assault, sexual abuse, domestic violence, dating violence and stalking, using Illinois criminal-code definitions. It covers students, staff, postdoctoral researchers, faculty, other academic appointees and volunteers, for conduct on University property and off it when connected to a University program or when it may create a hostile environment. Matters that meet the definition of Title IX Sexual Harassment are handled under the separate Title IX policy. Student cases are resolved through the University-Wide Disciplinary System in the Student Manual. The policy's web page reads \"Last updated: October 3, 2024\"; no effective date is printed.",
        effectiveDate: null,
      },
      citations: [
        web(
          "harassmentPolicy",
          "II. Policy Basis and Application",
          "This Policy applies to students and other program participants, staff, postdoctoral researchers, faculty, and other academic appointees, volunteers, as well as to anyone on whom the University has formally conferred a title, regardless of employment status.",
          "Scope",
        ),
        asr(
          "p. 29",
          "This policy applies to misconduct that occurs: (1) on University property; or (2) off University property, if: (a) the conduct occurred in connection with a University or University-sponsored or recognized program or activity; or (b) the conduct has or reasonably may have the effect of creating a hostile educational or work environment for a member of the University community.",
          "Location of conduct covered",
        ),
        asr(
          "p. 29",
          "Matters that constitute Title IX Sexual Harassment under the University Policy on Title IX Sexual Harassment are not within the scope of this Policy and will be addressed under the procedures set forth in the Policy on Title IX Sexual Harassment.",
        ),
        web("harassmentPolicy", "End of page", "Last updated: October 3, 2024", "Date shown on the policy page"),
      ],
    },
    {
      key: "policy",
      input: {
        policyType: "title_ix",
        title: "Policy on Title IX Sexual Harassment",
        summary:
          "The University of Chicago's policy implementing the U.S. Department of Education's 2020 Title IX regulations. It applies only to Title IX Sexual Harassment (quid pro quo harassment, severe, pervasive and objectively offensive conduct, sexual assault, dating violence, domestic violence and stalking as defined in the policy) occurring in a University education program or activity in the United States. Formal complaints are investigated and heard by a Title IX Hearing Panel with live hearings and cross-examination by advisors, using a preponderance-of-the-evidence standard. According to the University's 2023 Preventing Sexual Violence in Higher Education Act report, it was adopted on August 14, 2020; the Student Manual copy reads \"Policy last updated: October 2, 2024\".",
        effectiveDate: null,
      },
      citations: [
        web(
          "titleIxPolicy",
          "Section II, Policy Basis and Application",
          "This policy only applies to Title IX Sexual Harassment, as defined in this policy, that takes place in an educational program or activity of the University against a person in the United States.",
          "Scope",
        ),
        asr("p. 27", "All hearings will be conducted live, either virtually or with all parties physically present in the same geographic location."),
        asr("p. 27", "Cross-examination of party/witness by party/witness’s advisor"),
        ipsvhe(
          "p. 2, note 1",
          "The University adopted an additional Policy on Title IX Sexual Harassment on August 14, 2020, in accordance with the U.S. Department of Education’s rules implementing Title IX.",
          "Adoption date",
        ),
        web("titleIxPolicy", "End of page", "Policy last updated: October 2, 2024", "Date shown in the Student Manual"),
      ],
    },
    {
      key: "policy",
      input: {
        policyType: "amnesty",
        title: "Amnesty for Other Policy Violations (Policy on Harassment, Discrimination, and Sexual Misconduct, Section IX; Policy on Title IX Sexual Harassment, Section X)",
        summary:
          "Both University of Chicago policies provide that a student who reports a violation in good faith will normally receive leniency for other student conduct violations that come to light as a result, such as underage drinking. The University will not discipline the reporting student for such violations unless it determines the violation was egregious, including an action that put another person's health or safety at risk. The provision as written covers the student who reports; it does not mention witnesses.",
        effectiveDate: null,
      },
      citations: [
        asr(
          "p. 38",
          "To encourage reports of sexual misconduct, the University normally will offer leniency to a student who reports an alleged violation of this Policy in good faith with respect to other student conduct violations that come to light as a result of such reports.",
          "Policy on Harassment, Discrimination, and Sexual Misconduct",
        ),
        asr(
          "p. 38",
          "The University will not discipline a reporting student for such conduct violations unless the University determines that the violation was egregious, including without limitation an action that places the health or safety of any other person at risk.",
        ),
        asr(
          "p. 55",
          "To encourage reports of Title IX Sexual Harassment, the University normally will offer leniency to a student who reports an alleged violation of this Policy in good faith with respect to other student conduct violations that come to light as a result of such reports.",
          "Policy on Title IX Sexual Harassment",
        ),
      ],
    },
    {
      key: "policy",
      input: {
        policyType: "supportive_measures",
        title: "Supportive Measures (Policy on Harassment, Discrimination, and Sexual Misconduct; Policy on Title IX Sexual Harassment)",
        summary:
          "Under both policies, supportive measures are non-disciplinary, non-punitive individualized services offered free of charge to complainants and respondents, as appropriate and reasonably available, whether or not a formal complaint is filed. They may include counseling, deadline extensions and other course adjustments, changes to work, class, housing or dining arrangements, campus escorts, mutual no-contact directives, leaves of absence, increased security and honoring court orders of protection. The University offers them to any victim who asks, regardless of whether the incident is reported to police, and keeps them confidential so far as that does not impair providing them. CARES describes University No-Contact Directives as mutual and non-punitive and available without a formal complaint.",
        effectiveDate: null,
      },
      citations: [
        web(
          "harassmentPolicy",
          "XIII. Appendix, A. Definitions",
          "“Supportive Measures” are non-disciplinary, non-punitive individualized services offered as appropriate, as reasonably available, and without fee or charge to a Complainant or Respondent.",
        ),
        asr(
          "p. 40",
          "Supportive Measures may include but are not limited to counseling, extensions of deadlines or other course-related adjustments, modifications of work or class schedules, campus escort services, mutual restrictions on contact between parties, changes in work or housing locations, adjustments to dining arrangements, leaves of absence, increased security or monitoring of certain areas of the campus, and honoring an order of protection or no-contact order entered by a State civil or criminal court.",
        ),
        asr(
          "p. 26",
          "The University will maintain as confidential any supportive measures provided to victims and the accused, to the extent that maintaining such confidentiality would not impair the ability of the University to provide supportive measures.",
        ),
        asr(
          "p. 26",
          "The University will offer to provide supportive measures and accommodations, which may include, but are not limited to, University no-contact orders, changes to academic, living, dining, transportation, and working situations, and honoring an order or protection or no-contact order entered by a State civil or criminal court, to any victim who asks for them, so long as they are reasonably available, regardless of whether the victim reports the incident to campus police and local law enforcement.",
        ),
      ],
    },

    // -----------------------------------------------------------------------------------------------------------
    // Timeline
    // -----------------------------------------------------------------------------------------------------------
    {
      key: "institution_action",
      input: {
        actionDate: "2020-08-14",
        datePrecision: "day",
        actionType: "policy_change",
        title: "University adopts Policy on Title IX Sexual Harassment",
        description:
          "According to the University's November 1, 2023 report under the Illinois Preventing Sexual Violence in Higher Education Act, the University of Chicago adopted a separate Policy on Title IX Sexual Harassment on August 14, 2020, in line with the U.S. Department of Education's rules implementing Title IX. Before that date, incidents were handled under the Policy on Harassment, Discrimination, and Sexual Misconduct, which remained in place for matters outside the Title IX definition.",
      },
      citations: [
        ipsvhe(
          "p. 2, note 1",
          "Prior to August 14th, 2020, incidents were handled in accordance with the University’s Policy on Harassment, Discrimination, and Sexual Misconduct. The University adopted an additional Policy on Title IX Sexual Harassment on August 14, 2020, in accordance with the U.S. Department of Education’s rules implementing Title IX. Other policies remained in place, including the University’s Policy on Harassment, Discrimination, and Sexual Misconduct.",
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
        name: "UChicago CARES and the Title IX Coordinator (Equal Opportunity Programs, Office of the Provost)",
        description:
          "The Center for Awareness, Resolution, Education, and Support handles reports, supportive measures and resolution options for sexual misconduct; the Associate Provost for Equal Opportunity Programs is the Title IX Coordinator for the University (direct line 773.702.5671, 6030 S. Ellis Ave.; the ASR also gives 5525 S. Ellis Ave., Suite B). Email uchicagocares@uchicago.edu. Reports can be made online at https://cares.uchicago.edu/make-a-report/, anonymously if no name is given. The policy describes a report to the Title IX Coordinator as private, not confidential.",
        phone: "(773) 834-6367",
        url: "https://cares.uchicago.edu/",
        hours: null,
        available247: null,
        sortOrder: 0,
      },
      citations: [
        web("caresHome", "Footer", "(773) 834-OEOP (6367) uchicagocares@uchicago.edu", "CARES phone and email"),
        asr("p. 93", "Title IX Coordinator for the University 773.834.6367", "Phone given in the ASR's contact list"),
        asr(
          "p. 32",
          "Associate Provost for Equal Opportunity Programs and Title IX Coordinator for the University bcollier@uchicago.edu 773.702.5671 6030 S. Ellis Ave., Chicago, IL 60637",
          "Title IX Coordinator's direct contact details",
        ),
        asr("p. 32", "Report online: https://cares.uchicago.edu/make-a-report/", "Online report"),
        asr(
          "p. 32",
          "Please note that reporting an incident to the Associate Provost/Title IX Coordinator for the University (or their designees) is private, and it does not mean the person who experienced sexual misconduct, dating violence, domestic violence, or stalking somehow loses control of the process.",
          "Private, not confidential",
        ),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "campus_police",
        confidentiality: "institutional_reporting",
        name: "University of Chicago Police Department (UCPD)",
        description:
          "6054 South Drexel Ave. Dial 123 from a campus phone, press the button on a campus emergency phone, or use the UChicago Safe app. UCPD notifies the Title IX Coordinator of reports involving community members and the Sexual Assault Dean-on-Call when the victim is a student. Reporting does not oblige a person to press charges.",
        phone: "773-702-8181",
        url: null,
        hours: "24 hours",
        available247: true,
        sortOrder: 0,
      },
      citations: [
        asr("p. 59", "University of Chicago Police Department: 773-702-8181 or 1-2-3 from a campus phone (24- hours)", "Phone and hours"),
        asr(
          "p. 59",
          "A UCPD officer can be summoned by calling 773.702.8181, pressing the red button on any of the emergency phones located throughout the community, or coming directly to the UCPD office at 6054 South Drexel Ave.",
          "Address",
        ),
        asr("p. 43", "Reporting an incident does not obligate a person to press charges."),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "victim_advocacy",
        confidentiality: "unknown",
        name: "UCPD Victim and Witness Services",
        description:
          "The Director of Victim and Witness Services in the Department of Safety and Security helps survivors through the criminal justice process, from an initial report (if the survivor wants one) through sentencing. Email ucpd-vws@lists.uchicago.edu. Listed by Student Wellness among \"Other On-Campus Resources\", not among confidential resources.",
        phone: "773.702.4912",
        url: null,
        hours: null,
        available247: null,
        sortOrder: 1,
      },
      citations: [
        web(
          "wellnessSurvivors",
          "Other On-Campus Resources",
          "The Director of Victim and Witness Services helps survivors navigate the criminal justice process, from filing an initial report, if that is what the survivor wants to do, all the way through to sentencing. You can reach the Director of Victim and Witness Services directly by calling 773.702.4912 or emailing ucpd-vws@lists.uchicago.edu",
          "Services and contact details",
        ),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "local_law_enforcement",
        confidentiality: "institutional_reporting",
        name: "Chicago Police Department",
        description:
          "For anyone who prefers not to report to UCPD. Emergency 911; non-emergency 311 or 312.744.5000. Sources differ on the prefix needed from a campus phone (\"9.911\", \"9-1-1\", \"9-9-1-1\").",
        phone: "911",
        url: null,
        hours: "24 hours",
        available247: true,
        sortOrder: 0,
      },
      citations: [
        asr(
          "p. 25",
          "Anyone who prefers not to report to the University of Chicago Police Department may contact the Chicago Police Department: 911 (24 hours) or 9.911 from a campus phone.",
        ),
        asr("p. 26", "City of Chicago Police Emergency: 911 City of Chicago Non-Emergency: 311 or 312.744.5000", "Non-emergency numbers"),
        web("wellnessSurvivors", "Reporting Options", "9-1-1 (24-hours) or 9-9-1-1 from a campus phone", "Campus-phone prefix as given by Student Wellness"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "title_ix",
        confidentiality: "institutional_reporting",
        name: "U.S. Department of Education Office for Civil Rights, Chicago Office",
        description:
          "External agency where members of the University community may file a Title IX complaint. JCK Federal Building, 230 S. Dearborn St., 37th Floor, Chicago, IL 60604. TDD: 800-877-8339.",
        phone: "(312) 730-1560",
        url: null,
        hours: null,
        available247: null,
        sortOrder: 1,
      },
      citations: [
        asr(
          "p. 47",
          "All members of the University community may also contact the Office for Civil Rights (a division of the United States Department of Education) to file a complaint pertaining to Title IX:",
        ),
        asr(
          "p. 47",
          "Office for Civil Rights Chicago Office U.S. Department of Education JCK Federal Building 230 S. Dearborn St., 37th Floor Chicago, IL 60604 (312) 730-1560 TDD: 800-877-8339",
          "Contact details",
        ),
      ],
    },

    // -----------------------------------------------------------------------------------------------------------
    // Resources: confidential (as stated in the cited sources)
    // -----------------------------------------------------------------------------------------------------------
    {
      key: "student_resource",
      input: {
        category: "confidential",
        confidentiality: "confidential",
        name: "Sexual Assault Dean-on-Call (SADoC)",
        description:
          "A University administrator with 40+ hours of sexual assault crisis-intervention training, available to students 24/7, who can explain medical, police and University options and arrange support. Call UCPD dispatch and ask for the Sexual Assault Dean-on-Call (leave a call-back number), or text through the UChicago HELP button in the UChicago Safe app; the ASR's contact list and Student Wellness also give 773.834.HELP (4357). No identifying information needs to be shared. UChicago HELP notes that a disclosure may still lead the University to investigate, without identifying the student, and that confidential resources must report suspected abuse of anyone under 18.",
        phone: "773-702-8181",
        url: "https://help.uchicago.edu/sexual-assault-dean-on-call/",
        hours: "24/7",
        available247: true,
        sortOrder: 0,
      },
      citations: [
        asrConfidentialList,
        asr(
          "p. 4",
          "The Sexual Assault Dean-on-Call is a University administrator specifically trained for 40+ hours in sexual assault crisis intervention. This administrator is available 24/7.",
          "Training and hours",
        ),
        web(
          "caresConfidential",
          "Sexual Assault Dean on Call",
          "The Sexual Assault Dean on Call (SADoC) is a confidential resource available to students 24/7, and is specially trained to assist students who have experienced sexual or relationship violence.",
          "Confidential",
        ),
        asr("p. 93", "Sexual Assault Dean-on-Call 773.702.8181 or 773.834.HELP (4357)", "Alternative number"),
        web(
          "sadocConfidentiality",
          "Confidentiality",
          "Disclosures to any Sexual Assault Dean-on-Call may lead to the University launching an investigation into the incident, even in the absence of any identifying information or the reporting student’s consent. If an investigation does proceed, the reporting student will not be identified and will not be compelled to participate.",
          "Limit on confidentiality",
        ),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "counseling",
        confidentiality: "confidential",
        name: "UChicago Student Wellness: Counseling and Mental Health Care",
        description:
          "Confidential, trauma-informed therapy for eligible students, with a trauma services coordinator who is also the Title IX liaison. 840 East 59th Street. Appointments at 773.834.9355 (773-834-WELL; ASR p. 60 and the Title IX policy page print \"773-702-WELL\"); urgent concerns: 24/7 Therapist-on-Call, 773.702.3625; walk-in Monday–Friday, 8:30 a.m.–5 p.m.",
        phone: "773.834.9355",
        url: "https://wellness.uchicago.edu/",
        hours: "Therapist-on-Call 24/7; walk-in Monday–Friday, 8:30 a.m.–5 p.m.",
        available247: true,
        sortOrder: 0,
      },
      citations: [
        asrConfidentialList,
        web(
          "wellnessSurvivors",
          "UChicago Student Wellness Counseling and Mental Health Care",
          "Confidential and trauma-informed therapy and support are available to eligible UChicago undergraduate, graduate, and professional students.",
          "Confidential",
        ),
        web("wellnessSurvivors", "UChicago Student Wellness Counseling and Mental Health Care", "Call 24/7 Therapist-on-Call: 773.702.3625", "24/7 line"),
        web("wellnessGetHelp", "Urgent Mental Health Services", "24/7 Therapist On-Call: 773.702.3625", "24/7 line"),
        asr("p. 44", "Student Wellness: 773-834-WELL, 840 East 59th Street", "Address"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "medical",
        confidentiality: "confidential",
        name: "UChicago Student Wellness: Medical Care (including Sexual Assault Nurse Examiners)",
        description:
          "Follow-up health care after an assault for students, including pregnancy and STI testing, from physicians and nurse practitioners; specially trained Sexual Assault Nurse Examiners (SANE) provide confidential trauma-informed care and can connect students with the Sexual Assault Dean-on-Call or refer them to the Emergency Department. Acute post-assault treatment is at the UChicago Medicine Emergency Department. 840 East 59th Street. The survivors page calls 773.834.9355 a \"24/7 Nurse Line\"; the Get Help Now page lists that number for business hours and a separate 24/7 Nurse Advice Line, 866.243.1242.",
        phone: "773.834.9355",
        url: "https://wellness.uchicago.edu/",
        hours: null,
        available247: null,
        sortOrder: 1,
      },
      citations: [
        asr(
          "p. 4",
          "confidential resources (Sexual Assault Deans-on-Call, UChicago Student Wellness, ordained religious advisors)",
          "Confidential",
        ),
        web(
          "wellnessSurvivors",
          "UChicago Student Wellness Medical Care",
          "There are specially trained Sexual Assault Nurse Examiners (SANE) with specialized training and education who can work with individuals who have experienced sexual assault, abuse, or incest and deliver confidential trauma-informed care.",
          "SANE nurses",
        ),
        web("wellnessSurvivors", "UChicago Student Wellness Medical Care", "Call the 24/7 Nurse Line at 773.834.9355.", "Nurse line as given on the survivors page"),
        web("wellnessGetHelp", "Urgent Medical Care", "Nurse Advice Line (24/7): Call 866.243.1242 anytime.", "Separate 24/7 nurse line"),
        asr(
          "p. 44",
          "While acute, immediate post-assault treatment is provided at the Emergency Room at 5656 S. Maryland Ave, the Student Health Service offers follow-up care, including health care services for students who have chosen not seek care immediately after an assault.",
          "Follow-up care",
        ),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "confidential",
        confidentiality: "confidential",
        name: "Confidential Advisor (UChicago Student Wellness)",
        description:
          "A licensed clinician with an additional 40 hours of training on sexual violence, available by appointment through Student Wellness (ask for the Confidential Advisor). 840 East 59th Street. Communication with the Confidential Advisor is privileged.",
        phone: "773-834-WELL",
        url: "https://wellness.uchicago.edu/",
        hours: "By appointment",
        available247: false,
        sortOrder: 1,
      },
      citations: [
        asr(
          "p. 44",
          "A Confidential Advisor is available by appointment through Student Wellness. This is a licensed clinician who has received an additional 40 hours of training on Sexual Violence. Communication with a Confidential Advisor is considered privileged communication.",
          "Services and confidentiality",
        ),
        asr("p. 44", "Confidential Advisor: 773-834-WELL, 840 East 59th Street (Ask to Speak with a Confidential Advisor)", "Contact details"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "confidential",
        confidentiality: "confidential",
        name: "Ordained Religious Advisors (Spiritual Life)",
        description:
          "Students, faculty and staff can speak confidentially with Spiritual Life advisors for spiritual care. Email spirit@uchicago.edu. The ASR gives two phone numbers: 773.702.2100 (p. 26) and 773-834-1885 (pp. 32, 50).",
        phone: "773-834-1885",
        url: "http://spirit.uchicago.edu/",
        hours: null,
        available247: null,
        sortOrder: 2,
      },
      citations: [
        asrConfidentialList,
        asr("p. 32", "Ordained Religious Advisors by calling 773-834-1885 or emailing spirit@uchicago.edu.", "Contact details"),
        web(
          "caresConfidential",
          "Spiritual Life Advisors",
          "Students can speak confidentially with Advisors through Spiritual Life at UChicago to seek spiritual care.",
          "Confidential",
        ),
        asr("p. 44", "For more information, visit http://spirit.uchicago.edu/", "Website"),
      ],
    },

    // -----------------------------------------------------------------------------------------------------------
    // Resources: emergency medical care
    // -----------------------------------------------------------------------------------------------------------
    {
      key: "student_resource",
      input: {
        category: "medical",
        confidentiality: "unknown",
        name: "University of Chicago Medicine Adult Emergency Department",
        description:
          "Nearest hospital to the Hyde Park campus; follows State-approved procedures for treating sexual assault survivors. A medical forensic examination is available at no cost, the State pays for emergency care for uninsured survivors, and a Sexual Assault Survivor Advocate or (for students) the Sexual Assault Dean-on-Call can be called. City police are notified by law; the survivor chooses whether to file a report. 5656 S. Maryland Ave. (the ASR also prints 5655, p. 26).",
        phone: "773-702-6250",
        url: null,
        hours: "24 hours",
        available247: true,
        sortOrder: 0,
      },
      citations: [
        asr(
          "p. 43",
          "University of Chicago Medicine Adult Emergency Room: Medical and Counseling Services: 773-702-6250, 5656 S. Maryland Ave., Chicago (24-hours)",
          "Contact details and hours",
        ),
        asr(
          "p. 43",
          "The State will pay for emergency room care for victims who have been sexually assaulted and do not have health insurance; if a victim provides health insurance information to the emergency room, the emergency room will bill the insurance company and the policy holder will be notified as usual.",
        ),
        asr("p. 43", "A Sexual Assault Survivor Advocate or a Sexual Assault Dean-on-Call (for a student) may be called based on a victim’s preferences."),
        asr("p. 43", "By law, city police are notified, and the victim may choose to file a report.", "Police notification"),
        asr("p. 26", "University of Chicago Medicine Adult Emergency Department: 773.702.6250; 5655 S. Maryland Ave.", "Different street number on p. 26"),
      ],
    },

    // -----------------------------------------------------------------------------------------------------------
    // Resources: off-campus
    // -----------------------------------------------------------------------------------------------------------
    {
      key: "student_resource",
      input: {
        category: "victim_advocacy",
        confidentiality: "confidential",
        name: "Chicago Rape Crisis Hotline",
        description:
          "24/7 advocacy and support, including information about sexual assault examinations and evidence collection, referrals to law enforcement, and community resources; immediate and long-term referrals and counseling. Student Wellness lists the same number as RAINN's \"Chicago Region\" line.",
        phone: "888-293-2080",
        url: null,
        hours: "24 hours",
        available247: true,
        sortOrder: 0,
      },
      citations: [
        asrConfidentialList,
        asr("p. 45", "Chicago Rape Crisis Hotline (24 hours): 888-293-2080 Immediate and long-term referrals, information, and counseling.", "Services and hours"),
        web(
          "caresCommunity",
          "Community resources in the area",
          "24/7 advocacy and support, including information about sexual assault examination and evidence collection, referrals to law enforcement, and information about available community resources. Available by phone at 888-293-2080",
          "Services",
        ),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "victim_advocacy",
        confidentiality: "confidential",
        name: "Resilience (formerly Rape Victim Advocates)",
        description:
          "Free counseling (individual, family and group), medical advocacy including accompaniment to the ER for care or evidence collection, and legal advocacy including civil no-contact orders and orders of protection. 180 N. Michigan Ave. #600, Chicago. Email info@ourresilience.org.",
        phone: "312-443-9603",
        url: "https://www.ourresilience.org/",
        hours: null,
        available247: null,
        sortOrder: 1,
      },
      citations: [
        web(
          "wellnessSurvivors",
          "Off-Campus Confidential",
          "Off-Campus Confidential Resilience (Formerly known as Rape Victim Advocates): Resilience provides free counseling services (individual, family, and group), medical and legal advocacy, and education and training for survivors and for friends and partners of survivors.",
          "Listed as off-campus confidential; services",
        ),
        asr("p. 45", "Resilience: 312-443-9603 Counseling and legal advocacy 180 N. Michigan Ave. #600, Chicago, 60601 https://www.ourresilience.org/", "Contact details"),
        web(
          "caresCommunity",
          "Community resources in the area",
          "Medical advocacy, which can include accompaniment to an ER for medical services or for evidence collection, assistance in follow-up medical appointments, and questions about any billing concerns",
          "Medical advocacy",
        ),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "victim_advocacy",
        confidentiality: "confidential",
        name: "YWCA Metropolitan Chicago",
        description:
          "Counseling and legal advocacy; CARES also lists medical advocacy. 1 N. LaSalle St. #1150, Chicago. The ASR's Confidential Resources list gives \"YWCA: 866.525.9922\" (p. 26); the policy resource lists give 312-372-6600 for YWCA Metropolitan Chicago and 773-955-3100 for the Parks Francis YWCA, 6600 S. Cottage Grove Ave., near the Hyde Park campus.",
        phone: "312-372-6600",
        url: "http://www.ywcachicago.org",
        hours: null,
        available247: null,
        sortOrder: 2,
      },
      citations: [
        asrConfidentialList,
        asr("p. 45", "YWCA Metropolitan Chicago: 312-372-6600 Counseling and legal advocacy 1 N. LaSalle St. #1150, Chicago, 60602 http://www.ywcachicago.org", "Contact details"),
        asr("p. 45", "Parks Francis YWCA: 773-955-3100 Counseling and legal advocacy 6600 S. Cottage Grove Ave., Chicago, 60637", "South Side location"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "counseling",
        confidentiality: "confidential",
        name: "Greenlight Family Services",
        description: "Free and confidential counseling for students who have experienced sexual, domestic or dating violence. Confidential helpline and intake line.",
        phone: "773.750.7077",
        url: "https://greenlightfamilyservices.org/services/counseling",
        hours: null,
        available247: null,
        sortOrder: 1,
      },
      citations: [
        web(
          "wellnessSurvivors",
          "Off-Campus Confidential",
          "Greenlight Family Services offers free and confidential counseling to students who have experienced sexual, domestic, or dating violence.",
          "Confidential; services",
        ),
        web("wellnessSurvivors", "Off-Campus Confidential", "Confidential helpline and intake: 773.750.7077.", "Phone"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "victim_advocacy",
        confidentiality: "unknown",
        name: "City of Chicago Domestic Violence Help Line (Mayor's Office)",
        description: "24-hour information and referrals for shelters, counseling, legal advocacy and more.",
        phone: "877-863-6338",
        url: null,
        hours: "24 hours",
        available247: true,
        sortOrder: 3,
      },
      citations: [
        asr(
          "p. 61",
          "Mayor’s Office for Domestic Violence Help Line (24 hours): 877-863-6338 Information and referrals for shelters, counseling, legal advocacy, and more",
          "Services, hours and phone",
        ),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "victim_advocacy",
        confidentiality: "confidential",
        name: "RAINN (Rape, Abuse & Incest National Network) National Sexual Assault Hotline",
        description:
          "Confidential national hotline giving access to support, information and local resources from trained staff, with live online chat. Student Wellness also gives 888.293.2080 \"for Chicago Region\" (the Chicago Rape Crisis Hotline number).",
        phone: "800.656.HOPE (4673)",
        url: "https://www.rainn.org/about-national-sexual-assault-telephone-hotline",
        hours: null,
        available247: null,
        sortOrder: 4,
      },
      citations: [
        web(
          "wellnessSurvivors",
          "Off-Campus Confidential",
          "RAINN is a confidential National Sexual Assault Hotline which provides access to support, information and local resources by trained professionals. Call 800.656.HOPE (4673) or 888.293.2080 for Chicago Region.",
          "Confidential; phone",
        ),
      ],
    },
  ],
};
