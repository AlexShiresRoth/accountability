import "server-only";
// AI triage of the inbox. For each new, untriaged item: resolve a Google News link to the publisher's URL, read
// the article where possible, and ask the model whether it is relevant. Items judged irrelevant are dismissed
// (restorable from the Dismissed tab); everything else stays in the inbox with the verdict and reason shown.
// Nothing is accepted, verified or published here.

import { and, desc, eq, inArray, isNull } from "drizzle-orm";
import * as s from "@/db/schema";
import type { Database } from "@/db/types";
import { isCourtListenerUrl } from "@/jobs/discovery/courtlistener";
import { isGoogleNewsUrl } from "@/jobs/discovery/google-news";
import { resolveGoogleNewsUrl } from "@/jobs/discovery/google-news-resolve";
import { USER_AGENT } from "@/jobs/discovery/run";
import { classifyCandidate, type TriageInput, type TriageResult } from "@/lib/ai/triage";
import { extractArticleText, isFetchableArticleUrl, MIN_ARTICLE_CHARS } from "@/lib/ai/summary";
import type { TriageVerdict } from "@/lib/enums";
import { silentLogger, type Logger } from "@/lib/log";

/** Recorded as reviewedBy on items triage dismisses, so they can be told apart from a researcher's dismissals. */
export const triageActor = (model: string) => `AI triage (${model})`;
export const isTriageActor = (reviewedBy: string | null) => Boolean(reviewedBy?.startsWith("AI triage"));

// Google's resolver endpoints are undocumented; keep requests to them spaced out.
const GOOGLE_INTERVAL_MS = 1_000;

export type TriageDeps = {
  classify?: (input: TriageInput) => Promise<TriageResult>;
  resolveGoogle?: (url: string) => Promise<string | null>;
  /** Article body text for a URL, or null if it can't be read. */
  readArticle?: (url: string) => Promise<string | null>;
  sleep?: (ms: number) => Promise<void>;
  log?: Logger;
  now?: () => number;
};

export type TriageOptions = {
  /** Most items to look at in this run. */
  limit?: number;
  /** Stop starting new items after this many ms (a run must finish inside the function time limit). */
  budgetMs?: number;
  /** Classify and report without writing anything. */
  dryRun?: boolean;
  collegeId?: string;
};

export type TriagedItem = {
  id: string;
  title: string | null;
  college: string | null;
  url: string;
  resolvedUrl: string | null;
  verdict: TriageVerdict | null;
  reason: string;
  dismissed: boolean;
  /** Why an irrelevant verdict did not dismiss the item, if it didn't. */
  kept?: string;
};

export type TriageReport = { items: TriagedItem[]; dismissed: number; failed: number; remaining: boolean; model: string | null };

export async function readArticleText(url: string): Promise<string | null> {
  if (!isFetchableArticleUrl(url) || isGoogleNewsUrl(url)) return null;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
      redirect: "follow",
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) return null;
    const text = extractArticleText(await res.text());
    return text.length >= MIN_ARTICLE_CHARS ? text : null;
  } catch {
    return null;
  }
}

/**
 * Why an item must stay with a researcher even if judged irrelevant: court dockets are leads the model can't
 * judge from a caption, and items matched to a case were found by that case's own search terms.
 */
function keepReason(item: { url: string; caseId: string | null }): string | undefined {
  if (isCourtListenerUrl(item.url)) return "court docket";
  if (item.caseId) return "possible case update";
  return undefined;
}

export async function triageInbox(db: Database, opts: TriageOptions = {}, deps: TriageDeps = {}): Promise<TriageReport> {
  const {
    classify = (input) => classifyCandidate(input),
    resolveGoogle = (url) => resolveGoogleNewsUrl(url),
    readArticle = readArticleText,
    sleep = (ms) => new Promise((r) => setTimeout(r, ms)),
    log = silentLogger,
    now = Date.now,
  } = deps;
  const { limit = 50, budgetMs = Infinity, dryRun = false } = opts;
  const started = now();

  const rows = await db
    .select({
      id: s.candidateItems.id,
      url: s.candidateItems.url,
      resolvedUrl: s.candidateItems.resolvedUrl,
      title: s.candidateItems.title,
      publisher: s.candidateItems.publisher,
      snippet: s.candidateItems.snippet,
      caseId: s.candidateItems.caseId,
      college: s.colleges.name,
    })
    .from(s.candidateItems)
    .leftJoin(s.colleges, eq(s.candidateItems.collegeId, s.colleges.id))
    .where(
      and(
        eq(s.candidateItems.status, "new"),
        isNull(s.candidateItems.aiTriagedAt),
        opts.collegeId ? eq(s.candidateItems.collegeId, opts.collegeId) : undefined,
      ),
    )
    .orderBy(desc(s.candidateItems.createdAt))
    .limit(limit + 1);

  const report: TriageReport = { items: [], dismissed: 0, failed: 0, remaining: rows.length > limit, model: null };
  let googleRequests = 0;

  for (const row of rows.slice(0, limit)) {
    if (now() - started > budgetMs) {
      report.remaining = true;
      break;
    }

    let resolvedUrl = row.resolvedUrl;
    if (!resolvedUrl && isGoogleNewsUrl(row.url)) {
      if (googleRequests++ > 0) await sleep(GOOGLE_INTERVAL_MS);
      resolvedUrl = await resolveGoogle(row.url);
    }
    const articleUrl = resolvedUrl ?? row.url;
    const text = isCourtListenerUrl(articleUrl) ? null : await readArticle(articleUrl);

    const result = await classify({ college: row.college, title: row.title, publisher: row.publisher, snippet: row.snippet, text });
    if (!result.ok) {
      report.failed++;
      report.items.push({ id: row.id, title: row.title, college: row.college, url: row.url, resolvedUrl, verdict: null, reason: result.reason, dismissed: false });
      log("warn", "triage.failed", { candidateId: row.id, reason: result.reason });
      // Still save a resolved link: it spares the researcher a step even when classification failed.
      if (!dryRun && resolvedUrl && !row.resolvedUrl) {
        await db.update(s.candidateItems).set({ resolvedUrl }).where(eq(s.candidateItems.id, row.id));
      }
      continue;
    }

    report.model = result.model;
    const kept = result.verdict === "irrelevant" ? keepReason(row) : undefined;
    const dismiss = result.verdict === "irrelevant" && !kept;
    if (!dryRun) {
      await db
        .update(s.candidateItems)
        .set({
          resolvedUrl,
          aiVerdict: result.verdict,
          aiReason: result.reason,
          aiModel: result.model,
          aiTriagedAt: new Date(),
          ...(dismiss && { status: "dismissed" as const, reviewedBy: triageActor(result.model), reviewedAt: new Date() }),
        })
        // A researcher may have triaged the item while the model was thinking; leave their decision alone.
        .where(and(eq(s.candidateItems.id, row.id), eq(s.candidateItems.status, "new")));
    }
    if (dismiss) report.dismissed++;
    report.items.push({
      id: row.id,
      title: row.title,
      college: row.college,
      url: row.url,
      resolvedUrl,
      verdict: result.verdict,
      reason: result.reason,
      dismissed: dismiss,
      ...(kept && { kept }),
    });
    log("info", "triage.item", { candidateId: row.id, verdict: result.verdict, dismissed: dismiss, dryRun });
  }
  return report;
}

export type EvaluationRow = { id: string; title: string | null; human: "accepted" | "dismissed"; verdict: TriageVerdict | null; reason: string };

/**
 * Runs the classifier on items researchers have already triaged, without writing anything, to show how often it
 * agrees with them. The number that matters: accepted items the model would have called irrelevant.
 */
export async function evaluateTriage(db: Database, { limit = 50 }: { limit?: number } = {}, deps: TriageDeps = {}) {
  const { classify = (input) => classifyCandidate(input), readArticle = readArticleText, resolveGoogle = (url) => resolveGoogleNewsUrl(url) } = deps;
  const rows = await db
    .select({
      id: s.candidateItems.id,
      url: s.candidateItems.url,
      resolvedUrl: s.candidateItems.resolvedUrl,
      title: s.candidateItems.title,
      publisher: s.candidateItems.publisher,
      snippet: s.candidateItems.snippet,
      status: s.candidateItems.status,
      reviewedBy: s.candidateItems.reviewedBy,
      college: s.colleges.name,
      sourceUrl: s.sources.url,
    })
    .from(s.candidateItems)
    .leftJoin(s.colleges, eq(s.candidateItems.collegeId, s.colleges.id))
    .leftJoin(s.sources, eq(s.candidateItems.acceptedSourceId, s.sources.id))
    .where(inArray(s.candidateItems.status, ["accepted", "dismissed"]))
    .orderBy(desc(s.candidateItems.reviewedAt))
    .limit(limit * 4);

  // Researcher decisions only (not earlier AI dismissals), and an even mix so a long run of dismissals can't hide misses.
  const human = rows.filter((r) => !isTriageActor(r.reviewedBy) && !isCourtListenerUrl(r.url));
  const accepted = human.filter((r) => r.status === "accepted").slice(0, Math.ceil(limit / 2));
  const dismissed = human.filter((r) => r.status === "dismissed").slice(0, limit - accepted.length);

  const out: EvaluationRow[] = [];
  for (const r of [...accepted, ...dismissed]) {
    // Accepted items carry the publisher URL the researcher pasted, on their source.
    const url = r.sourceUrl ?? r.resolvedUrl ?? (isGoogleNewsUrl(r.url) ? await resolveGoogle(r.url) : r.url) ?? r.url;
    const text = await readArticle(url);
    const result = await classify({ college: r.college, title: r.title, publisher: r.publisher, snippet: r.snippet, text });
    out.push({
      id: r.id,
      title: r.title,
      human: r.status as "accepted" | "dismissed",
      verdict: result.ok ? result.verdict : null,
      reason: result.reason,
    });
  }
  const tally = (h: "accepted" | "dismissed", v: TriageVerdict | null) => out.filter((r) => r.human === h && r.verdict === v).length;
  return {
    rows: out,
    /** Accepted by a researcher, but the model would have dismissed it: the failure that matters. */
    missed: out.filter((r) => r.human === "accepted" && r.verdict === "irrelevant"),
    summary: {
      accepted: { total: accepted.length, relevant: tally("accepted", "relevant"), unsure: tally("accepted", "unsure"), irrelevant: tally("accepted", "irrelevant") },
      dismissed: { total: dismissed.length, relevant: tally("dismissed", "relevant"), unsure: tally("dismissed", "unsure"), irrelevant: tally("dismissed", "irrelevant") },
    },
  };
}
