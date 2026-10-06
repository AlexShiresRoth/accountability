import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import * as s from "@/db/schema";
import type { Database } from "@/db/types";
import { getCollegeProfile, listPublicSources } from "@/lib/public/queries";
import { createTestDb } from "@/test/db";
import { fixtures } from "@/test/fixtures";
import { decodeEntities, parseFeed } from "./feed-parser";
import { buildGdeltQuery, parseGdeltResponse } from "./gdelt";
import { searchTermGroups } from "./terms";
import { courtListenerUrl, isCourtListenerUrl, parseCourtListener } from "./courtlistener";
import { googleNewsUrl, headlineKey, isGoogleNewsUrl, parseGoogleNews, stripPublisherSuffix } from "./google-news";
import { isRelevant, suggestTopic } from "./relevance";
import { runDiscovery, type FetchText } from "./run";
import { canonicalizeUrl } from "./urls";

/** Test fakes answer only the first search-term group, so each fixture is returned once per query. */
const isFirstGroup = (url: string) => decodeURIComponent(url).includes("misconduct");
const rss = (items: string) => `<?xml version="1.0"?><rss><channel><title>T</title>${items}</channel></rss>`;
const item = (title: string, link: string, description = "") =>
  `<item><title><![CDATA[${title}]]></title><link><![CDATA[${link}]]></link><pubDate>Tue, 29 Sep 2026 18:24:03 -0400</pubDate><description><![CDATA[${description}]]></description></item>`;

describe("parseFeed", () => {
  it("parses RSS items with CDATA, HTML descriptions, and dates", () => {
    const [i] = parseFeed(rss(item("Title IX office &amp; students", "https://x.edu/a", "<p>Body <a href='#'>link</a></p>")));
    expect(i.title).toBe("Title IX office & students");
    expect(i.url).toBe("https://x.edu/a");
    expect(i.snippet).toBe("Body link");
    expect(i.publishedAt?.toISOString()).toBe("2026-09-29T22:24:03.000Z");
  });

  it("parses Atom entries", () => {
    const [e] = parseFeed(
      `<feed><entry><title>Atom title</title><link rel="alternate" href="https://x.edu/b"/><published>2026-01-02T00:00:00Z</published><summary>Sum</summary></entry></feed>`,
    );
    expect(e).toMatchObject({ title: "Atom title", url: "https://x.edu/b", snippet: "Sum" });
  });

  it("uses a permalink guid when link is missing, but not a non-permalink guid", () => {
    expect(parseFeed(rss(`<item><title>A</title><guid>https://x.edu/g</guid></item>`))[0].url).toBe("https://x.edu/g");
    expect(parseFeed(rss(`<item><title>A</title><guid isPermaLink="false">123</guid></item>`))[0].url).toBeNull();
  });

  it("truncates long snippets without storing article bodies", () => {
    const [i] = parseFeed(rss(item("T", "https://x.edu/c", "word ".repeat(200))));
    expect(i.snippet!.length).toBeLessThanOrEqual(281);
    expect(i.snippet!.endsWith("…")).toBe(true);
  });

  it("decodes numeric and named entities", () => {
    expect(decodeEntities("It&#8217;s &quot;fine&quot; &#x2014; ok")).toBe("It’s \"fine\" — ok");
  });
});

describe("relevance", () => {
  it.each([
    "University revises Title IX grievance procedures",
    "Report details sexual misconduct investigation",
    "Stalking reports rise after new reporting portal",
    "Students rally against dating violence",
    "Clery report released",
  ])("keeps: %s", (t) => expect(isRelevant(t)).toBe(true));

  it.each(["Football team wins opener", "New grape varieties at the orchard", "Library extends hours", "Therapist talks trapeze"])(
    "skips: %s",
    (t) => expect(isRelevant(t)).toBe(false),
  );

  it("suggests topics", () => {
    expect(suggestTopic("Former student sues university over Title IX handling")).toBe("lawsuit");
    expect(suggestTopic("Office for Civil Rights opens inquiry")).toBe("investigation");
    expect(suggestTopic("University revises Title IX procedures")).toBe("title_ix_process");
    expect(suggestTopic("Bystander training expands")).toBe("prevention");
    expect(suggestTopic("Stalking reports on campus")).toBe("campus_safety");
  });
});

describe("canonicalizeUrl", () => {
  it("normalizes for de-duplication", () => {
    expect(canonicalizeUrl("http://WWW.Example.org/a/b/?utm_source=x&id=3#frag")).toBe("https://www.example.org/a/b?id=3");
    expect(canonicalizeUrl("javascript:alert(1)")).toBeNull();
    expect(canonicalizeUrl("not a url")).toBeNull();
  });
});

describe("GDELT", () => {
  it("builds queries with parentheses only around OR'd terms", () => {
    expect(buildGdeltQuery(["Cornell University"], ['"sexual assault"', "rape"])).toBe('"Cornell University" ("sexual assault" OR rape) sourcelang:english');
    expect(buildGdeltQuery(["Harvard University", "Harvard College"], ["stalking"])).toMatch(/^\("Harvard University" OR "Harvard College"\) \(stalking\)/);
  });

  it("parses articles and throws on rate-limit text", () => {
    const [a] = parseGdeltResponse(
      JSON.stringify({ articles: [{ url: "https://news.example/a", title: " T ", seendate: "20260928T141500Z", domain: "news.example" }] }),
    );
    expect(a).toEqual({ url: "https://news.example/a", title: "T", seenAt: new Date("2026-09-28T14:15:00Z"), domain: "news.example" });
    expect(parseGdeltResponse("{}")).toEqual([]);
    expect(() => parseGdeltResponse("Please limit requests to one every 5 seconds")).toThrow(/non-JSON/);
  });
});

describe("runDiscovery", () => {
  let db: Database;
  let close: () => Promise<void>;

  beforeAll(async () => {
    ({ db, close } = await createTestDb());
    const f = fixtures(db);
    await f.college({ slug: "cornell-university", name: "Cornell University", status: "draft" });
    await f.college({ slug: "harvard-university", name: "Harvard University", status: "draft" });
  });
  afterAll(() => close());

  const feedBody = rss(
    item("Title IX office changes procedures", "https://sun.example/a?utm_source=rss") +
      item("Hockey team wins", "https://sun.example/b") +
      item("Students discuss stalking reports", "https://sun.example/c"),
  );
  const gdeltBody = JSON.stringify({
    articles: [
      { url: "https://news.example/x", title: "Harvard faces Title IX suit", seendate: "20260901T000000Z", domain: "news.example" },
      { url: "https://sun.example/a", title: "duplicate of feed item", domain: "sun.example" },
    ],
  });

  const options = (fetchText: FetchText) => ({
    db,
    fetchText,
    sleep: async () => {},
    feeds: [{ url: "https://sun.example/feed", publisher: "The Sun", collegeSlug: "cornell-university" }],
    gdeltQueries: [
      { collegeSlug: "harvard-university", names: ["Harvard University"], courtNames: ["Harvard University"], shortName: "Harvard" },
      { collegeSlug: "missing-college", names: ["Nowhere"], courtNames: ["Nowhere"], shortName: "Nowhere" },
    ],
    sources: { googleNews: false, courtDockets: false },
  });

  const fetchOk: FetchText = async (url) => ({
    status: 200,
    body: url.includes("gdelt") ? (isFirstGroup(url) ? gdeltBody : "{}") : feedBody,
  });

  it("stores only relevant, de-duplicated candidates and records the run", async () => {
    const result = await runDiscovery(options(fetchOk));
    expect(result.bySource["feed: The Sun"]).toEqual({ found: 3, relevant: 2 });
    expect(result.found).toBe(3); // 2 feed items + 1 new GDELT item (the other duplicates a feed URL)
    expect(result.created).toBe(3);
    expect(result.errors).toEqual(['college "missing-college": not found; skipped its sources']);

    const rows = await db.select().from(s.candidateItems);
    expect(rows.map((r) => r.url).sort()).toEqual(["https://news.example/x", "https://sun.example/a", "https://sun.example/c"]);
    expect(rows.every((r) => r.status === "new")).toBe(true);
    expect(rows.find((r) => r.url === "https://news.example/x")!.suggestedTopic).toBe("lawsuit");

    const [run] = await db.select().from(s.ingestionRuns).where(eq(s.ingestionRuns.id, result.runId));
    expect(run.finishedAt).not.toBeNull();
    expect(run.itemsCreated).toBe(3);
  });

  it("records the outcome, trigger, duration and per-source summary on the run", async () => {
    const result = await runDiscovery({ ...options(fetchOk), triggeredBy: "test" });
    const [run] = await db.select().from(s.ingestionRuns).where(eq(s.ingestionRuns.id, result.runId));
    expect(run.triggeredBy).toBe("test");
    expect(run.outcome).toBe("partial"); // the missing college is reported as an error
    expect(result.outcome).toBe("partial");
    expect(run.durationMs).toBeGreaterThanOrEqual(0);
    expect(run.summary).toMatchObject({
      bySource: { "feed: The Sun": { found: 3, relevant: 2 } },
      errors: ['college "missing-college": not found; skipped its sources'],
    });
  });

  it("logs each source and the run as structured events", async () => {
    const events: { level: string; event: string; fields?: Record<string, unknown> }[] = [];
    await runDiscovery({ ...options(fetchOk), log: (level, event, fields) => events.push({ level, event, fields }) });
    expect(events[0].event).toBe("run.started");
    expect(events).toContainEqual(expect.objectContaining({ level: "warn", event: "source.failed" }));
    expect(events).toContainEqual(
      expect.objectContaining({ event: "source.done", fields: expect.objectContaining({ source: "feed: The Sun", found: 3, relevant: 2 }) }),
    );
    expect(events.at(-1)).toMatchObject({ level: "warn", event: "run.finished", fields: { outcome: "partial", found: 3, created: 0 } });
  });

  it("records a run that throws as failed, and re-throws", async () => {
    const events: string[] = [];
    const before = await db.select({ id: s.ingestionRuns.id }).from(s.ingestionRuns);
    await expect(
      runDiscovery({
        ...options(fetchOk),
        sleep: async () => {
          throw new Error("boom");
        },
        log: (_level, event) => events.push(event),
      }),
    ).rejects.toThrow("boom");
    const runs = await db.select().from(s.ingestionRuns);
    const failed = runs.find((r) => !before.some((b) => b.id === r.id))!;
    expect(failed.outcome).toBe("failed");
    expect(failed.finishedAt).not.toBeNull();
    expect(failed.error).toBe("Run failed: boom");
    expect(events).toContain("run.failed");
  });

  it("does not duplicate candidates on a second run", async () => {
    const result = await runDiscovery(options(fetchOk));
    expect(result.found).toBe(3);
    expect(result.created).toBe(0);
    expect(await db.select().from(s.candidateItems)).toHaveLength(3);
  });

  it("stops trying GDELT after its first failure, recording the network cause", async () => {
    let gdeltCalls = 0;
    const gdeltDown: FetchText = async (url) => {
      if (!url.includes("gdelt")) return { status: 200, body: feedBody };
      gdeltCalls++;
      throw new TypeError("fetch failed", { cause: { code: "UND_ERR_CONNECT_TIMEOUT", message: "Connect Timeout Error" } });
    };
    const result = await runDiscovery({
      ...options(gdeltDown),
      gdeltQueries: [
        { collegeSlug: "harvard-university", names: ["Harvard University"], courtNames: ["Harvard University"], shortName: "Harvard" },
        { collegeSlug: "cornell-university", names: ["Cornell University"], courtNames: ["Cornell University"], shortName: "Cornell" },
      ],
    });
    expect(gdeltCalls).toBe(2); // one request and its retry, for the first institution only
    expect(result.errors).toEqual([
      "gdelt: Harvard University: fetch failed (UND_ERR_CONNECT_TIMEOUT: Connect Timeout Error)",
      "gdelt: Cornell University: skipped: GDELT failed earlier in this run",
    ]);
    expect(result.bySource["feed: The Sun"]).toEqual({ found: 3, relevant: 2 });
  });

  it("keeps going when one source fails, and records the error", async () => {
    const failingFeed: FetchText = async (url) =>
      url.includes("gdelt") ? { status: 200, body: isFirstGroup(url) ? gdeltBody : "{}" } : { status: 503, body: "down" };
    const result = await runDiscovery(options(failingFeed));
    expect(result.errors.some((e) => e.startsWith("feed: The Sun: HTTP 503"))).toBe(true);
    expect(result.bySource["gdelt: Harvard University"]).toEqual({ found: 2, relevant: 2 });
  });

  it("never publishes anything: no sources or public records are created", async () => {
    expect(await db.select().from(s.sources)).toEqual([]);
    expect(await db.select().from(s.collegeCoverage)).toEqual([]);
    expect(await listPublicSources({ db, hideDemo: false })).toEqual([]);
    expect(await getCollegeProfile({ db, hideDemo: false }, "cornell-university")).toBeNull();
  });
});

const gnItem = (title: string, publisher: string, id: string) =>
  `<item><title>${title} - ${publisher}</title><link>https://news.google.com/rss/articles/${id}?oc=5</link><guid isPermaLink="false">${id}</guid><pubDate>Wed, 30 Sep 2026 00:07:00 GMT</pubDate><description>&lt;a href="https://news.google.com/rss/articles/${id}"&gt;x&lt;/a&gt;</description><source url="https://www.${publisher.toLowerCase().replace(/\W/g, "")}.com">${publisher}</source></item>`;

describe("Google News", () => {
  it("builds a time-bounded exact-name query", () => {
    const url = new URL(googleNewsUrl(["Harvard University", "Harvard College"], ["stalking", '"dating violence"'], 90));
    expect(url.hostname).toBe("news.google.com");
    expect(url.searchParams.get("q")).toBe('("Harvard University" OR "Harvard College") (stalking OR "dating violence") when:90d');
  });

  it("parses items, keeping the real publisher and stripping it from the headline", () => {
    const [i] = parseGoogleNews(`<rss><channel>${gnItem("Prosecutors reopen inquiry &amp; review", "CBS News", "AAA")}</channel></rss>`);
    expect(i).toMatchObject({
      url: "https://news.google.com/rss/articles/AAA?oc=5",
      title: "Prosecutors reopen inquiry & review",
      publisher: "CBS News",
      publisherUrl: "https://www.cbsnews.com",
    });
    expect(i.publishedAt?.toISOString()).toBe("2026-09-30T00:07:00.000Z");
  });

  it("only strips an exact publisher suffix", () => {
    expect(stripPublisherSuffix("A - B - CNN", "CNN")).toBe("A - B");
    expect(stripPublisherSuffix("Title - Other", "CNN")).toBe("Title - Other");
  });

  it("recognizes Google links and normalizes headlines for matching", () => {
    expect(isGoogleNewsUrl("https://news.google.com/rss/articles/x")).toBe(true);
    expect(isGoogleNewsUrl("https://www.nytimes.com/2026/09/x.html")).toBe(false);
    expect(headlineKey("Cornell’s “Review” Begins!")).toBe(headlineKey("cornells review begins"));
    expect(headlineKey("Short")).toBeNull();
  });
});

describe("runDiscovery with Google News", () => {
  let db: Database;
  let close: () => Promise<void>;
  beforeAll(async () => {
    ({ db, close } = await createTestDb());
    await fixtures(db).college({ slug: "cornell-university", name: "Cornell University", status: "draft" });
  });
  afterAll(() => close());

  const feed = rss(item("Title IX office changes procedures", "https://sun.example/a"));
  const google = `<rss><channel>${[
    gnItem("Title IX office changes procedures", "The Sun", "DUP"),
    gnItem("Prosecutors reopen sexual assault inquiry", "CBS News", "CBS1"),
    gnItem("Prosecutors reopen sexual assault inquiry", "WSYR", "SYND"),
    gnItem("Governor requests independent review", "The New York Times", "NYT1"),
  ].join("")}</channel></rss>`;

  const run = () =>
    runDiscovery({
      db,
      sleep: async () => {},
      fetchText: async (url) => ({
        status: 200,
        body: url.includes("news.google.com") ? (isFirstGroup(url) ? google : rss("")) : feed,
      }),
      feeds: [{ url: "https://sun.example/feed", publisher: "The Sun", collegeSlug: "cornell-university" }],
      gdeltQueries: [{ collegeSlug: "cornell-university", names: ["Cornell University"], courtNames: ["Cornell University"], shortName: "Cornell" }],
      sources: { gdelt: false, courtDockets: false },
      googleNewsDays: 90,
    });

  it("adds other outlets, skipping headlines already found via a feed or syndicated twice", async () => {
    const result = await run();
    expect(result.bySource["google news: Cornell University"]).toEqual({ found: 4, relevant: 4 });
    expect(result.duplicateHeadlines).toBe(2);
    const rows = await db.select().from(s.candidateItems);
    expect(rows.map((r) => r.publisher).sort()).toEqual(["CBS News", "The New York Times", "The Sun"]);
    expect(rows.find((r) => r.publisher === "CBS News")!.title).toBe("Prosecutors reopen sexual assault inquiry");
  });

  it("does not re-add stories already in the inbox", async () => {
    const result = await run();
    expect(result.created).toBe(0);
    expect(await db.select().from(s.candidateItems)).toHaveLength(3);
  });
});

describe("re-filing search results by headline", () => {
  let db: Database;
  let close: () => Promise<void>;
  let ids: Record<string, string>;
  beforeAll(async () => {
    ({ db, close } = await createTestDb());
    const f = fixtures(db);
    ids = {
      cornell: (await f.college({ slug: "cornell-university", status: "draft" })).id,
      columbia: (await f.college({ slug: "columbia-university", status: "draft" })).id,
    };
  });
  afterAll(() => close());

  it("files a story under the tracked school its headline names", async () => {
    const google = (q: string) =>
      `<rss><channel>${
        q.includes("Columbia")
          ? gnItem("Cornell rape case sparks debate on campuses", "The Boston Globe", "B1") +
            gnItem("Columbia revises Title IX procedures", "Columbia Spectator", "C1") +
            gnItem("Campus sexual assault expulsions are rare in New York", "WSTM", "W1")
          : gnItem("Cornell rape case sparks debate on campuses", "The Boston Globe", "B2")
      }</channel></rss>`;
    const result = await runDiscovery({
      db,
      sleep: async () => {},
      fetchText: async (url) => ({ status: 200, body: isFirstGroup(url) ? google(decodeURIComponent(url)) : rss("") }),
      feeds: [],
      gdeltQueries: [
        { collegeSlug: "cornell-university", names: ["Cornell University"], courtNames: ["Cornell University"], shortName: "Cornell" },
        { collegeSlug: "columbia-university", names: ["Columbia University"], courtNames: ["Columbia University"], shortName: "Columbia" },
      ],
      sources: { gdelt: false, courtDockets: false },
    });
    expect(result.refiled).toBe(1);
    expect(result.duplicateHeadlines).toBe(1); // the re-filed Boston Globe story was already found under Cornell

    const rows = await db.select().from(s.candidateItems);
    const byCollege = (id: string) => rows.filter((r) => r.collegeId === id).map((r) => r.title).sort();
    expect(byCollege(ids.cornell)).toEqual(["Cornell rape case sparks debate on campuses"]);
    // Headlines naming no tracked school stay with the query that found them.
    expect(byCollege(ids.columbia)).toEqual(["Campus sexual assault expulsions are rare in New York", "Columbia revises Title IX procedures"]);
  });
});

describe("headline requirement", () => {
  let db: Database;
  let close: () => Promise<void>;
  beforeAll(async () => {
    ({ db, close } = await createTestDb());
    const f = fixtures(db);
    await f.college({ slug: "cornell-university", status: "draft" });
    await f.college({ slug: "columbia-university", status: "draft" });
  });
  afterAll(() => close());

  it("drops search results whose headline doesn't name a strict school, after re-filing", async () => {
    const google = gnItem("Columbia students protest handling of harassment complaints", "amNewYork", "A") +
      gnItem("Judge delays hearing in Syracuse rape case", "WSTM", "B") +
      gnItem("Cornell expels students after sexual misconduct finding", "CNN", "C");
    const result = await runDiscovery({
      db,
      sleep: async () => {},
      fetchText: async (url) => ({
        status: 200,
        body: isFirstGroup(url) && decodeURIComponent(url).includes("Columbia") ? `<rss><channel>${google}</channel></rss>` : rss(""),
      }),
      feeds: [],
      gdeltQueries: [
        { collegeSlug: "cornell-university", names: ["Cornell University"], courtNames: ["Cornell University"], shortName: "Cornell" },
        { collegeSlug: "columbia-university", names: ["Columbia University"], courtNames: ["Columbia University"], shortName: "Columbia", headlineMustName: true },
      ],
      sources: { gdelt: false, courtDockets: false },
    });
    expect(result.droppedNoHeadlineName).toBe(1);
    const rows = await db.select().from(s.candidateItems);
    expect(rows.map((r) => r.title).sort()).toEqual([
      "Columbia students protest handling of harassment complaints",
      "Cornell expels students after sexual misconduct finding",
    ]);
  });
});

describe("search terms", () => {
  it("cover crimes against women beyond sexual assault", () => {
    const all = searchTermGroups.flat().join(" ");
    for (const t of ["stalking", "domestic violence", "dating violence", "sexual harassment", "sextortion", "revenge porn", "sex trafficking", "femicide"]) {
      expect(all).toContain(t);
    }
  });

  it.each([
    "Former student charged with stalking classmate",
    "Report on intimate partner violence among undergraduates",
    "Police warn of drink spiking at bars near campus",
    "Student accused of sharing intimate images without consent",
    "Sextortion scheme targeted students, prosecutors say",
    "Professor resigns after sexual harassment findings",
  ])("feed filter keeps: %s", (t) => expect(isRelevant(t)).toBe(true));

  it.each(["University sued over harassment of pro-Palestinian students", "Report finds harassment of Jewish students rose"])(
    "feed filter skips harassment without a sexual or gender context: %s",
    (t) => expect(isRelevant(t)).toBe(false),
  );
});

describe("court dockets (CourtListener)", () => {
  const api = JSON.stringify({
    count: 2,
    results: [
      { caseName: "Doe v. Cornell University", court_citation_string: "N.D.N.Y.", dateFiled: "2025-03-21", docketNumber: "3:25-cv-00321", docket_absolute_url: "/docket/1/doe-v-cornell-university/" },
      { caseName: "Roe v. Cornell University", court: "District Court, N.D. New York", dateFiled: "2026-06-26T00:00:00-07:00", docket_absolute_url: "/docket/2/roe-v-cornell-university/" },
      { caseName: "Missing URL", dateFiled: "2026-01-01" },
    ],
  });

  it("searches by party name with the shared crime terms and a filing-date window", () => {
    const url = new URL(courtListenerUrl(["Harvard College", "Harvard University"], "2026-01-01"));
    expect(url.hostname).toBe("www.courtlistener.com");
    expect(url.searchParams.get("type")).toBe("r");
    expect(url.searchParams.get("filed_after")).toBe("2026-01-01");
    expect(url.searchParams.get("q")).toMatch(/^caseName:\("Harvard College" OR "Harvard University"\) AND \(.*"sexual assault".*stalking.*\)$/);
  });

  it("parses dockets into leads with court and docket number, skipping incomplete results", () => {
    const leads = parseCourtListener(api);
    expect(leads).toHaveLength(2);
    expect(leads[0]).toMatchObject({
      url: "https://www.courtlistener.com/docket/1/doe-v-cornell-university/",
      title: "Doe v. Cornell University (N.D.N.Y., No. 3:25-cv-00321)",
      court: "N.D.N.Y.",
    });
    expect(leads[0].filedAt?.toISOString().slice(0, 10)).toBe("2025-03-21");
    expect(leads[1].title).toBe("Roe v. Cornell University (District Court, N.D. New York)");
    expect(isCourtListenerUrl(leads[0].url)).toBe(true);
    expect(() => parseCourtListener("rate limited")).toThrow(/non-JSON/);
  });

  it("adds docket leads to the inbox as lawsuit candidates, never as case records", async () => {
    const { db, close } = await createTestDb();
    await fixtures(db).college({ slug: "cornell-university", status: "draft" });
    let requested = "";
    const result = await runDiscovery({
      db,
      sleep: async () => {},
      now: new Date("2026-10-03T12:00:00Z"),
      googleNewsDays: 30,
      fetchText: async (url) => {
        requested = url;
        return { status: 200, body: api };
      },
      feeds: [],
      gdeltQueries: [{ collegeSlug: "cornell-university", names: ["Cornell University"], courtNames: ["Cornell University"], shortName: "Cornell" }],
      sources: { gdelt: false, googleNews: false },
    });
    expect(new URL(requested).searchParams.get("filed_after")).toBe("2026-09-03");
    expect(result.bySource["court dockets: Cornell University"]).toEqual({ found: 2, relevant: 2 });
    const rows = await db.select().from(s.candidateItems);
    expect(rows.map((r) => [r.publisher, r.suggestedTopic]).sort()).toEqual([
      ["Federal court docket (District Court, N.D. New York)", "lawsuit"],
      ["Federal court docket (N.D.N.Y.)", "lawsuit"],
    ]);
    expect(await db.select().from(s.cases)).toEqual([]);
    await close();
  });

  it("follows result pages only up to courtPages", async () => {
    const page = (n: number, next: string | null) =>
      JSON.stringify({
        next,
        results: [{ caseName: `Doe ${n} v. Cornell University`, court: "N.D.N.Y.", dateFiled: "2025-01-01", docket_absolute_url: `/docket/${n}/doe/` }],
      });
    const fetchText: FetchText = async (url) => ({
      status: 200,
      body: url.includes("cursor=2") ? page(2, "https://www.courtlistener.com/api/rest/v4/search/?cursor=3") : url.includes("cursor=3") ? page(3, null) : page(1, "https://www.courtlistener.com/api/rest/v4/search/?cursor=2"),
    });
    const run = async (courtPages?: number) => {
      const { db, close } = await createTestDb();
      await fixtures(db).college({ slug: "cornell-university", status: "draft" });
      const result = await runDiscovery({
        db,
        sleep: async () => {},
        fetchText,
        courtPages,
        feeds: [],
        gdeltQueries: [{ collegeSlug: "cornell-university", names: ["Cornell University"], courtNames: ["Cornell University"], shortName: "Cornell" }],
        sources: { gdelt: false, googleNews: false },
      });
      await close();
      return result.bySource["court dockets: Cornell University"].found;
    };
    expect(await run()).toBe(1); // scheduled runs: first page only
    expect(await run(2)).toBe(2);
    expect(await run(5)).toBe(3); // stops when there is no next page
  });
});
