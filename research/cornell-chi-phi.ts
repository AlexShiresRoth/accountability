// Case: civil suit and criminal review following an alleged 2024 sexual assault at Cornell's Chi Phi house.
//
// Researched 2026-10-03 by Claude from primary records. Status after import: pending_review.
// This is a developing matter. Re-check every source before verifying, and add later developments as new events.
//
// Editorial choices (review them):
// - No individual is named. The complaint names seven former students as defendants; naming them is not needed to
//   document the institutional and legal process, and no criminal charges have been filed.
// - Nothing from the plaintiff's own account is reproduced beyond what is needed to state what is alleged. The DA's
//   statement quotes her 2024 sworn statement at length; none of that detail is used.
// - Accounts conflict (the complaint, the District Attorney, Cornell, the Governor). Each claim is attributed to the
//   party that made it; no event states a disputed fact as established.
// - The setting is left "unspecified" and no address is recorded.
//
// Sources: the complaint was read from the filed copy (NYSCEF Doc. No. 1, stamped "FILED: NEW YORK COUNTY CLERK
// 09/16/2026 07:05 PM", Index No. 161704/2026); its excerpts are verbatim. The other statements were retrieved through a
// fetch tool that returns page text; their citations carry page context but no excerpts, so a researcher should open
// each page and confirm the wording before verifying.
//
// Not entered (follow-up):
// - The Attorney General's separate review of Cornell's response (reported by CNN on 2026-09-29; no primary AG record
//   located, and CNN blocks automated access).
// - Cornell's agreement to an independent review (announced by the Governor on social media; not retrieved).
// - The Cornell Daily Sun's report that Cornell removed a statement from its FAQ page.

import type { ResearchBundle } from "@/lib/admin/research-bundle";

const complaint = (pinpoint: string, excerpt?: string, claim?: string) => ({ source: "complaint", pinpoint, excerpt, claim });

export const cornellChiPhi: ResearchBundle = {
  college: { slug: "cornell-university" },
  sources: {
    complaint: {
      type: "civil_complaint",
      publisher: "Supreme Court of the State of New York, County of New York",
      title: "Jane Doe v. Cornell University, et al., Index No. 161704/2026: Summons and Complaint (NYSCEF Doc. No. 1)",
      url: "https://www.courthousenews.com/wp-content/uploads/2026/09/doe-cornell-new-york-supreme.pdf",
      archivedUrl: null,
      publicationDate: "2026-09-16",
      retrievedAt: "2026-10-03",
      documentPath: null,
      notes: "Copy of the filed complaint published by Courthouse News Service. Filing stamp: New York County Clerk, 09/16/2026 07:05 PM.",
      internalNotes: "Contains names of individual defendants and graphic allegations. Do not quote either.",
    },
    cornell20241126: {
      type: "university",
      publisher: "Cornell University (Interim President Michael I. Kotlikoff)",
      title: "Update on disturbing allegations of sexual violence",
      url: "https://statements.cornell.edu/2024/20241126-update.cfm",
      archivedUrl: null,
      publicationDate: "2024-11-26",
      retrievedAt: "2026-10-03",
      documentPath: null,
      notes: null,
    },
    cornell20260921: {
      type: "university",
      publisher: "Cornell University (Vice President for University Relations)",
      title: "Statement on lawsuit regarding 2024 sexual violence allegations",
      url: "https://statements.cornell.edu/2026/20260921-update.cfm",
      archivedUrl: null,
      publicationDate: "2026-09-21",
      retrievedAt: "2026-10-03",
      documentPath: null,
      notes: null,
    },
    cornell20260928: {
      type: "university",
      publisher: "Cornell University (Vice President for University Relations)",
      title: "District Attorney's investigation of 2024 sexual assault allegations",
      url: "https://statements.cornell.edu/2026/20260928-da-investigation.cfm",
      archivedUrl: null,
      publicationDate: "2026-09-28",
      retrievedAt: "2026-10-03",
      documentPath: null,
      notes: null,
    },
    da20260928: {
      type: "local_government",
      publisher: "Tompkins County District Attorney",
      title: "District Attorney statement re: Jane Doe v. Cornell University, et al",
      url: "https://www.tompkinscountyny.gov/News-articles/District-Attorney-statement-regarding-Jane-Doe-v.-Cornell-University-et-al",
      archivedUrl: null,
      publicationDate: "2026-09-28",
      retrievedAt: "2026-10-03",
      documentPath: null,
      notes: null,
      internalNotes: "Quotes the plaintiff's 2024 sworn statement at length. Do not reproduce any of it.",
    },
    governor20260929: {
      type: "state_government",
      publisher: "Office of the Governor of New York",
      title: "Statement From Governor Hochul on Cornell University Sexual Assault Case",
      url: "https://www.governor.ny.gov/news/statement-governor-hochul-cornell-university-sexual-assault-case",
      archivedUrl: null,
      publicationDate: "2026-09-29",
      retrievedAt: "2026-10-03",
      documentPath: null,
      notes: null,
    },
    eo64: {
      type: "state_government",
      publisher: "Office of the Governor of New York",
      title:
        "Executive Order No. 64: Appointing a Special Prosecutor to Investigate and, If Warranted, Prosecute Matters Relating to an Alleged Sexual Assault Occurring in Tompkins County on October 19-20, 2024",
      url: "https://www.governor.ny.gov/executive-order/no-64-appointing-special-prosecutor-investigate-and-if-warranted-prosecute-matters",
      archivedUrl: null,
      publicationDate: "2026-10-01",
      retrievedAt: "2026-10-03",
      documentPath: null,
      notes: null,
    },
    governor20261001: {
      type: "state_government",
      publisher: "Office of the Governor of New York",
      title: "Statement From Governor Hochul on the Cornell University Sexual Assault Case",
      url: "https://www.governor.ny.gov/news/statement-governor-hochul-cornell-university-sexual-assault-case-0",
      archivedUrl: null,
      publicationDate: "2026-10-01",
      retrievedAt: "2026-10-03",
      documentPath: null,
      notes: null,
    },
    ag20261001: {
      type: "state_government",
      publisher: "Office of the New York State Attorney General",
      title: "Attorney General James Releases Statement on Appointment as Special Prosecutor",
      url: "https://ag.ny.gov/press-release/2026/attorney-general-james-releases-statement-appointment-special-prosecutor",
      archivedUrl: null,
      publicationDate: "2026-10-01",
      retrievedAt: "2026-10-03",
      documentPath: null,
      notes: null,
    },
  },
  reports: [],

  cases: [
    {
      slug: "cornell-2024-chi-phi",
      title: "Civil suit and criminal review following an alleged 2024 sexual assault at Cornell’s Chi Phi house",
      summary:
        "In a civil suit filed in September 2026, a former Cornell student alleges she was drugged and sexually assaulted by members of the Chi Phi fraternity in October 2024, and that Cornell is liable for its handling of the matter. Cornell, the Tompkins County District Attorney, and the Governor of New York have given differing accounts of how the university and prosecutors handled her report. In October 2026 the Governor appointed the Attorney General as special prosecutor. As of October 3, 2026, no criminal charges had been filed, according to the sources reviewed.",
      locationContext: "unspecified",
      publicationJustification:
        "Documents a university's and law enforcement's handling of a reported sexual assault, now the subject of a civil suit, a state-appointed special prosecutor, and conflicting public statements by the university, the District Attorney, and the Governor.",
      collegeSlugs: ["cornell-university"],
      citations: [
        complaint("p. 1", undefined, "Parties and court"),
        { source: "governor20260929", pinpoint: "Statement", claim: "The Governor called for an independent review of Cornell's response" },
        { source: "eo64", pinpoint: "Executive Order No. 64", claim: "Appointment of the Attorney General as special prosecutor" },
      ],
      events: [
        {
          ref: "incident",
          eventDate: "2024-10-19",
          datePrecision: "day",
          sequence: 0,
          eventType: "alleged_incident",
          description:
            "The civil complaint alleges that the plaintiff, then a Cornell student, was drugged and sexually assaulted by multiple members of the Chi Phi fraternity at the chapter house on the night of October 19 into October 20, 2024. These are allegations in a civil suit; no court has made findings. The District Attorney has said the plaintiff's 2024 sworn statement gave a different account (see November 2024).",
          citations: [
            complaint("p. 58, ¶ 312", "occurred on the night of October 19, 2024, into the morning of October", "Date of the alleged assault"),
            { source: "eo64", pinpoint: "Recitals", claim: "Executive Order No. 64 describes the assault as alleged to have occurred on October 19-20, 2024" },
          ],
        },
        {
          ref: "chapter-suspension",
          eventDate: "2024-11-08",
          datePrecision: "day",
          sequence: 0,
          eventType: "university_discipline",
          description:
            "Cornell placed the Chi Phi fraternity's Xi Chapter under a temporary suspension order on November 8, 2024, for alleged violations of the Student Code of Conduct, and later issued temporary suspensions to a number of students as interim measures, according to a statement from Cornell's interim president on November 26, 2024. Cornell said in September 2026 that the chapter was closed in 2024 and remains barred from campus.",
          citations: [
            { source: "cornell20241126", pinpoint: "Statement, third paragraph", claim: "Temporary suspension order of November 8, 2024, and interim suspensions of students" },
            { source: "cornell20260928", pinpoint: "Statement", claim: "Chapter closed in 2024 and barred from campus" },
          ],
        },
        {
          ref: "police-report",
          eventDate: "2024-11-01",
          datePrecision: "month",
          sequence: 1,
          eventType: "police_report",
          description:
            "According to the Tompkins County District Attorney, the plaintiff gave a sworn written statement to the Cornell University Police Department, and in November 2024 the department asked the District Attorney's office to review it.",
          citations: [{ source: "da20260928", pinpoint: "Statement", claim: "Sworn statement to Cornell University Police; review requested in November 2024" }],
        },
        {
          ref: "declined",
          eventDate: "2024-11-01",
          datePrecision: "month",
          sequence: 2,
          eventType: "prosecution_declined",
          description:
            "The Tompkins County District Attorney's office decided in November 2024 not to bring criminal charges. In a September 28, 2026 statement, the District Attorney said the facts in the plaintiff's sworn statement did not meet New York's legal requirements for lack of consent. The Governor's Executive Order No. 64 states that the office declined to prosecute without speaking to the plaintiff, relying in part on a sworn statement to campus police that reportedly omitted key portions of her account.",
          citations: [
            { source: "da20260928", pinpoint: "Statement", claim: "District Attorney's account of the November 2024 decision" },
            { source: "eo64", pinpoint: "Recitals", claim: "Governor's account of the November 2024 decision" },
          ],
        },
        {
          ref: "title-ix",
          eventDate: "2025-01-01",
          datePrecision: "month",
          sequence: 0,
          eventType: "investigation_opened",
          description:
            "The complaint alleges that Cornell began a Title IX investigation on or about January 14, 2025, in response to the plaintiff's formal complaint, and that its Title IX office held hearings between May 2 and May 29, 2025. Cornell has said it conducted a Title IX investigation over several months, followed by a hearing before a panel of trained faculty and staff.",
          citations: [
            complaint("pp. 29–30, ¶¶ 183–184", "CORNELL commenced a Title IX investigation", "Start of the Title IX investigation and hearings"),
            { source: "cornell20260928", pinpoint: "Statement", claim: "Cornell's description of its Title IX investigation and hearing" },
          ],
        },
        {
          ref: "lawsuit",
          eventDate: "2026-09-16",
          datePrecision: "day",
          sequence: 0,
          eventType: "civil_complaint",
          description:
            "A civil complaint was filed in New York State Supreme Court, New York County (Jane Doe v. Cornell University, et al., Index No. 161704/2026), against Cornell University, Chi Phi fraternity entities, the plaintiff's sorority, and seven individuals. Its claims include negligence, breach of contract, and violation of the New York State Human Rights Law. Among its allegations, the complaint states that students temporarily suspended in November 2024 were “afforded the opportunity to mitigate their conduct by submitting essays.”",
          citations: [
            complaint("p. 1, filing stamp", "FILED: NEW YORK COUNTY CLERK 09/16/2026 07:05 PM", "Filing date and court"),
            complaint("p. 29, ¶ 181", "afforded the opportunity to mitigate their conduct by submitting essays", "Allegation about essays"),
            complaint("p. 83", "VIOLATION OF NEW YORK STATE HUMAN RIGHTS LAW", "Claims against the university"),
          ],
        },
        {
          ref: "cornell-response",
          eventDate: "2026-09-21",
          datePrecision: "day",
          sequence: 0,
          eventType: "university_discipline",
          description:
            "Cornell said its Office of Civil Rights and Office of Student Conduct and Community Standards investigated and adjudicated the allegations under university policy, and that federal privacy law prevented it from describing individual discipline. On September 28, 2026, Cornell said the hearing panel had issued sanctions including expulsions and suspensions, and that none of the students was offered essays as a sole consequence.",
          citations: [
            { source: "cornell20260921", pinpoint: "Statement", claim: "Investigation and adjudication; privacy constraints" },
            { source: "cornell20260928", pinpoint: "Statement", claim: "Sanctions including expulsions and suspensions" },
          ],
        },
        {
          ref: "reopened",
          eventDate: "2026-09-28",
          datePrecision: "day",
          sequence: 0,
          eventType: "investigation_reopened",
          description:
            "The Tompkins County District Attorney said his office had reopened the investigation and would present the case to a grand jury once appropriate charges are determined. He said the allegations in the civil complaint differed from the plaintiff's 2024 sworn statement.",
          citations: [{ source: "da20260928", pinpoint: "Statement, “Re-opening the Investigation”", claim: "Reopening and planned grand jury presentation" }],
        },
        {
          ref: "special-prosecutor",
          eventDate: "2026-10-01",
          datePrecision: "day",
          sequence: 0,
          eventType: "government_investigation",
          supersedes: "reopened",
          description:
            "Governor Kathy Hochul signed Executive Order No. 64, appointing the New York State Attorney General as special prosecutor to investigate and, if warranted, prosecute offenses arising from the alleged assault. The order supersedes the Tompkins County District Attorney's jurisdiction. The Attorney General said her office would lead the investigation.",
          citations: [
            { source: "eo64", pinpoint: "Order", claim: "Appointment and supersession of the District Attorney" },
            { source: "governor20261001", pinpoint: "Statement", claim: "Governor's reasons for the order" },
            { source: "ag20261001", pinpoint: "Statement", claim: "Attorney General's acceptance" },
          ],
        },
      ],
    },
  ],
};
