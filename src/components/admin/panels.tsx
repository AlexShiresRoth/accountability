import { cache } from "react";
import { addCitationAction, changeStatusAction, deleteRecordAction, removeCitationAction } from "@/app/admin/actions";
import { db } from "@/db";
import { citationsFor, collegesForRecord, sourceOptions } from "@/lib/admin/queries";
import { reviewTables, statusHistory, verificationProblems, type ReviewTableKey } from "@/lib/admin/workflow";
import { verificationStatuses, type VerificationStatus } from "@/lib/enums";
import { ActionForm } from "./action-form";
import { TextArea, TextField } from "./fields";
import { SourcePicker } from "./source-picker";
import { sourceScopeFor } from "./source-scope";
import { StatusBadge, statusLabels } from "./status";
import { StatusSelect } from "./status-select";

type Reviewable = {
  id: string;
  status: VerificationStatus;
  createdBy: string | null;
  reviewedBy: string | null;
  reviewedAt: Date | null;
};

// Several citation panels render on one page; load the source list once per request.
const cachedSourceOptions = cache(() => sourceOptions(db));

const when = (d: Date) => d.toISOString().slice(0, 16).replace("T", " ") + " UTC";

export async function StatusPanel({ recordKey, record, extra }: { recordKey: ReviewTableKey; record: Reviewable; extra?: React.ReactNode }) {
  const [history, problems] = await Promise.all([
    statusHistory(db, recordKey, record.id),
    record.status === "verified" ? Promise.resolve([]) : verificationProblems(db, recordKey, record.id),
  ]);
  const options = verificationStatuses.filter((st) => st !== record.status).map((st) => ({ value: st, label: statusLabels[st] }));

  return (
    <section aria-label="Verification" className="space-y-4 border border-rule bg-surface p-4">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-sans text-base font-semibold">Verification</h2>
        <StatusBadge status={record.status} />
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
        <dt className="text-ink-muted">Entered by</dt>
        <dd>{record.createdBy ?? "—"}</dd>
        <dt className="text-ink-muted">Reviewed by</dt>
        <dd>
          {record.reviewedBy ? `${record.reviewedBy}, ${record.reviewedAt ? when(record.reviewedAt) : ""}` : "—"}
          {record.reviewedBy && record.reviewedBy === record.createdBy && (
            <span className="ml-2 text-caution-ink">(same person who entered it)</span>
          )}
        </dd>
      </dl>
      {problems.length > 0 && (
        <div className="text-sm">
          <p className="font-medium">Before this can be verified:</p>
          <ul className="mt-1 list-disc pl-5 text-ink-muted">
            {problems.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      )}
      <ActionForm action={changeStatusAction.bind(null, recordKey, record.id)} submitLabel="Update status">
        <StatusSelect key={record.status} options={options} current={record.status} defaultValue={record.status === "pending_review" ? "verified" : "pending_review"} />
        {extra}
        <TextArea name="note" label="Note" hint="What you checked, or why the status changed. Recorded in the history." rows={2} />
      </ActionForm>
      {history.length > 0 && (
        <details className="text-sm">
          <summary className="cursor-pointer text-ink-muted">History ({history.length})</summary>
          <ol className="mt-2 space-y-2">
            {history.map((h) => (
              <li key={h.id} className="border-l-2 border-rule-strong pl-3">
                <span className="text-ink-muted">{when(h.createdAt)}</span> · {h.actor}:{" "}
                {h.fromStatus ? statusLabels[h.fromStatus] : "—"} → {statusLabels[h.toStatus]}
                {h.note && <span className="block text-ink-muted">{h.note}</span>}
              </li>
            ))}
          </ol>
        </details>
      )}
    </section>
  );
}

export async function CitationsPanel({ recordKey, recordId }: { recordKey: ReviewTableKey; recordId: string }) {
  const column = reviewTables[recordKey].citation;
  if (!column) return null;
  const [cites, sources, collegeIds] = await Promise.all([
    citationsFor(db, column, recordId),
    cachedSourceOptions(),
    collegesForRecord(db, recordKey, recordId),
  ]);
  const scope = await sourceScopeFor(collegeIds, sources);

  return (
    <section aria-label="Citations" className="space-y-4 border border-rule p-4">
      <h2 className="font-sans text-base font-semibold">Citations</h2>
      {cites.length === 0 ? (
        <p className="text-sm text-ink-muted">No citations yet. Published records need at least one citation to a verified source.</p>
      ) : (
        <ul className="divide-y divide-rule text-sm">
          {cites.map((c) => (
            <li key={c.id} className="flex flex-wrap items-start justify-between gap-3 py-2">
              <div>
                <a href={`/admin/sources/${c.sourceId}`}>{c.sourceTitle}</a> <StatusBadge status={c.sourceStatus} />
                {c.pinpoint && <span className="block text-ink-muted">Location: {c.pinpoint}</span>}
                {c.claim && <span className="block text-ink-muted">Supports: {c.claim}</span>}
                {c.excerpt && <span className="block text-ink-muted italic">&ldquo;{c.excerpt}&rdquo;</span>}
              </div>
              <ActionForm
                action={removeCitationAction.bind(null, c.id)}
                submitLabel="Remove"
                variant="secondary"
                className="flex items-center gap-2"
                confirm="Remove this citation? A published record left without evidence will be unpublished."
              />
            </li>
          ))}
        </ul>
      )}
      <details>
        <summary className="cursor-pointer text-sm font-medium">Add a citation</summary>
        <div className="mt-3">
          <ActionForm action={addCitationAction.bind(null, recordKey, recordId)} submitLabel="Add citation">
            <SourcePicker name="sourceId" label="Source" required sources={sources} scope={scope} hint="Not listed? Create it under Sources first." />
            <TextField name="pinpoint" label="Location in source" hint="Page, section, or paragraph, e.g. p. 42." />
            <TextField name="claim" label="Claim supported" hint="Which specific fact this citation supports, if the record makes more than one." />
            <TextArea name="excerpt" label="Excerpt" hint="Short supporting quotation, copied exactly." rows={2} />
          </ActionForm>
        </div>
      </details>
    </section>
  );
}

export function DeletePanel({ recordKey, id, status, redirectTo }: { recordKey: ReviewTableKey; id: string; status: VerificationStatus; redirectTo: string }) {
  if (status !== "draft" && status !== "rejected") return null;
  return (
    <ActionForm
      action={deleteRecordAction.bind(null, recordKey, id, redirectTo)}
      submitLabel="Delete"
      variant="danger"
      confirm="Delete this record permanently?"
      className="flex flex-wrap items-center gap-3"
    />
  );
}
