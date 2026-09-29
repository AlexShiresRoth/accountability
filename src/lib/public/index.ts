// Entry point for public pages. Binds the public queries to the app database.
// React's cache() dedupes identical calls within one request (e.g. generateMetadata + page).
import { cache } from "react";
import { db } from "@/db";
import * as q from "./queries";
import { shouldHideDemo, type PublicContext } from "./visibility";

const ctx = (): PublicContext => ({ db, hideDemo: shouldHideDemo() });

export const searchColleges = cache((query?: string) => q.searchColleges(ctx(), query));
export const getCollegeProfile = cache((slug: string) => q.getCollegeProfile(ctx(), slug));
export const getCase = cache((slug: string) => q.getCase(ctx(), slug));
export const listPublicSources = cache(() => q.listPublicSources(ctx()));

export { citationKey } from "./queries";
export type * from "./queries";
