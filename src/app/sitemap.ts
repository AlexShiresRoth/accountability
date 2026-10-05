import type { MetadataRoute } from "next";
import { lessons } from "@/content/lessons";
import { listSitemapEntries } from "@/lib/public";
import { siteUrl } from "@/lib/seo";

// Regenerated hourly, like the pages it lists.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const { colleges, cases } = await listSitemapEntries();
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    ...colleges.map((c) => ({ url: `${base}/college/${c.slug}`, lastModified: c.updatedAt, changeFrequency: "weekly" as const, priority: 0.9 })),
    ...cases.map((c) => ({ url: `${base}/case/${c.slug}`, lastModified: c.updatedAt, changeFrequency: "weekly" as const, priority: 0.7 })),
    { url: `${base}/methodology`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/sources`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${base}/roadmap`, changeFrequency: "weekly", priority: 0.4 },
    // Lessons are listed only once they've completed editorial review.
    ...(lessons.some((l) => l.status === "reviewed") ? [{ url: `${base}/learn`, changeFrequency: "monthly" as const, priority: 0.5 }] : []),
    ...lessons
      .filter((l) => l.status === "reviewed")
      .map((l) => ({ url: `${base}/learn/${l.slug}`, changeFrequency: "monthly" as const, priority: 0.4 })),
  ];
}
