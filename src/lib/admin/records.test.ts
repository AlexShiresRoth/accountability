import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import * as s from "@/db/schema";
import type { Database } from "@/db/types";
import { createTestDb } from "@/test/db";
import { fixtures } from "@/test/fixtures";
import { acceptCandidate, candidateCounts, dismissCandidate, listCandidates } from "./inbox";
import {
  addCitation,
  cellKey,
  createSource,
  deleteRecord,
  parseCellValue,
  parseStatisticsGrid,
  removeCitation,
  saveStatisticsGrid,
  setFootnoteLinks,
  unfoundedKey,
  updateSource,
} from "./records";
import { acceptCandidateSchema, collegeSchema, formValues, sourceSchema } from "./validation";
import { getStatus } from "./workflow";

let db: Database;
let close: () => Promise<void>;
let f: ReturnType<typeof fixtures>;
const actor = "Test Researcher";

beforeAll(async () => {
  ({ db, close } = await createTestDb());
  f = fixtures(db);
});
afterAll(() => close());

async function report(status: "draft" | "verified" = "draft") {
  const college = await f.college();
  const src = await f.source();
  return f.report({ collegeId: college.id, sourceId: src.id, status });
}

describe("statistics grid parsing", () => {
  it("distinguishes blank (no figure), '-' (not reported), and 0", () => {
    expect(parseCellValue("")).toEqual({ value: undefined });
    expect(parseCellValue("  ")).toEqual({ value: undefined });
    expect(parseCellValue("-")).toEqual({ value: null });
    expect(parseCellValue("—")).toEqual({ value: null });
    expect(parseCellValue("n/a")).toEqual({ value: null });
    expect(parseCellValue("0")).toEqual({ value: 0 });
    expect(parseCellValue("12")).toEqual({ value: 12 });
  });

  it("rejects anything that is not a whole number", () => {
    for (const bad of ["1.5", "-3", "abc", "3 incidents", "1e3"]) expect(parseCellValue(bad)).toHaveProperty("error");
  });

  it("parses named grid fields and reports errors by cell", () => {
    const { entries, errors } = parseStatisticsGrid([
      [cellKey(2024, "rape", "on_campus"), "5"],
      [cellKey(2024, "stalking", "noncampus"), "-"],
      [cellKey(2023, "fondling", "on_campus"), "x"],
      ["cell|2024|arson|on_campus", "1"],
      ["unrelated", "ignored"],
    ]);
    expect(entries).toEqual([
      { year: 2024, offense: "rape", geography: "on_campus", value: 5 },
      { year: 2024, offense: "stalking", geography: "noncampus", value: null },
    ]);
    expect(errors).toHaveLength(2);
  });
});

describe("unfounded counts", () => {
  it("attaches unfounded counts to their cell; blank and '-' mean none given", () => {
    const { entries, errors } = parseStatisticsGrid([
      [cellKey(2024, "rape", "on_campus"), "5"],
      [unfoundedKey(2024, "rape", "on_campus"), "1"],
      [cellKey(2024, "fondling", "on_campus"), "2"],
      [unfoundedKey(2024, "fondling", "on_campus"), ""],
      [cellKey(2024, "stalking", "on_campus"), "3"],
      [unfoundedKey(2024, "stalking", "on_campus"), "-"],
    ]);
    expect(errors).toEqual([]);
    expect(entries.map((e) => [e.offense, e.value, e.unfounded])).toEqual([
      ["rape", 5, 1],
      ["fondling", 2, null],
      ["stalking", 3, null],
    ]);
  });

  it("rejects an unfounded count without its figure, and invalid values", () => {
    const { errors } = parseStatisticsGrid([
      [cellKey(2024, "rape", "on_campus"), ""],
      [unfoundedKey(2024, "rape", "on_campus"), "2"],
      [cellKey(2024, "fondling", "on_campus"), "1"],
      [unfoundedKey(2024, "fondling", "on_campus"), "two"],
      [unfoundedKey(2023, "stalking", "noncampus"), "1"],
    ]);
    expect(errors).toEqual([
      expect.stringContaining("fondling (on campus), unfounded"),
      "2024 rape (on campus): enter the figure before its unfounded count.",
      "2023 stalking (noncampus): unfounded count submitted without its figure.",
    ]);
  });

  it("saves unfounded counts and unpublishes a published figure whose unfounded count changes", async () => {
    const r = await report("verified");
    const stat = await f.statistic({ cleryReportId: r.id, count: 4, unfoundedCount: null });

    const same = await saveStatisticsGrid(db, r.id, [{ year: 2024, offense: "rape", geography: "on_campus", value: 4, unfounded: null }], actor);
    expect(same).toMatchObject({ ok: true, value: { updated: 0 } });
    expect(await getStatus(db, "crime_statistic", stat.id)).toBe("verified");

    const changed = await saveStatisticsGrid(db, r.id, [{ year: 2024, offense: "rape", geography: "on_campus", value: 4, unfounded: 1 }], actor);
    expect(changed).toMatchObject({ ok: true, value: { updated: 1, unpublished: 1 } });
    const [row] = await db.select().from(s.crimeStatistics).where(eq(s.crimeStatistics.id, stat.id));
    expect(row).toMatchObject({ count: 4, unfoundedCount: 1, status: "pending_review" });
  });

  it("leaves the unfounded count alone when its field is not submitted", async () => {
    const r = await report();
    const stat = await f.statistic({ cleryReportId: r.id, count: 2, unfoundedCount: 1 });
    await saveStatisticsGrid(db, r.id, [{ year: 2024, offense: "rape", geography: "on_campus", value: 3 }], actor);
    const [row] = await db.select().from(s.crimeStatistics).where(eq(s.crimeStatistics.id, stat.id));
    expect(row).toMatchObject({ count: 3, unfoundedCount: 1 });
  });

  it("stores the unfounded count on new figures", async () => {
    const r = await report();
    await saveStatisticsGrid(db, r.id, [{ year: 2023, offense: "stalking", geography: "noncampus", value: 0, unfounded: 2 }], actor);
    const [row] = await db.select().from(s.crimeStatistics).where(eq(s.crimeStatistics.cleryReportId, r.id));
    expect(row).toMatchObject({ count: 0, unfoundedCount: 2 });
  });
});

describe("saveStatisticsGrid", () => {
  it("creates, updates, and deletes draft figures", async () => {
    const r = await report();
    let res = await saveStatisticsGrid(db, r.id, [
      { year: 2024, offense: "rape", geography: "on_campus", value: 3 },
      { year: 2024, offense: "stalking", geography: "on_campus", value: null },
      { year: 2024, offense: "fondling", geography: "on_campus", value: undefined },
    ], actor);
    expect(res).toMatchObject({ ok: true, value: { created: 2, updated: 0, deleted: 0 } });

    res = await saveStatisticsGrid(db, r.id, [
      { year: 2024, offense: "rape", geography: "on_campus", value: 4 },
      { year: 2024, offense: "stalking", geography: "on_campus", value: undefined },
    ], actor);
    expect(res).toMatchObject({ ok: true, value: { created: 0, updated: 1, deleted: 1 } });

    const rows = await db.select().from(s.crimeStatistics).where(eq(s.crimeStatistics.cleryReportId, r.id));
    expect(rows.map((x) => [x.offense, x.count, x.status, x.createdBy])).toEqual([["rape", 4, "draft", actor]]);
  });

  it("unpublishes a changed published figure and refuses to clear one", async () => {
    const r = await report("verified");
    const stat = await f.statistic({ cleryReportId: r.id, calendarYear: 2024, offense: "rape", count: 3 });

    const cleared = await saveStatisticsGrid(db, r.id, [{ year: 2024, offense: "rape", geography: "on_campus", value: undefined }], actor);
    expect(cleared).toMatchObject({ ok: false });
    expect(await getStatus(db, "crime_statistic", stat.id)).toBe("verified");

    const edited = await saveStatisticsGrid(db, r.id, [{ year: 2024, offense: "rape", geography: "on_campus", value: 5 }], actor);
    expect(edited).toMatchObject({ ok: true, value: { updated: 1, unpublished: 1 } });
    expect(await getStatus(db, "crime_statistic", stat.id)).toBe("pending_review");
  });

  it("leaves unchanged published figures published", async () => {
    const r = await report("verified");
    const stat = await f.statistic({ cleryReportId: r.id, count: 3 });
    await saveStatisticsGrid(db, r.id, [{ year: 2024, offense: "rape", geography: "on_campus", value: 3 }], actor);
    expect(await getStatus(db, "crime_statistic", stat.id)).toBe("verified");
  });
});

describe("footnote links", () => {
  it("links a footnote to figures in its own report only", async () => {
    const r = await report();
    const other = await report();
    const note = await f.footnote({ cleryReportId: r.id });
    const mine = await f.statistic({ cleryReportId: r.id });
    const foreign = await f.statistic({ cleryReportId: other.id });

    expect(await setFootnoteLinks(db, note.id, [mine.id, foreign.id], actor)).toMatchObject({ ok: false });
    expect(await setFootnoteLinks(db, note.id, [mine.id], actor)).toMatchObject({ ok: true });
    const links = await db.select().from(s.statisticFootnoteLinks).where(eq(s.statisticFootnoteLinks.footnoteId, note.id));
    expect(links.map((l) => l.crimeStatisticId)).toEqual([mine.id]);
  });

  it("changing a published footnote's links sends it back for review", async () => {
    const r = await report("verified");
    const note = await f.footnote({ cleryReportId: r.id });
    const a = await f.statistic({ cleryReportId: r.id, offense: "rape" });
    const b = await f.statistic({ cleryReportId: r.id, offense: "fondling" });
    await f.link(note, a);
    expect(await setFootnoteLinks(db, note.id, [a.id], actor)).toMatchObject({ ok: true, unchanged: true });
    expect(await setFootnoteLinks(db, note.id, [a.id, b.id], actor)).toMatchObject({ ok: true, unpublished: true });
    expect(await getStatus(db, "statistic_footnote", note.id)).toBe("pending_review");
  });
});

describe("citations", () => {
  it("adds a citation to the specific record and unpublishes it when its only evidence is removed", async () => {
    const college = await f.college({ status: "draft" });
    const src = await f.source();
    const added = await addCitation(db, "college", college.id, { sourceId: src.id, pinpoint: "p. 3", excerpt: null, claim: null });
    expect(added.ok).toBe(true);
    await db.update(s.colleges).set({ status: "verified" }).where(eq(s.colleges.id, college.id));

    const removed = await removeCitation(db, (added as { value: string }).value, actor);
    expect(removed).toMatchObject({ ok: true, unpublished: true });
    expect(await getStatus(db, "college", college.id)).toBe("pending_review");
  });
});

describe("source edits", () => {
  it("unpublishes a verified source only when content actually changes", async () => {
    const created = await createSource(db, sourceSchema.parse({ type: "university", publisher: "P", title: "T", url: "https://x.edu/r" }), actor);
    if (!created.ok) throw new Error("create failed");
    const id = created.value;
    await db.update(s.sources).set({ status: "verified" }).where(eq(s.sources.id, id));
    const input = sourceSchema.parse({ type: "university", publisher: "P", title: "T", url: "https://x.edu/r" });

    expect(await updateSource(db, id, input, actor)).toMatchObject({ ok: true, unchanged: true });
    expect(await getStatus(db, "source", id)).toBe("verified");
    expect(await updateSource(db, id, { ...input, title: "T2" }, actor)).toMatchObject({ ok: true, unpublished: true });
    expect(await getStatus(db, "source", id)).toBe("pending_review");
  });
});

describe("deleteRecord", () => {
  it("refuses published records and records others depend on", async () => {
    const published = await f.source();
    expect(await deleteRecord(db, "source", published.id)).toMatchObject({ ok: false });

    const cited = await f.source({ status: "draft" });
    const college = await f.college();
    await f.citation({ sourceId: cited.id, collegeId: college.id });
    expect(await deleteRecord(db, "source", cited.id)).toEqual({
      ok: false,
      problems: ["Other records still depend on this one (for example, citations or reports). Remove those first."],
    });

    const loose = await f.source({ status: "draft" });
    expect(await deleteRecord(db, "source", loose.id)).toMatchObject({ ok: true });
  });
});

describe("inbox", () => {
  async function candidate(collegeId: string, title = "Title IX office revises procedures") {
    const [row] = await db
      .insert(s.candidateItems)
      .values({ url: `https://news.example/${crypto.randomUUID()}`, title, publisher: "news.example", collegeId, suggestedTopic: "title_ix_process" })
      .returning();
    return row;
  }
  const input = (collegeId: string, o: Record<string, string> = {}) =>
    acceptCandidateSchema.parse({
      collegeId,
      scope: "institutional",
      topic: "policy_change",
      summary: "Reports on the university's revised Title IX grievance procedures.",
      sourceType: "reputable_journalism",
      publisher: "News Example",
      title: "Title IX office revises procedures",
      publicationDate: "2026-09-01",
      ...o,
    });

  it("accepting creates a draft source and draft coverage, never anything published", async () => {
    const college = await f.college();
    const c = await candidate(college.id);
    const res = await acceptCandidate(db, c.id, input(college.id), actor, "2026-09-30");
    expect(res.ok).toBe(true);
    const { sourceId, coverageId } = (res as { value: { sourceId: string; coverageId: string } }).value;

    const [src] = await db.select().from(s.sources).where(eq(s.sources.id, sourceId));
    expect(src).toMatchObject({ status: "draft", url: c.url, retrievedAt: "2026-09-30", createdBy: actor, type: "reputable_journalism" });
    const [cov] = await db.select().from(s.collegeCoverage).where(eq(s.collegeCoverage.id, coverageId));
    expect(cov).toMatchObject({ status: "draft", scope: "institutional", caseId: null });
    expect((await listCandidates(db, "accepted")).items.map((x) => x.id)).toContain(c.id);
  });

  it("cannot accept or dismiss a candidate twice", async () => {
    const college = await f.college();
    const c = await candidate(college.id);
    await acceptCandidate(db, c.id, input(college.id), actor);
    expect(await acceptCandidate(db, c.id, input(college.id), actor)).toMatchObject({ ok: false });
    expect(await dismissCandidate(db, c.id, actor)).toMatchObject({ ok: false });

    const d = await candidate(college.id);
    expect(await dismissCandidate(db, d.id, actor)).toMatchObject({ ok: true });
    expect(await dismissCandidate(db, d.id, actor)).toMatchObject({ ok: false });
  });

  it("requires the publisher's own URL for items found via Google News", async () => {
    const college = await f.college();
    const [c] = await db
      .insert(s.candidateItems)
      .values({ url: `https://news.google.com/rss/articles/${crypto.randomUUID()}`, title: "T", publisher: "CBS News", collegeId: college.id })
      .returning();

    expect(await acceptCandidate(db, c.id, input(college.id), actor)).toMatchObject({ ok: false });
    expect(acceptCandidateSchema.safeParse({ ...input(college.id), articleUrl: "https://news.google.com/articles/abc" }).success).toBe(false);

    const res = await acceptCandidate(db, c.id, input(college.id, { articleUrl: "https://www.cbsnews.com/news/example/" }), actor);
    expect(res.ok).toBe(true);
    const [src] = await db.select().from(s.sources).where(eq(s.sources.id, (res as { value: { sourceId: string } }).value.sourceId));
    expect(src.url).toBe("https://www.cbsnews.com/news/example/");
  });

  it("can save a lead (e.g. a court docket) as a draft source only, without a summary or coverage", async () => {
    const college = await f.college();
    const [c] = await db
      .insert(s.candidateItems)
      .values({ url: `https://www.courtlistener.com/docket/${Date.now()}/doe-v-x/`, title: "Doe v. X (N.D.N.Y.)", publisher: "Federal court docket", collegeId: college.id })
      .returning();
    const parsed = acceptCandidateSchema.parse({
      mode: "source_only",
      collegeId: college.id,
      scope: "institutional",
      topic: "lawsuit",
      summary: "",
      sourceType: "court_record",
      publisher: "U.S. District Court, N.D.N.Y.",
      title: "Doe v. X (N.D.N.Y.)",
    });
    const res = await acceptCandidate(db, c.id, parsed, actor);
    expect(res).toMatchObject({ ok: true, value: { coverageId: null } });
    const coverage = await db.select().from(s.collegeCoverage).where(eq(s.collegeCoverage.collegeId, college.id));
    expect(coverage).toEqual([]);
  });

  it("requires a neutral summary and a case link for case-specific coverage", () => {
    const college = crypto.randomUUID();
    expect(acceptCandidateSchema.safeParse({ ...input(college), summary: "Title IX office revises procedures" }).success).toBe(false);
    expect(acceptCandidateSchema.safeParse({ ...input(college), summary: "Too short" }).success).toBe(false);
    expect(acceptCandidateSchema.safeParse({ ...input(college), scope: "case", caseId: "" }).success).toBe(false);
  });
});

describe("form validation", () => {
  it("turns empty fields into null and rejects bad URLs and dates", () => {
    const fd = new FormData();
    for (const [k, v] of Object.entries({ type: "university", publisher: " P ", title: "T", url: "https://x.edu", publicationDate: "", archivedUrl: "", notes: "" })) fd.set(k, v);
    const parsed = sourceSchema.parse(formValues(fd));
    expect(parsed).toMatchObject({ publisher: "P", publicationDate: null, archivedUrl: null, notes: null });

    expect(sourceSchema.safeParse({ type: "university", publisher: "P", title: "T", url: "javascript:alert(1)" }).success).toBe(false);
    expect(sourceSchema.safeParse({ type: "university", publisher: "P", title: "T", url: "https://x.edu", retrievedAt: "2026-13-45" }).success).toBe(false);
    expect(sourceSchema.safeParse({ type: "university", publisher: "P", title: "T" }).success).toBe(false);
  });

  it("parses colleges: slug format, aliases, enrollment", () => {
    expect(collegeSchema.parse({ slug: "cornell-university", name: "Cornell", aliases: "Cornell, CU ,", enrollment: "26,284" })).toMatchObject({
      aliases: ["Cornell", "CU"],
      enrollment: 26284,
    });
    expect(collegeSchema.safeParse({ slug: "Cornell University", name: "Cornell" }).success).toBe(false);
    expect(collegeSchema.safeParse({ slug: "c", name: "C", enrollment: "about 20k" }).success).toBe(false);
  });
});

describe("inbox pagination", () => {
  let pdb: Database;
  let pclose: () => Promise<void>;
  beforeAll(async () => {
    ({ db: pdb, close: pclose } = await createTestDb());
    const college = await fixtures(pdb).college();
    await pdb.insert(s.candidateItems).values(
      Array.from({ length: 27 }, (_, i) => ({
        url: `https://news.example/p${i}`,
        title: `Item ${i}`,
        collegeId: college.id,
        // Item 0 is undated; the rest are one day apart, Item 26 newest.
        publishedAt: i === 0 ? null : new Date(Date.UTC(2026, 0, 1 + i)),
      })),
    );
    await pdb.insert(s.candidateItems).values({ url: "https://news.example/dismissed", title: "Gone", status: "dismissed" });
  });
  afterAll(() => pclose());

  it("returns pages newest first, undated last, with totals", async () => {
    const first = await listCandidates(pdb, "new", 1, 10);
    expect(first).toMatchObject({ total: 27, page: 1, pageCount: 3, pageSize: 10 });
    expect(first.items.map((x) => x.title)).toEqual(Array.from({ length: 10 }, (_, i) => `Item ${26 - i}`));

    const last = await listCandidates(pdb, "new", 3, 10);
    expect(last.items.map((x) => x.title)).toEqual(["Item 6", "Item 5", "Item 4", "Item 3", "Item 2", "Item 1", "Item 0"]);
  });

  it("never repeats or skips an item across pages", async () => {
    const pages = await Promise.all([1, 2, 3].map((p) => listCandidates(pdb, "new", p, 10)));
    const ids = pages.flatMap((p) => p.items.map((x) => x.id));
    expect(ids).toHaveLength(27);
    expect(new Set(ids).size).toBe(27);
  });

  it("clamps out-of-range and invalid page numbers", async () => {
    expect((await listCandidates(pdb, "new", 99, 10)).page).toBe(3);
    expect((await listCandidates(pdb, "new", 0, 10)).page).toBe(1);
    expect((await listCandidates(pdb, "new", Number.NaN, 10)).page).toBe(1);
    expect(await listCandidates(pdb, "accepted", 5, 10)).toMatchObject({ total: 0, page: 1, pageCount: 1, items: [] });
  });

  it("counts candidates per status for the tabs", async () => {
    expect(await candidateCounts(pdb)).toEqual({ new: 27, accepted: 0, dismissed: 1 });
  });
});
