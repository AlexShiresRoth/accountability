import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollegeProfileView } from "@/components/college/profile-view";
import { getCollegeProfile } from "@/lib/public";

// Rendered on first request, then cached. Publishing in the admin revalidates immediately.
export const revalidate = 3600;
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps<"/college/[slug]">): Promise<Metadata> {
  const profile = await getCollegeProfile((await params).slug);
  if (!profile) return {};
  const name = profile.college.name;
  return {
    title: `${name}: sexual assault statistics, Title IX reporting and resources`,
    description: `Clery Act statistics for rape, fondling, dating violence, domestic violence, and stalking at ${name}, with source footnotes, institutional response, and student reporting resources.`,
    alternates: { canonical: `/college/${profile.college.slug}` },
    robots: profile.college.isDemo ? { index: false } : undefined,
  };
}

export default async function CollegePage({ params }: PageProps<"/college/[slug]">) {
  const profile = await getCollegeProfile((await params).slug);
  if (!profile) notFound();
  return <CollegeProfileView profile={profile} />;
}
