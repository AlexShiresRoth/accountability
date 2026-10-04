import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Toaster } from "@/components/admin/toaster";
import { logoutAction } from "./actions";
import { getResearcher } from "@/lib/admin/session";

export const metadata: Metadata = {
  title: { default: "Research admin", template: "%s · Research admin" },
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/inbox", label: "Inbox" },
  { href: "/admin/sources", label: "Sources" },
  { href: "/admin/colleges", label: "Colleges" },
  { href: "/admin/cases", label: "Cases" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const researcher = await getResearcher();
  return (
    <div className="flex min-h-dvh flex-col text-[0.95rem]">
      <header className="border-b border-rule bg-surface">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/admin" className="font-serif font-semibold text-ink no-underline">
              Research admin
            </Link>
            {researcher && (
              <nav aria-label="Admin">
                <ul className="flex flex-wrap gap-x-4">
                  {nav.map((n) => (
                    <li key={n.href}>
                      <Link href={n.href} className="text-ink-muted no-underline hover:text-ink hover:underline">
                        {n.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
          {researcher && (
            <form action={logoutAction} className="flex items-center gap-3 text-sm text-ink-muted">
              <span>Signed in as {researcher.name}</span>
              <button type="submit" className="underline">
                Sign out
              </button>
            </form>
          )}
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
      <Suspense>
        <Toaster />
      </Suspense>
      <footer className="border-t border-rule px-4 py-3 text-center text-xs text-ink-muted">
        Internal research interface. Nothing here is public until verified.
      </footer>
    </div>
  );
}
