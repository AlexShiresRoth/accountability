import "server-only";
// Drafts the neutral one-sentence coverage summary for a researcher to check. A draft is never saved or
// published by itself: it fills the form field, and the researcher edits, accepts or replaces it.

/** OpenAI model for drafts; override with OPENAI_SUMMARY_MODEL. A small model is plenty for one sentence. */
export const SUMMARY_MODEL_DEFAULT = "gpt-5-mini";
/** Below this much readable text (a paywall stub, a cookie wall, a blocked page) there is nothing to summarize. */
export const MIN_ARTICLE_CHARS = 600;
const MAX_ARTICLE_CHARS = 20_000;

export type SummaryDraft =
  | { ok: true; summary: string; caution: string | null; model: string }
  | { ok: false; reason: string };

const decode = (s: string) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;|&rsquo;|&#8217;/g, "’")
    .replace(/&lsquo;|&#8216;/g, "‘")
    .replace(/&ldquo;|&#8220;/g, "“")
    .replace(/&rdquo;|&#8221;/g, "”")
    .replace(/&mdash;|&#8212;/g, "—")
    .replace(/&ndash;|&#8211;/g, "–")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));

/**
 * Readable body text from an article page: the paragraphs inside <article> (or the whole page when there is no
 * <article>), without scripts, navigation, figure captions or footers. Good enough for news pages; not a parser.
 */
export function extractArticleText(html: string): string {
  const withoutNoise = html.replace(/<(script|style|noscript|nav|header|footer|aside|figure|form|svg)\b[\s\S]*?<\/\1>/gi, " ");
  const article = withoutNoise.match(/<article\b[\s\S]*?<\/article>/gi)?.join(" ") ?? withoutNoise;
  const paragraphs = [...article.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((m) => decode(m[1].replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim())
    .filter((p) => p.length > 40);
  return paragraphs.join("\n\n").slice(0, MAX_ARTICLE_CHARS);
}

const SYSTEM = `You draft one-sentence summaries of news articles for a public-interest website that documents how U.S. universities report, prevent and respond to violence against women. A researcher checks every draft before anything is published.

Rules:
- One sentence, at most 35 words, in plain neutral English. Report the article's main development only; leave out secondary details.
- Attribute the content to the article: start with a verb such as "Reports that", "Describes", "Says", or name the source of a claim ("The complaint alleges", "Police say", "The university said").
- State only what the article itself says. Add no context, judgement, motive or adjectives (never "shocking", "disturbing", "controversial").
- Keep who did what to what exactly as reported. For example, a statement condemning an alleged assault is not a statement condemning the lawsuit about it; a university announcing a review is not the review finding anything.
- Keep legal status exact and never upgrade it: an allegation is not a charge, a charge is not a conviction, a lawsuit is not a finding, an arrest is not a charge. Say "alleges", "accused", "charged" only as the article does.
- Never name victims, complainants or survivors, and do not name accused or other private individuals; describe them by role ("a former student", "fraternity members", "a professor"). Officials may be named by title only ("the university president", "the district attorney").
- Do not repeat or paraphrase the headline; summarize what the article reports.
- If the text is not a news article about the topic, or there is too little of it to summarize faithfully, do not guess.

Reply with JSON only, no prose: {"summary": string or null, "caution": string or null}
Use "caution" (one short sentence) to tell the researcher anything to double-check, e.g. "The article reports an arrest, not a charge." or "Only the first part of the article was available." Use null when there is nothing.`;

export function buildSummaryPrompt({ title, publisher, text }: { title: string | null; publisher: string | null; text: string }): string {
  // OpenAI's JSON mode requires the word "JSON" in the input itself, not only in the instructions.
  return `Publisher: ${publisher ?? "unknown"}\nHeadline: ${title ?? "unknown"}\n\nArticle text:\n${text}\n\nReply with the JSON object described in your instructions.`;
}

/** Parses the model's JSON reply. Tolerates a ```json fence; rejects anything that isn't a usable sentence. */
export function parseSummaryReply(reply: string, model: string): SummaryDraft {
  const json = reply.replace(/^\s*```(?:json)?\s*|\s*```\s*$/g, "");
  let data: { summary?: unknown; caution?: unknown };
  try {
    data = JSON.parse(json);
  } catch {
    return { ok: false, reason: "The draft came back in an unexpected format. Try again, or write the summary yourself." };
  }
  const summary = typeof data.summary === "string" ? data.summary.replace(/\s+/g, " ").trim() : "";
  const caution = typeof data.caution === "string" && data.caution.trim() ? data.caution.trim() : null;
  if (summary.length < 20) {
    return { ok: false, reason: caution ?? "There wasn't enough in the article to draft a faithful summary. Write it yourself." };
  }
  const words = summary.split(" ").length;
  const tooLong = words > 40 ? `The draft is ${words} words; trim it to one main point.` : null;
  return { ok: true, summary: summary.slice(0, 600), caution: [caution, tooLong].filter(Boolean).join(" ") || null, model };
}

export type FetchLike = (url: string, init: RequestInit) => Promise<{ ok: boolean; status: number; json: () => Promise<unknown> }>;

type OpenAIResponse = {
  output?: { type: string; content?: { type: string; text?: string }[] }[];
  error?: { message?: string } | null;
};

/** The text of an OpenAI Responses API reply (the REST body has no `output_text` shortcut; that's SDK-only). */
export function responseText(body: OpenAIResponse): string {
  return (body.output ?? [])
    .filter((o) => o.type === "message")
    .flatMap((o) => o.content ?? [])
    .filter((c) => c.type === "output_text")
    .map((c) => c.text ?? "")
    .join("");
}

/** Asks OpenAI for a draft (Responses API, JSON mode). Needs OPENAI_API_KEY; OPENAI_SUMMARY_MODEL overrides the model. */
export async function draftCoverageSummary(
  input: { title: string | null; publisher: string | null; text: string },
  { env = process.env, fetchImpl = fetch as unknown as FetchLike }: { env?: NodeJS.ProcessEnv; fetchImpl?: FetchLike } = {},
): Promise<SummaryDraft> {
  const key = env.OPENAI_API_KEY;
  if (!key) return { ok: false, reason: "AI drafting isn't set up: add OPENAI_API_KEY to the environment." };
  if (input.text.length < MIN_ARTICLE_CHARS) {
    return { ok: false, reason: "Couldn't read enough of the article (a paywall or a blocked page). Paste the article text, or write the summary yourself." };
  }
  const model = env.OPENAI_SUMMARY_MODEL || SUMMARY_MODEL_DEFAULT;
  const res = await fetchImpl("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      instructions: SYSTEM,
      input: buildSummaryPrompt(input),
      text: { format: { type: "json_object" } },
      // Reasoning models spend output tokens thinking; keep that small and leave room for the answer.
      ...(/^(gpt-5|o\d)/.test(model) && { reasoning: { effort: "low" } }),
      max_output_tokens: 2000,
    }),
    signal: AbortSignal.timeout(45_000),
  });
  const body = (await res.json().catch(() => ({}))) as OpenAIResponse;
  if (!res.ok) {
    const detail = body.error?.message ? `: ${body.error.message.replace(/\.+$/, "")}` : "";
    return { ok: false, reason: `The AI service returned HTTP ${res.status}${detail}. Try again, or write the summary yourself.` };
  }
  return parseSummaryReply(responseText(body), model);
}

/** Internal provenance note for a coverage entry whose summary started as an AI draft. */
export function summaryProvenance({ draft, final, model, actor }: { draft: string | null; final: string; model: string | null; actor: string }): string | null {
  if (!draft) return null;
  const by = `Summary drafted by AI (${model ?? "unknown model"}) from the article text`;
  return draft.trim() === final.trim() ? `${by}; accepted unedited by ${actor}.` : `${by}; edited by ${actor}.`;
}

/** Only public web pages: no other schemes, no local or private network addresses. */
export function isFetchableArticleUrl(raw: string): boolean {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return false;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return false;
  const host = url.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".local") || host.endsWith(".internal")) return false;
  if (/^(127\.|10\.|192\.168\.|169\.254\.|0\.)/.test(host) || /^172\.(1[6-9]|2\d|3[01])\./.test(host) || host.includes(":")) return false;
  return true;
}
