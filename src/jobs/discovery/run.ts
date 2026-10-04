// Discovery job: finds candidate coverage for researcher triage.
// Writes ONLY candidate_item and ingestion_run. Never creates sources, coverage, or any public record.

import { eq, inArray } from "drizzle-orm";
import * as s from "@/db/schema";
import type { Database } from "@/db/types";
import type { CoverageTopic } from "@/lib/enums";
import { parseFeed } from "./feed-parser";
import { fetchGdelt } from "./gdelt";
import { courtListenerUrl, parseCourtListener } from "./courtlistener";
import { googleNewsUrl, headlineKey, parseGoogleNews } from "./google-news";
import { isRelevant, suggestTopic } from "./relevance";
import { feeds as defaultFeeds, gdeltQueries as defaultQueries, type CollegeQuery, type FeedSource } from "./sources";
import { searchTermGroups } from "./terms";
import { canonicalizeUrl } from "./urls";

export type FetchText = (url: string) => Promise<{ status: number; body: string }>;

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
  sources?: { gdelt?: boolean; googleNews?: boolean; courtDockets?: boolean };
  /** Court-docket lookback in days. Defaults to googleNewsDays; dockets stay relevant far longer than news. */
  courtDays?: number;
  /** "Today", for the court-docket lookback window (injectable for tests). */
  now?: Date;
};

export type DiscoveryResult = {
  runId: string;
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
};

type Candidate = {
  url: string;
  title: string | null;
  publisher: string | null;
  publishedAt: Date | null;
  snippet: string | null;
  collegeId: string;
  suggestedTopic: CoverageTopic;
  via: "feed" | "gdelt" | "google_news" | "court";
};

export const USER_AGENT = "CampusAccountabilityBot/0.1 (public-interest research; discovery of news coverage)";

export const defaultFetchText: FetchText = async (url) => {
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT }, signal: AbortSignal.timeout(20_000) });
  return { status: res.status, body: await res.text() };
};

const GDELT_INTERVAL_MS = 6_000;
const GOOGLE_NEWS_INTERVAL_MS = 2_000;
const COURTLISTENER_INTERVAL_MS = 2_000;

export async function runDiscovery(opts: DiscoveryOptions): Promise<DiscoveryResult> {
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

  const [run] = await db.insert(s.ingestionRuns).values({ job: "discovery" }).returning({ id: s.ingestionRuns.id });
  const errors: string[] = [];
  const bySource: DiscoveryResult["bySource"] = {};
  const candidates: Candidate[] = [];

  const slugs = [...new Set([...feeds.map((f) => f.collegeSlug), ...gdeltQueries.map((q) => q.collegeSlug)])];
  const collegeRows = slugs.length
    ? await db.select({ id: s.colleges.id, slug: s.colleges.slug }).from(s.colleges).where(inArray(s.colleges.slug, slugs))
    : [];
  const collegeIdBySlug = new Map(collegeRows.map((c) => [c.slug, c.id]));
  const collegeId = (slug: string) => {
    const id = collegeIdBySlug.get(slug);
    if (!id) errors.push(`College "${slug}" not found; skipped its sources.`);
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
      const relevant = items.filter((i) => i.url && isRelevant(`${i.title ?? ""} ${i.snippet ?? ""}`));
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
      errors.push(`${label}: ${message(err)}`);
    }
  }

  let gdeltRequests = 0;
  for (const query of useGdelt ? gdeltQueries : []) {
    const label = `gdelt: ${query.names.join(" / ")}`;
    const cid = collegeId(query.collegeSlug);
    if (!cid) continue;
    for (const terms of searchTermGroups) {
      if (gdeltRequests++ > 0) await sleep(GDELT_INTERVAL_MS);
      try {
        const articles = await fetchGdelt(fetchText, sleep, query.names, terms, gdeltTimespan);
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
        errors.push(`${label}: ${message(err)}`);
        break; // rate-limited or down: don't hammer it with the remaining groups
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
        const { status, body } = await fetchText(googleNewsUrl(query.names, terms, googleNewsDays));
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
        errors.push(`${label}: ${message(err)}`);
      }
    }
  }

  // Federal court dockets naming the institution as a party (case leads).
  const since = new Date(now.getTime() - (opts.courtDays ?? googleNewsDays) * 86_400_000).toISOString().slice(0, 10);
  let courtRequests = 0;
  for (const query of useCourtDockets ? gdeltQueries : []) {
    const label = `court dockets: ${query.courtNames.join(" / ")}`;
    const cid = collegeId(query.collegeSlug);
    if (!cid) continue;
    if (courtRequests++ > 0) await sleep(COURTLISTENER_INTERVAL_MS);
    try {
      const { status, body } = await fetchText(courtListenerUrl(query.courtNames, since));
      if (status !== 200) throw new Error(`HTTP ${status}`);
      const leads = parseCourtListener(body);
      addCount(bySource, label, leads.length);
      for (const d of leads) {
        candidates.push({
          url: d.url,
          title: d.title,
          publisher: d.court ? `Federal court docket (${d.court})` : "Federal court docket",
          publishedAt: d.filedAt,
          snippet: "Federal court docket via CourtListener. A lead only: open the docket and read the filings before creating a case.",
          collegeId: cid,
          suggestedTopic: "lawsuit",
          via: "court",
        });
      }
    } catch (err) {
      errors.push(`${label}: ${message(err)}`);
    }
  }

  // Full-text search matches any article that mentions the institution, so a story about another tracked
  // school can arrive under the wrong query. If the headline names a different tracked school and not the
  // queried one, file it under the school it names.
  let refiled = 0;
  const headlineSchools = gdeltQueries
    .map((q) => ({ id: collegeIdBySlug.get(q.collegeSlug), re: new RegExp(`\\b${escapeRegExp(q.shortName)}\\b`, "i") }))
    .filter((x): x is { id: string; re: RegExp } => Boolean(x.id));
  for (const c of candidates) {
    if (c.via === "feed" || c.via === "court" || !c.title) continue;
    const named = headlineSchools.filter((h) => h.re.test(c.title!)).map((h) => h.id);
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
      .map((q) => [collegeIdBySlug.get(q.collegeSlug)!, new RegExp(`\\b${escapeRegExp(q.shortName)}\\b`, "i")]),
  );
  for (let i = candidates.length - 1; i >= 0; i--) {
    const c = candidates[i];
    const re = c.via === "feed" || c.via === "court" ? undefined : strict.get(c.collegeId);
    if (re && !re.test(c.title ?? "")) {
      candidates.splice(i, 1);
      droppedNoHeadlineName++;
    }
  }

  // Google News links are opaque, so the same story found via a feed or GDELT (or already in the inbox)
  // is matched by headline instead of URL.
  const knownHeadlines = new Set<string>();
  const collegeIds = [...collegeIdBySlug.values()];
  if (collegeIds.length) {
    const existing = await db
      .select({ title: s.candidateItems.title, collegeId: s.candidateItems.collegeId })
      .from(s.candidateItems)
      .where(inArray(s.candidateItems.collegeId, collegeIds));
    for (const e of existing) {
      const k = headlineKey(e.title);
      if (k) knownHeadlines.add(`${e.collegeId}|${k}`);
    }
  }
  for (const c of candidates) {
    const k = headlineKey(c.title);
    if (k && c.via !== "google_news") knownHeadlines.add(`${c.collegeId}|${k}`);
  }
  let duplicateHeadlines = 0;
  const kept = candidates.filter((c) => {
    if (c.via !== "google_news") return true;
    const k = headlineKey(c.title);
    if (!k) return true;
    const key = `${c.collegeId}|${k}`;
    if (knownHeadlines.has(key)) {
      duplicateHeadlines++;
      return false;
    }
    knownHeadlines.add(key);
    return true;
  });

  // Canonicalize and de-duplicate within this run; the unique url column de-duplicates across runs.
  const unique = new Map<string, Candidate>();
  for (const { via: _via, ...c } of kept) {
    const url = canonicalizeUrl(c.url);
    if (url && !unique.has(url)) unique.set(url, { ...c, url, via: _via });
  }

  const inserted = unique.size
    ? await db
        .insert(s.candidateItems)
        .values([...unique.values()].map(({ via: _via, ...c }) => ({ ...c, ingestionRunId: run.id })))
        .onConflictDoNothing({ target: s.candidateItems.url })
        .returning({ id: s.candidateItems.id })
    : [];

  await db
    .update(s.ingestionRuns)
    .set({
      finishedAt: new Date(),
      itemsFound: unique.size,
      itemsCreated: inserted.length,
      error: errors.length ? errors.join("\n") : null,
    })
    .where(eq(s.ingestionRuns.id, run.id));

  return { runId: run.id, found: unique.size, created: inserted.length, errors, bySource, duplicateHeadlines, refiled, droppedNoHeadlineName };
}

function addCount(bySource: DiscoveryResult["bySource"], label: string, n: number) {
  const entry = (bySource[label] ??= { found: 0, relevant: 0 });
  entry.found += n;
  entry.relevant += n;
}

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const message = (err: unknown) => (err instanceof Error ? err.message : String(err));
