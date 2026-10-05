// Imports a transcribed research bundle as pending_review. Re-running is safe: existing records are reused.
// Usage: pnpm import-research cornell-university                                  (development database)
//        DB_TARGET=production pnpm import-research cornell-university --production (production; both are required)
import { drizzle } from "drizzle-orm/postgres-js";
import { columbiaInstitutional } from "../research/columbia-institutional";
import { columbiaAsr } from "../research/columbia-university";
import { cornellChiPhi } from "../research/cornell-chi-phi";
import { cornellInstitutional } from "../research/cornell-institutional";
import { cornellAsr } from "../research/cornell-university";
import { harvardInstitutional } from "../research/harvard-institutional";
import { harvardAsr } from "../research/harvard-university";
import { cuBoulderInstitutional } from "../research/university-of-colorado-boulder-institutional";
import { cuBoulderAsr } from "../research/university-of-colorado-boulder";
import { utahInstitutional } from "../research/university-of-utah-institutional";
import { utahAsr } from "../research/university-of-utah";
import { ohioStateInstitutional } from "../research/ohio-state-university-institutional";
import { ohioStateAsr } from "../research/ohio-state-university";
import { uclaInstitutional } from "../research/ucla-institutional";
import { uclaAsr } from "../research/ucla";
import { pennStateInstitutional } from "../research/penn-state-university-institutional";
import { pennStateAsr } from "../research/penn-state-university";
import { createPgClient } from "../src/db/client";
import * as s from "../src/db/schema";
import { resolveDatabaseUrl } from "../src/db/target";
import type { Database } from "../src/db/types";
import { importResearchBundle, type ResearchBundle } from "../src/lib/admin/research-bundle";

const bundles: Record<string, ResearchBundle> = {
  "cornell-university": cornellAsr,
  "cornell-institutional": cornellInstitutional,
  "cornell-chi-phi": cornellChiPhi,
  "columbia-university": columbiaAsr,
  "columbia-institutional": columbiaInstitutional,
  "harvard-university": harvardAsr,
  "harvard-institutional": harvardInstitutional,
  "university-of-colorado-boulder": cuBoulderAsr,
  "university-of-colorado-boulder-institutional": cuBoulderInstitutional,
  "university-of-utah": utahAsr,
  "university-of-utah-institutional": utahInstitutional,
  "ohio-state-university": ohioStateAsr,
  "ohio-state-university-institutional": ohioStateInstitutional,
  ucla: uclaAsr,
  "ucla-institutional": uclaInstitutional,
  "penn-state-university": pennStateAsr,
  "penn-state-university-institutional": pennStateInstitutional,
};
const ACTOR = "Claude (transcription)";

async function main() {
  const name = process.argv[2];
  const bundle = bundles[name];
  if (!bundle) throw new Error(`Unknown bundle "${name}". Available: ${Object.keys(bundles).join(", ")}`);
  const production = process.argv.includes("--production");
  // The session-pooler (migration) URL: the transaction pooler hangs with postgres.js (see src/db/client.ts).
  const { target, variable, url } = resolveDatabaseUrl({ migration: true });
  if (target === "production" && !production) throw new Error("DB_TARGET is production: pass --production to confirm.");
  if (production && target !== "production") throw new Error("--production also requires DB_TARGET=production.");
  console.log(`Importing ${name} → ${target} database (${variable}) as "${ACTOR}"\n`);

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
