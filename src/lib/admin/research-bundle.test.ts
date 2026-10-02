import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { cornellAsr } from "../../../research/cornell-university";
import * as s from "@/db/schema";
import type { Database } from "@/db/types";
import { getCollegeProfile } from "@/lib/public/queries";
import { createTestDb } from "@/test/db";
import { importResearchBundle, validateBundle, type ResearchBundle } from "./research-bundle";
import { changeStatus, verifyReportWithContents } from "./workflow";

let db: Database;
let close: () => Promise<void>;
const actor = "Claude (transcription)";

beforeAll(async () => {
  ({ db, close } = await createTestDb());
  await db.insert(s.colleges).values({ slug: "cornell-university", name: "Cornell University", city: "Ithaca", state: "NY" });
});
afterAll(() => close());

describe("Cornell transcription bundle", () => {
  it("passes structural validation (years, whole numbers, residential ≤ on campus)", () => {
    expect(validateBundle(cornellAsr)).toEqual([]);
  });

  it("rejects a residential figure larger than the on-campus figure", () => {
    const broken: ResearchBundle = structuredClone(cornellAsr);
    broken.reports[0].figures.on_campus_residential!.rape = [99, 21, 5];
    expect(validateBundle(broken)).toEqual([expect.stringContaining("residential (99) exceeds on campus (28)")]);
  });
});

describe("importResearchBundle", () => {
  it("creates sources, reports, figures, notes and citations, all pending review and none public", async () => {
    const { queued } = await importResearchBundle(db, cornellAsr, actor);
    expect(queued.filter((q) => q.key === "crime_statistic")).toHaveLength(2 * 7 * 4 * 3); // reports × offenses × locations × years
    expect(queued.filter((q) => q.key === "statistic_footnote")).toHaveLength(4);

    for (const table of [s.sources, s.cleryReports, s.crimeStatistics, s.statisticFootnotes, s.colleges]) {
      const rows = (await db.select({ status: table.status, createdBy: table.createdBy }).from(table)) as { status: string; createdBy: string | null }[];
      expect(rows.every((r) => r.status === "pending_review")).toBe(true);
    }
    const [college] = await db.select().from(s.colleges).where(eq(s.colleges.slug, "cornell-university"));
    expect(college).toMatchObject({ enrollment: 26000, name: "Cornell University", city: "Ithaca" });
    expect(await getCollegeProfile({ db, hideDemo: true }, "cornell-university")).toBeNull();

    const log = await db.select().from(s.verificationLog);
    expect(log.length).toBe(queued.length);
    expect(log.every((l) => l.actor === actor && l.toStatus === "pending_review")).toBe(true);
  });

  it("is safe to re-run: nothing is duplicated", async () => {
    const before = (await db.select().from(s.crimeStatistics)).length;
    const { log } = await importResearchBundle(db, cornellAsr, actor);
    expect(log).toContain("2026 report: already exists, skipped (edit it in the admin).");
    expect(await db.select().from(s.crimeStatistics)).toHaveLength(before);
    expect(await db.select().from(s.sources)).toHaveLength(2);
    expect(await db.select().from(s.citations)).toHaveLength(3);
  });

  it("once verified, shows the transcribed figures with no revisions between the overlapping reports", async () => {
    const reviewer = "Human Reviewer";
    for (const src of await db.select().from(s.sources)) await changeStatus(db, { key: "source", id: src.id, to: "verified", actor: reviewer });
    for (const r of await db.select().from(s.cleryReports)) await verifyReportWithContents(db, { reportId: r.id, actor: reviewer });
    const [college] = await db.select().from(s.colleges).where(eq(s.colleges.slug, "cornell-university"));
    expect(await changeStatus(db, { key: "college", id: college.id, to: "verified", actor: reviewer })).toEqual({ ok: true });

    const profile = (await getCollegeProfile({ db, hideDemo: true }, "cornell-university"))!;
    const cell = (year: number, offense: string, geography: string) =>
      profile.statistics.find((x) => x.calendarYear === year && x.offense === offense && x.geography === geography)!;

    expect([2022, 2023, 2024, 2025].map((y) => cell(y, "rape", "on_campus").count)).toEqual([25, 28, 23, 6]);
    expect(cell(2025, "stalking", "on_campus").count).toBe(31);
    expect(cell(2025, "rape", "noncampus").count).toBe(5);
    expect(cell(2023, "dating_violence", "on_campus").reportYear).toBe(2026);
    expect(profile.statistics.filter((x) => x.revisions.length)).toEqual([]);
    expect(profile.statistics.every((x) => x.unfoundedCount === null)).toBe(true);
    expect(profile.footnotes.map((f) => f.page).sort()).toEqual(["p. 5", "p. 5", "p. 6", "p. 6"]);
    expect(profile.college.enrollmentNote).toMatch(/^Approximately 26,000/);
  });
});
