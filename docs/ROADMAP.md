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
| 5a. Admin core | Sign-in, dashboard, verification workflow + audit log, inbox, sources, colleges, reports, statistics grid, footnotes, citations |
| 5a follow-ups | Unfounded counts in the grid and on profiles; per-figure status review on report pages |
| Discovery: Google News | Keyless Google News search per college; publisher URL required on accept; headline de-dup and re-filing; terms cover crimes against women broadly (shared list in `src/jobs/discovery/terms.ts`); Columbia results must name Columbia in the headline |

## Next

### 5b. Admin: remaining records
Cases and events (with superseded-event links), accountability timeline entries, institutional responses,
policies, student resources, coverage, corrections, and preview of public pages including unverified records.

Decisions in force (5a): editing a published record returns it to `pending_review` until re-verified;
self-verification is allowed but "entered by / reviewed by" is shown; only draft or rejected records can be deleted.

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

- [x] Cornell Annual Security Reports 2025 and 2026 (Ithaca campus) transcribed in `research/cornell-university.ts`
      and imported as `pending_review` (`pnpm import-research cornell-university`).
- [ ] Human verification of the Cornell transcription against the PDFs (page 6 of each report), then verify the
      college record to publish the profile.
- [ ] Multi-campus institutions: Cornell publishes separate reports for Ithaca, Cornell Tech, and Weill Cornell Medicine,
      but the schema allows one report per college per year. Decide whether to add a campus dimension.
- [ ] Discovery gaps: Cornell Chronicle, statements.cornell.edu, The Harvard Crimson, Columbia Daily
      Spectator, Columbia News (see `src/jobs/discovery/sources.ts`).
- [ ] Cornell candidates from the first discovery run (developing Chi Phi case): triage in the inbox and
      verify against primary records before any case record is created.

- [ ] Columbia headline rule trades recall for precision (~3 relevant of ~40 dropped in a 90-day test, e.g. essays
      that reference Columbia only in the body). Revisit if a Columbia Spectator feed or GDELT becomes available.

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
