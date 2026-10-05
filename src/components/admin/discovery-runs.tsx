import type { RunSummary } from "@/jobs/discovery/run";
import type { recentDiscoveryRuns } from "@/lib/admin/queries";

type Data = Awaited<ReturnType<typeof recentDiscoveryRuns>>;
type Run = Data["runs"][number];

// A run still "running" after the function time limit (300 s) was cut off without recording an outcome.
const STALE_MS = 10 * 60_000;
// The cron runs daily; allow for Vercel's imprecise scheduling before warning.
const OVERDUE_MS = 26 * 3_600_000;

const outcomeStyles: Record<string, string> = {
  ok: "border-rule-strong text-ink-muted",
  partial: "border-caution-rule bg-caution text-caution-ink",
  failed: "border-ink bg-ink text-paper",
  running: "border-rule-strong text-ink-muted",
  stalled: "border-ink bg-ink text-paper",
};
const outcomeLabels: Record<string, string> = {
  ok: "OK",
  partial: "Some sources failed",
  failed: "Failed",
  running: "Running",
  stalled: "Did not finish",
};

function outcomeOf(run: Run, now: number): string {
  if (run.outcome === "running" && now - run.startedAt.getTime() > STALE_MS) return "stalled";
  return run.outcome;
}

const when = (d: Date) => `${d.toISOString().slice(0, 16).replace("T", " ")} UTC`;
const seconds = (ms: number | null) => (ms === null ? "—" : `${(ms / 1000).toFixed(ms < 10_000 ? 1 : 0)} s`);

function ago(ms: number): string {
  const h = Math.floor(ms / 3_600_000);
  return h < 1 ? `${Math.max(1, Math.floor(ms / 60_000))} min ago` : h < 48 ? `${h} h ago` : `${Math.floor(h / 24)} days ago`;
}

export function DiscoveryRuns({ data }: { data: Data }) {
  const { runs, lastScheduled, checkedAt: now } = data;
  const overdue = !lastScheduled || now - lastScheduled.startedAt.getTime() > OVERDUE_MS;

  return (
    <section aria-labelledby="discovery-runs">
      <h2 id="discovery-runs" className="text-xl">
        Discovery runs
      </h2>
      <p className={`mt-1 text-sm ${overdue ? "text-caution-ink" : "text-ink-muted"}`}>
        {lastScheduled
          ? `Last scheduled run ${ago(now - lastScheduled.startedAt.getTime())} (${when(lastScheduled.startedAt)}).`
          : "No scheduled run has been recorded on this database yet."}
        {overdue && " The daily cron may not be running: check the Vercel cron logs and CRON_SECRET."}
      </p>
      {runs.length === 0 ? (
        <p className="mt-2 text-ink-muted">No runs yet.</p>
      ) : (
        <ul className="mt-3 divide-y divide-rule border-y border-rule text-sm">
          {runs.map((run) => {
            const outcome = outcomeOf(run, now);
            const summary = run.summary as RunSummary | null;
            const errors = summary?.errors ?? (run.error ? run.error.split("\n") : []);
            return (
              <li key={run.id} className="py-2">
                <details>
                  <summary className="flex cursor-pointer flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="tabular">{when(run.startedAt)}</span>
                    <span className="text-ink-muted">{run.triggeredBy}</span>
                    <span className={`inline-block border px-1.5 py-px text-xs font-semibold whitespace-nowrap ${outcomeStyles[outcome] ?? outcomeStyles.running}`}>
                      {outcomeLabels[outcome] ?? outcome}
                    </span>
                    <span className="tabular text-ink-muted">
                      {run.itemsCreated} new of {run.itemsFound} found · {seconds(run.durationMs)}
                    </span>
                  </summary>
                  <div className="mt-2 space-y-3 pl-4">
                    {summary && (
                      <table className="w-full max-w-xl border-collapse text-left">
                        <thead>
                          <tr className="border-b border-rule-strong">
                            <th className="py-1 pr-4 font-medium">Source</th>
                            <th className="px-2 py-1 text-right font-medium">Found</th>
                            <th className="px-2 py-1 text-right font-medium">Relevant</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(summary.bySource).map(([source, c]) => (
                            <tr key={source} className="border-b border-rule">
                              <td className="py-1 pr-4">{source}</td>
                              <td className="tabular px-2 py-1 text-right">{c.found}</td>
                              <td className="tabular px-2 py-1 text-right">{c.relevant}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    {summary && (
                      <p className="text-ink-muted">
                        Duplicate headlines skipped: {summary.duplicateHeadlines} · re-filed to another school: {summary.refiled} ·
                        dropped (headline must name school): {summary.droppedNoHeadlineName}
                      </p>
                    )}
                    {errors.length > 0 && (
                      <ul className="list-disc space-y-1 pl-5 text-caution-ink">
                        {errors.map((e, i) => (
                          <li key={i} className="break-words">
                            {e}
                          </li>
                        ))}
                      </ul>
                    )}
                    {!summary && errors.length === 0 && <p className="text-ink-muted">No per-source detail was recorded for this run.</p>}
                  </div>
                </details>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
