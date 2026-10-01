import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { ResolvedStatistic } from "@/lib/statistics";
import { StatisticsExplorer } from "./statistics-explorer";

const text = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const stat = (o: Partial<ResolvedStatistic>): ResolvedStatistic => ({
  calendarYear: 2024,
  offense: "rape",
  geography: "on_campus",
  count: 4,
  unfoundedCount: null,
  statisticId: crypto.randomUUID(),
  reportYear: 2025,
  revisions: [],
  footnoteIds: [],
  underReview: false,
  ...o,
});

describe("StatisticsExplorer unfounded counts", () => {
  it("shows unfounded reports beside the figure without changing the count", () => {
    const html = text(renderToStaticMarkup(<StatisticsExplorer statistics={[stat({ count: 4, unfoundedCount: 2 })]} footnotes={[]} />));
    expect(html).toContain("4 +2 unfounded");
    expect(html).not.toMatch(/\b6\b/);
    expect(html).toContain("not included in the count");
  });

  it("omits the unfounded key when no figure has unfounded reports", () => {
    const html = text(renderToStaticMarkup(<StatisticsExplorer statistics={[stat({ unfoundedCount: 0 }), stat({ offense: "stalking" })]} footnotes={[]} />));
    expect(html).not.toContain("unfounded");
  });
});
