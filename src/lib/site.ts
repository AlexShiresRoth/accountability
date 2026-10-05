export const site = {
  name: "Campus Accountability",
  description:
    "Sourced, verified information on how U.S. universities report, prevent, and respond to violence against women.",
  nav: [
    { href: "/#institutions", label: "Universities" },
    { href: "/learn", label: "Prevention" },
    { href: "/methodology", label: "Methodology" },
    { href: "/sources", label: "Sources" },
    { href: "/roadmap", label: "Roadmap" },
  ],
  /** Institutions being covered. Shown as "in preparation" until their profile is verified. */
  initialInstitutions: [
    { slug: "cornell-university", name: "Cornell University" },
    { slug: "harvard-university", name: "Harvard University" },
    { slug: "columbia-university", name: "Columbia University" },
    { slug: "university-of-utah", name: "University of Utah" },
    { slug: "university-of-colorado-boulder", name: "University of Colorado Boulder" },
    { slug: "ohio-state-university", name: "The Ohio State University" },
    { slug: "penn-state-university", name: "Penn State University" },
    { slug: "ucla", name: "University of California, Los Angeles" },
  ],
} as const;
