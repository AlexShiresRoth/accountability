import { Cite } from "@/components/cite";
import { StatusTags } from "@/components/tags";
import { formatDate } from "@/lib/dates";
import { citationKey } from "@/lib/citations";
import type { CitationIndex, PublicCorrection } from "@/lib/public";

/** Corrections are shown at the top of the page, as prominently as the original information. */
export function CorrectionsBanner({
  corrections,
  citations,
}: {
  corrections: PublicCorrection[];
  citations: CitationIndex;
}) {
  if (!corrections.length) return null;
  return (
    <section aria-labelledby="corrections" className="border-l-4 border-ink bg-surface px-5 py-4">
      <h2 id="corrections" className="font-sans text-base font-semibold">
        {corrections.length === 1 ? "Correction" : "Corrections"}
      </h2>
      <ul className="mt-2 space-y-2">
        {corrections.map((c) => (
          <li key={c.id}>
            <span className="font-medium">{formatDate(c.correctionDate)}:</span> {c.description}{" "}
            <StatusTags item={c} />
            <Cite id={`correction-${c.id}`} citations={citations[citationKey("correction", c.id)]} />
          </li>
        ))}
      </ul>
    </section>
  );
}
