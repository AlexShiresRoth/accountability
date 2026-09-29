// Content-status notices. Demo data and unreviewed placeholder content must always be labeled.

export function DemoNotice() {
  return (
    <p role="note" className="border border-demo-rule bg-demo px-4 py-2 text-sm font-semibold text-demo-ink">
      DEMO DATA — NOT FOR PUBLICATION. Values on this page are development fixtures, not real statistics or events.
    </p>
  );
}

export function PlaceholderNotice({ children }: { children?: React.ReactNode }) {
  return (
    <p role="note" className="border border-rule-strong bg-surface px-4 py-2 text-sm text-ink-muted">
      <strong className="text-ink">Placeholder content.</strong>{" "}
      {children ?? "This material has not completed editorial review."}
    </p>
  );
}
