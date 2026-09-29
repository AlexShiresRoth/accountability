import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import { resolveDatabaseUrl } from "./src/db/target";

config({ path: ".env.local", quiet: true });

// Development database unless DB_TARGET=production (see src/db/target.ts).
// Migrations run over Supabase's session pooler; the app uses the transaction pooler.
const { url, target, variable } = resolveDatabaseUrl({ migration: true });
if (process.argv.some((a) => a === "migrate" || a === "push")) {
  console.log(`drizzle-kit → ${target} database (${variable})`);
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url },
  strict: true,
});
