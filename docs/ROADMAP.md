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
| 5b. Admin: profile content and cases | Responses, policies, resources, timeline, coverage, corrections; cases with events, case corrections; profile and case previews |
| Chi Phi case (research) | `research/cornell-chi-phi.ts`: 9 primary sources, case + 9 events, imported as pending review |
| Discovery: court dockets | CourtListener federal dockets naming each institution as a party → inbox leads; "source only" accept for dockets |
| Discovery: Google News | Keyless Google News search per college; publisher URL required on accept; headline de-dup and re-filing; terms cover crimes against women broadly (shared list in `src/jobs/discovery/terms.ts`); Columbia results must name Columbia in the headline |

## Next

### Research follow-up: Chi Phi case and other Cornell cases
- [ ] Verify the Chi Phi case against its sources; add excerpts for the government and university statements after opening each page.
- [ ] Re-scope the three Cornell coverage drafts to the case (scope "About a specific case").
- [ ] Not yet entered: the AG's review of Cornell's response (no primary record found), Cornell's agreement to an
      independent review, Cornell's edited FAQ, and the fraternity member's suit to remove allegations.
- [ ] Other Cornell leads: federal dockets now in the inbox (e.g. Doe v. Cornell University, N.D.N.Y. 2025); a 2016
      sexual assault suit; a 1996 state ruling on harassment procedures.
- [ ] Docket leads are federal only. State-court suits arrive through news discovery; consider NYSCEF monitoring later.

Decisions in force: editing a published record returns it to `pending_review` until re-verified; self-verification is
allowed but "entered by / reviewed by" is shown; only draft or rejected records can be deleted; a case needs an editorial
justification, an institution, and a verified, cited event before it can be verified.

### 6. Learn, SEO
- [x] SEO: `metadataBase` from `NEXT_PUBLIC_SITE_URL` or the Vercel production domain; canonical URLs and full
      Open Graph tags per page (`src/lib/seo.ts`); `robots.ts` (indexable only when `VERCEL_ENV=production`, with
      `/admin`, `/api/` and `/search` disallowed); `sitemap.ts` listing published colleges and cases (never demo or
      unpublished), hourly; generated share cards for the site, each college and each case; JSON-LD (WebSite and
      Organization on the home page, BreadcrumbList on colleges and cases, Dataset for a college's Clery statistics).
- [x] Draft lessons (`status: "placeholder"`) are noindexed and left out of the sitemap, as is `/learn` until a lesson is reviewed.
- [ ] Scenario content review: mark lessons `reviewed` once editorially approved, which adds them to search.
- [ ] After launch: submit the sitemap in Google Search Console and test pages with the Rich Results Test.

### 7. Deployment and scheduled discovery
Deferred until the inbox exists, since candidates are only useful once researchers can triage them.

- [ ] Route handler `src/app/api/cron/discover/route.ts`: requires `Authorization: Bearer $CRON_SECRET`,
      calls `runDiscovery()`, returns the run summary, raised `maxDuration`.
- [ ] `vercel.json` cron entry (e.g. `0 11 * * *`). Hobby plan: at most once per day with imprecise timing;
      more frequent runs need Pro or a GitHub Actions schedule calling the same route.
- [ ] Vercel env vars: `CRON_SECRET`, `DATABASE_URL` (session pooler, port 5432), `MIGRATION_DATABASE_URL`,
      `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, optionally `NEXT_PUBLIC_SITE_URL` once a custom domain is set.
- [x] Migrate the production database, schema only (2026-10-04). Non-demo dev data was then copied to production
      with the same IDs; dev and production are edited independently from here.
- [ ] Database connections: the app must use Supabase's **session** pooler (port 5432); the transaction pooler hangs
      under concurrent queries with postgres.js (see `src/db/client.ts`). Session-pooler connections are limited, so set a
      small per-instance `max` on Vercel and confirm the pool size under load before launch. Dev hit the 15-client
      session pool limit (`EMAXCONNSESSION`) until clients were capped at 4 with a 20 s idle timeout.
- [ ] Re-test GDELT from Vercel. On 2026-09-29 it returned HTTP 429 to every request from the dev network.
- [ ] Manual trigger for verification: `curl -H "Authorization: Bearer $CRON_SECRET" https://<app>/api/cron/discover`.

### 8. README
Setup, architecture, editorial principles, and how verified data is added.

## Research backlog

- [x] Cornell Annual Security Reports 2025 and 2026 (Ithaca campus) transcribed in `research/cornell-university.ts`
      and imported as `pending_review` (`pnpm import-research cornell-university`).
- [ ] Human verification of the Cornell transcription against the PDFs (page 6 of each report), then verify the
      college record to publish the profile.
- [x] Cornell institutional record (7 responses, Policy 6.4, 11 resources) transcribed from the 2026 ASR in
      `research/cornell-institutional.ts` and imported as `pending_review` (`pnpm import-research cornell-institutional`).
- [ ] Verify the Cornell institutional records against ASR pp. 6, 20–23, 33.
- [ ] Cornell follow-up research: Policy 6.4 title/effective date and current procedures, and the Office of Civil
      Rights statistical summaries (officeofcivilrights.cornell.edu blocks automated retrieval; needs a browser and an
      archived copy).
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
