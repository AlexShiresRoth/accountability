import { describe, expect, it } from "vitest";
import {
  MIN_ARTICLE_CHARS,
  SUMMARY_MODEL_DEFAULT,
  draftCoverageSummary,
  extractArticleText,
  isFetchableArticleUrl,
  parseSummaryReply,
  responseText,
  summaryProvenance,
  type FetchLike,
} from "./summary";

const para = (n: number) => `<p>Paragraph ${n} of the report describes what the court filing says about the university and its response in some detail.</p>`;
const longText = Array.from({ length: 10 }, (_, i) => `Paragraph ${i} of the article reports on the lawsuit and the university's response at length.`).join("\n\n");

describe("extractArticleText", () => {
  it("keeps the article's paragraphs and drops scripts, navigation, captions and short fragments", () => {
    const html = `<html><nav><p>Home | News | Sports and other navigation links</p></nav><script>var x = "<p>not text</p>";</script>
      <article><h1>Headline</h1>${para(1)}<figure><p>Photo caption that is long enough to be mistaken for text</p></figure>${para(2)}<p>Share</p></article>
      <footer><p>Copyright notice and subscription links that are long enough</p></footer></html>`;
    const text = extractArticleText(html);
    expect(text.split("\n\n")).toEqual([
      "Paragraph 1 of the report describes what the court filing says about the university and its response in some detail.",
      "Paragraph 2 of the report describes what the court filing says about the university and its response in some detail.",
    ]);
  });

  it("decodes entities and strips inline markup", () => {
    expect(extractArticleText(`<article><p>The university&rsquo;s <a href="/x">Title&nbsp;IX</a> office said it &ldquo;takes reports seriously&rdquo; &amp; will review.</p></article>`)).toBe(
      "The university’s Title IX office said it “takes reports seriously” & will review.",
    );
  });

  it("falls back to the whole page when there is no <article>", () => {
    expect(extractArticleText(`<main>${para(7)}</main>`)).toContain("Paragraph 7");
  });
});

describe("parseSummaryReply", () => {
  it("reads the JSON reply, including inside a code fence", () => {
    expect(parseSummaryReply('```json\n{"summary": "Reports that a former student sued the university, alleging it mishandled her report.", "caution": null}\n```', "m")).toEqual({
      ok: true,
      summary: "Reports that a former student sued the university, alleging it mishandled her report.",
      caution: null,
      model: "m",
    });
  });

  it("passes the model's caution on to the researcher", () => {
    const r = parseSummaryReply('{"summary": "Reports that police arrested a student in connection with the investigation.", "caution": "The article reports an arrest, not a charge."}', "m");
    expect(r).toMatchObject({ ok: true, caution: "The article reports an arrest, not a charge." });
  });

  it("flags a draft that runs long", () => {
    const long = `Reports that ${"the university ".repeat(20)}announced a review.`;
    expect(parseSummaryReply(JSON.stringify({ summary: long, caution: null }), "m")).toMatchObject({ ok: true, caution: expect.stringContaining("trim it") });
  });

  it("refuses a missing or unusable summary instead of returning something to publish", () => {
    expect(parseSummaryReply('{"summary": null, "caution": "Only a paywall notice was available."}', "m")).toEqual({ ok: false, reason: "Only a paywall notice was available." });
    expect(parseSummaryReply("Sure! Here is a summary:", "m")).toMatchObject({ ok: false });
    expect(parseSummaryReply('{"summary": "Too short"}', "m")).toMatchObject({ ok: false });
  });
});

describe("draftCoverageSummary", () => {
  const reply = (text: string, status = 200): { fetchImpl: FetchLike; calls: { url: string; init: RequestInit }[] } => {
    const calls: { url: string; init: RequestInit }[] = [];
    return {
      calls,
      fetchImpl: async (url, init) => {
        calls.push({ url, init });
        const body =
          status === 200
            ? { output: [{ type: "reasoning", content: [] }, { type: "message", content: [{ type: "output_text", text }] }] }
            : { error: { message: "The model `gpt-5-mini` does not exist or you do not have access to it." } };
        return { ok: status === 200, status, json: async () => body };
      },
    };
  };
  const env = { OPENAI_API_KEY: "test-key" } as unknown as NodeJS.ProcessEnv;

  it("sends the article with the editorial rules and returns the draft", async () => {
    const { fetchImpl, calls } = reply('{"summary": "Reports that a former student sued the university over its response to her report.", "caution": null}');
    const r = await draftCoverageSummary({ title: "Lawsuit filed", publisher: "News", text: longText }, { env, fetchImpl });
    expect(r).toMatchObject({ ok: true, model: SUMMARY_MODEL_DEFAULT });
    expect(calls[0].url).toBe("https://api.openai.com/v1/responses");
    expect((calls[0].init.headers as Record<string, string>).authorization).toBe("Bearer test-key");
    const body = JSON.parse(calls[0].init.body as string);
    expect(body).toMatchObject({ model: SUMMARY_MODEL_DEFAULT, text: { format: { type: "json_object" } }, reasoning: { effort: "low" } });
    for (const rule of ["Never name victims", "an allegation is not a charge", "Do not repeat or paraphrase the headline", "Keep who did what to what", "JSON only"]) {
      expect(body.instructions).toContain(rule);
    }
    expect(body.input).toContain("Headline: Lawsuit filed");
    expect(body.input).toContain("Paragraph 3 of the article");
    expect(body.input).toContain("JSON"); // required in the input by OpenAI's JSON mode
  });

  it("uses the model override when set", async () => {
    const { fetchImpl, calls } = reply('{"summary": "Reports that the university announced a review of its Title IX office.", "caution": null}');
    await draftCoverageSummary({ title: "t", publisher: "p", text: longText }, { env: { ...env, OPENAI_SUMMARY_MODEL: "gpt-4.1-mini" }, fetchImpl });
    const body = JSON.parse(calls[0].init.body as string);
    expect(body.model).toBe("gpt-4.1-mini");
    // Only reasoning models take a reasoning effort.
    expect(body).not.toHaveProperty("reasoning");
  });

  it("does not call the AI without a key, or with too little article text", async () => {
    const { fetchImpl, calls } = reply("{}");
    expect(await draftCoverageSummary({ title: "t", publisher: "p", text: longText }, { env: {} as NodeJS.ProcessEnv, fetchImpl })).toMatchObject({ ok: false, reason: expect.stringContaining("OPENAI_API_KEY") });
    expect(await draftCoverageSummary({ title: "t", publisher: "p", text: "x".repeat(MIN_ARTICLE_CHARS - 1) }, { env, fetchImpl })).toMatchObject({ ok: false, reason: expect.stringContaining("Paste the article text") });
    expect(calls).toHaveLength(0);
  });

  it("reports an AI service error, with OpenAI's explanation, rather than inventing a summary", async () => {
    const { fetchImpl } = reply("", 404);
    const r = await draftCoverageSummary({ title: "t", publisher: "p", text: longText }, { env, fetchImpl });
    expect(r).toMatchObject({ ok: false, reason: expect.stringContaining("HTTP 404: The model `gpt-5-mini` does not exist") });
  });

  it("reads the answer from the message part of a Responses API reply", () => {
    expect(responseText({ output: [{ type: "reasoning" }, { type: "message", content: [{ type: "output_text", text: '{"summary":' }, { type: "output_text", text: ' null}' }] }] })).toBe('{"summary": null}');
    expect(responseText({})).toBe("");
  });
});

describe("article URLs", () => {
  it("fetches only public web pages", () => {
    expect(isFetchableArticleUrl("https://www.nytimes.com/2026/10/01/us/cornell.html")).toBe(true);
    for (const bad of ["file:///etc/passwd", "http://localhost:3000/admin", "http://127.0.0.1/", "http://10.0.0.5/x", "http://192.168.1.1/", "http://169.254.169.254/latest/meta-data", "http://172.16.0.1/", "http://[::1]/", "not a url"]) {
      expect(isFetchableArticleUrl(bad)).toBe(false);
    }
  });
});

describe("summary provenance", () => {
  it("records whether the AI draft was accepted as is or edited, and by whom", () => {
    expect(summaryProvenance({ draft: "Reports that X.", final: "Reports that X.", model: "gpt-5-mini", actor: "Alex" })).toBe(
      "Summary drafted by AI (gpt-5-mini) from the article text; accepted unedited by Alex.",
    );
    expect(summaryProvenance({ draft: "Reports that X.", final: "Reports that Y.", model: "gpt-5-mini", actor: "Alex" })).toContain("edited by Alex");
    expect(summaryProvenance({ draft: null, final: "Mine.", model: null, actor: "Alex" })).toBeNull();
  });
});
