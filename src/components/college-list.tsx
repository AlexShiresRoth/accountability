import Link from "next/link";
import type { PublicCollegeSummary } from "@/lib/public";
import { UnderReviewTag } from "./tags";

export function CollegeList({ colleges, inPreparation = [] }: { colleges: PublicCollegeSummary[]; inPreparation?: string[] }) {
  return (
    <ul className="divide-y divide-rule border-y border-rule">
      {colleges.map((c) => (
        <li key={c.id}>
          <Link
            href={`/college/${c.slug}`}
            className="flex flex-wrap items-baseline justify-between gap-2 py-4 text-ink no-underline hover:bg-surface"
          >
            <span className="font-serif text-lg underline decoration-rule-strong underline-offset-4">
              {c.name} {c.isDemo && <span className="font-sans text-xs text-demo-ink">(demo fixture)</span>}{" "}
              {c.underReview && <UnderReviewTag />}
            </span>
            <span className="text-sm text-ink-muted">{[c.city, c.state].filter(Boolean).join(", ")}</span>
          </Link>
        </li>
      ))}
      {inPreparation.map((name) => (
        <li key={name} className="flex flex-wrap items-baseline justify-between gap-2 py-4">
          <span className="font-serif text-lg">{name}</span>
          <span className="text-sm text-ink-muted">Profile in preparation</span>
        </li>
      ))}
    </ul>
  );
}
