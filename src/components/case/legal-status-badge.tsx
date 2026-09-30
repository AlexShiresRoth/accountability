import { caseEventTypeInfo, eventCategoryLabels, type EventCategory } from "@/lib/case-events";
import type { CaseEventType } from "@/lib/enums";

// Categories differ in weight, not in alarm colors. The text label always carries the meaning.
const categoryStyles: Record<EventCategory, string> = {
  allegation: "border border-rule-strong text-ink",
  report: "border border-rule-strong text-ink-muted",
  investigation: "border border-rule-strong text-ink-muted",
  legal_proceeding: "border border-ink text-ink",
  court_outcome: "border border-ink bg-ink text-paper",
  university_outcome: "border border-accent bg-accent-soft text-ink",
  resolution: "border border-accent bg-accent-soft text-ink",
  institutional_change: "border border-rule bg-surface text-ink",
};

/** Legal/procedural status of a case event: category, then the specific event type. */
export function LegalStatusBadge({ type }: { type: CaseEventType }) {
  const info = caseEventTypeInfo[type];
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2 gap-y-1" data-category={info.category}>
      <span className={`px-1.5 py-px text-xs font-semibold uppercase tracking-wider ${categoryStyles[info.category]}`}>
        {eventCategoryLabels[info.category]}
      </span>
      <span className="text-sm font-medium">{info.label}</span>
    </span>
  );
}

export function LegalStatusLegend() {
  const shown: EventCategory[] = ["allegation", "report", "investigation", "legal_proceeding", "court_outcome", "university_outcome", "resolution", "institutional_change"];
  const meanings: Record<EventCategory, string> = {
    allegation: "A claim made by someone. Not a finding.",
    report: "A report was made to police or the university. Not a finding.",
    investigation: "An investigation began or was reopened. Not a finding.",
    legal_proceeding: "Arrests, charges, and prosecutors' decisions. Not a verdict.",
    court_outcome: "A court's decision: conviction, acquittal, or dismissal.",
    university_outcome: "The result of the university's own process, which differs from a court.",
    resolution: "Parties settled. Usually not a finding of liability.",
    institutional_change: "The institution changed a policy or practice.",
  };
  return (
    <dl className="grid gap-x-8 gap-y-3 text-[0.95rem] sm:grid-cols-2">
      {shown.map((c) => (
        <div key={c}>
          <dt>
            <span className={`px-1.5 py-px text-xs font-semibold uppercase tracking-wider ${categoryStyles[c]}`}>
              {eventCategoryLabels[c]}
            </span>
          </dt>
          <dd className="mt-1 text-ink-muted">{meanings[c]}</dd>
        </div>
      ))}
    </dl>
  );
}
