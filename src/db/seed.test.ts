import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import * as s from "@/db/schema";
import type { Database } from "@/db/types";
import { getCase, getCollegeProfile, searchColleges } from "@/lib/public/queries";
import { createTestDb } from "@/test/db";
import { seedDevelopment } from "./seed";

let db: Database;
let close: () => Promise<void>;

beforeAll(async () => {
  ({ db, close } = await createTestDb());
  await seedDevelopment(db);
  await seedDevelopment(db); // re-running must be safe
});
afterAll(() => close());

describe("development seed", () => {
  it("creates real institutions as unverified drafts that are not public", async () => {
    const real = await db.select().from(s.colleges).where(eq(s.colleges.isDemo, false));
    expect(real.map((c) => c.slug).sort()).toEqual(["columbia-university", "cornell-university", "harvard-university"]);
    expect(real.every((c) => c.status === "draft")).toBe(true);
    expect(real.every((c) => c.enrollment === null)).toBe(true);
    expect(await searchColleges({ db, hideDemo: false })).toHaveLength(1); // only Demo University
  });

  it("is idempotent", async () => {
    expect(await db.select().from(s.colleges).where(eq(s.colleges.slug, "demo-university"))).toHaveLength(1);
    expect(await db.select().from(s.cases).where(eq(s.cases.slug, "demo-case"))).toHaveLength(1);
  });

  it("marks every demo record as demo and hides all of it when demo data is hidden", async () => {
    expect(await getCollegeProfile({ db, hideDemo: true }, "demo-university")).toBeNull();
    expect(await getCase({ db, hideDemo: true }, "demo-case")).toBeNull();
    const sources = await db.select().from(s.sources);
    expect(sources.every((x) => x.isDemo && x.title.startsWith("[DEMO]") && x.url!.startsWith("https://example.org/"))).toBe(true);
  });

  it("exercises the profile features in development", async () => {
    const p = (await getCollegeProfile({ db, hideDemo: false }, "demo-university"))!;
    const cell = (year: number, offense: string, geography = "on_campus") =>
      p.statistics.find((x) => x.calendarYear === year && x.offense === offense && x.geography === geography)!;

    expect(cell(2023, "rape").footnoteIds).toHaveLength(2); // delayed-report note from both reports
    expect(cell(2023, "dating_violence").count).toBe(3);
    expect(cell(2023, "dating_violence").revisions).toEqual([{ reportYear: 2024, count: 2 }]);
    expect(cell(2023, "stalking", "noncampus").count).toBeNull();
    expect(p.responses.some((r) => r.findingKind === "not_located")).toBe(true);
    expect(p.coverage.map((c) => c.scope).sort()).toEqual(["case", "institutional"]);
    expect(p.cases).toHaveLength(1);
  });

  it("builds a cited, ordered demo case timeline with a correction", async () => {
    const c = (await getCase({ db, hideDemo: false }, "demo-case"))!;
    expect(c.events.map((e) => e.eventType)).toEqual(["university_report", "civil_complaint", "institutional_reform", "settlement"]);
    expect(c.corrections).toHaveLength(1);
    expect(Object.keys(c.citations)).toHaveLength(2);
  });
});
