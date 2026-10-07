import Link from "next/link";
import { ActionForm } from "@/components/admin/action-form";
import { SelectField, TextArea, TextField } from "@/components/admin/fields";
import { db } from "@/db";
import { candidateCounts, candidateCountsByCollege, listCandidates, type CollegeFilter } from "@/lib/admin/inbox";
import { Pagination } from "@/components/admin/pagination";
import { caseOptions, listColleges } from "@/lib/admin/queries";
import { requireResearcherPage } from "@/lib/admin/session";
import { candidateStatuses, coverageTopics, type CandidateStatus } from "@/lib/enums";
import { coverageTopicLabels } from "@/lib/labels";
import { sourceTypes } from "@/lib/source-types";
import { isGoogleNewsUrl } from "@/jobs/discovery/google-news";
import { isCourtListenerUrl } from "@/jobs/discovery/courtlistener";
import { feeds, gdeltQueries } from "@/jobs/discovery/sources";
import { acceptCandidateAction, dismissCandidateAction } from "../actions";

export const metadata = { title: "Inbox" };

const tabLabels: Record<CandidateStatus, string> = { new: "New", accepted: "Accepted", dismissed: "Dismissed" };

/**
 * Search results only have to mention the college somewhere in the article; flag headlines that don't.
 * Campus-feed items are skipped: a campus paper rarely names its own school in a headline.
 */
function headlineMissesCollege(title: string | null, slug: string | null, publisher: string | null): string | null {
  const shortName = gdeltQueries.find((q) => q.collegeSlug === slug)?.shortName;
  if (!title || !shortName) return null;
  if (feeds.some((f) => f.collegeSlug === slug && f.publisher === publisher)) return null;
  return new RegExp(`\\b${shortName}\\b`, "i").test(title) ? null : shortName;
}

export default async function InboxPage({ searchParams }: PageProps<"/admin/inbox">) {
  await requireResearcherPage();
  const query = await searchParams;
  const raw = query.status;
  const status = (candidateStatuses as readonly string[]).includes(String(raw)) ? (raw as CandidateStatus) : "new";
  const requestedPage = Number(Array.isArray(query.page) ? query.page[0] : query.page) || 1;
  const colleges = await listColleges(db);
  // ?school=<college slug>, or "none" for items no college was matched to. Anything else shows all schools.
  const school = String(Array.isArray(query.school) ? query.school[0] : (query.school ?? ""));
  const schoolCollege = colleges.find((c) => c.slug === school);
  const collegeFilter: CollegeFilter = school === "none" ? null : schoolCollege?.id;
  const schoolParam: Record<string, string> = collegeFilter === undefined ? {} : { school };
  const [result, counts, bySchool, cases] = await Promise.all([
    listCandidates(db, status, requestedPage, undefined, collegeFilter),
    candidateCounts(db, collegeFilter),
    candidateCountsByCollege(db, status),
    caseOptions(db),
  ]);
  const allInStatus = [...bySchool.values()].reduce((a, b) => a + b, 0);
  const schoolTabs = [
    { key: "", label: "All schools", n: allInStatus },
    ...colleges.filter((c) => !c.isDemo || bySchool.has(c.id)).map((c) => ({ key: c.slug, label: c.name, n: bySchool.get(c.id) ?? 0 })),
    ...(bySchool.has(null) ? [{ key: "none", label: "No school matched", n: bySchool.get(null)! }] : []),
  ];
  const activeSchool = collegeFilter === undefined ? "" : school;
  const scopeLabel = collegeFilter === undefined ? "" : collegeFilter === null ? " with no school matched" : ` for ${schoolCollege!.name}`;
  const { items } = result;
  const pager = (
    <Pagination
      page={result.page}
      pageCount={result.pageCount}
      total={result.total}
      pageSize={result.pageSize}
      basePath="/admin/inbox"
      params={{ status, ...schoolParam }}
      label={`${tabLabels[status].toLowerCase()} items${scopeLabel}`}
    />
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl">Inbox</h1>
        <p className="mt-2 max-w-[70ch] text-ink-muted">
          Items found by the discovery job. Nothing here is public. Accepting creates a <strong>draft</strong> source and
          coverage entry for verification. Headlines are the publisher&rsquo;s; the public site shows your summary instead.
        </p>
      </div>

      <nav aria-label="Inbox status" className="flex gap-4 border-b border-rule">
        {candidateStatuses.map((st) => (
          <Link
            key={st}
            href={`/admin/inbox?${new URLSearchParams({ status: st, ...schoolParam })}`}
            aria-current={st === status ? "page" : undefined}
            className={`-mb-px border-b-2 px-1 pb-2 no-underline ${st === status ? "border-ink text-ink" : "border-transparent text-ink-muted"}`}
          >
            {tabLabels[st]} <span className="tabular text-sm text-ink-muted">({counts[st]})</span>
          </Link>
        ))}
      </nav>

      <nav aria-label="School" className="flex flex-wrap gap-2 text-sm">
        {schoolTabs.map((t) => (
          <Link
            key={t.key || "all"}
            href={`/admin/inbox?${new URLSearchParams({ status, ...(t.key ? { school: t.key } : {}) })}`}
            aria-current={t.key === activeSchool ? "page" : undefined}
            className={`border px-3 py-1 no-underline ${t.key === activeSchool ? "border-ink bg-ink text-paper" : "border-rule-strong text-ink hover:border-ink"}`}
          >
            {t.label} <span className={`tabular ${t.key === activeSchool ? "" : "text-ink-muted"}`}>({t.n})</span>
          </Link>
        ))}
      </nav>

      {items.length === 0 ? <p className="text-ink-muted">No {tabLabels[status].toLowerCase()} items{scopeLabel}.</p> : pager}

      <ul className="space-y-6">
        {items.map((c) => (
          <li key={c.id} className="border border-rule p-4">
            <p className="text-sm text-ink-muted">
              {c.collegeName ?? "No college matched"} · {c.publisher ?? "Unknown publisher"} ·{" "}
              {c.publishedAt ? c.publishedAt.toISOString().slice(0, 10) : "undated"}
              {c.suggestedTopic && ` · suggested: ${coverageTopicLabels[c.suggestedTopic]}`}
            </p>
            <p className="mt-1 font-medium">
              <a href={c.url} target="_blank" rel="noopener noreferrer">
                {c.title ?? c.url}
              </a>
              {isGoogleNewsUrl(c.url) && <span className="ml-2 text-xs font-normal text-ink-muted">(opens via Google News)</span>}
            </p>
            {status === "new" && headlineMissesCollege(c.title, c.collegeSlug, c.publisher) && (
              <p className="mt-1 text-xs font-medium text-caution-ink">
                Headline doesn&rsquo;t mention {headlineMissesCollege(c.title, c.collegeSlug, c.publisher)}. The article may only mention it in passing.
              </p>
            )}
            {c.caseId && c.caseTitle && (
              <p className="mt-1 text-sm font-medium">
                Possible update to: <Link href={`/admin/cases/${c.caseId}`}>{c.caseTitle}</Link>
              </p>
            )}
            {c.snippet && <p className="mt-1 text-ink-muted">{c.snippet}</p>}
            {status !== "new" && (
              <p className="mt-2 text-sm text-ink-muted">
                {tabLabels[status]} by {c.reviewedBy ?? "—"}
                {c.acceptedSourceId && (
                  <>
                    {" "}
                    · <Link href={`/admin/sources/${c.acceptedSourceId}`}>draft source</Link>
                  </>
                )}
              </p>
            )}

            {status === "new" && (
              <div className="mt-4 flex flex-wrap items-start gap-6">
                <details className="min-w-0 flex-1">
                  <summary className="cursor-pointer font-medium">Accept…</summary>
                  <div className="mt-3">
                    <ActionForm action={acceptCandidateAction.bind(null, c.id)} submitLabel="Accept as draft">
                      <SelectField
                        name="mode"
                        label="Create"
                        required
                        defaultValue={isCourtListenerUrl(c.url) ? "source_only" : "coverage"}
                        options={[
                          { value: "coverage", label: "Source and coverage entry (shown on the profile)" },
                          { value: "source_only", label: "Source only (e.g. a court docket to cite in a case)" },
                        ]}
                        hint={isCourtListenerUrl(c.url) ? "Court dockets are leads: save the docket as a source, then build the case under Cases and cite it." : undefined}
                      />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <SelectField
                          name="collegeId"
                          label="College"
                          required
                          defaultValue={c.collegeId}
                          options={colleges.map((col) => ({ value: col.id, label: col.name }))}
                        />
                        <SelectField
                          name="topic"
                          label="Topic"
                          required
                          defaultValue={c.suggestedTopic ?? "other"}
                          options={coverageTopics.map((t) => ({ value: t, label: coverageTopicLabels[t] }))}
                        />
                        <SelectField
                          name="scope"
                          label="Scope"
                          required
                          defaultValue={c.caseId ? "case" : "institutional"}
                          options={[
                            { value: "institutional", label: "Institution-level" },
                            { value: "case", label: "About a specific case" },
                          ]}
                          hint="Case-specific coverage is only published once the linked case is verified."
                        />
                        <SelectField
                          name="caseId"
                          label="Case (if case-specific)"
                          defaultValue={c.caseId}
                          placeholder="—"
                          options={cases.map((k) => ({ value: k.id, label: k.title }))}
                          hint="Choosing a case makes this case-specific coverage."
                        />
                        <SelectField
                          name="sourceType"
                          label="Source type"
                          required
                          defaultValue={isCourtListenerUrl(c.url) ? "court_record" : "reputable_journalism"}
                          options={Object.entries(sourceTypes).map(([value, t]) => ({ value, label: t.label }))}
                        />
                        <TextField name="publisher" label="Publisher" required defaultValue={c.publisher} />
                        <TextField
                          name="publicationDate"
                          label="Publication date"
                          type="date"
                          defaultValue={c.publishedAt?.toISOString().slice(0, 10)}
                        />
                        <TextField name="title" label="Headline (stored on the source)" required defaultValue={c.title} />
                        {isGoogleNewsUrl(c.url) && (
                          <div className="sm:col-span-2">
                            <TextField
                              name="articleUrl"
                              label="Publisher's article URL"
                              type="url"
                              required
                              hint="Found via Google News, whose links don't point at the publisher. Open the article above, then paste the address from your browser."
                            />
                          </div>
                        )}
                      </div>
                      <TextArea
                        name="summary"
                        label="Neutral summary (shown publicly; not needed for source only)"
                        rows={2}
                        hint="One sentence in your words, attributed where needed: e.g. “Reports that the district attorney reopened an investigation.” Do not name victims."
                      />
                    </ActionForm>
                  </div>
                </details>
                <ActionForm action={dismissCandidateAction.bind(null, c.id)} submitLabel="Dismiss" variant="secondary" className="flex items-center gap-2" />
              </div>
            )}
          </li>
        ))}
      </ul>

      {items.length > 0 && result.pageCount > 1 && pager}
    </div>
  );
}
