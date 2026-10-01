import Link from "next/link";

/** Page links that keep the other query parameters (e.g. ?status=). Renders nothing for a single page. */
export function Pagination({
  page,
  pageCount,
  total,
  pageSize,
  basePath,
  params = {},
  label = "items",
}: {
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  basePath: string;
  params?: Record<string, string>;
  label?: string;
}) {
  if (total === 0) return null;
  const first = (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);
  const href = (p: number) => `${basePath}?${new URLSearchParams({ ...params, ...(p > 1 ? { page: String(p) } : {}) })}`;
  const linkClass = "border border-rule-strong px-3 py-1.5 text-ink no-underline hover:border-ink";
  const disabledClass = "border border-rule px-3 py-1.5 text-ink-muted opacity-50";

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-between gap-3 text-sm">
      <p className="text-ink-muted">
        Showing {first}–{last} of {total} {label}
      </p>
      {pageCount > 1 && (
        <div className="flex items-center gap-2">
          {page > 1 ? (
            <Link href={href(page - 1)} rel="prev" className={linkClass}>
              ← Previous
            </Link>
          ) : (
            <span aria-disabled className={disabledClass}>
              ← Previous
            </span>
          )}
          <span className="px-2 text-ink-muted">
            Page {page} of {pageCount}
          </span>
          {page < pageCount ? (
            <Link href={href(page + 1)} rel="next" className={linkClass}>
              Next →
            </Link>
          ) : (
            <span aria-disabled className={disabledClass}>
              Next →
            </span>
          )}
        </div>
      )}
    </nav>
  );
}
