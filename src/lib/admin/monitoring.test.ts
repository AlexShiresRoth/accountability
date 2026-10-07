import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import * as s from "@/db/schema";
import type { Database } from "@/db/types";
import { createTestDb } from "@/test/db";
import { fixtures } from "@/test/fixtures";
import { casesDueForCheck, caseInboxCount, markCaseChecked, nextDue, updateCaseMonitoring } from "./monitoring";
import { caseMonitoringSchema } from "./validation";
import { getStatus } from "./workflow";

let db: Database;
let close: () => Promise<void>;
let f: ReturnType<typeof fixtures>;
beforeAll(async () => {
  ({ db, close } = await createTestDb());
  f = fixtures(db);
});
afterAll(() => close());

const now = new Date("2026-10-06T12:00:00Z");
const daysAgo = (n: number) => new Date(now.getTime() - n * 86_400_000);

describe("case monitoring input", () => {
  it("splits search terms by line or comma, strips quotes and duplicates", () => {
    expect(caseMonitoringSchema.parse({ searchTerms: 'Chi Phi\n"Chi Phi", fraternity lawsuit\n\n' }).searchTerms).toEqual(["Chi Phi", "fraternity lawsuit"]);
    expect(caseMonitoringSchema.parse({}).searchTerms).toEqual([]);
  });

  it("rejects terms too short to search for, and too many terms", () => {
    expect(caseMonitoringSchema.safeParse({ searchTerms: "ab" }).success).toBe(false);
    expect(caseMonitoringSchema.safeParse({ searchTerms: Array.from({ length: 9 }, (_, i) => `term ${i}`).join("\n") }).success).toBe(false);
  });
});

describe("case monitoring", () => {
  it("saves search terms and notes without unpublishing a verified case or changing its edit date", async () => {
    const c = await f.case();
    const [before] = await db.select().from(s.cases).where(eq(s.cases.id, c.id));
    const input = caseMonitoringSchema.parse({ searchTerms: "Chi Phi", nextCheckOn: "2026-11-12", checkNotes: "NYSCEF Index No. 161704/2026" });
    expect(await updateCaseMonitoring(db, c.id, input)).toEqual({ ok: true, value: undefined });
    expect(await updateCaseMonitoring(db, c.id, input)).toMatchObject({ ok: true, unchanged: true });
    const [after] = await db.select().from(s.cases).where(eq(s.cases.id, c.id));
    expect(after).toMatchObject({ searchTerms: ["Chi Phi"], nextCheckOn: "2026-11-12", checkNotes: "NYSCEF Index No. 161704/2026" });
    expect(after.updatedAt).toEqual(before.updatedAt);
    expect(await getStatus(db, "case", c.id)).toBe("verified");
  });

  it("marking checked records the time and clears a next-check date that has arrived, but keeps a future one", async () => {
    const past = await f.case({ nextCheckOn: "2026-10-01" });
    const future = await f.case({ nextCheckOn: "2026-12-01" });
    await markCaseChecked(db, past.id, now);
    await markCaseChecked(db, future.id, now);
    const [p] = await db.select().from(s.cases).where(eq(s.cases.id, past.id));
    const [fu] = await db.select().from(s.cases).where(eq(s.cases.id, future.id));
    expect(p).toMatchObject({ lastCheckedAt: now, nextCheckOn: null });
    expect(fu).toMatchObject({ lastCheckedAt: now, nextCheckOn: "2026-12-01" });
    expect(await getStatus(db, "case", past.id)).toBe("verified");
  });

  it("lists cases due: scheduled date arrived, never checked, or not checked in 30 days", async () => {
    const scheduled = await f.case({ nextCheckOn: "2026-10-06", lastCheckedAt: daysAgo(2) });
    const never = await f.case({ title: "Never checked case" });
    const stale = await f.case({ lastCheckedAt: daysAgo(31) });
    const recent = await f.case({ lastCheckedAt: daysAgo(3) });
    const scheduledLater = await f.case({ nextCheckOn: "2026-10-20", lastCheckedAt: daysAgo(90) });
    const rejected = await f.case({ status: "rejected" });
    const demo = await f.case({ isDemo: true });

    const due = await casesDueForCheck(db, now);
    const reason = (id: string) => due.find((d) => d.id === id)?.reason;
    expect(reason(scheduled.id)).toBe("scheduled");
    expect(reason(never.id)).toBe("never_checked");
    expect(reason(stale.id)).toBe("stale");
    for (const c of [recent, scheduledLater, rejected, demo]) expect(reason(c.id)).toBeUndefined();
  });

  it("works out the next due date shown on the case page", () => {
    expect(nextDue({ lastCheckedAt: null, nextCheckOn: null }, "2026-10-06")).toEqual({ date: null, due: true });
    expect(nextDue({ lastCheckedAt: daysAgo(10), nextCheckOn: null }, "2026-10-06")).toEqual({ date: "2026-10-26", due: false });
    expect(nextDue({ lastCheckedAt: daysAgo(10), nextCheckOn: "2026-10-06" }, "2026-10-06")).toEqual({ date: "2026-10-06", due: true });
  });

  it("counts new inbox items marked as updates to a case", async () => {
    const c = await f.case();
    await db.insert(s.candidateItems).values([
      { url: "https://news.example/u1", title: "Update one", caseId: c.id },
      { url: "https://news.example/u2", title: "Update two", caseId: c.id, status: "dismissed" },
      { url: "https://news.example/u3", title: "Unrelated" },
    ]);
    expect(await caseInboxCount(db, c.id)).toBe(1);
  });
});
