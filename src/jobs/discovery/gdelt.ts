// GDELT DOC 2.0 API: https://blog.gdeltproject.org/gdelt-doc-2-0-api-debuts/
// Free, keyless, rate-limited to one request per ~5 seconds. Returns headline metadata only.

import type { FetchText } from "./run";

const ENDPOINT = "https://api.gdeltproject.org/api/v2/doc/doc";



export type GdeltArticle = { url: string; title: string | null; seenAt: Date | null; domain: string | null };

export function buildGdeltQuery(names: string[], terms: string[]): string {
  const quoted = names.map((n) => `"${n}"`);
  // GDELT only allows parentheses around OR'd terms.
  const nameClause = quoted.length === 1 ? quoted[0] : `(${quoted.join(" OR ")})`;
  return `${nameClause} (${terms.join(" OR ")}) sourcelang:english`;
}

export function gdeltUrl(names: string[], terms: string[], timespan: string, maxRecords = 100): string {
  const params = new URLSearchParams({
    query: buildGdeltQuery(names, terms),
    mode: "artlist",
    format: "json",
    sort: "datedesc",
    maxrecords: String(maxRecords),
    timespan,
  });
  return `${ENDPOINT}?${params}`;
}

/** Parses a GDELT artlist response. Throws on non-JSON bodies (GDELT answers rate limits in plain text). */
export function parseGdeltResponse(body: string): GdeltArticle[] {
  let data: { articles?: { url?: string; title?: string; seendate?: string; domain?: string }[] };
  try {
    data = JSON.parse(body);
  } catch {
    throw new Error(`GDELT returned a non-JSON response: ${body.slice(0, 120)}`);
  }
  return (data.articles ?? [])
    .filter((a) => a.url)
    .map((a) => ({
      url: a.url!,
      title: a.title?.trim() || null,
      seenAt: parseSeenDate(a.seendate),
      domain: a.domain ?? null,
    }));
}

// "20260928T141500Z"
function parseSeenDate(s: string | undefined): Date | null {
  const m = s?.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/);
  return m ? new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6])) : null;
}

export async function fetchGdelt(fetchText: FetchText, sleep: (ms: number) => Promise<void>, names: string[], terms: string[], timespan: string) {
  const url = gdeltUrl(names, terms, timespan);
  const attempt = async () => {
    const { status, body } = await fetchText(url);
    if (status === 429) throw new Error("GDELT rate-limited this request (HTTP 429)");
    if (status !== 200) throw new Error(`GDELT HTTP ${status}`);
    return parseGdeltResponse(body);
  };
  try {
    return await attempt();
  } catch {
    await sleep(10_000); // retry once
    return attempt();
  }
}
