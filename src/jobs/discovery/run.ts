// Discovery job: finds candidate coverage for researcher triage.
// Writes ONLY candidate_item and ingestion_run. Never creates sources, coverage, or any public record.

import { eq, inArray } from "drizzle-orm";
import * as s from "@/db/schema";
import type { Database } from "@/db/types";
import type { CoverageTopic } from "@/lib/enums";
import { parseFeed } from "./feed-parser";
import { fetchGdelt } from "./gdelt";
import { isRelevant, suggestTopic } from "./relevance";
import { feeds as defaultFeeds, gdeltQueries as defaultQueries, type CollegeQuery, type FeedSource } from "./sources";
import { canonicalizeUrl } from "./urls";

export type FetchText = (url: string) => Promise<{ status: number; body: string }>;

export type DiscoveryOptions = {
  db: Database;
  fetchText?: FetchText;
  sleep?: (ms: number) => Promise<void>;
  /** GDELT lookback window, e.g. "1d" for scheduled runs, "3months" for a backfill. */
  gdeltTimespan?: string;
  feeds?: FeedSource[];
  gdeltQueries?: CollegeQuery[];
};

export type DiscoveryResult = {
  runId: string;
  found: number;
  created: number;
  errors: string[];
  bySource: Record<string, { found: number; relevant: number }>;
};

type Candidate = {
  url: string;
  title: string | null;
  publisher: string | null;
  publishedAt: Date | null;
  snippet: string | null;
  collegeId: string;
  suggestedTopic: CoverageTopic;
};

export const USER_AGENT = "CampusAccountabilityBot/0.1 (public-interest research; discovery of news coverage)";

export const defaultFetchText: FetchText = async (url) => {
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT }, signal: AbortSignal.timeout(20_000) });
  return { status: res.status, body: await res.text() };
};

const GDELT_INTERVAL_MS = 6_000;

export async function runDiscovery(opts: DiscoveryOptions): Promise<DiscoveryResult> {
  const {
    db,
    fetchText = defaultFetchText,
    sleep = (ms) => new Promise((r) => setTimeout(r, ms)),
    gdeltTimespan = "1d",
    feeds = defaultFeeds,
    gdeltQueries = defaultQueries,
  } = opts;

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
        });
      }
    } catch (err) {
      errors.push(`${label}: ${message(err)}`);
    }
  }

  for (const [index, query] of gdeltQueries.entries()) {
    const label = `gdelt: ${query.names.join(" / ")}`;
    const cid = collegeId(query.collegeSlug);
    if (!cid) continue;
    if (index > 0) await sleep(GDELT_INTERVAL_MS);
    try {
      const articles = await fetchGdelt(fetchText, sleep, query.names, gdeltTimespan);
      bySource[label] = { found: articles.length, relevant: articles.length };
      for (const a of articles) {
        candidates.push({
          url: a.url,
          title: a.title,
          publisher: a.domain,
          publishedAt: a.seenAt,
          snippet: null,
          collegeId: cid,
          suggestedTopic: suggestTopic(a.title ?? ""),
        });
      }
    } catch (err) {
      errors.push(`${label}: ${message(err)}`);
    }
  }

  // Canonicalize and de-duplicate within this run; the unique url column de-duplicates across runs.
  const unique = new Map<string, Candidate>();
  for (const c of candidates) {
    const url = canonicalizeUrl(c.url);
    if (url && !unique.has(url)) unique.set(url, { ...c, url });
  }

  const inserted = unique.size
    ? await db
        .insert(s.candidateItems)
        .values([...unique.values()].map((c) => ({ ...c, ingestionRunId: run.id })))
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

  return { runId: run.id, found: unique.size, created: inserted.length, errors, bySource };
}

const message = (err: unknown) => (err instanceof Error ? err.message : String(err));
