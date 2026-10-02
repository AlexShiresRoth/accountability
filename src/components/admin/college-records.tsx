import Link from "next/link";
import { createCollegeRecordAction } from "@/app/admin/actions";
import { db } from "@/db";
import { actionOptions, caseOptions, getCollegeRecords, sourceOptions } from "@/lib/admin/queries";
import type { CollegeRecordKey } from "@/lib/admin/records";
import { formatDate } from "@/lib/dates";
import { actionTypeLabels, confidentialityLabels, policyTypeLabels, resourceCategoryLabels, responseTopicLabels } from "@/lib/labels";
import type { VerificationStatus } from "@/lib/enums";
import { ActionForm } from "./action-form";
import { RecordFields, recordLabels, type RecordOptions } from "./record-fields";
import { StatusBadge } from "./status";

type Item = { id: string; status: VerificationStatus; primary: string; secondary?: string };

const truncate = (s: string, n = 90) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

/** All institutional records for a college, grouped by type, each with an "Add" form. */
export async function CollegeRecordsSection({ collegeId }: { collegeId: string }) {
  const [records, sources, cases, actions] = await Promise.all([
    getCollegeRecords(db, collegeId),
    sourceOptions(db),
    caseOptions(db),
    actionOptions(db, collegeId),
  ]);
  const options: RecordOptions = { sources, cases, actions };

  const groups: { key: CollegeRecordKey; items: Item[]; empty: string }[] = [
    {
      key: "institutional_response",
      empty: "No findings yet. Each topic shows “Not yet reviewed” on the profile until one is added.",
      items: records.responses.map((r) => ({
        id: r.id,
        status: r.status,
        primary: responseTopicLabels[r.topic],
        secondary: r.findingKind === "not_located" ? "Not located in the public sources reviewed" : truncate(r.summary),
      })),
    },
    {
      key: "policy",
      empty: "No policies yet.",
      items: records.policies.map((p) => ({ id: p.id, status: p.status, primary: p.title, secondary: policyTypeLabels[p.policyType] })),
    },
    {
      key: "student_resource",
      empty: "No resources yet.",
      items: records.resources.map((r) => ({
        id: r.id,
        status: r.status,
        primary: r.name,
        secondary: `${resourceCategoryLabels[r.category]} · ${confidentialityLabels[r.confidentiality].title}`,
      })),
    },
    {
      key: "institution_action",
      empty: "No timeline entries yet.",
      items: records.actions.map((a) => ({
        id: a.id,
        status: a.status,
        primary: a.title,
        secondary: `${formatDate(a.actionDate, a.datePrecision)} · ${actionTypeLabels[a.actionType]}`,
      })),
    },
    {
      key: "college_coverage",
      empty: "No coverage yet. Accept items from the inbox, or add them here.",
      items: records.coverage.map((c) => ({
        id: c.coverage.id,
        status: c.coverage.status,
        primary: truncate(c.coverage.summary),
        secondary: `${c.publisher}${c.sourceStatus !== "verified" ? " · source not yet verified" : ""}`,
      })),
    },
    {
      key: "correction",
      empty: "No corrections.",
      items: records.corrections.map((c) => ({ id: c.id, status: c.status, primary: truncate(c.description), secondary: formatDate(c.correctionDate) })),
    },
  ];

  return (
    <section aria-labelledby="institutional" className="space-y-10">
      <div>
        <h2 id="institutional" className="text-xl">
          Institutional record
        </h2>
        <p className="mt-1 max-w-[75ch] text-ink-muted">
          Everything on the profile beyond statistics. Records are created as drafts; add a citation, then verify each to
          publish it.
        </p>
      </div>
      {groups.map((g) => (
        <div key={g.key} className="space-y-3">
          <h3 className="font-sans text-base font-semibold">
            {recordLabels[g.key].plural} <span className="font-normal text-ink-muted">({g.items.length})</span>
          </h3>
          {g.items.length === 0 ? (
            <p className="text-sm text-ink-muted">{g.empty}</p>
          ) : (
            <ul className="divide-y divide-rule border-y border-rule">
              {g.items.map((item) => (
                <li key={item.id} className="flex flex-wrap items-baseline justify-between gap-2 py-2">
                  <span>
                    <Link href={`/admin/records/${g.key}/${item.id}`}>{item.primary}</Link>
                    {item.secondary && <span className="block text-sm text-ink-muted">{item.secondary}</span>}
                  </span>
                  <StatusBadge status={item.status} />
                </li>
              ))}
            </ul>
          )}
          <details>
            <summary className="cursor-pointer text-sm font-medium">Add {recordLabels[g.key].singular.toLowerCase()}</summary>
            <div className="mt-3 max-w-3xl">
              <ActionForm action={createCollegeRecordAction.bind(null, g.key, collegeId)} submitLabel={`Create draft ${recordLabels[g.key].singular.toLowerCase()}`}>
                <RecordFields recordKey={g.key} options={options} />
              </ActionForm>
            </div>
          </details>
        </div>
      ))}
    </section>
  );
}
