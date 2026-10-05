import Link from "next/link";

// Content-status notices. Demo data and unreviewed placeholder content must always be labeled.

export function DemoNotice() {
  return (
    <p role="note" className="border border-demo-rule bg-demo px-4 py-2 text-sm font-semibold text-demo-ink">
      DEMO DATA — NOT FOR PUBLICATION. Values on this page are development fixtures, not real statistics or events.
    </p>
  );
}

/** Home page: the project is young, and profiles take time to research and verify. */
export function WorkInProgressNote({ inPreparation }: { inPreparation: string[] }) {
  return (
    <p role="note" className="max-w-[70ch] border-l-2 border-accent pl-4 text-[0.95rem] text-ink-muted">
      <strong className="text-ink">A work in progress.</strong> Each university profile is researched from primary
      documents and checked by a person before it is published, which takes time.
      {inPreparation.length > 0 && ` ${preparationText(inPreparation)}`}{" "}
      <Link href="/roadmap">See what’s planned</Link>
    </p>
  );
}

const listFormat = new Intl.ListFormat("en", { type: "conjunction" });

/** Names a few universities; past three, a count reads better than a list. */
function preparationText(names: string[]): string {
  if (names.length > 3) return `${names.length} more universities are in preparation.`;
  return `${listFormat.format(names)} ${names.length === 1 ? "is" : "are"} in preparation.`;
}

export function PlaceholderNotice({ children }: { children?: React.ReactNode }) {
  return (
    <p role="note" className="border border-rule-strong bg-surface px-4 py-2 text-sm text-ink-muted">
      <strong className="text-ink">Placeholder content.</strong>{" "}
      {children ?? "This material has not completed editorial review."}
    </p>
  );
}
