import { describe, expect, it } from "vitest";
import { isIndexable, pageMetadata, serializeJsonLd, siteUrl } from "./seo";

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
