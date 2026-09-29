import Link from "next/link";
import { Container } from "@/components/container";
import { DataQualityNotes } from "@/components/data-quality-note";

const measures = [
  {
    title: "Reported incidents",
    body: "Annual Security Report statistics for rape, fondling, dating violence, domestic violence, and stalking, shown with the university's own footnotes.",
  },
  {
    title: "Institutional response",
    body: "What can be verified about Title IX processes, disciplinary procedures, referrals, prevention programs, and published outcomes.",
  },
  {
    title: "Accountability timeline",
    body: "Policy changes, government investigations, lawsuits, settlements, and reforms, both favorable and unfavorable to the institution.",
  },
  {
    title: "Student resources",
    body: "Emergency, confidential, and formal reporting options, with confidential resources clearly separated from reporting channels.",
  },
];

// Replaced by verified college records once the database layer lands.
const initialInstitutions = ["Cornell University", "Harvard University", "Columbia University"];

export default function HomePage() {
  return (
    <>
      <section className="border-b border-rule">
        <Container className="py-16 sm:py-24">
          <h1 className="max-w-3xl text-4xl sm:text-6xl">Look beyond the rankings.</h1>
          <p className="mt-6 max-w-[52ch] text-xl text-ink-muted sm:text-2xl">
            Understand how universities report, prevent, and respond to violence against women.
          </p>

          <form action="/" method="get" role="search" className="mt-10 max-w-xl">
            <label htmlFor="q" className="mb-2 block text-sm font-medium text-ink-muted">
              Find a university
            </label>
            <div className="flex">
              <input
                id="q"
                name="q"
                type="search"
                autoComplete="off"
                placeholder="e.g. Cornell"
                className="min-w-0 flex-1 border border-r-0 border-rule-strong bg-surface px-4 py-3 text-ink placeholder:text-ink-muted/70 focus:outline-none focus-visible:border-accent"
              />
              <button type="submit" className="bg-ink px-5 py-3 font-medium text-paper hover:opacity-90">
                Search
              </button>
            </div>
          </form>
        </Container>
      </section>

      <section aria-labelledby="measures">
        <Container className="py-16">
          <h2 id="measures" className="text-2xl sm:text-3xl">
            What we document
          </h2>
          <p className="mt-3 max-w-[60ch] text-ink-muted">
            Every figure and event links to its source. Only records reviewed by a researcher are published.
          </p>
          <dl className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {measures.map((m) => (
              <div key={m.title} className="border-t border-rule pt-4">
                <dt className="font-serif text-lg font-semibold">{m.title}</dt>
                <dd className="mt-2 text-ink-muted">{m.body}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section id="institutions" aria-labelledby="institutions-heading" className="border-y border-rule bg-surface">
        <Container className="py-16">
          <h2 id="institutions-heading" className="text-2xl sm:text-3xl">
            Universities
          </h2>
          <p className="mt-3 max-w-[60ch] text-ink-muted">
            Coverage begins with three institutions and will expand as profiles are researched and verified.
          </p>
          <ul className="mt-8 divide-y divide-rule border-y border-rule">
            {initialInstitutions.map((name) => (
              <li key={name} className="flex flex-wrap items-baseline justify-between gap-2 py-4">
                <span className="font-serif text-lg">{name}</span>
                <span className="text-sm text-ink-muted">Profile in preparation</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="limits">
        <Container className="py-16">
          <h2 id="limits" className="text-2xl sm:text-3xl">
            Read the numbers carefully
          </h2>
          <p className="mt-3 mb-8 max-w-[60ch] text-ink-muted">
            Campus crime statistics are useful, but they are easy to misread. We do not rank universities or produce a
            safety score. <Link href="/methodology">How we work</Link>
          </p>
          <DataQualityNotes kinds={["notPrevalence", "reportingWillingness", "delayedReports", "outcomesUnavailable"]} />
        </Container>
      </section>

      <section aria-labelledby="prevention" className="border-t border-rule">
        <Container className="grid gap-6 py-16 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <h2 id="prevention" className="text-2xl sm:text-3xl">
              Prevention starts with peers
            </h2>
            <p className="mt-3 max-w-[60ch] text-ink-muted">
              Short, scenario-based lessons on consent, bystander intervention, coercion, and group-chat culture,
              written for every student.
            </p>
          </div>
          <Link
            href="/learn"
            className="justify-self-start border border-ink px-5 py-3 font-medium text-ink no-underline hover:bg-ink hover:text-paper"
          >
            Explore lessons
          </Link>
        </Container>
      </section>
    </>
  );
}
