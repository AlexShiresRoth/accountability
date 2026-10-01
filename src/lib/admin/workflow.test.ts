import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import * as s from "@/db/schema";
import type { Database } from "@/db/types";
import { getCollegeProfile } from "@/lib/public/queries";
import { createTestDb } from "@/test/db";
import { fixtures } from "@/test/fixtures";
import { canDelete, changeStatus, enforceStillValid, getStatus, markEdited, statusHistory, verifyReportWithContents } from "./workflow";

let db: Database;
let close: () => Promise<void>;
let f: ReturnType<typeof fixtures>;
const actor = "Test Researcher";

beforeAll(async () => {
  ({ db, close } = await createTestDb());
  f = fixtures(db);
});
afterAll(() => close());

describe("changeStatus", () => {
  it("logs every change with actor, note, and previous status, and records the reviewer", async () => {
    const src = await f.source({ status: "draft", retrievedAt: "2026-09-01" });
    expect(await changeStatus(db, { key: "source", id: src.id, to: "pending_review", actor })).toEqual({ ok: true });
    expect(await changeStatus(db, { key: "source", id: src.id, to: "verified", actor, note: "Checked PDF" })).toEqual({ ok: true });

    const [row] = await db.select().from(s.sources).where(eq(s.sources.id, src.id));
    expect(row.status).toBe("verified");
    expect(row.reviewedBy).toBe(actor);
    expect(row.reviewedAt).not.toBeNull();

    const history = await statusHistory(db, "source", src.id);
    expect(history.map((h) => [h.fromStatus, h.toStatus, h.actor, h.note])).toEqual([
      ["pending_review", "verified", actor, "Checked PDF"],
      ["draft", "pending_review", actor, null],
    ]);
  });

  it("rejects no-op changes and unknown records", async () => {
    const src = await f.source({ status: "draft" });
    expect(await changeStatus(db, { key: "source", id: src.id, to: "draft", actor })).toMatchObject({ ok: false });
    expect(await changeStatus(db, { key: "source", id: crypto.randomUUID(), to: "verified", actor })).toEqual({
      ok: false,
      problems: ["Record not found."],
    });
  });

  it("only allows needs_update from verified", async () => {
    const src = await f.source({ status: "pending_review" });
    expect(await changeStatus(db, { key: "source", id: src.id, to: "needs_update", actor })).toMatchObject({ ok: false });
  });
});

describe("verification rules", () => {
  it("requires a retrieval date on sources", async () => {
    const src = await f.source({ status: "draft", retrievedAt: null });
    expect(await changeStatus(db, { key: "source", id: src.id, to: "verified", actor })).toEqual({
      ok: false,
      problems: ["Record the date the source was retrieved."],
    });
  });

  it("requires a citation to a verified source before a college can be verified", async () => {
    const college = await f.college({ status: "draft" });
    const unverified = await f.source({ status: "pending_review" });
    await f.citation({ sourceId: unverified.id, collegeId: college.id });
    expect(await changeStatus(db, { key: "college", id: college.id, to: "verified", actor })).toMatchObject({ ok: false });

    const verified = await f.source();
    await f.citation({ sourceId: verified.id, collegeId: college.id });
    expect(await changeStatus(db, { key: "college", id: college.id, to: "verified", actor })).toEqual({ ok: true });
  });

  it("requires a verified source document for a Clery report, and a verified report for its contents", async () => {
    const college = await f.college();
    const src = await f.source({ status: "draft" });
    const report = await f.report({ collegeId: college.id, sourceId: src.id, status: "draft" });
    const stat = await f.statistic({ cleryReportId: report.id, status: "draft" });

    expect(await changeStatus(db, { key: "crime_statistic", id: stat.id, to: "verified", actor })).toEqual({
      ok: false,
      problems: ["Verify the Clery report first."],
    });
    expect(await changeStatus(db, { key: "clery_report", id: report.id, to: "verified", actor })).toEqual({
      ok: false,
      problems: ["Verify the report's source document first."],
    });
  });
});

describe("verifyReportWithContents", () => {
  it("verifies the report and its unverified statistics and footnotes, leaving rejected ones alone", async () => {
    const college = await f.college();
    const src = await f.source();
    const report = await f.report({ collegeId: college.id, sourceId: src.id, status: "pending_review" });
    const a = await f.statistic({ cleryReportId: report.id, offense: "rape", status: "draft" });
    const b = await f.statistic({ cleryReportId: report.id, offense: "fondling", status: "pending_review" });
    const rejected = await f.statistic({ cleryReportId: report.id, offense: "stalking", status: "rejected" });
    const note = await f.footnote({ cleryReportId: report.id, status: "draft" });

    expect(await verifyReportWithContents(db, { reportId: report.id, actor })).toEqual({ ok: true, verified: 3 });
    expect(await getStatus(db, "clery_report", report.id)).toBe("verified");
    expect(await getStatus(db, "crime_statistic", a.id)).toBe("verified");
    expect(await getStatus(db, "crime_statistic", b.id)).toBe("verified");
    expect(await getStatus(db, "statistic_footnote", note.id)).toBe("verified");
    expect(await getStatus(db, "crime_statistic", rejected.id)).toBe("rejected");
    expect((await statusHistory(db, "crime_statistic", a.id))[0].actor).toBe(actor);
  });

  it("verifies nothing when the report itself cannot be verified", async () => {
    const college = await f.college();
    const src = await f.source({ status: "draft" });
    const report = await f.report({ collegeId: college.id, sourceId: src.id, status: "draft" });
    const stat = await f.statistic({ cleryReportId: report.id, status: "draft" });
    expect(await verifyReportWithContents(db, { reportId: report.id, actor })).toMatchObject({ ok: false });
    expect(await getStatus(db, "crime_statistic", stat.id)).toBe("draft");
  });
});

describe("editing published records", () => {
  it("returns an edited verified record to pending_review, removing it from public pages", async () => {
    const college = await f.college();
    const src = await f.source();
    const report = await f.report({ collegeId: college.id, sourceId: src.id });
    const stat = await f.statistic({ cleryReportId: report.id, count: 4 });
    expect((await getCollegeProfile({ db, hideDemo: true }, college.slug))!.statistics).toHaveLength(1);

    expect(await markEdited(db, "crime_statistic", stat.id, actor)).toBe(true);
    expect(await getStatus(db, "crime_statistic", stat.id)).toBe("pending_review");
    expect((await getCollegeProfile({ db, hideDemo: true }, college.slug))!.statistics).toHaveLength(0);
    expect((await statusHistory(db, "crime_statistic", stat.id))[0].note).toMatch(/re-verification required/);
  });

  it("also unpublishes needs_update records, and leaves drafts alone", async () => {
    const a = await f.source({ status: "needs_update" });
    const b = await f.source({ status: "draft" });
    expect(await markEdited(db, "source", a.id, actor)).toBe(true);
    expect(await markEdited(db, "source", b.id, actor)).toBe(false);
    expect(await getStatus(db, "source", b.id)).toBe("draft");
  });
});

describe("removing evidence", () => {
  it("unpublishes a verified record whose last verified citation was removed", async () => {
    const college = await f.college();
    const src = await f.source();
    const cite = await f.citation({ sourceId: src.id, collegeId: college.id });
    expect(await enforceStillValid(db, "college", college.id, actor)).toBe(false);

    await db.delete(s.citations).where(eq(s.citations.id, cite.id));
    expect(await enforceStillValid(db, "college", college.id, actor)).toBe(true);
    expect(await getStatus(db, "college", college.id)).toBe("pending_review");
  });
});

describe("deletion", () => {
  it("is only allowed for draft or rejected records", async () => {
    for (const [status, allowed] of [
      ["draft", true],
      ["rejected", true],
      ["pending_review", false],
      ["verified", false],
      ["needs_update", false],
    ] as const) {
      const src = await f.source({ status });
      expect(await canDelete(db, "source", src.id), status).toBe(allowed);
    }
  });
});
