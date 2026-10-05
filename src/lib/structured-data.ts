import type { CaseDetail, CollegeProfile } from "@/lib/public";
import { offenseLabels } from "./labels";
import { absoluteUrl, breadcrumbs, publisher, siteUrl, type JsonLdObject } from "./seo";
import { site } from "./site";

// schema.org descriptions of public pages. Built only from published data on the page itself,
// so structured data never says more than the page does.

export function homeStructuredData(): JsonLdObject[] {
  return [
    { "@context": "https://schema.org", "@type": "WebSite", name: site.name, description: site.description, url: siteUrl() },
    { "@context": "https://schema.org", ...publisher(), description: site.description },
  ];
}

function collegeEntity(college: CollegeProfile["college"]) {
  const locality = [college.city, college.state].filter(Boolean);
  return {
    "@type": "CollegeOrUniversity",
    name: college.name,
    ...(locality.length && {
      address: {
        "@type": "PostalAddress",
        ...(college.city && { addressLocality: college.city }),
        ...(college.state && { addressRegion: college.state }),
        addressCountry: "US",
      },
    }),
  };
}

const listFormat = new Intl.ListFormat("en", { type: "conjunction" });

/** Breadcrumbs, plus a Dataset for the Clery statistics when the profile publishes any. */
export function collegeStructuredData(profile: CollegeProfile): JsonLdObject[] {
  const { college, statistics, reports } = profile;
  const path = `/college/${college.slug}`;
  const data: JsonLdObject[] = [
    breadcrumbs([
      { name: "Universities", path: "/" },
      { name: college.name, path },
    ]),
  ];
  if (!statistics.length) return data;

  const years = statistics.map((s) => s.calendarYear);
  const [first, last] = [Math.min(...years), Math.max(...years)];
  const span = first === last ? `${first}` : `${first}–${last}`;
  const reported = new Set(statistics.map((s) => s.offense));
  const offenses = (Object.keys(offenseLabels) as (keyof typeof offenseLabels)[]).filter((o) => reported.has(o)).map((o) => offenseLabels[o]);

  data.push({
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${college.name}: Clery Act crime statistics for sexual and gender-based violence, ${span}`,
    description:
      `Counts of ${listFormat.format(offenses).toLowerCase()} reported to ${college.name} for calendar years ${span}, ` +
      `transcribed from the university's Annual Security Reports, by Clery geography and with the university's own footnotes. ` +
      `These are reported incidents, not a measure of prevalence.`,
    url: absoluteUrl(path),
    creator: publisher(),
    isAccessibleForFree: true,
    temporalCoverage: `${first}/${last}`,
    spatialCoverage: { "@type": "Place", name: college.name },
    about: collegeEntity(college),
    variableMeasured: offenses,
    isBasedOn: reports.map((r) => ({
      "@type": "CreativeWork",
      name: r.title,
      ...(r.source.url && { url: r.source.url }),
      publisher: { "@type": "Organization", name: r.source.publisher },
    })),
    ...(college.lastReviewedAt && { dateModified: college.lastReviewedAt }),
  });
  return data;
}

/** Breadcrumbs only. A case page describes a legal process; it makes no structured claims about it. */
export function caseStructuredData(detail: CaseDetail): JsonLdObject[] {
  const college = detail.colleges[0];
  return [
    breadcrumbs([
      { name: "Universities", path: "/" },
      ...(college ? [{ name: college.name, path: `/college/${college.slug}` }] : []),
      { name: detail.case.title, path: `/case/${detail.case.slug}` },
    ]),
  ];
}
