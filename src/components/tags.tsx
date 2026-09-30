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
