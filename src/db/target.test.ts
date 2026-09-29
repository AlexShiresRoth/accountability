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

  it("uses production when NODE_ENV=production or DB_TARGET=production", () => {
    expect(resolveDatabaseUrl({}, env({ ...all, NODE_ENV: "production" })).url).toBe("prod-app");
    expect(resolveDatabaseUrl({ migration: true }, env({ ...all, DB_TARGET: "production" })).url).toBe("prod-migrate");
  });

  it("lets DB_TARGET=development override a production build", () => {
    expect(resolveDbTarget(env({ NODE_ENV: "production", DB_TARGET: "development" }))).toBe("development");
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
