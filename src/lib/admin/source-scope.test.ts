import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database } from "@/db/types";
import { scopeForColleges } from "@/lib/source-search";
import { createTestDb } from "@/test/db";
import { fixtures } from "@/test/fixtures";
import { collegesForRecord, sourceCollegeLinks } from "./queries";

let db: Database;
let close: () => Promise<void>;
beforeAll(async () => ({ db, close } = await createTestDb()));
afterAll(() => close());

describe("sources by college", () => {
  it("links sources through reports, citations, coverage and cases, and leaves unused ones out", async () => {
    const f = fixtures(db);
    const [a, b] = [await f.college(), await f.college()];
    const [asr, article, docket, policyDoc, unused] = await Promise.all([1, 2, 3, 4, 5].map(() => f.source()));
    const report = await f.report({ collegeId: a.id, sourceId: asr.id });
    const stat = await f.statistic({ cleryReportId: report.id });
    await f.coverage({ collegeId: a.id, sourceId: article.id });
    const response = await f.response({ collegeId: b.id });
    await f.citation({ sourceId: policyDoc.id, institutionalResponseId: response.id });
    const c = await f.case({ collegeIds: [a.id, b.id] });
    const event = await f.event({ caseId: c.id });
    await f.citation({ sourceId: docket.id, caseEventId: event.id });

    const links = await sourceCollegeLinks(db);
    const forCollege = (id: string) => links.filter((l) => l.collegeId === id).map((l) => l.sourceId).sort();
    expect(forCollege(a.id)).toEqual([asr.id, article.id, docket.id].sort());
    expect(forCollege(b.id)).toEqual([docket.id, policyDoc.id].sort());
    expect(links.some((l) => l.sourceId === unused.id)).toBe(false);

    expect(await collegesForRecord(db, "crime_statistic", stat.id)).toEqual([a.id]);
    expect(await collegesForRecord(db, "institutional_response", response.id)).toEqual([b.id]);
    expect((await collegesForRecord(db, "case_event", event.id)).sort()).toEqual([a.id, b.id].sort());
    expect(await collegesForRecord(db, "source", asr.id)).toEqual([]);

    const scope = scopeForColleges(links, [b.id], [asr.id, article.id, docket.id, policyDoc.id, unused.id]);
    expect(scope.relatedIds.sort()).toEqual([docket.id, policyDoc.id].sort());
    expect(scope.unusedIds).toEqual([unused.id]);
  });
});
