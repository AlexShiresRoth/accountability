"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import type { PublicSourceIndex } from "@/lib/public";
import { matchesAllWords } from "@/lib/source-search";
import { sourceTypes, type SourceType } from "@/lib/source-types";
import { SourceDetails } from "./cite";

export const PAGE_SIZE = 25;
const typeOrder = Object.keys(sourceTypes) as SourceType[];

type IndexedSource = PublicSourceIndex["sources"][number];
export type SourceFilters = { q: string; college: string };

const searchText = (s: IndexedSource) =>
  [s.title, s.publisher, sourceTypes[s.type].label, s.publicationDate ?? "", s.url ?? "", s.notes ?? ""].join(" ");

/**
 * `college` value for published sources that no published page cites yet, e.g. a news article whose coverage
 * entry is still a draft. Without it, the per-university counts would not add up to the total.
 */
export const NOT_YET_CITED = "not-yet-cited";

/** Filters from a query string. An unknown university is ignored rather than showing an empty list. */
export function readFilters(search: string, colleges: { slug: string }[]): SourceFilters {
  const params = new URLSearchParams(search);
  const requested = params.get("college") ?? "";
  const known = requested === NOT_YET_CITED || colleges.some((c) => c.slug === requested);
  return { q: params.get("q") ?? "", college: known ? requested : "" };
}

/** The query string for a set of filters: "" when unfiltered. */
export function filtersToQuery({ q, college }: SourceFilters): string {
  const p = new URLSearchParams();
  if (college) p.set("college", college);
  if (q) p.set("q", q);
  const query = p.toString();
  return query ? `?${query}` : "";
}

/** Sources cited for the university (if any) that match every word of the search, ordered by source type. */
export function filterSources(sources: IndexedSource[], { q, college }: SourceFilters): IndexedSource[] {
  return sources
    .filter((s) => !college || (college === NOT_YET_CITED ? s.colleges.length === 0 : s.colleges.includes(college)))
    .filter((s) => matchesAllWords(searchText(s), q))
    .sort((a, b) => typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type));
}

// The filters live in the address bar (?college=…&q=…), so a filtered view can be shared. The page is static:
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
  const { q, college } = readFilters(search, index.colleges);
  const [shown, setShown] = useState(PAGE_SIZE);

  const update = (next: Partial<SourceFilters>) => {
    setShown(PAGE_SIZE);
    writeFilters({ q, college, ...next });
  };

  const matches = useMemo(() => filterSources(index.sources, { q, college }), [index.sources, college, q]);
  const visible = matches.slice(0, shown);
  const groups = typeOrder.map((type) => [type, visible.filter((s) => s.type === type)] as const).filter(([, list]) => list.length);
  const names = new Map(index.colleges.map((c) => [c.slug, c.name]));
  const filtered = Boolean(college || q.trim());
  const notYetCited = index.sources.filter((s) => s.colleges.length === 0).length;

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

      <p className="text-sm text-ink-muted" aria-live="polite">
        {matches.length === 0
          ? "No sources match."
          : `Showing ${visible.length} of ${matches.length} source${matches.length === 1 ? "" : "s"}` +
            (college === NOT_YET_CITED ? " not yet cited on a published page" : college ? ` cited for ${names.get(college)}` : "") +
            (q.trim() ? ` matching “${q.trim()}”` : "") +
            "."}{" "}
        {filtered && (
          <button type="button" className="font-medium text-ink underline" onClick={() => update({ q: "", college: "" })}>
            Clear filters
          </button>
        )}
      </p>

      {groups.map(([type, list]) => (
        <div key={type}>
          <h3 className="text-lg">
            {sourceTypes[type].label}{" "}
            <span className="font-sans text-sm font-normal text-ink-muted">({matches.filter((s) => s.type === type).length})</span>
          </h3>
          <ul className="mt-3 divide-y divide-rule border-y border-rule">
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
  );
}
