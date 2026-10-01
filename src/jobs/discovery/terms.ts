// What discovery looks for: crimes and misconduct against women, not only sexual assault.
// One list drives the feed relevance filter, GDELT, and Google News so they can't drift apart.
// Search terms are split into groups because long OR-queries can exceed search engines' query limits.

export const searchTermGroups: string[][] = [
  // Sexual violence and the institutional processes around it
  ['"sexual assault"', "rape", '"sexual misconduct"', '"sexual violence"', '"Title IX"', "groping", "drugged"],
  // Other crimes against women
  [
    '"domestic violence"',
    '"dating violence"',
    '"intimate partner"',
    "stalking",
    // Not bare "harassment": it mostly matches political and antisemitism-related coverage.
    '"sexual harassment"',
    '"violence against women"',
    '"gender-based violence"',
    "voyeurism",
    '"revenge porn"',
    "sextortion",
    '"sex trafficking"',
    "femicide",
  ],
];

/** Headline/summary filter for feeds (which return everything an outlet publishes). */
export const relevancePatterns: RegExp[] = [
  /\btitle ix\b/i,
  /\bsexual(ly)? (assault|assaulted|misconduct|harassment|violence|abuse|exploitation|coercion)\b/i,
  /\brap(e|es|ed|ist)\b/i,
  /\bgrop(e|ed|ing)\b/i,
  /\bstalk(ing|ed|er)\b/i,
  /\b(sexual(ly)?|gender[- ]based|gender) harass(ment|ed|ing)\b/i,
  /\b(dating|domestic|intimate[- ]partner|relationship|gender-based) (violence|abuse)\b/i,
  /\bviolence against women\b/i,
  /\bcoercive control\b/i,
  /\bvoyeur(ism)?\b/i,
  /\b(revenge porn|sextortion|upskirt(ing)?)\b/i,
  /\b(non-?consensual|intimate) (images?|photos?|videos?)\b/i,
  /\bnon-?consensual\b/i,
  /\b(drugged|spiked drinks?|drink spiking)\b/i,
  /\b(sex|human) trafficking\b/i,
  /\bfemicide\b/i,
  /\bindecent exposure\b/i,
  /\bclery\b/i,
  /\bconsent\b/i,
  /\bbystander intervention\b/i,
  /\bgender-based misconduct\b/i,
];
