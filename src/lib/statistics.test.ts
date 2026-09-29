import { describe, expect, it } from "vitest";
import { reportingYears, resolveStatistics, type StatisticInput } from "./statistics";

let n = 0;
const stat = (o: Partial<StatisticInput>): StatisticInput => ({
  statisticId: `s${++n}`,
  reportId: "r2025",
  reportYear: 2025,
  calendarYear: 2024,
  offense: "rape",
  geography: "on_campus",
  count: 1,
  unfoundedCount: null,
  footnoteIds: [],
  underReview: false,
  ...o,
});

describe("resolveStatistics", () => {
  it("shows the most recent report's figure when reports overlap, and flags differing earlier figures", () => {
    const [cell] = resolveStatistics([
      stat({ reportId: "r2024", reportYear: 2024, calendarYear: 2023, count: 4 }),
      stat({ reportId: "r2025", reportYear: 2025, calendarYear: 2023, count: 5 }),
      stat({ reportId: "r2023", reportYear: 2023, calendarYear: 2023, count: 5 }),
    ]);
    expect(cell.count).toBe(5);
    expect(cell.reportYear).toBe(2025);
    expect(cell.revisions).toEqual([{ reportYear: 2024, count: 4 }]);
  });

  it("does not flag a revision when earlier reports agree", () => {
    const [cell] = resolveStatistics([
      stat({ reportYear: 2024, count: 3 }),
      stat({ reportYear: 2025, count: 3 }),
    ]);
    expect(cell.revisions).toEqual([]);
  });

  it("keeps null (not reported) distinct from 0, including across revisions", () => {
    const cells = resolveStatistics([
      stat({ offense: "stalking", count: null }),
      stat({ offense: "fondling", count: 0 }),
    ]);
    expect(cells.find((c) => c.offense === "stalking")!.count).toBeNull();
    expect(cells.find((c) => c.offense === "fondling")!.count).toBe(0);

    const [revised] = resolveStatistics([stat({ reportYear: 2024, count: null }), stat({ reportYear: 2025, count: 0 })]);
    expect(revised.count).toBe(0);
    expect(revised.revisions).toEqual([{ reportYear: 2024, count: null }]);
  });

  it("never sums geographies: overlapping categories remain separate cells", () => {
    const cells = resolveStatistics([
      stat({ geography: "on_campus", count: 5 }),
      stat({ geography: "on_campus_residential", count: 3 }),
      stat({ geography: "public_property", count: 1 }),
    ]);
    expect(cells).toHaveLength(3);
    expect(cells.map((c) => [c.geography, c.count])).toEqual([
      ["on_campus", 5],
      ["on_campus_residential", 3],
      ["public_property", 1],
    ]);
  });

  it("keeps years and offenses separate and sorts by year, then offense, then geography", () => {
    const cells = resolveStatistics([
      stat({ calendarYear: 2024, offense: "stalking" }),
      stat({ calendarYear: 2023, offense: "rape", geography: "noncampus" }),
      stat({ calendarYear: 2023, offense: "rape", geography: "on_campus" }),
      stat({ calendarYear: 2024, offense: "rape" }),
    ]);
    expect(cells.map((c) => `${c.calendarYear} ${c.offense} ${c.geography}`)).toEqual([
      "2023 rape on_campus",
      "2023 rape noncampus",
      "2024 rape on_campus",
      "2024 stalking on_campus",
    ]);
  });

  it("retains footnotes from every report that published the cell, without duplicates", () => {
    const [cell] = resolveStatistics([
      stat({ reportYear: 2024, footnoteIds: ["delayed-report", "shared"] }),
      stat({ reportYear: 2025, footnoteIds: ["shared"] }),
    ]);
    expect(cell.footnoteIds.sort()).toEqual(["delayed-report", "shared"]);
  });

  it("does not attach one cell's footnotes to another cell", () => {
    const cells = resolveStatistics([
      stat({ offense: "rape", footnoteIds: ["f1"] }),
      stat({ offense: "fondling", footnoteIds: [] }),
    ]);
    expect(cells.find((c) => c.offense === "fondling")!.footnoteIds).toEqual([]);
  });

  it("lists reporting years", () => {
    expect(reportingYears(resolveStatistics([stat({ calendarYear: 2024 }), stat({ calendarYear: 2022 })]))).toEqual([2022, 2024]);
  });
});
