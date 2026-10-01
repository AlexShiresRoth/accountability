import "server-only";
// Researcher triage of discovered candidates. Accepting creates DRAFT records only; nothing is published here.

import { and, desc, eq } from "drizzle-orm";
import * as s from "@/db/schema";
import type { Database } from "@/db/types";
import type { CandidateStatus } from "@/lib/enums";
import type { MutationResult } from "./records";
import type { AcceptCandidateInput } from "./validation";

export async function listCandidates(db: Database, status: CandidateStatus = "new") {
  return db
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
      acceptedSourceId: s.candidateItems.acceptedSourceId,
    })
    .from(s.candidateItems)
    .leftJoin(s.colleges, eq(s.candidateItems.collegeId, s.colleges.id))
    .where(eq(s.candidateItems.status, status))
    .orderBy(desc(s.candidateItems.publishedAt), desc(s.candidateItems.createdAt));
}

export async function dismissCandidate(db: Database, id: string, actor: string): Promise<MutationResult> {
  const updated = await db
    .update(s.candidateItems)
    .set({ status: "dismissed", reviewedBy: actor, reviewedAt: new Date() })
    .where(and(eq(s.candidateItems.id, id), eq(s.candidateItems.status, "new")))
    .returning({ id: s.candidateItems.id });
  return updated.length ? { ok: true, value: undefined } : { ok: false, problems: ["This candidate has already been triaged."] };
}

/** Creates a draft source and draft coverage entry from a candidate, then marks it accepted. */
export async function acceptCandidate(
  db: Database,
  id: string,
  input: AcceptCandidateInput,
  actor: string,
  today = new Date().toISOString().slice(0, 10),
): Promise<MutationResult<{ sourceId: string; coverageId: string }>> {
  return db.transaction(async (tx) => {
    const [candidate] = await tx.select().from(s.candidateItems).where(eq(s.candidateItems.id, id)).for("update");
    if (!candidate) return { ok: false as const, problems: ["Candidate not found."] };
    if (candidate.status !== "new") return { ok: false as const, problems: ["This candidate has already been triaged."] };

    const [source] = await tx
      .insert(s.sources)
      .values({
        type: input.sourceType,
        publisher: input.publisher,
        title: input.title,
        url: candidate.url,
        publicationDate: input.publicationDate,
        retrievedAt: today,
        status: "draft",
        createdBy: actor,
      })
      .returning({ id: s.sources.id });

    const [coverage] = await tx
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
      .returning({ id: s.collegeCoverage.id });

    await tx
      .update(s.candidateItems)
      .set({ status: "accepted", acceptedSourceId: source.id, reviewedBy: actor, reviewedAt: new Date() })
      .where(eq(s.candidateItems.id, id));

    return { ok: true as const, value: { sourceId: source.id, coverageId: coverage.id } };
  });
}
