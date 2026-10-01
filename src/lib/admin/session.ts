import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySessionToken, type SessionPayload } from "./session-token";

export type Researcher = { name: string };

export async function getResearcher(): Promise<Researcher | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const session: SessionPayload | null = verifySessionToken(token, process.env.ADMIN_SESSION_SECRET);
  return session ? { name: session.name } : null;
}

/** For pages: redirect to login. */
export async function requireResearcherPage(): Promise<Researcher> {
  const researcher = await getResearcher();
  if (!researcher) redirect("/admin/login");
  return researcher;
}

/** For server actions: each action is its own entry point and must check the session itself. */
export async function requireResearcher(): Promise<Researcher> {
  const researcher = await getResearcher();
  if (!researcher) throw new Error("Unauthorized");
  return researcher;
}
