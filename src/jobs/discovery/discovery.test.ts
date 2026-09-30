import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import * as s from "@/db/schema";
import type { Database } from "@/db/types";
import { getCollegeProfile, listPublicSources } from "@/lib/public/queries";
import { createTestDb } from "@/test/db";
import { fixtures } from "@/test/fixtures";
import { decodeEntities, parseFeed } from "./feed-parser";
import { buildGdeltQuery, parseGdeltResponse } from "./gdelt";
import { isRelevant, suggestTopic } from "./relevance";
import { runDiscovery, type FetchText } from "./run";
import { canonicalizeUrl } from "./urls";

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
    expect(buildGdeltQuery(["Cornell University"])).toMatch(/^"Cornell University" \("Title IX" OR /);
    expect(buildGdeltQuery(["Harvard University", "Harvard College"])).toMatch(/^\("Harvard University" OR "Harvard College"\) \(/);
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
      { collegeSlug: "harvard-university", names: ["Harvard University"] },
      { collegeSlug: "missing-college", names: ["Nowhere"] },
    ],
  });

  const fetchOk: FetchText = async (url) => ({ status: 200, body: url.includes("gdelt") ? gdeltBody : feedBody });

  it("stores only relevant, de-duplicated candidates and records the run", async () => {
    const result = await runDiscovery(options(fetchOk));
    expect(result.bySource["feed: The Sun"]).toEqual({ found: 3, relevant: 2 });
    expect(result.found).toBe(3); // 2 feed items + 1 new GDELT item (the other duplicates a feed URL)
    expect(result.created).toBe(3);
    expect(result.errors).toEqual(['College "missing-college" not found; skipped its sources.']);

    const rows = await db.select().from(s.candidateItems);
    expect(rows.map((r) => r.url).sort()).toEqual(["https://news.example/x", "https://sun.example/a", "https://sun.example/c"]);
    expect(rows.every((r) => r.status === "new")).toBe(true);
    expect(rows.find((r) => r.url === "https://news.example/x")!.suggestedTopic).toBe("lawsuit");

    const [run] = await db.select().from(s.ingestionRuns).where(eq(s.ingestionRuns.id, result.runId));
    expect(run.finishedAt).not.toBeNull();
    expect(run.itemsCreated).toBe(3);
  });

  it("does not duplicate candidates on a second run", async () => {
    const result = await runDiscovery(options(fetchOk));
    expect(result.found).toBe(3);
    expect(result.created).toBe(0);
    expect(await db.select().from(s.candidateItems)).toHaveLength(3);
  });

  it("keeps going when one source fails, and records the error", async () => {
    const failingFeed: FetchText = async (url) =>
      url.includes("gdelt") ? { status: 200, body: gdeltBody } : { status: 503, body: "down" };
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
