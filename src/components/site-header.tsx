import Link from "next/link";
import { site } from "@/lib/site";
import { Container } from "./container";

export function SiteHeader() {
  return (
    <header className="border-b border-rule">
      <Container className="flex flex-col gap-3 py-4 sm:flex-row sm:items-baseline sm:justify-between">
        <Link href="/" className="font-serif text-lg font-semibold text-ink no-underline">
          {site.name}
        </Link>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-5 gap-y-1 text-[0.95rem]">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ink-muted no-underline hover:text-ink hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
