// Discovery sources per institution. Candidates are never public; they wait in the researcher inbox.
//
// Gaps (no public feed located, 2026-09-29): Cornell Chronicle (topic feeds redirect/404),
// statements.cornell.edu, The Harvard Crimson, Columbia Daily Spectator, Columbia News (403 to automated requests).
// GDELT and Google News search cover these outlets and national/local press. On 2026-09-29 GDELT returned HTTP 429 to every request from the
// development network, even after minute-long pauses; re-test from the deployed environment.

export type FeedSource = {
  url: string;
  publisher: string;
  /** Campus feeds are about one institution, so the college is implied; items are filtered by topic only. */
  collegeSlug: string;
};

export type CollegeQuery = {
  collegeSlug: string;
  /** Exact phrases the search must match (any of them). */
  names: string[];
  /** How headlines usually refer to the institution; used to re-file stories about another tracked school. */
  shortName: string;
  /**
   * Keep search results only when the headline names the institution. For names that full-text search
   * matches too loosely (boilerplate mentions, or ambiguous names like "Columbia").
   */
  headlineMustName?: boolean;
  /** How the institution is named as a party in court (for docket search). */
  courtNames: string[];
};

export const feeds: FeedSource[] = [
  { url: "https://www.cornellsun.com/plugin/feeds/all.xml", publisher: "The Cornell Daily Sun", collegeSlug: "cornell-university" },
  { url: "https://news.harvard.edu/gazette/feed/", publisher: "The Harvard Gazette", collegeSlug: "harvard-university" },
];

/** Exact-name queries, used for both GDELT and Google News search. */
export const gdeltQueries: CollegeQuery[] = [
  { collegeSlug: "cornell-university", names: ["Cornell University"], shortName: "Cornell", courtNames: ["Cornell University"] },
  {
    collegeSlug: "harvard-university",
    names: ["Harvard University", "Harvard College"],
    shortName: "Harvard",
    // Harvard is usually sued as "President and Fellows of Harvard College".
    courtNames: ["Harvard College", "Harvard University"],
  },
  {
    collegeSlug: "columbia-university",
    names: ["Columbia University"],
    shortName: "Columbia",
    headlineMustName: true,
    // Usually sued as "The Trustees of Columbia University in the City of New York".
    courtNames: ["Columbia University"],
  },
];
