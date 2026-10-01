// Minimal RSS 2.0 / Atom parser. Reads only headline-level metadata; article bodies are never stored.

export type FeedItem = {
  title: string | null;
  url: string | null;
  publishedAt: Date | null;
  snippet: string | null;
};

const SNIPPET_LENGTH = 280;

export function parseFeed(xml: string): FeedItem[] {
  const blocks = matchAll(xml, /<item\b[^>]*>([\s\S]*?)<\/item>/gi);
  if (blocks.length) return blocks.map(parseRssItem);
  return matchAll(xml, /<entry\b[^>]*>([\s\S]*?)<\/entry>/gi).map(parseAtomEntry);
}

function parseRssItem(block: string): FeedItem {
  return {
    title: cleanText(tag(block, "title")),
    url: cleanText(tag(block, "link")) ?? permalinkGuid(block),
    publishedAt: parseDate(tag(block, "pubDate") ?? tag(block, "dc:date")),
    snippet: toSnippet(tag(block, "description")),
  };
}

function parseAtomEntry(block: string): FeedItem {
  const alternate = block.match(/<link\b[^>]*rel=["']alternate["'][^>]*>/i)?.[0] ?? block.match(/<link\b[^>]*>/i)?.[0];
  return {
    title: cleanText(tag(block, "title")),
    url: alternate?.match(/href=["']([^"']+)["']/i)?.[1] ?? null,
    publishedAt: parseDate(tag(block, "published") ?? tag(block, "updated")),
    snippet: toSnippet(tag(block, "summary")),
  };
}

function matchAll(s: string, re: RegExp) {
  return [...s.matchAll(re)].map((m) => m[1]);
}

function tag(block: string, name: string): string | null {
  const escaped = name.replace(":", "\\:");
  const m = block.match(new RegExp(`<${escaped}\\b[^>]*>([\\s\\S]*?)<\\/${escaped}>`, "i"));
  return m ? unwrapCdata(m[1]) : null;
}

function permalinkGuid(block: string): string | null {
  const m = block.match(/<guid\b([^>]*)>([\s\S]*?)<\/guid>/i);
  if (!m || /isPermaLink=["']false["']/i.test(m[1])) return null;
  return cleanText(unwrapCdata(m[2]));
}

const unwrapCdata = (s: string) => s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", mdash: "—", ndash: "–", hellip: "…" };

export function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, code: string) => {
    if (code[0] === "#") {
      const n = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : whole;
    }
    return ENTITIES[code.toLowerCase()] ?? whole;
  });
}

function cleanText(s: string | null): string | null {
  if (s === null) return null;
  const text = decodeEntities(s.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
  return text || null;
}

function toSnippet(s: string | null): string | null {
  const text = cleanText(s);
  if (!text) return null;
  return text.length > SNIPPET_LENGTH ? `${text.slice(0, SNIPPET_LENGTH).replace(/\s+\S*$/, "")}…` : text;
}

function parseDate(s: string | null): Date | null {
  if (!s) return null;
  const d = new Date(s.trim());
  return Number.isNaN(d.getTime()) ? null : d;
}
