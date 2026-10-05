import { describe, expect, it } from "vitest";
import { resolveDatabaseUrl, resolveDbTarget } from "./target";

const env = (o: Record<string, string>) => o as unknown as NodeJS.ProcessEnv;
const all = {
  DATABASE_URL: "prod-app",
  MIGRATION_DATABASE_URL: "prod-migrate",
  DEV_DATABASE_URL: "dev-app",
  DEV_MIGRATION_DATABASE_URL: "dev-migrate",
};

describe("database target", () => {
  it("uses the development database outside production", () => {
    expect(resolveDatabaseUrl({}, env({ ...all, NODE_ENV: "development" })).url).toBe("dev-app");
    expect(resolveDatabaseUrl({ migration: true }, env({ ...all })).url).toBe("dev-migrate");
  });

  it("uses development for local production builds", () => {
    expect(resolveDatabaseUrl({}, env({ ...all, NODE_ENV: "production" })).url).toBe("dev-app");
  });

  it("uses production on Vercel production deployments or with DB_TARGET=production", () => {
    expect(resolveDatabaseUrl({}, env({ ...all, NODE_ENV: "production", VERCEL_ENV: "production" })).url).toBe("prod-app");
    expect(resolveDatabaseUrl({ migration: true }, env({ ...all, DB_TARGET: "production" })).url).toBe("prod-migrate");
  });

  it("treats Vercel preview deployments as development", () => {
    expect(resolveDbTarget(env({ NODE_ENV: "production", VERCEL_ENV: "preview" }))).toBe("development");
  });

  it("lets DB_TARGET override the environment", () => {
    expect(resolveDbTarget(env({ VERCEL_ENV: "production", DB_TARGET: "development" }))).toBe("development");
  });

  it("never falls back from development to production credentials", () => {
    expect(() => resolveDatabaseUrl({}, env({ DATABASE_URL: "prod-app" }))).toThrow(/DEV_DATABASE_URL/);
  });

  it("falls back to the app URL for migrations within the same target", () => {
    expect(resolveDatabaseUrl({ migration: true }, env({ DEV_DATABASE_URL: "dev-app" })).url).toBe("dev-app");
  });

  it("rejects unknown targets", () => {
    expect(() => resolveDbTarget(env({ DB_TARGET: "staging" }))).toThrow();
  });
});

describe("connection pool size", () => {
  it("uses one short-lived connection per Vercel instance, and a few locally", async () => {
    const { poolDefaults } = await import("./client");
    expect(poolDefaults(env({ VERCEL: "1" }))).toEqual({ max: 1, idle_timeout: 5 });
    expect(poolDefaults(env({}))).toEqual({ max: 4, idle_timeout: 20 });
  });
});
