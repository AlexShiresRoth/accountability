import Link from "next/link";
import { notFound } from "next/navigation";
import { updateCaseEventAction } from "../../../../actions";
import { LegalStatusBadge } from "@/components/case/legal-status-badge";
import { ActionForm } from "@/components/admin/action-form";
import { EventFields } from "@/components/admin/case-fields";
import { PublishedEditWarning } from "@/components/admin/fields";
import { CitationsPanel, DeletePanel, StatusPanel } from "@/components/admin/panels";
import { db } from "@/db";
import { getCaseEvent } from "@/lib/admin/queries";
import { requireResearcherPage } from "@/lib/admin/session";

export const metadata = { title: "Case event" };

export default async function CaseEventAdmin({ params }: PageProps<"/admin/cases/[id]/events/[eventId]">) {
  await requireResearcherPage();
  const { eventId } = await params;
  const data = await getCaseEvent(db, eventId);
  if (!data) notFound();
  const { event } = data;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-ink-muted">
          <Link href="/admin/cases">Cases</Link> / <Link href={`/admin/cases/${data.case.id}`}>{data.case.title}</Link> /
        </p>
        <h1 className="mt-1 text-2xl">Event</h1>
        <div className="mt-2">
          <LegalStatusBadge type={event.eventType} />
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-4">
          <PublishedEditWarning status={event.status} />
          <ActionForm action={updateCaseEventAction.bind(null, event.id)} submitLabel="Save event">
            <EventFields values={event} siblings={data.siblings} currentId={event.id} />
          </ActionForm>
          <CitationsPanel recordKey="case_event" recordId={event.id} />
        </div>
        <div className="space-y-4">
          <StatusPanel recordKey="case_event" record={event} />
          <DeletePanel recordKey="case_event" id={event.id} status={event.status} redirectTo={`/admin/cases/${data.case.id}`} />
        </div>
      </div>
    </div>
  );
}
