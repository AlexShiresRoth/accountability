import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionForm } from "@/components/admin/action-form";
import { PublishedEditWarning } from "@/components/admin/fields";
import { CitationsPanel, DeletePanel, StatusPanel } from "@/components/admin/panels";
import { RecordFields, recordLabels } from "@/components/admin/record-fields";
import { StatusBadge } from "@/components/admin/status";
import { db } from "@/db";
import { actionOptions, caseOptions, getCollegeRecord, getSource, sourceOptions } from "@/lib/admin/queries";
import { isCollegeRecordKey } from "@/lib/admin/records";
import { requireResearcherPage } from "@/lib/admin/session";
import type { VerificationStatus } from "@/lib/enums";
import { updateCollegeRecordAction } from "../../../actions";

export const metadata = { title: "Record" };

export default async function RecordAdmin({ params }: PageProps<"/admin/records/[key]/[id]">) {
  await requireResearcherPage();
  const { key, id } = await params;
  if (!isCollegeRecordKey(key)) notFound();
  const data = await getCollegeRecord(db, key, id);
  if (!data) notFound();
  const { record, college } = data;
  const [sources, cases, actions, coverageSource] = await Promise.all([
    sourceOptions(db),
    caseOptions(db),
    actionOptions(db, college.id),
    key === "college_coverage" ? getSource(db, record.sourceId as string) : Promise.resolve(null),
  ]);
  const status = record.status as VerificationStatus;
  const reviewable = {
    id,
    status,
    createdBy: record.createdBy as string | null,
    reviewedBy: record.reviewedBy as string | null,
    reviewedAt: record.reviewedAt as Date | null,
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-ink-muted">
          <Link href="/admin/colleges">Colleges</Link> / <Link href={`/admin/colleges/${college.id}`}>{college.name}</Link> /
        </p>
        <h1 className="text-2xl">{recordLabels[key].singular}</h1>
        {coverageSource && (
          <p className="mt-1 text-sm text-ink-muted">
            Article: <Link href={`/admin/sources/${coverageSource.source.id}`}>{coverageSource.source.title}</Link>{" "}
            <StatusBadge status={coverageSource.source.status} />
          </p>
        )}
      </div>
      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-4">
          <PublishedEditWarning status={status} />
          <ActionForm action={updateCollegeRecordAction.bind(null, key, id)} submitLabel={`Save ${recordLabels[key].singular.toLowerCase()}`}>
            <RecordFields recordKey={key} values={record} options={{ sources, cases, actions }} />
          </ActionForm>
          <CitationsPanel recordKey={key} recordId={id} />
          {key === "college_coverage" && (
            <p className="text-sm text-ink-muted">
              Coverage is evidenced by the article itself: verify the article&rsquo;s source record, then this entry.
            </p>
          )}
        </div>
        <div className="space-y-4">
          <StatusPanel recordKey={key} record={reviewable} />
          <DeletePanel recordKey={key} id={id} status={status} redirectTo={`/admin/colleges/${college.id}`} />
        </div>
      </div>
    </div>
  );
}
