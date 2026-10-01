import type { CoverageTopic } from "@/lib/enums";

// Keyword relevance for discovery. Deliberately conservative: a false positive costs a researcher a click
// in the inbox; nothing here decides what is published.

const RELEVANT = [
  /\btitle ix\b/i,
  /\bsexual (assault|misconduct|harassment|violence|abuse|exploitation)\b/i,
  /\brap(e|es|ed|ist)\b/i,
  /\bstalk(ing|ed|er)\b/i,
  /\b(dating|domestic|intimate[- ]partner|relationship) violence\b/i,
  /\bclery\b/i,
  /\bconsent\b/i,
  /\bnon-?consensual\b/i,
  /\bharass(ment|ed)\b/i,
  /\bgender-based (violence|misconduct)\b/i,
  /\bbystander intervention\b/i,
];

const TOPICS: [RegExp, CoverageTopic][] = [
  [/\b(lawsuit|suit|sued|sues|suing|complaint filed|class action|v\.)\b/i, "lawsuit"],
  [/\b(office for civil rights|OCR|department of education|federal investigation|investigat(ion|ing|ed))\b/i, "investigation"],
  [/\btitle ix\b/i, "title_ix_process"],
  [/\b(polic(y|ies)|rule change|revis(e|ed|es)|new procedures?)\b/i, "policy_change"],
  [/\b(prevention|training|bystander|workshop|education program)\b/i, "prevention"],
];

export function isRelevant(text: string): boolean {
  return RELEVANT.some((re) => re.test(text));
}

export function suggestTopic(text: string): CoverageTopic {
  return TOPICS.find(([re]) => re.test(text))?.[1] ?? "campus_safety";
}
