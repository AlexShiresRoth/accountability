import type { PublicFootnote } from "@/lib/public/queries";

export type FootnoteGroup = {
  number: number;
  anchor: string;
  ids: string[];
  originalText: string;
  summary: string | null;
  published: { reportYear: number; page: string | null }[];
  markers: string[];
  linked: boolean;
  underReview: boolean;
};

/**
 * Reports repeat footnotes for years they share. Notes with identical wording are shown once,
 * listing every report that published them. Nothing is discarded: every footnote id maps to a note.
 */
export function groupFootnotes(footnotes: PublicFootnote[]): FootnoteGroup[] {
  const groups = new Map<string, FootnoteGroup>();
  for (const f of footnotes) {
    const k = `${f.originalText}\u0000${f.summary ?? ""}`;
    let g = groups.get(k);
    if (!g) {
      g = { number: groups.size + 1, anchor: `note-${f.id}`, ids: [], originalText: f.originalText, summary: f.summary, published: [], markers: [], linked: false, underReview: false };
      groups.set(k, g);
    }
    g.ids.push(f.id);
    g.published.push({ reportYear: f.reportYear, page: f.page });
    if (f.marker && !g.markers.includes(f.marker)) g.markers.push(f.marker);
    g.linked ||= f.statisticIds.length > 0;
    g.underReview ||= f.underReview;
  }
  return [...groups.values()];
}
