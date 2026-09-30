// Chooses which database a process talks to.
//
//   production target: Vercel production deployments (VERCEL_ENV=production),
//                      or DB_TARGET=production (explicit, e.g. `pnpm db:migrate:prod`)
//                      → DATABASE_URL / MIGRATION_DATABASE_URL
//   development target: everything else, including local `next build` / `next start`
//                      → DEV_DATABASE_URL / DEV_MIGRATION_DATABASE_URL
//
// There is no silent fallback from development to production credentials.

export type DbTarget = "development" | "production";

export function resolveDbTarget(env: NodeJS.ProcessEnv = process.env): DbTarget {
  if (env.DB_TARGET) {
    if (env.DB_TARGET !== "development" && env.DB_TARGET !== "production") {
      throw new Error(`DB_TARGET must be "development" or "production", got "${env.DB_TARGET}"`);
    }
    return env.DB_TARGET;
  }
  return env.VERCEL_ENV === "production" ? "production" : "development";
}

export function resolveDatabaseUrl(
  { migration = false }: { migration?: boolean } = {},
  env: NodeJS.ProcessEnv = process.env,
): { target: DbTarget; variable: string; url: string } {
  const target = resolveDbTarget(env);
  const prefix = target === "development" ? "DEV_" : "";
  const candidates = migration
    ? [`${prefix}MIGRATION_DATABASE_URL`, `${prefix}DATABASE_URL`]
    : [`${prefix}DATABASE_URL`];

  for (const variable of candidates) {
    const url = env[variable];
    if (url) return { target, variable, url };
  }
  throw new Error(`No database URL for the ${target} target. Set ${candidates.join(" or ")}.`);
}
