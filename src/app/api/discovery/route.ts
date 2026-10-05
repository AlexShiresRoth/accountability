import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { runDiscovery } from "@/jobs/discovery/run";
import { createLogger } from "@/lib/log";

// Scheduled by vercel.json. GDELT's rate limit makes a full run take up to a couple of minutes.
export const maxDuration = 300;

export async function GET(req: NextRequest) {
  const log = createLogger("discovery", { trigger: "cron" });
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || req.headers.get("Authorization") !== `Bearer ${cronSecret}`) {
    log("warn", "request.unauthorized", { reason: cronSecret ? "bad or missing Authorization header" : "CRON_SECRET is not set" });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runDiscovery({ db, triggeredBy: "cron", log });
    return NextResponse.json({ ok: result.outcome === "ok", ...result });
  } catch (err) {
    // runDiscovery has already logged the failure and recorded it on the run.
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
