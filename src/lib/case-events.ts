import type { CaseEventType } from "./enums";

/**
 * Legal/procedural category shown as a badge on every case event.
 * These are distinct concepts and must never be merged:
 * ALLEGED ≠ ARRESTED ≠ CHARGED ≠ CONVICTED.
 */
export type EventCategory =
  | "allegation"
  | "report"
  | "investigation"
  | "legal_proceeding"
  | "court_outcome"
  | "university_outcome"
  | "resolution"
  | "institutional_change";

export const eventCategoryLabels: Record<EventCategory, string> = {
  allegation: "Allegation",
  report: "Report",
  investigation: "Investigation",
  legal_proceeding: "Legal proceeding",
  court_outcome: "Court outcome",
  university_outcome: "University outcome",
  resolution: "Resolution",
  institutional_change: "Institutional change",
};

type EventTypeInfo = {
  label: string;
  category: EventCategory;
  /** Plain-language explanation shown alongside the badge. */
  meaning: string;
};

// Record<CaseEventType, …> makes this exhaustive: adding an event type without classifying it fails to compile.
export const caseEventTypeInfo: Record<CaseEventType, EventTypeInfo> = {
  alleged_incident: {
    label: "Alleged incident",
    category: "allegation",
    meaning: "An incident as described in an allegation. Not a finding that it occurred.",
  },
  civil_complaint: {
    label: "Civil complaint filed",
    category: "allegation",
    meaning: "A lawsuit was filed. Its contents are allegations, not findings.",
  },
  police_report: {
    label: "Police report",
    category: "report",
    meaning: "A report was made to law enforcement. Not a finding that a crime occurred.",
  },
  university_report: {
    label: "Reported to university",
    category: "report",
    meaning: "A report was made to the institution.",
  },
  investigation_opened: {
    label: "Investigation opened",
    category: "investigation",
    meaning: "An investigation began. Not a finding of wrongdoing.",
  },
  investigation_reopened: {
    label: "Investigation reopened",
    category: "investigation",
    meaning: "A previously closed investigation was reopened.",
  },
  government_investigation: {
    label: "Government investigation",
    category: "investigation",
    meaning: "A government agency opened or conducted an investigation.",
  },
  arrest: {
    label: "Arrest",
    category: "legal_proceeding",
    meaning: "A person was taken into custody. An arrest is not a charge or a conviction.",
  },
  criminal_charge: {
    label: "Criminal charge",
    category: "legal_proceeding",
    meaning: "Prosecutors formally charged a person. A charged person is presumed innocent.",
  },
  prosecution_declined: {
    label: "Prosecution declined",
    category: "legal_proceeding",
    meaning: "Prosecutors chose not to bring or continue charges. Not a finding of guilt or innocence.",
  },
  conviction: {
    label: "Conviction",
    category: "court_outcome",
    meaning: "A court entered a guilty verdict or accepted a guilty plea for a specific offense.",
  },
  acquittal: {
    label: "Acquittal",
    category: "court_outcome",
    meaning: "A court found the defendant not guilty.",
  },
  dismissal: {
    label: "Dismissal",
    category: "court_outcome",
    meaning: "The matter was dismissed on the grounds stated in the record.",
  },
  university_discipline: {
    label: "University disciplinary outcome",
    category: "university_outcome",
    meaning: "An outcome of the institution's own process, which differs from a criminal court.",
  },
  settlement: {
    label: "Settlement",
    category: "resolution",
    meaning: "The parties resolved the dispute by agreement. Usually not a finding of liability.",
  },
  institutional_reform: {
    label: "Institutional reform",
    category: "institutional_change",
    meaning: "The institution changed a policy, practice, or structure.",
  },
};
