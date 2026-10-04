import Link from "next/link";
import { createCaseAction } from "../actions";
import { ActionForm } from "@/components/admin/action-form";
import { CaseFields } from "@/components/admin/case-fields";
import { StatusBadge } from "@/components/admin/status";
import { db } from "@/db";
import { listCases, listColleges } from "@/lib/admin/queries";
import { requireResearcherPage } from "@/lib/admin/session";

export const metadata = { title: "Cases" };

export default async function CasesAdmin() {
  await requireResearcherPage();
  const [cases, colleges] = await Promise.all([listCases(db), listColleges(db)]);
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl">Cases</h1>
        <p className="mt-2 max-w-[75ch] text-ink-muted">
          Case timelines document institutional and legal processes as recorded in sources. A case is published only when
          it has an editorial justification, at least one institution, and at least one verified, cited event.
        </p>
      </div>
      {cases.length === 0 ? (
        <p className="text-ink-muted">No cases yet.</p>
      ) : (
        <ul className="divide-y divide-rule border-y border-rule">
          {cases.map((c) => (
            <li key={c.id} className="flex flex-wrap items-baseline justify-between gap-2 py-3">
              <span>
                <Link href={`/admin/cases/${c.id}`}>{c.title}</Link>
                {c.isDemo && <span className="ml-2 text-xs text-demo-ink">demo</span>}
                <span className="block text-sm text-ink-muted">
                  {c.colleges ?? "No institution linked"} · {c.events} event{c.events === 1 ? "" : "s"}
                </span>
              </span>
              <StatusBadge status={c.status} />
            </li>
          ))}
        </ul>
      )}
      <details className="max-w-3xl border border-dashed border-rule-strong p-4">
        <summary className="cursor-pointer font-medium">New case</summary>
        <div className="mt-4">
          <ActionForm action={createCaseAction} submitLabel="Create draft case">
            <CaseFields colleges={colleges} />
          </ActionForm>
        </div>
      </details>
    </div>
  );
}
