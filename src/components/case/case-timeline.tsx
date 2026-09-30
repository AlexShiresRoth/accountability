import { Cite } from "@/components/cite";
import { UnderReviewTag } from "@/components/tags";
import { caseEventTypeInfo, type EventCategory } from "@/lib/case-events";
import { formatDate } from "@/lib/dates";
import { citationKey } from "@/lib/citations";
import type { CitationIndex, PublicCaseEvent } from "@/lib/public";
import { LegalStatusBadge } from "./legal-status-badge";

const OUTCOME_CATEGORIES: EventCategory[] = ["court_outcome", "university_outcome", "resolution"];

export function hasDocumentedOutcome(events: PublicCaseEvent[]) {
  return events.some((e) => OUTCOME_CATEGORIES.includes(caseEventTypeInfo[e.eventType].category));
}

/** Chronological case timeline. Events arrive ordered by date, then sequence (see getCase). */
export function CaseTimeline({ events, citations }: { events: PublicCaseEvent[]; citations: CitationIndex }) {
  if (!events.length) return <p className="text-ink-muted">No verified events have been published for this case.</p>;
  const byId = new Map(events.map((e) => [e.id, e]));

  return (
    <ol className="relative space-y-10 border-l border-rule-strong pl-6 sm:pl-8">
      {events.map((e) => {
        const supersededBy = e.supersededByEventId ? byId.get(e.supersededByEventId) : undefined;
        const supersedes = e.supersedesEventId ? byId.get(e.supersedesEventId) : undefined;
        return (
          <li key={e.id} id={`event-${e.id}`} className="relative scroll-mt-16">
            <span aria-hidden className="absolute -left-[1.84rem] top-1.5 size-2.5 rounded-full bg-ink ring-4 ring-paper sm:-left-[2.34rem]" />
            <p className="text-sm text-ink-muted">
              <time dateTime={e.eventDate}>{formatDate(e.eventDate, e.datePrecision)}</time>
              {e.datePrecision !== "day" && <span> (exact date not given in sources)</span>}
            </p>
            <div className="mt-1.5">
              <LegalStatusBadge type={e.eventType} />
            </div>
            <p className="mt-2 max-w-[62ch]">
              {e.description}
              <Cite id={`event-${e.id}`} citations={citations[citationKey("caseEvent", e.id)]} />
            </p>
            <p className="mt-1 text-sm text-ink-muted">{caseEventTypeInfo[e.eventType].meaning}</p>
            {(e.underReview || supersededBy || supersedes) && (
              <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                {e.underReview && <UnderReviewTag />}
                {supersededBy && (
                  <span className="border border-ink px-1.5 py-px font-medium">
                    Updated: see{" "}
                    <a href={`#event-${supersededBy.id}`}>{formatDate(supersededBy.eventDate, supersededBy.datePrecision)}</a>
                  </span>
                )}
                {supersedes && (
                  <span className="text-ink-muted">
                    Updates the entry from{" "}
                    <a href={`#event-${supersedes.id}`}>{formatDate(supersedes.eventDate, supersedes.datePrecision)}</a>
                  </span>
                )}
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
