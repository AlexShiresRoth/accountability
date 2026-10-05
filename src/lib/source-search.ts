// Matching for the admin source picker. Plain functions, so the client component and tests share them.

import type { VerificationStatus } from "./enums";
import { sourceTypes, type SourceType } from "./source-types";

export type SourceOption = {
  id: string;
  title: string;
  publisher: string;
  type: SourceType;
  url: string | null;
  publicationDate: string | null;
  status: VerificationStatus;
  createdAt: string;
};

/** Lowercase, accents removed, punctuation as spaces: "Título—Report" → "titulo report". */
export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function haystack(s: SourceOption): string {
  return normalize([s.title, s.publisher, sourceTypes[s.type]?.label ?? s.type, s.publicationDate ?? "", s.url ?? ""].join(" "));
}

/**
 * Sources matching every word of the query (in any field), best first: more words found in the title,
 * then newest. An empty query returns the most recently added sources.
 */
export function searchSources(sources: SourceOption[], query: string, limit = 30): { results: SourceOption[]; total: number } {
  const words = normalize(query).split(" ").filter(Boolean);
  const newestFirst = (a: SourceOption, b: SourceOption) => b.createdAt.localeCompare(a.createdAt);
  if (!words.length) return { results: [...sources].sort(newestFirst).slice(0, limit), total: sources.length };

  const matches = sources
    .map((s) => ({ s, text: haystack(s), title: normalize(s.title) }))
    .filter(({ text }) => words.every((w) => text.includes(w)))
    .map(({ s, title }) => ({ s, inTitle: words.filter((w) => title.includes(w)).length }))
    .sort((a, b) => b.inTitle - a.inTitle || newestFirst(a.s, b.s))
    .map(({ s }) => s);
  return { results: matches.slice(0, limit), total: matches.length };
}

export type SourceScope = {
  /** Shown on the toggle, e.g. "Cornell University". */
  label: string;
  /** Sources this college already uses. */
  relatedIds: string[];
  /** Sources no college uses yet, e.g. one just created. Always offered alongside the college's own. */
  unusedIds: string[];
};

/** The sources to offer first for the given colleges: theirs, plus any not yet used by any college. */
export function scopeForColleges(
  links: { sourceId: string; collegeId: string }[],
  collegeIds: string[],
  allSourceIds: string[],
): Pick<SourceScope, "relatedIds" | "unusedIds"> {
  const wanted = new Set(collegeIds);
  const related = new Set(links.filter((l) => wanted.has(l.collegeId)).map((l) => l.sourceId));
  const used = new Set(links.map((l) => l.sourceId));
  return { relatedIds: [...related], unusedIds: allSourceIds.filter((id) => !used.has(id)) };
}
