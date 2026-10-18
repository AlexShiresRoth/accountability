CREATE TYPE "public"."triage_verdict" AS ENUM('relevant', 'irrelevant', 'unsure');--> statement-breakpoint
ALTER TABLE "candidate_item" ADD COLUMN "resolved_url" text;--> statement-breakpoint
ALTER TABLE "candidate_item" ADD COLUMN "ai_verdict" "triage_verdict";--> statement-breakpoint
ALTER TABLE "candidate_item" ADD COLUMN "ai_reason" text;--> statement-breakpoint
ALTER TABLE "candidate_item" ADD COLUMN "ai_model" text;--> statement-breakpoint
ALTER TABLE "candidate_item" ADD COLUMN "ai_triaged_at" timestamp with time zone;