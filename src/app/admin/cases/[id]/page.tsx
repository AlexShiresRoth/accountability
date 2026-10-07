import Link from "next/link";
import { notFound } from "next/navigation";
import { createCaseCorrectionAction, createCaseEventAction, updateCaseAction } from "../../actions";
import { LegalStatusBadge } from "@/components/case/legal-status-badge";
import { ActionForm } from "@/components/admin/action-form";
import { CaseFields, EventFields } from "@/components/admin/case-fields";
import { PublishedEditWarning, TextArea, TextField } from "@/components/admin/fields";
import { CitationsPanel, DeletePanel, StatusPanel } from "@/components/admin/panels";
import { StatusBadge } from "@/components/admin/status";
import { db } from "@/db";
import { CaseMonitoring } from "@/components/admin/case-monitoring";
import { caseInboxCount } from "@/lib/admin/monitoring";
import { getCaseAdmin, listColleges } from "@/lib/admin/queries";
import { requireResearcherPage } from "@/lib/admin/session";
import { formatDate } from "@/lib/dates";

export const metadata = { title: "Case" };

export default async function CaseAdmin({ params }: PageProps<"/admin/cases/[id]">) {
  await requireResearcherPage();
  const id = (await params).id;
  const [data, colleges, inboxCount] = await Promise.all([getCaseAdmin(db, id), listColleges(db), caseInboxCount(db, id)]);
  if (!data) notFound();
  const { record, events, corrections, coverage } = data;

  return (
    <div className="space-y-10">
      <div>
        <p className="text-sm text-ink-muted">
          <Link href="/admin/cases">Cases</Link> /
        </p>
        <h1 className="text-2xl">{record.title}</h1>
        <p className="mt-1 flex flex-wrap gap-x-4 text-sm">
          <Link href={`/admin/preview/case/${record.id}`}>Preview case (including unverified)</Link>
          <Link href={`/case/${record.slug}`}>Public page</Link>
          <span className="text-ink-muted">Institutions: {data.colleges.map((c) => c.name).join(", ") || "none"}</span>
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-4">
          <PublishedEditWarning status={record.status} />
          <ActionForm action={updateCaseAction.bind(null, record.id)} submitLabel="Save case details">
            <CaseFields values={record} colleges={colleges} linkedCollegeIds={data.colleges.map((c) => c.id)} />
          </ActionForm>
          <CitationsPanel recordKey="case" recordId={record.id} />
        </div>
        <div className="space-y-4">
          <StatusPanel recordKey="case" record={record} />
          <CaseMonitoring record={record} inboxCount={inboxCount} today={new Date().toISOString().slice(0, 10)} />
          <DeletePanel recordKey="case" id={record.id} status={record.status} redirectTo="/admin/cases" />
        </div>
      </div>

      <section aria-labelledby="events" className="space-y-4">
        <h2 id="events" className="text-xl">
          Timeline events <span className="font-sans text-base font-normal text-ink-muted">({events.length})</span>
        </h2>
        <p className="max-w-[75ch] text-sm text-ink-muted">
          Shown publicly in date order, then by &ldquo;order on the same date&rdquo;. Each event needs a citation to a
          verified source before it can be verified.
        </p>
        {events.length === 0 ? (
          <p className="text-ink-muted">No events yet.</p>
        ) : (
          <ol className="divide-y divide-rule border-y border-rule">
            {events.map((e) => (
              <li key={e.id} className="grid gap-2 py-3 sm:grid-cols-[10rem_1fr_auto] sm:gap-4">
                <span className="text-sm text-ink-muted">{formatDate(e.eventDate, e.datePrecision)}</span>
                <span>
                  <LegalStatusBadge type={e.eventType} />
                  <Link href={`/admin/cases/${record.id}/events/${e.id}`} className="mt-1 block text-[0.95rem]">
                    {e.description.length > 140 ? `${e.description.slice(0, 139)}…` : e.description}
                  </Link>
                  {e.supersedesEventId && <span className="text-xs text-ink-muted">Updates an earlier entry</span>}
                </span>
                <span className="self-start">
                  <StatusBadge status={e.status} />
                </span>
              </li>
            ))}
          </ol>
        )}
        <details className="max-w-3xl">
          <summary className="cursor-pointer text-sm font-medium">Add event</summary>
          <div className="mt-3">
            <ActionForm action={createCaseEventAction.bind(null, record.id)} submitLabel="Create draft event">
              <EventFields siblings={events} />
            </ActionForm>
          </div>
        </details>
      </section>

      <section aria-labelledby="case-corrections" className="space-y-3">
        <h2 id="case-corrections" className="text-xl">
          Corrections <span className="font-sans text-base font-normal text-ink-muted">({corrections.length})</span>
        </h2>
        {corrections.length > 0 && (
          <ul className="divide-y divide-rule border-y border-rule">
            {corrections.map((c) => (
              <li key={c.id} className="flex flex-wrap items-baseline justify-between gap-2 py-2">
                <Link href={`/admin/records/correction/${c.id}`}>
                  {formatDate(c.correctionDate)}: {c.description}
                </Link>
                <StatusBadge status={c.status} />
              </li>
            ))}
          </ul>
        )}
        <details className="max-w-3xl">
          <summary className="cursor-pointer text-sm font-medium">Add correction</summary>
          <div className="mt-3">
            <ActionForm action={createCaseCorrectionAction.bind(null, record.id)} submitLabel="Create draft correction">
              <TextField name="correctionDate" label="Date of correction" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} />
              <TextArea name="description" label="What was corrected" required rows={3} hint="Shown at the top of the case page, as prominently as the original." />
            </ActionForm>
          </div>
        </details>
      </section>

      <section aria-labelledby="case-coverage" className="space-y-3">
        <h2 id="case-coverage" className="text-xl">
          Coverage linked to this case
        </h2>
        <p className="max-w-[75ch] text-sm text-ink-muted">
          Coverage is managed from the college page. Set its scope to &ldquo;About a specific case&rdquo; and choose this case;
          it publishes only once this case is verified.
        </p>
        {coverage.length === 0 ? (
          <p className="text-sm text-ink-muted">None linked yet.</p>
        ) : (
          <ul className="divide-y divide-rule border-y border-rule">
            {coverage.map((c) => (
              <li key={c.id} className="flex flex-wrap items-baseline justify-between gap-2 py-2">
                <Link href={`/admin/records/college_coverage/${c.id}`}>{c.summary.length > 110 ? `${c.summary.slice(0, 109)}…` : c.summary}</Link>
                <span className="flex items-center gap-2 text-sm text-ink-muted">
                  {c.publisher} <StatusBadge status={c.status} />
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
