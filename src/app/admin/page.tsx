import Link from "next/link";
import { ActionForm } from "@/components/admin/action-form";
import { DiscoveryRuns } from "@/components/admin/discovery-runs";
import { SelectField } from "@/components/admin/fields";
import { StatusBadge, statusLabels } from "@/components/admin/status";
import { db } from "@/db";
import * as s from "@/db/schema";
import { gdeltQueries } from "@/jobs/discovery/sources";
import { ALL_SCHOOLS, lookbackDays } from "@/lib/admin/discovery";
import { casesDueForCheck } from "@/lib/admin/monitoring";
import { dashboard, recentDiscoveryRuns } from "@/lib/admin/queries";
import { formatDate } from "@/lib/dates";
import { requireResearcherPage } from "@/lib/admin/session";
import { reviewTables, type ReviewTableKey } from "@/lib/admin/workflow";
import { verificationStatuses } from "@/lib/enums";
import { runDiscoveryAction, triageInboxAction } from "./actions";

export const metadata = { title: "Dashboard" };

// Server actions on this page include a manual discovery run (all schools: a few minutes of spaced court searches).
export const maxDuration = 300;

const lookbackLabels: Record<(typeof lookbackDays)[number], string> = {
  2: "Last 2 days (same as the daily run)",
  30: "Last 30 days",
  90: "Last 90 days (backfill)",
};

export default async function AdminDashboard() {
  await requireResearcherPage();
  const [{ counts, inbox, recent, awaiting }, runs, dueCases, colleges] = await Promise.all([
    dashboard(db),
    recentDiscoveryRuns(db),
    casesDueForCheck(db),
    db.select({ slug: s.colleges.slug, name: s.colleges.name }).from(s.colleges).orderBy(s.colleges.name),
  ]);
  const covered = new Set(gdeltQueries.map((q) => q.collegeSlug));
  const schoolOptions = [
    ...colleges.filter((c) => covered.has(c.slug)).map((c) => ({ value: c.slug, label: c.name })),
    { value: ALL_SCHOOLS, label: "All schools" },
  ];

  return (
    <div className="space-y-10">
      <h1 className="text-3xl">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/admin/inbox" className="block border border-rule p-4 text-ink no-underline hover:bg-surface">
          <p className="text-sm text-ink-muted">Inbox</p>
          <p className="text-2xl font-semibold">{inbox}</p>
          <p className="text-sm text-ink-muted">discovered items awaiting triage</p>
        </Link>
        <div className="border border-rule p-4">
          <p className="text-sm text-ink-muted">Awaiting review</p>
          <p className="text-2xl font-semibold">{awaiting.length}</p>
          <p className="text-sm text-ink-muted">records marked pending review</p>
        </div>
      </div>

      <section aria-labelledby="awaiting">
        <h2 id="awaiting" className="text-xl">
          Awaiting review
        </h2>
        {awaiting.length === 0 ? (
          <p className="mt-2 text-ink-muted">Nothing is waiting for review.</p>
        ) : (
          <ul className="mt-3 divide-y divide-rule border-y border-rule">
            {awaiting.map((a) => (
              <li key={`${a.kind}-${a.id}-${a.label}`} className="flex flex-wrap items-baseline justify-between gap-2 py-2">
                <span>
                  <span className="text-sm text-ink-muted">{a.kind}</span> · <Link href={a.href}>{a.label}</Link>
                </span>
                {a.createdBy && <span className="text-sm text-ink-muted">entered by {a.createdBy}</span>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="cases-to-check">
        <h2 id="cases-to-check" className="text-xl">
          Cases to check
        </h2>
        {dueCases.length === 0 ? (
          <p className="mt-2 text-ink-muted">No case is due for a check.</p>
        ) : (
          <ul className="mt-3 divide-y divide-rule border-y border-rule">
            {dueCases.map((c) => (
              <li key={c.id} className="py-2">
                <Link href={`/admin/cases/${c.id}`}>{c.title}</Link>
                <span className="block text-sm text-ink-muted">
                  {c.reason === "scheduled" && c.nextCheckOn
                    ? `Scheduled check: ${formatDate(c.nextCheckOn)}`
                    : c.reason === "never_checked"
                      ? "Never checked"
                      : `Last checked ${formatDate(c.lastCheckedAt!.toISOString().slice(0, 10))}`}
                  {c.checkNotes && ` · ${c.checkNotes.length > 100 ? `${c.checkNotes.slice(0, 99)}…` : c.checkNotes}`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="run-discovery">
        <h2 id="run-discovery" className="text-xl">
          Run discovery now
        </h2>
        <p className="mt-1 max-w-[70ch] text-sm text-ink-muted">
          Searches news, the school&rsquo;s campus feeds, federal court dockets and its cases&rsquo; monitoring terms, as
          the daily run does. Results go to the inbox; nothing is published. A longer lookback suits a newly added school.
        </p>
        <ActionForm action={runDiscoveryAction} submitLabel="Run discovery" className="mt-3 max-w-xl space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField name="college" label="School" required options={schoolOptions} />
            <SelectField
              name="days"
              label="Lookback"
              required
              defaultValue="2"
              options={lookbackDays.map((d) => ({ value: String(d), label: lookbackLabels[d] }))}
            />
          </div>
        </ActionForm>
      </section>

      <section aria-labelledby="triage-inbox">
        <h2 id="triage-inbox" className="text-xl">
          Triage the inbox with AI
        </h2>
        <p className="mt-1 max-w-[70ch] text-sm text-ink-muted">
          Resolves Google News links to the publisher&rsquo;s article, reads it where possible, and marks each new item
          relevant, unsure or irrelevant with a reason. Irrelevant items are dismissed and can be restored from the
          Dismissed tab; court dockets and possible case updates always stay. Nothing is accepted or verified. Runs for
          up to four minutes at a time.
        </p>
        <ActionForm action={triageInboxAction} submitLabel="Triage new items" className="mt-3" />
      </section>

      <DiscoveryRuns data={runs} />

      <section aria-labelledby="counts">
        <h2 id="counts" className="text-xl">
          Records by status
        </h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-rule-strong">
                <th className="py-2 pr-4 font-medium">Record type</th>
                {verificationStatuses.map((st) => (
                  <th key={st} className="px-2 py-2 text-right font-medium">
                    {statusLabels[st]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(Object.keys(reviewTables) as ReviewTableKey[]).map((key) => (
                <tr key={key} className="border-b border-rule">
                  <td className="py-2 pr-4">{reviewTables[key].label}</td>
                  {verificationStatuses.map((st) => (
                    <td key={st} className="tabular px-2 py-2 text-right">
                      {counts[key][st] ?? <span className="text-ink-muted">0</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="recent">
        <h2 id="recent" className="text-xl">
          Recent activity
        </h2>
        {recent.length === 0 ? (
          <p className="mt-2 text-ink-muted">No status changes yet.</p>
        ) : (
          <ol className="mt-3 space-y-2 text-sm">
            {recent.map((r) => (
              <li key={r.id}>
                <span className="text-ink-muted">{r.createdAt.toISOString().slice(0, 16).replace("T", " ")}</span> · {r.actor} ·{" "}
                {reviewTables[r.tableName as ReviewTableKey]?.label ?? r.tableName} → <StatusBadge status={r.toStatus} />
                {r.note && <span className="text-ink-muted"> · {r.note}</span>}
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
