ALTER TABLE "ingestion_run" ADD COLUMN "triggered_by" text DEFAULT 'cli' NOT NULL;--> statement-breakpoint
ALTER TABLE "ingestion_run" ADD COLUMN "outcome" text DEFAULT 'running' NOT NULL;--> statement-breakpoint
ALTER TABLE "ingestion_run" ADD COLUMN "duration_ms" integer;--> statement-breakpoint
ALTER TABLE "ingestion_run" ADD COLUMN "summary" jsonb;--> statement-breakpoint
-- Runs recorded before this migration: finished runs are "ok" or "partial"; unfinished ones never completed.
UPDATE "ingestion_run" SET "outcome" = CASE
  WHEN "finished_at" IS NULL THEN 'failed'
  WHEN "error" IS NOT NULL THEN 'partial'
  ELSE 'ok'
END, "duration_ms" = (EXTRACT(EPOCH FROM ("finished_at" - "started_at")) * 1000)::integer;
