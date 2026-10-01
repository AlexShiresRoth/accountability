import "server-only";
// Admin reads. Unlike the public layer, these return records in every status.

import { asc, desc, eq, sql } from "drizzle-orm";
import * as s from "@/db/schema";
import type { Database } from "@/db/types";
import type { VerificationStatus } from "@/lib/enums";
import { reviewTables, type ReviewTableKey } from "./workflow";

export type StatusCounts = Record<VerificationStatus, number>;

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
  ];

  return { counts, inbox, recent, awaiting };
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
  const statistics = await db.select().from(s.crimeStatistics).where(eq(s.crimeStatistics.cleryReportId, id));
  const footnotes = await db
    .select()
    .from(s.statisticFootnotes)
    .where(eq(s.statisticFootnotes.cleryReportId, id))
    .orderBy(asc(s.statisticFootnotes.createdAt));
  const links = await db
    .select({ footnoteId: s.statisticFootnoteLinks.footnoteId, statisticId: s.statisticFootnoteLinks.crimeStatisticId })
    .from(s.statisticFootnoteLinks)
    .where(eq(s.statisticFootnoteLinks.cleryReportId, id));
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
