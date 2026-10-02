// Public read layer. Public pages must get data ONLY through these functions (enforced by ESLint).
//
// Rules applied throughout:
// - Every reviewable table is filtered with isPublic() (verified or needs_update; demo data hidden in production).
// - Nested records are filtered independently: a public parent never exposes a non-public child.
// - A citation is shown only when its target record and its source are both public.
// - Columns are selected explicitly: researcher-only fields (internal notes, reviewer names) are never read.

import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import * as s from "@/db/schema";
import type {
  CaseEventType,
  CaseLocationContext,
  ConfidentialityLevel,
  CoverageScope,
  CoverageTopic,
  DatePrecision,
  InstitutionActionType,
  PolicyType,
  ResourceCategory,
  ResponseFindingKind,
  ResponseTopic,
  SourceType,
  VerificationStatus,
} from "@/lib/enums";
import { citationKey, type CitationTargetKind } from "@/lib/citations";
import { resolveStatistics, type ResolvedStatistic, type StatisticInput } from "@/lib/statistics";
import { inIds, isPublic, isUnderReview, isUnverified, type PublicContext } from "./visibility";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PublicSource = {
  id: string;
  type: SourceType;
  publisher: string;
  title: string;
  url: string | null;
  publicationDate: string | null;
  retrievedAt: string | null;
  archivedUrl: string | null;
  notes: string | null;
  isDemo: boolean;
  /** Admin preview only: the source isn't verified yet. */
  unverified: boolean;
};

export type PublicCitation = {
  id: string;
  pinpoint: string | null;
  excerpt: string | null;
  claim: string | null;
  source: PublicSource;
};

/** Citations keyed by `${kind}:${id}`. Use citationKey() to look them up. */
export type CitationIndex = Record<string, PublicCitation[]>;
export { citationKey, type CitationTargetKind };

/** `unverified` is only ever true in admin preview; public queries return only published records. */
type Flags = { underReview: boolean; unverified: boolean; isDemo: boolean };

export type PublicCollegeSummary = {
  id: string;
  slug: string;
  name: string;
  city: string | null;
  state: string | null;
} & Flags;

export type PublicCollege = PublicCollegeSummary & {
  enrollment: number | null;
  enrollmentNote: string | null;
  lastReviewedAt: string | null;
};

export type PublicCleryReport = { id: string; reportYear: number; title: string; source: PublicSource } & Flags;

export type PublicFootnote = {
  id: string;
  reportId: string;
  reportYear: number;
  marker: string | null;
  originalText: string;
  summary: string | null;
  page: string | null;
  /** Statistic ids (from this footnote's own report) the footnote applies to. Empty = report-wide note. */
  statisticIds: string[];
} & Flags;

export type PublicInstitutionAction = {
  id: string;
  actionDate: string;
  datePrecision: DatePrecision;
  actionType: InstitutionActionType;
  title: string;
  description: string;
} & Flags;

export type PublicResponse = {
  id: string;
  topic: ResponseTopic;
  findingKind: ResponseFindingKind;
  summary: string;
} & Flags;

export type PublicPolicy = {
  id: string;
  policyType: PolicyType;
  title: string;
  summary: string | null;
  effectiveDate: string | null;
} & Flags;

export type PublicResource = {
  id: string;
  category: ResourceCategory;
  confidentiality: ConfidentialityLevel;
  name: string;
  description: string | null;
  phone: string | null;
  url: string | null;
  hours: string | null;
  available247: boolean | null;
} & Flags;

export type PublicCoverage = {
  id: string;
  scope: CoverageScope;
  topic: CoverageTopic;
  summary: string;
  caseSlug: string | null;
  source: PublicSource;
} & Flags;

export type PublicCaseSummary = {
  id: string;
  slug: string;
  title: string;
  summary: string;
} & Flags;

export type PublicCorrection = { id: string; correctionDate: string; description: string } & Flags;

export type CollegeProfile = {
  college: PublicCollege;
  reports: PublicCleryReport[];
  statistics: ResolvedStatistic[];
  footnotes: PublicFootnote[];
  actions: PublicInstitutionAction[];
  responses: PublicResponse[];
  policies: PublicPolicy[];
  resources: PublicResource[];
  coverage: PublicCoverage[];
  cases: PublicCaseSummary[];
  corrections: PublicCorrection[];
  citations: CitationIndex;
};

export type PublicCaseEvent = {
  id: string;
  eventDate: string;
  datePrecision: DatePrecision;
  sequence: number;
  eventType: CaseEventType;
  description: string;
  supersedesEventId: string | null;
  /** Set when a later public event supersedes this one. */
  supersededByEventId: string | null;
} & Flags;

export type CaseDetail = {
  case: PublicCaseSummary & { locationContext: CaseLocationContext };
  colleges: PublicCollegeSummary[];
  events: PublicCaseEvent[];
  coverage: PublicCoverage[];
  corrections: PublicCorrection[];
  citations: CitationIndex;
};

// ---------------------------------------------------------------------------
// Column selections (explicit, so researcher-only fields are never read)
// ---------------------------------------------------------------------------

const sourceColumns = {
  id: s.sources.id,
  type: s.sources.type,
  publisher: s.sources.publisher,
  title: s.sources.title,
  url: s.sources.url,
  publicationDate: s.sources.publicationDate,
  retrievedAt: s.sources.retrievedAt,
  archivedUrl: s.sources.archivedUrl,
  notes: s.sources.notes,
  isDemo: s.sources.isDemo,
  unverified: sql<boolean>`${s.sources.status} not in ('verified', 'needs_update')`,
};

const collegeSummaryColumns = {
  id: s.colleges.id,
  slug: s.colleges.slug,
  name: s.colleges.name,
  city: s.colleges.city,
  state: s.colleges.state,
  status: s.colleges.status,
  isDemo: s.colleges.isDemo,
};

function flags<T extends { status: VerificationStatus; isDemo: boolean }>(row: T): Omit<T, "status"> & Flags {
  const { status, ...rest } = row;
  return { ...rest, underReview: isUnderReview(status), unverified: isUnverified(status) };
}

// ---------------------------------------------------------------------------
// Colleges
// ---------------------------------------------------------------------------

function escapeLike(value: string) {
  return value.replace(/[\\%_]/g, (c) => `\\${c}`);
}

/** Public colleges, optionally filtered by name or alias. */
export async function searchColleges(ctx: PublicContext, query?: string): Promise<PublicCollegeSummary[]> {
  const q = query?.trim();
  const match = q
    ? or(
        ilike(s.colleges.name, `%${escapeLike(q)}%`),
        sql`array_to_string(${s.colleges.aliases}, ' ') ilike ${`%${escapeLike(q)}%`}`,
      )
    : undefined;

  const rows = await ctx.db
    .select(collegeSummaryColumns)
    .from(s.colleges)
    .where(and(isPublic(s.colleges, ctx), match))
    .orderBy(asc(s.colleges.name));
  return rows.map(flags);
}

export async function getCollegeProfile(ctx: PublicContext, slug: string): Promise<CollegeProfile | null> {
  const { db } = ctx;
  const [collegeRow] = await db
    .select({
      ...collegeSummaryColumns,
      enrollment: s.colleges.enrollment,
      enrollmentNote: s.colleges.enrollmentNote,
      lastReviewedAt: s.colleges.lastReviewedAt,
    })
    .from(s.colleges)
    .where(and(eq(s.colleges.slug, slug), isPublic(s.colleges, ctx)));
  if (!collegeRow) return null;
  const college = flags(collegeRow);

  // Clery reports: the report and the source it was taken from must both be public.
  const reportRows = await db
    .select({
      id: s.cleryReports.id,
      reportYear: s.cleryReports.reportYear,
      title: s.cleryReports.title,
      status: s.cleryReports.status,
      isDemo: s.cleryReports.isDemo,
      source: sourceColumns,
    })
    .from(s.cleryReports)
    .innerJoin(s.sources, eq(s.cleryReports.sourceId, s.sources.id))
    .where(and(eq(s.cleryReports.collegeId, college.id), isPublic(s.cleryReports, ctx), isPublic(s.sources, ctx)))
    .orderBy(desc(s.cleryReports.reportYear));
  const reports = reportRows.map(flags);
  const reportIds = reports.map((r) => r.id);
  const reportYearById = new Map(reports.map((r) => [r.id, r.reportYear]));

  const statRows = await db
    .select({
      id: s.crimeStatistics.id,
      reportId: s.crimeStatistics.cleryReportId,
      calendarYear: s.crimeStatistics.calendarYear,
      offense: s.crimeStatistics.offense,
      geography: s.crimeStatistics.geography,
      count: s.crimeStatistics.count,
      unfoundedCount: s.crimeStatistics.unfoundedCount,
      status: s.crimeStatistics.status,
    })
    .from(s.crimeStatistics)
    .where(and(inIds(s.crimeStatistics.cleryReportId, reportIds), isPublic(s.crimeStatistics, ctx)));
  const statIds = statRows.map((r) => r.id);

  const footnoteRows = await db
    .select({
      id: s.statisticFootnotes.id,
      reportId: s.statisticFootnotes.cleryReportId,
      marker: s.statisticFootnotes.marker,
      originalText: s.statisticFootnotes.originalText,
      summary: s.statisticFootnotes.summary,
      page: s.statisticFootnotes.page,
      status: s.statisticFootnotes.status,
      isDemo: s.statisticFootnotes.isDemo,
    })
    .from(s.statisticFootnotes)
    .where(and(inIds(s.statisticFootnotes.cleryReportId, reportIds), isPublic(s.statisticFootnotes, ctx)));
  const footnoteIds = footnoteRows.map((f) => f.id);

  // Only links where both ends are public.
  const links = await db
    .select({ footnoteId: s.statisticFootnoteLinks.footnoteId, statisticId: s.statisticFootnoteLinks.crimeStatisticId })
    .from(s.statisticFootnoteLinks)
    .where(
      and(
        inIds(s.statisticFootnoteLinks.footnoteId, footnoteIds),
        inIds(s.statisticFootnoteLinks.crimeStatisticId, statIds),
      ),
    );

  const footnotesByStat = new Map<string, string[]>();
  const statsByFootnote = new Map<string, string[]>();
  for (const link of links) {
    footnotesByStat.set(link.statisticId, [...(footnotesByStat.get(link.statisticId) ?? []), link.footnoteId]);
    statsByFootnote.set(link.footnoteId, [...(statsByFootnote.get(link.footnoteId) ?? []), link.statisticId]);
  }

  const statistics = resolveStatistics(
    statRows.map(
      (r): StatisticInput => ({
        statisticId: r.id,
        reportId: r.reportId,
        reportYear: reportYearById.get(r.reportId)!,
        calendarYear: r.calendarYear,
        offense: r.offense,
        geography: r.geography,
        count: r.count,
        unfoundedCount: r.unfoundedCount,
        footnoteIds: footnotesByStat.get(r.id) ?? [],
        underReview: isUnderReview(r.status),
        unverified: isUnverified(r.status),
      }),
    ),
  );

  const footnotes: PublicFootnote[] = footnoteRows
    .map((f) => ({
      ...flags(f),
      reportYear: reportYearById.get(f.reportId)!,
      statisticIds: statsByFootnote.get(f.id) ?? [],
    }))
    .sort((a, b) => b.reportYear - a.reportYear || (a.marker ?? "").localeCompare(b.marker ?? ""));

  const [actionRows, responseRows, policyRows, resourceRows, caseRows, correctionRows, coverage] = await Promise.all([
    db
      .select({
        id: s.institutionActions.id,
        actionDate: s.institutionActions.actionDate,
        datePrecision: s.institutionActions.datePrecision,
        actionType: s.institutionActions.actionType,
        title: s.institutionActions.title,
        description: s.institutionActions.description,
        status: s.institutionActions.status,
        isDemo: s.institutionActions.isDemo,
      })
      .from(s.institutionActions)
      .where(and(eq(s.institutionActions.collegeId, college.id), isPublic(s.institutionActions, ctx)))
      .orderBy(asc(s.institutionActions.actionDate), asc(s.institutionActions.createdAt)),
    db
      .select({
        id: s.institutionalResponses.id,
        topic: s.institutionalResponses.topic,
        findingKind: s.institutionalResponses.findingKind,
        summary: s.institutionalResponses.summary,
        status: s.institutionalResponses.status,
        isDemo: s.institutionalResponses.isDemo,
      })
      .from(s.institutionalResponses)
      .where(and(eq(s.institutionalResponses.collegeId, college.id), isPublic(s.institutionalResponses, ctx)))
      .orderBy(asc(s.institutionalResponses.topic), asc(s.institutionalResponses.createdAt)),
    db
      .select({
        id: s.policies.id,
        policyType: s.policies.policyType,
        title: s.policies.title,
        summary: s.policies.summary,
        effectiveDate: s.policies.effectiveDate,
        status: s.policies.status,
        isDemo: s.policies.isDemo,
      })
      .from(s.policies)
      .where(and(eq(s.policies.collegeId, college.id), isPublic(s.policies, ctx)))
      .orderBy(asc(s.policies.policyType), asc(s.policies.title)),
    db
      .select({
        id: s.studentResources.id,
        category: s.studentResources.category,
        confidentiality: s.studentResources.confidentiality,
        name: s.studentResources.name,
        description: s.studentResources.description,
        phone: s.studentResources.phone,
        url: s.studentResources.url,
        hours: s.studentResources.hours,
        available247: s.studentResources.available247,
        status: s.studentResources.status,
        isDemo: s.studentResources.isDemo,
      })
      .from(s.studentResources)
      .where(and(eq(s.studentResources.collegeId, college.id), isPublic(s.studentResources, ctx)))
      .orderBy(asc(s.studentResources.category), asc(s.studentResources.sortOrder), asc(s.studentResources.name)),
    db
      .select({
        id: s.cases.id,
        slug: s.cases.slug,
        title: s.cases.title,
        summary: s.cases.summary,
        status: s.cases.status,
        isDemo: s.cases.isDemo,
      })
      .from(s.cases)
      .innerJoin(s.caseColleges, eq(s.caseColleges.caseId, s.cases.id))
      .where(and(eq(s.caseColleges.collegeId, college.id), isPublic(s.cases, ctx)))
      .orderBy(asc(s.cases.title)),
    publicCorrections(ctx, eq(s.corrections.collegeId, college.id)),
    publicCoverage(ctx, eq(s.collegeCoverage.collegeId, college.id)),
  ]);

  const actions = actionRows.map(flags);
  const responses = responseRows.map(flags);
  const policies = policyRows.map(flags);
  const resources = resourceRows.map(flags);

  const citations = await publicCitations(ctx, {
    college: [college.id],
    cleryReport: reportIds,
    crimeStatistic: statIds,
    statisticFootnote: footnoteIds,
    institutionAction: actions.map((a) => a.id),
    institutionalResponse: responses.map((r) => r.id),
    policy: policies.map((p) => p.id),
    studentResource: resources.map((r) => r.id),
    correction: correctionRows.map((c) => c.id),
  });

  return {
    college,
    reports,
    statistics,
    footnotes,
    actions,
    responses,
    policies,
    resources,
    coverage,
    cases: caseRows.map(flags),
    corrections: correctionRows,
    citations,
  };
}

// ---------------------------------------------------------------------------
// Cases
// ---------------------------------------------------------------------------

export async function getCase(ctx: PublicContext, slug: string): Promise<CaseDetail | null> {
  const { db } = ctx;
  const [caseRow] = await db
    .select({
      id: s.cases.id,
      slug: s.cases.slug,
      title: s.cases.title,
      summary: s.cases.summary,
      locationContext: s.cases.locationContext,
      status: s.cases.status,
      isDemo: s.cases.isDemo,
    })
    .from(s.cases)
    .where(and(eq(s.cases.slug, slug), isPublic(s.cases, ctx)));
  if (!caseRow) return null;

  const [collegeRows, eventRows, coverage, corrections] = await Promise.all([
    db
      .select(collegeSummaryColumns)
      .from(s.colleges)
      .innerJoin(s.caseColleges, eq(s.caseColleges.collegeId, s.colleges.id))
      .where(and(eq(s.caseColleges.caseId, caseRow.id), isPublic(s.colleges, ctx)))
      .orderBy(asc(s.colleges.name)),
    db
      .select({
        id: s.caseEvents.id,
        eventDate: s.caseEvents.eventDate,
        datePrecision: s.caseEvents.datePrecision,
        sequence: s.caseEvents.sequence,
        eventType: s.caseEvents.eventType,
        description: s.caseEvents.description,
        supersedesEventId: s.caseEvents.supersedesEventId,
        status: s.caseEvents.status,
        isDemo: s.caseEvents.isDemo,
      })
      .from(s.caseEvents)
      .where(and(eq(s.caseEvents.caseId, caseRow.id), isPublic(s.caseEvents, ctx)))
      .orderBy(asc(s.caseEvents.eventDate), asc(s.caseEvents.sequence), asc(s.caseEvents.createdAt)),
    publicCoverage(ctx, eq(s.collegeCoverage.caseId, caseRow.id)),
    publicCorrections(ctx, eq(s.corrections.caseId, caseRow.id)),
  ]);

  const publicEventIds = new Set(eventRows.map((e) => e.id));
  const supersededBy = new Map<string, string>();
  for (const e of eventRows) {
    if (e.supersedesEventId && publicEventIds.has(e.supersedesEventId)) supersededBy.set(e.supersedesEventId, e.id);
  }
  const events: PublicCaseEvent[] = eventRows.map((e) => ({
    ...flags(e),
    // Don't point at events the public can't see.
    supersedesEventId: e.supersedesEventId && publicEventIds.has(e.supersedesEventId) ? e.supersedesEventId : null,
    supersededByEventId: supersededBy.get(e.id) ?? null,
  }));

  const citations = await publicCitations(ctx, {
    case: [caseRow.id],
    caseEvent: events.map((e) => e.id),
    correction: corrections.map((c) => c.id),
  });

  return {
    case: flags(caseRow),
    colleges: collegeRows.map(flags),
    events,
    coverage,
    corrections,
    citations,
  };
}

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

export async function listPublicSources(ctx: PublicContext): Promise<PublicSource[]> {
  return ctx.db
    .select(sourceColumns)
    .from(s.sources)
    .where(isPublic(s.sources, ctx))
    .orderBy(asc(s.sources.type), desc(s.sources.publicationDate), asc(s.sources.title));
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

async function publicCorrections(ctx: PublicContext, target: ReturnType<typeof eq>): Promise<PublicCorrection[]> {
  const rows = await ctx.db
    .select({
      id: s.corrections.id,
      correctionDate: s.corrections.correctionDate,
      description: s.corrections.description,
      status: s.corrections.status,
      isDemo: s.corrections.isDemo,
    })
    .from(s.corrections)
    .where(and(target, isPublic(s.corrections, ctx)))
    .orderBy(desc(s.corrections.correctionDate));
  return rows.map(flags);
}

/** Coverage whose source is public, and, for case-scoped coverage, whose case is public. */
async function publicCoverage(ctx: PublicContext, target: ReturnType<typeof eq>): Promise<PublicCoverage[]> {
  const rows = await ctx.db
    .select({
      id: s.collegeCoverage.id,
      scope: s.collegeCoverage.scope,
      topic: s.collegeCoverage.topic,
      summary: s.collegeCoverage.summary,
      status: s.collegeCoverage.status,
      isDemo: s.collegeCoverage.isDemo,
      caseSlug: s.cases.slug,
      source: sourceColumns,
    })
    .from(s.collegeCoverage)
    .innerJoin(s.sources, eq(s.collegeCoverage.sourceId, s.sources.id))
    .leftJoin(s.cases, eq(s.collegeCoverage.caseId, s.cases.id))
    .where(
      and(
        target,
        isPublic(s.collegeCoverage, ctx),
        isPublic(s.sources, ctx),
        or(eq(s.collegeCoverage.scope, "institutional"), isPublic(s.cases, ctx)),
      ),
    )
    .orderBy(desc(s.sources.publicationDate), desc(s.collegeCoverage.createdAt));
  return rows.map(flags);
}

const citationColumnByKind = {
  college: s.citations.collegeId,
  cleryReport: s.citations.cleryReportId,
  crimeStatistic: s.citations.crimeStatisticId,
  statisticFootnote: s.citations.statisticFootnoteId,
  case: s.citations.caseId,
  caseEvent: s.citations.caseEventId,
  institutionAction: s.citations.institutionActionId,
  institutionalResponse: s.citations.institutionalResponseId,
  policy: s.citations.policyId,
  studentResource: s.citations.studentResourceId,
  correction: s.citations.correctionId,
} as const satisfies Record<CitationTargetKind, unknown>;

/**
 * Citations for records the caller has ALREADY established are public.
 * Only citations whose source is public are returned.
 */
async function publicCitations(
  ctx: PublicContext,
  targets: Partial<Record<CitationTargetKind, string[]>>,
): Promise<CitationIndex> {
  const entries = Object.entries(targets).filter(([, ids]) => ids.length) as [CitationTargetKind, string[]][];
  if (!entries.length) return {};

  const rows = await ctx.db
    .select({
      id: s.citations.id,
      pinpoint: s.citations.pinpoint,
      excerpt: s.citations.excerpt,
      claim: s.citations.claim,
      targets: {
        college: s.citations.collegeId,
        cleryReport: s.citations.cleryReportId,
        crimeStatistic: s.citations.crimeStatisticId,
        statisticFootnote: s.citations.statisticFootnoteId,
        case: s.citations.caseId,
        caseEvent: s.citations.caseEventId,
        institutionAction: s.citations.institutionActionId,
        institutionalResponse: s.citations.institutionalResponseId,
        policy: s.citations.policyId,
        studentResource: s.citations.studentResourceId,
        correction: s.citations.correctionId,
      },
      source: sourceColumns,
    })
    .from(s.citations)
    .innerJoin(s.sources, eq(s.citations.sourceId, s.sources.id))
    .where(
      and(isPublic(s.sources, ctx), or(...entries.map(([kind, ids]) => inIds(citationColumnByKind[kind], ids)))),
    )
    .orderBy(asc(s.citations.createdAt));

  const requested = new Map(entries.map(([kind, ids]) => [kind, new Set(ids)]));
  const index: CitationIndex = {};
  for (const row of rows) {
    const target = (Object.entries(row.targets) as [CitationTargetKind, string | null][]).find(([, v]) => v !== null);
    if (!target || !requested.get(target[0])?.has(target[1]!)) continue;
    const key = citationKey(target[0], target[1]!);
    (index[key] ??= []).push({ id: row.id, pinpoint: row.pinpoint, excerpt: row.excerpt, claim: row.claim, source: row.source });
  }
  return index;
}
