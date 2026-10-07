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
/** The site-wide share card (src/app/opengraph-image.tsx). Pages with their own card override it. */
const defaultShareImage = { url: "/opengraph-image", width: 1200, height: 630, alt: `${site.name}: ${site.description}` };

/** Search results show roughly 155 characters of a description; cut longer ones at a word boundary. */
export function shortDescription(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ") > max * 0.6 ? cut.lastIndexOf(" ") : cut.length).replace(/[,;:.\s]+$/, "")}…`;
}

/**
 * Title, description, canonical URL and Open Graph / X tags for one page.
 * Open Graph is set in full on every page because a page's `openGraph` replaces the layout's, image included.
 * `absoluteTitle` skips the " — Campus Accountability" suffix, for pages whose own title is already long.
 * `ownShareImage`: the page has its own opengraph-image file, which an image set here would override.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  noindex = false,
  absoluteTitle = false,
  ownShareImage = false,
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  noindex?: boolean;
  absoluteTitle?: boolean;
  ownShareImage?: boolean;
}): Metadata {
  const desc = shortDescription(description);
  const images = ownShareImage ? {} : { images: [defaultShareImage] };
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description: desc,
    alternates: { canonical: path },
    openGraph: { siteName: site.name, locale: "en_US", type, title, description: desc, url: path, ...images },
    twitter: { card: "summary_large_image", title, description: desc, ...images },
    ...(noindex && { robots: { index: false, follow: true } }),
  };
}

// ---------------------------------------------------------------------------
// Structured data (schema.org JSON-LD)
// ---------------------------------------------------------------------------

export type JsonLdObject = { "@context"?: "https://schema.org"; "@type": string; [key: string]: unknown };

export const publisher = () => ({ "@type": "Organization", name: site.name, url: siteUrl(), logo: absoluteUrl("/icon-512.png") });

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
