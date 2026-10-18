import { describe, expect, it } from "vitest";
import {
  batchRequestBody,
  googleNewsArticleId,
  parseBatchReply,
  parseDecodingParams,
  resolveGoogleNewsUrl,
  type ResolveFetch,
} from "./google-news-resolve";

const LINK = "https://news.google.com/rss/articles/CBMiABC_def-123?oc=5";
const PAGE = '<c-wiz><div jscontroller="x" data-n-a-id="CBMiABC_def-123" data-n-a-ts="1792336402" data-n-a-sg="AZ5r3eSIG"></div></c-wiz>';
// A reply as captured from Google on 2026-10-18 (publisher URL swapped for an example).
const REPLY = `)]}'\n\n[["wrb.fr","Fbv4je","[\\"garturlres\\",\\"https://news.example/2026/10/12/story\\",1]",null,null,null,"generic"],["di",28],["af.httprm",27,"-6205257027896050011",37]]`;

describe("Google News link resolution", () => {
  it("reads the article id only from Google News links", () => {
    expect(googleNewsArticleId(LINK)).toBe("CBMiABC_def-123");
    expect(googleNewsArticleId("https://news.example/articles/CBMi")).toBeNull();
  });

  it("parses the signature and timestamp from the article page", () => {
    expect(parseDecodingParams(PAGE)).toEqual({ signature: "AZ5r3eSIG", timestamp: "1792336402" });
    expect(parseDecodingParams("<html>consent wall</html>")).toBeNull();
  });

  it("builds the request Google's web client sends", () => {
    const req = JSON.parse(new URLSearchParams(batchRequestBody("ID", { signature: "SIG", timestamp: "42" })).get("f.req")!);
    expect(req[0][0][0]).toBe("Fbv4je");
    expect(JSON.parse(req[0][0][1]).slice(2)).toEqual(["ID", 42, "SIG"]);
  });

  it("parses the publisher URL from the reply, and rejects anything else", () => {
    expect(parseBatchReply(REPLY)).toBe("https://news.example/2026/10/12/story");
    expect(parseBatchReply(`)]}'\n\n[["wrb.fr","Fbv4je",null,null,null,[3],"generic"]]`)).toBeNull();
    expect(parseBatchReply(REPLY.replace("https://news.example/2026/10/12/story", "https://news.google.com/x"))).toBeNull();
  });

  it("resolves in two requests, and returns null on any failure", async () => {
    const calls: string[] = [];
    const ok: ResolveFetch = async (url) => {
      calls.push(url);
      return { ok: true, status: 200, text: async () => (url.includes("batchexecute") ? REPLY : PAGE) };
    };
    expect(await resolveGoogleNewsUrl(LINK, ok)).toBe("https://news.example/2026/10/12/story");
    expect(calls).toEqual(["https://news.google.com/rss/articles/CBMiABC_def-123", "https://news.google.com/_/DotsSplashUi/data/batchexecute"]);

    const blocked: ResolveFetch = async () => ({ ok: false, status: 429, text: async () => "" });
    const throws: ResolveFetch = async () => {
      throw new Error("network");
    };
    expect(await resolveGoogleNewsUrl(LINK, blocked)).toBeNull();
    expect(await resolveGoogleNewsUrl(LINK, throws)).toBeNull();
    expect(await resolveGoogleNewsUrl("https://news.example/story", ok)).toBeNull();
  });
});
