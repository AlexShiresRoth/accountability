"use client";

import { useId, useMemo, useState } from "react";
import { searchSources, type SourceOption, type SourceScope } from "@/lib/source-search";
import { sourceTypes } from "@/lib/source-types";
import { StatusBadge } from "./status";

const inputClass = "w-full border border-rule-strong bg-surface px-3 py-2 text-[0.95rem] text-ink focus:outline-none focus-visible:border-accent";

function meta(s: SourceOption): string {
  return [s.publisher, sourceTypes[s.type]?.label, s.publicationDate?.slice(0, 4)].filter(Boolean).join(" · ");
}

/**
 * Searchable source chooser (combobox). Submits the chosen source's id as `name`.
 * Type to filter by title, publisher, type, year or web address; with no query, the newest sources are listed.
 * With a `scope`, it starts on that college's sources (plus any not yet used anywhere), with a switch to all.
 */
export function SourcePicker({
  name,
  label,
  hint,
  required,
  defaultValue,
  sources,
  scope,
}: {
  name: string;
  label: string;
  hint?: string;
  required?: boolean;
  defaultValue?: string | null;
  sources: SourceOption[];
  scope?: SourceScope;
}) {
  const id = useId();
  const [selectedId, setSelectedId] = useState(defaultValue ?? "");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [scoped, setScoped] = useState(Boolean(scope));
  const selected = sources.find((s) => s.id === selectedId);
  const unused = useMemo(() => new Set(scope?.unusedIds), [scope]);
  const pool = useMemo(() => {
    if (!scope || !scoped) return sources;
    const ids = new Set([...scope.relatedIds, ...scope.unusedIds]);
    return sources.filter((s) => ids.has(s.id));
  }, [sources, scope, scoped]);
  const { results, total } = useMemo(() => searchSources(pool, query), [pool, query]);

  const choose = (s: SourceOption) => {
    setSelectedId(s.id);
    setQuery("");
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((i) => (results.length ? (i + step + results.length) % results.length : 0));
    } else if (e.key === "Enter" && open) {
      e.preventDefault(); // choose the highlighted source; never submit the form from the search box
      if (results[active]) choose(results[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const listId = `${id}-list`;
  const optionId = (i: number) => `${id}-opt-${i}`;

  return (
    <div className="space-y-1">
      <input type="hidden" name={name} value={selectedId} />
      <span className="block text-sm font-medium" id={`${id}-label`}>
        {label}
        {required && <span className="text-ink-muted"> (required)</span>}
      </span>

      {selected && !open ? (
        <div className="flex flex-wrap items-start justify-between gap-3 border border-rule-strong bg-surface px-3 py-2">
          <div className="min-w-0">
            <p className="text-[0.95rem]">
              {selected.title} <StatusBadge status={selected.status} />
            </p>
            <p className="text-xs text-ink-muted">{meta(selected)}</p>
          </div>
          <button
            type="button"
            className="text-sm font-medium underline"
            onClick={() => {
              setOpen(true);
              setActive(0);
            }}
          >
            Change
          </button>
        </div>
      ) : (
        <div className="relative">
          <input
            type="search"
            role="combobox"
            aria-labelledby={`${id}-label`}
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={open && results[active] ? optionId(active) : undefined}
            autoComplete="off"
            autoFocus={Boolean(selected)}
            placeholder="Search by title, publisher, year or web address…"
            className={inputClass}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onKeyDown={onKeyDown}
          />
          {open && (
            <div className="mt-1 border border-rule-strong bg-surface">
              {scope && (
                <div role="group" aria-label="Which sources" className="flex flex-wrap gap-2 border-b border-rule px-3 py-2 text-xs">
                  {[
                    { on: true, label: `${scope.label} (${scope.relatedIds.length}) + not yet used (${scope.unusedIds.length})` },
                    { on: false, label: `All sources (${sources.length})` },
                  ].map((t) => (
                    <button
                      key={String(t.on)}
                      type="button"
                      aria-pressed={scoped === t.on}
                      // mousedown keeps focus in the search box, so the list stays open
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setScoped(t.on);
                        setActive(0);
                      }}
                      className={`border px-2 py-0.5 ${scoped === t.on ? "border-ink bg-ink text-paper" : "border-rule-strong text-ink"}`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              )}
              <p className="border-b border-rule px-3 py-1.5 text-xs text-ink-muted" aria-live="polite">
                {query.trim()
                  ? total === 0
                    ? scoped && scope
                      ? "No sources match here. Try All sources, or create it under Sources first."
                      : "No sources match. Create it under Sources first."
                    : `${total} match${total === 1 ? "" : "es"}${total > results.length ? `, showing the first ${results.length}` : ""}`
                  : `Recently added (${pool.length} source${pool.length === 1 ? "" : "s"} here). Type to search.`}
              </p>
              <ul id={listId} role="listbox" aria-labelledby={`${id}-label`} className="max-h-72 overflow-y-auto">
                {results.map((s, i) => (
                  <li
                    key={s.id}
                    id={optionId(i)}
                    role="option"
                    aria-selected={s.id === selectedId}
                    // mousedown, not click: keeps focus in the input so its blur doesn't close the list first
                    onMouseDown={(e) => {
                      e.preventDefault();
                      choose(s);
                    }}
                    onMouseEnter={() => setActive(i)}
                    className={`cursor-pointer border-b border-rule px-3 py-2 last:border-b-0 ${i === active ? "bg-accent-soft" : ""}`}
                  >
                    <span className="block text-[0.95rem]">
                      {s.title} <StatusBadge status={s.status} />
                    </span>
                    <span className="block text-xs text-ink-muted">
                      {meta(s)}
                      {unused.has(s.id) && <span className="ml-2 border border-rule-strong px-1">Not yet used</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      {hint && <p className="text-xs text-ink-muted">{hint}</p>}
    </div>
  );
}
