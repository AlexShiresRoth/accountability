import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CasesSection,
  CoverageSection,
  ProfileFacts,
  ResourcesSection,
  ResponseSection,
  StatisticsSection,
  TimelineSection,
} from "@/components/college/sections";
import { Container } from "@/components/container";
import { CorrectionsBanner } from "@/components/corrections";
import { DemoNotice } from "@/components/notice";
import { UnderReviewTag } from "@/components/tags";
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

const sections = [
  ["statistics", "Reported incidents"],
  ["response", "Institutional response"],
  ["resources", "Reporting and support"],
  ["timeline", "Timeline"],
  ["cases", "Cases"],
  ["coverage", "Coverage"],
] as const;

export default async function CollegePage({ params }: PageProps<"/college/[slug]">) {
  const profile = await getCollegeProfile((await params).slug);
  if (!profile) notFound();
  const { college } = profile;

  return (
    <>
      <div className="border-b border-rule">
        <Container className="py-10 sm:py-14">
          {college.isDemo && (
            <div className="mb-6">
              <DemoNotice />
            </div>
          )}
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-ink-muted">University profile</p>
          <h1 className="text-3xl sm:text-5xl">
            {college.name} {college.underReview && <UnderReviewTag />}
          </h1>
          <ProfileFacts profile={profile} />
        </Container>
      </div>

      <nav aria-label="Profile sections" className="sticky top-0 z-10 border-b border-rule bg-paper/95 backdrop-blur">
        <Container>
          <ul className="-mx-1 flex gap-1 overflow-x-auto py-2 text-[0.95rem] whitespace-nowrap">
            {sections.map(([id, label]) => (
              <li key={id} className="shrink-0">
                <a href={`#${id}`} className="block px-2 py-1 text-ink-muted no-underline hover:text-ink hover:underline">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </nav>

      <Container className="space-y-20 py-12">
        <CorrectionsBanner corrections={profile.corrections} citations={profile.citations} />
        <StatisticsSection profile={profile} />
        <ResponseSection profile={profile} />
        <ResourcesSection profile={profile} />
        <TimelineSection profile={profile} />
        <CasesSection profile={profile} />
        <CoverageSection profile={profile} />
      </Container>
    </>
  );
}
