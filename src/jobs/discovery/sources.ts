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
  // Columbia's student blog. The Columbia Daily Spectator and The Harvard Crimson publish no public RSS feed found so far;
  // their stories still arrive through Google News. The Harvard Gazette feed was dropped: the university's own news
  // service, with almost nothing on topic (0 of 50 recent posts).
  { url: "https://bwog.com/feed/", publisher: "Bwog", collegeSlug: "columbia-university" },
  { url: "https://cuindependent.org/feed/", publisher: "CU Independent", collegeSlug: "university-of-colorado-boulder" },
  { url: "https://dailyutahchronicle.com/feed/", publisher: "The Daily Utah Chronicle", collegeSlug: "university-of-utah" },
  { url: "https://www.thelantern.com/feed/", publisher: "The Lantern", collegeSlug: "ohio-state-university" },
  // The Collegian has no /feed/ path; this is the site's own RSS search link (latest 50 articles).
  {
    url: "https://www.psucollegian.com/search/?f=rss&t=article&l=50&s=start_time&sd=desc",
    publisher: "The Daily Collegian",
    collegeSlug: "penn-state-university",
  },
  // dailybruin.com/feed/ redirects; the WordPress host serves the feed directly.
  { url: "https://wp.dailybruin.com/feed/", publisher: "Daily Bruin", collegeSlug: "ucla" },
];

/** Exact-name queries, used for both GDELT and Google News search. */
export const gdeltQueries: CollegeQuery[] = [
  { collegeSlug: "cornell-university", names: ["Cornell University"], shortName: "Cornell", courtNames: ["Cornell University"] },
  {
    collegeSlug: "harvard-university",
    names: ["Harvard University", "Harvard College"],
    shortName: "Harvard",
    // Harvard appears in a great deal of national news (federal funding, admissions, visas), so a passing
    // mention plus a broad term like "violence" matches too easily.
    headlineMustName: true,
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
  {
    collegeSlug: "university-of-utah",
    names: ["University of Utah"],
    // Not "Utah": headlines naming the state would be re-filed here.
    shortName: "University of Utah",
    courtNames: ["University of Utah"],
  },
  {
    collegeSlug: "university-of-colorado-boulder",
    names: ["University of Colorado Boulder", "CU Boulder"],
    shortName: "CU Boulder",
    // Usually sued as "The Regents of the University of Colorado", which also covers the other CU campuses.
    courtNames: ["University of Colorado Boulder", "Regents of the University of Colorado"],
  },
  {
    collegeSlug: "ohio-state-university",
    names: ["Ohio State University"],
    shortName: "Ohio State",
    courtNames: ["Ohio State University"],
  },
  {
    collegeSlug: "penn-state-university",
    names: ["Penn State", "Pennsylvania State University"],
    shortName: "Penn State",
    courtNames: ["Pennsylvania State University"],
  },
  {
    collegeSlug: "ucla",
    names: ["UCLA", "University of California, Los Angeles"],
    shortName: "UCLA",
    // Not "Regents of the University of California": that names every UC campus.
    courtNames: ["University of California, Los Angeles", "UCLA"],
  },
];
