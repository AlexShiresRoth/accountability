"use client";

import { useId, useMemo, useState } from "react";
import type { CleryGeography, Offense } from "@/lib/enums";
import { cleryGeographies, offenses } from "@/lib/enums";
import { geographyDescriptions, geographyLabels, leadOffenses, offenseLabels } from "@/lib/labels";
import type { ResolvedStatistic } from "@/lib/statistics";
import { Linkify } from "@/components/linkify";

/** One footnote id → its displayed note. Identical notes repeated across reports share a number and anchor. */
export type FootnoteRef = { id: string; number: number; text: string; anchor: string };

type Props = {
  statistics: ResolvedStatistic[];
  footnotes: FootnoteRef[];
};

const key = (year: number, offense: string, geography: string) => `${year}|${offense}|${geography}`;

/**
 * Clery statistics by offense and year for ONE geography at a time.
 * Geographies overlap (residential ⊂ on campus), so they are never combined or summed.
 * All panels share one y-scale: per-panel scales would make small changes look dramatic.
 */
export function StatisticsExplorer({ statistics, footnotes }: Props) {
  const cells = useMemo(() => new Map(statistics.map((s) => [key(s.calendarYear, s.offense, s.geography), s])), [statistics]);
  const footnoteById = useMemo(() => new Map(footnotes.map((f) => [f.id, f])), [footnotes]);
  const years = useMemo(() => [...new Set(statistics.map((s) => s.calendarYear))].sort((a, b) => a - b), [statistics]);
  const geographies = cleryGeographies.filter((g) => statistics.some((s) => s.geography === g));
  const shownOffenses: Offense[] = offenses.filter(
    (o) => leadOffenses.includes(o) || statistics.some((s) => s.offense === o),
  );
  shownOffenses.sort((a, b) => rank(a) - rank(b));

  const [geography, setGeography] = useState<CleryGeography>(geographies.includes("on_campus") ? "on_campus" : geographies[0]);
  const groupName = useId();

  const current = statistics.filter((s) => s.geography === geography);
  const yMax = niceMax(Math.max(1, ...current.map((s) => s.count ?? 0)));

  return (
    <div className="space-y-8">
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-ink-muted">Location category</legend>
        <div className="flex flex-wrap gap-2">
          {geographies.map((g) => (
            <label
              key={g}
              className={`cursor-pointer border px-3 py-1.5 text-[0.95rem] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${
                g === geography ? "border-ink bg-ink text-paper" : "border-rule-strong text-ink hover:border-ink"
              }`}
            >
              <input
                type="radio"
                name={groupName}
                value={g}
                checked={g === geography}
                onChange={() => setGeography(g)}
                className="sr-only"
              />
              {geographyLabels[g]}
            </label>
          ))}
        </div>
        <p className="mt-3 max-w-[62ch] text-[0.95rem] text-ink-muted">
          {geographyDescriptions[geography]} Categories overlap and are never added together.
        </p>
      </fieldset>

      <div className="grid border-t border-l border-rule sm:grid-cols-2 lg:grid-cols-3">
        {shownOffenses.map((offense) => (
          <OffensePanel
            key={offense}
            offense={offense}
            years={years}
            yMax={yMax}
            cellFor={(year) => cells.get(key(year, offense, geography))}
            footnoteById={footnoteById}
          />
        ))}
      </div>

      <StatisticsTable
        years={years}
        offenses={shownOffenses}
        geography={geography}
        cellFor={(year, offense) => cells.get(key(year, offense, geography))}
        footnoteById={footnoteById}
      />
    </div>
  );
}

function rank(o: Offense) {
  const i = leadOffenses.indexOf(o);
  return i === -1 ? leadOffenses.length + offenses.indexOf(o) : i;
}

function uniqueByNumber(ids: string[], footnoteById: Map<string, FootnoteRef>): FootnoteRef[] {
  const seen = new Map<number, FootnoteRef>();
  for (const id of ids) {
    const f = footnoteById.get(id);
    if (f && !seen.has(f.number)) seen.set(f.number, f);
  }
  return [...seen.values()].sort((a, b) => a.number - b.number);
}

function niceMax(n: number) {
  if (n <= 5) return 5;
  if (n <= 10) return 10;
  const magnitude = 10 ** Math.floor(Math.log10(n));
  return Math.ceil(n / (magnitude / 2)) * (magnitude / 2);
}

function describeCell(year: number, cell: ResolvedStatistic | undefined, footnoteById: Map<string, FootnoteRef>) {
  if (!cell || cell.count === null) return `${year}: not reported or not located`;
  const parts = [`${year}: ${cell.count} reported`];
  if (cell.unfoundedCount) parts.push(`${cell.unfoundedCount} unfounded (not included)`);
  for (const f of uniqueByNumber(cell.footnoteIds, footnoteById)) parts.push(`see note ${f.number}`);
  if (cell.revisions.length) {
    parts.push(
      `revised; earlier ${cell.revisions.map((r) => `${r.reportYear} report: ${r.count ?? "not reported"}`).join(", ")}`,
    );
  }
  if (cell.underReview) parts.push("under review");
  return parts.join(" · ");
}

// ---------------------------------------------------------------------------

const W = 260;
const H = 150;
const PAD = { top: 22, right: 8, bottom: 22, left: 8 };

function OffensePanel({
  offense,
  years,
  yMax,
  cellFor,
  footnoteById,
}: {
  offense: Offense;
  years: number[];
  yMax: number;
  cellFor: (year: number) => ResolvedStatistic | undefined;
  footnoteById: Map<string, FootnoteRef>;
}) {
  const [active, setActive] = useState<number | null>(null);
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const slot = plotW / Math.max(years.length, 1);
  const barW = Math.min(24, slot * 0.5);
  const baseline = PAD.top + plotH;

  const panelNotes = uniqueByNumber(years.flatMap((y) => cellFor(y)?.footnoteIds ?? []), footnoteById);

  return (
    <figure className="border-r border-b border-rule p-4">
      <figcaption className="font-serif text-lg font-semibold">{offenseLabels[offense]}</figcaption>
      <p aria-live="polite" className="mt-0.5 min-h-[1.5em] text-sm text-ink-muted">
        {active !== null ? describeCell(active, cellFor(active), footnoteById) : " "}
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-1 block h-auto w-full" role="group" aria-label={`${offenseLabels[offense]} by year`}>
        <line x1={PAD.left} x2={W - PAD.right} y1={baseline} y2={baseline} stroke="var(--rule-strong)" strokeWidth={1} />
        {years.map((year, i) => {
          const cell = cellFor(year);
          const cx = PAD.left + slot * i + slot / 2;
          const h = cell?.count ? (cell.count / yMax) * plotH : 0;
          const top = baseline - h;
          const notes = uniqueByNumber(cell?.footnoteIds ?? [], footnoteById).map((f) => f.number);
          const isActive = active === year;
          return (
            <g
              key={year}
              tabIndex={0}
              role="img"
              aria-label={describeCell(year, cell, footnoteById)}
              onPointerEnter={() => setActive(year)}
              onPointerLeave={() => setActive(null)}
              onFocus={() => setActive(year)}
              onBlur={() => setActive(null)}
              className="outline-none focus-visible:[&>rect:first-child]:stroke-[var(--accent)]"
            >
              {/* Hit target: the full slot, larger than the mark. */}
              <rect x={cx - slot / 2} y={PAD.top - 20} width={slot} height={plotH + 40} fill="transparent" strokeWidth={2} />
              {h > 0 && (
                <path d={roundedTopBar(cx - barW / 2, top, barW, h, 4)} fill="var(--chart-mark)" opacity={isActive || active === null ? 1 : 0.55} />
              )}
              <text
                x={cx}
                y={cell?.count === null || !cell ? baseline - 6 : top - 6}
                textAnchor="middle"
                className="tabular"
                fontSize={13}
                fill={cell?.count === null || !cell ? "var(--ink-muted)" : "var(--ink)"}
                fontWeight={500}
              >
                {cell?.count === null || !cell ? "—" : cell.count}
                {notes.length > 0 && (
                  <tspan fontSize={9} dy={-5} fill="var(--ink-muted)">
                    {` [${notes.join(",")}]`}
                  </tspan>
                )}
                {cell?.revisions.length ? (
                  <tspan fontSize={9} dy={notes.length ? 0 : -5} fill="var(--ink-muted)">
                    {" rev."}
                  </tspan>
                ) : null}
              </text>
              <text x={cx} y={H - 5} textAnchor="middle" fontSize={11} fill="var(--ink-muted)" className="tabular">
                {year}
              </text>
            </g>
          );
        })}
      </svg>
      {panelNotes.length > 0 && (
        <ul className="mt-3 space-y-1 border-t border-rule pt-3 text-sm text-caution-ink">
          {panelNotes.map((f) => (
            <li key={f.id}>
              <a href={`#${f.anchor}`} className="text-caution-ink">
                Note {f.number}
              </a>
              : <Linkify text={f.text} />
            </li>
          ))}
        </ul>
      )}
    </figure>
  );
}

/** Column path: 4px rounded data-end, square at the baseline. */
function roundedTopBar(x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h);
  return `M${x},${y + h} V${y + rr} Q${x},${y} ${x + rr},${y} H${x + w - rr} Q${x + w},${y} ${x + w},${y + rr} V${y + h} Z`;
}

// ---------------------------------------------------------------------------

function StatisticsTable({
  years,
  offenses: rows,
  geography,
  cellFor,
  footnoteById,
}: {
  years: number[];
  offenses: Offense[];
  geography: CleryGeography;
  cellFor: (year: number, offense: Offense) => ResolvedStatistic | undefined;
  footnoteById: Map<string, FootnoteRef>;
}) {
  const hasUnfounded = rows.some((o) => years.some((y) => cellFor(y, o)?.unfoundedCount));
  const revisions = rows.flatMap((o) =>
    years.flatMap((y) => {
      const c = cellFor(y, o);
      return c?.revisions.length ? [{ offense: o, cell: c }] : [];
    }),
  );

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-left text-[0.95rem]">
          <caption className="mb-3 text-left text-sm text-ink-muted">
            Reported incidents by calendar year of report: {geographyLabels[geography].toLowerCase()}
          </caption>
          <thead>
            <tr className="border-b border-rule-strong">
              <th scope="col" className="py-2 pr-4 font-medium">
                Offense
              </th>
              {years.map((y) => (
                <th key={y} scope="col" className="tabular px-3 py-2 text-right font-medium">
                  {y}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((offense) => (
              <tr key={offense} className="border-b border-rule">
                <th scope="row" className="py-2 pr-4 font-normal">
                  {offenseLabels[offense]}
                </th>
                {years.map((y) => {
                  const c = cellFor(y, offense);
                  return (
                    <td key={y} className="tabular px-3 py-2 text-right">
                      {!c || c.count === null ? <span className="text-ink-muted">—</span> : c.count}
                      {c?.unfoundedCount ? (
                        <span className="ml-1 text-[0.75em] whitespace-nowrap text-ink-muted" title="Determined by law enforcement to be false or baseless; not included in the count">
                          +{c.unfoundedCount} unfounded
                        </span>
                      ) : null}
                      {uniqueByNumber(c?.footnoteIds ?? [], footnoteById).map((f) => (
                        <a key={f.number} href={`#${f.anchor}`} className="ml-0.5 align-super text-[0.7em]" aria-label={`Note ${f.number}`}>
                          [{f.number}]
                        </a>
                      ))}
                      {c?.revisions.length ? (
                        <span className="ml-1 text-[0.75em] text-ink-muted" title="Revised from an earlier report">
                          rev.
                        </span>
                      ) : null}
                      {c?.underReview && (
                        <span className="ml-1 text-[0.75em] text-caution-ink" title="Under review">
                          ◦
                        </span>
                      )}
                      {c?.unverified && (
                        <span className="ml-1 text-[0.75em] text-demo-ink" title="Preview: not yet verified">
                          unverified
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <dl className="mt-4 grid gap-1 text-sm text-ink-muted">
        <div>
          <dt className="inline">—</dt> <dd className="inline">Not reported, or not located in the sources reviewed. Not the same as zero.</dd>
        </div>
        <div>
          <dt className="inline">rev.</dt>{" "}
          <dd className="inline">An earlier report gave a different figure; the most recent report&rsquo;s figure is shown.</dd>
        </div>
        {hasUnfounded && (
          <div>
            <dt className="inline">unfounded</dt>{" "}
            <dd className="inline">
              Reports that law enforcement determined, after investigation, to be false or baseless. Listed separately in the
              report and not included in the count.
            </dd>
          </div>
        )}
        <div>
          <dt className="inline text-caution-ink">◦</dt> <dd className="inline">Under review; this figure is being re-verified.</dd>
        </div>
      </dl>
      {revisions.length > 0 && (
        <div className="mt-4 text-sm">
          <p className="font-medium">Revised figures</p>
          <ul className="mt-1 space-y-1 text-ink-muted">
            {revisions.map(({ offense, cell }) => (
              <li key={`${offense}-${cell.calendarYear}`}>
                {offenseLabels[offense]}, {cell.calendarYear}: {cell.count ?? "not reported"} in the {cell.reportYear} report;{" "}
                {cell.revisions.map((r) => `${r.count ?? "not reported"} in the ${r.reportYear} report`).join("; ")}.
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
