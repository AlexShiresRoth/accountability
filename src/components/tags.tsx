export function UnderReviewTag() {
  return (
    <span
      className="inline-block border border-caution-rule bg-caution px-1.5 py-px align-middle text-xs font-medium text-caution-ink"
      title="A newer source may change this information. It is being re-verified."
    >
      Under review
    </span>
  );
}

/** Admin preview only: the record isn't published yet. */
export function UnverifiedTag() {
  return (
    <span
      className="inline-block border border-dashed border-demo-rule bg-demo px-1.5 py-px align-middle text-xs font-medium text-demo-ink"
      title="Preview: not yet verified, so not shown publicly."
    >
      Not yet verified
    </span>
  );
}

/** Status tags for a public record. `unverified` is only ever set in admin preview. */
export function StatusTags({ item }: { item: { underReview?: boolean; unverified?: boolean } }) {
  if (item.unverified) return <UnverifiedTag />;
  if (item.underReview) return <UnderReviewTag />;
  return null;
}

export function SectionHeading({ id, title, children }: { id: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 max-w-[62ch]">
      <h2 id={id} className="scroll-mt-16 text-2xl sm:text-3xl">
        {title}
      </h2>
      {children && <div className="mt-3 text-ink-muted">{children}</div>}
    </div>
  );
}
