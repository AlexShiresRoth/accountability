import { isIndexable, siteUrl } from "@/lib/seo";
import { site } from "@/lib/site";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const body = Inter({ variable: "--font-body", subsets: ["latin"] });
const display = Source_Serif_4({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: site.name, template: `%s — ${site.name}` },
  description: site.description,
  metadataBase: new URL(siteUrl()),
  applicationName: site.name,
  openGraph: { siteName: site.name, locale: "en_US", type: "website" },
  twitter: { card: "summary_large_image" },
  // Preview deployments and local builds read the development database: keep them out of search.
  robots: isIndexable()
    ? { index: true, follow: true }
    : { index: false, follow: false },
  // Google Search Console ownership check, if verifying by meta tag rather than DNS.
  ...(process.env.GOOGLE_SITE_VERIFICATION && {
    verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  }),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f3ee" },
    { media: "(prefers-color-scheme: dark)", color: "#15171a" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${body.variable} ${display.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col bg-paper text-ink">
        {children}
      </body>
      <Analytics />
    </html>
  );
}
