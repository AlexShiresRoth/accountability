// Seeds the DEVELOPMENT database only. Refuses to run against production.
import { drizzle } from "drizzle-orm/postgres-js";
import { createPgClient } from "../src/db/client";
import * as s from "../src/db/schema";
import { seedDevelopment } from "../src/db/seed";
import { resolveDatabaseUrl } from "../src/db/target";
import type { Database } from "../src/db/types";

async function main() {
  if (process.env.NODE_ENV === "production") throw new Error("Refusing to seed with NODE_ENV=production.");
  const { target, variable, url } = resolveDatabaseUrl();
  if (target !== "development" || !variable.startsWith("DEV_")) {
    throw new Error(`Refusing to seed: resolved ${target} database via ${variable}. Seeding requires DEV_DATABASE_URL.`);
  }
  console.log(`Seeding development database (${variable})`);

  const client = createPgClient(url, { max: 1 });
  try {
    await seedDevelopment(drizzle(client, { schema: s }) as unknown as Database);
    console.log("Done.");
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
