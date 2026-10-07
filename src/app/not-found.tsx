import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "Page not found", robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
    <Container className="py-24">
      <h1 className="text-3xl">Page not found</h1>
      <p className="mt-4 text-ink-muted">
        The page may have moved, or the record may not be published. <Link href="/">Return home</Link>
      </p>
    </Container>
      </main>
      <SiteFooter />
    </>
  );
}
