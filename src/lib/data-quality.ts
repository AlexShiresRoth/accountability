// Standard data-interpretation warnings. Keep wording consistent across the site:
// these are shown next to statistics and outcome sections, and explained in /methodology.
export const dataQualityNotes = {
  notPrevalence: {
    title: "Reported incidents are not prevalence",
    body: "These figures count incidents reported to campus security authorities or local police. Many incidents are never reported, so counts do not measure how often violence occurs.",
    anchor: "reported-vs-prevalence",
  },
  reportingWillingness: {
    title: "Higher counts can reflect more reporting",
    body: "An increase may reflect greater willingness or ability to report, new reporting channels, or policy changes, not necessarily more incidents.",
    anchor: "reported-vs-prevalence",
  },
  delayedReports: {
    title: "Counts follow the year a report was made",
    body: "Clery statistics are recorded in the year an incident was reported, not the year it occurred. One delayed report describing past incidents can raise a single year's count.",
    anchor: "delayed-reports",
  },
  institutionalDifferences: {
    title: "Institutions are not directly comparable",
    body: "Universities differ in size, campus geography, residential patterns, and reporting practices. Side-by-side counts can mislead.",
    anchor: "comparisons",
  },
  geographyOverlap: {
    title: "Geography categories overlap",
    body: "Residential-facility counts are a subset of on-campus counts. Categories should not be added together.",
    anchor: "geography",
  },
  outcomesUnavailable: {
    title: "Outcome information may not be public",
    body: "Privacy law and institutional policy often keep disciplinary outcomes confidential. Missing outcome information does not mean no action was taken.",
    anchor: "missing-information",
  },
} as const;

export type DataQualityNoteKind = keyof typeof dataQualityNotes;
