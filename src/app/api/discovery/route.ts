import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { runDiscovery } from "@/jobs/discovery/run";
import { createLogger } from "@/lib/log";

// Scheduled by vercel.json. A run takes under a minute without GDELT, up to a few minutes with it.
export const maxDuration = 300;

// GDELT has refused connections from Vercel and rate-limited every request elsewhere since late September 2026,
// so scheduled runs skip it unless DISCOVERY_GDELT=on. Google News covers the same outlets.
const gdeltEnabled = () => process.env.DISCOVERY_GDELT === "on";

export async function GET(req: NextRequest) {
  const log = createLogger("discovery", { trigger: "cron" });
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || req.headers.get("Authorization") !== `Bearer ${cronSecret}`) {
    log("warn", "request.unauthorized", { reason: cronSecret ? "bad or missing Authorization header" : "CRON_SECRET is not set" });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runDiscovery({ db, triggeredBy: "cron", log, sources: { gdelt: gdeltEnabled() } });
    return NextResponse.json({ ok: result.outcome === "ok", ...result });
  } catch (err) {
    // runDiscovery has already logged the failure and recorded it on the run.
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
