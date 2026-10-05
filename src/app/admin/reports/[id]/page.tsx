import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionForm } from "@/components/admin/action-form";
import { PublishedEditWarning, TextArea, TextField } from "@/components/admin/fields";
import { SourcePicker } from "@/components/admin/source-picker";
import { sourceScopeFor } from "@/components/admin/source-scope";
import { CitationsPanel, DeletePanel, StatusPanel } from "@/components/admin/panels";
import { StatusBadge, statusLabels } from "@/components/admin/status";
import { StatusSelect } from "@/components/admin/status-select";
import { db } from "@/db";
import { getReport, sourceOptions } from "@/lib/admin/queries";
import { cellKey, unfoundedKey } from "@/lib/admin/records";
import { requireResearcherPage } from "@/lib/admin/session";
import { cleryGeographies, offenses, verificationStatuses, type CleryGeography, type VerificationStatus } from "@/lib/enums";
import { geographyLabels, offenseLabels } from "@/lib/labels";
import {
  changeStatusAction,
  createFootnoteAction,
  saveGridAction,
  setFootnoteLinksAction,
  updateFootnoteAction,
  updateReportAction,
} from "../../actions";

export const metadata = { title: "Clery report" };

const cellStatusStyle: Record<VerificationStatus, string> = {
  draft: "border-rule-strong",
  pending_review: "border-caution-rule",
  verified: "border-ink",
  needs_update: "border-caution-rule",
  rejected: "border-rule-strong line-through opacity-60",
};

export default async function ReportAdmin({ params }: PageProps<"/admin/reports/[id]">) {
  await requireResearcherPage();
  const data = await getReport(db, (await params).id);
  if (!data) notFound();
  const { report, college, source, statistics, footnotes, links } = data;
  const sources = await sourceOptions(db);
  const sourceScope = await sourceScopeFor([college.id], sources);

  const byKey = new Map(statistics.map((st) => [cellKey(st.calendarYear, st.offense, st.geography), st]));
  const years = [...new Set([report.reportYear - 3, report.reportYear - 2, report.reportYear - 1, ...statistics.map((st) => st.calendarYear)])].sort();
  const label = (st: (typeof statistics)[number]) => `${st.calendarYear} ${offenseLabels[st.offense]}, ${geographyLabels[st.geography].toLowerCase()}`;
  const sortedStats = [...statistics].sort(
    (a, b) =>
      cleryGeographies.indexOf(a.geography) - cleryGeographies.indexOf(b.geography) ||
      offenses.indexOf(a.offense) - offenses.indexOf(b.offense) ||
      a.calendarYear - b.calendarYear,
  );

  return (
    <div className="space-y-10">
      <div>
        <p className="text-sm text-ink-muted">
          <Link href="/admin/colleges">Colleges</Link> / <Link href={`/admin/colleges/${college.id}`}>{college.name}</Link> /
        </p>
        <h1 className="text-2xl">{report.title}</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Source: <Link href={`/admin/sources/${source.id}`}>{source.title}</Link> <StatusBadge status={source.status} />
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-4">
          <PublishedEditWarning status={report.status} />
          <ActionForm action={updateReportAction.bind(null, report.id, college.id)} submitLabel="Save report details">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField name="reportYear" label="Report year" type="number" required defaultValue={report.reportYear} />
              <TextField name="title" label="Title" required defaultValue={report.title} />
            </div>
            <SourcePicker name="sourceId" label="Source document" required defaultValue={source.id} sources={sources} scope={sourceScope} />
          </ActionForm>
          <CitationsPanel recordKey="clery_report" recordId={report.id} />
        </div>
        <div className="space-y-4">
          <StatusPanel
            recordKey="clery_report"
            record={report}
            extra={
              <label className="flex items-start gap-2 text-sm">
                <input type="checkbox" name="withContents" defaultChecked className="mt-1" />
                <span>When verifying, also verify this report&rsquo;s unverified figures and notes (rejected ones are left alone).</span>
              </label>
            }
          />
          <DeletePanel recordKey="clery_report" id={report.id} status={report.status} redirectTo={`/admin/colleges/${college.id}`} />
        </div>
      </div>

      <section aria-labelledby="grid" className="space-y-4">
        <h2 id="grid" className="text-xl">
          Statistics
        </h2>
        <p className="max-w-[75ch] text-ink-muted">
          Transcribe exactly as printed. Leave blank if the report has no such cell; enter <strong>-</strong> if the report
          shows the figure as unavailable; enter <strong>0</strong> only when the report prints zero. Residential figures are
          a subset of on-campus figures: enter them as printed, never subtracted or added. Cell borders show status: dark =
          verified, amber = pending review.
        </p>
        <ActionForm action={saveGridAction.bind(null, report.id)} submitLabel="Save figures">
          <div className="grid gap-6 xl:grid-cols-2">
            {cleryGeographies.map((geo) => (
              <GridTable key={geo} geo={geo} years={years} byKey={byKey} kind="count" />
            ))}
          </div>
          <details open={statistics.some((st) => st.unfoundedCount !== null)} className="border border-rule p-3">
            <summary className="cursor-pointer font-medium">Unfounded reports</summary>
            <p className="mt-2 max-w-[75ch] text-sm text-ink-muted">
              Reports that sworn law enforcement determined, after full investigation, to be false or baseless. Reports list
              these separately and they are not part of the figure above. Leave blank (or &ldquo;-&rdquo;) if the report
              gives none; enter the figure itself first.
            </p>
            <div className="mt-4 grid gap-6 xl:grid-cols-2">
              {cleryGeographies.map((geo) => (
                <GridTable key={geo} geo={geo} years={years} byKey={byKey} kind="unfounded" />
              ))}
            </div>
          </details>
        </ActionForm>
      </section>

      {sortedStats.length > 0 && (
        <section aria-labelledby="figures" className="space-y-3">
          <h2 id="figures" className="text-xl">
            Review individual figures
          </h2>
          <p className="max-w-[75ch] text-ink-muted">
            Verifying the report verifies its figures in one step. Use this list to reject, or separately re-verify, a single
            figure. A figure can only be verified once its report is verified.
          </p>
          <details>
            <summary className="cursor-pointer font-medium">All {sortedStats.length} figures</summary>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-rule-strong">
                    <th className="py-2 pr-3 font-medium">Figure</th>
                    <th className="py-2 pr-3 text-right font-medium">Value</th>
                    <th className="py-2 pr-3 font-medium">Status</th>
                    <th className="py-2 font-medium">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedStats.map((st) => (
                    <tr key={st.id} className="border-b border-rule align-top">
                      <td className="py-2 pr-3">{label(st)}</td>
                      <td className="tabular py-2 pr-3 text-right">
                        {st.count === null ? "—" : st.count}
                        {st.unfoundedCount !== null && <span className="text-ink-muted"> (+{st.unfoundedCount} unfounded)</span>}
                      </td>
                      <td className="py-2 pr-3">
                        <StatusBadge status={st.status} />
                        {st.reviewedBy && <span className="block text-xs text-ink-muted">by {st.reviewedBy}</span>}
                      </td>
                      <td className="py-2">
                        <ActionForm
                          action={changeStatusAction.bind(null, "crime_statistic", st.id)}
                          submitLabel="Update status"
                          variant="secondary"
                          className="flex flex-wrap items-start gap-2"
                        >
                          <StatusSelect
                            key={st.status}
                            compact
                            label={`New status for ${label(st)}`}
                            current={st.status}
                            defaultValue=""
                            placeholder="Choose…"
                            options={verificationStatuses.filter((v) => v !== st.status).map((v) => ({ value: v, label: statusLabels[v] }))}
                          />
                          <input
                            name="note"
                            aria-label={`Note for ${label(st)}`}
                            placeholder="Note (why)"
                            className="w-40 border border-rule-strong bg-surface px-2 py-1 text-sm"
                          />
                        </ActionForm>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </section>
      )}

      <section aria-labelledby="footnotes" className="space-y-4">
        <h2 id="footnotes" className="text-xl">
          Footnotes
        </h2>
        <p className="max-w-[75ch] text-ink-muted">
          Copy footnotes verbatim. Then tick the figures each one applies to, so it appears next to them on the profile.
        </p>

        {footnotes.map((fn) => {
          const linked = new Set(links.filter((l) => l.footnoteId === fn.id).map((l) => l.statisticId));
          return (
            <article key={fn.id} className="space-y-4 border border-rule p-4">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-sans text-base font-semibold">Footnote {fn.marker && `“${fn.marker}”`}</h3>
                <StatusBadge status={fn.status} />
                <span className="text-sm text-ink-muted">applies to {linked.size} figure(s)</span>
              </div>
              <PublishedEditWarning status={fn.status} />
              <ActionForm action={updateFootnoteAction.bind(null, fn.id)} submitLabel="Save footnote">
                <FootnoteFields footnote={fn} />
              </ActionForm>
              <details>
                <summary className="cursor-pointer text-sm font-medium">Figures this note applies to</summary>
                {sortedStats.length === 0 ? (
                  <p className="mt-2 text-sm text-ink-muted">Enter figures above first.</p>
                ) : (
                  <ActionForm action={setFootnoteLinksAction.bind(null, fn.id)} submitLabel="Save links" className="mt-3 space-y-3">
                    <div className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2 lg:grid-cols-3">
                      {sortedStats.map((st) => (
                        <label key={st.id} className="flex items-center gap-2">
                          <input type="checkbox" name="stat" value={st.id} defaultChecked={linked.has(st.id)} />
                          {label(st)}
                        </label>
                      ))}
                    </div>
                  </ActionForm>
                )}
              </details>
              <details>
                <summary className="cursor-pointer text-sm font-medium">Verification and citations</summary>
                <div className="mt-3 grid gap-4 lg:grid-cols-2">
                  <StatusPanel recordKey="statistic_footnote" record={fn} />
                  <div className="space-y-4">
                    <CitationsPanel recordKey="statistic_footnote" recordId={fn.id} />
                    <DeletePanel recordKey="statistic_footnote" id={fn.id} status={fn.status} redirectTo={`/admin/reports/${report.id}`} />
                  </div>
                </div>
              </details>
            </article>
          );
        })}

        <details className="border border-dashed border-rule-strong p-4">
          <summary className="cursor-pointer font-medium">Add a footnote</summary>
          <div className="mt-3">
            <ActionForm action={createFootnoteAction.bind(null, report.id)} submitLabel="Add footnote">
              <FootnoteFields />
            </ActionForm>
          </div>
        </details>
      </section>
    </div>
  );
}

function FootnoteFields({ footnote }: { footnote?: { marker: string | null; page: string | null; originalText: string; summary: string | null } }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="marker" label="Marker" defaultValue={footnote?.marker} hint="As printed, e.g. * or 3." />
        <TextField name="page" label="Page" defaultValue={footnote?.page} hint="e.g. p. 41" />
      </div>
      <TextArea name="originalText" label="Footnote text, verbatim" required rows={3} defaultValue={footnote?.originalText} />
      <TextArea name="summary" label="Plain-language summary (optional)" rows={2} defaultValue={footnote?.summary} hint="Shown as “In plain terms”, alongside the verbatim text." />
    </>
  );
}

type Stat = { count: number | null; unfoundedCount: number | null; status: VerificationStatus };

function GridTable({ geo, years, byKey, kind }: { geo: CleryGeography; years: number[]; byKey: Map<string, Stat>; kind: "count" | "unfounded" }) {
  return (
    <fieldset className="border border-rule p-3">
      <legend className="px-1 font-medium">
        {geographyLabels[geo]}
        {kind === "unfounded" && <span className="font-normal text-ink-muted">: unfounded</span>}
      </legend>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="py-1 pr-2 text-left font-medium">Offense</th>
            {years.map((y) => (
              <th key={y} className="tabular px-1 py-1 text-right font-medium">
                {y}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {offenses.map((o) => (
            <tr key={o}>
              <th scope="row" className="py-1 pr-2 text-left font-normal">
                {offenseLabels[o]}
              </th>
              {years.map((y) => {
                const st = byKey.get(cellKey(y, o, geo));
                const value = kind === "count" ? (st ? (st.count === null ? "-" : String(st.count)) : "") : (st?.unfoundedCount ?? "");
                return (
                  <td key={y} className="px-1 py-1">
                    <input
                      name={kind === "count" ? cellKey(y, o, geo) : unfoundedKey(y, o, geo)}
                      aria-label={`${y} ${offenseLabels[o]}, ${geographyLabels[geo]}${kind === "unfounded" ? ", unfounded" : ""}`}
                      defaultValue={value}
                      inputMode="numeric"
                      autoComplete="off"
                      className={`tabular w-full min-w-12 border-2 bg-surface px-1.5 py-1 text-right ${st ? cellStatusStyle[st.status] : "border-rule"}`}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </fieldset>
  );
}
