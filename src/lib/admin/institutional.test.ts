import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import * as s from "@/db/schema";
import type { Database } from "@/db/types";
import { getCollegeProfile } from "@/lib/public/queries";
import { createTestDb } from "@/test/db";
import { fixtures } from "@/test/fixtures";
import { addCitation, createCollegeRecord, removeCitation, updateCollegeRecord } from "./records";
import { actionSchema, coverageSchema, resourceSchema, responseSchema } from "./validation";
import { changeStatus, getStatus } from "./workflow";

let db: Database;
let close: () => Promise<void>;
let f: ReturnType<typeof fixtures>;
const actor = "Researcher";

beforeAll(async () => {
  ({ db, close } = await createTestDb());
  f = fixtures(db);
});
afterAll(() => close());

const action = actionSchema.parse({
  actionDate: "2024-05-01",
  datePrecision: "month",
  actionType: "policy_change",
  title: "Revised sexual misconduct policy",
  description: "The university published a revised policy.",
});

describe("institutional records", () => {
  it("creates records as drafts attributed to the researcher", async () => {
    const college = await f.college();
    const res = await createCollegeRecord(db, "institution_action", college.id, action, actor);
    expect(res.ok).toBe(true);
    const [row] = await db.select().from(s.institutionActions).where(eq(s.institutionActions.id, (res as { value: string }).value));
    expect(row).toMatchObject({ status: "draft", createdBy: actor, collegeId: college.id, datePrecision: "month" });
  });

  it("requires a citation to a verified source before verification, then publishes", async () => {
    const college = await f.college();
    const id = ((await createCollegeRecord(db, "institution_action", college.id, action, actor)) as { value: string }).value;
    expect(await changeStatus(db, { key: "institution_action", id, to: "verified", actor })).toEqual({
      ok: false,
      problems: ["Add at least one citation to a verified source."],
    });
    const src = await f.source();
    await addCitation(db, "institution_action", id, { sourceId: src.id, pinpoint: "§ 2", excerpt: null, claim: null });
    expect(await changeStatus(db, { key: "institution_action", id, to: "verified", actor })).toEqual({ ok: true });
    expect((await getCollegeProfile({ db, hideDemo: true }, college.slug))!.actions.map((a) => a.id)).toEqual([id]);
  });

  it("unpublishes an edited published record, and treats an identical save as no change", async () => {
    const college = await f.college();
    const src = await f.source();
    const id = ((await createCollegeRecord(db, "institutional_response", college.id, responseSchema.parse({ topic: "title_ix_process", findingKind: "documented", summary: "The policy describes hearings." }), actor)) as { value: string }).value;
    await addCitation(db, "institutional_response", id, { sourceId: src.id, pinpoint: null, excerpt: null, claim: null });
    await changeStatus(db, { key: "institutional_response", id, to: "verified", actor });

    const same = responseSchema.parse({ topic: "title_ix_process", findingKind: "documented", summary: "The policy describes hearings." });
    expect(await updateCollegeRecord(db, "institutional_response", id, same, actor)).toMatchObject({ ok: true, unchanged: true });
    expect(await getStatus(db, "institutional_response", id)).toBe("verified");

    expect(await updateCollegeRecord(db, "institutional_response", id, { ...same, summary: "Changed." }, actor)).toMatchObject({ ok: true, unpublished: true });
    expect(await getStatus(db, "institutional_response", id)).toBe("pending_review");
  });

  it("unpublishes a resource when its only citation is removed", async () => {
    const college = await f.college();
    const src = await f.source();
    const input = resourceSchema.parse({ category: "counseling", confidentiality: "confidential", name: "Counseling", available247: "yes" });
    expect(input.available247).toBe(true);
    const id = ((await createCollegeRecord(db, "student_resource", college.id, input, actor)) as { value: string }).value;
    const cite = await addCitation(db, "student_resource", id, { sourceId: src.id, pinpoint: null, excerpt: null, claim: null });
    await changeStatus(db, { key: "student_resource", id, to: "verified", actor });
    expect(await removeCitation(db, (cite as { value: string }).value, actor)).toMatchObject({ ok: true, unpublished: true });
  });
});

describe("coverage", () => {
  it("can be verified only once its article source is verified", async () => {
    const college = await f.college();
    const article = await f.source({ type: "reputable_journalism", status: "pending_review" });
    const input = coverageSchema.parse({ sourceId: article.id, scope: "institutional", topic: "policy_change", summary: "Reports on the revised Title IX procedures." });
    const id = ((await createCollegeRecord(db, "college_coverage", college.id, input, actor)) as { value: string }).value;

    expect(await changeStatus(db, { key: "college_coverage", id, to: "verified", actor })).toEqual({
      ok: false,
      problems: ["Verify the article's source record first."],
    });
    await db.update(s.sources).set({ status: "verified" }).where(eq(s.sources.id, article.id));
    expect(await changeStatus(db, { key: "college_coverage", id, to: "verified", actor })).toEqual({ ok: true });
  });

  it("treats a chosen case as case-specific coverage, and requires a case for case scope", () => {
    const base = { sourceId: crypto.randomUUID(), topic: "lawsuit", summary: "Reports on a civil suit against the university." };
    const caseId = crypto.randomUUID();
    // Choosing a case with "Institution-level" still selected used to drop the case silently.
    expect(coverageSchema.parse({ ...base, scope: "institutional", caseId })).toMatchObject({ scope: "case", caseId });
    expect(coverageSchema.parse({ ...base, scope: "institutional", caseId: "" })).toMatchObject({ scope: "institutional", caseId: null });
    expect(coverageSchema.safeParse({ ...base, scope: "case" }).success).toBe(false);
  });

  it("saves a case chosen on an existing institution-level entry, and clearing it makes the entry institutional again", async () => {
    const college = await f.college();
    const article = await f.source({ type: "reputable_journalism" });
    const c = await f.case({ collegeIds: [college.id] });
    const form = { sourceId: article.id, topic: "lawsuit", summary: "Reports on a civil suit against the university." };
    const id = ((await createCollegeRecord(db, "college_coverage", college.id, coverageSchema.parse({ ...form, scope: "institutional" }), actor)) as { value: string }).value;
    const stored = async () => (await db.select().from(s.collegeCoverage).where(eq(s.collegeCoverage.id, id)))[0];

    // The researcher picks the case but leaves Scope on "Institution-level", then saves.
    expect(await updateCollegeRecord(db, "college_coverage", id, coverageSchema.parse({ ...form, scope: "institutional", caseId: c.id }), actor)).toMatchObject({ ok: true });
    expect(await stored()).toMatchObject({ scope: "case", caseId: c.id });

    expect(await updateCollegeRecord(db, "college_coverage", id, coverageSchema.parse({ ...form, scope: "institutional", caseId: "" }), actor)).toMatchObject({ ok: true });
    expect(await stored()).toMatchObject({ scope: "institutional", caseId: null });
  });

  it("reports a missing referenced record instead of crashing", async () => {
    const college = await f.college();
    const src = await f.source();
    const input = coverageSchema.parse({ sourceId: src.id, scope: "case", caseId: crypto.randomUUID(), topic: "lawsuit", summary: "Reports on a civil suit against the university." });
    expect(await createCollegeRecord(db, "college_coverage", college.id, input, actor)).toEqual({
      ok: false,
      problems: ["A selected source, case, or timeline entry no longer exists."],
    });
  });
});

describe("corrections", () => {
  it("need a citation to be verified, like other claims", async () => {
    const college = await f.college();
    const id = ((await createCollegeRecord(db, "correction", college.id, { correctionDate: "2026-10-01", description: "An earlier figure was misread." }, actor)) as { value: string }).value;
    expect(await changeStatus(db, { key: "correction", id, to: "verified", actor })).toMatchObject({ ok: false });
  });
});
