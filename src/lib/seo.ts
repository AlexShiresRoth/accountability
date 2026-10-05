import type { Metadata } from "next";
import { site } from "./site";

// Search and sharing metadata shared by the public pages.
//
// Only the production deployment is indexable. Preview deployments and local builds are noindex,
// so draft data on the development database never reaches search engines.

/** The site's absolute origin, without a trailing slash. */
export function siteUrl(env: NodeJS.ProcessEnv = process.env): string {
  if (env.NEXT_PUBLIC_SITE_URL) return env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
  if (env.VERCEL_ENV === "production" && env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  const preview = env.VERCEL_BRANCH_URL || env.VERCEL_URL;
  if (preview) return `https://${preview}`;
  return "http://localhost:3000";
}

export function isIndexable(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.VERCEL_ENV === "production";
}

export const absoluteUrl = (path: string) => `${siteUrl()}${path}`;

/**
 * Title, description, canonical URL and Open Graph tags for one page.
 * Open Graph is set in full on every page because a page's `openGraph` replaces the layout's.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  noindex?: boolean;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { siteName: site.name, locale: "en_US", type, title, description, url: path },
    ...(noindex && { robots: { index: false, follow: true } }),
  };
}

// ---------------------------------------------------------------------------
// Structured data (schema.org JSON-LD)
// ---------------------------------------------------------------------------

export type JsonLdObject = { "@context"?: "https://schema.org"; "@type": string; [key: string]: unknown };

export const publisher = () => ({ "@type": "Organization", name: site.name, url: siteUrl() });

export function breadcrumbs(items: { name: string; path: string }[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Serialises JSON-LD for a <script> tag. `<` is escaped so content can't close the tag. */
export function serializeJsonLd(data: JsonLdObject | JsonLdObject[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
