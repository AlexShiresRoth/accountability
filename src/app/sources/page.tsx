import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { sourceTypes } from "@/lib/source-types";

export const metadata: Metadata = {
  title: "Sources",
  description: "The types of documents this project relies on, and how citations connect each claim to its evidence.",
};

export default function SourcesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Transparency"
        title="Sources"
        lede="Each statistic, event, and institutional claim is cited individually, so you can check the evidence for a specific fact rather than a whole page."
      />
      <Container className="space-y-16 py-12">
        <section aria-labelledby="how" className="prose-body">
          <h2 id="how" className="!mt-0">
            How citations work
          </h2>
          <p>
            A citation connects one claim to one source, with a page or section reference where the source allows it.
            Select any citation marker to see the source, when it was published, when we retrieved it, and an archived
            copy where one exists.
          </p>
          <p>
            Official statistics, university statements, court records, and journalism are labeled differently so you
            can tell whose account you are reading. See the <Link href="/methodology">methodology</Link> for how
            sources are verified.
          </p>
        </section>

        <section aria-labelledby="types">
          <h2 id="types" className="text-2xl">
            Source types
          </h2>
          <dl className="mt-6 divide-y divide-rule border-y border-rule">
            {Object.entries(sourceTypes).map(([key, t]) => (
              <div key={key} className="grid gap-1 py-4 sm:grid-cols-[14rem_1fr] sm:gap-6">
                <dt className="font-semibold">{t.label}</dt>
                <dd className="max-w-[60ch] text-ink-muted">{t.description}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="index">
          <h2 id="index" className="text-2xl">
            Source index
          </h2>
          <p className="mt-3 text-ink-muted">No verified sources have been published yet.</p>
        </section>
      </Container>
    </>
  );
}
