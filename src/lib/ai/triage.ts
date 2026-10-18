import "server-only";
// Classifies an inbox item as relevant, irrelevant or unsure for researchers. An aid only: "irrelevant" items are
// dismissed (and can be restored); nothing is accepted, verified or published on the model's say-so.

import { responseText, SUMMARY_MODEL_DEFAULT, type FetchLike } from "./summary";
import { triageVerdicts, type TriageVerdict } from "@/lib/enums";

const SYSTEM = `You screen news items for a public-interest website that documents how specific U.S. universities report, prevent and respond to violence against women: sexual assault and misconduct, rape, dating and domestic violence, stalking, sexual harassment, Title IX processes, and related crimes such as voyeurism, sextortion and trafficking. Researchers review everything you mark relevant or unsure; items you mark irrelevant are set aside.

An item is RELEVANT if it reports on any of these at or involving the named university: an incident, report, allegation, arrest, charge, lawsuit, settlement or verdict; the university's handling of such matters, its Title IX office, policies, prevention programs, campus safety alerts or statistics; government investigations of the university; student or faculty protest or debate about these issues at the university; or an opinion piece specifically about these issues at the university.

An item is IRRELEVANT if any of these applies:
- The university appears only in passing: a researcher, expert, study, lab or center quoted or cited on a topic, an alumnus, a location reference, a medical center treating a patient with no link to the university's conduct.
- The violence or misconduct it describes has no connection to the university, its students, staff or campus.
- It is not about violence against women or the university's response to it (sports, admissions, funding, politics, other crimes).
- It is about a different institution (e.g. a similarly named school) and not the named one.

Answer UNSURE when the text is too thin to tell, or when it could reasonably go either way. Prefer UNSURE to IRRELEVANT whenever in doubt: a wrong IRRELEVANT hides something a researcher needed.

Reply with JSON only: {"verdict": "relevant" | "irrelevant" | "unsure", "reason": string}
"reason" is one short sentence a researcher can check, e.g. "A UChicago Crime Lab researcher is quoted on citywide gun violence; nothing about the university's conduct." Never name victims or private individuals in it.`;

export type TriageInput = {
  college: string | null;
  title: string | null;
  publisher: string | null;
  snippet: string | null;
  /** Article body text, when it could be read. */
  text: string | null;
};

export type TriageResult = { ok: true; verdict: TriageVerdict; reason: string; model: string } | { ok: false; reason: string };

export function buildTriagePrompt({ college, title, publisher, snippet, text }: TriageInput): string {
  const body = text
    ? `Article text:\n${text.slice(0, 8_000)}`
    : "Article text: not available (paywall, blocked page or no article). Judge from the headline and snippet only. If they plainly show the item is about something else (a game result, admissions, funding), answer irrelevant; if they leave any real chance it concerns violence against women at the university, answer unsure.";
  return `University: ${college ?? "not matched"}\nPublisher: ${publisher ?? "unknown"}\nHeadline: ${title ?? "unknown"}\nSnippet: ${snippet ?? "none"}\n\n${body}\n\nReply with the JSON object described in your instructions.`;
}

export function parseTriageReply(reply: string, model: string): TriageResult {
  const json = reply.replace(/^\s*```(?:json)?\s*|\s*```\s*$/g, "");
  let data: { verdict?: unknown; reason?: unknown };
  try {
    data = JSON.parse(json);
  } catch {
    return { ok: false, reason: "The triage reply came back in an unexpected format." };
  }
  const verdict = (triageVerdicts as readonly unknown[]).includes(data.verdict) ? (data.verdict as TriageVerdict) : null;
  const reason = typeof data.reason === "string" ? data.reason.replace(/\s+/g, " ").trim() : "";
  if (!verdict || !reason) return { ok: false, reason: "The triage reply was missing a verdict or reason." };
  return { ok: true, verdict, reason: reason.slice(0, 500), model };
}

/** Asks OpenAI for a verdict. Needs OPENAI_API_KEY; OPENAI_TRIAGE_MODEL overrides the model. */
export async function classifyCandidate(
  input: TriageInput,
  { env = process.env, fetchImpl = fetch as unknown as FetchLike }: { env?: NodeJS.ProcessEnv; fetchImpl?: FetchLike } = {},
): Promise<TriageResult> {
  const key = env.OPENAI_API_KEY;
  if (!key) return { ok: false, reason: "AI triage isn't set up: add OPENAI_API_KEY to the environment." };
  const model = env.OPENAI_TRIAGE_MODEL || SUMMARY_MODEL_DEFAULT;
  const res = await fetchImpl("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      instructions: SYSTEM,
      input: buildTriagePrompt(input),
      text: { format: { type: "json_object" } },
      ...(/^(gpt-5|o\d)/.test(model) && { reasoning: { effort: "low" } }),
      max_output_tokens: 2000,
    }),
    signal: AbortSignal.timeout(45_000),
  });
  const body = (await res.json().catch(() => ({}))) as Parameters<typeof responseText>[0] & { error?: { message?: string } | null };
  if (!res.ok) return { ok: false, reason: `The AI service returned HTTP ${res.status}${body.error?.message ? `: ${body.error.message}` : ""}.` };
  return parseTriageReply(responseText(body), model);
}
