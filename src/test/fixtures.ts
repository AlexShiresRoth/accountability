// Minimal record builders for tests. Records default to `verified` so each test states only what it is testing.
import { randomUUID } from "node:crypto";
import * as s from "@/db/schema";
import type { Database } from "@/db/types";

const uid = () => randomUUID().slice(0, 8);
type Insert<T extends { $inferInsert: unknown }> = Partial<T["$inferInsert"]>;

export function fixtures(db: Database) {
  return {
    source: (o: Insert<typeof s.sources> = {}) =>
      db
        .insert(s.sources)
        .values({
          type: "university",
          publisher: "Test Publisher",
          title: `Source ${uid()}`,
          url: `https://example.org/${uid()}`,
          status: "verified",
          ...o,
        })
        .returning()
        .then((r) => r[0]),

    college: (o: Insert<typeof s.colleges> = {}) =>
      db
        .insert(s.colleges)
        .values({ slug: `college-${uid()}`, name: `Test College ${uid()}`, status: "verified", ...o })
        .returning()
        .then((r) => r[0]),

    report: (o: Insert<typeof s.cleryReports> & { collegeId: string; sourceId: string }) =>
      db
        .insert(s.cleryReports)
        .values({ reportYear: 2025, title: "Annual Security Report", status: "verified", ...o })
        .returning()
        .then((r) => r[0]),

    statistic: (o: Insert<typeof s.crimeStatistics> & { cleryReportId: string }) =>
      db
        .insert(s.crimeStatistics)
        .values({ calendarYear: 2024, offense: "rape", geography: "on_campus", count: 1, status: "verified", ...o })
        .returning()
        .then((r) => r[0]),

    footnote: (o: Insert<typeof s.statisticFootnotes> & { cleryReportId: string }) =>
      db
        .insert(s.statisticFootnotes)
        .values({ originalText: "Footnote text.", marker: "*", status: "verified", ...o })
        .returning()
        .then((r) => r[0]),

    link: (footnote: { id: string; cleryReportId: string }, statistic: { id: string; cleryReportId: string }) =>
      db.insert(s.statisticFootnoteLinks).values({
        footnoteId: footnote.id,
        crimeStatisticId: statistic.id,
        cleryReportId: footnote.cleryReportId,
      }),

    case: async (o: Insert<typeof s.cases> & { collegeIds?: string[] } = {}) => {
      const { collegeIds = [], ...values } = o;
      const [row] = await db
        .insert(s.cases)
        .values({
          slug: `case-${uid()}`,
          title: `Case ${uid()}`,
          summary: "Summary.",
          publicationJustification: "Test justification.",
          status: "verified",
          ...values,
        })
        .returning();
      if (collegeIds.length) {
        await db.insert(s.caseColleges).values(collegeIds.map((collegeId) => ({ caseId: row.id, collegeId })));
      }
      return row;
    },

    event: (o: Insert<typeof s.caseEvents> & { caseId: string }) =>
      db
        .insert(s.caseEvents)
        .values({ eventDate: "2024-01-01", eventType: "police_report", description: "Police records state…", status: "verified", ...o })
        .returning()
        .then((r) => r[0]),

    action: (o: Insert<typeof s.institutionActions> & { collegeId: string }) =>
      db
        .insert(s.institutionActions)
        .values({ actionDate: "2024-01-01", actionType: "policy_change", title: "Action", description: "Description.", status: "verified", ...o })
        .returning()
        .then((r) => r[0]),

    response: (o: Insert<typeof s.institutionalResponses> & { collegeId: string }) =>
      db
        .insert(s.institutionalResponses)
        .values({ topic: "title_ix_process", findingKind: "documented", summary: "Summary.", status: "verified", ...o })
        .returning()
        .then((r) => r[0]),

    policy: (o: Insert<typeof s.policies> & { collegeId: string }) =>
      db
        .insert(s.policies)
        .values({ policyType: "title_ix", title: "Policy", status: "verified", ...o })
        .returning()
        .then((r) => r[0]),

    resource: (o: Insert<typeof s.studentResources> & { collegeId: string }) =>
      db
        .insert(s.studentResources)
        .values({ category: "counseling", name: "Counseling Center", status: "verified", ...o })
        .returning()
        .then((r) => r[0]),

    coverage: (o: Insert<typeof s.collegeCoverage> & { collegeId: string; sourceId: string }) =>
      db
        .insert(s.collegeCoverage)
        .values({ scope: "institutional", topic: "policy_change", summary: "Coverage summary.", status: "verified", ...o })
        .returning()
        .then((r) => r[0]),

    correction: (o: Insert<typeof s.corrections>) =>
      db
        .insert(s.corrections)
        .values({ correctionDate: "2025-01-01", description: "Correction.", status: "verified", ...o })
        .returning()
        .then((r) => r[0]),

    citation: (o: Insert<typeof s.citations> & { sourceId: string }) =>
      db
        .insert(s.citations)
        .values({ ...o })
        .returning()
        .then((r) => r[0]),
  };
}
