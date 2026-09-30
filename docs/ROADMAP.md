# Roadmap

MVP build plan and deferred work. Priorities, in order: accuracy, source provenance, victim privacy,
legal/status distinctions, researcher usability, public usability, performance, visual polish.

## Done

| Step | Scope |
| --- | --- |
| 0. Setup | Next.js 16, Tailwind, Drizzle, Vitest/PGlite, Supabase dev + prod projects |
| 1. Layout & static pages | Design tokens (light/dark), homepage, methodology, sources, prevention lessons |
| 2. Data layer | Schema + migrations (RLS on, API roles revoked), verified-only public query layer, dev seed |
| 3. College profile | Clery statistics explorer, verbatim footnotes, response, resources, timeline, coverage, citations |
| 4. Case timelines | Legal-status badges, attributed events, superseded events, corrections, outcome-not-located |
| Discovery job (manual) | `pnpm discover`: feeds + GDELT → `candidate_item` (dev only, never publishes) |

## Next

### 5. Admin / research interface
Login (env password + signed cookie via `proxy.ts`), forms for every entity, statistics entry grid,
citation attachment, verification workflow + audit log, preview, and the **candidate inbox**
(dismiss, or accept → draft source + draft coverage).

### 6. Learn, SEO
Scenario content review, sitemap, structured metadata.

### 7. Deployment and scheduled discovery
Deferred until the inbox exists, since candidates are only useful once researchers can triage them.

- [ ] Route handler `src/app/api/cron/discover/route.ts`: requires `Authorization: Bearer $CRON_SECRET`,
      calls `runDiscovery()`, returns the run summary, raised `maxDuration`.
- [ ] `vercel.json` cron entry (e.g. `0 11 * * *`). Hobby plan: at most once per day with imprecise timing;
      more frequent runs need Pro or a GitHub Actions schedule calling the same route.
- [ ] Vercel env vars: `CRON_SECRET`, `DATABASE_URL`, `MIGRATION_DATABASE_URL`, `ADMIN_PASSWORD`,
      `ADMIN_SESSION_SECRET`.
- [ ] Migrate the production database, **schema only, no seed** (`pnpm db:migrate:prod`), after reviewing
      the migration plan. Vercel crons only run on production deployments, which use the production DB.
- [ ] Re-test GDELT from Vercel. On 2026-09-29 it returned HTTP 429 to every request from the dev network.
- [ ] Manual trigger for verification: `curl -H "Authorization: Bearer $CRON_SECRET" https://<app>/api/cron/discover`.

### 8. README
Setup, architecture, editorial principles, and how verified data is added.

## Research backlog

- [ ] Cornell Annual Security Report: enter as `pending_review` (source + archived copy, statistics and
      footnotes verbatim with page references) for human verification through the admin.
- [ ] Discovery gaps: Cornell Chronicle, statements.cornell.edu, The Harvard Crimson, Columbia Daily
      Spectator, Columbia News (see `src/jobs/discovery/sources.ts`).
- [ ] Cornell candidates from the first discovery run (developing Chi Phi case): triage in the inbox and
      verify against primary records before any case record is created.

## Future work (outside MVP)

- PDF ingestion that extracts candidate statistics/footnotes as `pending_review` (never auto-published)
- Import of federal Campus Safety and Security data
- Two-person verification rule; full auth and roles
- Full-text search; remaining Ivy League, then nationwide coverage
- Automated archiving of source URLs (Wayback Machine) and link-health checks
- AI-assisted triage ranking for the inbox (assists researchers; never publishes)

## Known polish items

- On phones, the four data-quality notes on profiles take roughly a screen; consider a compact variant.
- Demo seed has no superseded case event, so that UI state is only covered by tests.
