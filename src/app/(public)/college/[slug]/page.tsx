import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollegeProfileView } from "@/components/college/profile-view";
import { JsonLd } from "@/components/json-ld";
import { getCollegeProfile } from "@/lib/public";
import { pageMetadata } from "@/lib/seo";
import { collegeStructuredData } from "@/lib/structured-data";

// Rendered on first request, then cached. Publishing in the admin revalidates immediately.
export const revalidate = 3600;
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps<"/college/[slug]">): Promise<Metadata> {
  const profile = await getCollegeProfile((await params).slug);
  if (!profile) return {};
  const name = profile.college.name;
  return pageMetadata({
    title: `${name}: sexual assault statistics, Title IX reporting and resources`,
    description: `Clery Act statistics for rape, fondling, dating violence, domestic violence, and stalking at ${name}, with source footnotes, institutional response, and student reporting resources.`,
    path: `/college/${profile.college.slug}`,
    noindex: profile.college.isDemo,
  });
}

export default async function CollegePage({ params }: PageProps<"/college/[slug]">) {
  const profile = await getCollegeProfile((await params).slug);
  if (!profile) notFound();
  return (
    <>
      {!profile.college.isDemo && <JsonLd data={collegeStructuredData(profile)} />}
      <CollegeProfileView profile={profile} />
    </>
  );
}
