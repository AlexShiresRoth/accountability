import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database } from "@/db/types";
import type { VerificationStatus } from "@/lib/enums";
import { createTestDb } from "@/test/db";
import { fixtures } from "@/test/fixtures";
import { citationKey, getCase, getCollegeProfile, listPublicSourceIndex, listPublicSources, listSitemapEntries, searchColleges } from "./queries";
import { shouldHideDemo, type PublicContext } from "./visibility";

let db: Database;
let close: () => Promise<void>;
let f: ReturnType<typeof fixtures>;
let ctx: PublicContext;

beforeAll(async () => {
  ({ db, close } = await createTestDb());
  f = fixtures(db);
  ctx = { db, hideDemo: true };
});
afterAll(() => close());

const HIDDEN: VerificationStatus[] = ["draft", "pending_review", "rejected"];

const profile = async (slug: string, c = ctx) => (await getCollegeProfile(c, slug))!;

describe("verification gating", () => {
  describe.each(HIDDEN)("%s records never appear publicly", (status) => {
    it("hides the college from search and profile", async () => {
      const college = await f.college({ status, name: `Hidden ${status} University` });
      expect(await getCollegeProfile(ctx, college.slug)).toBeNull();
      expect((await searchColleges(ctx, `Hidden ${status}`)).map((c) => c.id)).not.toContain(college.id);
    });

    it("hides the case", async () => {
      const c = await f.case({ status });
      expect(await getCase(ctx, c.slug)).toBeNull();
    });

    it("hides the source from the source index", async () => {
      const source = await f.source({ status });
      expect((await listPublicSources(ctx)).map((x) => x.id)).not.toContain(source.id);
    });

    it("hides every kind of child record on a public college profile", async () => {
      const college = await f.college();
      const source = await f.source();
      const report = await f.report({ collegeId: college.id, sourceId: source.id });
      const stat = await f.statistic({ cleryReportId: report.id, status });
      const footnote = await f.footnote({ cleryReportId: report.id, status });
      await f.action({ collegeId: college.id, status });
      await f.response({ collegeId: college.id, status });
      await f.policy({ collegeId: college.id, status });
      await f.resource({ collegeId: college.id, status });
      await f.coverage({ collegeId: college.id, sourceId: source.id, status });
      await f.correction({ collegeId: college.id, status });
      await f.case({ collegeIds: [college.id], status });

      const p = await profile(college.slug);
      expect(p.statistics.map((x) => x.statisticId)).not.toContain(stat.id);
      expect(p.footnotes.map((x) => x.id)).not.toContain(footnote.id);
      expect(p.actions).toEqual([]);
      expect(p.responses).toEqual([]);
      expect(p.policies).toEqual([]);
      expect(p.resources).toEqual([]);
      expect(p.coverage).toEqual([]);
      expect(p.corrections).toEqual([]);
      expect(p.cases).toEqual([]);
    });

    it("hides the Clery report and all its statistics", async () => {
      const college = await f.college();
      const source = await f.source();
      const report = await f.report({ collegeId: college.id, sourceId: source.id, status });
      await f.statistic({ cleryReportId: report.id });
      const p = await profile(college.slug);
      expect(p.reports).toEqual([]);
      expect(p.statistics).toEqual([]);
    });

    it("hides case events on a public case", async () => {
      const c = await f.case();
      const visible = await f.event({ caseId: c.id });
      await f.event({ caseId: c.id, status });
      const detail = (await getCase(ctx, c.slug))!;
      expect(detail.events.map((e) => e.id)).toEqual([visible.id]);
    });
  });

  describe("needs_update records are shown, marked as under review", () => {
    it("shows the college and its records with underReview", async () => {
      const college = await f.college({ status: "needs_update" });
      const source = await f.source();
      const report = await f.report({ collegeId: college.id, sourceId: source.id });
      await f.statistic({ cleryReportId: report.id, status: "needs_update" });
      await f.action({ collegeId: college.id, status: "needs_update" });

      const p = await profile(college.slug);
      expect(p.college.underReview).toBe(true);
      expect(p.statistics[0].underReview).toBe(true);
      expect(p.actions[0].underReview).toBe(true);
      expect(p.reports[0].underReview).toBe(false);
    });

    it("shows case events with underReview", async () => {
      const c = await f.case();
      await f.event({ caseId: c.id, status: "needs_update" });
      const detail = (await getCase(ctx, c.slug))!;
      expect(detail.events[0].underReview).toBe(true);
    });
  });

  describe("demo data", () => {
    it("is hidden when hideDemo is set (always the case in production)", async () => {
      const college = await f.college({ isDemo: true });
      expect(await getCollegeProfile(ctx, college.slug)).toBeNull();
      expect(await getCollegeProfile({ db, hideDemo: false }, college.slug)).not.toBeNull();
    });

    it("is always hidden against the production database, whatever HIDE_DEMO_DATA says", () => {
      const env = (o: Record<string, string>) => o as unknown as NodeJS.ProcessEnv;
      expect(shouldHideDemo(env({ VERCEL_ENV: "production", HIDE_DEMO_DATA: "false" }))).toBe(true);
      expect(shouldHideDemo(env({ DB_TARGET: "production" }))).toBe(true);
      expect(shouldHideDemo(env({ NODE_ENV: "production" }))).toBe(false);
      expect(shouldHideDemo(env({ HIDE_DEMO_DATA: "true" }))).toBe(true);
    });

    it("hides demo children of a real college", async () => {
      const college = await f.college();
      await f.action({ collegeId: college.id, isDemo: true });
      expect((await profile(college.slug)).actions).toEqual([]);
      expect((await profile(college.slug, { db, hideDemo: false })).actions).toHaveLength(1);
    });
  });
});

describe("nested gating", () => {
  it("hides a Clery report (and its statistics) whose source is not verified", async () => {
    const college = await f.college();
    const source = await f.source({ status: "pending_review" });
    const report = await f.report({ collegeId: college.id, sourceId: source.id });
    await f.statistic({ cleryReportId: report.id });
    const p = await profile(college.slug);
    expect(p.reports).toEqual([]);
    expect(p.statistics).toEqual([]);
  });

  it("shows a citation only when its source is public", async () => {
    const college = await f.college();
    const good = await f.source();
    const bad = await f.source({ status: "draft" });
    const action = await f.action({ collegeId: college.id });
    await f.citation({ sourceId: good.id, institutionActionId: action.id, pinpoint: "p. 2" });
    await f.citation({ sourceId: bad.id, institutionActionId: action.id });

    const cites = (await profile(college.slug)).citations[citationKey("institutionAction", action.id)];
    expect(cites).toHaveLength(1);
    expect(cites[0].source.id).toBe(good.id);
    expect(cites[0].pinpoint).toBe("p. 2");
  });

  it("does not return citations for hidden records", async () => {
    const college = await f.college();
    const source = await f.source();
    const hidden = await f.action({ collegeId: college.id, status: "draft" });
    await f.citation({ sourceId: source.id, institutionActionId: hidden.id });
    const p = await profile(college.slug);
    expect(p.citations[citationKey("institutionAction", hidden.id)]).toBeUndefined();
  });

  it("attaches citations to the specific record they support", async () => {
    const college = await f.college();
    const source = await f.source();
    const a = await f.action({ collegeId: college.id, title: "A" });
    const b = await f.action({ collegeId: college.id, title: "B" });
    const cite = await f.citation({ sourceId: source.id, institutionActionId: a.id });
    const p = await profile(college.slug);
    expect(p.citations[citationKey("institutionAction", a.id)].map((c) => c.id)).toEqual([cite.id]);
    expect(p.citations[citationKey("institutionAction", b.id)]).toBeUndefined();
  });

  it("does not attach a verified footnote to a hidden statistic", async () => {
    const college = await f.college();
    const source = await f.source();
    const report = await f.report({ collegeId: college.id, sourceId: source.id });
    const visible = await f.statistic({ cleryReportId: report.id, offense: "rape" });
    const hidden = await f.statistic({ cleryReportId: report.id, offense: "fondling", status: "draft" });
    const footnote = await f.footnote({ cleryReportId: report.id });
    await f.link(footnote, visible);
    await f.link(footnote, hidden);

    const p = await profile(college.slug);
    expect(p.footnotes[0].statisticIds).toEqual([visible.id]);
    expect(p.statistics.find((x) => x.statisticId === visible.id)!.footnoteIds).toEqual([footnote.id]);
  });

  it("associates footnotes only with the statistics they are linked to", async () => {
    const college = await f.college();
    const source = await f.source();
    const report = await f.report({ collegeId: college.id, sourceId: source.id });
    const rape2024 = await f.statistic({ cleryReportId: report.id, calendarYear: 2024, offense: "rape", count: 9 });
    const rape2023 = await f.statistic({ cleryReportId: report.id, calendarYear: 2023, offense: "rape", count: 2 });
    const delayed = await f.footnote({
      cleryReportId: report.id,
      originalText: "Includes one delayed report describing several incidents from prior years.",
    });
    await f.link(delayed, rape2024);

    const p = await profile(college.slug);
    expect(p.statistics.find((x) => x.statisticId === rape2024.id)!.footnoteIds).toEqual([delayed.id]);
    expect(p.statistics.find((x) => x.statisticId === rape2023.id)!.footnoteIds).toEqual([]);
    expect(p.footnotes[0].originalText).toBe("Includes one delayed report describing several incidents from prior years.");
  });

  it("resolves overlapping reports to the latest figure and exposes the revision", async () => {
    const college = await f.college();
    const source = await f.source();
    const r2024 = await f.report({ collegeId: college.id, sourceId: source.id, reportYear: 2024 });
    const r2025 = await f.report({ collegeId: college.id, sourceId: source.id, reportYear: 2025 });
    await f.statistic({ cleryReportId: r2024.id, calendarYear: 2023, count: 4 });
    const latest = await f.statistic({ cleryReportId: r2025.id, calendarYear: 2023, count: 5 });

    const [cell] = (await profile(college.slug)).statistics;
    expect(cell.statisticId).toBe(latest.id);
    expect(cell.count).toBe(5);
    expect(cell.revisions).toEqual([{ reportYear: 2024, count: 4 }]);
  });

  it("does not let a hidden newer report override a public older figure", async () => {
    const college = await f.college();
    const source = await f.source();
    const r2024 = await f.report({ collegeId: college.id, sourceId: source.id, reportYear: 2024 });
    const r2025 = await f.report({ collegeId: college.id, sourceId: source.id, reportYear: 2025, status: "draft" });
    const published = await f.statistic({ cleryReportId: r2024.id, calendarYear: 2023, count: 4 });
    await f.statistic({ cleryReportId: r2025.id, calendarYear: 2023, count: 5 });

    const [cell] = (await profile(college.slug)).statistics;
    expect(cell.statisticId).toBe(published.id);
    expect(cell.revisions).toEqual([]);
  });

  describe("coverage", () => {
    it("hides coverage whose article source is not verified", async () => {
      const college = await f.college();
      const article = await f.source({ type: "reputable_journalism", status: "pending_review" });
      await f.coverage({ collegeId: college.id, sourceId: article.id });
      expect((await profile(college.slug)).coverage).toEqual([]);
    });

    it("shows case-scoped coverage only when the linked case is public", async () => {
      const college = await f.college();
      const article = await f.source({ type: "reputable_journalism" });
      const draftCase = await f.case({ collegeIds: [college.id], status: "draft" });
      const publicCase = await f.case({ collegeIds: [college.id] });
      await f.coverage({ collegeId: college.id, sourceId: article.id, scope: "case", caseId: draftCase.id });
      const shown = await f.coverage({ collegeId: college.id, sourceId: article.id, scope: "case", caseId: publicCase.id });

      const p = await profile(college.slug);
      expect(p.coverage.map((c) => c.id)).toEqual([shown.id]);
      expect(p.coverage[0].caseSlug).toBe(publicCase.slug);
    });
  });

  it("lists only public colleges on a public case", async () => {
    const a = await f.college({ name: "Public A" });
    const b = await f.college({ name: "Draft B", status: "draft" });
    const c = await f.case({ collegeIds: [a.id, b.id] });
    const detail = (await getCase(ctx, c.slug))!;
    expect(detail.colleges.map((x) => x.id)).toEqual([a.id]);
  });

  it("shows a multi-college case on each public college's profile", async () => {
    const a = await f.college();
    const b = await f.college();
    const c = await f.case({ collegeIds: [a.id, b.id] });
    expect((await profile(a.slug)).cases.map((x) => x.id)).toEqual([c.id]);
    expect((await profile(b.slug)).cases.map((x) => x.id)).toEqual([c.id]);
  });
});

describe("case events", () => {
  it("orders events by date, then sequence, regardless of insertion order", async () => {
    const c = await f.case();
    await f.event({ caseId: c.id, eventDate: "2024-03-01", sequence: 0, eventType: "criminal_charge" });
    await f.event({ caseId: c.id, eventDate: "2023-11-15", sequence: 0, eventType: "police_report" });
    await f.event({ caseId: c.id, eventDate: "2024-03-01", sequence: -1, eventType: "arrest" });
    await f.event({ caseId: c.id, eventDate: "2025-06-30", sequence: 0, eventType: "conviction" });

    const detail = (await getCase(ctx, c.slug))!;
    expect(detail.events.map((e) => e.eventType)).toEqual(["police_report", "arrest", "criminal_charge", "conviction"]);
  });

  it("links superseded events only when both events are public", async () => {
    const c = await f.case();
    const original = await f.event({ caseId: c.id, eventType: "criminal_charge" });
    const update = await f.event({ caseId: c.id, eventDate: "2024-02-01", eventType: "dismissal", supersedesEventId: original.id });
    const hiddenUpdate = await f.event({ caseId: c.id, status: "draft", supersedesEventId: update.id });

    const detail = (await getCase(ctx, c.slug))!;
    const byId = new Map(detail.events.map((e) => [e.id, e]));
    expect(byId.get(original.id)!.supersededByEventId).toBe(update.id);
    expect(byId.get(update.id)!.supersedesEventId).toBe(original.id);
    expect(byId.get(update.id)!.supersededByEventId).toBeNull();
    expect(byId.has(hiddenUpdate.id)).toBe(false);
  });
});

describe("researcher-only data never leaks", () => {
  it("omits internal notes and reviewer names from public results", async () => {
    const secret = "INTERNAL-NOTE-DO-NOT-PUBLISH";
    const reviewer = "reviewer-name-private";
    const college = await f.college({ internalNotes: secret, reviewedBy: reviewer });
    const source = await f.source({ internalNotes: secret, reviewedBy: reviewer });
    const report = await f.report({ collegeId: college.id, sourceId: source.id, internalNotes: secret });
    await f.statistic({ cleryReportId: report.id, internalNotes: secret });
    const action = await f.action({ collegeId: college.id, internalNotes: secret, reviewedBy: reviewer });
    await f.citation({ sourceId: source.id, institutionActionId: action.id });
    const c = await f.case({
      collegeIds: [college.id],
      internalNotes: secret,
      checkNotes: secret,
      searchTerms: ["PRIVATE-SEARCH-TERM"],
      nextCheckOn: "2031-01-01",
    });
    await f.event({ caseId: c.id, internalNotes: secret, reviewedBy: reviewer });

    const payload = JSON.stringify([
      await getCollegeProfile(ctx, college.slug),
      await getCase(ctx, c.slug),
      await listPublicSources(ctx),
      await searchColleges(ctx),
      await listPublicSourceIndex(ctx),
    ]);
    expect(payload).not.toContain(secret);
    expect(payload).not.toContain(reviewer);
    // Case monitoring fields are researcher-only.
    expect(payload).not.toContain("PRIVATE-SEARCH-TERM");
    expect(payload).not.toContain("2031-01-01");
  });
});

describe("college search", () => {
  it("matches names and aliases, case-insensitively", async () => {
    const college = await f.college({ name: "Searchable University", aliases: ["SrchU College"] });
    expect((await searchColleges(ctx, "searchable")).map((c) => c.id)).toContain(college.id);
    expect((await searchColleges(ctx, "srchu")).map((c) => c.id)).toContain(college.id);
  });

  it("treats LIKE wildcards in the query literally", async () => {
    await f.college({ name: "Wildcard Test College" });
    expect(await searchColleges(ctx, "%")).toEqual([]);
    expect(await searchColleges(ctx, "_")).toEqual([]);
  });
});

describe("admin preview", () => {
  it("includes draft and pending records, flagged as unverified, but never rejected ones", async () => {
    const college = await f.college({ status: "draft" });
    const src = await f.source({ status: "pending_review" });
    const report = await f.report({ collegeId: college.id, sourceId: src.id, status: "pending_review" });
    await f.statistic({ cleryReportId: report.id, status: "draft" });
    await f.action({ collegeId: college.id, status: "pending_review", title: "Pending entry" });
    const verified = await f.action({ collegeId: college.id, title: "Verified entry" });
    await f.action({ collegeId: college.id, status: "rejected", title: "Rejected entry" });
    await f.citation({ sourceId: src.id, institutionActionId: verified.id });

    const preview = (await getCollegeProfile({ db, hideDemo: true, preview: true }, college.slug))!;
    expect(preview.college.unverified).toBe(true);
    expect(preview.actions.map((a) => [a.title, a.unverified])).toEqual([
      ["Pending entry", true],
      ["Verified entry", false],
    ]);
    expect(preview.statistics[0].unverified).toBe(true);
    expect(preview.citations[citationKey("institutionAction", verified.id)][0].source.unverified).toBe(true);
  });

  it("does not change what the public sees", async () => {
    const college = await f.college();
    await f.action({ collegeId: college.id, status: "pending_review" });
    const pub = (await getCollegeProfile(ctx, college.slug))!;
    expect(pub.actions).toEqual([]);
    expect(pub.college.unverified).toBe(false);
  });
});

describe("sitemap", () => {
  it("lists published and under-review colleges and cases, but nothing hidden or demo", async () => {
    const listed = [await f.college(), await f.college({ status: "needs_update" })];
    const unlisted = [await f.college({ status: "pending_review" }), await f.college({ isDemo: true })];
    const listedCase = await f.case();
    const unlistedCases = [await f.case({ status: "draft" }), await f.case({ isDemo: true })];

    // Demo records stay out even where the pages themselves would show them.
    const entries = await listSitemapEntries({ db, hideDemo: false, preview: true });
    const colleges = entries.colleges.map((c) => c.slug);
    const cases = entries.cases.map((c) => c.slug);
    for (const c of listed) expect(colleges).toContain(c.slug);
    for (const c of unlisted) expect(colleges).not.toContain(c.slug);
    expect(cases).toContain(listedCase.slug);
    for (const c of unlistedCases) expect(cases).not.toContain(c.slug);
    expect(entries.colleges[0].updatedAt).toBeInstanceOf(Date);
  });
});

describe("source index", () => {
  it("links a source to a university only through published pages", async () => {
    const pub = await f.college({ name: "Indexed Public University" });
    const hidden = await f.college({ name: "Indexed Draft University", status: "draft" });
    const [asr, cited, onDraftCollege, onHiddenRecord, uncited] = await Promise.all([1, 2, 3, 4, 5].map(() => f.source()));
    await f.report({ collegeId: pub.id, sourceId: asr.id });
    const response = await f.response({ collegeId: pub.id });
    await f.citation({ sourceId: cited.id, institutionalResponseId: response.id });
    await f.report({ collegeId: hidden.id, sourceId: onDraftCollege.id });
    const draftPolicy = await f.policy({ collegeId: pub.id, status: "draft" });
    await f.citation({ sourceId: onHiddenRecord.id, policyId: draftPolicy.id });

    const index = await listPublicSourceIndex(ctx);
    const collegesOf = (id: string) => index.sources.find((x) => x.id === id)?.colleges;
    expect(collegesOf(asr.id)).toEqual([pub.slug]);
    expect(collegesOf(cited.id)).toEqual([pub.slug]);
    // Published sources still appear, but without a link to an unpublished college or record.
    expect(collegesOf(onDraftCollege.id)).toEqual([]);
    expect(collegesOf(onHiddenRecord.id)).toEqual([]);
    expect(collegesOf(uncited.id)).toEqual([]);
    expect(index.colleges.map((c) => c.slug)).toContain(pub.slug);
    expect(index.colleges.map((c) => c.slug)).not.toContain(hidden.slug);
    expect(index.colleges.find((c) => c.slug === pub.slug)?.count).toBe(2);
  });

  it("links sources cited by a published case to each of its universities, but not a draft case's", async () => {
    const [one, two] = [await f.college({ name: "Case College One" }), await f.college({ name: "Case College Two" })];
    const [caseDoc, eventDoc, draftCaseDoc] = await Promise.all([1, 2, 3].map(() => f.source()));
    const published = await f.case({ collegeIds: [one.id, two.id] });
    await f.citation({ sourceId: caseDoc.id, caseId: published.id });
    const event = await f.event({ caseId: published.id });
    await f.citation({ sourceId: eventDoc.id, caseEventId: event.id });
    const draft = await f.case({ collegeIds: [one.id], status: "draft" });
    await f.citation({ sourceId: draftCaseDoc.id, caseId: draft.id });

    const index = await listPublicSourceIndex(ctx);
    const collegesOf = (id: string) => index.sources.find((x) => x.id === id)?.colleges;
    expect(collegesOf(caseDoc.id)).toEqual([one.slug, two.slug].sort());
    expect(collegesOf(eventDoc.id)).toEqual([one.slug, two.slug].sort());
    expect(collegesOf(draftCaseDoc.id)).toEqual([]);
  });
});
