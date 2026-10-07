ALTER TABLE "candidate_item" ADD COLUMN "case_id" uuid;--> statement-breakpoint
ALTER TABLE "case" ADD COLUMN "search_terms" text[] DEFAULT '{}'::text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "case" ADD COLUMN "last_checked_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "case" ADD COLUMN "next_check_on" date;--> statement-breakpoint
ALTER TABLE "case" ADD COLUMN "check_notes" text;--> statement-breakpoint
ALTER TABLE "candidate_item" ADD CONSTRAINT "candidate_item_case_id_case_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."case"("id") ON DELETE set null ON UPDATE no action;