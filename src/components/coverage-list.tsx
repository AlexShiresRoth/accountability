import Link from "next/link";
import { UnderReviewTag } from "@/components/tags";
import { formatDate } from "@/lib/dates";
import { coverageTopicLabels } from "@/lib/labels";
import type { PublicCoverage } from "@/lib/public";

/** Researcher-selected journalism. Shows our neutral summary, never the publisher's headline. */
export function CoverageList({ coverage, showCaseLinks = true }: { coverage: PublicCoverage[]; showCaseLinks?: boolean }) {
  return (
    <ul className="divide-y divide-rule border-y border-rule">
      {coverage.map((c) => (
        <li key={c.id} className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
          <p className="text-sm text-ink-muted">
            {c.source.publicationDate ? formatDate(c.source.publicationDate) : "Undated"}
            <span className="block">{coverageTopicLabels[c.topic]}</span>
          </p>
          <div>
            <p>
              {c.summary} {c.underReview && <UnderReviewTag />}
            </p>
            <p className="mt-1 flex flex-wrap gap-x-4 text-[0.95rem]">
              {c.source.url && (
                <a href={c.source.url} target="_blank" rel="noopener noreferrer">
                  Read at {c.source.publisher}
                </a>
              )}
              {c.source.archivedUrl && (
                <a href={c.source.archivedUrl} target="_blank" rel="noopener noreferrer">
                  Archived copy
                </a>
              )}
              {showCaseLinks && c.caseSlug && <Link href={`/case/${c.caseSlug}`}>Related case timeline</Link>}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
