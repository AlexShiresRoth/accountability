import { describe, expect, it } from "vitest";
import type { PublicFootnote } from "@/lib/public/queries";
import { groupFootnotes } from "./footnotes";

const note = (o: Partial<PublicFootnote>): PublicFootnote => ({
  id: "f",
  reportId: "r",
  reportYear: 2025,
  marker: "*",
  originalText: "Text.",
  summary: null,
  page: null,
  statisticIds: ["s"],
  underReview: false,
  unverified: false,
  isDemo: false,
  ...o,
});

describe("groupFootnotes", () => {
  it("merges identical notes repeated across reports without discarding any", () => {
    const groups = groupFootnotes([
      note({ id: "a", reportYear: 2025, page: "p. 40" }),
      note({ id: "b", reportYear: 2024, page: "p. 38" }),
    ]);
    expect(groups).toHaveLength(1);
    expect(groups[0].ids).toEqual(["a", "b"]);
    expect(groups[0].published).toEqual([
      { reportYear: 2025, page: "p. 40" },
      { reportYear: 2024, page: "p. 38" },
    ]);
  });

  it("keeps notes with different wording separate, numbered in order", () => {
    const groups = groupFootnotes([note({ id: "a", originalText: "One." }), note({ id: "b", originalText: "Two." })]);
    expect(groups.map((g) => [g.number, g.ids])).toEqual([
      [1, ["a"]],
      [2, ["b"]],
    ]);
  });

  it("does not merge notes whose summaries differ", () => {
    expect(groupFootnotes([note({ id: "a", summary: "x" }), note({ id: "b", summary: "y" })])).toHaveLength(2);
  });

  it("distinguishes report-wide notes and carries under-review status", () => {
    const [g] = groupFootnotes([note({ id: "a", statisticIds: [] }), note({ id: "b", statisticIds: [], underReview: true })]);
    expect(g.linked).toBe(false);
    expect(g.underReview).toBe(true);
  });
});
