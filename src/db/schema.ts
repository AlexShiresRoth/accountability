import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  foreignKey,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import * as e from "../lib/enums";

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const verificationStatus = pgEnum("verification_status", e.verificationStatuses);
export const sourceType = pgEnum("source_type", e.sourceTypes);
export const offense = pgEnum("offense", e.offenses);
export const cleryGeography = pgEnum("clery_geography", e.cleryGeographies);
export const datePrecision = pgEnum("date_precision", e.datePrecisions);
export const caseEventType = pgEnum("case_event_type", e.caseEventTypes);
export const caseLocationContext = pgEnum("case_location_context", e.caseLocationContexts);
export const institutionActionType = pgEnum("institution_action_type", e.institutionActionTypes);
export const responseTopic = pgEnum("response_topic", e.responseTopics);
export const responseFindingKind = pgEnum("response_finding_kind", e.responseFindingKinds);
export const policyType = pgEnum("policy_type", e.policyTypes);
export const resourceCategory = pgEnum("resource_category", e.resourceCategories);
export const confidentialityLevel = pgEnum("confidentiality_level", e.confidentialityLevels);
export const coverageScope = pgEnum("coverage_scope", e.coverageScopes);
export const coverageTopic = pgEnum("coverage_topic", e.coverageTopics);
export const candidateStatus = pgEnum("candidate_status", e.candidateStatuses);

// ---------------------------------------------------------------------------
// Shared columns
// ---------------------------------------------------------------------------

const id = () => uuid("id").primaryKey().defaultRandom();

const timestamps = () => ({
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

/** Every factual record goes through human verification. Only PUBLIC_STATUSES are ever rendered publicly. */
const review = () => ({
  status: verificationStatus("status").notNull().default("draft"),
  isDemo: boolean("is_demo").notNull().default(false),
  reviewedBy: text("reviewed_by"),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  /** Researcher-only notes. Never rendered on public pages. */
  internalNotes: text("internal_notes"),
  ...timestamps(),
});

const yearCheck = (name: string, column: string) =>
  check(name, sql`${sql.identifier(column)} between 1990 and 2100`);

// ---------------------------------------------------------------------------
// Colleges and sources
// ---------------------------------------------------------------------------

export const colleges = pgTable("college", {
  id: id(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  /** Alternate names for search, e.g. "Harvard College". */
  aliases: text("aliases").array().notNull().default(sql`'{}'::text[]`),
  city: text("city"),
  state: text("state"),
  enrollment: integer("enrollment"),
  /** Which year/population the enrollment figure describes. Must be cited. */
  enrollmentNote: text("enrollment_note"),
  lastReviewedAt: date("last_reviewed_at"),
  ...review(),
}).enableRLS();

export const sources = pgTable(
  "source",
  {
    id: id(),
    type: sourceType("type").notNull(),
    publisher: text("publisher").notNull(),
    title: text("title").notNull(),
    url: text("url"),
    publicationDate: date("publication_date"),
    retrievedAt: date("retrieved_at"),
    archivedUrl: text("archived_url"),
    /** Path in document storage, only where storing a copy is legally appropriate. */
    documentPath: text("document_path"),
    /** Public notes about the source (e.g. "Pages 41–44 contain the crime statistics"). */
    notes: text("notes"),
    ...review(),
  },
  (t) => [
    index("source_url_idx").on(t.url),
    check("source_locatable", sql`${t.url} is not null or ${t.documentPath} is not null or ${t.archivedUrl} is not null`),
  ],
).enableRLS();

// ---------------------------------------------------------------------------
// Clery statistics
// ---------------------------------------------------------------------------

export const cleryReports = pgTable(
  "clery_report",
  {
    id: id(),
    collegeId: uuid("college_id")
      .notNull()
      .references(() => colleges.id, { onDelete: "restrict" }),
    /** Year the Annual Security Report was published. It covers the three preceding calendar years. */
    reportYear: integer("report_year").notNull(),
    title: text("title").notNull(),
    sourceId: uuid("source_id")
      .notNull()
      .references(() => sources.id, { onDelete: "restrict" }),
    ...review(),
  },
  (t) => [unique("clery_report_college_year").on(t.collegeId, t.reportYear), yearCheck("clery_report_year_range", "report_year")],
).enableRLS();

export const crimeStatistics = pgTable(
  "crime_statistic",
  {
    id: id(),
    cleryReportId: uuid("clery_report_id")
      .notNull()
      .references(() => cleryReports.id, { onDelete: "cascade" }),
    calendarYear: integer("calendar_year").notNull(),
    offense: offense("offense").notNull(),
    geography: cleryGeography("geography").notNull(),
    /** NULL means the figure was not reported or not located. It is never the same as 0. */
    count: integer("count"),
    unfoundedCount: integer("unfounded_count"),
    ...review(),
  },
  (t) => [
    unique("crime_statistic_cell").on(t.cleryReportId, t.calendarYear, t.offense, t.geography),
    // Target for the composite FK below: guarantees footnote links stay within one report.
    unique("crime_statistic_id_report").on(t.id, t.cleryReportId),
    yearCheck("crime_statistic_year_range", "calendar_year"),
    check("crime_statistic_count_nonnegative", sql`${t.count} is null or ${t.count} >= 0`),
    check("crime_statistic_unfounded_nonnegative", sql`${t.unfoundedCount} is null or ${t.unfoundedCount} >= 0`),
  ],
).enableRLS();

/** Annual Security Report footnotes are first-class data and are stored verbatim. */
export const statisticFootnotes = pgTable(
  "statistic_footnote",
  {
    id: id(),
    cleryReportId: uuid("clery_report_id")
      .notNull()
      .references(() => cleryReports.id, { onDelete: "cascade" }),
    /** The marker used in the report, e.g. "*" or "3". */
    marker: text("marker"),
    originalText: text("original_text").notNull(),
    /** Optional plain-language explanation. The original text is always shown too. */
    summary: text("summary"),
    page: text("page"),
    ...review(),
  },
  (t) => [unique("statistic_footnote_id_report").on(t.id, t.cleryReportId)],
).enableRLS();

export const statisticFootnoteLinks = pgTable(
  "statistic_footnote_link",
  {
    footnoteId: uuid("footnote_id").notNull(),
    crimeStatisticId: uuid("crime_statistic_id").notNull(),
    cleryReportId: uuid("clery_report_id").notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.footnoteId, t.crimeStatisticId] }),
    foreignKey({
      name: "footnote_link_footnote_fk",
      columns: [t.footnoteId, t.cleryReportId],
      foreignColumns: [statisticFootnotes.id, statisticFootnotes.cleryReportId],
    }).onDelete("cascade"),
    foreignKey({
      name: "footnote_link_statistic_fk",
      columns: [t.crimeStatisticId, t.cleryReportId],
      foreignColumns: [crimeStatistics.id, crimeStatistics.cleryReportId],
    }).onDelete("cascade"),
  ],
).enableRLS();

// ---------------------------------------------------------------------------
// Cases
// ---------------------------------------------------------------------------

/** A documented case. There are intentionally no columns describing individuals. */
export const cases = pgTable("case", {
  id: id(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  locationContext: caseLocationContext("location_context").notNull().default("unspecified"),
  /** Editorial reason this case is in the public interest. Required before publication. */
  publicationJustification: text("publication_justification").notNull(),
  ...review(),
}).enableRLS();

export const caseColleges = pgTable(
  "case_college",
  {
    caseId: uuid("case_id")
      .notNull()
      .references(() => cases.id, { onDelete: "cascade" }),
    collegeId: uuid("college_id")
      .notNull()
      .references(() => colleges.id, { onDelete: "restrict" }),
  },
  (t) => [primaryKey({ columns: [t.caseId, t.collegeId] }), index("case_college_college_idx").on(t.collegeId)],
).enableRLS();

export const caseEvents = pgTable(
  "case_event",
  {
    id: id(),
    caseId: uuid("case_id")
      .notNull()
      .references(() => cases.id, { onDelete: "cascade" }),
    eventDate: date("event_date").notNull(),
    datePrecision: datePrecision("date_precision").notNull().default("day"),
    /** Tie-breaker for events on the same date. */
    sequence: integer("sequence").notNull().default(0),
    eventType: caseEventType("event_type").notNull(),
    /** Must be attributed to its source ("The complaint alleges…", "Police records state…"). */
    description: text("description").notNull(),
    supersedesEventId: uuid("supersedes_event_id"),
    ...review(),
  },
  (t) => [
    index("case_event_case_idx").on(t.caseId),
    foreignKey({ name: "case_event_supersedes_fk", columns: [t.supersedesEventId], foreignColumns: [t.id] }).onDelete(
      "set null",
    ),
  ],
).enableRLS();

// ---------------------------------------------------------------------------
// Institutional record
// ---------------------------------------------------------------------------

/** Accountability timeline entries: favorable and unfavorable institutional developments. */
export const institutionActions = pgTable(
  "institution_action",
  {
    id: id(),
    collegeId: uuid("college_id")
      .notNull()
      .references(() => colleges.id, { onDelete: "restrict" }),
    actionDate: date("action_date").notNull(),
    datePrecision: datePrecision("date_precision").notNull().default("day"),
    actionType: institutionActionType("action_type").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    ...review(),
  },
  (t) => [index("institution_action_college_idx").on(t.collegeId)],
).enableRLS();

export const institutionalResponses = pgTable(
  "institutional_response",
  {
    id: id(),
    collegeId: uuid("college_id")
      .notNull()
      .references(() => colleges.id, { onDelete: "restrict" }),
    topic: responseTopic("topic").notNull(),
    findingKind: responseFindingKind("finding_kind").notNull(),
    summary: text("summary").notNull(),
    ...review(),
  },
  (t) => [index("institutional_response_college_idx").on(t.collegeId)],
).enableRLS();

export const policies = pgTable(
  "policy",
  {
    id: id(),
    collegeId: uuid("college_id")
      .notNull()
      .references(() => colleges.id, { onDelete: "restrict" }),
    policyType: policyType("policy_type").notNull(),
    title: text("title").notNull(),
    summary: text("summary"),
    effectiveDate: date("effective_date"),
    ...review(),
  },
  (t) => [index("policy_college_idx").on(t.collegeId)],
).enableRLS();

export const studentResources = pgTable(
  "student_resource",
  {
    id: id(),
    collegeId: uuid("college_id")
      .notNull()
      .references(() => colleges.id, { onDelete: "restrict" }),
    category: resourceCategory("category").notNull(),
    confidentiality: confidentialityLevel("confidentiality").notNull().default("unknown"),
    name: text("name").notNull(),
    description: text("description"),
    phone: text("phone"),
    url: text("url"),
    hours: text("hours"),
    available247: boolean("available_24_7"),
    sortOrder: integer("sort_order").notNull().default(0),
    ...review(),
  },
  (t) => [index("student_resource_college_idx").on(t.collegeId)],
).enableRLS();

/** Researcher-selected journalism about a college. Displays our neutral summary, not the headline. */
export const collegeCoverage = pgTable(
  "college_coverage",
  {
    id: id(),
    collegeId: uuid("college_id")
      .notNull()
      .references(() => colleges.id, { onDelete: "restrict" }),
    sourceId: uuid("source_id")
      .notNull()
      .references(() => sources.id, { onDelete: "restrict" }),
    scope: coverageScope("scope").notNull(),
    caseId: uuid("case_id").references(() => cases.id, { onDelete: "restrict" }),
    institutionActionId: uuid("institution_action_id").references(() => institutionActions.id, {
      onDelete: "set null",
    }),
    topic: coverageTopic("topic").notNull(),
    summary: text("summary").notNull(),
    ...review(),
  },
  (t) => [
    index("college_coverage_college_idx").on(t.collegeId),
    // Coverage of a specific case may only exist when linked to that case; institutional coverage never is.
    check(
      "college_coverage_scope_case",
      sql`(${t.scope} = 'case' and ${t.caseId} is not null) or (${t.scope} = 'institutional' and ${t.caseId} is null)`,
    ),
  ],
).enableRLS();

export const corrections = pgTable(
  "correction",
  {
    id: id(),
    collegeId: uuid("college_id").references(() => colleges.id, { onDelete: "cascade" }),
    caseId: uuid("case_id").references(() => cases.id, { onDelete: "cascade" }),
    correctionDate: date("correction_date").notNull(),
    description: text("description").notNull(),
    ...review(),
  },
  (t) => [check("correction_single_target", sql`num_nonnulls(${t.collegeId}, ${t.caseId}) = 1`)],
).enableRLS();

// ---------------------------------------------------------------------------
// Citations
// ---------------------------------------------------------------------------

/**
 * Connects one claim to one source. Exactly one target column is set.
 * A citation is public only when its target record AND its source are public.
 */
export const citations = pgTable(
  "citation",
  {
    id: id(),
    sourceId: uuid("source_id")
      .notNull()
      .references(() => sources.id, { onDelete: "restrict" }),
    collegeId: uuid("college_id").references(() => colleges.id, { onDelete: "cascade" }),
    cleryReportId: uuid("clery_report_id").references(() => cleryReports.id, { onDelete: "cascade" }),
    crimeStatisticId: uuid("crime_statistic_id").references(() => crimeStatistics.id, { onDelete: "cascade" }),
    statisticFootnoteId: uuid("statistic_footnote_id").references(() => statisticFootnotes.id, {
      onDelete: "cascade",
    }),
    caseId: uuid("case_id").references(() => cases.id, { onDelete: "cascade" }),
    caseEventId: uuid("case_event_id").references(() => caseEvents.id, { onDelete: "cascade" }),
    institutionActionId: uuid("institution_action_id").references(() => institutionActions.id, {
      onDelete: "cascade",
    }),
    institutionalResponseId: uuid("institutional_response_id").references(() => institutionalResponses.id, {
      onDelete: "cascade",
    }),
    policyId: uuid("policy_id").references(() => policies.id, { onDelete: "cascade" }),
    studentResourceId: uuid("student_resource_id").references(() => studentResources.id, { onDelete: "cascade" }),
    correctionId: uuid("correction_id").references(() => corrections.id, { onDelete: "cascade" }),
    /** Page, section, or paragraph within the source. */
    pinpoint: text("pinpoint"),
    /** Short supporting quotation. */
    excerpt: text("excerpt"),
    /** Which specific claim this citation supports, when the record makes more than one. */
    claim: text("claim"),
    ...timestamps(),
  },
  (t) => [
    check(
      "citation_single_target",
      sql`num_nonnulls(${t.collegeId}, ${t.cleryReportId}, ${t.crimeStatisticId}, ${t.statisticFootnoteId}, ${t.caseId}, ${t.caseEventId}, ${t.institutionActionId}, ${t.institutionalResponseId}, ${t.policyId}, ${t.studentResourceId}, ${t.correctionId}) = 1`,
    ),
    index("citation_source_idx").on(t.sourceId),
  ],
).enableRLS();

// ---------------------------------------------------------------------------
// Audit and ingestion
// ---------------------------------------------------------------------------

/** Append-only record of every verification status change. */
export const verificationLog = pgTable(
  "verification_log",
  {
    id: id(),
    tableName: text("table_name").notNull(),
    recordId: uuid("record_id").notNull(),
    fromStatus: verificationStatus("from_status"),
    toStatus: verificationStatus("to_status").notNull(),
    actor: text("actor").notNull(),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("verification_log_record_idx").on(t.tableName, t.recordId)],
).enableRLS();

export const ingestionRuns = pgTable("ingestion_run", {
  id: id(),
  job: text("job").notNull(),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  finishedAt: timestamp("finished_at", { withTimezone: true }),
  itemsFound: integer("items_found").notNull().default(0),
  itemsCreated: integer("items_created").notNull().default(0),
  error: text("error"),
}).enableRLS();

/**
 * Automatically discovered material awaiting researcher triage. Never public.
 * Accepting a candidate creates DRAFT records; nothing is published automatically.
 */
export const candidateItems = pgTable(
  "candidate_item",
  {
    id: id(),
    ingestionRunId: uuid("ingestion_run_id").references(() => ingestionRuns.id, { onDelete: "set null" }),
    url: text("url").notNull().unique(),
    title: text("title"),
    publisher: text("publisher"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    snippet: text("snippet"),
    collegeId: uuid("college_id").references(() => colleges.id, { onDelete: "set null" }),
    suggestedTopic: coverageTopic("suggested_topic"),
    status: candidateStatus("status").notNull().default("new"),
    acceptedSourceId: uuid("accepted_source_id").references(() => sources.id, { onDelete: "set null" }),
    reviewedBy: text("reviewed_by"),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("candidate_item_status_idx").on(t.status)],
).enableRLS();
