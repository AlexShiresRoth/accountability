import "server-only";
import { cache } from "react";
import { db } from "@/db";
import { listColleges, sourceCollegeLinks } from "@/lib/admin/queries";
import { scopeForColleges, type SourceOption, type SourceScope } from "@/lib/source-search";

// Loaded once per request, however many source pickers a page renders.
const cachedLinks = cache(() => sourceCollegeLinks(db));
const cachedColleges = cache(() => listColleges(db));

/** Scope for a source picker on a college's records; undefined when the record belongs to no college. */
export async function sourceScopeFor(collegeIds: string[], sources: SourceOption[]): Promise<SourceScope | undefined> {
  if (!collegeIds.length) return undefined;
  const [links, colleges] = await Promise.all([cachedLinks(), cachedColleges()]);
  const names = colleges.filter((c) => collegeIds.includes(c.id)).map((c) => c.name);
  return {
    label: names.length === 1 ? names[0] : names.length > 1 ? "These universities" : "This university",
    ...scopeForColleges(links, collegeIds, sources.map((s) => s.id)),
  };
}
