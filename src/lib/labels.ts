// Human-readable labels for enum values. Public wording lives here so it stays consistent.
import type {
  SourceAccess,
  CleryGeography,
  ConfidentialityLevel,
  CoverageTopic,
  InstitutionActionType,
  Offense,
  PolicyType,
  ResourceCategory,
  ResponseTopic,
} from "./enums";

export const offenseLabels: Record<Offense, string> = {
  rape: "Rape",
  fondling: "Fondling",
  incest: "Incest",
  statutory_rape: "Statutory rape",
  dating_violence: "Dating violence",
  domestic_violence: "Domestic violence",
  stalking: "Stalking",
};

/** Offenses shown on every profile, in display order. Incest and statutory rape appear only when reported. */
export const leadOffenses: Offense[] = ["rape", "fondling", "dating_violence", "domestic_violence", "stalking"];

export const geographyLabels: Record<CleryGeography, string> = {
  on_campus: "On campus",
  on_campus_residential: "Residential facilities",
  noncampus: "Noncampus property",
  public_property: "Public property",
};

export const geographyDescriptions: Record<CleryGeography, string> = {
  on_campus: "Property the institution owns or controls within its core campus, including residence halls.",
  on_campus_residential: "A subset of on-campus figures. Not an additional category.",
  noncampus: "Property owned or controlled by the institution or recognized student organizations outside the core campus.",
  public_property: "Streets, sidewalks, and similar areas within or immediately adjacent to campus.",
};

export const responseTopicLabels: Record<ResponseTopic, string> = {
  title_ix_process: "Title IX process",
  disciplinary_procedures: "Campus disciplinary procedures",
  law_enforcement_referrals: "Law-enforcement referrals",
  prevention_programs: "Prevention programs",
  reporting_procedures: "Reporting procedures",
  outcome_information: "Outcome information",
  transparency_practices: "Transparency practices",
};

export const resourceCategoryLabels: Record<ResourceCategory, string> = {
  emergency: "Emergency",
  confidential: "Confidential support",
  title_ix: "Title IX office",
  campus_police: "Campus police",
  local_law_enforcement: "Local law enforcement",
  victim_advocacy: "Victim advocacy",
  counseling: "Counseling",
  medical: "Medical care",
};

export const confidentialityLabels: Record<ConfidentialityLevel, { title: string; description: string }> = {
  confidential: {
    title: "Confidential",
    description: "Will not share what you tell them without your consent, except in limited situations required by law.",
  },
  private: {
    title: "Private",
    description: "Shares information only with those who need it to respond. Not the same as confidential.",
  },
  institutional_reporting: {
    title: "Reporting channels",
    description: "Telling these offices may start an institutional or law-enforcement response.",
  },
  unknown: {
    title: "Confidentiality not stated",
    description: "The sources reviewed do not say whether these resources are confidential. Ask before sharing details.",
  },
};

export const actionTypeLabels: Record<InstitutionActionType, string> = {
  policy_change: "Policy change",
  government_investigation: "Government investigation",
  lawsuit: "Lawsuit",
  settlement: "Settlement",
  audit: "Audit",
  disciplinary_action: "Disciplinary action",
  prevention_initiative: "Prevention initiative",
  institutional_reform: "Institutional reform",
  other: "Other",
};

export const coverageTopicLabels: Record<CoverageTopic, string> = {
  title_ix_process: "Title IX process",
  policy_change: "Policy change",
  investigation: "Investigation",
  lawsuit: "Lawsuit",
  prevention: "Prevention",
  campus_safety: "Campus safety",
  case_development: "Case development",
  other: "Other",
};

export const policyTypeLabels: Record<PolicyType, string> = {
  title_ix: "Title IX policy",
  sexual_misconduct: "Sexual misconduct policy",
  reporting: "Reporting policy",
  amnesty: "Amnesty policy",
  supportive_measures: "Supportive measures",
  other: "Policy",
};

/** Public labels for a source's access. "unknown" shows nothing. */
export const sourceAccessLabels: Record<SourceAccess, { title: string; description: string } | null> = {
  free: { title: "Free to read", description: "Openly available without an account or subscription." },
  subscription: { title: "Paywall", description: "The publisher may require a subscription to read the full text." },
  registration: { title: "Free account required", description: "Free to read after registering with the publisher." },
  unknown: null,
};
