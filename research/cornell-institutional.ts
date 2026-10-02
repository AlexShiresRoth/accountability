// Cornell University (Ithaca campus): institutional record.
//
// Transcribed 2026-10-02 by Claude from the 2026 Annual Security Report ("Campus Watch"), pages 6 and 20–23 and 33.
// Status after import: pending_review. A human must check each record against the cited page before verifying.
//
// Every record is cited to the report with a page and a short excerpt. Excerpts are copied from the page as
// printed (checked against rendered page images, since the PDF's embedded text has spacing artifacts).
// Summaries are attributed to the report ("According to the 2026 Annual Security Report…"); they describe what
// Cornell says its process is, not an evaluation of how it works in practice.
//
// Not entered, and why:
// - Timeline entries: the report gives no dated institutional actions. Developments in the Chi Phi matter belong
//   to the case record (step 5b-2), not the general timeline.
// - Policy 6.4's full title, effective date, and current procedures: these are on the Office of Civil Rights site
//   (officeofcivilrights.cornell.edu), which blocked retrieval and has no archived copy. Follow-up for a researcher.
// - Local and state police contact details: the report names them as reporting options but gives no numbers.

import type { ResearchBundle } from "@/lib/admin/research-bundle";

const asr = (pinpoint: string, excerpt: string, claim?: string) => ({ source: "asr2026", pinpoint, excerpt, claim });

export const cornellInstitutional: ResearchBundle = {
  college: { slug: "cornell-university" },
  sources: {
    // Same document as research/cornell-university.ts; the importer reuses the existing source by URL.
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
          "According to the 2026 Annual Security Report, formal complaints of dating and domestic violence, sexual assault, and stalking against students or employees are resolved under University Policy 6.4. The University Title IX Coordinator, in the Cornell Office of Civil Rights, accepts formal complaints and oversees their investigation. The process consists of an investigation, a hearing, and an appeal, and both parties may be accompanied by an advisor or support person of their choice. The report states the office aims to complete an investigation within 90 business days of the respondent being notified.",
      },
      citations: [
        asr("p. 22", "Under Policy 6.4, the University Title IX Coordinator is responsible for accepting, processing, determining jurisdiction, and overseeing the investigation of formal complaints."),
        asr("p. 22", "The formal complaint procedure is administered by the Cornell Office of Civil Rights; it is comprised of an investigation, hearing, and appeal."),
        asr("p. 23", "COCR aims to complete an investigation within ninety (90) business days of the date the accused is notified of the formal complaint."),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "disciplinary_procedures",
        findingKind: "documented",
        summary:
          "According to the 2026 Annual Security Report, findings of responsibility and sanctions under Policy 6.4 are decided by a three-member Hearing Panel with a non-voting Hearing Chair, using a preponderance-of-the-evidence standard. The sanctions listed range from educational steps and written reprimands to suspension for up to three years or dismissal for students, and termination for employees. Either party may appeal to a three-member Appeal Panel, whose decision is final.",
      },
      citations: [
        asr("p. 23", "Findings of responsibility and determinations regarding sanctions and remedies are made through a hearing process conducted by a three-member Hearing Panel and a non-voting Hearing Chair."),
        asr("p. 23", "The standard of evidence under Policy 6.4 is a preponderance of the evidence (i.e., it is more likely than not that the respondent engaged in the prohibited conduct)."),
        asr("p. 23", "All appeals will be heard by a three-member Appeal Panel."),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "law_enforcement_referrals",
        findingKind: "documented",
        summary:
          "According to the 2026 Annual Security Report, victims may report to Cornell Police, local law enforcement, and/or state police, or choose not to report, and may pursue a Policy 6.4 complaint, a criminal complaint, or both. The Title IX Coordinator can assist with notifying law enforcement, and Cornell Police can help with notifying local law enforcement or pursuing a criminal complaint or an order of protection.",
      },
      citations: [
        asr("p. 21", "Victims of Dating and Domestic Violence, Sexual Assault, and Stalking, have the right to make a report to Cornell University Police, local law enforcement, and/or state police or choose not to report"),
        asr("p. 21", "An individual may choose whether to file a formal Policy 6.4 complaint through the Cornell Office of Civil Rights and/or a criminal complaint through the criminal justice system."),
        asr("p. 21", "The Cornell Police on the Ithaca campus or Cornell Tech Safety & Security on the Tech campus can help in notifying local law enforcement or pursuing a criminal complaint or other legal action, such as an order of protection."),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "prevention_programs",
        findingKind: "documented",
        summary:
          "According to the 2026 Annual Security Report, incoming undergraduate students in fall 2025 were required to complete the online program COCR 200 and incoming graduate and professional students COCR 100, both covering university policy and resources, bystander intervention, and risk reduction. New employees complete HR 300 on hire and an annual HR 301 refresher. The report also lists bystander-intervention programming (including Intervene), annual training for student-athletes, required training for registered student organization officers, and training for residential staff.",
      },
      citations: [
        asr("p. 20", "In Fall 2025, incoming first year and transfer students were required to complete the online program COCR 200: Undergraduate Student Responsibility."),
        asr("p. 20", "Cornell requires all new employees to complete the online program HR 300: Employee Responsibility – Sexual and Related Misconduct upon hire."),
        asr("p. 20", "Intervene, an online video as well as an in-person program that provides exposure to a variety of scenarios"),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "reporting_procedures",
        findingKind: "documented",
        summary:
          "According to the 2026 Annual Security Report, reports to the university can be made to the Title IX Coordinator by phone, email, in person at 500 Day Hall, or through an online incident report form, and reports to police by phone, Blue Light phone, in person, or in writing. After a report to the Title IX Coordinator, the victim receives a written explanation of resolution options, resources, and available supportive measures, which are available whether or not the victim also reports to law enforcement.",
      },
      citations: [
        asr("p. 21", "Reports to the University can be made by contacting the University Title IX Coordinator"),
        asr("p. 21", "Reports to law enforcement can be made via phone, Blue Light phone, in person, or in writing."),
        asr("p. 21", "These services are available regardless of whether a victim also reports to law enforcement."),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "outcome_information",
        findingKind: "not_located",
        summary:
          "Aggregate outcome information for Policy 6.4 complaints was not located in the public sources reviewed (the 2026 Annual Security Report). The report states that both parties receive simultaneous written notification of the result of a disciplinary proceeding, and refers readers to the Cornell Office of Civil Rights for statistics on reports of sexual misconduct; that statistical summary has not yet been reviewed.",
      },
      citations: [
        asr("p. 22", "including providing simultaneous notification, in writing, of the result of a disciplinary proceeding, the procedure for appeal, any change in the outcome, and when the outcome becomes final."),
        asr("p. 6", "For information regarding all reports of prohibited sexual and related misconduct made to the University in 2025 see https://officeofcivilrights.cornell.edu/data-statistics/."),
      ],
    },
    {
      key: "institutional_response",
      input: {
        topic: "transparency_practices",
        findingKind: "documented",
        summary:
          "According to the 2026 Annual Security Report, Cornell publishes Clery Act statistics without personally identifying information about victims, and the Office of Civil Rights publishes information on all reports of prohibited sexual and related misconduct made to the university.",
      },
      citations: [
        asr("p. 21", "The University will complete publicly available recordkeeping, including Clery Act reporting and disclosures, without inclusion of personally identifying information about the victim."),
        asr("p. 6", "For information regarding all reports of prohibited sexual and related misconduct made to the University in 2025 see https://officeofcivilrights.cornell.edu/data-statistics/."),
      ],
    },

    // -----------------------------------------------------------------------------------------------------------
    // Policy
    // -----------------------------------------------------------------------------------------------------------
    {
      key: "policy",
      input: {
        policyType: "sexual_misconduct",
        title: "University Policy 6.4",
        summary:
          "The university policy under which complaints against students and employees of dating and domestic violence, sexual assault, sexual exploitation, sexual harassment, sex/gender-based harassment, and stalking are resolved, administered by the Cornell Office of Civil Rights. Procedures are published at https://officeofcivilrights.cornell.edu/policies-procedures/non-discrimination-policy-6-4/current-policy-6-4-procedures.",
        effectiveDate: null,
      },
      citations: [
        asr("p. 22", "Cornell prohibits students and employees from engaging in Dating and Domestic Violence, Sexual Assault, Sexual Exploitation, Sexual Harassment and Sex/Gender-Based Harassment, and Stalking."),
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
        name: "University Title IX Coordinator, Cornell Office of Civil Rights",
        description: "Email titleix@cornell.edu, visit 500 Day Hall, or submit an online incident report. A report to the Title IX Coordinator is a report to the university.",
        phone: "607.255.2242",
        url: "https://cornell.guardianconduct.com/incident-reporting",
        hours: null,
        available247: null,
        sortOrder: 0,
      },
      citations: [asr("p. 21", "Phone: 607.255.2242", "Contact details")],
    },
    {
      key: "student_resource",
      input: {
        category: "campus_police",
        confidentiality: "institutional_reporting",
        name: "Cornell University Police",
        description: "For emergencies call 911 or use a Blue Light phone. G2 Barton Hall, 117 Statler Drive.",
        phone: "607.255.1111",
        url: "https://www.cupolice.cornell.edu",
        hours: null,
        available247: null,
        sortOrder: 0,
      },
      citations: [asr("p. 33", "For non-emergency assistance or general information: Call 607.255.1111", "Contact details")],
    },

    // -----------------------------------------------------------------------------------------------------------
    // Resources: confidential (as listed on p. 22)
    // -----------------------------------------------------------------------------------------------------------
    {
      key: "student_resource",
      input: {
        category: "victim_advocacy",
        confidentiality: "confidential",
        name: "SHARE Office Victim Advocacy Program",
        description:
          "Free, confidential support for students, staff, and faculty, including safety planning, help with reporting options, and accompaniment. Not a crisis service. Email victimadvocate@cornell.edu.",
        phone: "607.255.1212",
        url: "https://health.cornell.edu/services/victim-advocacy",
        hours: "Monday–Friday, 9 a.m.–5 p.m.",
        available247: false,
        sortOrder: 0,
      },
      citations: [
        asr("p. 23", "Victim Advocacy services are confidential and free", "Confidentiality"),
        asr("p. 23", "Hours: M-F, 9am-5pm", "Hours"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "medical",
        confidentiality: "confidential",
        name: "Cornell Health",
        description:
          "Medical and mental health care for students. Staff can arrange transport to Cornell Health or Cayuga Medical Center after an assault; confidential consultations are available 24 hours a day.",
        phone: "607.255.5155",
        url: "https://health.cornell.edu",
        hours: "24-hour phone consultation",
        available247: true,
        sortOrder: 0,
      },
      citations: [
        asr("p. 22", "Cornell Health (medical and mental health providers, students only): 607.255.5155", "Confidential resource"),
        asr("p. 20", "Confidential consultations through Cornell Health are available 24 hours a day to provide information to survivors of sexual assault at Cornell.", "24-hour availability"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "victim_advocacy",
        confidentiality: "confidential",
        name: "Advocacy Center of Tompkins County",
        description: "Independent of Cornell, with no duty to consult with the university. Email info@actompkins.org.",
        phone: "607.277.5000",
        url: null,
        hours: "24/7 hotline",
        available247: true,
        sortOrder: 1,
      },
      citations: [
        asr("p. 22", "The Advocacy Center of Tompkins County 24/7 hotline: 607.277.5000", "Contact details"),
        asr("p. 22", "The Advocacy Center is independent of Cornell and has no duty to consult with the University.", "Independence"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "victim_advocacy",
        confidentiality: "confidential",
        name: "New York State Domestic and Sexual Violence Hotline",
        description: "Confidential support beyond the campus resources listed.",
        phone: "1.800.942.6906",
        url: null,
        hours: null,
        available247: null,
        sortOrder: 2,
      },
      citations: [asr("p. 22", "call the New York State Domestic and Sexual Violence hotline 1.800.942.6906", "Contact details")],
    },
    {
      key: "student_resource",
      input: {
        category: "counseling",
        confidentiality: "confidential",
        name: "Faculty and Staff Assistance Program (FSAP)",
        description: "For benefits-eligible faculty, staff, postdoctoral fellows and associates, visiting scholars, and retirees.",
        phone: "607.255.2673",
        url: null,
        hours: null,
        available247: null,
        sortOrder: 1,
      },
      citations: [asr("p. 22", "The Cornell Faculty and Staff Assistance Program (FSAP)", "Confidential resource")],
    },
    {
      key: "student_resource",
      input: {
        category: "counseling",
        confidentiality: "confidential",
        name: "Office of Spirituality and Meaning Making and Cornell United Religious Work chaplains",
        description: "Professional staff and pastoral counselors.",
        phone: "607.255.6002",
        url: null,
        hours: null,
        available247: null,
        sortOrder: 2,
      },
      citations: [asr("p. 22", "pastoral counselors of Cornell United Religious Work Chaplains (CURW): 607.255.6002", "Confidential resource")],
    },
    {
      key: "student_resource",
      input: {
        category: "confidential",
        confidentiality: "confidential",
        name: "Gender Equity Resource Center",
        description:
          "Professional staff. Does not share personally identifiable information with the Title IX Coordinator, but may share de-identified statistical information. Email GenEq@cornell.edu.",
        phone: "607.255.0015",
        url: null,
        hours: null,
        available247: null,
        sortOrder: 0,
      },
      citations: [
        asr("p. 22", "The professional staff of the Cornell Gender Equity Resource Center: 607.255.0015", "Contact details"),
        asr("p. 22", "they may share with the University’s Title IX Coordinator de-identified statistical or other information regarding prohibited conduct under Policy 6.4.", "De-identified sharing"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "confidential",
        confidentiality: "confidential",
        name: "LGBT Resource Center",
        description:
          "Professional staff. Does not share personally identifiable information with the Title IX Coordinator, but may share de-identified statistical information. Email lgbtrc@cornell.edu.",
        phone: "607.254.4987",
        url: null,
        hours: null,
        available247: null,
        sortOrder: 1,
      },
      citations: [
        asr("p. 22", "The professional staff of the Cornell LGBT Resource Center: 607.254.4987", "Contact details"),
        asr("p. 22", "they may share with the University’s Title IX Coordinator de-identified statistical or other information regarding prohibited conduct under Policy 6.4.", "De-identified sharing"),
      ],
    },
    {
      key: "student_resource",
      input: {
        category: "confidential",
        confidentiality: "confidential",
        name: "Cornell University Ombuds",
        description:
          "Does not share personally identifiable information with the Title IX Coordinator, but may share de-identified statistical information. Email ombuds@cornell.edu.",
        phone: "607.255.4321",
        url: null,
        hours: null,
        available247: null,
        sortOrder: 2,
      },
      citations: [
        asr("p. 22", "The Cornell University Ombuds: 607.255.4321", "Contact details"),
        asr("p. 22", "they may share with the University’s Title IX Coordinator de-identified statistical or other information regarding prohibited conduct under Policy 6.4.", "De-identified sharing"),
      ],
    },
  ],
};
