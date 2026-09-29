// Enum values shared by the database schema, admin forms, and public UI.
// Changing a value here requires a migration (`pnpm db:generate`).

export { sourceTypeKeys as sourceTypes, type SourceType } from "./source-types";

export const verificationStatuses = ["draft", "pending_review", "verified", "rejected", "needs_update"] as const;
export type VerificationStatus = (typeof verificationStatuses)[number];

/** Statuses that may appear on public pages. `needs_update` is shown with an "under review" notice. */
export const PUBLIC_STATUSES = ["verified", "needs_update"] as const satisfies readonly VerificationStatus[];

// Clery Act sexual offenses (rape, fondling, incest, statutory rape) and VAWA offenses.
// Incest and statutory rape are stored because reports list them; profiles lead with the other five.
export const offenses = [
  "rape",
  "fondling",
  "incest",
  "statutory_rape",
  "domestic_violence",
  "dating_violence",
  "stalking",
] as const;
export type Offense = (typeof offenses)[number];

// On-campus residential is a SUBSET of on-campus. Geographies must never be summed.
export const cleryGeographies = ["on_campus", "on_campus_residential", "noncampus", "public_property"] as const;
export type CleryGeography = (typeof cleryGeographies)[number];

export const datePrecisions = ["day", "month", "year", "approximate"] as const;
export type DatePrecision = (typeof datePrecisions)[number];

export const caseEventTypes = [
  "alleged_incident",
  "police_report",
  "university_report",
  "investigation_opened",
  "university_discipline",
  "arrest",
  "criminal_charge",
  "prosecution_declined",
  "civil_complaint",
  "settlement",
  "conviction",
  "acquittal",
  "dismissal",
  "investigation_reopened",
  "institutional_reform",
  "government_investigation",
] as const;
export type CaseEventType = (typeof caseEventTypes)[number];

// Deliberately coarse. Precise or residential locations are never stored.
export const caseLocationContexts = ["on_campus", "off_campus", "online", "unspecified"] as const;
export type CaseLocationContext = (typeof caseLocationContexts)[number];

export const institutionActionTypes = [
  "policy_change",
  "government_investigation",
  "lawsuit",
  "settlement",
  "audit",
  "disciplinary_action",
  "prevention_initiative",
  "institutional_reform",
  "other",
] as const;
export type InstitutionActionType = (typeof institutionActionTypes)[number];

export const responseTopics = [
  "title_ix_process",
  "disciplinary_procedures",
  "law_enforcement_referrals",
  "prevention_programs",
  "reporting_procedures",
  "outcome_information",
  "transparency_practices",
] as const;
export type ResponseTopic = (typeof responseTopics)[number];

/** `not_located` records that researchers looked and found nothing public, which is not evidence of inaction. */
export const responseFindingKinds = ["documented", "not_located"] as const;
export type ResponseFindingKind = (typeof responseFindingKinds)[number];

export const policyTypes = ["title_ix", "sexual_misconduct", "reporting", "amnesty", "supportive_measures", "other"] as const;
export type PolicyType = (typeof policyTypes)[number];

export const resourceCategories = [
  "emergency",
  "confidential",
  "title_ix",
  "campus_police",
  "local_law_enforcement",
  "victim_advocacy",
  "counseling",
  "medical",
] as const;
export type ResourceCategory = (typeof resourceCategories)[number];

// confidential: does not share information without consent (subject to legal exceptions).
// private: shares only as needed to respond. institutional_reporting: a report starts an institutional response.
export const confidentialityLevels = ["confidential", "private", "institutional_reporting", "unknown"] as const;
export type ConfidentialityLevel = (typeof confidentialityLevels)[number];

export const coverageScopes = ["institutional", "case"] as const;
export type CoverageScope = (typeof coverageScopes)[number];

export const coverageTopics = [
  "title_ix_process",
  "policy_change",
  "investigation",
  "lawsuit",
  "prevention",
  "campus_safety",
  "case_development",
  "other",
] as const;
export type CoverageTopic = (typeof coverageTopics)[number];

export const candidateStatuses = ["new", "accepted", "dismissed"] as const;
export type CandidateStatus = (typeof candidateStatuses)[number];
