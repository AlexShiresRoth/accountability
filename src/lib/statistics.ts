import { cleryGeographies, offenses, type CleryGeography, type Offense } from "./enums";

/** One published figure from one Annual Security Report. */
export type StatisticInput = {
  statisticId: string;
  reportId: string;
  reportYear: number;
  calendarYear: number;
  offense: Offense;
  geography: CleryGeography;
  /** null = not reported / not located. Never coerced to 0. */
  count: number | null;
  unfoundedCount: number | null;
  footnoteIds: string[];
  underReview: boolean;
};

export type ResolvedStatistic = {
  calendarYear: number;
  offense: Offense;
  geography: CleryGeography;
  count: number | null;
  unfoundedCount: number | null;
  /** The figure shown comes from this report. */
  statisticId: string;
  reportYear: number;
  /** Figures for the same cell in other (older) reports that differ from the one shown. */
  revisions: { reportYear: number; count: number | null }[];
  /** Footnotes from every report that published this cell, so none are discarded. */
  footnoteIds: string[];
  underReview: boolean;
};

const cellKey = (s: { calendarYear: number; offense: string; geography: string }) =>
  `${s.calendarYear}|${s.offense}|${s.geography}`;

/**
 * Each Annual Security Report covers three calendar years, so one year can appear in several reports,
 * sometimes with revised figures. The most recent report's figure is shown; differing earlier figures
 * are surfaced as revisions. Geographies are kept separate. They overlap and must never be summed.
 */
export function resolveStatistics(inputs: StatisticInput[]): ResolvedStatistic[] {
  const groups = new Map<string, StatisticInput[]>();
  for (const input of inputs) {
    const key = cellKey(input);
    const group = groups.get(key);
    if (group) group.push(input);
    else groups.set(key, [input]);
  }

  const resolved: ResolvedStatistic[] = [];
  for (const group of groups.values()) {
    const sorted = [...group].sort((a, b) => b.reportYear - a.reportYear);
    const [latest, ...older] = sorted;
    resolved.push({
      calendarYear: latest.calendarYear,
      offense: latest.offense,
      geography: latest.geography,
      count: latest.count,
      unfoundedCount: latest.unfoundedCount,
      statisticId: latest.statisticId,
      reportYear: latest.reportYear,
      revisions: older.filter((o) => o.count !== latest.count).map((o) => ({ reportYear: o.reportYear, count: o.count })),
      footnoteIds: [...new Set(sorted.flatMap((s) => s.footnoteIds))],
      underReview: latest.underReview,
    });
  }

  const offenseOrder = (o: Offense) => offenses.indexOf(o);
  const geographyOrder = (g: CleryGeography) => cleryGeographies.indexOf(g);
  return resolved.sort(
    (a, b) =>
      a.calendarYear - b.calendarYear ||
      offenseOrder(a.offense) - offenseOrder(b.offense) ||
      geographyOrder(a.geography) - geographyOrder(b.geography),
  );
}

/** Calendar years that have at least one resolved figure, ascending. */
export function reportingYears(stats: ResolvedStatistic[]): number[] {
  return [...new Set(stats.map((s) => s.calendarYear))].sort((a, b) => a - b);
}
