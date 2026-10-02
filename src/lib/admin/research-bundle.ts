import "server-only";
// Imports a transcribed research bundle (see research/) through the same mutations the admin uses.
// Everything is created as draft and moved to pending_review: a human verifies it in the admin.
// Re-running is safe: existing sources (by URL), reports (by college + year), and citations are reused.

import { and, eq } from "drizzle-orm";
import * as s from "@/db/schema";
import type { Database } from "@/db/types";
import type { CleryGeography, Offense } from "@/lib/enums";
import {
  addCitation,
  collegeRecordTables,
  createCollegeRecord,
  createFootnote,
  createReport,
  createSource,
  saveStatisticsGrid,
  updateCollege,
  type CollegeRecordInput,
  type CollegeRecordKey,
  type GridEntry,
} from "./records";
import type { SourceInput } from "./validation";
import { changeStatus, getStatus, type ReviewTableKey } from "./workflow";

export type BundleCitation = { source: string; pinpoint?: string; excerpt?: string; claim?: string };

export type ResearchBundle = {
  college: {
    slug: string;
    /** Only the fields being set; everything else on the college record is left as is. */
    updates?: { enrollment?: number | null; enrollmentNote?: string | null };
    citations?: BundleCitation[];
  };
  /** Keyed by a local name used in citations and reports. */
  sources: Record<string, SourceInput & { internalNotes?: string }>;
  reports: {
    reportYear: number;
    title: string;
    source: string;
    /** The calendar years in the report's table, left to right. */
    years: number[];
    /**
     * Figures exactly as printed, one array per offense in `years` order. null = shown as unavailable.
     * Offenses or geographies omitted here are not entered.
     */
    figures: Partial<Record<CleryGeography, Partial<Record<Offense, (number | null)[]>>>>;
    /** Notes printed with the statistics, recorded verbatim as report-wide notes. */
    notes?: { marker?: string; page: string; originalText: string; summary?: string }[];
    citations?: BundleCitation[];
  }[];
  /** Institutional records (responses, policies, resources, timeline entries…), each with its citations. */
  records?: BundleRecord[];
};

export type BundleRecord = {
  [K in CollegeRecordKey]: { key: K; input: CollegeRecordInput[K]; citations: BundleCitation[] };
}[CollegeRecordKey];

/** The column that identifies an existing record of each type when re-running an import. */
const identifyingColumn: Record<CollegeRecordKey, string> = {
  institution_action: "title",
  institutional_response: "summary",
  policy: "title",
  student_resource: "name",
  college_coverage: "summary",
  correction: "description",
};

export type ImportSummary = {
  log: string[];
  /** Records moved to pending_review by this import. */
  queued: { key: ReviewTableKey; id: string }[];
};

/** Structural checks that catch transcription slips before anything is written. */
export function validateBundle(bundle: ResearchBundle): string[] {
  const problems: string[] = [];
  for (const [key, src] of Object.entries(bundle.sources)) {
    if (!src.url && !src.archivedUrl) problems.push(`Source ${key} has no URL or archived URL.`);
    if (!src.retrievedAt) problems.push(`Source ${key} has no retrieval date.`);
  }
  const refs = [
    ...(bundle.college.citations ?? []),
    ...bundle.reports.flatMap((r) => [{ source: r.source }, ...(r.citations ?? [])]),
    ...(bundle.records ?? []).flatMap((r) => r.citations),
  ];
  for (const r of bundle.records ?? []) {
    if (r.key !== "college_coverage" && !r.citations.length) problems.push(`${r.key} record has no citation.`);
  }
  for (const ref of refs) if (!bundle.sources[ref.source]) problems.push(`Unknown source "${ref.source}".`);

  for (const r of bundle.reports) {
    const label = `${r.reportYear} report`;
    if (r.years.length !== 3 || r.years.some((y, i) => y !== r.reportYear - 3 + i)) {
      problems.push(`${label}: expected the three calendar years before ${r.reportYear}, got ${r.years.join(", ")}.`);
    }
    for (const [geo, rows] of Object.entries(r.figures)) {
      for (const [offense, values] of Object.entries(rows ?? {})) {
        if (values!.length !== r.years.length) problems.push(`${label} ${geo} ${offense}: ${values!.length} values for ${r.years.length} years.`);
        if (values!.some((v) => v !== null && (!Number.isInteger(v) || v < 0))) problems.push(`${label} ${geo} ${offense}: values must be whole numbers.`);
      }
    }
    // Residential facilities are a subset of on campus: a larger residential figure means a misread column.
    const onCampus = r.figures.on_campus ?? {};
    for (const [offense, residential] of Object.entries(r.figures.on_campus_residential ?? {})) {
      residential!.forEach((v, i) => {
        const oc = onCampus[offense as Offense]?.[i];
        if (v !== null && oc !== null && oc !== undefined && v > oc) {
          problems.push(`${label} ${offense} ${r.years[i]}: residential (${v}) exceeds on campus (${oc}).`);
        }
      });
    }
  }
  return problems;
}

export async function importResearchBundle(db: Database, bundle: ResearchBundle, actor: string): Promise<ImportSummary> {
  const problems = validateBundle(bundle);
  if (problems.length) throw new Error(`Bundle failed validation:\n- ${problems.join("\n- ")}`);

  const log: string[] = [];
  const queued: ImportSummary["queued"] = [];
  const queue = (key: ReviewTableKey, id: string) => queued.push({ key, id });

  const [college] = await db.select().from(s.colleges).where(eq(s.colleges.slug, bundle.college.slug));
  if (!college) throw new Error(`College "${bundle.college.slug}" not found.`);

  // Sources: reuse by URL.
  const sourceIds: Record<string, string> = {};
  for (const [key, { internalNotes, ...input }] of Object.entries(bundle.sources)) {
    const [existing] = input.url ? await db.select({ id: s.sources.id }).from(s.sources).where(eq(s.sources.url, input.url)) : [];
    if (existing) {
      sourceIds[key] = existing.id;
      log.push(`Source "${input.title}": already exists, reused.`);
      continue;
    }
    const created = await createSource(db, input, actor);
    if (!created.ok) throw new Error(created.problems.join(" "));
    if (internalNotes) await db.update(s.sources).set({ internalNotes }).where(eq(s.sources.id, created.value));
    sourceIds[key] = created.value;
    queue("source", created.value);
    log.push(`Source "${input.title}": created.`);
  }

  const citationColumns = {
    college: s.citations.collegeId,
    clery_report: s.citations.cleryReportId,
    institution_action: s.citations.institutionActionId,
    institutional_response: s.citations.institutionalResponseId,
    policy: s.citations.policyId,
    student_resource: s.citations.studentResourceId,
    correction: s.citations.correctionId,
  } as const;
  /** Adds a citation unless the same one (record, source, page, excerpt) is already there. */
  const cite = async (key: keyof typeof citationColumns, recordId: string, c: BundleCitation) => {
    const column = citationColumns[key];
    const existing = await db
      .select({ pinpoint: s.citations.pinpoint, excerpt: s.citations.excerpt })
      .from(s.citations)
      .where(and(eq(column, recordId), eq(s.citations.sourceId, sourceIds[c.source])));
    if (existing.some((e) => (e.pinpoint ?? null) === (c.pinpoint ?? null) && (e.excerpt ?? null) === (c.excerpt ?? null))) return;
    await addCitation(db, key, recordId, { sourceId: sourceIds[c.source], pinpoint: c.pinpoint ?? null, excerpt: c.excerpt ?? null, claim: c.claim ?? null });
  };


  // College: apply only the given fields.
  if (bundle.college.updates) {
    const result = await updateCollege(
      db,
      college.id,
      {
        slug: college.slug,
        name: college.name,
        aliases: college.aliases,
        city: college.city,
        state: college.state,
        enrollment: college.enrollment,
        enrollmentNote: college.enrollmentNote,
        lastReviewedAt: college.lastReviewedAt,
        ...bundle.college.updates,
      },
      actor,
    );
    if (!result.ok) throw new Error(result.problems.join(" "));
    log.push(`College ${college.name}: ${result.unchanged ? "no changes" : "updated"}.`);
  }
  for (const c of bundle.college.citations ?? []) await cite("college", college.id, c);
  queue("college", college.id);

  // Reports: skip a year that already exists rather than overwrite researched data.
  for (const r of bundle.reports) {
    const [existing] = await db
      .select({ id: s.cleryReports.id })
      .from(s.cleryReports)
      .where(and(eq(s.cleryReports.collegeId, college.id), eq(s.cleryReports.reportYear, r.reportYear)));
    if (existing) {
      log.push(`${r.reportYear} report: already exists, skipped (edit it in the admin).`);
      continue;
    }
    const created = await createReport(db, { collegeId: college.id, reportYear: r.reportYear, title: r.title, sourceId: sourceIds[r.source] }, actor);
    if (!created.ok) throw new Error(created.problems.join(" "));
    const reportId = created.value;
    queue("clery_report", reportId);

    const entries: GridEntry[] = [];
    for (const [geography, rows] of Object.entries(r.figures) as [CleryGeography, Partial<Record<Offense, (number | null)[]>>][]) {
      for (const [offense, values] of Object.entries(rows) as [Offense, (number | null)[]][]) {
        values.forEach((value, i) => entries.push({ year: r.years[i], offense, geography, value }));
      }
    }
    const grid = await saveStatisticsGrid(db, reportId, entries, actor);
    if (!grid.ok) throw new Error(grid.problems.join(" "));

    for (const n of r.notes ?? []) {
      const note = await createFootnote(db, reportId, { marker: n.marker ?? null, page: n.page, originalText: n.originalText, summary: n.summary ?? null }, actor);
      if (note.ok) queue("statistic_footnote", note.value);
    }
    for (const c of r.citations ?? []) await cite("clery_report", reportId, c);

    const stats = await db.select({ id: s.crimeStatistics.id }).from(s.crimeStatistics).where(eq(s.crimeStatistics.cleryReportId, reportId));
    for (const st of stats) queue("crime_statistic", st.id);
    log.push(`${r.reportYear} report: created with ${stats.length} figures and ${r.notes?.length ?? 0} notes.`);
  }

  // Institutional records: skip one that already exists (same identifying field) rather than duplicate it.
  for (const r of bundle.records ?? []) {
    const table = collegeRecordTables[r.key] as unknown as typeof s.policies;
    const column = (table as unknown as Record<string, typeof s.policies.title>)[identifyingColumn[r.key]];
    const value = (r.input as Record<string, unknown>)[identifyingColumn[r.key]] as string;
    const [existing] = await db
      .select({ id: table.id })
      .from(table)
      .where(and(eq(table.collegeId, college.id), eq(column, value)));
    if (existing) {
      // Still add any of its citations that are missing (e.g. after an earlier, incomplete import).
      if (r.key !== "college_coverage") for (const c of r.citations) await cite(r.key, existing.id, c);
      log.push(`${r.key} "${value.slice(0, 50)}": already exists, kept; citations checked.`);
      continue;
    }
    const created = await createCollegeRecord(db, r.key, college.id, r.input as never, actor);
    if (!created.ok) throw new Error(created.problems.join(" "));
    if (r.key !== "college_coverage") for (const c of r.citations) await cite(r.key, created.value, c);
    queue(r.key, created.value);
    log.push(`${r.key} "${value.slice(0, 50)}": created.`);
  }

  // Hand everything to human review. Only drafts move; anything further along is left as it is.
  for (const { key, id } of queued) {
    if ((await getStatus(db, key, id)) !== "draft") continue;
    await changeStatus(db, {
      key,
      id,
      to: "pending_review",
      actor,
      note: "Transcribed from the source document; awaiting verification against it.",
    });
  }
  return { log, queued };
}
