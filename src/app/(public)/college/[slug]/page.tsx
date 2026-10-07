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
    title: `${name}: Sexual Assault Reports & Title IX Response`,
    absoluteTitle: true,
    ownShareImage: true,
    description: `Reported rape, fondling, dating violence and stalking at ${name}, from its Clery reports, with Title IX response and support resources. Every figure sourced.`,
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
