export const site = {
  name: "Campus Accountability",
  description:
    "Sourced, verified information on how U.S. universities report, prevent, and respond to violence against women.",
  nav: [
    { href: "/#institutions", label: "Universities" },
    { href: "/learn", label: "Prevention" },
    { href: "/methodology", label: "Methodology" },
    { href: "/sources", label: "Sources" },
  ],
  /** Institutions in the initial release. Shown as "in preparation" until their profile is verified. */
  initialInstitutions: [
    { slug: "cornell-university", name: "Cornell University" },
    { slug: "harvard-university", name: "Harvard University" },
    { slug: "columbia-university", name: "Columbia University" },
  ],
} as const;
