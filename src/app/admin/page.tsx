import Link from "next/link";
import { StatusBadge, statusLabels } from "@/components/admin/status";
import { db } from "@/db";
import { dashboard } from "@/lib/admin/queries";
import { requireResearcherPage } from "@/lib/admin/session";
import { reviewTables, type ReviewTableKey } from "@/lib/admin/workflow";
import { verificationStatuses } from "@/lib/enums";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboard() {
  await requireResearcherPage();
  const { counts, inbox, recent, awaiting } = await dashboard(db);

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
