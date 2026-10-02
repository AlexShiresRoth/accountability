// Imports a transcribed research bundle into the DEVELOPMENT database as pending_review.
// Usage: pnpm import-research cornell-university
import { drizzle } from "drizzle-orm/postgres-js";
import { cornellInstitutional } from "../research/cornell-institutional";
import { cornellAsr } from "../research/cornell-university";
import { createPgClient } from "../src/db/client";
import * as s from "../src/db/schema";
import { resolveDatabaseUrl } from "../src/db/target";
import type { Database } from "../src/db/types";
import { importResearchBundle, type ResearchBundle } from "../src/lib/admin/research-bundle";

const bundles: Record<string, ResearchBundle> = { "cornell-university": cornellAsr, "cornell-institutional": cornellInstitutional };
const ACTOR = "Claude (transcription)";

async function main() {
  const name = process.argv[2];
  const bundle = bundles[name];
  if (!bundle) throw new Error(`Unknown bundle "${name}". Available: ${Object.keys(bundles).join(", ")}`);
  const { target, variable, url } = resolveDatabaseUrl();
  if (target !== "development") throw new Error("Research imports run against the development database only for now.");
  console.log(`Importing ${name} → development database (${variable}) as "${ACTOR}"\n`);

  const client = createPgClient(url, { max: 1 });
  try {
    const { log, queued } = await importResearchBundle(drizzle(client, { schema: s }) as unknown as Database, bundle, ACTOR);
    for (const line of log) console.log(`- ${line}`);
    console.log(`\n${queued.length} records queued for review.`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
