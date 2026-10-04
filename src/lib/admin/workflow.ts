import "server-only";
// Verification workflow: the only code that changes a record's status.
// Every change is logged. `verified` requires evidence. Editing a published record unpublishes it.

import { and, eq, inArray, sql } from "drizzle-orm";
import type { AnyPgColumn, PgTable } from "drizzle-orm/pg-core";
import * as s from "@/db/schema";
import type { Database } from "@/db/types";
import { PUBLIC_STATUSES, type VerificationStatus } from "@/lib/enums";

type Reviewed = PgTable & { id: AnyPgColumn; status: AnyPgColumn };

/** Tables managed by the admin. */
export const reviewTables = {
  source: { table: s.sources, label: "Source", citation: null },
  college: { table: s.colleges, label: "College", citation: s.citations.collegeId },
  clery_report: { table: s.cleryReports, label: "Clery report", citation: s.citations.cleryReportId },
  crime_statistic: { table: s.crimeStatistics, label: "Statistic", citation: s.citations.crimeStatisticId },
  statistic_footnote: { table: s.statisticFootnotes, label: "Footnote", citation: s.citations.statisticFootnoteId },
  institution_action: { table: s.institutionActions, label: "Timeline entry", citation: s.citations.institutionActionId },
  institutional_response: { table: s.institutionalResponses, label: "Institutional response", citation: s.citations.institutionalResponseId },
  policy: { table: s.policies, label: "Policy", citation: s.citations.policyId },
  student_resource: { table: s.studentResources, label: "Student resource", citation: s.citations.studentResourceId },
  college_coverage: { table: s.collegeCoverage, label: "Coverage", citation: null },
  correction: { table: s.corrections, label: "Correction", citation: s.citations.correctionId },
  case: { table: s.cases, label: "Case", citation: s.citations.caseId },
  case_event: { table: s.caseEvents, label: "Case event", citation: s.citations.caseEventId },
} satisfies Record<string, { table: Reviewed; label: string; citation: AnyPgColumn | null }>;

export type ReviewTableKey = keyof typeof reviewTables;
export const isReviewTableKey = (k: string): k is ReviewTableKey => k in reviewTables;

const isPublicStatus = (st: VerificationStatus) => (PUBLIC_STATUSES as readonly string[]).includes(st);

export type WorkflowResult = { ok: true } | { ok: false; problems: string[] };

// ---------------------------------------------------------------------------

export async function getStatus(db: Database, key: ReviewTableKey, id: string): Promise<VerificationStatus | null> {
  const t = reviewTables[key].table as Reviewed;
  const [row] = (await db.select({ status: t.status }).from(t).where(eq(t.id, id))) as { status: VerificationStatus }[];
  return row?.status ?? null;
}

/** What stands between this record and `verified`. Empty means it may be verified. */
export async function verificationProblems(db: Database, key: ReviewTableKey, id: string): Promise<string[]> {
  switch (key) {
    case "source": {
      const [src] = await db.select({ retrievedAt: s.sources.retrievedAt }).from(s.sources).where(eq(s.sources.id, id));
      return src?.retrievedAt ? [] : ["Record the date the source was retrieved."];
    }
    case "clery_report": {
      const [row] = await db
        .select({ sourceStatus: s.sources.status })
        .from(s.cleryReports)
        .innerJoin(s.sources, eq(s.cleryReports.sourceId, s.sources.id))
        .where(eq(s.cleryReports.id, id));
      return row?.sourceStatus === "verified" ? [] : ["Verify the report's source document first."];
    }
    case "crime_statistic":
    case "statistic_footnote": {
      const table = key === "crime_statistic" ? s.crimeStatistics : s.statisticFootnotes;
      const [row] = await db
        .select({ reportStatus: s.cleryReports.status })
        .from(table)
        .innerJoin(s.cleryReports, eq(table.cleryReportId, s.cleryReports.id))
        .where(eq(table.id, id));
      return row?.reportStatus === "verified" ? [] : ["Verify the Clery report first."];
    }
    case "case": {
      // A case is the highest-risk content on the site: require the editorial justification, at least one
      // institution, and at least one verified (cited) event before it can be published.
      const problems: string[] = [];
      const [row] = await db.select({ justification: s.cases.publicationJustification }).from(s.cases).where(eq(s.cases.id, id));
      if (!row?.justification?.trim()) problems.push("Record the editorial justification for publishing this case.");
      const [{ colleges }] = await db
        .select({ colleges: sql<number>`count(*)::int` })
        .from(s.caseColleges)
        .where(eq(s.caseColleges.caseId, id));
      if (!colleges) problems.push("Link the case to at least one institution.");
      const [{ events }] = await db
        .select({ events: sql<number>`count(*)::int` })
        .from(s.caseEvents)
        .where(and(eq(s.caseEvents.caseId, id), eq(s.caseEvents.status, "verified")));
      if (!events) problems.push("Verify at least one event (each event needs a citation to a verified source).");
      return problems;
    }
    case "college_coverage": {
      // Coverage is evidenced by the article itself. Case-scoped coverage also stays hidden publicly until
      // its case is verified (enforced by the public query layer).
      const [row] = await db
        .select({ sourceStatus: s.sources.status })
        .from(s.collegeCoverage)
        .innerJoin(s.sources, eq(s.collegeCoverage.sourceId, s.sources.id))
        .where(eq(s.collegeCoverage.id, id));
      return row?.sourceStatus === "verified" ? [] : ["Verify the article's source record first."];
    }
    default: {
      const column = reviewTables[key].citation;
      if (!column) return [];
      const [{ n }] = await db
        .select({ n: sql<number>`count(*)::int` })
        .from(s.citations)
        .innerJoin(s.sources, eq(s.citations.sourceId, s.sources.id))
        .where(and(eq(column, id), eq(s.sources.status, "verified")));
      return n > 0 ? [] : ["Add at least one citation to a verified source."];
    }
  }
}

/** Sets one status on many records of a table and logs each change: two queries regardless of count. */
async function writeStatuses(
  db: Database,
  key: ReviewTableKey,
  rows: { id: string; from: VerificationStatus }[],
  to: VerificationStatus,
  actor: string,
  note: string | null,
) {
  if (!rows.length) return;
  const t = reviewTables[key].table as Reviewed;
  const reviewed = to === "verified" || to === "rejected" || to === "needs_update";
  await db.execute(
    sql`update ${t} set status = ${to}, reviewed_by = ${reviewed ? actor : null}, reviewed_at = ${
      reviewed ? new Date().toISOString() : null
    }, updated_at = now() where id in (${sql.join(
      rows.map((r) => sql`${r.id}`),
      sql`, `,
    )})`,
  );
  await db
    .insert(s.verificationLog)
    .values(rows.map((r) => ({ tableName: key, recordId: r.id, fromStatus: r.from, toStatus: to, actor, note })));
}

function writeStatus(
  db: Database,
  key: ReviewTableKey,
  id: string,
  from: VerificationStatus,
  to: VerificationStatus,
  actor: string,
  note: string | null,
) {
  return writeStatuses(db, key, [{ id, from }], to, actor, note);
}

export async function changeStatus(
  db: Database,
  { key, id, to, actor, note = null }: { key: ReviewTableKey; id: string; to: VerificationStatus; actor: string; note?: string | null },
): Promise<WorkflowResult> {
  const from = await getStatus(db, key, id);
  if (!from) return { ok: false, problems: ["Record not found."] };
  if (from === to) return { ok: false, problems: [`Already ${to.replace("_", " ")}.`] };
  if (to === "needs_update" && from !== "verified") {
    return { ok: false, problems: ["Only verified records can be marked as needing an update."] };
  }
  if (to === "verified") {
    const problems = await verificationProblems(db, key, id);
    if (problems.length) return { ok: false, problems };
  }
  await writeStatus(db, key, id, from, to, actor, note);
  return { ok: true };
}

/**
 * Call after changing a record's content. A published record whose content changed is no longer verified,
 * so it returns to pending_review (hidden) until re-verified. Returns true if it was unpublished.
 */
export async function markEdited(db: Database, key: ReviewTableKey, id: string, actor: string): Promise<boolean> {
  const status = await getStatus(db, key, id);
  if (!status || !isPublicStatus(status)) return false;
  await writeStatus(db, key, id, status, "pending_review", actor, "Edited after publication; re-verification required.");
  return true;
}

/** Batch form of markEdited for many records of one table. Returns how many were unpublished. */
export async function markEditedMany(db: Database, key: ReviewTableKey, ids: string[], actor: string): Promise<number> {
  if (!ids.length) return 0;
  const t = reviewTables[key].table as Reviewed;
  const rows = (await db
    .select({ id: t.id, status: t.status })
    .from(t)
    .where(and(inArray(t.id, ids), inArray(t.status, [...PUBLIC_STATUSES])))) as { id: string; status: VerificationStatus }[];
  await writeStatuses(
    db,
    key,
    rows.map((r) => ({ id: r.id, from: r.status })),
    "pending_review",
    actor,
    "Edited after publication; re-verification required.",
  );
  return rows.length;
}

/** Call after removing evidence (e.g. a citation). Unpublishes the record if it no longer meets the rules. */
export async function enforceStillValid(db: Database, key: ReviewTableKey, id: string, actor: string): Promise<boolean> {
  const status = await getStatus(db, key, id);
  if (!status || !isPublicStatus(status)) return false;
  const problems = await verificationProblems(db, key, id);
  if (!problems.length) return false;
  await writeStatus(db, key, id, status, "pending_review", actor, `Evidence removed: ${problems.join(" ")}`);
  return true;
}

/** Verify a Clery report and, in one step, its unverified statistics and footnotes. Rejected items stay rejected. */
export async function verifyReportWithContents(
  db: Database,
  { reportId, actor, note = null }: { reportId: string; actor: string; note?: string | null },
): Promise<WorkflowResult & { verified?: number }> {
  return db.transaction(async (tx) => {
    const t = tx as unknown as Database;
    const status = await getStatus(t, "clery_report", reportId);
    if (!status) return { ok: false as const, problems: ["Report not found."] };
    if (status !== "verified") {
      const result = await changeStatus(t, { key: "clery_report", id: reportId, to: "verified", actor, note });
      if (!result.ok) return result;
    }
    const pending: VerificationStatus[] = ["draft", "pending_review"];
    const stats = await t
      .select({ id: s.crimeStatistics.id, from: s.crimeStatistics.status })
      .from(s.crimeStatistics)
      .where(and(eq(s.crimeStatistics.cleryReportId, reportId), inArray(s.crimeStatistics.status, pending)));
    const notes = await t
      .select({ id: s.statisticFootnotes.id, from: s.statisticFootnotes.status })
      .from(s.statisticFootnotes)
      .where(and(eq(s.statisticFootnotes.cleryReportId, reportId), inArray(s.statisticFootnotes.status, pending)));

    await writeStatuses(t, "crime_statistic", stats, "verified", actor, note ?? "Verified with report.");
    await writeStatuses(t, "statistic_footnote", notes, "verified", actor, note ?? "Verified with report.");
    return { ok: true as const, verified: stats.length + notes.length };
  });
}

export async function statusHistory(db: Database, key: ReviewTableKey, id: string) {
  return db
    .select()
    .from(s.verificationLog)
    .where(and(eq(s.verificationLog.tableName, key), eq(s.verificationLog.recordId, id)))
    .orderBy(sql`${s.verificationLog.createdAt} desc`);
}

/** Only unpublished records may be deleted; published ones must be rejected first so nothing vanishes silently. */
export async function canDelete(db: Database, key: ReviewTableKey, id: string): Promise<boolean> {
  const status = await getStatus(db, key, id);
  return status === "draft" || status === "rejected";
}
