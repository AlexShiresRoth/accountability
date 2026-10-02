import { describe, expect, it } from "vitest";
import { splitLinks } from "./linkify";

describe("splitLinks", () => {
  it("links a URL and leaves the sentence's full stop outside it", () => {
    expect(
      splitLinks("made to the University in 2025 see https://officeofcivilrights.cornell.edu/data-statistics/."),
    ).toEqual([
      { type: "text", value: "made to the University in 2025 see " },
      { type: "link", value: "https://officeofcivilrights.cornell.edu/data-statistics/", href: "https://officeofcivilrights.cornell.edu/data-statistics/" },
      { type: "text", value: "." },
    ]);
  });

  it("handles several URLs, query strings, and trailing punctuation", () => {
    const segs = splitLinks("See https://a.edu/x?y=1&z=2, then (https://b.org/page) and http://c.gov!");
    expect(segs.filter((s) => s.type === "link").map((s) => s.value)).toEqual(["https://a.edu/x?y=1&z=2", "https://b.org/page", "http://c.gov"]);
    expect(segs.map((s) => s.value).join("")).toBe("See https://a.edu/x?y=1&z=2, then (https://b.org/page) and http://c.gov!");
  });

  it("keeps balanced brackets that belong to the URL", () => {
    const [, link] = splitLinks("See https://en.wikipedia.org/wiki/Clery_Act_(1990) now");
    expect(link).toMatchObject({ type: "link", value: "https://en.wikipedia.org/wiki/Clery_Act_(1990)" });
  });

  it("never links other schemes or text that only looks like a URL", () => {
    for (const t of ["javascript:alert(1)", "see www.cornell.edu", "mailto:x@y.edu", "ftp://files.example.org", "http://", "plain text"]) {
      expect(splitLinks(t).some((s) => s.type === "link"), t).toBe(false);
    }
  });

  it("returns the original text unchanged when joined back", () => {
    const t = "Policy at https://x.edu/policy; data: https://x.edu/data.";
    expect(splitLinks(t).map((s) => s.value).join("")).toBe(t);
  });
});
