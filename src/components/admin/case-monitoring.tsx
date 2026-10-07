import Link from "next/link";
import { markCaseCheckedAction, updateCaseMonitoringAction } from "@/app/admin/actions";
import { CHECK_INTERVAL_DAYS, nextDue } from "@/lib/admin/monitoring";
import { formatDate } from "@/lib/dates";
import { ActionForm } from "./action-form";
import { TextArea, TextField } from "./fields";

type Monitoring = { id: string; searchTerms: string[]; lastCheckedAt: Date | null; nextCheckOn: string | null; checkNotes: string | null };

const day = (d: Date) => d.toISOString().slice(0, 10);

/** Researcher-only tools for following a case: news search terms and check-in reminders. */
export function CaseMonitoring({ record, inboxCount, today }: { record: Monitoring; inboxCount: number; today: string }) {
  const { date, due } = nextDue(record, today);
  return (
    <section aria-labelledby="monitoring" className="space-y-4 border border-rule p-4">
      <div>
        <h2 id="monitoring" className="text-xl">
          Monitoring <span className="font-sans text-sm font-normal text-ink-muted">(researcher-only, never public)</span>
        </h2>
        <p className="mt-1 text-sm">
          Last checked: {record.lastCheckedAt ? `${formatDate(day(record.lastCheckedAt))}` : "never"} · Next check:{" "}
          {date ? formatDate(date) : "now"}
          {due && <span className="ml-2 border border-caution-rule bg-caution px-1.5 py-px text-xs font-semibold text-caution-ink">Due</span>}
        </p>
        <p className="text-sm text-ink-muted">
          {inboxCount > 0 ? (
            <>
              <Link href="/admin/inbox">
                {inboxCount} new inbox item{inboxCount === 1 ? "" : "s"}
              </Link>{" "}
              marked as a possible update to this case.
            </>
          ) : (
            "No new inbox items marked as updates to this case."
          )}
        </p>
      </div>

      <ActionForm action={markCaseCheckedAction.bind(null, record.id)} submitLabel="Mark checked today" variant="secondary" className="flex items-center gap-3" />

      <ActionForm action={updateCaseMonitoringAction.bind(null, record.id)} submitLabel="Save monitoring">
        <TextArea
          name="searchTerms"
          label="News search terms"
          rows={2}
          defaultValue={record.searchTerms.join("\n")}
          hint="One per line, e.g. Chi Phi. Each is searched daily on Google News together with the case's school names; matches appear in the inbox marked as possible updates. Use distinctive terms, never names of victims."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            name="nextCheckOn"
            label="Check again on"
            type="date"
            defaultValue={record.nextCheckOn}
            hint={`Optional, e.g. a scheduled hearing. Without it, the case is due ${CHECK_INTERVAL_DAYS} days after its last check.`}
          />
        </div>
        <TextArea
          name="checkNotes"
          label="Where to check"
          rows={3}
          defaultValue={record.checkNotes}
          hint="Court and docket or index numbers, pending motions, who to watch for statements. Never shown publicly."
        />
      </ActionForm>
    </section>
  );
}
