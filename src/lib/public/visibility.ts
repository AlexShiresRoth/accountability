import { and, eq, inArray, ne, sql, type SQL } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";
import { resolveDbTarget } from "@/db/target";
import type { Database } from "@/db/types";
import { PUBLIC_STATUSES, type VerificationStatus } from "@/lib/enums";

export type PublicContext = {
  db: Database;
  /** Exclude development fixtures (is_demo). Always true against the production database. */
  hideDemo: boolean;
  /**
   * Admin preview only: also include draft and pending records (never rejected ones), flagged as unverified.
   * Public pages never set this.
   */
  preview?: boolean;
};

type Reviewable = { status: AnyPgColumn; isDemo: AnyPgColumn };

/** The single gate for public visibility. Every public query applies it to every reviewable table it reads. */
export function isPublic(table: Reviewable, ctx: Pick<PublicContext, "hideDemo" | "preview">): SQL {
  const visible = ctx.preview ? ne(table.status, "rejected") : inArray(table.status, [...PUBLIC_STATUSES]);
  return ctx.hideDemo ? and(visible, eq(table.isDemo, false))! : visible;
}

/** inArray that is safe for empty lists (matches nothing). */
export function inIds(column: AnyPgColumn, ids: string[]): SQL {
  return ids.length ? inArray(column, ids) : sql`false`;
}

export const isUnderReview = (status: VerificationStatus) => status === "needs_update";

/** True only for records that can appear in admin preview but not publicly. */
export const isUnverified = (status: VerificationStatus) => !(PUBLIC_STATUSES as readonly string[]).includes(status);

/** Demo data is always hidden when reading the production database; optionally hidden elsewhere. */
export function shouldHideDemo(env: NodeJS.ProcessEnv = process.env): boolean {
  return resolveDbTarget(env) === "production" || env.HIDE_DEMO_DATA === "true";
}
