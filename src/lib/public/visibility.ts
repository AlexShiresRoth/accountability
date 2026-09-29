import { and, eq, inArray, sql, type SQL } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";
import type { Database } from "@/db/types";
import { PUBLIC_STATUSES, type VerificationStatus } from "@/lib/enums";

export type PublicContext = {
  db: Database;
  /** Exclude development fixtures (is_demo). Always true in production. */
  hideDemo: boolean;
};

type Reviewable = { status: AnyPgColumn; isDemo: AnyPgColumn };

/** The single gate for public visibility. Every public query applies it to every reviewable table it reads. */
export function isPublic(table: Reviewable, ctx: Pick<PublicContext, "hideDemo">): SQL {
  const visible = inArray(table.status, [...PUBLIC_STATUSES]);
  return ctx.hideDemo ? and(visible, eq(table.isDemo, false))! : visible;
}

/** inArray that is safe for empty lists (matches nothing). */
export function inIds(column: AnyPgColumn, ids: string[]): SQL {
  return ids.length ? inArray(column, ids) : sql`false`;
}

export const isUnderReview = (status: VerificationStatus) => status === "needs_update";

export function shouldHideDemo(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.NODE_ENV === "production" || env.HIDE_DEMO_DATA === "true";
}
