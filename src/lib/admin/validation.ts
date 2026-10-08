// Input validation for admin forms. Form values arrive as strings; empty strings become null.
import { z } from "zod";
import { isGoogleNewsUrl } from "@/jobs/discovery/google-news";
import {
  caseEventTypes,
  caseLocationContexts,
  confidentialityLevels,
  coverageScopes,
  coverageTopics,
  datePrecisions,
  institutionActionTypes,
  policyTypes,
  resourceCategories,
  responseFindingKinds,
  responseTopics,
  sourceTypes,
  verificationStatuses,
  sourceAccessLevels,
} from "@/lib/enums";

export function formValues(form: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of form) if (typeof v === "string" && !(k in out)) out[k] = v;
  return out;
}

const text = (max = 500) => z.string().trim().max(max);
const required = (label: string, max = 500) => text(max).min(1, `${label} is required.`);
const optional = (max = 2000) =>
  z
    .string()
    .optional()
    .transform((v) => v?.trim() || null)
    .pipe(z.string().max(max).nullable());

const isoDate = z
  .string()
  .optional()
  .transform((v) => v?.trim() || null)
  .refine((v) => v === null || (/^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(`${v}T00:00:00Z`))), "Use a YYYY-MM-DD date.");

const webUrl = z
  .string()
  .optional()
  .transform((v) => v?.trim() || null)
  .refine((v) => {
    if (v === null) return true;
    try {
      const u = new URL(v);
      return u.protocol === "https:" || u.protocol === "http:";
    } catch {
      return false;
    }
  }, "Enter a full http(s) URL.");

const uuid = (label: string) => z.string().uuid(`${label} is required.`);

export const sourceSchema = z
  .object({
    type: z.enum(sourceTypes),
    publisher: required("Publisher"),
    title: required("Title", 1000),
    url: webUrl,
    publicationDate: isoDate,
    retrievedAt: isoDate,
    archivedUrl: webUrl,
    documentPath: optional(500),
    notes: optional(),
    access: z.enum(sourceAccessLevels).default("unknown"),
  })
  .refine((v) => v.url || v.archivedUrl || v.documentPath, { message: "Give a URL, an archived URL, or a stored document path.", path: ["url"] });
export type SourceInput = z.infer<typeof sourceSchema>;

export const collegeSchema = z.object({
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug must be lowercase words separated by hyphens, e.g. cornell-university."),
  name: required("Name"),
  aliases: z
    .string()
    .optional()
    .transform((v) => (v ?? "").split(",").map((a) => a.trim()).filter(Boolean)),
  city: optional(200),
  state: optional(50),
  enrollment: z
    .string()
    .optional()
    .transform((v) => v?.replace(/,/g, "").trim() || null)
    .refine((v) => v === null || /^\d{1,7}$/.test(v), "Enrollment must be a whole number.")
    .transform((v) => (v === null ? null : Number(v))),
  enrollmentNote: optional(),
  lastReviewedAt: isoDate,
});
export type CollegeInput = z.infer<typeof collegeSchema>;

export const reportSchema = z.object({
  collegeId: uuid("College"),
  reportYear: z.coerce.number().int().min(1990, "Year must be 1990 or later.").max(2100),
  title: required("Title"),
  sourceId: uuid("Source document"),
});
export type ReportInput = z.infer<typeof reportSchema>;

export const footnoteSchema = z.object({
  marker: optional(20),
  originalText: required("Footnote text (verbatim)", 5000),
  summary: optional(1000),
  page: optional(50),
});
export type FootnoteInput = z.infer<typeof footnoteSchema>;

export const citationSchema = z.object({
  sourceId: uuid("Source"),
  pinpoint: optional(200),
  excerpt: optional(1000),
  claim: optional(500),
});
export type CitationInput = z.infer<typeof citationSchema>;

export const statusChangeSchema = z.object({
  to: z.enum(verificationStatuses),
  note: optional(1000),
});

export const acceptCandidateSchema = z
  .object({
    /** "coverage": draft source + draft coverage entry. "source_only": draft source only (e.g. a court docket for a case). */
    mode: z.enum(["coverage", "source_only"]).default("coverage"),
    collegeId: uuid("College"),
    scope: z.enum(coverageScopes),
    caseId: z
      .string()
      .optional()
      .transform((v) => v?.trim() || null),
    topic: z.enum(coverageTopics),
    summary: z
      .string()
      .optional()
      .transform((v) => v?.trim() ?? "")
      .pipe(z.string().max(600)),
    sourceType: z.enum(sourceTypes),
    access: z.enum(sourceAccessLevels).default("unknown"),
    publisher: required("Publisher"),
    title: required("Title", 1000),
    publicationDate: isoDate,
    /** The publisher's own URL. Required when the candidate was found via Google News. */
    articleUrl: webUrl,
  })
  // Choosing a case means the coverage is about that case, whatever the scope field says.
  .transform((v) => ({ ...v, scope: v.caseId ? ("case" as const) : v.scope }))
  .refine((v) => !v.articleUrl || !isGoogleNewsUrl(v.articleUrl), {
    message: "Paste the publisher's own article URL, not a Google News link. Open the article, then copy the address bar.",
    path: ["articleUrl"],
  })
  .refine((v) => v.mode === "source_only" || v.summary.length >= 20, {
    message: "Write a neutral one-sentence summary (at least 20 characters).",
    path: ["summary"],
  })
  .refine((v) => v.mode === "source_only" || v.scope === "institutional" || v.caseId, {
    message: "Case-specific coverage must be linked to a case.",
    path: ["caseId"],
  })
  .refine((v) => v.mode === "source_only" || v.summary.toLowerCase() !== v.title.toLowerCase(), {
    message: "Write your own neutral summary rather than repeating the headline.",
    path: ["summary"],
  });
export type AcceptCandidateInput = z.infer<typeof acceptCandidateSchema>;

// ---------------------------------------------------------------------------
// Institutional record (step 5b-1)
// ---------------------------------------------------------------------------

const requiredDate = (label: string) =>
  isoDate.refine((v) => v !== null, `${label} is required.`).transform((v) => v as string);

const optionalUuid = z
  .string()
  .optional()
  .transform((v) => v?.trim() || null)
  .refine((v) => v === null || /^[0-9a-f-]{36}$/i.test(v), "Invalid selection.");

export const actionSchema = z.object({
  actionDate: requiredDate("Date"),
  datePrecision: z.enum(datePrecisions),
  actionType: z.enum(institutionActionTypes),
  title: required("Title", 300),
  description: required("Description", 3000),
});
export type ActionInput = z.infer<typeof actionSchema>;

export const responseSchema = z.object({
  topic: z.enum(responseTopics),
  findingKind: z.enum(responseFindingKinds),
  summary: required("Summary", 3000),
});
export type ResponseInput = z.infer<typeof responseSchema>;

export const policySchema = z.object({
  policyType: z.enum(policyTypes),
  title: required("Title", 300),
  summary: optional(3000),
  effectiveDate: isoDate,
});
export type PolicyInput = z.infer<typeof policySchema>;

export const resourceSchema = z.object({
  category: z.enum(resourceCategories),
  confidentiality: z.enum(confidentialityLevels),
  name: required("Name", 300),
  description: optional(2000),
  phone: optional(50),
  url: webUrl,
  hours: optional(300),
  available247: z
    .string()
    .optional()
    .transform((v) => (v === "yes" ? true : v === "no" ? false : null)),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
});
export type ResourceInput = z.infer<typeof resourceSchema>;

export const coverageSchema = z
  .object({
    sourceId: uuid("Source"),
    scope: z.enum(coverageScopes),
    caseId: optionalUuid,
    institutionActionId: optionalUuid,
    topic: z.enum(coverageTopics),
    summary: required("Summary", 600).min(20, "Write a neutral one-sentence summary (at least 20 characters)."),
  })
  // Choosing a case means the coverage is about that case, whatever the scope field says. Before this, a case
  // picked with "Institution-level" left selected was silently dropped on save.
  .transform((v) => ({ ...v, scope: v.caseId ? ("case" as const) : v.scope }))
  .refine((v) => v.scope === "institutional" || v.caseId, { message: "Case-specific coverage must be linked to a case.", path: ["caseId"] });
export type CoverageInput = z.infer<typeof coverageSchema>;

export const correctionSchema = z.object({
  correctionDate: requiredDate("Date"),
  description: required("Description", 2000),
});
export type CorrectionInput = z.infer<typeof correctionSchema>;

// ---------------------------------------------------------------------------
// Cases (step 5b-2)
// ---------------------------------------------------------------------------

export const caseSchema = z.object({
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug must be lowercase words separated by hyphens."),
  title: required("Title", 200),
  summary: required("Summary", 2000),
  locationContext: z.enum(caseLocationContexts),
  publicationJustification: required("Editorial justification", 2000).min(
    20,
    "Explain why this case is in the public interest (at least 20 characters).",
  ),
  collegeIds: z.array(z.string().uuid()).min(1, "Link the case to at least one institution."),
});
export type CaseInput = z.infer<typeof caseSchema>;

export const eventSchema = z.object({
  eventDate: requiredDate("Date"),
  datePrecision: z.enum(datePrecisions),
  sequence: z.coerce.number().int().min(-99).max(99).default(0),
  eventType: z.enum(caseEventTypes),
  description: required("Description", 3000),
  supersedesEventId: optionalUuid,
});
export type EventInput = z.infer<typeof eventSchema>;

/** Flattens zod issues into readable messages. */
/** Case monitoring (researcher-only). Search terms: one per line or comma-separated. */
export const caseMonitoringSchema = z.object({
  searchTerms: z
    .string()
    .optional()
    .transform((v) => [...new Set((v ?? "").split(/[\n,]/).map((t) => t.replace(/"/g, "").trim()).filter(Boolean))])
    .pipe(
      z
        .array(z.string().min(3, "Each search term needs at least 3 characters.").max(80, "Keep each search term under 80 characters."))
        .max(8, "Use at most 8 search terms."),
    ),
  nextCheckOn: isoDate,
  checkNotes: optional(2000),
});
export type CaseMonitoringInput = z.infer<typeof caseMonitoringSchema>;

export function problemsOf(error: z.ZodError): string[] {
  return error.issues.map((i) => i.message);
}
