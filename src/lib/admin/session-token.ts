// Admin session tokens: base64url(JSON payload) + "." + base64url(HMAC-SHA256).
// Pure functions (no Next.js imports) so they can be used by proxy.ts, server code, and tests.
import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "admin_session";
export const SESSION_TTL_SECONDS = 12 * 60 * 60;

export type SessionPayload = { name: string; exp: number };

const b64 = (buf: Buffer) => buf.toString("base64url");
const sign = (data: string, secret: string) => createHmac("sha256", secret).update(data).digest();

export function createSessionToken(name: string, secret: string, now = Date.now()): string {
  assertSecret(secret);
  const payload: SessionPayload = { name, exp: Math.floor(now / 1000) + SESSION_TTL_SECONDS };
  const data = b64(Buffer.from(JSON.stringify(payload)));
  return `${data}.${b64(sign(data, secret))}`;
}

/** Returns the payload for a valid, unexpired token; otherwise null. */
export function verifySessionToken(token: string | undefined, secret: string | undefined, now = Date.now()): SessionPayload | null {
  if (!token || !secret || secret.length < 32) return null;
  const [data, signature, extra] = token.split(".");
  if (!data || !signature || extra !== undefined) return null;

  const expected = sign(data, secret);
  const given = Buffer.from(signature, "base64url");
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;

  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as SessionPayload;
    if (typeof payload.name !== "string" || !payload.name.trim() || typeof payload.exp !== "number") return null;
    return payload.exp * 1000 > now ? payload : null;
  } catch {
    return null;
  }
}

/** Constant-time password comparison (hashing first makes lengths equal). */
export function passwordMatches(given: string, expected: string | undefined): boolean {
  if (!expected) return false;
  const a = createHmac("sha256", "pw").update(given).digest();
  const b = createHmac("sha256", "pw").update(expected).digest();
  return timingSafeEqual(a, b);
}

/** Refuse to run the admin with a placeholder or short password. */
export function adminPasswordProblem(password: string | undefined): string | null {
  if (!password) return "ADMIN_PASSWORD is not set.";
  if (password === "change-me" || password.length < 12) return "ADMIN_PASSWORD must be at least 12 characters and not the placeholder.";
  return null;
}

function assertSecret(secret: string) {
  if (!secret || secret.length < 32) throw new Error("ADMIN_SESSION_SECRET must be at least 32 characters.");
}
