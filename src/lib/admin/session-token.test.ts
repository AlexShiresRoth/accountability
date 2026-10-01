import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";
import {
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  adminPasswordProblem,
  createSessionToken,
  passwordMatches,
  verifySessionToken,
} from "./session-token";

const secret = "s".repeat(64);

describe("session tokens", () => {
  it("round-trips a valid token", () => {
    expect(verifySessionToken(createSessionToken("Alex", secret), secret)?.name).toBe("Alex");
  });

  it("rejects tampered payloads and signatures", () => {
    const token = createSessionToken("Alex", secret);
    const [data, sig] = token.split(".");
    const forged = Buffer.from(JSON.stringify({ name: "Mallory", exp: 9999999999 })).toString("base64url");
    expect(verifySessionToken(`${forged}.${sig}`, secret)).toBeNull();
    expect(verifySessionToken(`${data}.${sig.slice(0, -2)}AA`, secret)).toBeNull();
    expect(verifySessionToken(`${token}.extra`, secret)).toBeNull();
    expect(verifySessionToken("garbage", secret)).toBeNull();
  });

  it("rejects tokens signed with another secret, or when the secret is missing or short", () => {
    const token = createSessionToken("Alex", secret);
    expect(verifySessionToken(token, "t".repeat(64))).toBeNull();
    expect(verifySessionToken(token, undefined)).toBeNull();
    expect(verifySessionToken(token, "short")).toBeNull();
    expect(() => createSessionToken("Alex", "short")).toThrow();
  });

  it("expires", () => {
    const now = Date.now();
    const token = createSessionToken("Alex", secret, now);
    expect(verifySessionToken(token, secret, now + (SESSION_TTL_SECONDS - 60) * 1000)).not.toBeNull();
    expect(verifySessionToken(token, secret, now + (SESSION_TTL_SECONDS + 1) * 1000)).toBeNull();
  });
});

describe("passwords", () => {
  it("compares exactly", () => {
    expect(passwordMatches("correct horse battery", "correct horse battery")).toBe(true);
    expect(passwordMatches("correct horse batter", "correct horse battery")).toBe(false);
    expect(passwordMatches("anything", undefined)).toBe(false);
  });

  it("refuses placeholder or short admin passwords", () => {
    expect(adminPasswordProblem(undefined)).toMatch(/not set/);
    expect(adminPasswordProblem("change-me")).toMatch(/12 characters/);
    expect(adminPasswordProblem("short")).toMatch(/12 characters/);
    expect(adminPasswordProblem("a-long-enough-password")).toBeNull();
  });
});

describe("proxy", () => {
  const request = (path: string, token?: string) => {
    const req = new NextRequest(`http://localhost${path}`);
    if (token) req.cookies.set(SESSION_COOKIE, token);
    return req;
  };

  it("redirects admin requests without a valid session to login", () => {
    process.env.ADMIN_SESSION_SECRET = secret;
    for (const path of ["/admin", "/admin/inbox", "/admin/reports/123"]) {
      const res = proxy(request(path));
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toBe("http://localhost/admin/login");
    }
    expect(proxy(request("/admin", "forged.token")).status).toBe(307);
  });

  it("lets the login page through and marks admin responses private and noindex", () => {
    process.env.ADMIN_SESSION_SECRET = secret;
    expect(proxy(request("/admin/login")).status).toBe(200);
    const res = proxy(request("/admin", createSessionToken("Alex", secret)));
    expect(res.status).toBe(200);
    expect(res.headers.get("x-robots-tag")).toBe("noindex, nofollow");
    expect(res.headers.get("cache-control")).toBe("private, no-store");
  });
});
