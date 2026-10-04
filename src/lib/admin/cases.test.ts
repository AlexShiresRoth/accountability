import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import * as s from "@/db/schema";
import type { Database } from "@/db/types";
import { getCase } from "@/lib/public/queries";
import { createTestDb } from "@/test/db";
import { fixtures } from "@/test/fixtures";
import { addCitation, createCase, createCaseCorrection, createCaseEvent, deleteRecord, updateCase, updateCaseEvent } from "./records";
import { caseSchema, eventSchema } from "./validation";
import { changeStatus, getStatus, verificationProblems } from "./workflow";

let db: Database;
let close: () => Promise<void>;
let f: ReturnType<typeof fixtures>;
const actor = "Researcher";

beforeAll(async () => {
  ({ db, close } = await createTestDb());
  f = fixtures(db);
});
afterAll(() => close());

const caseInput = (collegeIds: string[], o: Record<string, unknown> = {}) =>
  caseSchema.parse({
    slug: `case-${crypto.randomUUID().slice(0, 8)}`,
    title: "Civil suit over Title IX handling",
    summary: "A former student's civil suit alleges the university mishandled her report.",
    locationContext: "off_campus",
    publicationJustification: "Documents an institution's handling of a reported sexual assault through court records.",
    collegeIds,
    ...o,
  });

const eventInput = (o: Record<string, unknown> = {}) =>
  eventSchema.parse({ eventDate: "2026-09-14", datePrecision: "day", eventType: "civil_complaint", description: "The civil complaint alleges…", ...o });

async function created<T>(p: Promise<{ ok: true; value: T } | { ok: false; problems: string[] }>) {
  const r = await p;
  if (!r.ok) throw new Error(r.problems.join(" "));
  return r.value;
}

describe("case validation", () => {
  it("requires a justification and at least one institution", () => {
    expect(caseSchema.safeParse({ ...caseInput([crypto.randomUUID()]), publicationJustification: "short" }).success).toBe(false);
    expect(caseSchema.safeParse({ ...caseInput([crypto.randomUUID()]), collegeIds: [] }).success).toBe(false);
  });
});

describe("cases", () => {
  it("creates a draft case linked to its institutions", async () => {
    const a = await f.college();
    const b = await f.college();
    const id = await created(createCase(db, caseInput([a.id, b.id]), actor));
    const [row] = await db.select().from(s.cases).where(eq(s.cases.id, id));
    expect(row).toMatchObject({ status: "draft", createdBy: actor, locationContext: "off_campus" });
    const links = await db.select().from(s.caseColleges).where(eq(s.caseColleges.caseId, id));
    expect(links.map((l) => l.collegeId).sort()).toEqual([a.id, b.id].sort());
  });

  it("can't be verified without a verified, cited event", async () => {
    const college = await f.college();
    const id = await created(createCase(db, caseInput([college.id]), actor));
    expect(await verificationProblems(db, "case", id)).toEqual(["Verify at least one event (each event needs a citation to a verified source)."]);

    const eventId = await created(createCaseEvent(db, id, eventInput(), actor));
    expect(await changeStatus(db, { key: "case_event", id: eventId, to: "verified", actor })).toEqual({
      ok: false,
      problems: ["Add at least one citation to a verified source."],
    });
    const court = await f.source({ type: "court_record" });
    await addCitation(db, "case_event", eventId, { sourceId: court.id, pinpoint: "Complaint ¶ 4", excerpt: null, claim: null });
    expect(await changeStatus(db, { key: "case_event", id: eventId, to: "verified", actor })).toEqual({ ok: true });
    expect(await changeStatus(db, { key: "case", id, to: "verified", actor })).toEqual({ ok: true });
  });

  it("unpublishes a published case when its text or institutions change, but not on an identical save", async () => {
    const a = await f.college();
    const b = await f.college();
    const id = await created(createCase(db, caseInput([a.id]), actor));
    await db.update(s.cases).set({ status: "verified" }).where(eq(s.cases.id, id));
    const [row] = await db.select().from(s.cases).where(eq(s.cases.id, id));
    const same = caseInput([a.id], { slug: row.slug });

    expect(await updateCase(db, id, same, actor)).toMatchObject({ ok: true, unchanged: true });
    expect(await updateCase(db, id, { ...same, collegeIds: [a.id, b.id] }, actor)).toMatchObject({ ok: true, unpublished: true });
    expect(await getStatus(db, "case", id)).toBe("pending_review");
  });

  it("rejects a duplicate slug with a clear message", async () => {
    const college = await f.college();
    const input = caseInput([college.id]);
    await created(createCase(db, input, actor));
    expect(await createCase(db, input, actor)).toEqual({ ok: false, problems: [`The slug "${input.slug}" is already used.`] });
  });
});

describe("case events", () => {
  it("only updates an earlier event of the same case, never itself", async () => {
    const college = await f.college();
    const caseA = await created(createCase(db, caseInput([college.id]), actor));
    const caseB = await created(createCase(db, caseInput([college.id]), actor));
    const charge = await created(createCaseEvent(db, caseA, eventInput({ eventType: "criminal_charge" }), actor));
    const other = await created(createCaseEvent(db, caseB, eventInput(), actor));

    expect(await createCaseEvent(db, caseA, eventInput({ eventType: "dismissal", supersedesEventId: other }), actor)).toEqual({
      ok: false,
      problems: ["An event can only update another event in the same case."],
    });
    expect(await updateCaseEvent(db, charge, eventInput({ eventType: "criminal_charge", supersedesEventId: charge }), actor)).toEqual({
      ok: false,
      problems: ["An event can't update itself."],
    });
    const dismissal = await created(createCaseEvent(db, caseA, eventInput({ eventType: "dismissal", eventDate: "2026-12-01", supersedesEventId: charge }), actor));
    expect(dismissal).toBeTruthy();
  });

  it("unpublishes an edited published event", async () => {
    const college = await f.college();
    const caseId = await created(createCase(db, caseInput([college.id]), actor));
    const id = await created(createCaseEvent(db, caseId, eventInput(), actor));
    await db.update(s.caseEvents).set({ status: "verified" }).where(eq(s.caseEvents.id, id));
    expect(await updateCaseEvent(db, id, eventInput({ description: "Revised attribution." }), actor)).toMatchObject({ ok: true, unpublished: true });
  });
});

describe("case corrections and preview", () => {
  it("attaches corrections to the case and shows unverified content only in preview", async () => {
    const college = await f.college();
    const caseId = await created(createCase(db, caseInput([college.id]), actor));
    await created(createCaseEvent(db, caseId, eventInput(), actor));
    await created(createCaseCorrection(db, caseId, { correctionDate: "2026-10-03", description: "Filing date corrected." }, actor));
    const [row] = await db.select().from(s.cases).where(eq(s.cases.id, caseId));

    expect(await getCase({ db, hideDemo: true }, row.slug)).toBeNull();
    const preview = (await getCase({ db, hideDemo: true, preview: true }, row.slug))!;
    expect(preview.case.unverified).toBe(true);
    expect(preview.events.map((e) => e.unverified)).toEqual([true]);
    expect(preview.corrections.map((c) => c.description)).toEqual(["Filing date corrected."]);
  });

  it("deletes a draft case together with its events and links", async () => {
    const college = await f.college();
    const caseId = await created(createCase(db, caseInput([college.id]), actor));
    await created(createCaseEvent(db, caseId, eventInput(), actor));
    expect(await deleteRecord(db, "case", caseId)).toMatchObject({ ok: true });
    expect(await db.select().from(s.caseEvents).where(eq(s.caseEvents.caseId, caseId))).toEqual([]);
  });
});
