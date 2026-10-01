// Citation lookup keys. Kept free of database imports so UI components can use it.

export type CitationTargetKind =
  | "college"
  | "cleryReport"
  | "crimeStatistic"
  | "statisticFootnote"
  | "case"
  | "caseEvent"
  | "institutionAction"
  | "institutionalResponse"
  | "policy"
  | "studentResource"
  | "correction";

/** Citations are indexed by `${kind}:${id}`. */
export const citationKey = (kind: CitationTargetKind, id: string) => `${kind}:${id}`;
