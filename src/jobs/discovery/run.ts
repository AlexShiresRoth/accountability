// Discovery job: finds candidate coverage for researcher triage.
// Writes ONLY candidate_item and ingestion_run. Never creates sources, coverage, or any public record.

import * as s from "@/db/schema";
import type { Database } from "@/db/types";
import type { CoverageTopic } from "@/lib/enums";
import { silentLogger, type Logger } from "@/lib/log";
import { and, eq, inArray, isNull, ne, sql } from "drizzle-orm";
import { courtListenerUrl, parseCourtListenerPage } from "./courtlistener";
import { parseFeed } from "./feed-parser";
import { fetchGdelt } from "./gdelt";
import { googleNewsUrl, headlineKey, parseGoogleNews } from "./google-news";
import { isRelevant, suggestTopic } from "./relevance";
import {
  feeds as defaultFeeds,
  gdeltQueries as defaultQueries,
  type CollegeQuery,
  type FeedSource,
} from "./sources";
import { searchTermGroups } from "./terms";
import { canonicalizeUrl } from "./urls";

export type FetchText = (
  url: string,
) => Promise<{ status: number; body: string }>;

export type DiscoveryOptions = {
  db: Database;
  fetchText?: FetchText;
  sleep?: (ms: number) => Promise<void>;
  /** GDELT lookback window, e.g. "1d" for scheduled runs, "3months" for a backfill. */
  gdeltTimespan?: string;
  /** Google News lookback in days, e.g. 2 for scheduled runs, 90 for a backfill. */
  googleNewsDays?: number;
  feeds?: FeedSource[];
  /** Exact-name queries used for GDELT and Google News. */
  gdeltQueries?: CollegeQuery[];
  sources?: { gdelt?: boolean; googleNews?: boolean; courtDockets?: boolean; caseNews?: boolean };
  /** Court-docket lookback in days. Defaults to googleNewsDays; dockets stay relevant far longer than news. */
  courtDays?: number;
  /** Result pages to read per institution's docket search (about 20 dockets a page). 1 for scheduled runs. */
  courtPages?: number;
  /** Case-specific news searches. Defaults to every non-rejected case with search terms (see loadCaseQueries). */
  caseQueries?: CaseQuery[];
  /** "Today", for the court-docket lookback window (injectable for tests). */
  now?: Date;
  /** Recorded on the run: "cron", "cli" or "test". */
  triggeredBy?: string;
  /** Structured progress logging. Silent by default. */
  log?: Logger;
};

export type RunOutcome = "ok" | "partial" | "failed";

/** A case-specific news search: the case's own terms, together with its school's names. */
export type CaseQuery = {
  caseId: string;
  /** For labels and logs. */
  title: string;
  /** Where results are filed: the case's first school that this run covers. */
  collegeSlug: string;
  names: string[];
  terms: string[];
};

/** Stored as ingestion_run.summary. */
export type RunSummary = {
  bySource: Record<string, { found: number; relevant: number }>;
  duplicateHeadlines: number;
  refiled: number;
  droppedNoHeadlineName: number;
  /** Inbox items marked as a possible update to a case (new from case searches, or matched to existing ones). */
  caseUpdates?: number;
  errors: string[];
};

export type DiscoveryResult = {
  runId: string;
  outcome: RunOutcome;
  durationMs: number;
  found: number;
  created: number;
  errors: string[];
  bySource: Record<string, { found: number; relevant: number }>;
  /** Google News items skipped because the same headline was already found via another source. */
  duplicateHeadlines: number;
  /** Search results re-filed because the headline names a different tracked institution. */
  refiled: number;
  /** Search results dropped because their headline doesn't name an institution configured with headlineMustName. */
  droppedNoHeadlineName: number;
  /** Inbox items marked as a possible update to a case. */
  caseUpdates: number;
};

type Candidate = {
  url: string;
  title: string | null;
  publisher: string | null;
  publishedAt: Date | null;
  snippet: string | null;
  collegeId: string;
  caseId?: string | null;
  suggestedTopic: CoverageTopic;
  via: "feed" | "gdelt" | "google_news" | "court" | "case_news";
};

export const USER_AGENT =
  "CampusAccountabilityBot/0.1 (public-interest research; discovery of news coverage)";

export const defaultFetchText: FetchText = async (url) => {
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    signal: AbortSignal.timeout(20_000),
  });
  return { status: res.status, body: await res.text() };
};

const GDELT_INTERVAL_MS = 6_000;
const GOOGLE_NEWS_INTERVAL_MS = 2_000;
// CourtListener's anonymous API allows about five searches a minute: on 2026-10-05 the sixth search was refused
// (HTTP 429) at both 2 s and 8 s spacing. With more institutions, an API token would lift this.
const COURTLISTENER_INTERVAL_MS = 15_000;

/**
 * Runs discovery and records it in ingestion_run: outcome, duration, per-source summary, and errors.
 * A run that throws is recorded as "failed" before the error is re-thrown.
 */
export async function runDiscovery(
  opts: DiscoveryOptions,
): Promise<DiscoveryResult> {
  const { db, triggeredBy = "cli" } = opts;
  const log = opts.log ?? silentLogger;
  const started = Date.now();
  const [run] = await db
    .insert(s.ingestionRuns)
    .values({ job: "discovery", triggeredBy })
    .returning({ id: s.ingestionRuns.id });
  log("info", "run.started", { runId: run.id, triggeredBy });

  try {
    const r = await discover(opts, run.id, log);
    const durationMs = Date.now() - started;
    const outcome: RunOutcome = r.errors.length ? "partial" : "ok";
    const summary: RunSummary = {
      bySource: r.bySource,
      duplicateHeadlines: r.duplicateHeadlines,
      refiled: r.refiled,
      droppedNoHeadlineName: r.droppedNoHeadlineName,
      caseUpdates: r.caseUpdates,
      errors: r.errors,
    };
    await db
      .update(s.ingestionRuns)
      .set({
        finishedAt: new Date(),
        itemsFound: r.found,
        itemsCreated: r.created,
        error: r.errors.length ? r.errors.join("\n") : null,
        outcome,
        durationMs,
        summary,
      })
      .where(eq(s.ingestionRuns.id, run.id));
    for (const [source, counts] of Object.entries(r.bySource)) {
      log("info", "source.done", { runId: run.id, source, ...counts });
    }
    log(outcome === "ok" ? "info" : "warn", "run.finished", {
      runId: run.id,
      outcome,
      durationMs,
      found: r.found,
      created: r.created,
      duplicateHeadlines: r.duplicateHeadlines,
      refiled: r.refiled,
      droppedNoHeadlineName: r.droppedNoHeadlineName,
      caseUpdates: r.caseUpdates,
      errorCount: r.errors.length,
    });
    return { runId: run.id, outcome, durationMs, ...r };
  } catch (err) {
    const durationMs = Date.now() - started;
    log("error", "run.failed", {
      runId: run.id,
      durationMs,
      error: message(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
    await db
      .update(s.ingestionRuns)
      .set({ finishedAt: new Date(), outcome: "failed", durationMs, error: `Run failed: ${message(err)}` })
      .where(eq(s.ingestionRuns.id, run.id))
      .catch(() => {}); // the database may be what failed; the log line above still records it
    throw err;
  }
}

async function discover(
  opts: DiscoveryOptions,
  runId: string,
  log: Logger,
): Promise<Omit<DiscoveryResult, "runId" | "outcome" | "durationMs">> {
  const {
    db,
    fetchText = defaultFetchText,
    sleep = (ms) => new Promise((r) => setTimeout(r, ms)),
    gdeltTimespan = "1d",
    feeds = defaultFeeds,
    gdeltQueries = defaultQueries,
    googleNewsDays = 2,
    sources = {},
  } = opts;
  const useGdelt = sources.gdelt ?? true;
  const useGoogleNews = sources.googleNews ?? true;
  const useCourtDockets = sources.courtDockets ?? true;
  const now = opts.now ?? new Date();

  const errors: string[] = [];
  const fail = (label: string, err: unknown) => {
    errors.push(`${label}: ${message(err)}`);
    log("warn", "source.failed", { runId, source: label, error: message(err) });
  };
  const bySource: DiscoveryResult["bySource"] = {};
  const candidates: Candidate[] = [];

  const slugs = [
    ...new Set([
      ...feeds.map((f) => f.collegeSlug),
      ...gdeltQueries.map((q) => q.collegeSlug),
    ]),
  ];
  const collegeRows = slugs.length
    ? await db
        .select({ id: s.colleges.id, slug: s.colleges.slug })
        .from(s.colleges)
        .where(inArray(s.colleges.slug, slugs))
    : [];
  const collegeIdBySlug = new Map(collegeRows.map((c) => [c.slug, c.id]));
  const collegeId = (slug: string) => {
    const id = collegeIdBySlug.get(slug);
    if (!id) fail(`college "${slug}"`, "not found; skipped its sources");
    return id;
  };

  for (const feed of feeds) {
    const label = `feed: ${feed.publisher}`;
    const cid = collegeId(feed.collegeSlug);
    if (!cid) continue;
    try {
      const { status, body } = await fetchText(feed.url);
      if (status !== 200) throw new Error(`HTTP ${status}`);
      const items = parseFeed(body);
      const relevant = items.filter(
        (i) => i.url && isRelevant(`${i.title ?? ""} ${i.snippet ?? ""}`),
      );
      bySource[label] = { found: items.length, relevant: relevant.length };
      for (const i of relevant) {
        candidates.push({
          url: i.url!,
          title: i.title,
          publisher: feed.publisher,
          publishedAt: i.publishedAt,
          snippet: i.snippet,
          collegeId: cid,
          suggestedTopic: suggestTopic(`${i.title ?? ""} ${i.snippet ?? ""}`),
          via: "feed",
        });
      }
    } catch (err) {
      fail(label, err);
    }
  }

  // GDELT failures (rate limits, refused or timed-out connections) are service-wide, and each costs two attempts
  // and a 10 s retry wait. After the first failure, skip GDELT for the rest of the run.
  let gdeltRequests = 0;
  let gdeltDown = false;
  gdelt: for (const query of useGdelt ? gdeltQueries : []) {
    const label = `gdelt: ${query.names.join(" / ")}`;
    if (gdeltDown) {
      fail(label, "skipped: GDELT failed earlier in this run");
      continue;
    }
    const cid = collegeId(query.collegeSlug);
    if (!cid) continue;
    for (const terms of searchTermGroups) {
      if (gdeltRequests++ > 0) await sleep(GDELT_INTERVAL_MS);
      try {
        const articles = await fetchGdelt(
          fetchText,
          sleep,
          query.names,
          terms,
          gdeltTimespan,
        );
        addCount(bySource, label, articles.length);
        for (const a of articles) {
          candidates.push({
            url: a.url,
            title: a.title,
            publisher: a.domain,
            publishedAt: a.seenAt,
            snippet: null,
            collegeId: cid,
            suggestedTopic: suggestTopic(a.title ?? ""),
            via: "gdelt",
          });
        }
      } catch (err) {
        fail(label, err);
        gdeltDown = true;
        continue gdelt;
      }
    }
  }

  let googleRequests = 0;
  for (const query of useGoogleNews ? gdeltQueries : []) {
    const label = `google news: ${query.names.join(" / ")}`;
    const cid = collegeId(query.collegeSlug);
    if (!cid) continue;
    for (const terms of searchTermGroups) {
      if (googleRequests++ > 0) await sleep(GOOGLE_NEWS_INTERVAL_MS);
      try {
        const { status, body } = await fetchText(
          googleNewsUrl(query.names, terms, googleNewsDays),
        );
        if (status !== 200) throw new Error(`HTTP ${status}`);
        const items = parseGoogleNews(body);
        addCount(bySource, label, items.length);
        for (const i of items) {
          candidates.push({
            url: i.url,
            title: i.title,
            publisher: i.publisher,
            publishedAt: i.publishedAt,
            snippet: null,
            collegeId: cid,
            suggestedTopic: suggestTopic(i.title ?? ""),
            via: "google_news",
          });
        }
      } catch (err) {
        fail(label, err);
      }
    }
  }

  // Case-specific searches: each tracked case's own terms with its school's names, to catch updates on known cases.
  const caseQueries = (sources.caseNews ?? useGoogleNews) ? (opts.caseQueries ?? (await loadCaseQueries(db, gdeltQueries))) : [];
  for (const query of caseQueries) {
    const label = `case news: ${query.title}`;
    const cid = collegeIdBySlug.get(query.collegeSlug);
    if (!cid || !query.terms.length) continue;
    if (googleRequests++ > 0) await sleep(GOOGLE_NEWS_INTERVAL_MS);
    try {
      const { status, body } = await fetchText(
        googleNewsUrl(query.names, query.terms.map((t) => `"${t.replace(/"/g, "")}"`), googleNewsDays),
      );
      if (status !== 200) throw new Error(`HTTP ${status}`);
      const items = parseGoogleNews(body);
      addCount(bySource, label, items.length);
      for (const i of items) {
        candidates.push({
          url: i.url,
          title: i.title,
          publisher: i.publisher,
          publishedAt: i.publishedAt,
          snippet: null,
          collegeId: cid,
          caseId: query.caseId,
          suggestedTopic: suggestTopic(i.title ?? ""),
          via: "case_news",
        });
      }
    } catch (err) {
      fail(label, err);
    }
  }

  // Federal court dockets naming the institution as a party (case leads).
  const since = new Date(
    now.getTime() - (opts.courtDays ?? googleNewsDays) * 86_400_000,
  )
    .toISOString()
    .slice(0, 10);
  let courtRequests = 0;
  for (const query of useCourtDockets ? gdeltQueries : []) {
    const label = `court dockets: ${query.courtNames.join(" / ")}`;
    const cid = collegeId(query.collegeSlug);
    if (!cid) continue;
    try {
      const leads = [];
      let url: string | null = courtListenerUrl(query.courtNames, since);
      for (let page = 0; url && page < (opts.courtPages ?? 1); page++) {
        if (courtRequests++ > 0) await sleep(COURTLISTENER_INTERVAL_MS);
        const { status, body } = await fetchText(url);
        if (status !== 200) throw new Error(`HTTP ${status}`);
        const parsed = parseCourtListenerPage(body);
        leads.push(...parsed.leads);
        url = parsed.next;
      }
      addCount(bySource, label, leads.length);
      for (const d of leads) {
        candidates.push({
          url: d.url,
          title: d.title,
          publisher: d.court
            ? `Federal court docket (${d.court})`
            : "Federal court docket",
          publishedAt: d.filedAt,
          snippet:
            "Federal court docket via CourtListener. A lead only: open the docket and read the filings before creating a case.",
          collegeId: cid,
          suggestedTopic: "lawsuit",
          via: "court",
        });
      }
    } catch (err) {
      fail(label, err);
    }
  }

  // Full-text search matches any article that mentions the institution, so a story about another tracked
  // school can arrive under the wrong query. If the headline names a different tracked school and not the
  // queried one, file it under the school it names.
  let refiled = 0;
  const headlineSchools = gdeltQueries
    .map((q) => ({
      id: collegeIdBySlug.get(q.collegeSlug),
      re: new RegExp(`\\b${escapeRegExp(q.shortName)}\\b`, "i"),
    }))
    .filter((x): x is { id: string; re: RegExp } => Boolean(x.id));
  for (const c of candidates) {
    if (c.via === "feed" || c.via === "court" || c.via === "case_news" || !c.title) continue;
    const named = headlineSchools
      .filter((h) => h.re.test(c.title!))
      .map((h) => h.id);
    if (named.length && !named.includes(c.collegeId)) {
      c.collegeId = named[0];
      refiled++;
    }
  }

  // Some institutions require their name in the headline (after re-filing, so a story naming another
  // tracked school is kept under that school instead).
  let droppedNoHeadlineName = 0;
  const strict = new Map(
    gdeltQueries
      .filter((q) => q.headlineMustName && collegeIdBySlug.has(q.collegeSlug))
      .map((q) => [
        collegeIdBySlug.get(q.collegeSlug)!,
        new RegExp(`\\b${escapeRegExp(q.shortName)}\\b`, "i"),
      ]),
  );
  for (let i = candidates.length - 1; i >= 0; i--) {
    const c = candidates[i];
    const re =
      c.via === "feed" || c.via === "court" || c.via === "case_news"
        ? undefined
        : strict.get(c.collegeId);
    if (re && !re.test(c.title ?? "")) {
      candidates.splice(i, 1);
      droppedNoHeadlineName++;
    }
  }

  // Google News links are opaque, so the same story found via a feed or GDELT (or already in the inbox)
  // is matched by headline instead of URL.
  // A case-search result that duplicates something already found (this run or in the inbox) is not added
  // again: the existing item is marked as a possible update to the case instead, while it is still new.
  const knownHeadlines = new Set<string>();
  const inboxNewByHeadline = new Map<string, string>(); // key → id of a still-new inbox item
  const collegeIds = [...collegeIdBySlug.values()];
  if (collegeIds.length) {
    const existing = await db
      .select({
        id: s.candidateItems.id,
        title: s.candidateItems.title,
        collegeId: s.candidateItems.collegeId,
        status: s.candidateItems.status,
      })
      .from(s.candidateItems)
      .where(inArray(s.candidateItems.collegeId, collegeIds));
    for (const e of existing) {
      const k = headlineKey(e.title);
      if (!k) continue;
      knownHeadlines.add(`${e.collegeId}|${k}`);
      if (e.status === "new") inboxNewByHeadline.set(`${e.collegeId}|${k}`, e.id);
    }
  }
  const thisRunByHeadline = new Map<string, Candidate>();
  for (const c of candidates) {
    const k = headlineKey(c.title);
    if (k && c.via !== "google_news" && c.via !== "case_news") {
      knownHeadlines.add(`${c.collegeId}|${k}`);
      thisRunByHeadline.set(`${c.collegeId}|${k}`, c);
    }
  }
  let duplicateHeadlines = 0;
  const tagExisting = new Map<string, string>(); // inbox item id → case id
  const kept = candidates.filter((c) => {
    if (c.via !== "google_news" && c.via !== "case_news") return true;
    const k = headlineKey(c.title);
    if (!k) return true;
    const key = `${c.collegeId}|${k}`;
    if (c.via === "case_news" && c.caseId) {
      const sameRun = thisRunByHeadline.get(key);
      if (sameRun) {
        sameRun.caseId ??= c.caseId;
        return false;
      }
      const inboxId = inboxNewByHeadline.get(key);
      if (inboxId) {
        tagExisting.set(inboxId, c.caseId);
        return false;
      }
    }
    if (knownHeadlines.has(key)) {
      duplicateHeadlines++;
      return false;
    }
    knownHeadlines.add(key);
    thisRunByHeadline.set(key, c);
    return true;
  });

  // Canonicalize and de-duplicate within this run; the unique url column de-duplicates across runs.
  const unique = new Map<string, Candidate>();
  for (const { via: _via, ...c } of kept) {
    const url = canonicalizeUrl(c.url);
    if (!url) continue;
    const seen = unique.get(url);
    if (seen) seen.caseId ??= c.caseId;
    else unique.set(url, { ...c, url, via: _via });
  }

  const inserted = unique.size
    ? await db
        .insert(s.candidateItems)
        .values(
          [...unique.values()].map(({ via: _via, ...c }) => ({
            ...c,
            caseId: c.caseId ?? null,
            ingestionRunId: runId,
          })),
        )
        .onConflictDoNothing({ target: s.candidateItems.url })
        .returning({ id: s.candidateItems.id, url: s.candidateItems.url, caseId: s.candidateItems.caseId })
    : [];

  // Case results whose link was already in the inbox (so not inserted): mark that item instead.
  const insertedUrls = new Set(inserted.map((r) => r.url));
  const urlTags = [...unique.values()].filter((c) => c.caseId && !insertedUrls.has(c.url));
  for (const c of urlTags) {
    const updated = await db
      .update(s.candidateItems)
      .set({ caseId: c.caseId })
      .where(and(eq(s.candidateItems.url, c.url), isNull(s.candidateItems.caseId), eq(s.candidateItems.status, "new")))
      .returning({ id: s.candidateItems.id });
    if (updated.length) tagExisting.set(updated[0].id, c.caseId!);
  }
  for (const [id, caseId] of tagExisting) {
    await db
      .update(s.candidateItems)
      .set({ caseId })
      .where(and(eq(s.candidateItems.id, id), isNull(s.candidateItems.caseId), eq(s.candidateItems.status, "new")));
  }
  const caseUpdates = inserted.filter((r) => r.caseId).length + tagExisting.size;


  return {
    found: unique.size,
    created: inserted.length,
    errors,
    bySource,
    duplicateHeadlines,
    refiled,
    droppedNoHeadlineName,
    caseUpdates,
  };
}

/**
 * Every non-rejected, non-demo case with search terms, filed under its first school that this run covers.
 * The search uses all of that case's covered schools' names, so a story naming any of them matches.
 */
export async function loadCaseQueries(db: Database, colleges: CollegeQuery[]): Promise<CaseQuery[]> {
  const rows = await db
    .select({ caseId: s.cases.id, title: s.cases.title, terms: s.cases.searchTerms, slug: s.colleges.slug })
    .from(s.cases)
    .innerJoin(s.caseColleges, eq(s.caseColleges.caseId, s.cases.id))
    .innerJoin(s.colleges, eq(s.colleges.id, s.caseColleges.collegeId))
    .where(and(ne(s.cases.status, "rejected"), eq(s.cases.isDemo, false), sql`cardinality(${s.cases.searchTerms}) > 0`))
    .orderBy(s.cases.title, s.colleges.slug);
  const byCase = new Map<string, CaseQuery>();
  for (const r of rows) {
    const college = colleges.find((c) => c.collegeSlug === r.slug);
    if (!college) continue;
    const q = byCase.get(r.caseId);
    if (q) q.names.push(...college.names.filter((n) => !q.names.includes(n)));
    else byCase.set(r.caseId, { caseId: r.caseId, title: r.title, collegeSlug: r.slug, names: [...college.names], terms: r.terms });
  }
  return [...byCase.values()];
}

function addCount(
  bySource: DiscoveryResult["bySource"],
  label: string,
  n: number,
) {
  const entry = (bySource[label] ??= { found: 0, relevant: 0 });
  entry.found += n;
  entry.relevant += n;
}

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/**
 * Error text for logs and the run record. Node's fetch reports every network failure as "fetch failed" and puts
 * the reason (e.g. UND_ERR_CONNECT_TIMEOUT, ECONNRESET, ENOTFOUND) in `cause`, so include it.
 */
export function message(err: unknown): string {
  if (!(err instanceof Error)) return String(err);
  const cause = err.cause as { code?: string; message?: string } | undefined;
  if (!cause) return err.message;
  const detail = [cause.code, cause.message].filter(Boolean).join(": ");
  return detail ? `${err.message} (${detail})` : err.message;
}
