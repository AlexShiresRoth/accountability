import "server-only";
// Case monitoring: researcher-only fields for following a case. They never appear publicly, and changing them
// does not unpublish the case (unlike editing its details).

import { and, asc, eq, isNull, lte, ne, or, sql } from "drizzle-orm";
import * as s from "@/db/schema";
import type { Database } from "@/db/types";
import type { MutationResult } from "./records";
import type { CaseMonitoringInput } from "./validation";

/** Days after the last check before a case without a next-check date is due again. */
export const CHECK_INTERVAL_DAYS = 30;

/** When a case is next due for a check, and whether it is due now (`today` as YYYY-MM-DD). */
export function nextDue(
  m: { lastCheckedAt: Date | null; nextCheckOn: string | null },
  today: string,
): { date: string | null; due: boolean } {
  if (m.nextCheckOn) return { date: m.nextCheckOn, due: m.nextCheckOn <= today };
  if (!m.lastCheckedAt) return { date: null, due: true };
  const date = new Date(m.lastCheckedAt.getTime() + CHECK_INTERVAL_DAYS * 86_400_000).toISOString().slice(0, 10);
  return { date, due: date <= today };
}

export async function updateCaseMonitoring(db: Database, caseId: string, input: CaseMonitoringInput): Promise<MutationResult> {
  const [before] = await db
    .select({ searchTerms: s.cases.searchTerms, nextCheckOn: s.cases.nextCheckOn, checkNotes: s.cases.checkNotes })
    .from(s.cases)
    .where(eq(s.cases.id, caseId));
  if (!before) return { ok: false, problems: ["Case not found."] };
  const same =
    before.searchTerms.join("\n") === input.searchTerms.join("\n") &&
    before.nextCheckOn === input.nextCheckOn &&
    before.checkNotes === input.checkNotes;
  if (same) return { ok: true, value: undefined, unchanged: true };
  // updated_at is left alone: it dates editorial changes (it feeds the public sitemap).
  await db
    .update(s.cases)
    .set({ searchTerms: input.searchTerms, nextCheckOn: input.nextCheckOn, checkNotes: input.checkNotes, updatedAt: sql`${s.cases.updatedAt}` })
    .where(eq(s.cases.id, caseId));
  return { ok: true, value: undefined };
}

/** Records a check today. A next-check date that has now passed is cleared, so the 30-day rhythm resumes. */
export async function markCaseChecked(db: Database, caseId: string, now = new Date()): Promise<MutationResult> {
  const today = now.toISOString().slice(0, 10);
  const updated = await db
    .update(s.cases)
    .set({
      lastCheckedAt: now,
      nextCheckOn: sql`case when ${s.cases.nextCheckOn} <= ${today}::date then null else ${s.cases.nextCheckOn} end`,
      updatedAt: sql`${s.cases.updatedAt}`,
    })
    .where(eq(s.cases.id, caseId))
    .returning({ id: s.cases.id });
  return updated.length ? { ok: true, value: undefined } : { ok: false, problems: ["Case not found."] };
}

export type DueCase = {
  id: string;
  title: string;
  lastCheckedAt: Date | null;
  nextCheckOn: string | null;
  checkNotes: string | null;
  reason: "scheduled" | "never_checked" | "stale";
};

/**
 * Cases to look at: a next-check date has arrived, or (with no date set) never checked or not checked in
 * CHECK_INTERVAL_DAYS days. Rejected and demo cases are skipped.
 */
export async function casesDueForCheck(db: Database, now = new Date()): Promise<DueCase[]> {
  const today = now.toISOString().slice(0, 10);
  const staleBefore = new Date(now.getTime() - CHECK_INTERVAL_DAYS * 86_400_000);
  const rows = await db
    .select({
      id: s.cases.id,
      title: s.cases.title,
      lastCheckedAt: s.cases.lastCheckedAt,
      nextCheckOn: s.cases.nextCheckOn,
      checkNotes: s.cases.checkNotes,
    })
    .from(s.cases)
    .where(
      and(
        ne(s.cases.status, "rejected"),
        eq(s.cases.isDemo, false),
        or(
          lte(s.cases.nextCheckOn, today),
          and(isNull(s.cases.nextCheckOn), or(isNull(s.cases.lastCheckedAt), lte(s.cases.lastCheckedAt, staleBefore))),
        ),
      ),
    )
    .orderBy(asc(s.cases.nextCheckOn), asc(s.cases.lastCheckedAt));
  return rows.map((r) => ({
    ...r,
    reason: r.nextCheckOn && r.nextCheckOn <= today ? "scheduled" : r.lastCheckedAt ? "stale" : "never_checked",
  }));
}

/** New inbox items marked as a possible update to this case. */
export async function caseInboxCount(db: Database, caseId: string): Promise<number> {
  const [row] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(s.candidateItems)
    .where(and(eq(s.candidateItems.caseId, caseId), eq(s.candidateItems.status, "new")));
  return row?.n ?? 0;
}
