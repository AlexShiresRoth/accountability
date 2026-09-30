import type { Metadata } from "next";
import { CollegeList } from "@/components/college-list";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { searchColleges } from "@/lib/public";

export const metadata: Metadata = { title: "Search universities", robots: { index: false } };

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const raw = (await searchParams).q;
  const q = (Array.isArray(raw) ? raw[0] : raw)?.trim().slice(0, 100) ?? "";
  const results = await searchColleges(q);

  return (
    <>
      <PageHeader title="Search universities">
        <form action="/search" method="get" role="search" className="mt-8 flex max-w-xl">
          <label htmlFor="q" className="sr-only">
            University name
          </label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={q}
            autoComplete="off"
            className="min-w-0 flex-1 border border-r-0 border-rule-strong bg-surface px-4 py-3 text-ink focus:outline-none focus-visible:border-accent"
          />
          <button type="submit" className="bg-ink px-5 py-3 font-medium text-paper hover:opacity-90">
            Search
          </button>
        </form>
      </PageHeader>
      <Container className="py-10">
        <p aria-live="polite" className="mb-6 text-ink-muted">
          {q ? `${results.length} ${results.length === 1 ? "result" : "results"} for “${q}”` : `${results.length} published profiles`}
        </p>
        {results.length > 0 ? (
          <CollegeList colleges={results} />
        ) : (
          <p className="max-w-[62ch]">
            No published profile matches that search. Coverage is expanding as institutions are researched and verified.
          </p>
        )}
      </Container>
    </>
  );
}
