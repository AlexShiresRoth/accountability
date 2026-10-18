import { eq } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import * as s from "@/db/schema";
import type { Database } from "@/db/types";
import { parseTriageReply, type TriageInput, type TriageResult } from "@/lib/ai/triage";
import { createTestDb } from "@/test/db";
import { fixtures } from "@/test/fixtures";
import { acceptCandidate, restoreCandidate } from "./inbox";
import { acceptCandidateSchema } from "./validation";
import { evaluateTriage, triageActor, triageInbox, type TriageDeps } from "./triage";

let db: Database;
let close: () => Promise<void>;
let collegeId: string;

beforeAll(async () => {
  ({ db, close } = await createTestDb());
  collegeId = (await fixtures(db).college({ slug: "university-of-chicago", name: "University of Chicago", status: "draft" })).id;
});
afterAll(() => close());
beforeEach(async () => {
  await db.delete(s.candidateItems);
});

const add = (url: string, title: string, extra: Partial<typeof s.candidateItems.$inferInsert> = {}) =>
  db.insert(s.candidateItems).values({ url, title, collegeId, ...extra }).returning().then(([r]) => r);

/** The model's verdict is keyed off the headline, so each test controls it. */
function deps(extra: Partial<TriageDeps> = {}): TriageDeps & { seen: TriageInput[] } {
  const seen: TriageInput[] = [];
  return {
    seen,
    classify: async (input): Promise<TriageResult> => {
      seen.push(input);
      const verdict = input.title?.includes("[irrelevant]") ? "irrelevant" : input.title?.includes("[unsure]") ? "unsure" : "relevant";
      return { ok: true, verdict, reason: `Model says ${verdict}.`, model: "test-model" };
    },
    resolveGoogle: async (url) => (url.includes("resolvable") ? "https://news.example/resolved" : null),
    readArticle: async (url) => (url.startsWith("https://news.example") ? "Article body." : null),
    sleep: async () => {},
    ...extra,
  };
}

describe("triageInbox", () => {
  it("dismisses only irrelevant items, records every verdict, and stores resolved publisher URLs", async () => {
    const irrelevant = await add("https://news.example/crime-lab", "Crime Lab study on shootings [irrelevant]");
    const relevant = await add("https://news.google.com/rss/articles/resolvable", "Assault reported at frat house");
    const unsure = await add("https://news.example/brief", "Campus brief [unsure]");

    const d = deps();
    const report = await triageInbox(db, {}, d);
    expect(report).toMatchObject({ dismissed: 1, failed: 0, remaining: false, model: "test-model" });

    const [a] = await db.select().from(s.candidateItems).where(eq(s.candidateItems.id, irrelevant.id));
    expect(a).toMatchObject({ status: "dismissed", reviewedBy: triageActor("test-model"), aiVerdict: "irrelevant", aiReason: "Model says irrelevant." });
    const [b] = await db.select().from(s.candidateItems).where(eq(s.candidateItems.id, relevant.id));
    expect(b).toMatchObject({ status: "new", aiVerdict: "relevant", resolvedUrl: "https://news.example/resolved", reviewedBy: null });
    const [c] = await db.select().from(s.candidateItems).where(eq(s.candidateItems.id, unsure.id));
    expect(c).toMatchObject({ status: "new", aiVerdict: "unsure" });

    // The model read the article behind the resolved link.
    expect(d.seen.find((i) => i.title === "Assault reported at frat house")?.text).toBe("Article body.");
  });

  it("never dismisses court dockets or possible case updates", async () => {
    const f = fixtures(db);
    const kase = await f.case({ collegeIds: [collegeId] });
    await add("https://www.courtlistener.com/docket/1/doe-v-uchicago/", "Doe v. University of Chicago [irrelevant]");
    await add("https://news.example/case", "Follow-up [irrelevant]", { caseId: kase.id });

    const report = await triageInbox(db, {}, deps());
    expect(report.dismissed).toBe(0);
    expect(report.items.map((i) => i.kept).sort()).toEqual(["court docket", "possible case update"]);
    expect((await db.select().from(s.candidateItems)).every((r) => r.status === "new" && r.aiVerdict === "irrelevant")).toBe(true);
  });

  it("writes nothing in a dry run", async () => {
    await add("https://news.example/x", "Unrelated [irrelevant]");
    const report = await triageInbox(db, { dryRun: true }, deps());
    expect(report.dismissed).toBe(1);
    const [row] = await db.select().from(s.candidateItems);
    expect(row).toMatchObject({ status: "new", aiVerdict: null, aiTriagedAt: null });
  });

  it("skips items already triaged or reviewed, and keeps failed items in the inbox", async () => {
    await add("https://news.example/done", "Already looked at [irrelevant]", { aiTriagedAt: new Date(), aiVerdict: "relevant" });
    await add("https://news.example/accepted", "Accepted [irrelevant]", { status: "accepted" });
    const failing = await add("https://news.google.com/rss/articles/resolvable", "Model error");

    const report = await triageInbox(db, {}, deps({ classify: async () => ({ ok: false, reason: "HTTP 500" }) }));
    expect(report.items.map((i) => i.id)).toEqual([failing.id]);
    expect(report.failed).toBe(1);
    const [row] = await db.select().from(s.candidateItems).where(eq(s.candidateItems.id, failing.id));
    // Not marked as triaged, so the next run retries it; the resolved link is still saved.
    expect(row).toMatchObject({ status: "new", aiTriagedAt: null, resolvedUrl: "https://news.example/resolved" });
  });

  it("stops starting new items when the time budget runs out", async () => {
    await add("https://news.example/1", "One");
    await add("https://news.example/2", "Two");
    let t = 0;
    const report = await triageInbox(db, { budgetMs: 1000 }, deps({ now: () => (t += 800) }));
    expect(report.items).toHaveLength(1);
    expect(report.remaining).toBe(true);
  });
});

describe("restoring and accepting after triage", () => {
  it("restores an AI-dismissed item to the inbox", async () => {
    const item = await add("https://news.example/x", "Wrongly dismissed [irrelevant]");
    await triageInbox(db, {}, deps());
    expect(await restoreCandidate(db, item.id)).toEqual({ ok: true, value: undefined });
    const [row] = await db.select().from(s.candidateItems).where(eq(s.candidateItems.id, item.id));
    expect(row).toMatchObject({ status: "new", reviewedBy: null });
    expect(await restoreCandidate(db, item.id)).toMatchObject({ ok: false });
  });

  it("accepts a Google News item using its resolved publisher URL", async () => {
    const item = await add("https://news.google.com/rss/articles/abc", "Story", { resolvedUrl: "https://news.example/story" });
    const result = await acceptCandidate(
      db,
      item.id,
      acceptCandidateSchema.parse({ mode: "source_only", collegeId, topic: "other", scope: "institutional", sourceType: "reputable_journalism", publisher: "News", title: "Story" }),
      "Researcher",
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const [source] = await db.select().from(s.sources).where(eq(s.sources.id, result.value.sourceId));
    expect(source.url).toBe("https://news.example/story");
  });
});

describe("evaluateTriage", () => {
  it("compares the model with researchers' decisions, leaving out earlier AI dismissals, and writes nothing", async () => {
    await add("https://news.example/a1", "Accepted story", { status: "accepted", reviewedBy: "Alex" });
    await add("https://news.example/a2", "Accepted but model disagrees [irrelevant]", { status: "accepted", reviewedBy: "Alex" });
    await add("https://news.example/d1", "Dismissed story [irrelevant]", { status: "dismissed", reviewedBy: "Alex" });
    await add("https://news.example/d2", "AI dismissed [irrelevant]", { status: "dismissed", reviewedBy: triageActor("test-model") });

    const { summary, missed } = await evaluateTriage(db, { limit: 10 }, deps());
    expect(summary.accepted).toEqual({ total: 2, relevant: 1, unsure: 0, irrelevant: 1 });
    expect(summary.dismissed).toEqual({ total: 1, relevant: 0, unsure: 0, irrelevant: 1 });
    expect(missed.map((m) => m.title)).toEqual(["Accepted but model disagrees [irrelevant]"]);
    expect((await db.select().from(s.candidateItems)).every((r) => r.aiVerdict === null)).toBe(true);
  });
});

describe("parseTriageReply", () => {
  it("accepts a verdict with a reason, and rejects anything else", () => {
    expect(parseTriageReply('```json\n{"verdict":"irrelevant","reason":"Passing mention."}\n```', "m")).toEqual({ ok: true, verdict: "irrelevant", reason: "Passing mention.", model: "m" });
    expect(parseTriageReply('{"verdict":"maybe","reason":"x"}', "m")).toMatchObject({ ok: false });
    expect(parseTriageReply('{"verdict":"relevant"}', "m")).toMatchObject({ ok: false });
    expect(parseTriageReply("not json", "m")).toMatchObject({ ok: false });
  });
});
