// Runs the discovery job once and prints what it found.
// Usage: pnpm discover [--timespan 3months]
// Development database only until the scheduled job is deployed (step 7).
import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as s from "../src/db/schema";
import { resolveDatabaseUrl } from "../src/db/target";
import type { Database } from "../src/db/types";
import { runDiscovery } from "../src/jobs/discovery/run";

async function main() {
  const { target, variable, url } = resolveDatabaseUrl();
  if (target !== "development") throw new Error("Discovery runs against the development database only for now.");
  const i = process.argv.indexOf("--timespan");
  const timespan = i > -1 ? process.argv[i + 1] : "1d";
  console.log(`Discovery → development database (${variable}), GDELT window ${timespan}\n`);

  const client = postgres(url, { prepare: false, max: 1 });
  const db = drizzle(client, { schema: s }) as unknown as Database;
  try {
    const result = await runDiscovery({ db, gdeltTimespan: timespan });
    console.table(result.bySource);
    console.log(`Unique candidates: ${result.found}, new: ${result.created}`);
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
