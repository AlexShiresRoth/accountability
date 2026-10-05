import postgres from "postgres";

/**
 * Postgres client for Supabase. Every connection in the project should come from here.
 *
 * Use Supabase's SESSION pooler (port 5432) for the app, not the transaction pooler (6543).
 * postgres.js pipelines concurrent queries on a connection; through the transaction pooler this intermittently
 * leaves a server session waiting in `ClientRead` forever, so pages that run many queries at once hang until
 * the statement timeout. Reproduced 2026-10-02: the college admin page hung on the transaction pooler and
 * never on the session pooler. Turning pipelining off (`max_pipeline: 0`) is not an option: it breaks
 * transactions on single-connection clients inside postgres.js.
 *
 * The session pooler holds one server connection per client connection, and its pool is small (15 on this
 * project), shared by every process. So each process keeps a small pool and closes idle connections promptly:
 * with postgres.js defaults (10 connections, never closed) one dev server plus a script exhausted the pool.
 * Pipelining is safe in session mode, so a few connections serve many concurrent queries.
 *
 * On Vercel every function instance has its own pool, and many instances run at once (pages, revalidation, the
 * cron), so 4 connections each exhausted the 15-client pool in production (EMAXCONNSESSION, 2026-10-05). There,
 * each instance keeps a single connection, pipelines its concurrent queries over it, and drops it after 5 s idle.
 *
 * prepare: false is kept so the client also works through any pooler that lacks prepared-statement support.
 */
export function poolDefaults(env: NodeJS.ProcessEnv = process.env): { max: number; idle_timeout: number } {
  return env.VERCEL ? { max: 1, idle_timeout: 5 } : { max: 4, idle_timeout: 20 };
}

export function createPgClient(url: string, options: { max?: number } = {}) {
  return postgres(url, { prepare: false, ...poolDefaults(), ...options });
}
