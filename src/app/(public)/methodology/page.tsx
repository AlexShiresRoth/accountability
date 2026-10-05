import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Methodology",
  description:
    "How this project sources, verifies, and presents campus crime statistics, institutional responses, and documented cases, and the limits of that data.",
  path: "/methodology",
});

const CFR_668_46 = "https://www.law.cornell.edu/cfr/text/34/668.46";
const CAMPUS_SAFETY_DATA = "https://ope.ed.gov/campussafety/";

const sections = [
  { id: "verification", title: "Sourcing and verification" },
  { id: "reported-vs-prevalence", title: "Reported incidents are not prevalence" },
  { id: "delayed-reports", title: "Delayed reports and annual counts" },
  { id: "geography", title: "Clery geography" },
  { id: "comparisons", title: "Comparing institutions" },
  { id: "coverage", title: "Which universities we cover" },
  { id: "missing-information", title: "Missing information" },
  { id: "legal-status", title: "Legal and procedural terms" },
  { id: "privacy", title: "Privacy" },
  { id: "corrections", title: "Corrections and updates" },
];

const legalTerms: [string, string][] = [
  ["Allegation", "A claim that has not been tested by a court or a formal process. We attribute it to whoever made it: “the complaint alleges…”."],
  ["Police report", "A record that a report was made to law enforcement. It is not a finding that a crime occurred."],
  ["Arrest", "Police took a person into custody. An arrest is not a charge or a conviction."],
  ["Criminal charge", "Prosecutors formally accused a person of a crime. A charged person is presumed innocent."],
  ["Prosecution declined", "Prosecutors chose not to bring or continue charges. This is not a finding of innocence or guilt."],
  ["Dismissal", "A court or body ended a matter without a verdict on the merits, or on grounds stated in the record."],
  ["Acquittal", "A court found the defendant not guilty of the charge."],
  ["Conviction", "A court found, or the defendant pleaded, guilty to a specific offense. We name the offense of conviction, which may differ from the original charge."],
  ["Civil complaint", "A lawsuit's opening document. It contains allegations, not findings."],
  ["Settlement", "Parties resolved a dispute by agreement. A settlement is usually not a finding of liability, and we report its terms only as published."],
  ["University discipline", "An outcome of an institution's own process, which uses different standards and procedures from a criminal court."],
];

export default function MethodologyPage() {
  return (
    <>
      <PageHeader
        eyebrow="How we work"
        title="Methodology"
        lede="What we publish, how it is verified, and how to read it. We document institutional behavior; we do not score universities or judge individuals."
      />
      <Container className="grid gap-12 py-12 lg:grid-cols-[14rem_1fr]">
        <nav aria-label="On this page" className="lg:sticky lg:top-8 lg:self-start">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-ink-muted">On this page</p>
          <ol className="space-y-2 text-[0.95rem]">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-ink-muted no-underline hover:text-ink hover:underline">
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article className="prose-body">
          <h2 id="verification">Sourcing and verification</h2>
          <p>
            Every significant claim on this site is linked to at least one source. Sources are primary where possible:
            federal and state records, university publications, court records, and police records. Reputable journalism
            is used where primary records are unavailable, and is labeled as journalism.
          </p>
          <p>Each record moves through a review workflow:</p>
          <ul>
            <li>
              <strong>Draft</strong> and <strong>pending review</strong>: entered by a researcher, not public.
            </li>
            <li>
              <strong>Verified</strong>: checked against its sources by a human reviewer. Only verified records are
              published.
            </li>
            <li>
              <strong>Needs update</strong>: a newer source may change the record. It is withdrawn until re-verified.
            </li>
            <li>
              <strong>Rejected</strong>: could not be supported by sources. Never published.
            </li>
          </ul>
          <p>
            Automated tools may help researchers find candidate facts in documents in the future. They never publish
            anything. A person verifies every statistic, event, and institutional claim before it appears here.
          </p>

          <h2 id="reported-vs-prevalence">Reported incidents are not prevalence</h2>
          <p>
            Statistics come from universities&rsquo; Annual Security Reports, required by the Clery Act. They count
            incidents reported to local police or to a campus security authority (
            <a href={CFR_668_46}>34 CFR 668.46</a>). Many incidents of sexual violence are never reported, so these
            counts do not measure how often violence occurs.
          </p>
          <p>
            A rising count is not, on its own, evidence that a campus became more dangerous. It may reflect more
            students coming forward, better-known reporting options, or changes in policy. A falling count is not
            evidence of improvement for the same reasons.
          </p>

          <h2 id="delayed-reports">Delayed reports and annual counts</h2>
          <p>
            Clery statistics are recorded in the calendar year an incident was <em>reported</em>, not the year it
            occurred (<a href={CFR_668_46}>34 CFR 668.46</a>). A single delayed report describing several past
            incidents can produce a sharp increase in one year.
          </p>
          <p>
            Universities often explain these situations in footnotes. We store those footnotes as data and display them
            directly beside the figures they describe. Each report covers the three most recent calendar years, so the
            same year can appear in more than one report. When figures for a year differ between reports, we show the
            most recent verified figure and note the revision.
          </p>

          <h2 id="geography">Clery geography</h2>
          <p>Statistics are reported by location category:</p>
          <ul>
            <li>
              <strong>On campus</strong>: property the institution owns or controls within its core campus area,
              including residence halls.
            </li>
            <li>
              <strong>On-campus residential facilities</strong>: a subset of on-campus figures, not an additional
              category.
            </li>
            <li>
              <strong>Noncampus</strong>: property owned or controlled by the institution or by recognized student
              organizations outside the core campus.
            </li>
            <li>
              <strong>Public property</strong>: streets, sidewalks, and similar areas within or immediately adjacent to
              campus.
            </li>
          </ul>
          <p>
            Because residential figures are already included in on-campus figures, categories must not be added
            together. We never present a combined total that double-counts.
          </p>

          <h2 id="comparisons">Comparing institutions</h2>
          <p>
            Universities differ in enrollment, campus geography, the share of students living on campus, and how they
            train staff to receive and record reports. For these reasons we do not rank institutions or calculate a
            safety score. Where figures are shown side by side, read them as context, not as a comparison of safety.
          </p>

          <h2 id="coverage">Which universities we cover</h2>
          <p>
            We began with Cornell, Harvard and Columbia. We are now adding the universities that reported the largest
            numbers of rapes, across all Clery locations, in the U.S. Department of Education&rsquo;s most recent{" "}
            <a href={CAMPUS_SAFETY_DATA}>Campus Safety and Security data</a> (calendar year 2024).
          </p>
          <p>
            That order is not a ranking, and it does not mean these universities are less safe than others. Raw counts
            rise with enrollment, with how willing students are to come forward, and with how carefully an institution
            records reports. A single year can also be shaped by one-time events, such as many past incidents being
            reported at once. University profiles do not mention how they were selected.
          </p>

          <h2 id="missing-information">Missing information</h2>
          <p>
            Federal student-privacy law and institutional policy often keep disciplinary processes and outcomes
            confidential. When we could not find information, we say exactly that, for example: &ldquo;Outcome
            information was not located in the public sources reviewed.&rdquo; Missing information is never treated as
            evidence that an institution failed to act.
          </p>

          <h2 id="legal-status">Legal and procedural terms</h2>
          <p>
            These terms mean different things and are never used interchangeably. Language on case pages follows the
            source: &ldquo;the complaint alleges,&rdquo; &ldquo;police records state,&rdquo; &ldquo;prosecutors
            charged,&rdquo; &ldquo;the defendant was convicted of.&rdquo;
          </p>
          <dl className="mt-6 divide-y divide-rule border-y border-rule">
            {legalTerms.map(([term, def]) => (
              <div key={term} className="grid gap-1 py-3 sm:grid-cols-[11rem_1fr] sm:gap-4">
                <dt className="font-semibold">{term}</dt>
                <dd className="text-ink-muted">{def}</dd>
              </div>
            ))}
          </dl>

          <h2 id="privacy">Privacy</h2>
          <ul>
            <li>We do not store or publish the identities of victims or survivors.</li>
            <li>We do not publish residential or precise locations that could identify a person.</li>
            <li>We do not accept allegations from the public.</li>
            <li>
              Case pages document institutional and legal processes. They are not profiles of accused individuals, and we
              do not rank or list accused people.
            </li>
          </ul>

          <h2 id="corrections">Corrections and updates</h2>
          <p>
            When we correct an error or a case outcome changes, the correction is shown at the top of the affected page,
            as prominently as the original information, with the date it was made. Earlier versions of changed events
            remain visible and are marked as updated.
          </p>
          <p>
            See <Link href="/sources">Sources</Link> for the kinds of documents we rely on.
          </p>
        </article>
      </Container>
    </>
  );
}
