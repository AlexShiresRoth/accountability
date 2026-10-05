import { notFound } from "next/navigation";
import { ogCard, ogSize } from "@/lib/og-card";
import { getCollegeProfile } from "@/lib/public";

export const revalidate = 3600;
export function generateStaticParams() {
  return [];
}
export const alt = "University profile: reported incidents, institutional response and student resources";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const profile = await getCollegeProfile((await params).slug);
  if (!profile) notFound();
  const years = profile.statistics.map((s) => s.calendarYear);
  const span = years.length ? ` · ${Math.min(...years)}–${Math.max(...years)}` : "";
  return ogCard({
    eyebrow: `University profile${span}`,
    title: profile.college.name,
    subtitle: "Reported incidents, institutional response, and reporting and support resources.",
  });
}
