// Splits plain text into text and link segments for rendering. Only http(s) URLs become links;
// the result is rendered as React elements (never injected HTML), so text can't introduce markup.

export type TextSegment = { type: "text"; value: string } | { type: "link"; value: string; href: string };

const URL_PATTERN = /https?:\/\/[^\s<>"]+/gi;
const TRAILING = /[.,;:!?'"’”]+$/;

/** Trailing punctuation usually ends the sentence, not the URL. Closing brackets are kept only if balanced. */
function trimUrl(raw: string): string {
  let url = raw;
  for (;;) {
    const before = url;
    url = url.replace(TRAILING, "");
    for (const [open, close] of [["(", ")"], ["[", "]"], ["{", "}"]] as const) {
      while (url.endsWith(close) && url.split(open).length < url.split(close).length) url = url.slice(0, -1);
    }
    if (url === before) return url;
  }
}

function isSafeHttpUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return (u.protocol === "http:" || u.protocol === "https:") && Boolean(u.hostname);
  } catch {
    return false;
  }
}

export function splitLinks(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let last = 0;
  for (const match of text.matchAll(URL_PATTERN)) {
    const start = match.index!;
    const url = trimUrl(match[0]);
    if (!url || !isSafeHttpUrl(url)) continue;
    if (start > last) segments.push({ type: "text", value: text.slice(last, start) });
    segments.push({ type: "link", value: url, href: url });
    last = start + url.length;
  }
  if (last < text.length) segments.push({ type: "text", value: text.slice(last) });
  return segments;
}
