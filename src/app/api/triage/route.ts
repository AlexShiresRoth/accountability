import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { triageInbox } from "@/lib/admin/triage";
import { createLogger } from "@/lib/log";

// Scheduled by vercel.json half an hour after discovery. Off unless INBOX_TRIAGE=on: turn it on only after
// `pnpm triage --evaluate` shows the model agrees with researchers' own decisions.
export const maxDuration = 300;

export async function GET(req: NextRequest) {
  const log = createLogger("triage", { trigger: "cron" });
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || req.headers.get("Authorization") !== `Bearer ${cronSecret}`) {
    log("warn", "request.unauthorized", { reason: cronSecret ? "bad or missing Authorization header" : "CRON_SECRET is not set" });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (process.env.INBOX_TRIAGE !== "on" || !process.env.OPENAI_API_KEY) {
    return NextResponse.json({ ok: true, skipped: "Set INBOX_TRIAGE=on and OPENAI_API_KEY to triage on a schedule." });
  }

  try {
    const report = await triageInbox(db, { limit: 80, budgetMs: 240_000 }, { log });
    const summary = { triaged: report.items.length, dismissed: report.dismissed, failed: report.failed, remaining: report.remaining, model: report.model };
    log("info", "triage.finished", summary);
    return NextResponse.json({ ok: true, ...summary });
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    log("error", "triage.error", { error });
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }
}
