// AI triage of the inbox from the command line: for the backlog, and to check the model before trusting it.
// Usage: pnpm triage [--limit 50] [--dry-run]     classify new items; dismiss irrelevant ones (not with --dry-run)
//        pnpm triage --evaluate [--limit 40]     compare the model with items researchers already triaged; writes nothing
// Development database by default. Production needs both DB_TARGET=production and --production:
//   DB_TARGET=production pnpm triage --production --evaluate
// Never accepts or verifies anything. Needs OPENAI_API_KEY.
import { drizzle } from "drizzle-orm/postgres-js";
import { createPgClient } from "../src/db/client";
import * as s from "../src/db/schema";
import { resolveDatabaseUrl } from "../src/db/target";
import type { Database } from "../src/db/types";
import { evaluateTriage, triageInbox } from "../src/lib/admin/triage";

const arg = (name: string) => {
  const i = process.argv.indexOf(name);
  return i > -1 ? process.argv[i + 1] : undefined;
};
const flag = (name: string) => process.argv.includes(name);
const short = (t: string | null, n = 90) => (!t ? "(no headline)" : t.length > n ? `${t.slice(0, n - 1)}…` : t);

async function main() {
  const production = flag("--production");
  const { target, variable, url } = resolveDatabaseUrl({ migration: true });
  if (target === "production" && !production) throw new Error("DB_TARGET is production: pass --production to confirm.");
  if (production && target !== "production") throw new Error("--production also requires DB_TARGET=production.");
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not set.");

  const limit = Number(arg("--limit") ?? (flag("--evaluate") ? 40 : 50));
  const client = createPgClient(url, { max: 1 });
  const db = drizzle(client, { schema: s }) as unknown as Database;
  try {
    if (flag("--evaluate")) {
      console.log(`Evaluating AI triage against researcher decisions → ${target} database (${variable}); nothing is written.\n`);
      const { rows, missed, summary } = await evaluateTriage(db, { limit });
      for (const r of rows) console.log(`${r.human.padEnd(9)} → ${(r.verdict ?? "failed").padEnd(10)} ${short(r.title)}\n${" ".repeat(23)}${r.reason}`);
      console.log("\nYou accepted:", summary.accepted, "\nYou dismissed:", summary.dismissed);
      console.log(
        missed.length
          ? `\n${missed.length} item(s) you accepted would have been dismissed. Read them before trusting automatic dismissal:\n- ${missed.map((m) => short(m.title)).join("\n- ")}`
          : "\nNo item you accepted would have been dismissed.",
      );
      return;
    }

    const dryRun = flag("--dry-run");
    console.log(`AI triage → ${target} database (${variable}), up to ${limit} new items${dryRun ? ", dry run (nothing is written)" : ""}.\n`);
    const report = await triageInbox(db, { limit, dryRun });
    for (const i of report.items) {
      const action = i.dismissed ? (dryRun ? "would dismiss" : "dismissed") : i.verdict ? `keep${i.kept ? ` (${i.kept})` : ""}` : "failed";
      console.log(`${(i.verdict ?? "—").padEnd(10)} ${action.padEnd(32)} ${short(i.title)}\n${" ".repeat(11)}${i.reason}${i.resolvedUrl ? `\n${" ".repeat(11)}→ ${i.resolvedUrl}` : ""}`);
    }
    const resolved = report.items.filter((i) => i.resolvedUrl).length;
    console.log(
      `\n${report.items.length} triaged with ${report.model ?? "no model"}: ${report.dismissed} ${dryRun ? "would be " : ""}dismissed, ` +
        `${report.failed} failed, ${resolved} with a publisher URL.${report.remaining ? " More items are waiting." : ""}`,
    );
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
