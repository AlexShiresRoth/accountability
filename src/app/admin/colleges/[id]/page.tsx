import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionForm } from "@/components/admin/action-form";
import { CollegeFields } from "@/components/admin/college-fields";
import { PublishedEditWarning, SelectField, TextField } from "@/components/admin/fields";
import { CitationsPanel, DeletePanel, StatusPanel } from "@/components/admin/panels";
import { StatusBadge } from "@/components/admin/status";
import { db } from "@/db";
import { getCollege, sourceOptions } from "@/lib/admin/queries";
import { requireResearcherPage } from "@/lib/admin/session";
import { createReportAction, updateCollegeAction } from "../../actions";

export const metadata = { title: "College" };

export default async function CollegeAdmin({ params }: PageProps<"/admin/colleges/[id]">) {
  await requireResearcherPage();
  const data = await getCollege(db, (await params).id);
  if (!data) notFound();
  const { college, reports } = data;
  const sources = await sourceOptions(db);
  const nextYear = (reports[0]?.reportYear ?? new Date().getFullYear() - 1) + 1;

  return (
    <div className="space-y-10">
      <div>
        <p className="text-sm text-ink-muted">
          <Link href="/admin/colleges">Colleges</Link> /
        </p>
        <h1 className="text-2xl">{college.name}</h1>
        <p className="mt-1 text-sm">
          <Link href={`/college/${college.slug}`}>Public profile</Link>
          <span className="text-ink-muted"> (only shows once verified)</span>
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-4">
          <PublishedEditWarning status={college.status} />
          <ActionForm action={updateCollegeAction.bind(null, college.id)} submitLabel="Save college details">
            <CollegeFields college={college} />
          </ActionForm>
          <CitationsPanel recordKey="college" recordId={college.id} />
        </div>
        <div className="space-y-4">
          <StatusPanel recordKey="college" record={college} />
          <DeletePanel recordKey="college" id={college.id} status={college.status} redirectTo="/admin/colleges" />
        </div>
      </div>

      <section aria-labelledby="reports" className="space-y-4">
        <h2 id="reports" className="text-xl">
          Annual Security Reports
        </h2>
        {reports.length === 0 ? (
          <p className="text-ink-muted">No reports yet.</p>
        ) : (
          <ul className="divide-y divide-rule border-y border-rule">
            {reports.map((r) => (
              <li key={r.id} className="flex flex-wrap items-baseline justify-between gap-2 py-2">
                <Link href={`/admin/reports/${r.id}`}>
                  {r.reportYear}: {r.title}
                </Link>
                <StatusBadge status={r.status} />
              </li>
            ))}
          </ul>
        )}
        <details>
          <summary className="cursor-pointer font-medium">Add a report</summary>
          <div className="mt-3 max-w-2xl">
            <ActionForm action={createReportAction.bind(null, college.id)} submitLabel="Create draft report">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField name="reportYear" label="Report year" type="number" required defaultValue={nextYear} hint="The year published. It covers the three prior calendar years." />
                <TextField name="title" label="Title" required defaultValue={`${nextYear} Annual Security Report`} />
              </div>
              <SelectField
                name="sourceId"
                label="Source document"
                required
                placeholder="Choose the report's source…"
                options={sources.map((s) => ({ value: s.id, label: `${s.title} (${s.publisher})` }))}
                hint="Create the source (with its URL and archived copy) under Sources first."
              />
            </ActionForm>
          </div>
        </details>
      </section>
    </div>
  );
}
