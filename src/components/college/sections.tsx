import Link from "next/link";
import { Cite } from "@/components/cite";
import { DataQualityNote, DataQualityNotes } from "@/components/data-quality-note";
import { SectionHeading, UnderReviewTag } from "@/components/tags";
import { formatDate } from "@/lib/dates";
import { confidentialityLevels, responseTopics } from "@/lib/enums";
import {
  actionTypeLabels,
  confidentialityLabels,
  geographyLabels,
  offenseLabels,
  policyTypeLabels,
  resourceCategoryLabels,
  responseTopicLabels,
} from "@/lib/labels";
import { citationKey } from "@/lib/citations";
import type { CollegeProfile, PublicCitation } from "@/lib/public";
import { groupFootnotes } from "@/lib/footnotes";
import { reportingYears } from "@/lib/statistics";
import { CoverageList } from "@/components/coverage-list";
import { StatisticsExplorer, type FootnoteRef } from "./statistics-explorer";

type P = { profile: CollegeProfile };

const cites = (p: CollegeProfile, kind: Parameters<typeof citationKey>[0], id: string) => p.citations[citationKey(kind, id)];

// ---------------------------------------------------------------------------

export function ProfileFacts({ profile: p }: P) {
  const years = reportingYears(p.statistics);
  const facts: [string, React.ReactNode][] = [
    ["Location", [p.college.city, p.college.state].filter(Boolean).join(", ") || "—"],
    [
      "Enrollment",
      p.college.enrollment ? (
        <>
          {p.college.enrollment.toLocaleString("en-US")}
          {p.college.enrollmentNote && <span className="block text-sm text-ink-muted">{p.college.enrollmentNote}</span>}
          <Cite id={`college-${p.college.id}`} citations={cites(p, "college", p.college.id)} />
        </>
      ) : (
        <span className="text-ink-muted">Not yet sourced</span>
      ),
    ],
    [
      "Statistics available",
      years.length ? `${years[0]}–${years[years.length - 1]} (calendar years)` : <span className="text-ink-muted">None yet</span>,
    ],
    [
      "Last reviewed",
      p.college.lastReviewedAt ? formatDate(p.college.lastReviewedAt) : <span className="text-ink-muted">—</span>,
    ],
  ];
  return (
    <dl className="mt-8 grid gap-x-8 gap-y-4 border-t border-rule pt-6 sm:grid-cols-2 lg:grid-cols-4">
      {facts.map(([label, value]) => (
        <div key={label}>
          <dt className="text-sm text-ink-muted">{label}</dt>
          <dd className="mt-0.5 font-medium">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------

export function StatisticsSection({ profile: p }: P) {
  const notes = groupFootnotes(p.footnotes);
  const refs: FootnoteRef[] = notes.flatMap((n) =>
    n.ids.map((id) => ({ id, number: n.number, text: n.summary ?? n.originalText, anchor: n.anchor })),
  );

  return (
    <section aria-labelledby="statistics">
      <SectionHeading id="statistics" title="Reported incidents">
        <p>
          Annual Security Report statistics required by the Clery Act. Each figure counts reports made in that calendar year
          to campus security authorities or local police.
        </p>
      </SectionHeading>

      <div className="mb-8">
        <DataQualityNotes kinds={["notPrevalence", "delayedReports", "reportingWillingness", "geographyOverlap"]} />
      </div>

      {p.statistics.length === 0 ? (
        <p className="text-ink-muted">No verified Annual Security Report statistics have been published for this institution yet.</p>
      ) : (
        <>
          <StatisticsExplorer statistics={p.statistics} footnotes={refs} />

          {notes.length > 0 && (
            <div className="mt-10">
              <h3 className="text-xl">Notes from the reports</h3>
              <p className="mt-1 max-w-[62ch] text-[0.95rem] text-ink-muted">
                Footnotes are reproduced exactly as published. Plain-language summaries are ours.
              </p>
              <ol className="mt-4 space-y-4">
                {notes.map((n) => (
                  <li key={n.anchor} id={n.anchor} className="scroll-mt-16 border-l-2 border-caution-rule pl-4 target:bg-caution">
                    <p className="text-sm font-medium">
                      Note {n.number} · {n.published.map((x) => `${x.reportYear} report${x.page ? `, ${x.page}` : ""}`).join("; ")}
                      {n.markers.length > 0 && (
                        <span className="text-ink-muted"> (marked {n.markers.map((m) => `“${m}”`).join(", ")})</span>
                      )}{" "}
                      {n.underReview && <UnderReviewTag />}
                    </p>
                    <blockquote className="mt-1">&ldquo;{n.originalText}&rdquo;</blockquote>
                    {n.summary && <p className="mt-1 text-ink-muted">In plain terms: {n.summary}</p>}
                    <p className="mt-1 text-sm text-ink-muted">
                      {appliesTo(p, n.ids, n.linked)}
                      <Cite id={n.anchor} citations={n.ids.flatMap((id) => cites(p, "statisticFootnote", id) ?? [])} />
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className="mt-10">
            <h3 className="text-xl">Figures taken from</h3>
            <ul className="mt-3 space-y-2">
              {p.reports.map((r) => {
                const reportCitation: PublicCitation = { id: `report-${r.id}`, pinpoint: null, excerpt: null, claim: null, source: r.source };
                return (
                  <li key={r.id}>
                    {r.title} ({r.reportYear}) {r.underReview && <UnderReviewTag />}
                    <Cite id={`report-${r.id}`} citations={[reportCitation, ...(cites(p, "cleryReport", r.id) ?? [])]} />
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 max-w-[62ch] text-sm text-ink-muted">
              Each report covers three calendar years, so a year can appear in more than one report. The most recent
              verified report&rsquo;s figure is shown; differences are marked &ldquo;rev.&rdquo;
            </p>
          </div>
        </>
      )}
    </section>
  );
}

/** Which displayed figures a note applies to, derived from the resolved cells that carry it. */
function appliesTo(p: CollegeProfile, footnoteIds: string[], linked: boolean) {
  if (!linked) return "Applies to the report as a whole.";
  const cells = p.statistics.filter((s) => s.footnoteIds.some((id) => footnoteIds.includes(id)));
  return `Applies to: ${cells
    .map((s) => `${offenseLabels[s.offense]}, ${geographyLabels[s.geography].toLowerCase()}, ${s.calendarYear}`)
    .join("; ")}`;
}

// ---------------------------------------------------------------------------

export function ResponseSection({ profile: p }: P) {
  return (
    <section aria-labelledby="response">
      <SectionHeading id="response" title="Institutional response">
        <p>What can be verified from public sources about how the university handles reports.</p>
      </SectionHeading>
      <div className="mb-6">
        <DataQualityNote kind="outcomesUnavailable" compact />
      </div>

      <dl className="divide-y divide-rule border-y border-rule">
        {responseTopics.map((topic) => {
          const items = p.responses.filter((r) => r.topic === topic);
          return (
            <div key={topic} className="grid gap-2 py-5 md:grid-cols-[16rem_1fr] md:gap-8">
              <dt className="font-serif text-lg font-semibold">{responseTopicLabels[topic]}</dt>
              <dd className="space-y-3">
                {items.length === 0 ? (
                  <p className="text-ink-muted">Not yet reviewed.</p>
                ) : (
                  items.map((r) => (
                    <p key={r.id} className={r.findingKind === "not_located" ? "text-ink-muted italic" : ""}>
                      {r.summary}
                      {r.underReview && (
                        <>
                          {" "}
                          <UnderReviewTag />
                        </>
                      )}
                      <Cite id={`response-${r.id}`} citations={cites(p, "institutionalResponse", r.id)} />
                    </p>
                  ))
                )}
              </dd>
            </div>
          );
        })}
      </dl>

      {p.policies.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl">Policies</h3>
          <ul className="mt-4 space-y-4">
            {p.policies.map((policy) => (
              <li key={policy.id}>
                <p className="font-medium">
                  {policy.title} {policy.underReview && <UnderReviewTag />}
                  <Cite id={`policy-${policy.id}`} citations={cites(p, "policy", policy.id)} />
                </p>
                <p className="text-sm text-ink-muted">
                  {policyTypeLabels[policy.policyType]}
                  {policy.effectiveDate && ` · Effective ${formatDate(policy.effectiveDate)}`}
                </p>
                {policy.summary && <p className="mt-1">{policy.summary}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------

export function ResourcesSection({ profile: p }: P) {
  const emergency = p.resources.filter((r) => r.category === "emergency");
  const others = p.resources.filter((r) => r.category !== "emergency");

  return (
    <section aria-labelledby="resources">
      <SectionHeading id="resources" title="Reporting and support">
        <p>
          Some resources are confidential; others are reporting channels that may start an institutional response.
          They are grouped separately so you can choose what fits.
        </p>
      </SectionHeading>

      <div className="mb-8 border-2 border-ink px-5 py-4">
        <p className="font-semibold">In immediate danger, call 911.</p>
        {emergency
          .filter((r) => r.phone !== "911")
          .map((r) => (
            <ResourceLine key={r.id} r={r} p={p} />
          ))}
      </div>

      {p.resources.length === 0 ? (
        <p className="text-ink-muted">Campus resources have not yet been verified for this institution.</p>
      ) : (
        <div className="space-y-10">
          {confidentialityLevels.map((level) => {
            const group = others.filter((r) => r.confidentiality === level);
            if (!group.length) return null;
            return (
              <div key={level}>
                <h3 className="text-xl">{confidentialityLabels[level].title}</h3>
                <p className="mt-1 max-w-[62ch] text-[0.95rem] text-ink-muted">{confidentialityLabels[level].description}</p>
                <ul className="mt-4 grid border-t border-l border-rule sm:grid-cols-2">
                  {group.map((r) => (
                    <li key={r.id} className="border-r border-b border-rule p-4">
                      <ResourceLine r={r} p={p} />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function ResourceLine({ r, p }: { r: CollegeProfile["resources"][number]; p: CollegeProfile }) {
  return (
    <div className="space-y-1">
      <p className="font-medium">
        {r.name} {r.underReview && <UnderReviewTag />}
        <Cite id={`resource-${r.id}`} citations={cites(p, "studentResource", r.id)} />
      </p>
      <p className="text-sm text-ink-muted">
        {resourceCategoryLabels[r.category]}
        {r.available247 && " · Available 24/7"}
        {r.hours && ` · ${r.hours}`}
      </p>
      {r.description && <p className="text-[0.95rem]">{r.description}</p>}
      <p className="flex flex-wrap gap-x-4 text-[0.95rem]">
        {r.phone && <a href={`tel:${r.phone.replace(/[^\d+]/g, "")}`}>{r.phone}</a>}
        {r.url && (
          <a href={r.url} target="_blank" rel="noopener noreferrer">
            Website
          </a>
        )}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------

export function TimelineSection({ profile: p }: P) {
  const actions = [...p.actions].reverse(); // newest first
  return (
    <section aria-labelledby="timeline">
      <SectionHeading id="timeline" title="Accountability timeline">
        <p>
          Institutional developments, favorable and unfavorable: investigations, lawsuits, settlements, policy changes,
          and reforms.
        </p>
      </SectionHeading>
      {actions.length === 0 ? (
        <p className="text-ink-muted">No verified timeline entries yet.</p>
      ) : (
        <ol className="relative space-y-8 border-l border-rule-strong pl-6">
          {actions.map((a) => (
            <li key={a.id} className="relative">
              <span aria-hidden className="absolute -left-[1.84rem] top-2 size-2.5 rounded-full bg-ink ring-4 ring-paper" />
              <p className="text-sm text-ink-muted">
                <time dateTime={a.actionDate}>{formatDate(a.actionDate, a.datePrecision)}</time> · {actionTypeLabels[a.actionType]}{" "}
                {a.underReview && <UnderReviewTag />}
              </p>
              <h3 className="mt-1 font-sans text-lg font-semibold">{a.title}</h3>
              <p className="mt-1 max-w-[62ch]">
                {a.description}
                <Cite id={`action-${a.id}`} citations={cites(p, "institutionAction", a.id)} />
              </p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------

export function CasesSection({ profile: p }: P) {
  return (
    <section aria-labelledby="cases">
      <SectionHeading id="cases" title="Documented cases">
        <p>
          Case timelines document institutional and legal processes as recorded in sources. They are not profiles of
          individuals, and allegations are presented as allegations.
        </p>
      </SectionHeading>
      {p.cases.length === 0 ? (
        <p className="text-ink-muted">No documented cases have been published for this institution.</p>
      ) : (
        <ul className="divide-y divide-rule border-y border-rule">
          {p.cases.map((c) => (
            <li key={c.id} className="py-4">
              <Link href={`/case/${c.slug}`} className="font-serif text-lg font-semibold">
                {c.title}
              </Link>{" "}
              {c.underReview && <UnderReviewTag />}
              <p className="mt-1 max-w-[62ch] text-ink-muted">{c.summary}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------

export function CoverageSection({ profile: p }: P) {
  return (
    <section aria-labelledby="coverage">
      <SectionHeading id="coverage" title="Recent coverage">
        <p>
          Reporting selected by researchers. Not exhaustive. This is journalism, not official findings; summaries are
          ours, not the publisher&rsquo;s headline.
        </p>
      </SectionHeading>
      {p.coverage.length === 0 ? (
        <p className="text-ink-muted">No coverage has been added yet.</p>
      ) : (
        <CoverageList coverage={p.coverage} />
      )}
    </section>
  );
}
