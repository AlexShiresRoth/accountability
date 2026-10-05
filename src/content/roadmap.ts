// Public roadmap, shown at /roadmap. Editorial content, versioned in git like the lessons.
// Describe plans plainly and never promise dates. Move an item to "done" (and update `updated`) when it ships.

export type RoadmapStatus = "in_progress" | "planned" | "done";

export type RoadmapItem = {
  id: string;
  title: string;
  summary: string;
  status: RoadmapStatus;
  /** Month the item last changed, "YYYY-MM". */
  updated: string;
  link?: { href: string; label: string };
};

export const roadmap: RoadmapItem[] = [
  {
    id: "harvard-columbia",
    title: "Harvard University and Columbia University profiles",
    summary:
      "Statistics from each university's Annual Security Reports, along with its policies and reporting and support resources, have been transcribed. Every figure is being checked against the original report before the profiles are published.",
    status: "in_progress",
    updated: "2026-10",
  },
  {
    id: "large-public-universities",
    title: "Five more university profiles",
    summary:
      "The University of Utah, the University of Colorado Boulder, The Ohio State University, Penn State and UCLA: statistics from each university's Annual Security Reports, with its policies and reporting and support resources, each checked against the original before publication.",
    status: "in_progress",
    updated: "2026-10",
    link: { href: "/methodology#coverage", label: "How universities are chosen" },
  },
  {
    id: "lessons-review",
    title: "Editorial review of the prevention lessons",
    summary:
      "The scenario-based lessons on consent, bystander intervention and peer culture are drafts. Each will be marked as reviewed once editorial review is complete.",
    status: "in_progress",
    updated: "2026-10",
    link: { href: "/learn", label: "Prevention lessons" },
  },
  {
    id: "more-universities",
    title: "More universities",
    summary:
      "More of the universities reporting the largest numbers of incidents in federal data, then the remaining Ivy League universities and institutions nationwide. Each profile is researched from primary documents and verified by a person before it is published, so new universities will appear gradually.",
    status: "planned",
    updated: "2026-10",
  },
  {
    id: "student-experiences",
    title: "Anonymous student experiences",
    summary:
      "A place for students to describe, anonymously, what reporting and seeking support were like at their university: how easy it was to find help, how they were treated, and what they wish they had known. Accounts will be moderated before publication, must not name or identify anyone, and will be kept separate from the verified data.",
    status: "planned",
    updated: "2026-10",
  },
  {
    id: "other-campuses",
    title: "Statistics for additional campuses",
    summary:
      "Several universities publish separate statistics for medical, satellite and overseas campuses, such as Harvard's Longwood campus and Columbia's Irving Medical Center. Profiles currently cover each university's main campus; we are working out how best to present the others.",
    status: "planned",
    updated: "2026-10",
  },
  {
    id: "federal-data",
    title: "Federal campus safety data",
    summary:
      "Adding the U.S. Department of Education's Campus Safety and Security data, which universities submit each year, to show longer trends alongside each university's own reports.",
    status: "planned",
    updated: "2026-10",
  },
  {
    id: "cornell-profile",
    title: "Cornell University profile",
    summary:
      "Reported incidents from Cornell's 2025 and 2026 Annual Security Reports, its institutional response, and reporting and support resources, each linked to its source.",
    status: "done",
    updated: "2026-10",
    link: { href: "/college/cornell-university", label: "Cornell University" },
  },
  {
    id: "first-case",
    title: "First case record",
    summary:
      "A sourced timeline of a civil suit and criminal review at Cornell, with every entry attributed and the legal status of each step stated plainly.",
    status: "done",
    updated: "2026-10",
    link: { href: "/case/cornell-2024-chi-phi", label: "Read the case record" },
  },
];

export const roadmapSections: { status: RoadmapStatus; title: string; empty: string }[] = [
  { status: "in_progress", title: "In progress", empty: "Nothing is in progress right now." },
  { status: "planned", title: "Planned", empty: "Nothing else is planned yet." },
  { status: "done", title: "Recently completed", empty: "Nothing has been completed yet." },
];
