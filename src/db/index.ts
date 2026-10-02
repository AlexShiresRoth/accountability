import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import { createPgClient } from "./client";
import { resolveDatabaseUrl } from "./target";

const { url } = resolveDatabaseUrl();

// Reuse the client across hot reloads in development.
const globalForDb = globalThis as unknown as { pgClient?: ReturnType<typeof createPgClient> };
const client = globalForDb.pgClient ?? createPgClient(url);
if (process.env.NODE_ENV !== "production") globalForDb.pgClient = client;

export const db = drizzle(client, { schema });
