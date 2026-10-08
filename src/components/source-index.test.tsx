import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { PublicSourceIndex } from "@/lib/public";
import { SourceDetails } from "./cite";
import { NOT_YET_CITED, PAGE_SIZE, SourceIndex, filterSources, filtersToQuery, readFilters } from "./source-index";

type Indexed = PublicSourceIndex["sources"][number];
const source = (id: string, o: Partial<Indexed> = {}): Indexed => ({
  id,
  type: "university",
  publisher: "Publisher",
  title: `Source ${id}`,
  url: null,
  publicationDate: null,
  retrievedAt: null,
  archivedUrl: null,
  notes: null,
  access: "unknown",
  isDemo: false,
  unverified: false,
  colleges: [],
  ...o,
});

const colleges = [
  { slug: "cornell-university", name: "Cornell University", count: 2 },
  { slug: "ucla", name: "University of California, Los Angeles", count: 1 },
];
const sources = [
  source("asr", { title: "2026 Annual Security Report", publisher: "Cornell University Police", publicationDate: "2026-09-30", colleges: ["cornell-university"] }),
  source("docket", { type: "court_record", title: "Doe v. Cornell University", publisher: "Supreme Court of New York", url: "https://iapps.courts.state.ny.us/x", colleges: ["cornell-university"] }),
  source("bruin", { type: "reputable_journalism", title: "Title IX office expands", publisher: "Daily Bruin", colleges: ["ucla"] }),
  source("both", { type: "federal_government", title: "Campus Safety and Security data", publisher: "U.S. Department of Education", colleges: [] }),
];
const ids = (filters: { q?: string; college?: string }) => filterSources(sources, { q: "", college: "", ...filters }).map((s) => s.id);
const text = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

describe("source index filters", () => {
  it("returns everything, ordered by source type, when unfiltered", () => {
    // Federal government comes before university, court record and journalism in the type list.
    expect(ids({})).toEqual(["both", "asr", "docket", "bruin"]);
  });

  it("filters by university", () => {
    expect(ids({ college: "cornell-university" })).toEqual(["asr", "docket"]);
    expect(ids({ college: "ucla" })).toEqual(["bruin"]);
  });

  it("searches title, publisher, source type, year and web address", () => {
    expect(ids({ q: "daily bruin" })).toEqual(["bruin"]);
    expect(ids({ q: "court record" })).toEqual(["docket"]);
    expect(ids({ q: "2026-09" })).toEqual(["asr"]);
    expect(ids({ q: "courts.state.ny" })).toEqual(["docket"]);
    expect(ids({ q: "CAMPUS SAFETY" })).toEqual(["both"]);
  });

  it("has a bucket for published sources no published page cites yet", () => {
    expect(ids({ college: NOT_YET_CITED })).toEqual(["both"]);
  });

  it("combines the search with the university filter", () => {
    expect(ids({ q: "cornell", college: "cornell-university" })).toEqual(["asr", "docket"]);
    expect(ids({ q: "cornell", college: "ucla" })).toEqual([]);
  });
});

describe("source index URL", () => {
  it("reads filters from the query string", () => {
    expect(readFilters("?college=ucla&q=title%20ix", colleges)).toEqual({ q: "title ix", college: "ucla" });
    expect(readFilters("", colleges)).toEqual({ q: "", college: "" });
  });

  it("accepts the not-yet-cited bucket", () => {
    expect(readFilters(`?college=${NOT_YET_CITED}`, colleges)).toEqual({ q: "", college: NOT_YET_CITED });
  });

  it("ignores a university that isn't in the index instead of showing nothing", () => {
    expect(readFilters("?college=not-a-school&q=x", colleges)).toEqual({ q: "x", college: "" });
  });

  it("writes only the filters in use, and round-trips", () => {
    expect(filtersToQuery({ q: "", college: "" })).toBe("");
    expect(filtersToQuery({ q: "", college: "ucla" })).toBe("?college=ucla");
    const filters = { q: "annual & security", college: "cornell-university" };
    expect(readFilters(filtersToQuery(filters), colleges)).toEqual(filters);
  });
});

describe("SourceIndex rendering", () => {
  it("lists every university with its count, and links each source to the universities that cite it", () => {
    const html = renderToStaticMarkup(<SourceIndex index={{ sources, colleges }} />);
    expect(text(html)).toContain("All sources (4)");
    expect(text(html)).toContain("Cornell University (2)");
    // Cornell 2 + UCLA 1 + not yet cited 1 = all 4: the options add up.
    expect(text(html)).toContain("Not yet cited on a published page (1)");
    expect(html).toContain('href="/college/cornell-university"');
    expect(text(html)).toContain("Cited for Cornell University");
    expect(text(html)).toContain(`Showing 4 of 4 sources.`);
    expect(text(html)).not.toContain("Clear filters");
  });

  it("omits the not-yet-cited option when every source is cited", () => {
    const html = text(renderToStaticMarkup(<SourceIndex index={{ sources: sources.slice(0, 3), colleges }} />));
    expect(html).not.toContain("Not yet cited");
  });

  it("does not claim a university for a source no published page cites", () => {
    const html = text(renderToStaticMarkup(<SourceIndex index={{ sources: [sources[3]], colleges: [] }} />));
    expect(html).toContain("Campus Safety and Security data");
    expect(html).not.toContain("Cited for");
  });

  it("shows one page at first, with a button for the rest", () => {
    const many = Array.from({ length: PAGE_SIZE + 7 }, (_, i) => source(`s${i}`));
    const html = text(renderToStaticMarkup(<SourceIndex index={{ sources: many, colleges: [] }} />));
    expect(html).toContain(`Showing ${PAGE_SIZE} of ${PAGE_SIZE + 7} sources.`);
    expect(html).toContain("Show 7 more");
    expect(html).toContain("Source s0");
    expect(html).not.toContain(`Source s${PAGE_SIZE}`);
  });

  it("says so when nothing has been published", () => {
    const html = text(renderToStaticMarkup(<SourceIndex index={{ sources: [], colleges: [] }} />));
    expect(html).toBe("No verified sources have been published yet.");
  });
});

describe("source access label", () => {
  const html = (access: Indexed["access"]) => text(renderToStaticMarkup(<SourceDetails source={source("x", { url: "https://news.example/x", access })} />));

  it("tells readers whether a source is free or behind a paywall", () => {
    expect(html("free")).toContain("Free to read");
    expect(html("subscription")).toContain("Paywall");
    expect(html("registration")).toContain("Free account required");
  });

  it("says nothing when access hasn't been recorded", () => {
    const out = html("unknown");
    for (const label of ["Free to read", "Paywall", "Free account required"]) expect(out).not.toContain(label);
  });
});
