import { describe, expect, it } from "vitest";
import { isIndexable, pageMetadata, publisher, serializeJsonLd, shortDescription, siteUrl } from "./seo";

const env = (o: Record<string, string>) => o as unknown as NodeJS.ProcessEnv;

describe("site URL", () => {
  it("prefers an explicit NEXT_PUBLIC_SITE_URL, without a trailing slash", () => {
    expect(siteUrl(env({ NEXT_PUBLIC_SITE_URL: "https://example.org/", VERCEL_ENV: "production", VERCEL_PROJECT_PRODUCTION_URL: "x.vercel.app" }))).toBe(
      "https://example.org",
    );
  });

  it("uses the production domain in production and the deployment URL on previews", () => {
    expect(siteUrl(env({ VERCEL_ENV: "production", VERCEL_PROJECT_PRODUCTION_URL: "site.org", VERCEL_URL: "abc.vercel.app" }))).toBe("https://site.org");
    expect(siteUrl(env({ VERCEL_ENV: "preview", VERCEL_PROJECT_PRODUCTION_URL: "site.org", VERCEL_BRANCH_URL: "branch.vercel.app" }))).toBe(
      "https://branch.vercel.app",
    );
    expect(siteUrl(env({}))).toBe("http://localhost:3000");
  });
});

describe("indexing", () => {
  it("allows indexing only on the production deployment", () => {
    expect(isIndexable(env({ VERCEL_ENV: "production" }))).toBe(true);
    expect(isIndexable(env({ VERCEL_ENV: "preview" }))).toBe(false);
    expect(isIndexable(env({ NODE_ENV: "production" }))).toBe(false);
  });

  it("marks noindex pages without blocking links from them", () => {
    expect(pageMetadata({ title: "t", description: "d", path: "/x", noindex: true }).robots).toEqual({ index: false, follow: true });
    expect(pageMetadata({ title: "t", description: "d", path: "/x" }).robots).toBeUndefined();
  });

  it("sets a canonical URL and complete Open Graph tags", () => {
    const m = pageMetadata({ title: "Cornell", description: "d", path: "/college/cornell", type: "article" });
    expect(m.alternates?.canonical).toBe("/college/cornell");
    expect(m.openGraph).toMatchObject({ siteName: "Campus Accountability", title: "Cornell", url: "/college/cornell", type: "article" });
  });
});

describe("JSON-LD", () => {
  it("cannot close its script tag", () => {
    const out = serializeJsonLd({ "@type": "Thing", name: "</script><script>alert(1)</script>" });
    expect(out).not.toContain("<");
    expect(JSON.parse(out).name).toBe("</script><script>alert(1)</script>");
  });
});

describe("share cards and snippets", () => {
  it("gives every page the site share card and X tags, since a page's openGraph replaces the layout's", () => {
    const m = pageMetadata({ title: "Methodology", description: "How we work.", path: "/methodology" });
    expect(m.openGraph?.images).toEqual([expect.objectContaining({ url: "/opengraph-image", width: 1200, height: 630 })]);
    expect(m.twitter).toMatchObject({ card: "summary_large_image", title: "Methodology", images: [expect.objectContaining({ url: "/opengraph-image" })] });
  });

  it("leaves the image to pages that generate their own share card", () => {
    const m = pageMetadata({ title: "Cornell", description: "d", path: "/college/cornell", ownShareImage: true });
    expect(m.openGraph).not.toHaveProperty("images");
    expect(m.twitter).not.toHaveProperty("images");
  });

  it("can drop the site-name suffix from long titles", () => {
    expect(pageMetadata({ title: "Long case title", description: "d", path: "/case/x", absoluteTitle: true }).title).toEqual({ absolute: "Long case title" });
    expect(pageMetadata({ title: "Sources", description: "d", path: "/sources" }).title).toBe("Sources");
  });

  it("shortens descriptions to what search results show, at a word boundary", () => {
    const long = "In a civil suit filed in September 2026, a former student alleges she was drugged and sexually assaulted at a fraternity house in 2024; the university and several members are named.";
    const short = shortDescription(long);
    expect(short.length).toBeLessThanOrEqual(155);
    expect(short.endsWith("…")).toBe(true);
    expect(long.startsWith(short.slice(0, -1))).toBe(true);
    expect(short).not.toMatch(/\s…$/);
    expect(shortDescription("Short one.")).toBe("Short one.");
    expect(pageMetadata({ title: "t", description: long, path: "/x" }).description).toBe(short);
  });

  it("includes the logo in the organization's structured data", () => {
    expect(publisher()).toMatchObject({ "@type": "Organization", logo: expect.stringMatching(/\/icon-512\.png$/) });
  });
});
