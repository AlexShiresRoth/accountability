import Link from "next/link";
import { ActionForm } from "@/components/admin/action-form";
import { SelectField, TextArea, TextField } from "@/components/admin/fields";
import { db } from "@/db";
import { listCandidates } from "@/lib/admin/inbox";
import { caseOptions, listColleges } from "@/lib/admin/queries";
import { requireResearcherPage } from "@/lib/admin/session";
import { candidateStatuses, coverageTopics, type CandidateStatus } from "@/lib/enums";
import { coverageTopicLabels } from "@/lib/labels";
import { sourceTypes } from "@/lib/source-types";
import { isGoogleNewsUrl } from "@/jobs/discovery/google-news";
import { gdeltQueries } from "@/jobs/discovery/sources";
import { acceptCandidateAction, dismissCandidateAction } from "../actions";

export const metadata = { title: "Inbox" };

const tabLabels: Record<CandidateStatus, string> = { new: "New", accepted: "Accepted", dismissed: "Dismissed" };

/** Search results only have to mention the college somewhere in the article; flag headlines that don't. */
function headlineMissesCollege(title: string | null, slug: string | null): string | null {
  const shortName = gdeltQueries.find((q) => q.collegeSlug === slug)?.shortName;
  if (!title || !shortName) return null;
  return new RegExp(`\\b${shortName}\\b`, "i").test(title) ? null : shortName;
}

export default async function InboxPage({ searchParams }: PageProps<"/admin/inbox">) {
  await requireResearcherPage();
  const raw = (await searchParams).status;
  const status = (candidateStatuses as readonly string[]).includes(String(raw)) ? (raw as CandidateStatus) : "new";
  const [items, colleges, cases] = await Promise.all([listCandidates(db, status), listColleges(db), caseOptions(db)]);

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
            href={`/admin/inbox?status=${st}`}
            aria-current={st === status ? "page" : undefined}
            className={`-mb-px border-b-2 px-1 pb-2 no-underline ${st === status ? "border-ink text-ink" : "border-transparent text-ink-muted"}`}
          >
            {tabLabels[st]}
          </Link>
        ))}
      </nav>

      {items.length === 0 && <p className="text-ink-muted">No {tabLabels[status].toLowerCase()} items.</p>}

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
            {status === "new" && headlineMissesCollege(c.title, c.collegeSlug) && (
              <p className="mt-1 text-xs font-medium text-caution-ink">
                Headline doesn&rsquo;t mention {headlineMissesCollege(c.title, c.collegeSlug)}. The article may only mention it in passing.
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
                          defaultValue="institutional"
                          options={[
                            { value: "institutional", label: "Institution-level" },
                            { value: "case", label: "About a specific case" },
                          ]}
                          hint="Case-specific coverage is only published once the linked case is verified."
                        />
                        <SelectField
                          name="caseId"
                          label="Case (if case-specific)"
                          placeholder="—"
                          options={cases.map((k) => ({ value: k.id, label: k.title }))}
                        />
                        <SelectField
                          name="sourceType"
                          label="Source type"
                          required
                          defaultValue="reputable_journalism"
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
                        label="Neutral summary (shown publicly)"
                        required
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
    </div>
  );
}
