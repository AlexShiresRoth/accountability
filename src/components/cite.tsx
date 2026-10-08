import type { PublicCitation, PublicSource } from "@/lib/public";
import { sourceTypes } from "@/lib/source-types";
import { formatDate } from "@/lib/dates";
import { sourceAccessLabels } from "@/lib/labels";
import { Linkify } from "./linkify";

// Citations sit inside running text (<p>, <li>, <dd>), so everything here must be phrasing content:
// only <span>, <a>, <button>, <q>. Block elements inside a <p> are invalid HTML and break hydration.

/**
 * Inline citation marker. One click opens the evidence: source, date, pinpoint, excerpt, and links.
 * Uses the native Popover API, so it works without client JavaScript.
 */
export function Cite({ id, citations }: { id: string; citations: PublicCitation[] | undefined }) {
  if (!citations?.length) return null;
  const popoverId = `cite-${id}`;
  return (
    <>
      <button
        type="button"
        popoverTarget={popoverId}
        className="ml-1 inline-flex items-baseline rounded-sm px-1 align-baseline text-[0.8em] font-medium text-accent underline decoration-1 underline-offset-2 hover:decoration-2"
        aria-label={`View ${citations.length === 1 ? "source" : `${citations.length} sources`}`}
      >
        {citations.length === 1 ? "Source" : `${citations.length} sources`}
      </button>
      <span
        id={popoverId}
        popover="auto"
        role="dialog"
        aria-label={citations.length === 1 ? "Source" : "Sources"}
        className="m-auto w-[min(34rem,calc(100vw-2rem))] border border-rule-strong bg-surface p-0 text-left text-base font-normal not-italic text-ink shadow-xl"
      >
        <span className="flex items-center justify-between border-b border-rule px-5 py-3">
          <span className="text-sm font-semibold uppercase tracking-wider text-ink-muted">
            {citations.length === 1 ? "Source" : "Sources"}
          </span>
          <button type="button" popoverTarget={popoverId} popoverTargetAction="hide" className="text-sm text-ink-muted underline">
            Close
          </button>
        </span>
        <span role="list" className="block max-h-[70vh] divide-y divide-rule overflow-y-auto">
          {citations.map((c) => (
            <span role="listitem" key={c.id} className="block space-y-2 px-5 py-4 text-[0.95rem]">
              <SourceDetails source={c.source} />
              {c.claim && <span className="block text-ink-muted">Supports: {c.claim}</span>}
              {c.pinpoint && <span className="block text-ink-muted">Location in source: {c.pinpoint}</span>}
              {c.excerpt && (
                <q className="block border-l-2 border-rule-strong pl-3 italic text-ink-muted">
                  <Linkify text={c.excerpt} />
                </q>
              )}
            </span>
          ))}
        </span>
      </span>
    </>
  );
}

export function SourceDetails({ source }: { source: PublicSource }) {
  return (
    <span className="block space-y-1">
      <span className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
        {sourceTypes[source.type].label}
        {source.isDemo && " · Demo fixture"}
        {source.unverified && " · Not yet verified (preview)"}
      </span>
      <span className="block font-medium">{source.title}</span>
      <span className="block text-ink-muted">
        {source.publisher}
        {source.publicationDate && `, ${formatDate(source.publicationDate)}`}
      </span>
      <span className="flex flex-wrap gap-x-4 gap-y-1">
        {source.url && (
          <a href={source.url} target="_blank" rel="noopener noreferrer">
            Open source
          </a>
        )}
        {sourceAccessLabels[source.access] && (
          <span className="text-ink-muted" title={sourceAccessLabels[source.access]!.description}>
            {sourceAccessLabels[source.access]!.title}
          </span>
        )}
        {source.archivedUrl && (
          <a href={source.archivedUrl} target="_blank" rel="noopener noreferrer">
            Archived copy
          </a>
        )}
        {source.retrievedAt && <span className="text-ink-muted">Retrieved {formatDate(source.retrievedAt)}</span>}
      </span>
      {source.notes && (
        <span className="block text-ink-muted">
          <Linkify text={source.notes} />
        </span>
      )}
    </span>
  );
}
