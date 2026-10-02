import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseTimeline, hasDocumentedOutcome } from "@/components/case/case-timeline";
import { LegalStatusLegend } from "@/components/case/legal-status-badge";
import { Cite } from "@/components/cite";
import { Container } from "@/components/container";
import { CorrectionsBanner } from "@/components/corrections";
import { CoverageList } from "@/components/coverage-list";
import { DemoNotice } from "@/components/notice";
import { SectionHeading, StatusTags } from "@/components/tags";
import { citationKey, getCase } from "@/lib/public";

export const revalidate = 3600;
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps<"/case/[slug]">): Promise<Metadata> {
  const detail = await getCase((await params).slug);
  if (!detail) return {};
  return {
    title: detail.case.title,
    description: detail.case.summary,
    alternates: { canonical: `/case/${detail.case.slug}` },
    robots: detail.case.isDemo ? { index: false } : undefined,
  };
}

const locationLabels = {
  on_campus: "On campus",
  off_campus: "Off campus",
  online: "Online",
  unspecified: null,
} as const;

export default async function CasePage({ params }: PageProps<"/case/[slug]">) {
  const detail = await getCase((await params).slug);
  if (!detail) notFound();
  const { case: c, colleges, events, coverage, corrections, citations } = detail;
  const location = locationLabels[c.locationContext];

  return (
    <>
      <div className="border-b border-rule">
        <Container className="py-10 sm:py-14">
          {c.isDemo && (
            <div className="mb-6">
              <DemoNotice />
            </div>
          )}
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-ink-muted">Documented case</p>
          <h1 className="max-w-3xl text-3xl sm:text-[2.6rem]">
            {c.title} <StatusTags item={c} />
          </h1>
          <p className="mt-5 max-w-[62ch] text-lg text-ink-muted">
            {c.summary}
            <Cite id={`case-${c.id}`} citations={citations[citationKey("case", c.id)]} />
          </p>
          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-rule pt-6">
            <div>
              <dt className="text-sm text-ink-muted">{colleges.length === 1 ? "Institution" : "Institutions"}</dt>
              <dd className="mt-0.5 font-medium">
                {colleges.length
                  ? colleges.map((col, i) => (
                      <span key={col.id}>
                        {i > 0 && ", "}
                        <Link href={`/college/${col.slug}`}>{col.name}</Link>
                      </span>
                    ))
                  : "—"}
              </dd>
            </div>
            {location && (
              <div>
                <dt className="text-sm text-ink-muted">Setting</dt>
                <dd className="mt-0.5 font-medium">{location}</dd>
              </div>
            )}
            <div>
              <dt className="text-sm text-ink-muted">Documented events</dt>
              <dd className="mt-0.5 font-medium">{events.length}</dd>
            </div>
          </dl>
        </Container>
      </div>

      <Container className="space-y-16 py-12">
        <CorrectionsBanner corrections={corrections} citations={citations} />

        <aside aria-label="How to read this page" className="max-w-[68ch] border-l-4 border-rule-strong bg-surface px-5 py-4">
          <p className="font-semibold">How to read this timeline</p>
          <p className="mt-1 text-[0.95rem] text-ink-muted">
            Each entry states what a source records and who said it. Allegations are attributed and are not findings.
            An arrest is not a charge; a charge is not a conviction. This page documents institutional and legal
            processes, not individuals, and does not identify victims or survivors.
          </p>
        </aside>

        <section aria-labelledby="timeline">
          <SectionHeading id="timeline" title="Timeline" />
          <CaseTimeline events={events} citations={citations} />
          {events.length > 0 && !hasDocumentedOutcome(events) && (
            <p className="mt-10 max-w-[62ch] border-t border-rule pt-4 text-ink-muted italic">
              No outcome was located in the public sources reviewed. This does not mean the matter was not resolved.
            </p>
          )}
        </section>

        <section aria-labelledby="status-key">
          <SectionHeading id="status-key" title="Status labels">
            <p>These labels are distinct legal and procedural stages and are never used interchangeably.</p>
          </SectionHeading>
          <LegalStatusLegend />
        </section>

        {coverage.length > 0 && (
          <section aria-labelledby="coverage">
            <SectionHeading id="coverage" title="Coverage">
              <p>Journalism about this case, selected by researchers. Summaries are ours, not the publisher&rsquo;s headline.</p>
            </SectionHeading>
            <CoverageList coverage={coverage} showCaseLinks={false} />
          </section>
        )}
      </Container>
    </>
  );
}
