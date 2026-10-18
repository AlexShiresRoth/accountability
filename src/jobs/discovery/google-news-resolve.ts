// Resolves a Google News article link to the publisher's own URL.
//
// Google News RSS links (news.google.com/rss/articles/<id>) carry no publisher URL. Google's own web client
// resolves them in two steps, which this repeats: the article page carries a signature and timestamp
// (data-n-a-sg / data-n-a-ts), and an internal endpoint (batchexecute, rpc "Fbv4je") exchanges them for the URL.
// Both are undocumented and may change without notice, so every failure returns null and callers keep the
// Google link; a researcher then pastes the publisher URL by hand, as before. Checked working on 2026-10-18.

import { isGoogleNewsUrl } from "./google-news";

const BATCH_ENDPOINT = "https://news.google.com/_/DotsSplashUi/data/batchexecute";
// Google's web endpoints serve the signature only to browser-like clients.
const BROWSER_UA = "Mozilla/5.0 (compatible; CampusAccountabilityBot/0.1; public-interest research)";

export type ResolveFetch = (url: string, init?: RequestInit) => Promise<{ ok: boolean; status: number; text: () => Promise<string> }>;

/** The article id from a Google News link, or null if it isn't one. */
export function googleNewsArticleId(url: string): string | null {
  if (!isGoogleNewsUrl(url)) return null;
  return url.match(/\/articles\/([A-Za-z0-9_-]+)/)?.[1] ?? null;
}

/** Signature and timestamp from the article page. */
export function parseDecodingParams(html: string): { signature: string; timestamp: string } | null {
  const signature = html.match(/data-n-a-sg="([^"]+)"/)?.[1];
  const timestamp = html.match(/data-n-a-ts="(\d+)"/)?.[1];
  return signature && timestamp ? { signature, timestamp } : null;
}

export function batchRequestBody(id: string, { signature, timestamp }: { signature: string; timestamp: string }): string {
  const inner = JSON.stringify([
    "garturlreq",
    [["X", "X", ["X", "X"], null, null, 1, 1, "US:en", null, 1, null, null, null, null, null, 0, 1], "X", "X", 1, [1, 1, 1], 1, 1, null, 0, 0, null, 0],
    id,
    Number(timestamp),
    signature,
  ]);
  return new URLSearchParams({ "f.req": JSON.stringify([[["Fbv4je", inner, null, "generic"]]]) }).toString();
}

/** The publisher URL from a batchexecute reply, or null. */
export function parseBatchReply(body: string): string | null {
  // The reply is a JSON-ish stream; the payload is itself a JSON string: ["garturlres","<url>",…].
  const payload = body.match(/\["wrb\.fr","Fbv4je","((?:[^"\\]|\\.)*)"/)?.[1];
  if (!payload) return null;
  try {
    const inner = JSON.parse(JSON.parse(`"${payload}"`)) as unknown[];
    const url = inner[0] === "garturlres" ? inner[1] : null;
    if (typeof url !== "string" || !/^https?:\/\//.test(url) || isGoogleNewsUrl(url)) return null;
    return url;
  } catch {
    return null;
  }
}

/** The publisher URL behind a Google News link, or null if it can't be resolved. Makes two requests to Google. */
export async function resolveGoogleNewsUrl(url: string, fetchImpl: ResolveFetch = fetch as unknown as ResolveFetch): Promise<string | null> {
  const id = googleNewsArticleId(url);
  if (!id) return null;
  try {
    const page = await fetchImpl(`https://news.google.com/rss/articles/${id}`, {
      headers: { "User-Agent": BROWSER_UA },
      signal: AbortSignal.timeout(15_000),
    });
    if (!page.ok) return null;
    const params = parseDecodingParams(await page.text());
    if (!params) return null;
    const reply = await fetchImpl(BATCH_ENDPOINT, {
      method: "POST",
      headers: { "User-Agent": BROWSER_UA, "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: batchRequestBody(id, params),
      signal: AbortSignal.timeout(15_000),
    });
    if (!reply.ok) return null;
    return parseBatchReply(await reply.text());
  } catch {
    return null;
  }
}
