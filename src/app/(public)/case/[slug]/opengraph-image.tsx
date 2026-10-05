import { notFound } from "next/navigation";
import { ogCard, ogSize } from "@/lib/og-card";
import { getCase } from "@/lib/public";

export const revalidate = 3600;
export function generateStaticParams() {
  return [];
}
export const alt = "Case record: a documented, sourced timeline";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const detail = await getCase((await params).slug);
  if (!detail) notFound();
  return ogCard({
    eyebrow: "Case record",
    title: detail.case.title,
    subtitle: detail.colleges.map((c) => c.name).join(" · ") || undefined,
  });
}
