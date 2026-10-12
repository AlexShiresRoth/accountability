// Discovery started by a researcher from the dashboard, for one school or all of them.
// Same job as the daily cron (candidates go to the inbox; nothing is published), with a chosen lookback.

import { and, eq, gt } from "drizzle-orm";
import * as s from "@/db/schema";
import type { Database } from "@/db/types";
import { runDiscovery, serverGdeltEnabled, type DiscoveryOptions, type DiscoveryResult } from "@/jobs/discovery/run";
import { feeds, gdeltQueries } from "@/jobs/discovery/sources";

export const ALL_SCHOOLS = "all";

/** Lookback choices in days: the cron's window, then backfills (e.g. for a newly added school). */
export const lookbackDays = [2, 30, 90] as const;

// A run cut off by the function time limit never records an outcome, so only recent "running" rows block.
const RUNNING_WINDOW_MS = 10 * 60_000;

export type ManualRunRequest = {
  collegeSlug: string;
  days: number;
  actor: string;
};

export type ManualRunResult = { ok: true; result: DiscoveryResult; label: string } | { ok: false; problems: string[] };

type Overrides = Pick<DiscoveryOptions, "fetchText" | "sleep" | "now">;

export async function runManualDiscovery(db: Database, req: ManualRunRequest, overrides: Overrides = {}): Promise<ManualRunResult> {
  const all = req.collegeSlug === ALL_SCHOOLS;
  const queries = all ? gdeltQueries : gdeltQueries.filter((q) => q.collegeSlug === req.collegeSlug);
  if (!queries.length) return { ok: false, problems: ["Choose a school that discovery covers."] };
  if (!(lookbackDays as readonly number[]).includes(req.days)) return { ok: false, problems: ["Choose a lookback period."] };

  let label = "All schools";
  if (!all) {
    const [college] = await db.select({ name: s.colleges.name }).from(s.colleges).where(eq(s.colleges.slug, req.collegeSlug));
    if (!college) return { ok: false, problems: ["That school isn’t in the database yet. Import or create it first."] };
    label = college.name;
  }

  // CourtListener's anonymous limit (about five searches a minute) is shared by overlapping runs.
  const [running] = await db
    .select({ id: s.ingestionRuns.id })
    .from(s.ingestionRuns)
    .where(
      and(
        eq(s.ingestionRuns.job, "discovery"),
        eq(s.ingestionRuns.outcome, "running"),
        gt(s.ingestionRuns.startedAt, new Date(Date.now() - RUNNING_WINDOW_MS)),
      ),
    )
    .limit(1);
  if (running) return { ok: false, problems: ["Another discovery run is in progress. Try again when it finishes."] };

  const result = await runDiscovery({
    db,
    ...overrides,
    triggeredBy: "admin",
    scope: `${label}, last ${req.days} days (${req.actor})`,
    feeds: all ? feeds : feeds.filter((f) => f.collegeSlug === req.collegeSlug),
    gdeltQueries: queries,
    googleNewsDays: req.days,
    gdeltTimespan: `${req.days}d`,
    sources: { gdelt: serverGdeltEnabled() },
  });
  return { ok: true, result, label };
}
