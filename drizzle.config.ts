import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  // Migrations run over the session pooler; the app uses the transaction pooler.
  dbCredentials: { url: (process.env.MIGRATION_DATABASE_URL ?? process.env.DATABASE_URL)! },
  strict: true,
});
