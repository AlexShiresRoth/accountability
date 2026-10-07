import "server-only";
// Researcher triage of discovered candidates. Accepting creates DRAFT records only; nothing is published here.

import { and, asc, desc, eq, isNull, sql, type SQL } from "drizzle-orm";
import * as s from "@/db/schema";
import type { Database } from "@/db/types";
import { isGoogleNewsUrl } from "@/jobs/discovery/google-news";
import { candidateStatuses, type CandidateStatus } from "@/lib/enums";
import type { MutationResult } from "./records";
import type { AcceptCandidateInput } from "./validation";

export const INBOX_PAGE_SIZE = 25;

export type CandidatePage = Awaited<ReturnType<typeof listCandidates>>;

/** Which school's candidates: a college id, `null` for items no college was matched to, or undefined for all. */
export type CollegeFilter = string | null | undefined;

function inCollege(college: CollegeFilter): SQL | undefined {
  if (college === undefined) return undefined;
  return college === null ? isNull(s.candidateItems.collegeId) : eq(s.candidateItems.collegeId, college);
}

/**
 * One page of candidates in a status, newest first (undated last), with a stable tie-break so items
 * never shift between pages. The requested page is clamped to the last page.
 */
export async function listCandidates(
  db: Database,
  status: CandidateStatus = "new",
  page = 1,
  pageSize = INBOX_PAGE_SIZE,
  college?: CollegeFilter,
) {
  const where = and(eq(s.candidateItems.status, status), inCollege(college));
  const [{ total }] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(s.candidateItems)
    .where(where);
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, Math.floor(page) || 1), pageCount);

  const items = await db
    .select({
      id: s.candidateItems.id,
      url: s.candidateItems.url,
      title: s.candidateItems.title,
      publisher: s.candidateItems.publisher,
      publishedAt: s.candidateItems.publishedAt,
      snippet: s.candidateItems.snippet,
      suggestedTopic: s.candidateItems.suggestedTopic,
      status: s.candidateItems.status,
      reviewedBy: s.candidateItems.reviewedBy,
      collegeId: s.candidateItems.collegeId,
      collegeName: s.colleges.name,
      collegeSlug: s.colleges.slug,
      caseId: s.candidateItems.caseId,
      caseTitle: s.cases.title,
      acceptedSourceId: s.candidateItems.acceptedSourceId,
    })
    .from(s.candidateItems)
    .leftJoin(s.colleges, eq(s.candidateItems.collegeId, s.colleges.id))
    .leftJoin(s.cases, eq(s.candidateItems.caseId, s.cases.id))
    .where(where)
    .orderBy(sql`${s.candidateItems.publishedAt} desc nulls last`, desc(s.candidateItems.createdAt), asc(s.candidateItems.id))
    .limit(pageSize)
    .offset((current - 1) * pageSize);

  return { items, total, page: current, pageCount, pageSize };
}

/** Number of candidates in each status, for the inbox tabs. */
/** Candidates per status, optionally within one school. */
export async function candidateCounts(db: Database, college?: CollegeFilter): Promise<Record<CandidateStatus, number>> {
  const rows = await db
    .select({ status: s.candidateItems.status, n: sql<number>`count(*)::int` })
    .from(s.candidateItems)
    .where(inCollege(college))
    .groupBy(s.candidateItems.status);
  const counts = Object.fromEntries(candidateStatuses.map((st) => [st, 0])) as Record<CandidateStatus, number>;
  for (const r of rows) counts[r.status] = r.n;
  return counts;
}

/** Candidates in a status per college id (`null` = no college matched). */
export async function candidateCountsByCollege(db: Database, status: CandidateStatus): Promise<Map<string | null, number>> {
  const rows = await db
    .select({ collegeId: s.candidateItems.collegeId, n: sql<number>`count(*)::int` })
    .from(s.candidateItems)
    .where(eq(s.candidateItems.status, status))
    .groupBy(s.candidateItems.collegeId);
  return new Map(rows.map((r) => [r.collegeId, r.n]));
}

export async function dismissCandidate(db: Database, id: string, actor: string): Promise<MutationResult> {
  const updated = await db
    .update(s.candidateItems)
    .set({ status: "dismissed", reviewedBy: actor, reviewedAt: new Date() })
    .where(and(eq(s.candidateItems.id, id), eq(s.candidateItems.status, "new")))
    .returning({ id: s.candidateItems.id });
  return updated.length ? { ok: true, value: undefined } : { ok: false, problems: ["This candidate has already been triaged."] };
}

/** Creates a draft source (and, unless source-only, a draft coverage entry) from a candidate, then marks it accepted. */
export async function acceptCandidate(
  db: Database,
  id: string,
  input: AcceptCandidateInput,
  actor: string,
  today = new Date().toISOString().slice(0, 10),
): Promise<MutationResult<{ sourceId: string; coverageId: string | null }>> {
  return db.transaction(async (tx) => {
    const [candidate] = await tx.select().from(s.candidateItems).where(eq(s.candidateItems.id, id)).for("update");
    if (!candidate) return { ok: false as const, problems: ["Candidate not found."] };
    if (candidate.status !== "new") return { ok: false as const, problems: ["This candidate has already been triaged."] };

    // Provenance: a source must point at the publisher, never at an aggregator link.
    const url = input.articleUrl ?? candidate.url;
    if (isGoogleNewsUrl(url)) {
      return {
        ok: false as const,
        problems: ["This item was found via Google News. Open it, then paste the publisher's own article URL."],
      };
    }

    const [source] = await tx
      .insert(s.sources)
      .values({
        type: input.sourceType,
        publisher: input.publisher,
        title: input.title,
        url,
        publicationDate: input.publicationDate,
        retrievedAt: today,
        status: "draft",
        createdBy: actor,
      })
      .returning({ id: s.sources.id });

    const coverage =
      input.mode === "source_only"
        ? null
        : (
            await tx
              .insert(s.collegeCoverage)
              .values({
                collegeId: input.collegeId,
                sourceId: source.id,
                scope: input.scope,
                caseId: input.scope === "case" ? input.caseId : null,
                topic: input.topic,
                summary: input.summary,
                status: "draft",
                createdBy: actor,
              })
              .returning({ id: s.collegeCoverage.id })
          )[0];

    await tx
      .update(s.candidateItems)
      .set({ status: "accepted", acceptedSourceId: source.id, reviewedBy: actor, reviewedAt: new Date() })
      .where(eq(s.candidateItems.id, id));

    return { ok: true as const, value: { sourceId: source.id, coverageId: coverage?.id ?? null } };
  });
}
