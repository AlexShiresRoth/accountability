CREATE TYPE "public"."candidate_status" AS ENUM('new', 'accepted', 'dismissed');--> statement-breakpoint
CREATE TYPE "public"."case_event_type" AS ENUM('alleged_incident', 'police_report', 'university_report', 'investigation_opened', 'university_discipline', 'arrest', 'criminal_charge', 'prosecution_declined', 'civil_complaint', 'settlement', 'conviction', 'acquittal', 'dismissal', 'investigation_reopened', 'institutional_reform', 'government_investigation');--> statement-breakpoint
CREATE TYPE "public"."case_location_context" AS ENUM('on_campus', 'off_campus', 'online', 'unspecified');--> statement-breakpoint
CREATE TYPE "public"."clery_geography" AS ENUM('on_campus', 'on_campus_residential', 'noncampus', 'public_property');--> statement-breakpoint
CREATE TYPE "public"."confidentiality_level" AS ENUM('confidential', 'private', 'institutional_reporting', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."coverage_scope" AS ENUM('institutional', 'case');--> statement-breakpoint
CREATE TYPE "public"."coverage_topic" AS ENUM('title_ix_process', 'policy_change', 'investigation', 'lawsuit', 'prevention', 'campus_safety', 'case_development', 'other');--> statement-breakpoint
CREATE TYPE "public"."date_precision" AS ENUM('day', 'month', 'year', 'approximate');--> statement-breakpoint
CREATE TYPE "public"."institution_action_type" AS ENUM('policy_change', 'government_investigation', 'lawsuit', 'settlement', 'audit', 'disciplinary_action', 'prevention_initiative', 'institutional_reform', 'other');--> statement-breakpoint
CREATE TYPE "public"."offense" AS ENUM('rape', 'fondling', 'incest', 'statutory_rape', 'domestic_violence', 'dating_violence', 'stalking');--> statement-breakpoint
CREATE TYPE "public"."policy_type" AS ENUM('title_ix', 'sexual_misconduct', 'reporting', 'amnesty', 'supportive_measures', 'other');--> statement-breakpoint
CREATE TYPE "public"."resource_category" AS ENUM('emergency', 'confidential', 'title_ix', 'campus_police', 'local_law_enforcement', 'victim_advocacy', 'counseling', 'medical');--> statement-breakpoint
CREATE TYPE "public"."response_finding_kind" AS ENUM('documented', 'not_located');--> statement-breakpoint
CREATE TYPE "public"."response_topic" AS ENUM('title_ix_process', 'disciplinary_procedures', 'law_enforcement_referrals', 'prevention_programs', 'reporting_procedures', 'outcome_information', 'transparency_practices');--> statement-breakpoint
CREATE TYPE "public"."source_type" AS ENUM('federal_government', 'state_government', 'local_government', 'university', 'police_record', 'court_record', 'civil_complaint', 'government_investigation', 'reputable_journalism');--> statement-breakpoint
CREATE TYPE "public"."verification_status" AS ENUM('draft', 'pending_review', 'verified', 'rejected', 'needs_update');--> statement-breakpoint
CREATE TABLE "candidate_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ingestion_run_id" uuid,
	"url" text NOT NULL,
	"title" text,
	"publisher" text,
	"published_at" timestamp with time zone,
	"snippet" text,
	"college_id" uuid,
	"suggested_topic" "coverage_topic",
	"status" "candidate_status" DEFAULT 'new' NOT NULL,
	"accepted_source_id" uuid,
	"reviewed_by" text,
	"reviewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "candidate_item_url_unique" UNIQUE("url")
);
--> statement-breakpoint
ALTER TABLE "candidate_item" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "case_college" (
	"case_id" uuid NOT NULL,
	"college_id" uuid NOT NULL,
	CONSTRAINT "case_college_case_id_college_id_pk" PRIMARY KEY("case_id","college_id")
);
--> statement-breakpoint
ALTER TABLE "case_college" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "case_event" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"case_id" uuid NOT NULL,
	"event_date" date NOT NULL,
	"date_precision" date_precision DEFAULT 'day' NOT NULL,
	"sequence" integer DEFAULT 0 NOT NULL,
	"event_type" "case_event_type" NOT NULL,
	"description" text NOT NULL,
	"supersedes_event_id" uuid,
	"status" "verification_status" DEFAULT 'draft' NOT NULL,
	"is_demo" boolean DEFAULT false NOT NULL,
	"reviewed_by" text,
	"reviewed_at" timestamp with time zone,
	"internal_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "case_event" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "case" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"location_context" "case_location_context" DEFAULT 'unspecified' NOT NULL,
	"publication_justification" text NOT NULL,
	"status" "verification_status" DEFAULT 'draft' NOT NULL,
	"is_demo" boolean DEFAULT false NOT NULL,
	"reviewed_by" text,
	"reviewed_at" timestamp with time zone,
	"internal_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "case_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "case" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "citation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_id" uuid NOT NULL,
	"college_id" uuid,
	"clery_report_id" uuid,
	"crime_statistic_id" uuid,
	"statistic_footnote_id" uuid,
	"case_id" uuid,
	"case_event_id" uuid,
	"institution_action_id" uuid,
	"institutional_response_id" uuid,
	"policy_id" uuid,
	"student_resource_id" uuid,
	"correction_id" uuid,
	"pinpoint" text,
	"excerpt" text,
	"claim" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "citation_single_target" CHECK (num_nonnulls("citation"."college_id", "citation"."clery_report_id", "citation"."crime_statistic_id", "citation"."statistic_footnote_id", "citation"."case_id", "citation"."case_event_id", "citation"."institution_action_id", "citation"."institutional_response_id", "citation"."policy_id", "citation"."student_resource_id", "citation"."correction_id") = 1)
);
--> statement-breakpoint
ALTER TABLE "citation" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "clery_report" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"college_id" uuid NOT NULL,
	"report_year" integer NOT NULL,
	"title" text NOT NULL,
	"source_id" uuid NOT NULL,
	"status" "verification_status" DEFAULT 'draft' NOT NULL,
	"is_demo" boolean DEFAULT false NOT NULL,
	"reviewed_by" text,
	"reviewed_at" timestamp with time zone,
	"internal_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "clery_report_college_year" UNIQUE("college_id","report_year"),
	CONSTRAINT "clery_report_year_range" CHECK ("report_year" between 1990 and 2100)
);
--> statement-breakpoint
ALTER TABLE "clery_report" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "college_coverage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"college_id" uuid NOT NULL,
	"source_id" uuid NOT NULL,
	"scope" "coverage_scope" NOT NULL,
	"case_id" uuid,
	"institution_action_id" uuid,
	"topic" "coverage_topic" NOT NULL,
	"summary" text NOT NULL,
	"status" "verification_status" DEFAULT 'draft' NOT NULL,
	"is_demo" boolean DEFAULT false NOT NULL,
	"reviewed_by" text,
	"reviewed_at" timestamp with time zone,
	"internal_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "college_coverage_scope_case" CHECK (("college_coverage"."scope" = 'case' and "college_coverage"."case_id" is not null) or ("college_coverage"."scope" = 'institutional' and "college_coverage"."case_id" is null))
);
--> statement-breakpoint
ALTER TABLE "college_coverage" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "college" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"aliases" text[] DEFAULT '{}'::text[] NOT NULL,
	"city" text,
	"state" text,
	"enrollment" integer,
	"enrollment_note" text,
	"last_reviewed_at" date,
	"status" "verification_status" DEFAULT 'draft' NOT NULL,
	"is_demo" boolean DEFAULT false NOT NULL,
	"reviewed_by" text,
	"reviewed_at" timestamp with time zone,
	"internal_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "college_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "college" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "correction" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"college_id" uuid,
	"case_id" uuid,
	"correction_date" date NOT NULL,
	"description" text NOT NULL,
	"status" "verification_status" DEFAULT 'draft' NOT NULL,
	"is_demo" boolean DEFAULT false NOT NULL,
	"reviewed_by" text,
	"reviewed_at" timestamp with time zone,
	"internal_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "correction_single_target" CHECK (num_nonnulls("correction"."college_id", "correction"."case_id") = 1)
);
--> statement-breakpoint
ALTER TABLE "correction" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "crime_statistic" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clery_report_id" uuid NOT NULL,
	"calendar_year" integer NOT NULL,
	"offense" "offense" NOT NULL,
	"geography" "clery_geography" NOT NULL,
	"count" integer,
	"unfounded_count" integer,
	"status" "verification_status" DEFAULT 'draft' NOT NULL,
	"is_demo" boolean DEFAULT false NOT NULL,
	"reviewed_by" text,
	"reviewed_at" timestamp with time zone,
	"internal_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "crime_statistic_cell" UNIQUE("clery_report_id","calendar_year","offense","geography"),
	CONSTRAINT "crime_statistic_id_report" UNIQUE("id","clery_report_id"),
	CONSTRAINT "crime_statistic_year_range" CHECK ("calendar_year" between 1990 and 2100),
	CONSTRAINT "crime_statistic_count_nonnegative" CHECK ("crime_statistic"."count" is null or "crime_statistic"."count" >= 0),
	CONSTRAINT "crime_statistic_unfounded_nonnegative" CHECK ("crime_statistic"."unfounded_count" is null or "crime_statistic"."unfounded_count" >= 0)
);
--> statement-breakpoint
ALTER TABLE "crime_statistic" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "ingestion_run" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job" text NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone,
	"items_found" integer DEFAULT 0 NOT NULL,
	"items_created" integer DEFAULT 0 NOT NULL,
	"error" text
);
--> statement-breakpoint
ALTER TABLE "ingestion_run" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "institution_action" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"college_id" uuid NOT NULL,
	"action_date" date NOT NULL,
	"date_precision" date_precision DEFAULT 'day' NOT NULL,
	"action_type" "institution_action_type" NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"status" "verification_status" DEFAULT 'draft' NOT NULL,
	"is_demo" boolean DEFAULT false NOT NULL,
	"reviewed_by" text,
	"reviewed_at" timestamp with time zone,
	"internal_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "institution_action" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "institutional_response" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"college_id" uuid NOT NULL,
	"topic" "response_topic" NOT NULL,
	"finding_kind" "response_finding_kind" NOT NULL,
	"summary" text NOT NULL,
	"status" "verification_status" DEFAULT 'draft' NOT NULL,
	"is_demo" boolean DEFAULT false NOT NULL,
	"reviewed_by" text,
	"reviewed_at" timestamp with time zone,
	"internal_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "institutional_response" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "policy" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"college_id" uuid NOT NULL,
	"policy_type" "policy_type" NOT NULL,
	"title" text NOT NULL,
	"summary" text,
	"effective_date" date,
	"status" "verification_status" DEFAULT 'draft' NOT NULL,
	"is_demo" boolean DEFAULT false NOT NULL,
	"reviewed_by" text,
	"reviewed_at" timestamp with time zone,
	"internal_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "policy" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "source" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "source_type" NOT NULL,
	"publisher" text NOT NULL,
	"title" text NOT NULL,
	"url" text,
	"publication_date" date,
	"retrieved_at" date,
	"archived_url" text,
	"document_path" text,
	"notes" text,
	"status" "verification_status" DEFAULT 'draft' NOT NULL,
	"is_demo" boolean DEFAULT false NOT NULL,
	"reviewed_by" text,
	"reviewed_at" timestamp with time zone,
	"internal_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "source_locatable" CHECK ("source"."url" is not null or "source"."document_path" is not null or "source"."archived_url" is not null)
);
--> statement-breakpoint
ALTER TABLE "source" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "statistic_footnote_link" (
	"footnote_id" uuid NOT NULL,
	"crime_statistic_id" uuid NOT NULL,
	"clery_report_id" uuid NOT NULL,
	CONSTRAINT "statistic_footnote_link_footnote_id_crime_statistic_id_pk" PRIMARY KEY("footnote_id","crime_statistic_id")
);
--> statement-breakpoint
ALTER TABLE "statistic_footnote_link" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "statistic_footnote" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clery_report_id" uuid NOT NULL,
	"marker" text,
	"original_text" text NOT NULL,
	"summary" text,
	"page" text,
	"status" "verification_status" DEFAULT 'draft' NOT NULL,
	"is_demo" boolean DEFAULT false NOT NULL,
	"reviewed_by" text,
	"reviewed_at" timestamp with time zone,
	"internal_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "statistic_footnote_id_report" UNIQUE("id","clery_report_id")
);
--> statement-breakpoint
ALTER TABLE "statistic_footnote" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "student_resource" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"college_id" uuid NOT NULL,
	"category" "resource_category" NOT NULL,
	"confidentiality" "confidentiality_level" DEFAULT 'unknown' NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"phone" text,
	"url" text,
	"hours" text,
	"available_24_7" boolean,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"status" "verification_status" DEFAULT 'draft' NOT NULL,
	"is_demo" boolean DEFAULT false NOT NULL,
	"reviewed_by" text,
	"reviewed_at" timestamp with time zone,
	"internal_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "student_resource" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "verification_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"table_name" text NOT NULL,
	"record_id" uuid NOT NULL,
	"from_status" "verification_status",
	"to_status" "verification_status" NOT NULL,
	"actor" text NOT NULL,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "verification_log" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "candidate_item" ADD CONSTRAINT "candidate_item_ingestion_run_id_ingestion_run_id_fk" FOREIGN KEY ("ingestion_run_id") REFERENCES "public"."ingestion_run"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidate_item" ADD CONSTRAINT "candidate_item_college_id_college_id_fk" FOREIGN KEY ("college_id") REFERENCES "public"."college"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidate_item" ADD CONSTRAINT "candidate_item_accepted_source_id_source_id_fk" FOREIGN KEY ("accepted_source_id") REFERENCES "public"."source"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case_college" ADD CONSTRAINT "case_college_case_id_case_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."case"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case_college" ADD CONSTRAINT "case_college_college_id_college_id_fk" FOREIGN KEY ("college_id") REFERENCES "public"."college"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case_event" ADD CONSTRAINT "case_event_case_id_case_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."case"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case_event" ADD CONSTRAINT "case_event_supersedes_fk" FOREIGN KEY ("supersedes_event_id") REFERENCES "public"."case_event"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "citation" ADD CONSTRAINT "citation_source_id_source_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."source"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "citation" ADD CONSTRAINT "citation_college_id_college_id_fk" FOREIGN KEY ("college_id") REFERENCES "public"."college"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "citation" ADD CONSTRAINT "citation_clery_report_id_clery_report_id_fk" FOREIGN KEY ("clery_report_id") REFERENCES "public"."clery_report"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "citation" ADD CONSTRAINT "citation_crime_statistic_id_crime_statistic_id_fk" FOREIGN KEY ("crime_statistic_id") REFERENCES "public"."crime_statistic"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "citation" ADD CONSTRAINT "citation_statistic_footnote_id_statistic_footnote_id_fk" FOREIGN KEY ("statistic_footnote_id") REFERENCES "public"."statistic_footnote"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "citation" ADD CONSTRAINT "citation_case_id_case_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."case"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "citation" ADD CONSTRAINT "citation_case_event_id_case_event_id_fk" FOREIGN KEY ("case_event_id") REFERENCES "public"."case_event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "citation" ADD CONSTRAINT "citation_institution_action_id_institution_action_id_fk" FOREIGN KEY ("institution_action_id") REFERENCES "public"."institution_action"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "citation" ADD CONSTRAINT "citation_institutional_response_id_institutional_response_id_fk" FOREIGN KEY ("institutional_response_id") REFERENCES "public"."institutional_response"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "citation" ADD CONSTRAINT "citation_policy_id_policy_id_fk" FOREIGN KEY ("policy_id") REFERENCES "public"."policy"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "citation" ADD CONSTRAINT "citation_student_resource_id_student_resource_id_fk" FOREIGN KEY ("student_resource_id") REFERENCES "public"."student_resource"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "citation" ADD CONSTRAINT "citation_correction_id_correction_id_fk" FOREIGN KEY ("correction_id") REFERENCES "public"."correction"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clery_report" ADD CONSTRAINT "clery_report_college_id_college_id_fk" FOREIGN KEY ("college_id") REFERENCES "public"."college"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clery_report" ADD CONSTRAINT "clery_report_source_id_source_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."source"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "college_coverage" ADD CONSTRAINT "college_coverage_college_id_college_id_fk" FOREIGN KEY ("college_id") REFERENCES "public"."college"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "college_coverage" ADD CONSTRAINT "college_coverage_source_id_source_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."source"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "college_coverage" ADD CONSTRAINT "college_coverage_case_id_case_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."case"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "college_coverage" ADD CONSTRAINT "college_coverage_institution_action_id_institution_action_id_fk" FOREIGN KEY ("institution_action_id") REFERENCES "public"."institution_action"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "correction" ADD CONSTRAINT "correction_college_id_college_id_fk" FOREIGN KEY ("college_id") REFERENCES "public"."college"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "correction" ADD CONSTRAINT "correction_case_id_case_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."case"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crime_statistic" ADD CONSTRAINT "crime_statistic_clery_report_id_clery_report_id_fk" FOREIGN KEY ("clery_report_id") REFERENCES "public"."clery_report"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "institution_action" ADD CONSTRAINT "institution_action_college_id_college_id_fk" FOREIGN KEY ("college_id") REFERENCES "public"."college"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "institutional_response" ADD CONSTRAINT "institutional_response_college_id_college_id_fk" FOREIGN KEY ("college_id") REFERENCES "public"."college"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "policy" ADD CONSTRAINT "policy_college_id_college_id_fk" FOREIGN KEY ("college_id") REFERENCES "public"."college"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "statistic_footnote_link" ADD CONSTRAINT "footnote_link_footnote_fk" FOREIGN KEY ("footnote_id","clery_report_id") REFERENCES "public"."statistic_footnote"("id","clery_report_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "statistic_footnote_link" ADD CONSTRAINT "footnote_link_statistic_fk" FOREIGN KEY ("crime_statistic_id","clery_report_id") REFERENCES "public"."crime_statistic"("id","clery_report_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "statistic_footnote" ADD CONSTRAINT "statistic_footnote_clery_report_id_clery_report_id_fk" FOREIGN KEY ("clery_report_id") REFERENCES "public"."clery_report"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_resource" ADD CONSTRAINT "student_resource_college_id_college_id_fk" FOREIGN KEY ("college_id") REFERENCES "public"."college"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "candidate_item_status_idx" ON "candidate_item" USING btree ("status");--> statement-breakpoint
CREATE INDEX "case_college_college_idx" ON "case_college" USING btree ("college_id");--> statement-breakpoint
CREATE INDEX "case_event_case_idx" ON "case_event" USING btree ("case_id");--> statement-breakpoint
CREATE INDEX "citation_source_idx" ON "citation" USING btree ("source_id");--> statement-breakpoint
CREATE INDEX "college_coverage_college_idx" ON "college_coverage" USING btree ("college_id");--> statement-breakpoint
CREATE INDEX "institution_action_college_idx" ON "institution_action" USING btree ("college_id");--> statement-breakpoint
CREATE INDEX "institutional_response_college_idx" ON "institutional_response" USING btree ("college_id");--> statement-breakpoint
CREATE INDEX "policy_college_idx" ON "policy" USING btree ("college_id");--> statement-breakpoint
CREATE INDEX "source_url_idx" ON "source" USING btree ("url");--> statement-breakpoint
CREATE INDEX "student_resource_college_idx" ON "student_resource" USING btree ("college_id");--> statement-breakpoint
CREATE INDEX "verification_log_record_idx" ON "verification_log" USING btree ("table_name","record_id");