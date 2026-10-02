import { Container } from "@/components/container";
import { CorrectionsBanner } from "@/components/corrections";
import { DemoNotice } from "@/components/notice";
import { StatusTags } from "@/components/tags";
import type { CollegeProfile } from "@/lib/public";
import {
  CasesSection,
  CoverageSection,
  ProfileFacts,
  ResourcesSection,
  ResponseSection,
  StatisticsSection,
  TimelineSection,
} from "./sections";

const sections = [
  ["statistics", "Reported incidents"],
  ["response", "Institutional response"],
  ["resources", "Reporting and support"],
  ["timeline", "Timeline"],
  ["cases", "Cases"],
  ["coverage", "Coverage"],
] as const;

/** The college profile body. Shared by the public page and the admin preview so they can't drift apart. */
export function CollegeProfileView({ profile, stickyTop = "top-0" }: { profile: CollegeProfile; stickyTop?: string }) {
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
            {college.name} <StatusTags item={college} />
          </h1>
          <ProfileFacts profile={profile} />
        </Container>
      </div>

      <nav aria-label="Profile sections" className={`sticky ${stickyTop} z-10 border-b border-rule bg-paper/95 backdrop-blur`}>
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
