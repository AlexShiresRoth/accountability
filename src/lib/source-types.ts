// Source types, ordered from official records to secondary reporting.
// The database enum is derived from these keys, so add new types here first.
export const sourceTypes = {
  federal_government: {
    label: "Federal government",
    description: "Department of Education data and findings, federal investigations, and federal statutes and regulations.",
  },
  state_government: { label: "State government", description: "State agency reports, audits, and legislation." },
  local_government: { label: "Local government", description: "County and municipal records and reports." },
  university: {
    label: "University",
    description: "Annual Security Reports, policies, Title IX reports, and official announcements. These are the institution's own account.",
  },
  police_record: { label: "Police record", description: "Records released by campus or municipal police departments." },
  court_record: { label: "Court record", description: "Filings, orders, judgments, and dockets from criminal or civil courts." },
  civil_complaint: {
    label: "Civil complaint",
    description: "The opening document of a lawsuit. It contains allegations, not findings.",
  },
  government_investigation: {
    label: "Government investigation",
    description: "Findings, resolution agreements, and letters from government investigations.",
  },
  reputable_journalism: {
    label: "Journalism",
    description: "Reporting by established news organizations, used where primary records are unavailable and always labeled as journalism.",
  },
} as const;

export type SourceType = keyof typeof sourceTypes;
export const sourceTypeKeys = Object.keys(sourceTypes) as [SourceType, ...SourceType[]];
