"use client";

import Link from "next/link";
import { useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import type { PublicSourceIndex } from "@/lib/public";
import { matchesAllWords } from "@/lib/source-search";
import { sourceTypes, type SourceType } from "@/lib/source-types";
import { SourceDetails } from "./cite";

export const PAGE_SIZE = 25;
const typeOrder = Object.keys(sourceTypes) as SourceType[];

type IndexedSource = PublicSourceIndex["sources"][number];
/** `type` is a source type key, or "" for every type. */
export type SourceFilters = { q: string; college: string; type: SourceType | "" };

const searchText = (s: IndexedSource) =>
  [s.title, s.publisher, sourceTypes[s.type].label, s.publicationDate ?? "", s.url ?? "", s.notes ?? ""].join(" ");

/**
 * `college` value for published sources that no published page cites yet, e.g. a news article whose coverage
 * entry is still a draft. Without it, the per-university counts would not add up to the total.
 */
export const NOT_YET_CITED = "not-yet-cited";

const isSourceType = (value: string): value is SourceType => (typeOrder as string[]).includes(value);

/** Filters from a query string. An unknown university or type is ignored rather than showing an empty list. */
export function readFilters(search: string, colleges: { slug: string }[]): SourceFilters {
  const params = new URLSearchParams(search);
  const requested = params.get("college") ?? "";
  const known = requested === NOT_YET_CITED || colleges.some((c) => c.slug === requested);
  const type = params.get("type") ?? "";
  return { q: params.get("q") ?? "", college: known ? requested : "", type: isSourceType(type) ? type : "" };
}

/** The query string for a set of filters: "" when unfiltered. */
export function filtersToQuery({ q, college, type }: SourceFilters): string {
  const p = new URLSearchParams();
  if (type) p.set("type", type);
  if (college) p.set("college", college);
  if (q) p.set("q", q);
  const query = p.toString();
  return query ? `?${query}` : "";
}

/** Sources of the type and cited for the university (if any) that match every word of the search, ordered by type. */
export function filterSources(sources: IndexedSource[], { q, college, type }: SourceFilters): IndexedSource[] {
  return sources
    .filter((s) => !type || s.type === type)
    .filter((s) => !college || (college === NOT_YET_CITED ? s.colleges.length === 0 : s.colleges.includes(college)))
    .filter((s) => matchesAllWords(searchText(s), q))
    .sort((a, b) => typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type));
}

// The filters live in the address bar (?type=…&college=…&q=…), so a filtered view can be shared. The page is static:
// it renders unfiltered on the server, then the browser applies whatever the URL says.
const URL_CHANGED = "source-index:url";

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(URL_CHANGED, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(URL_CHANGED, onChange);
  };
}

function writeFilters(filters: SourceFilters) {
  window.history.replaceState(null, "", `${window.location.pathname}${filtersToQuery(filters)}${window.location.hash}`);
  window.dispatchEvent(new Event(URL_CHANGED));
}

/** Searchable, filterable list of every published source, grouped by type. */
export function SourceIndex({ index }: { index: PublicSourceIndex }) {
  const search = useSyncExternalStore(subscribe, () => window.location.search, () => "");
  const { q, college, type } = readFilters(search, index.colleges);
  const [shown, setShown] = useState(PAGE_SIZE);
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());

  const update = (next: Partial<SourceFilters>) => {
    setShown(PAGE_SIZE);
    writeFilters({ q, college, type, ...next });
  };

  // Tab counts follow the search and university filters, so each tab says how many sources it would show.
  const untyped = filterSources(index.sources, { q, college, type: "" });
  const matches = type ? untyped.filter((s) => s.type === type) : untyped;
  const visible = matches.slice(0, shown);
  const groups = typeOrder.map((t) => [t, visible.filter((s) => s.type === t)] as const).filter(([, list]) => list.length);
  const names = new Map(index.colleges.map((c) => [c.slug, c.name]));
  const filtered = Boolean(type || college || q.trim());
  const notYetCited = index.sources.filter((s) => s.colleges.length === 0).length;

  // One tab per type the index has at all, so tabs don't come and go as the search changes.
  const tabs: { key: SourceType | ""; label: string; count: number }[] = [
    { key: "", label: "All", count: untyped.length },
    ...typeOrder
      .filter((t) => index.sources.some((s) => s.type === t))
      .map((t) => ({ key: t, label: sourceTypes[t].label, count: untyped.filter((s) => s.type === t).length })),
  ];

  // Arrow keys, Home and End move between tabs and select them, as in the WAI-ARIA tabs pattern.
  const onTabKey = (e: KeyboardEvent) => {
    const at = tabs.findIndex((t) => t.key === type);
    const moves: Record<string, number> = { ArrowRight: at + 1, ArrowLeft: at - 1, Home: 0, End: tabs.length - 1 };
    if (!(e.key in moves)) return;
    e.preventDefault();
    const next = tabs[(moves[e.key] + tabs.length) % tabs.length];
    update({ type: next.key });
    tabRefs.current.get(next.key)?.focus();
  };

  if (index.sources.length === 0) return <p className="mt-3 text-ink-muted">No verified sources have been published yet.</p>;

  return (
    <div className="mt-6 space-y-8">
      <form role="search" className="grid gap-4 sm:grid-cols-[1fr_16rem]" onSubmit={(e) => e.preventDefault()}>
        <label className="block space-y-1">
          <span className="block text-sm font-medium">Search sources</span>
          <input
            type="search"
            value={q}
            onChange={(e) => update({ q: e.target.value })}
            placeholder="Title, publisher, year or web address"
            autoComplete="off"
            className="w-full border border-rule-strong bg-surface px-3 py-2 text-ink placeholder:text-ink-muted/70 focus:outline-none focus-visible:border-accent"
          />
        </label>
        <label className="block space-y-1">
          <span className="block text-sm font-medium">University</span>
          <select
            value={college}
            onChange={(e) => update({ college: e.target.value })}
            className="w-full border border-rule-strong bg-surface px-3 py-2 text-ink focus:outline-none focus-visible:border-accent"
          >
            <option value="">All sources ({index.sources.length})</option>
            {index.colleges.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name} ({c.count})
              </option>
            ))}
            {notYetCited > 0 && <option value={NOT_YET_CITED}>Not yet cited on a published page ({notYetCited})</option>}
          </select>
          <span className="block text-xs text-ink-muted">A source is listed under a university once a published page cites it.</span>
        </label>
      </form>

      <div
        role="tablist"
        aria-label="Source type"
        onKeyDown={onTabKey}
        className="-mx-4 flex gap-1 overflow-x-auto border-b border-rule px-4 sm:mx-0 sm:px-0"
      >
        {tabs.map((t) => {
          const selected = t.key === type;
          return (
            <button
              key={t.key || "all"}
              ref={(el) => {
                if (el) tabRefs.current.set(t.key, el);
                else tabRefs.current.delete(t.key);
              }}
              type="button"
              role="tab"
              id={`source-tab-${t.key || "all"}`}
              aria-selected={selected}
              aria-controls="source-index-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => update({ type: t.key })}
              className={`-mb-px shrink-0 whitespace-nowrap border-b-2 px-3 py-2 text-sm ${
                selected
                  ? "border-accent font-semibold text-ink"
                  : "border-transparent text-ink-muted hover:border-rule-strong hover:text-ink"
              }`}
            >
              {t.label} <span className="tabular font-normal text-ink-muted">{t.count}</span>
            </button>
          );
        })}
      </div>

      <div id="source-index-panel" role="tabpanel" aria-labelledby={`source-tab-${type || "all"}`} className="space-y-8">
        <p className="text-sm text-ink-muted" aria-live="polite">
          {matches.length === 0
            ? "No sources match."
            : `Showing ${visible.length} of ${matches.length} source${matches.length === 1 ? "" : "s"}` +
              (type ? ` of type ${sourceTypes[type].label.toLowerCase()}` : "") +
              (college === NOT_YET_CITED ? " not yet cited on a published page" : college ? ` cited for ${names.get(college)}` : "") +
              (q.trim() ? ` matching “${q.trim()}”` : "") +
              "."}{" "}
          {filtered && (
            <button type="button" className="font-medium text-ink underline" onClick={() => update({ q: "", college: "", type: "" })}>
              Clear filters
            </button>
          )}
        </p>

        {groups.map(([t, list]) => (
          <div key={t}>
            {!type && (
              <h3 className="mb-3 text-lg">
                {sourceTypes[t].label}{" "}
                <span className="font-sans text-sm font-normal text-ink-muted">({untyped.filter((s) => s.type === t).length})</span>
              </h3>
            )}
            <ul className="divide-y divide-rule border-y border-rule">
              {list.map((src) => (
                <li key={src.id} className="py-4">
                  <SourceDetails source={src} />
                  {src.colleges.length > 0 && (
                    <p className="mt-1 text-sm text-ink-muted">
                      Cited for{" "}
                      {src.colleges.map((slug, i) => (
                        <span key={slug}>
                          {i > 0 && ", "}
                          <Link href={`/college/${slug}`}>{names.get(slug) ?? slug}</Link>
                        </span>
                      ))}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {matches.length > visible.length && (
          <button
            type="button"
            onClick={() => setShown((n) => n + PAGE_SIZE)}
            className="border border-ink px-5 py-2 font-medium text-ink hover:bg-ink hover:text-paper"
          >
            Show {Math.min(PAGE_SIZE, matches.length - visible.length)} more
          </button>
        )}
      </div>
    </div>
  );
}
