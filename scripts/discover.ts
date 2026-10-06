// Runs the discovery job once and prints what it found.
// Usage: pnpm discover [--timespan 3months] [--days 90] [--court-days 730] [--court-pages 5]
//                      [--no-gdelt] [--no-courts] [--no-news] [--no-feeds] [--only slug,slug]
// Development database by default. Production needs both DB_TARGET=production and --production:
//   DB_TARGET=production pnpm discover --production --no-news --no-feeds --court-days 730 --court-pages 5
// Writes candidates to the inbox only; nothing is published.
import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { createPgClient } from "../src/db/client";
import * as s from "../src/db/schema";
import { resolveDatabaseUrl } from "../src/db/target";
import type { Database } from "../src/db/types";
import { runDiscovery } from "../src/jobs/discovery/run";
import { feeds, gdeltQueries } from "../src/jobs/discovery/sources";

const arg = (name: string) => {
  const i = process.argv.indexOf(name);
  return i > -1 ? process.argv[i + 1] : undefined;
};
const flag = (name: string) => process.argv.includes(name);

async function main() {
  const production = flag("--production");
  // The session-pooler (migration) URL: the transaction pooler hangs with postgres.js (see src/db/client.ts).
  const { target, variable, url } = resolveDatabaseUrl({ migration: true });
  if (target === "production" && !production) throw new Error("DB_TARGET is production: pass --production to confirm.");
  if (production && target !== "production") throw new Error("--production also requires DB_TARGET=production.");

  const timespan = arg("--timespan") ?? "1d";
  const days = Number(arg("--days") ?? 2);
  const courtDays = arg("--court-days") ? Number(arg("--court-days")) : undefined;
  const courtPages = arg("--court-pages") ? Number(arg("--court-pages")) : undefined;
  const only = arg("--only")?.split(",").map((x) => x.trim());
  const sources = { gdelt: !flag("--no-gdelt"), googleNews: !flag("--no-news"), courtDockets: !flag("--no-courts") };
  const queries = only ? gdeltQueries.filter((q) => only.includes(q.collegeSlug)) : gdeltQueries;
  const feedList = flag("--no-feeds") ? [] : only ? feeds.filter((f) => only.includes(f.collegeSlug)) : feeds;
  if (only && queries.length !== only.length) throw new Error(`Unknown college slug in --only. Known: ${gdeltQueries.map((q) => q.collegeSlug).join(", ")}`);

  console.log(
    `Discovery → ${target} database (${variable})\n` +
      `  institutions: ${queries.map((q) => q.collegeSlug).join(", ")}\n` +
      `  feeds ${feedList.length ? "on" : "off"}, GDELT ${sources.gdelt ? timespan : "off"}, Google News ${sources.googleNews ? `${days}d` : "off"}, ` +
      `court dockets ${sources.courtDockets ? `${courtDays ?? days}d × ${courtPages ?? 1} page(s)` : "off"}\n`,
  );

  const client = createPgClient(url, { max: 1 });
  const db = drizzle(client, { schema: s }) as unknown as Database;
  try {
    const result = await runDiscovery({
      db,
      gdeltTimespan: timespan,
      googleNewsDays: days,
      sources,
      courtDays,
      courtPages,
      feeds: feedList,
      gdeltQueries: queries,
      triggeredBy: "cli",
    });
    console.table(result.bySource);
    console.log(`Outcome: ${result.outcome} in ${(result.durationMs / 1000).toFixed(1)}s`);
    console.log(`Unique candidates: ${result.found}, new: ${result.created}, duplicate headlines skipped: ${result.duplicateHeadlines}, re-filed by headline: ${result.refiled}, dropped (headline must name school): ${result.droppedNoHeadlineName}`);
    if (result.errors.length) console.log(`\nErrors:\n- ${result.errors.join("\n- ")}`);

    const rows = await db
      .select({
        college: s.colleges.name,
        publisher: s.candidateItems.publisher,
        publishedAt: s.candidateItems.publishedAt,
        topic: s.candidateItems.suggestedTopic,
        title: s.candidateItems.title,
      })
      .from(s.candidateItems)
      .leftJoin(s.colleges, eq(s.candidateItems.collegeId, s.colleges.id))
      .where(eq(s.candidateItems.ingestionRunId, result.runId))
      .orderBy(s.colleges.name, desc(s.candidateItems.publishedAt));
    for (const r of rows) {
      console.log(`${r.college} | ${r.publishedAt?.toISOString().slice(0, 10) ?? "undated"} | ${r.publisher} | ${r.topic} | ${r.title}`);
    }
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
