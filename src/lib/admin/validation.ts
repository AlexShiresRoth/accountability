// Input validation for admin forms. Form values arrive as strings; empty strings become null.
import { z } from "zod";
import { coverageScopes, coverageTopics, sourceTypes, verificationStatuses } from "@/lib/enums";

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
    collegeId: uuid("College"),
    scope: z.enum(coverageScopes),
    caseId: z
      .string()
      .optional()
      .transform((v) => v?.trim() || null),
    topic: z.enum(coverageTopics),
    summary: required("Summary", 600).min(20, "Write a neutral one-sentence summary (at least 20 characters)."),
    sourceType: z.enum(sourceTypes),
    publisher: required("Publisher"),
    title: required("Title", 1000),
    publicationDate: isoDate,
  })
  .refine((v) => v.scope === "institutional" || v.caseId, { message: "Case-specific coverage must be linked to a case.", path: ["caseId"] })
  .refine((v) => v.summary.toLowerCase() !== v.title.toLowerCase(), {
    message: "Write your own neutral summary rather than repeating the headline.",
    path: ["summary"],
  });
export type AcceptCandidateInput = z.infer<typeof acceptCandidateSchema>;

/** Flattens zod issues into readable messages. */
export function problemsOf(error: z.ZodError): string[] {
  return error.issues.map((i) => i.message);
}
