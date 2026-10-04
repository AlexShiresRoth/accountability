import "server-only";
// Admin mutations. Server actions stay thin: check the session, validate input, call these.
// Rule: any content change to a published record calls markEdited(), which unpublishes it until re-verified.

import { and, eq, inArray, sql } from "drizzle-orm";
import * as s from "@/db/schema";
import type { Database } from "@/db/types";
import { cleryGeographies, offenses, PUBLIC_STATUSES, type CleryGeography, type Offense } from "@/lib/enums";
import type {
  ActionInput,
  CaseInput,
  EventInput,
  CitationInput,
  CollegeInput,
  CorrectionInput,
  CoverageInput,
  FootnoteInput,
  PolicyInput,
  ReportInput,
  ResourceInput,
  ResponseInput,
  SourceInput,
} from "./validation";
import { enforceStillValid, markEdited, markEditedMany, reviewTables, type ReviewTableKey } from "./workflow";

export type MutationResult<T = undefined> =
  | { ok: true; value: T; unpublished?: boolean; unchanged?: boolean }
  | { ok: false; problems: string[] };

const ok = <T>(value: T, unpublished = false): MutationResult<T> => ({ ok: true, value, unpublished });
const unchanged = (): MutationResult => ({ ok: true, value: undefined, unchanged: true });
const fail = (...problems: string[]): MutationResult<never> => ({ ok: false, problems });

function changed<T extends Record<string, unknown>>(before: T, after: Partial<T>): boolean {
  return Object.entries(after).some(([k, v]) => normalize(before[k]) !== normalize(v));
}
const normalize = (v: unknown) => (v instanceof Date ? v.toISOString() : Array.isArray(v) ? JSON.stringify(v) : (v ?? null));

async function uniqueViolation<T>(fn: () => Promise<T>, message: string): Promise<MutationResult<T>> {
  try {
    return ok(await fn());
  } catch (err) {
    const code = (err as { code?: string; cause?: { code?: string } }).code ?? (err as { cause?: { code?: string } }).cause?.code;
    if (code === "23505") return fail(message);
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Sources, colleges, reports
// ---------------------------------------------------------------------------

export async function createSource(db: Database, input: SourceInput, actor: string) {
  const [row] = await db.insert(s.sources).values({ ...input, createdBy: actor }).returning({ id: s.sources.id });
  return ok(row.id);
}

export async function updateSource(db: Database, id: string, input: SourceInput, actor: string): Promise<MutationResult> {
  const [before] = await db.select().from(s.sources).where(eq(s.sources.id, id));
  if (!before) return fail("Source not found.");
  if (!changed(before, input)) return unchanged();
  await db.update(s.sources).set(input).where(eq(s.sources.id, id));
  return ok(undefined, await markEdited(db, "source", id, actor));
}

export async function createCollege(db: Database, input: CollegeInput, actor: string) {
  return uniqueViolation(
    async () => (await db.insert(s.colleges).values({ ...input, createdBy: actor }).returning({ id: s.colleges.id }))[0].id,
    `The slug "${input.slug}" is already used.`,
  );
}

export async function updateCollege(db: Database, id: string, input: CollegeInput, actor: string): Promise<MutationResult> {
  const [before] = await db.select().from(s.colleges).where(eq(s.colleges.id, id));
  if (!before) return fail("College not found.");
  if (!changed(before, input)) return unchanged();
  const result = await uniqueViolation(() => db.update(s.colleges).set(input).where(eq(s.colleges.id, id)), `The slug "${input.slug}" is already used.`);
  if (!result.ok) return result;
  return ok(undefined, await markEdited(db, "college", id, actor));
}

export async function createReport(db: Database, input: ReportInput, actor: string) {
  return uniqueViolation(
    async () => (await db.insert(s.cleryReports).values({ ...input, createdBy: actor }).returning({ id: s.cleryReports.id }))[0].id,
    `A ${input.reportYear} report already exists for this college.`,
  );
}

export async function updateReport(db: Database, id: string, input: Omit<ReportInput, "collegeId">, actor: string): Promise<MutationResult> {
  const [before] = await db.select().from(s.cleryReports).where(eq(s.cleryReports.id, id));
  if (!before) return fail("Report not found.");
  if (!changed(before, input)) return unchanged();
  const result = await uniqueViolation(() => db.update(s.cleryReports).set(input).where(eq(s.cleryReports.id, id)), `A ${input.reportYear} report already exists for this college.`);
  if (!result.ok) return result;
  return ok(undefined, await markEdited(db, "clery_report", id, actor));
}

// ---------------------------------------------------------------------------
// Statistics grid
// ---------------------------------------------------------------------------

export const cellKey = (year: number, offense: Offense, geography: CleryGeography) => `cell|${year}|${offense}|${geography}`;
/** Field name for a cell's unfounded count (reports that law enforcement determined false or baseless). */
export const unfoundedKey = (year: number, offense: Offense, geography: CleryGeography) => `unf|${year}|${offense}|${geography}`;

/** "" = no figure entered; "-" (or "—", "n/a") = reported as not available (stored as null); digits = count. */
export function parseCellValue(raw: string): { value: number | null | undefined } | { error: string } {
  const v = raw.trim();
  if (v === "") return { value: undefined };
  if (["-", "—", "–", "n/a", "na"].includes(v.toLowerCase())) return { value: null };
  if (/^\d{1,5}$/.test(v)) return { value: Number(v) };
  return { error: `"${raw}" is not a whole number. Use "-" for a figure the report does not give.` };
}

export type GridEntry = {
  year: number;
  offense: Offense;
  geography: CleryGeography;
  /** undefined = no figure (no row); null = shown as unavailable; number = count. */
  value: number | null | undefined;
  /** Unfounded count. null = none given (blank or "-"); undefined = field not submitted, leave unchanged. */
  unfounded?: number | null;
};

const describeCell = (year: number | string, offense: string, geography: string) =>
  `${year} ${offense.replace("_", " ")} (${geography.replaceAll("_", " ")})`;

export function parseStatisticsGrid(form: Iterable<[string, FormDataEntryValue]>): { entries: GridEntry[]; errors: string[] } {
  const cells = new Map<string, GridEntry>();
  const unfounded = new Map<string, { label: string; value: number | null }>();
  const errors: string[] = [];

  for (const [name, raw] of form) {
    const prefix = name.split("|")[0];
    if ((prefix !== "cell" && prefix !== "unf") || typeof raw !== "string") continue;
    const [, y, offense, geography] = name.split("|");
    const year = Number(y);
    if (!Number.isInteger(year) || !offenses.includes(offense as Offense) || !cleryGeographies.includes(geography as CleryGeography)) {
      errors.push(`Unrecognized field ${name}.`);
      continue;
    }
    const key = cellKey(year, offense as Offense, geography as CleryGeography);
    const label = describeCell(year, offense, geography);
    const parsed = parseCellValue(raw);
    if ("error" in parsed) {
      errors.push(`${label}${prefix === "unf" ? ", unfounded" : ""}: ${parsed.error}`);
      continue;
    }
    if (prefix === "cell") cells.set(key, { year, offense: offense as Offense, geography: geography as CleryGeography, value: parsed.value });
    else unfounded.set(key, { label, value: parsed.value ?? null });
  }

  for (const [key, u] of unfounded) {
    const cell = cells.get(key);
    if (!cell) {
      errors.push(`${u.label}: unfounded count submitted without its figure.`);
    } else if (u.value !== null && cell.value === undefined) {
      errors.push(`${u.label}: enter the figure before its unfounded count.`);
    } else {
      cell.unfounded = cell.value === undefined ? undefined : u.value;
    }
  }
  return { entries: [...cells.values()], errors };
}

export type GridSaveSummary = { created: number; updated: number; deleted: number; unpublished: number };

/**
 * Applies a submitted grid to a report. All-or-nothing: validation happens before any write.
 * Changed published figures (count or unfounded count) are unpublished for re-verification.
 * Published figures cannot be cleared.
 */
export async function saveStatisticsGrid(db: Database, reportId: string, entries: GridEntry[], actor: string): Promise<MutationResult<GridSaveSummary>> {
  const existing = await db.select().from(s.crimeStatistics).where(eq(s.crimeStatistics.cleryReportId, reportId));
  const byKey = new Map(existing.map((r) => [cellKey(r.calendarYear, r.offense, r.geography), r]));
  const isPublic = (status: string) => (PUBLIC_STATUSES as readonly string[]).includes(status);

  const problems = entries
    .filter((e) => e.value === undefined)
    .map((e) => byKey.get(cellKey(e.year, e.offense, e.geography)))
    .filter((r): r is NonNullable<typeof r> => Boolean(r && isPublic(r.status)))
    .map((r) => `${describeCell(r.calendarYear, r.offense, r.geography)} is published and can't be cleared. Enter "-" or reject it instead.`);
  if (problems.length) return fail(...problems);

  // Work out every change first, then apply each kind in a single statement (a few queries in total,
  // instead of several round trips per figure).
  const inserts: (typeof s.crimeStatistics.$inferInsert)[] = [];
  const updates: { id: string; count: number | null; unfounded: number | null }[] = [];
  const deletes: string[] = [];
  for (const e of entries) {
    const row = byKey.get(cellKey(e.year, e.offense, e.geography));
    if (e.value === undefined) {
      if (row) deletes.push(row.id);
    } else if (!row) {
      inserts.push({
        cleryReportId: reportId,
        calendarYear: e.year,
        offense: e.offense,
        geography: e.geography,
        count: e.value,
        unfoundedCount: e.unfounded ?? null,
        createdBy: actor,
      });
    } else {
      const unfounded = e.unfounded === undefined ? row.unfoundedCount : e.unfounded;
      if (row.count !== e.value || row.unfoundedCount !== unfounded) updates.push({ id: row.id, count: e.value, unfounded });
    }
  }

  const summary: GridSaveSummary = { created: inserts.length, updated: updates.length, deleted: deletes.length, unpublished: 0 };
  await db.transaction(async (tx) => {
    const t = tx as unknown as Database;
    if (deletes.length) await t.delete(s.crimeStatistics).where(inArray(s.crimeStatistics.id, deletes));
    if (inserts.length) await t.insert(s.crimeStatistics).values(inserts);
    if (updates.length) {
      const values = sql.join(
        updates.map((u) => sql`(${u.id}::uuid, ${u.count}::int, ${u.unfounded}::int)`),
        sql`, `,
      );
      await t.execute(
        sql`update ${s.crimeStatistics} as c set count = v.count, unfounded_count = v.unfounded, updated_at = now()
            from (values ${values}) as v(id, count, unfounded) where c.id = v.id`,
      );
      summary.unpublished = await markEditedMany(
        t,
        "crime_statistic",
        updates.map((u) => u.id),
        actor,
      );
    }
  });
  return ok(summary);
}

// ---------------------------------------------------------------------------
// Footnotes
// ---------------------------------------------------------------------------

export async function createFootnote(db: Database, reportId: string, input: FootnoteInput, actor: string) {
  const [row] = await db
    .insert(s.statisticFootnotes)
    .values({ ...input, cleryReportId: reportId, createdBy: actor })
    .returning({ id: s.statisticFootnotes.id });
  return ok(row.id);
}

export async function updateFootnote(db: Database, id: string, input: FootnoteInput, actor: string): Promise<MutationResult> {
  const [before] = await db.select().from(s.statisticFootnotes).where(eq(s.statisticFootnotes.id, id));
  if (!before) return fail("Footnote not found.");
  if (!changed(before, input)) return unchanged();
  await db.update(s.statisticFootnotes).set(input).where(eq(s.statisticFootnotes.id, id));
  return ok(undefined, await markEdited(db, "statistic_footnote", id, actor));
}

/** Replaces which figures a footnote applies to. The database rejects figures from another report. */
export async function setFootnoteLinks(db: Database, footnoteId: string, statisticIds: string[], actor: string): Promise<MutationResult> {
  const [note] = await db.select().from(s.statisticFootnotes).where(eq(s.statisticFootnotes.id, footnoteId));
  if (!note) return fail("Footnote not found.");
  const current = await db
    .select({ id: s.statisticFootnoteLinks.crimeStatisticId })
    .from(s.statisticFootnoteLinks)
    .where(eq(s.statisticFootnoteLinks.footnoteId, footnoteId));
  const next = [...new Set(statisticIds)];
  const same = current.length === next.length && current.every((c) => next.includes(c.id));
  if (same) return unchanged();

  if (next.length) {
    const inReport = await db
      .select({ id: s.crimeStatistics.id })
      .from(s.crimeStatistics)
      .where(and(inArray(s.crimeStatistics.id, next), eq(s.crimeStatistics.cleryReportId, note.cleryReportId)));
    if (inReport.length !== next.length) return fail("A footnote can only apply to figures from its own report.");
  }

  await db.transaction(async (tx) => {
    await tx.delete(s.statisticFootnoteLinks).where(eq(s.statisticFootnoteLinks.footnoteId, footnoteId));
    if (next.length) {
      await tx
        .insert(s.statisticFootnoteLinks)
        .values(next.map((id) => ({ footnoteId, crimeStatisticId: id, cleryReportId: note.cleryReportId })));
    }
  });
  // Which figures a note applies to is part of what was verified.
  return ok(undefined, await markEdited(db, "statistic_footnote", footnoteId, actor));
}

// ---------------------------------------------------------------------------
// Citations
// ---------------------------------------------------------------------------

const citationField = {
  college: "collegeId",
  clery_report: "cleryReportId",
  crime_statistic: "crimeStatisticId",
  statistic_footnote: "statisticFootnoteId",
  institution_action: "institutionActionId",
  institutional_response: "institutionalResponseId",
  policy: "policyId",
  student_resource: "studentResourceId",
  correction: "correctionId",
  case: "caseId",
  case_event: "caseEventId",
} as const satisfies Partial<Record<ReviewTableKey, keyof typeof s.citations.$inferInsert>>;

export type CitableKey = keyof typeof citationField;
export const isCitableKey = (k: string): k is CitableKey => k in citationField;

export async function addCitation(db: Database, key: CitableKey, recordId: string, input: CitationInput) {
  const [row] = await db
    .insert(s.citations)
    .values({ ...input, [citationField[key]]: recordId })
    .returning({ id: s.citations.id });
  return ok(row.id);
}

/** Removes a citation; if that leaves a published record without evidence, the record is unpublished. */
export async function removeCitation(db: Database, citationId: string, actor: string): Promise<MutationResult> {
  const [cite] = await db.select().from(s.citations).where(eq(s.citations.id, citationId));
  if (!cite) return fail("Citation not found.");
  const target = (Object.entries(citationField) as [CitableKey, (typeof citationField)[CitableKey]][]).find(([, field]) => cite[field]);
  await db.delete(s.citations).where(eq(s.citations.id, citationId));
  if (!target) return ok(undefined);
  return ok(undefined, await enforceStillValid(db, target[0], cite[target[1]]!, actor));
}

// ---------------------------------------------------------------------------
// Institutional record: timeline entries, responses, policies, resources, coverage, corrections
// ---------------------------------------------------------------------------

/** Records that belong to one college and are edited through the same publish rules. */
export const collegeRecordTables = {
  institution_action: s.institutionActions,
  institutional_response: s.institutionalResponses,
  policy: s.policies,
  student_resource: s.studentResources,
  college_coverage: s.collegeCoverage,
  correction: s.corrections,
} as const;

export type CollegeRecordKey = keyof typeof collegeRecordTables;
export const isCollegeRecordKey = (k: string): k is CollegeRecordKey => k in collegeRecordTables;

export type CollegeRecordInput = {
  institution_action: ActionInput;
  institutional_response: ResponseInput;
  policy: PolicyInput;
  student_resource: ResourceInput;
  college_coverage: CoverageInput;
  correction: CorrectionInput;
};

const referenceProblem = (err: unknown): string | null => {
  const code = (err as { code?: string }).code ?? (err as { cause?: { code?: string } }).cause?.code;
  return code === "23503" ? "A selected source, case, or timeline entry no longer exists." : null;
};

// The six tables share these columns; the cast keeps one implementation instead of six near-identical ones.
type AnyCollegeTable = typeof s.policies;

export async function createCollegeRecord<K extends CollegeRecordKey>(
  db: Database,
  key: K,
  collegeId: string,
  input: CollegeRecordInput[K],
  actor: string,
): Promise<MutationResult<string>> {
  const table = collegeRecordTables[key] as unknown as AnyCollegeTable;
  try {
    const [row] = await db
      .insert(table)
      .values({ ...input, collegeId, createdBy: actor } as never)
      .returning({ id: table.id });
    return ok(row.id);
  } catch (err) {
    const problem = referenceProblem(err);
    if (problem) return fail(problem);
    throw err;
  }
}

export async function updateCollegeRecord<K extends CollegeRecordKey>(
  db: Database,
  key: K,
  id: string,
  input: CollegeRecordInput[K],
  actor: string,
): Promise<MutationResult> {
  const table = collegeRecordTables[key] as unknown as AnyCollegeTable;
  const [before] = (await db.select().from(table).where(eq(table.id, id))) as Record<string, unknown>[];
  if (!before) return fail("Record not found.");
  if (!changed(before, input as Record<string, unknown>)) return unchanged();
  try {
    await db.update(table).set(input as never).where(eq(table.id, id));
  } catch (err) {
    const problem = referenceProblem(err);
    if (problem) return fail(problem);
    throw err;
  }
  return ok(undefined, await markEdited(db, key, id, actor));
}

// ---------------------------------------------------------------------------
// Cases, events, and case corrections
// ---------------------------------------------------------------------------

export async function createCase(db: Database, input: CaseInput, actor: string): Promise<MutationResult<string>> {
  const { collegeIds, ...fields } = input;
  try {
    const id = await db.transaction(async (tx) => {
      const [row] = await tx.insert(s.cases).values({ ...fields, createdBy: actor }).returning({ id: s.cases.id });
      await tx.insert(s.caseColleges).values(collegeIds.map((collegeId) => ({ caseId: row.id, collegeId })));
      return row.id;
    });
    return ok(id);
  } catch (err) {
    const code = (err as { code?: string }).code ?? (err as { cause?: { code?: string } }).cause?.code;
    if (code === "23505") return fail(`The slug "${input.slug}" is already used.`);
    if (code === "23503") return fail("A selected institution no longer exists.");
    throw err;
  }
}

/** Updates a case and its linked institutions. Changing either unpublishes a published case. */
export async function updateCase(db: Database, id: string, input: CaseInput, actor: string): Promise<MutationResult> {
  const { collegeIds, ...fields } = input;
  const [before] = await db.select().from(s.cases).where(eq(s.cases.id, id));
  if (!before) return fail("Case not found.");
  const links = await db.select({ collegeId: s.caseColleges.collegeId }).from(s.caseColleges).where(eq(s.caseColleges.caseId, id));
  const current = links.map((l) => l.collegeId).sort();
  const next = [...new Set(collegeIds)].sort();
  const collegesChanged = current.join() !== next.join();
  if (!changed(before, fields) && !collegesChanged) return unchanged();

  try {
    await db.transaction(async (tx) => {
      await tx.update(s.cases).set(fields).where(eq(s.cases.id, id));
      if (collegesChanged) {
        await tx.delete(s.caseColleges).where(eq(s.caseColleges.caseId, id));
        await tx.insert(s.caseColleges).values(next.map((collegeId) => ({ caseId: id, collegeId })));
      }
    });
  } catch (err) {
    const code = (err as { code?: string }).code ?? (err as { cause?: { code?: string } }).cause?.code;
    if (code === "23505") return fail(`The slug "${input.slug}" is already used.`);
    throw err;
  }
  // Which institutions a case appears under is part of what was verified.
  return ok(undefined, await markEdited(db, "case", id, actor));
}

/** An event may only update an earlier event of the same case, and never itself. */
async function supersedesProblem(db: Database, caseId: string, eventId: string | null, supersedesEventId: string | null) {
  if (!supersedesEventId) return null;
  if (supersedesEventId === eventId) return "An event can't update itself.";
  const [target] = await db.select({ caseId: s.caseEvents.caseId }).from(s.caseEvents).where(eq(s.caseEvents.id, supersedesEventId));
  return target?.caseId === caseId ? null : "An event can only update another event in the same case.";
}

export async function createCaseEvent(db: Database, caseId: string, input: EventInput, actor: string): Promise<MutationResult<string>> {
  const problem = await supersedesProblem(db, caseId, null, input.supersedesEventId);
  if (problem) return fail(problem);
  const [row] = await db.insert(s.caseEvents).values({ ...input, caseId, createdBy: actor }).returning({ id: s.caseEvents.id });
  return ok(row.id);
}

export async function updateCaseEvent(db: Database, id: string, input: EventInput, actor: string): Promise<MutationResult> {
  const [before] = await db.select().from(s.caseEvents).where(eq(s.caseEvents.id, id));
  if (!before) return fail("Event not found.");
  const problem = await supersedesProblem(db, before.caseId, id, input.supersedesEventId);
  if (problem) return fail(problem);
  if (!changed(before, input)) return unchanged();
  await db.update(s.caseEvents).set(input).where(eq(s.caseEvents.id, id));
  return ok(undefined, await markEdited(db, "case_event", id, actor));
}

export async function createCaseCorrection(db: Database, caseId: string, input: CorrectionInput, actor: string): Promise<MutationResult<string>> {
  const [row] = await db.insert(s.corrections).values({ ...input, caseId, createdBy: actor }).returning({ id: s.corrections.id });
  return ok(row.id);
}

// ---------------------------------------------------------------------------
// Deletion
// ---------------------------------------------------------------------------

export async function deleteRecord(db: Database, key: ReviewTableKey, id: string): Promise<MutationResult> {
  const t = reviewTables[key].table;
  const [row] = (await db.select({ status: t.status }).from(t).where(eq(t.id, id))) as { status: string }[];
  if (!row) return fail("Record not found.");
  if (row.status !== "draft" && row.status !== "rejected") return fail("Only draft or rejected records can be deleted. Reject it first.");
  try {
    await db.delete(t).where(eq(t.id, id));
  } catch (err) {
    const code = (err as { code?: string; cause?: { code?: string } }).code ?? (err as { cause?: { code?: string } }).cause?.code;
    // 23503 foreign_key_violation, 23001 restrict_violation (ON DELETE RESTRICT)
    if (code === "23503" || code === "23001") return fail("Other records still depend on this one (for example, citations or reports). Remove those first.");
    throw err;
  }
  return ok(undefined);
}
