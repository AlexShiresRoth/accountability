// Google News RSS search: https://news.google.com/rss/search?q=…
// Keyless. Used with the project owner's sign-off for discovery only (headline metadata; never article text).
// Item links point to news.google.com, not the publisher, and cannot be resolved server-side without
// undocumented endpoints. Candidates therefore keep the Google link internally, and accepting one requires
// the researcher to paste the publisher's own URL (see acceptCandidate).

import { decodeEntities } from "./feed-parser";

const ENDPOINT = "https://news.google.com/rss/search";



export type GoogleNewsItem = {
  url: string;
  title: string | null;
  publisher: string | null;
  publisherUrl: string | null;
  publishedAt: Date | null;
};

export function googleNewsUrl(names: string[], terms: string[], days: number): string {
  const nameClause = names.length === 1 ? `"${names[0]}"` : `(${names.map((n) => `"${n}"`).join(" OR ")})`;
  const q = `${nameClause} (${terms.join(" OR ")}) when:${days}d`;
  return `${ENDPOINT}?${new URLSearchParams({ q, hl: "en-US", gl: "US", ceid: "US:en" })}`;
}

export function parseGoogleNews(xml: string): GoogleNewsItem[] {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, block]) => {
    const text = (tag: string) => {
      const m = block.match(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`));
      return m ? decodeEntities(m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")).trim() || null : null;
    };
    const source = block.match(/<source\s+url="([^"]*)"[^>]*>([\s\S]*?)<\/source>/);
    const publisher = source ? decodeEntities(source[2]).trim() : null;
    const date = text("pubDate");
    return {
      url: text("link") ?? "",
      title: stripPublisherSuffix(text("title"), publisher),
      publisher,
      publisherUrl: source?.[1] ?? null,
      publishedAt: date && !Number.isNaN(Date.parse(date)) ? new Date(date) : null,
    };
  }).filter((i) => i.url);
}

/** Google appends " - Publisher" to headlines. */
export function stripPublisherSuffix(title: string | null, publisher: string | null): string | null {
  if (!title || !publisher) return title;
  const suffix = ` - ${publisher}`;
  return title.endsWith(suffix) ? title.slice(0, -suffix.length).trim() : title;
}

export const isGoogleNewsUrl = (url: string) => {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host === "news.google.com" || host.endsWith(".google.com") || host === "google.com";
  } catch {
    return false;
  }
};

/** Headline key for cross-source de-duplication (the same story found via a campus feed and Google News). */
export function headlineKey(title: string | null): string | null {
  if (!title) return null;
  const key = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[‘’“”'"]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  return key.length >= 12 ? key : null;
}
