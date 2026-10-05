import "server-only";
// Admin reads. Unlike the public layer, these return records in every status.

import { and, asc, desc, eq, sql } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";
import * as s from "@/db/schema";
import type { Database } from "@/db/types";
import type { VerificationStatus } from "@/lib/enums";
import { collegeRecordTables, type CollegeRecordKey } from "./records";
import { reviewTables, type ReviewTableKey } from "./workflow";

export type StatusCounts = Record<VerificationStatus, number>;

/** Most recent discovery runs, newest first, for the dashboard. */
export async function recentDiscoveryRuns(db: Database, limit = 8) {
  const runs = await db
    .select()
    .from(s.ingestionRuns)
    .where(eq(s.ingestionRuns.job, "discovery"))
    .orderBy(desc(s.ingestionRuns.startedAt))
    .limit(limit);
  const [lastScheduled] = await db
    .select({ startedAt: s.ingestionRuns.startedAt, outcome: s.ingestionRuns.outcome })
    .from(s.ingestionRuns)
    .where(and(eq(s.ingestionRuns.job, "discovery"), eq(s.ingestionRuns.triggeredBy, "cron")))
    .orderBy(desc(s.ingestionRuns.startedAt))
    .limit(1);
  return { runs, lastScheduled: lastScheduled ?? null, checkedAt: Date.now() };
}

export async function dashboard(db: Database) {
  const counts = {} as Record<ReviewTableKey, Partial<StatusCounts>>;
  for (const [key, { table }] of Object.entries(reviewTables) as [ReviewTableKey, (typeof reviewTables)[ReviewTableKey]][]) {
    const rows = (await db
      .select({ status: table.status, n: sql<number>`count(*)::int` })
      .from(table)
      .groupBy(table.status)) as { status: VerificationStatus; n: number }[];
    counts[key] = Object.fromEntries(rows.map((r) => [r.status, r.n]));
  }

  const [{ inbox }] = await db
    .select({ inbox: sql<number>`count(*)::int` })
    .from(s.candidateItems)
    .where(eq(s.candidateItems.status, "new"));

  const recent = await db.select().from(s.verificationLog).orderBy(desc(s.verificationLog.createdAt)).limit(15);

  const awaiting = [
    ...(await db
      .select({ id: s.sources.id, label: s.sources.title, createdBy: s.sources.createdBy })
      .from(s.sources)
      .where(eq(s.sources.status, "pending_review"))).map((r) => ({ ...r, kind: "Source", href: `/admin/sources/${r.id}` })),
    ...(await db
      .select({ id: s.colleges.id, label: s.colleges.name, createdBy: s.colleges.createdBy })
      .from(s.colleges)
      .where(eq(s.colleges.status, "pending_review"))).map((r) => ({ ...r, kind: "College", href: `/admin/colleges/${r.id}` })),
    ...(await db
      .select({ id: s.cleryReports.id, label: s.cleryReports.title, createdBy: s.cleryReports.createdBy })
      .from(s.cleryReports)
      .where(eq(s.cleryReports.status, "pending_review"))).map((r) => ({ ...r, kind: "Clery report", href: `/admin/reports/${r.id}` })),
    ...(await db
      .select({
        id: s.cleryReports.id,
        label: s.cleryReports.title,
        createdBy: sql<string | null>`null`,
        n: sql<number>`count(*)::int`,
      })
      .from(s.crimeStatistics)
      .innerJoin(s.cleryReports, eq(s.crimeStatistics.cleryReportId, s.cleryReports.id))
      .where(eq(s.crimeStatistics.status, "pending_review"))
      .groupBy(s.cleryReports.id, s.cleryReports.title)).map((r) => ({
      id: r.id,
      label: `${r.n} figure${r.n === 1 ? "" : "s"} in ${r.label}`,
      createdBy: r.createdBy,
      kind: "Statistics",
      href: `/admin/reports/${r.id}`,
    })),
    ...(await pendingCollegeRecords(db)),
  ];

  return { counts, inbox, recent, awaiting };
}

/** Institutional records awaiting review, labelled for the dashboard. */
async function pendingCollegeRecords(db: Database) {
  const pending = (table: { status: AnyPgColumn }) => eq(table.status, "pending_review");
  const rows = await Promise.all([
    db.select({ id: s.institutionActions.id, label: s.institutionActions.title, createdBy: s.institutionActions.createdBy }).from(s.institutionActions).where(pending(s.institutionActions)),
    db.select({ id: s.institutionalResponses.id, label: s.institutionalResponses.topic, createdBy: s.institutionalResponses.createdBy }).from(s.institutionalResponses).where(pending(s.institutionalResponses)),
    db.select({ id: s.policies.id, label: s.policies.title, createdBy: s.policies.createdBy }).from(s.policies).where(pending(s.policies)),
    db.select({ id: s.studentResources.id, label: s.studentResources.name, createdBy: s.studentResources.createdBy }).from(s.studentResources).where(pending(s.studentResources)),
    db.select({ id: s.collegeCoverage.id, label: s.collegeCoverage.summary, createdBy: s.collegeCoverage.createdBy }).from(s.collegeCoverage).where(pending(s.collegeCoverage)),
    db.select({ id: s.corrections.id, label: s.corrections.description, createdBy: s.corrections.createdBy }).from(s.corrections).where(pending(s.corrections)),
  ]);
  const keys = ["institution_action", "institutional_response", "policy", "student_resource", "college_coverage", "correction"] as const;
  const casesPending = await db.select({ id: s.cases.id, label: s.cases.title, createdBy: s.cases.createdBy }).from(s.cases).where(pending(s.cases));
  const eventsPending = await db
    .select({ id: s.caseEvents.id, label: s.cases.title, createdBy: s.caseEvents.createdBy, caseId: s.caseEvents.caseId })
    .from(s.caseEvents)
    .innerJoin(s.cases, eq(s.caseEvents.caseId, s.cases.id))
    .where(pending(s.caseEvents));
  const caseItems = [
    ...casesPending.map((r) => ({ id: r.id, label: r.label, createdBy: r.createdBy, kind: "Case", href: `/admin/cases/${r.id}` })),
    ...eventsPending.map((r) => ({ id: r.id, label: `Event in ${r.label}`, createdBy: r.createdBy, kind: "Case event", href: `/admin/cases/${r.caseId}/events/${r.id}` })),
  ];
  return [
    ...rows.flatMap((list, i) =>
      list.map((r) => ({
        id: r.id,
        label: String(r.label).replaceAll("_", " ").slice(0, 90),
        createdBy: r.createdBy,
        kind: reviewTables[keys[i]].label,
        href: `/admin/records/${keys[i]}/${r.id}`,
      })),
    ),
    ...caseItems,
  ];
}

export async function listSources(db: Database) {
  return db
    .select({
      id: s.sources.id,
      type: s.sources.type,
      title: s.sources.title,
      publisher: s.sources.publisher,
      publicationDate: s.sources.publicationDate,
      status: s.sources.status,
      isDemo: s.sources.isDemo,
    })
    .from(s.sources)
    .orderBy(desc(s.sources.updatedAt));
}

export async function getSource(db: Database, id: string) {
  const [source] = await db.select().from(s.sources).where(eq(s.sources.id, id));
  if (!source) return null;
  const [{ citations }] = await db
    .select({ citations: sql<number>`count(*)::int` })
    .from(s.citations)
    .where(eq(s.citations.sourceId, id));
  const [{ reports }] = await db
    .select({ reports: sql<number>`count(*)::int` })
    .from(s.cleryReports)
    .where(eq(s.cleryReports.sourceId, id));
  return { source, usage: { citations, reports } };
}

export async function listColleges(db: Database) {
  return db
    .select({ id: s.colleges.id, name: s.colleges.name, slug: s.colleges.slug, status: s.colleges.status, isDemo: s.colleges.isDemo })
    .from(s.colleges)
    .orderBy(asc(s.colleges.name));
}

export async function getCollege(db: Database, id: string) {
  const [college] = await db.select().from(s.colleges).where(eq(s.colleges.id, id));
  if (!college) return null;
  const reports = await db
    .select({ id: s.cleryReports.id, reportYear: s.cleryReports.reportYear, title: s.cleryReports.title, status: s.cleryReports.status })
    .from(s.cleryReports)
    .where(eq(s.cleryReports.collegeId, id))
    .orderBy(desc(s.cleryReports.reportYear));
  return { college, reports };
}

export async function getReport(db: Database, id: string) {
  const [row] = await db
    .select({ report: s.cleryReports, college: { id: s.colleges.id, name: s.colleges.name, slug: s.colleges.slug }, source: s.sources })
    .from(s.cleryReports)
    .innerJoin(s.colleges, eq(s.cleryReports.collegeId, s.colleges.id))
    .innerJoin(s.sources, eq(s.cleryReports.sourceId, s.sources.id))
    .where(eq(s.cleryReports.id, id));
  if (!row) return null;
  // Independent reads: run them together rather than one round trip after another.
  const [statistics, footnotes, links] = await Promise.all([
    db.select().from(s.crimeStatistics).where(eq(s.crimeStatistics.cleryReportId, id)),
    db.select().from(s.statisticFootnotes).where(eq(s.statisticFootnotes.cleryReportId, id)).orderBy(asc(s.statisticFootnotes.createdAt)),
    db
      .select({ footnoteId: s.statisticFootnoteLinks.footnoteId, statisticId: s.statisticFootnoteLinks.crimeStatisticId })
      .from(s.statisticFootnoteLinks)
      .where(eq(s.statisticFootnoteLinks.cleryReportId, id)),
  ]);
  return { ...row, statistics, footnotes, links };
}

export type AdminCitation = {
  id: string;
  pinpoint: string | null;
  excerpt: string | null;
  claim: string | null;
  sourceId: string;
  sourceTitle: string;
  sourceStatus: VerificationStatus;
};

export async function citationsFor(db: Database, column: (typeof reviewTables)[ReviewTableKey]["citation"], id: string): Promise<AdminCitation[]> {
  if (!column) return [];
  return db
    .select({
      id: s.citations.id,
      pinpoint: s.citations.pinpoint,
      excerpt: s.citations.excerpt,
      claim: s.citations.claim,
      sourceId: s.sources.id,
      sourceTitle: s.sources.title,
      sourceStatus: s.sources.status,
    })
    .from(s.citations)
    .innerJoin(s.sources, eq(s.citations.sourceId, s.sources.id))
    .where(eq(column, id))
    .orderBy(asc(s.citations.createdAt));
}

export async function sourceOptions(db: Database) {
  return db
    .select({ id: s.sources.id, title: s.sources.title, publisher: s.sources.publisher, status: s.sources.status })
    .from(s.sources)
    .where(sql`${s.sources.status} <> 'rejected'`)
    .orderBy(asc(s.sources.title));
}

export async function caseOptions(db: Database) {
  return db.select({ id: s.cases.id, title: s.cases.title, status: s.cases.status }).from(s.cases).orderBy(asc(s.cases.title));
}

// ---------------------------------------------------------------------------
// Institutional record (step 5b-1)
// ---------------------------------------------------------------------------

/** Every institutional record for a college, in every status, grouped by type. */
export async function getCollegeRecords(db: Database, collegeId: string) {
  const [actions, responses, policies, resources, coverage, corrections] = await Promise.all([
    db.select().from(s.institutionActions).where(eq(s.institutionActions.collegeId, collegeId)).orderBy(desc(s.institutionActions.actionDate)),
    db.select().from(s.institutionalResponses).where(eq(s.institutionalResponses.collegeId, collegeId)).orderBy(asc(s.institutionalResponses.topic)),
    db.select().from(s.policies).where(eq(s.policies.collegeId, collegeId)).orderBy(asc(s.policies.title)),
    db
      .select()
      .from(s.studentResources)
      .where(eq(s.studentResources.collegeId, collegeId))
      .orderBy(asc(s.studentResources.category), asc(s.studentResources.sortOrder), asc(s.studentResources.name)),
    db
      .select({ coverage: s.collegeCoverage, sourceTitle: s.sources.title, publisher: s.sources.publisher, sourceStatus: s.sources.status })
      .from(s.collegeCoverage)
      .innerJoin(s.sources, eq(s.collegeCoverage.sourceId, s.sources.id))
      .where(eq(s.collegeCoverage.collegeId, collegeId))
      .orderBy(desc(s.collegeCoverage.createdAt)),
    db.select().from(s.corrections).where(eq(s.corrections.collegeId, collegeId)).orderBy(desc(s.corrections.correctionDate)),
  ]);
  return { actions, responses, policies, resources, coverage, corrections };
}

/**
 * One institutional record with its parent, for the record page. Most belong to a college;
 * corrections may instead belong to a case.
 */
export async function getCollegeRecord(db: Database, key: CollegeRecordKey, id: string) {
  const table = collegeRecordTables[key] as unknown as typeof s.policies;
  const [record] = (await db.select().from(table).where(eq(table.id, id))) as Record<string, unknown>[];
  if (!record) return null;
  const [college] = record.collegeId
    ? await db
        .select({ id: s.colleges.id, name: s.colleges.name, slug: s.colleges.slug })
        .from(s.colleges)
        .where(eq(s.colleges.id, record.collegeId as string))
    : [];
  const [parentCase] = record.caseId
    ? await db.select({ id: s.cases.id, title: s.cases.title }).from(s.cases).where(eq(s.cases.id, record.caseId as string))
    : [];
  return { record, college: college ?? null, parentCase: parentCase ?? null };
}

/** Timeline entries a coverage item can be linked to. */
export async function actionOptions(db: Database, collegeId: string) {
  return db
    .select({ id: s.institutionActions.id, title: s.institutionActions.title, actionDate: s.institutionActions.actionDate })
    .from(s.institutionActions)
    .where(eq(s.institutionActions.collegeId, collegeId))
    .orderBy(desc(s.institutionActions.actionDate));
}

// ---------------------------------------------------------------------------
// Cases (step 5b-2)
// ---------------------------------------------------------------------------

export async function listCases(db: Database) {
  const rows = await db
    .select({
      id: s.cases.id,
      title: s.cases.title,
      slug: s.cases.slug,
      status: s.cases.status,
      isDemo: s.cases.isDemo,
      events: sql<number>`(select count(*)::int from ${s.caseEvents} where ${s.caseEvents.caseId} = ${s.cases.id})`,
      colleges: sql<string>`(select string_agg(${s.colleges.name}, ', ' order by ${s.colleges.name}) from ${s.caseColleges} join ${s.colleges} on ${s.colleges.id} = ${s.caseColleges.collegeId} where ${s.caseColleges.caseId} = ${s.cases.id})`,
    })
    .from(s.cases)
    .orderBy(desc(s.cases.updatedAt));
  return rows;
}

/** A case with everything attached to it, in every status, for the case admin page. */
export async function getCaseAdmin(db: Database, id: string) {
  const [record] = await db.select().from(s.cases).where(eq(s.cases.id, id));
  if (!record) return null;
  const [colleges, events, corrections, coverage] = await Promise.all([
    db
      .select({ id: s.colleges.id, name: s.colleges.name, slug: s.colleges.slug })
      .from(s.caseColleges)
      .innerJoin(s.colleges, eq(s.caseColleges.collegeId, s.colleges.id))
      .where(eq(s.caseColleges.caseId, id))
      .orderBy(asc(s.colleges.name)),
    db
      .select()
      .from(s.caseEvents)
      .where(eq(s.caseEvents.caseId, id))
      .orderBy(asc(s.caseEvents.eventDate), asc(s.caseEvents.sequence), asc(s.caseEvents.createdAt)),
    db.select().from(s.corrections).where(eq(s.corrections.caseId, id)).orderBy(desc(s.corrections.correctionDate)),
    db
      .select({ id: s.collegeCoverage.id, summary: s.collegeCoverage.summary, status: s.collegeCoverage.status, publisher: s.sources.publisher })
      .from(s.collegeCoverage)
      .innerJoin(s.sources, eq(s.collegeCoverage.sourceId, s.sources.id))
      .where(eq(s.collegeCoverage.caseId, id)),
  ]);
  return { record, colleges, events, corrections, coverage };
}

export async function getCaseEvent(db: Database, id: string) {
  const [event] = await db.select().from(s.caseEvents).where(eq(s.caseEvents.id, id));
  if (!event) return null;
  const [caseRow] = await db.select({ id: s.cases.id, title: s.cases.title, slug: s.cases.slug }).from(s.cases).where(eq(s.cases.id, event.caseId));
  const siblings = await db
    .select({ id: s.caseEvents.id, eventDate: s.caseEvents.eventDate, eventType: s.caseEvents.eventType })
    .from(s.caseEvents)
    .where(eq(s.caseEvents.caseId, event.caseId))
    .orderBy(asc(s.caseEvents.eventDate), asc(s.caseEvents.sequence));
  return { event, case: caseRow, siblings };
}
