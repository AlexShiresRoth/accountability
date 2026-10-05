import Link from "next/link";
import { site } from "@/lib/site";
import { Container } from "./container";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-rule bg-surface">
      <Container className="grid gap-8 py-10 text-[0.95rem] text-ink-muted sm:grid-cols-2">
        <div className="space-y-3">
          <p className="font-serif text-base font-semibold text-ink">{site.name}</p>
          <p>
            Only human-verified, sourced information is published. We do not accept allegations from the public and do
            not publish profiles of accused individuals.
          </p>
        </div>
        <div className="space-y-3">
          <p>
            <strong className="text-ink">In immediate danger, call 911.</strong> This site is not a reporting channel
            or an emergency service.
          </p>
          <p>
            <Link href="/methodology">Methodology</Link> · <Link href="/methodology#corrections">Corrections</Link> ·{" "}
            <Link href="/sources">Sources</Link> · <Link href="/roadmap">Roadmap</Link>
          </p>
        </div>
      </Container>
    </footer>
  );
}
