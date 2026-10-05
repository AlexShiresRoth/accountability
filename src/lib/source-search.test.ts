import { describe, expect, it } from "vitest";
import { normalize, searchSources, type SourceOption } from "./source-search";

const src = (id: string, o: Partial<SourceOption>): SourceOption => ({
  id,
  title: "Untitled",
  publisher: "Publisher",
  type: "university",
  url: null,
  publicationDate: null,
  status: "pending_review",
  createdAt: "2026-10-01T00:00:00.000Z",
  ...o,
});

const sources = [
  src("utah26", { title: "2026 Annual Security Report", publisher: "University of Utah Department of Public Safety", url: "https://publicsafety.utah.edu/report.pdf", createdAt: "2026-10-05T12:00:00.000Z" }),
  src("utah25", { title: "2025 Annual Security Report", publisher: "University of Utah Department of Public Safety", createdAt: "2026-10-05T11:00:00.000Z" }),
  src("osu", { title: "2026 Annual Security Report (Columbus)", publisher: "The Ohio State University", url: "https://dps.osu.edu/asr.pdf", createdAt: "2026-10-05T10:00:00.000Z" }),
  src("sun", { title: "Chi Phi lawsuit filed", publisher: "The Cornell Daily Sun", type: "reputable_journalism", publicationDate: "2026-09-17", createdAt: "2026-09-30T00:00:00.000Z" }),
  src("policy", { title: "Política de Título IX", publisher: "Universidad Ejemplo", createdAt: "2026-09-01T00:00:00.000Z" }),
];
const ids = (q: string) => searchSources(sources, q).results.map((s) => s.id);

describe("source search", () => {
  it("lists the newest sources when there is no query", () => {
    expect(ids("")).toEqual(["utah26", "utah25", "osu", "sun", "policy"]);
    expect(searchSources(sources, "", 2)).toMatchObject({ total: 5, results: [{ id: "utah26" }, { id: "utah25" }] });
  });

  it("requires every word, in any field and any order", () => {
    expect(ids("utah 2026")).toEqual(["utah26"]);
    expect(ids("2026 security")).toEqual(["utah26", "osu"]);
    expect(ids("utah lawsuit")).toEqual([]);
  });

  it("matches publisher, source type, publication year and web address", () => {
    expect(ids("daily sun")).toEqual(["sun"]);
    expect(ids("journalism")).toEqual(["sun"]);
    expect(ids("2026-09")).toEqual(["sun"]);
    expect(ids("osu.edu")).toEqual(["osu"]);
  });

  it("ranks title matches first", () => {
    // "columbus" is only in the Ohio State title; "ohio" only in its publisher. Both match osu alone.
    expect(ids("security report")[0]).toBe("utah26");
    expect(ids("columbus")).toEqual(["osu"]);
  });

  it("ignores case, accents and punctuation", () => {
    expect(normalize("Título—IX, “Policy”")).toBe("titulo ix policy");
    expect(ids("TITULO ix")).toEqual(["policy"]);
    expect(ids("chi-phi")).toEqual(["sun"]);
  });

  it("reports the total when results are capped", () => {
    expect(searchSources(sources, "report", 1)).toMatchObject({ total: 3, results: [{ id: "utah26" }] });
  });
});
