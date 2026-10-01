// Discovery sources per institution. Candidates are never public; they wait in the researcher inbox.
//
// Gaps (no public feed located, 2026-09-29): Cornell Chronicle (topic feeds redirect/404),
// statements.cornell.edu, The Harvard Crimson, Columbia Daily Spectator, Columbia News (403 to automated requests).
// GDELT partially covers these outlets. On 2026-09-29 GDELT returned HTTP 429 to every request from the
// development network, even after minute-long pauses; re-test from the deployed environment.

export type FeedSource = {
  url: string;
  publisher: string;
  /** Campus feeds are about one institution, so the college is implied; items are filtered by topic only. */
  collegeSlug: string;
};

export type CollegeQuery = {
  collegeSlug: string;
  /** Exact phrases GDELT must match (any of them). */
  names: string[];
};

export const feeds: FeedSource[] = [
  { url: "https://www.cornellsun.com/plugin/feeds/all.xml", publisher: "The Cornell Daily Sun", collegeSlug: "cornell-university" },
  { url: "https://news.harvard.edu/gazette/feed/", publisher: "The Harvard Gazette", collegeSlug: "harvard-university" },
];

export const gdeltQueries: CollegeQuery[] = [
  { collegeSlug: "cornell-university", names: ["Cornell University"] },
  { collegeSlug: "harvard-university", names: ["Harvard University", "Harvard College"] },
  { collegeSlug: "columbia-university", names: ["Columbia University"] },
];
