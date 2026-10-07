"use server";
// Server actions for the research interface. Every action is a public POST endpoint:
// each one checks the session itself, validates input, and delegates to src/lib/admin.

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { FormState } from "@/components/admin/action-form";
import { db } from "@/db";
import { acceptCandidate, dismissCandidate } from "@/lib/admin/inbox";
import {
  addCitation,
  createCollege,
  createCase,
  createCaseCorrection,
  createCaseEvent,
  createCollegeRecord,
  isCollegeRecordKey,
  updateCase,
  updateCaseEvent,
  updateCollegeRecord,
  type CollegeRecordInput,
  type CollegeRecordKey,
  createFootnote,
  createReport,
  createSource,
  deleteRecord,
  isCitableKey,
  parseStatisticsGrid,
  removeCitation,
  saveStatisticsGrid,
  setFootnoteLinks,
  updateCollege,
  updateFootnote,
  updateReport,
  updateSource,
  type MutationResult,
} from "@/lib/admin/records";
import { markCaseChecked, updateCaseMonitoring } from "@/lib/admin/monitoring";
import { requireResearcher } from "@/lib/admin/session";
import {
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  adminPasswordProblem,
  createSessionToken,
  passwordMatches,
} from "@/lib/admin/session-token";
import {
  acceptCandidateSchema,
  actionSchema,
  caseSchema,
  citationSchema,
  collegeSchema,
  correctionSchema,
  coverageSchema,
  eventSchema,
  policySchema,
  resourceSchema,
  responseSchema,
  footnoteSchema,
  caseMonitoringSchema,
  formValues,
  problemsOf,
  reportSchema,
  sourceSchema,
  statusChangeSchema,
} from "@/lib/admin/validation";
import { changeStatus, isReviewTableKey, verifyReportWithContents } from "@/lib/admin/workflow";

/** Public pages are cached; any admin write may change them. The site is small, so refresh everything. */
function refreshPublic() {
  revalidatePath("/", "layout");
}

function toState(result: MutationResult<unknown>, message: string): FormState {
  if (!result.ok) return { problems: result.problems };
  if (result.unchanged) return { ok: true, message: "No changes to save." };
  refreshPublic();
  return {
    ok: true,
    message: result.unpublished ? `${message} This record was unpublished and needs re-verification.` : message,
  };
}

// ---------------------------------------------------------------------------
// Session
// ---------------------------------------------------------------------------

export async function loginAction(_prev: FormState, form: FormData): Promise<FormState> {
  const name = String(form.get("name") ?? "").trim().slice(0, 80);
  const password = String(form.get("password") ?? "");
  const problem = adminPasswordProblem(process.env.ADMIN_PASSWORD);
  if (problem) return { problems: [`Admin sign-in is disabled: ${problem}`] };
  if (!name) return { problems: ["Enter your name. It is recorded with every change you make."] };
  if (!passwordMatches(password, process.env.ADMIN_PASSWORD)) {
    await new Promise((r) => setTimeout(r, 750));
    return { problems: ["Incorrect password."] };
  }
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) return { problems: ["Admin sign-in is disabled: ADMIN_SESSION_SECRET is not configured."] };

  (await cookies()).set(SESSION_COOKIE, createSessionToken(name, secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  redirect("/admin");
}

export async function logoutAction() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

// ---------------------------------------------------------------------------
// Workflow
// ---------------------------------------------------------------------------

export async function changeStatusAction(key: string, id: string, _prev: FormState, form: FormData): Promise<FormState> {
  const { name } = await requireResearcher();
  if (!isReviewTableKey(key)) return { problems: ["Unknown record type."] };
  const parsed = statusChangeSchema.safeParse(formValues(form));
  if (!parsed.success) return { problems: problemsOf(parsed.error) };

  if (key === "clery_report" && parsed.data.to === "verified" && form.get("withContents") === "on") {
    const result = await verifyReportWithContents(db, { reportId: id, actor: name, note: parsed.data.note });
    if (!result.ok) return { problems: result.problems };
    refreshPublic();
    return { ok: true, message: `Report verified, with ${result.verified} figure(s) and note(s).` };
  }

  const result = await changeStatus(db, { key, id, to: parsed.data.to, actor: name, note: parsed.data.note });
  if (!result.ok) return { problems: result.problems };
  refreshPublic();
  return { ok: true, message: "Status updated." };
}

export async function deleteRecordAction(key: string, id: string, redirectTo: string, _prev: FormState): Promise<FormState> {
  await requireResearcher();
  if (!isReviewTableKey(key)) return { problems: ["Unknown record type."] };
  const result = await deleteRecord(db, key, id);
  if (!result.ok) return { problems: result.problems };
  refreshPublic();
  redirect(`${redirectTo}${redirectTo.includes("?") ? "&" : "?"}notice=deleted`);
}

export async function addCitationAction(key: string, id: string, _prev: FormState, form: FormData): Promise<FormState> {
  await requireResearcher();
  if (!isCitableKey(key)) return { problems: ["This record type does not take citations."] };
  const parsed = citationSchema.safeParse(formValues(form));
  if (!parsed.success) return { problems: problemsOf(parsed.error) };
  return toState(await addCitation(db, key, id, parsed.data), "Citation added.");
}

export async function removeCitationAction(citationId: string, _prev: FormState): Promise<FormState> {
  const { name } = await requireResearcher();
  return toState(await removeCitation(db, citationId, name), "Citation removed.");
}

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

export async function createSourceAction(_prev: FormState, form: FormData): Promise<FormState> {
  const { name } = await requireResearcher();
  const parsed = sourceSchema.safeParse(formValues(form));
  if (!parsed.success) return { problems: problemsOf(parsed.error) };
  const result = await createSource(db, parsed.data, name);
  if (!result.ok) return { problems: result.problems };
  redirect(`/admin/sources/${result.value}?notice=source-created`);
}

export async function updateSourceAction(id: string, _prev: FormState, form: FormData): Promise<FormState> {
  const { name } = await requireResearcher();
  const parsed = sourceSchema.safeParse(formValues(form));
  if (!parsed.success) return { problems: problemsOf(parsed.error) };
  return toState(await updateSource(db, id, parsed.data, name), "Saved.");
}

// ---------------------------------------------------------------------------
// Colleges and reports
// ---------------------------------------------------------------------------

export async function createCollegeAction(_prev: FormState, form: FormData): Promise<FormState> {
  const { name } = await requireResearcher();
  const parsed = collegeSchema.safeParse(formValues(form));
  if (!parsed.success) return { problems: problemsOf(parsed.error) };
  const result = await createCollege(db, parsed.data, name);
  if (!result.ok) return { problems: result.problems };
  redirect(`/admin/colleges/${result.value}?notice=college-created`);
}

export async function updateCollegeAction(id: string, _prev: FormState, form: FormData): Promise<FormState> {
  const { name } = await requireResearcher();
  const parsed = collegeSchema.safeParse(formValues(form));
  if (!parsed.success) return { problems: problemsOf(parsed.error) };
  return toState(await updateCollege(db, id, parsed.data, name), "Saved.");
}

export async function createReportAction(collegeId: string, _prev: FormState, form: FormData): Promise<FormState> {
  const { name } = await requireResearcher();
  const parsed = reportSchema.safeParse({ ...formValues(form), collegeId });
  if (!parsed.success) return { problems: problemsOf(parsed.error) };
  const result = await createReport(db, parsed.data, name);
  if (!result.ok) return { problems: result.problems };
  redirect(`/admin/reports/${result.value}?notice=report-created`);
}

export async function updateReportAction(id: string, collegeId: string, _prev: FormState, form: FormData): Promise<FormState> {
  const { name } = await requireResearcher();
  const parsed = reportSchema.safeParse({ ...formValues(form), collegeId });
  if (!parsed.success) return { problems: problemsOf(parsed.error) };
  const { reportYear, title, sourceId } = parsed.data;
  return toState(await updateReport(db, id, { reportYear, title, sourceId }, name), "Saved.");
}

export async function saveGridAction(reportId: string, _prev: FormState, form: FormData): Promise<FormState> {
  const { name } = await requireResearcher();
  const { entries, errors } = parseStatisticsGrid(form.entries());
  if (errors.length) return { problems: errors };
  const result = await saveStatisticsGrid(db, reportId, entries, name);
  if (!result.ok) return { problems: result.problems };
  const { created, updated, deleted, unpublished } = result.value;
  // Nothing changed: skip the cache refresh, which would re-render this page for no reason.
  if (created + updated + deleted === 0) return { ok: true, message: "No changes to save." };
  refreshPublic();
  const parts = [`${created} added`, `${updated} changed`, `${deleted} removed`];
  return {
    ok: true,
    message: `Saved: ${parts.join(", ")}.${unpublished ? ` ${unpublished} published figure(s) now need re-verification.` : ""}`,
  };
}

export async function createFootnoteAction(reportId: string, _prev: FormState, form: FormData): Promise<FormState> {
  const { name } = await requireResearcher();
  const parsed = footnoteSchema.safeParse(formValues(form));
  if (!parsed.success) return { problems: problemsOf(parsed.error) };
  return toState(await createFootnote(db, reportId, parsed.data, name), "Footnote added. Link it to the figures it applies to.");
}

export async function updateFootnoteAction(id: string, _prev: FormState, form: FormData): Promise<FormState> {
  const { name } = await requireResearcher();
  const parsed = footnoteSchema.safeParse(formValues(form));
  if (!parsed.success) return { problems: problemsOf(parsed.error) };
  return toState(await updateFootnote(db, id, parsed.data, name), "Footnote saved.");
}

export async function setFootnoteLinksAction(footnoteId: string, _prev: FormState, form: FormData): Promise<FormState> {
  const { name } = await requireResearcher();
  const ids = form.getAll("stat").filter((v): v is string => typeof v === "string");
  return toState(await setFootnoteLinks(db, footnoteId, ids, name), "Links saved.");
}

// ---------------------------------------------------------------------------
// Inbox
// ---------------------------------------------------------------------------

export async function dismissCandidateAction(id: string, _prev: FormState): Promise<FormState> {
  const { name } = await requireResearcher();
  const result = await dismissCandidate(db, id, name);
  if (!result.ok) return { problems: result.problems };
  revalidatePath("/admin/inbox");
  return { ok: true, message: "Dismissed." };
}

export async function acceptCandidateAction(id: string, _prev: FormState, form: FormData): Promise<FormState> {
  const { name } = await requireResearcher();
  const parsed = acceptCandidateSchema.safeParse(formValues(form));
  if (!parsed.success) return { problems: problemsOf(parsed.error) };
  const result = await acceptCandidate(db, id, parsed.data, name);
  if (!result.ok) return { problems: result.problems };
  const sourceOnly = result.value.coverageId === null;
  redirect(`/admin/sources/${result.value.sourceId}?notice=${sourceOnly ? "candidate-source" : "candidate-accepted"}&accepted=${sourceOnly ? "source" : "1"}`);
}

// ---------------------------------------------------------------------------
// Institutional record: timeline entries, responses, policies, resources, coverage, corrections
// ---------------------------------------------------------------------------

const recordSchemas = {
  institution_action: actionSchema,
  institutional_response: responseSchema,
  policy: policySchema,
  student_resource: resourceSchema,
  college_coverage: coverageSchema,
  correction: correctionSchema,
} satisfies Record<CollegeRecordKey, unknown>;

function parseRecord<K extends CollegeRecordKey>(key: K, form: FormData) {
  return recordSchemas[key].safeParse(formValues(form)) as
    | { success: true; data: CollegeRecordInput[K] }
    | { success: false; error: Parameters<typeof problemsOf>[0] };
}

export async function createCollegeRecordAction(key: string, collegeId: string, _prev: FormState, form: FormData): Promise<FormState> {
  const { name } = await requireResearcher();
  if (!isCollegeRecordKey(key)) return { problems: ["Unknown record type."] };
  const parsed = parseRecord(key, form);
  if (!parsed.success) return { problems: problemsOf(parsed.error) };
  const result = await createCollegeRecord(db, key, collegeId, parsed.data, name);
  if (!result.ok) return { problems: result.problems };
  redirect(`/admin/records/${key}/${result.value}?notice=record-created`);
}

export async function updateCollegeRecordAction(key: string, id: string, _prev: FormState, form: FormData): Promise<FormState> {
  const { name } = await requireResearcher();
  if (!isCollegeRecordKey(key)) return { problems: ["Unknown record type."] };
  const parsed = parseRecord(key, form);
  if (!parsed.success) return { problems: problemsOf(parsed.error) };
  return toState(await updateCollegeRecord(db, key, id, parsed.data, name), "Saved.");
}

// ---------------------------------------------------------------------------
// Cases
// ---------------------------------------------------------------------------

function parseCase(form: FormData) {
  const collegeIds = form.getAll("collegeIds").filter((v): v is string => typeof v === "string");
  return caseSchema.safeParse({ ...formValues(form), collegeIds });
}

export async function createCaseAction(_prev: FormState, form: FormData): Promise<FormState> {
  const { name } = await requireResearcher();
  const parsed = parseCase(form);
  if (!parsed.success) return { problems: problemsOf(parsed.error) };
  const result = await createCase(db, parsed.data, name);
  if (!result.ok) return { problems: result.problems };
  redirect(`/admin/cases/${result.value}?notice=case-created`);
}

export async function updateCaseAction(id: string, _prev: FormState, form: FormData): Promise<FormState> {
  const { name } = await requireResearcher();
  const parsed = parseCase(form);
  if (!parsed.success) return { problems: problemsOf(parsed.error) };
  return toState(await updateCase(db, id, parsed.data, name), "Saved.");
}

/** Researcher-only monitoring fields: no public page changes, so nothing is revalidated publicly. */
export async function updateCaseMonitoringAction(caseId: string, _prev: FormState, form: FormData): Promise<FormState> {
  await requireResearcher();
  const parsed = caseMonitoringSchema.safeParse(formValues(form));
  if (!parsed.success) return { problems: problemsOf(parsed.error) };
  const result = await updateCaseMonitoring(db, caseId, parsed.data);
  if (!result.ok) return { problems: result.problems };
  revalidatePath(`/admin/cases/${caseId}`);
  return { ok: true, message: result.unchanged ? "No changes to save." : "Monitoring saved." };
}

export async function markCaseCheckedAction(caseId: string): Promise<FormState> {
  await requireResearcher();
  const result = await markCaseChecked(db, caseId);
  if (!result.ok) return { problems: result.problems };
  revalidatePath(`/admin/cases/${caseId}`);
  revalidatePath("/admin");
  return { ok: true, message: "Marked as checked today." };
}

export async function createCaseEventAction(caseId: string, _prev: FormState, form: FormData): Promise<FormState> {
  const { name } = await requireResearcher();
  const parsed = eventSchema.safeParse(formValues(form));
  if (!parsed.success) return { problems: problemsOf(parsed.error) };
  const result = await createCaseEvent(db, caseId, parsed.data, name);
  if (!result.ok) return { problems: result.problems };
  redirect(`/admin/cases/${caseId}/events/${result.value}?notice=record-created`);
}

export async function updateCaseEventAction(id: string, _prev: FormState, form: FormData): Promise<FormState> {
  const { name } = await requireResearcher();
  const parsed = eventSchema.safeParse(formValues(form));
  if (!parsed.success) return { problems: problemsOf(parsed.error) };
  return toState(await updateCaseEvent(db, id, parsed.data, name), "Saved.");
}

export async function createCaseCorrectionAction(caseId: string, _prev: FormState, form: FormData): Promise<FormState> {
  const { name } = await requireResearcher();
  const parsed = correctionSchema.safeParse(formValues(form));
  if (!parsed.success) return { problems: problemsOf(parsed.error) };
  const result = await createCaseCorrection(db, caseId, parsed.data, name);
  if (!result.ok) return { problems: result.problems };
  redirect(`/admin/records/correction/${result.value}?notice=record-created`);
}
