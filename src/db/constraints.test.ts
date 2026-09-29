import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import * as s from "@/db/schema";
import type { Database } from "@/db/types";
import { createTestDb } from "@/test/db";
import { fixtures } from "@/test/fixtures";

let db: Database;
let close: () => Promise<void>;
let f: ReturnType<typeof fixtures>;

beforeAll(async () => {
  ({ db, close } = await createTestDb());
  f = fixtures(db);
});
afterAll(() => close());

async function setup() {
  const college = await f.college();
  const source = await f.source();
  const report = await f.report({ collegeId: college.id, sourceId: source.id });
  return { college, source, report };
}

describe("database integrity constraints", () => {
  it("defaults new records to draft", async () => {
    const [row] = await db.insert(s.colleges).values({ slug: "defaults-draft", name: "X" }).returning();
    expect(row.status).toBe("draft");
    expect(row.isDemo).toBe(false);
  });

  describe("citations target exactly one record", () => {
    it("rejects a citation with no target", async () => {
      const { source } = await setup();
      await expect(f.citation({ sourceId: source.id })).rejects.toThrow();
    });

    it("rejects a citation with two targets", async () => {
      const { college, source, report } = await setup();
      await expect(f.citation({ sourceId: source.id, collegeId: college.id, cleryReportId: report.id })).rejects.toThrow();
    });

    it("accepts a citation with exactly one target", async () => {
      const { college, source } = await setup();
      await expect(f.citation({ sourceId: source.id, collegeId: college.id, pinpoint: "p. 4" })).resolves.toBeDefined();
    });

    it("prevents deleting a source that is still cited", async () => {
      const { college, source } = await setup();
      await f.citation({ sourceId: source.id, collegeId: college.id });
      await expect(db.delete(s.sources).where(eq(s.sources.id, source.id))).rejects.toThrow();
    });
  });

  describe("statistics", () => {
    it("rejects a duplicate report/year/offense/geography cell", async () => {
      const { report } = await setup();
      await f.statistic({ cleryReportId: report.id });
      await expect(f.statistic({ cleryReportId: report.id })).rejects.toThrow();
    });

    it("allows the same year in two different reports (overlapping three-year windows)", async () => {
      const { college, source, report } = await setup();
      const older = await f.report({ collegeId: college.id, sourceId: source.id, reportYear: 2024 });
      await f.statistic({ cleryReportId: report.id, calendarYear: 2023 });
      await expect(f.statistic({ cleryReportId: older.id, calendarYear: 2023 })).resolves.toBeDefined();
    });

    it("stores null distinctly from 0", async () => {
      const { report } = await setup();
      const a = await f.statistic({ cleryReportId: report.id, offense: "stalking", count: null });
      const b = await f.statistic({ cleryReportId: report.id, offense: "fondling", count: 0 });
      expect(a.count).toBeNull();
      expect(b.count).toBe(0);
    });

    it("rejects negative counts and out-of-range years", async () => {
      const { report } = await setup();
      await expect(f.statistic({ cleryReportId: report.id, count: -1 })).rejects.toThrow();
      await expect(f.statistic({ cleryReportId: report.id, unfoundedCount: -1 })).rejects.toThrow();
      await expect(f.statistic({ cleryReportId: report.id, calendarYear: 1024 })).rejects.toThrow();
    });

    it("rejects linking a footnote to a statistic from a different report", async () => {
      const { college, source, report } = await setup();
      const other = await f.report({ collegeId: college.id, sourceId: source.id, reportYear: 2023 });
      const footnote = await f.footnote({ cleryReportId: report.id });
      const foreignStat = await f.statistic({ cleryReportId: other.id });
      await expect(
        db.insert(s.statisticFootnoteLinks).values({
          footnoteId: footnote.id,
          crimeStatisticId: foreignStat.id,
          cleryReportId: report.id,
        }),
      ).rejects.toThrow();
    });
  });

  describe("coverage scope", () => {
    it("requires a linked case for case-scoped coverage", async () => {
      const { college, source } = await setup();
      await expect(f.coverage({ collegeId: college.id, sourceId: source.id, scope: "case" })).rejects.toThrow();
    });

    it("forbids a case link on institutional coverage", async () => {
      const { college, source } = await setup();
      const c = await f.case({ collegeIds: [college.id] });
      await expect(
        f.coverage({ collegeId: college.id, sourceId: source.id, scope: "institutional", caseId: c.id }),
      ).rejects.toThrow();
    });
  });

  it("requires corrections to target exactly one college or case", async () => {
    const { college } = await setup();
    const c = await f.case();
    await expect(f.correction({})).rejects.toThrow();
    await expect(f.correction({ collegeId: college.id, caseId: c.id })).rejects.toThrow();
    await expect(f.correction({ caseId: c.id })).resolves.toBeDefined();
  });

  it("requires a source to be locatable", async () => {
    await expect(f.source({ url: null, archivedUrl: null, documentPath: null })).rejects.toThrow();
  });
});
