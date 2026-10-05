import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { roadmap, roadmapSections, type RoadmapStatus } from "@/content/roadmap";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Roadmap",
  description: "What this project is working on now, what is planned next, and what has recently been completed.",
  path: "/roadmap",
});

const statusStyles: Record<RoadmapStatus, string> = {
  in_progress: "border-accent text-accent",
  planned: "border-rule-strong text-ink-muted",
  done: "border-ink bg-ink text-paper",
};

const statusLabels: Record<RoadmapStatus, string> = {
  in_progress: "In progress",
  planned: "Planned",
  done: "Completed",
};

const month = (ym: string) =>
  new Date(`${ym}-01T00:00:00Z`).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });

export default function RoadmapPage() {
  return (
    <>
      <PageHeader
        eyebrow="Roadmap"
        title="What’s next"
        lede="This project is new and growing. Every profile is researched from primary documents and checked by a person before anything is published, so new universities and features arrive gradually."
      />
      <Container className="space-y-14 py-12">
        <p className="max-w-[65ch] text-ink-muted">
          Plans change as research progresses; nothing here is a commitment to a date. Anything published still follows
          the same rules: sourced, human-verified, and with allegations clearly distinguished from findings.{" "}
          <Link href="/methodology">How we work</Link>
        </p>

        {roadmapSections.map((section) => {
          const items = roadmap.filter((i) => i.status === section.status);
          return (
            <section key={section.status} aria-labelledby={`roadmap-${section.status}`}>
              <h2 id={`roadmap-${section.status}`} className="text-2xl">
                {section.title}
              </h2>
              {items.length === 0 ? (
                <p className="mt-3 text-ink-muted">{section.empty}</p>
              ) : (
                <ul className="mt-5 divide-y divide-rule border-y border-rule">
                  {items.map((item) => (
                    <li key={item.id} id={item.id} className="grid gap-2 py-6 sm:grid-cols-[1fr_auto] sm:gap-x-8">
                      <div>
                        <h3 className="font-serif text-lg font-semibold">{item.title}</h3>
                        <p className="mt-2 max-w-[65ch] text-ink-muted">{item.summary}</p>
                        {item.id === "student-experiences" && (
                          <p className="mt-2 max-w-[65ch] text-sm text-ink-muted">
                            These would be personal accounts of the support process, not allegations: we will continue
                            not to accept allegations from the public, and accounts will never be used as evidence about
                            any person or case.
                          </p>
                        )}
                        {item.link && (
                          <p className="mt-3 text-sm">
                            <Link href={item.link.href}>{item.link.label}</Link>
                          </p>
                        )}
                      </div>
                      <div className="flex items-baseline gap-3 sm:flex-col sm:items-end sm:gap-1">
                        <span
                          className={`inline-block border px-1.5 py-px text-xs font-semibold whitespace-nowrap ${statusStyles[item.status]}`}
                        >
                          {statusLabels[item.status]}
                        </span>
                        <span className="text-sm text-ink-muted">Updated {month(item.updated)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </Container>
    </>
  );
}
