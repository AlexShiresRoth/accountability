// Development seed data. See scripts/seed.ts for the guarded entry point.
//
// - Real institutions: identity fields only (name, slug, location), status `draft`.
//   They stay private until a researcher verifies them against a source.
// - Demo University: a fully populated DEVELOPMENT FIXTURE (is_demo = true) for building and testing the UI.
//   Every value is synthetic. Demo records are hidden whenever NODE_ENV=production or HIDE_DEMO_DATA=true.
//
// Re-running is safe: real colleges are inserted if missing; demo records are deleted and recreated.

import { eq, inArray } from "drizzle-orm";
import * as s from "./schema";
import type { Database } from "./types";

const DEMO = "DEMO DATA — NOT FOR PUBLICATION.";

export async function seedDevelopment(db: Database) {
  await db.transaction(async (tx) => {
    // --- Real institutions: identity only, unverified -----------------------------------------
    await tx
      .insert(s.colleges)
      .values([
        { slug: "cornell-university", name: "Cornell University", aliases: ["Cornell"], city: "Ithaca", state: "NY" },
        {
          slug: "harvard-university",
          name: "Harvard University",
          aliases: ["Harvard", "Harvard College"],
          city: "Cambridge",
          state: "MA",
        },
        {
          slug: "columbia-university",
          name: "Columbia University",
          aliases: ["Columbia", "Columbia University in the City of New York"],
          city: "New York",
          state: "NY",
        },
      ])
      .onConflictDoNothing({ target: s.colleges.slug });

    await deleteDemo(tx as unknown as Tx);
    await createDemo(tx as unknown as Tx);
  });
}

type Tx = Database;

async function deleteDemo(tx: Tx) {
  const demoColleges = await tx.select({ id: s.colleges.id }).from(s.colleges).where(eq(s.colleges.isDemo, true));
  const collegeIds = demoColleges.map((c) => c.id);
  const demoCases = await tx.select({ id: s.cases.id }).from(s.cases).where(eq(s.cases.isDemo, true));
  const caseIds = demoCases.map((c) => c.id);

  // Children first; most cascade from their parents, but college/source FKs are RESTRICT by design.
  await tx.delete(s.collegeCoverage).where(eq(s.collegeCoverage.isDemo, true));
  await tx.delete(s.corrections).where(eq(s.corrections.isDemo, true));
  if (caseIds.length) await tx.delete(s.cases).where(inArray(s.cases.id, caseIds));
  await tx.delete(s.institutionActions).where(eq(s.institutionActions.isDemo, true));
  await tx.delete(s.institutionalResponses).where(eq(s.institutionalResponses.isDemo, true));
  await tx.delete(s.policies).where(eq(s.policies.isDemo, true));
  await tx.delete(s.studentResources).where(eq(s.studentResources.isDemo, true));
  await tx.delete(s.cleryReports).where(eq(s.cleryReports.isDemo, true));
  if (collegeIds.length) {
    await tx.delete(s.citations).where(inArray(s.citations.collegeId, collegeIds));
    await tx.delete(s.colleges).where(inArray(s.colleges.id, collegeIds));
  }
  // Any remaining citations of demo sources (e.g. attached to non-demo records by hand) block deletion by design.
  const demoSources = await tx.select({ id: s.sources.id }).from(s.sources).where(eq(s.sources.isDemo, true));
  if (demoSources.length) {
    await tx.delete(s.citations).where(inArray(s.citations.sourceId, demoSources.map((x) => x.id)));
    await tx.delete(s.sources).where(eq(s.sources.isDemo, true));
  }
}

async function createDemo(tx: Tx) {
  const demo = { isDemo: true, status: "verified" as const, reviewedBy: "seed script", reviewedAt: new Date() };

  const [college] = await tx
    .insert(s.colleges)
    .values({
      ...demo,
      slug: "demo-university",
      name: "Demo University",
      aliases: ["Demo U"],
      city: "Exampleton",
      state: "ZZ",
      enrollment: 10000,
      enrollmentNote: `${DEMO} Synthetic enrollment figure.`,
      lastReviewedAt: "2026-01-01",
    })
    .returning();

  const source = async (o: Partial<typeof s.sources.$inferInsert> & { title: string }) =>
    (
      await tx
        .insert(s.sources)
        .values({
          ...demo,
          type: "university",
          publisher: "Demo University (fixture)",
          url: `https://example.org/demo/${o.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
          retrievedAt: "2026-01-01",
          notes: DEMO,
          ...o,
          title: `[DEMO] ${o.title}`,
        })
        .returning()
    )[0];

  const asr2024 = await source({ title: "Annual Security Report 2024", publicationDate: "2024-10-01" });
  const asr2025 = await source({ title: "Annual Security Report 2025", publicationDate: "2025-10-01" });
  const policyDoc = await source({ title: "Sexual Misconduct Policy", publicationDate: "2025-08-15" });
  const agency = await source({
    title: "Agency Resolution Letter",
    type: "government_investigation",
    publisher: "Demo Agency (fixture)",
    publicationDate: "2023-05-01",
  });
  const court = await source({
    title: "Civil Docket, Doe v. Demo University",
    type: "court_record",
    publisher: "Demo County Court (fixture)",
    publicationDate: "2024-02-01",
  });
  const article = await source({
    title: "Demo Gazette article on policy revision",
    type: "reputable_journalism",
    publisher: "The Demo Gazette (fixture)",
    publicationDate: "2025-09-01",
  });

  // --- Clery statistics: two overlapping reports, one revised figure, one delayed-report footnote ----
  const [r2024] = await tx
    .insert(s.cleryReports)
    .values({ ...demo, collegeId: college.id, reportYear: 2024, title: "[DEMO] Annual Security Report 2024", sourceId: asr2024.id })
    .returning();
  const [r2025] = await tx
    .insert(s.cleryReports)
    .values({ ...demo, collegeId: college.id, reportYear: 2025, title: "[DEMO] Annual Security Report 2025", sourceId: asr2025.id })
    .returning();

  type Cell = [year: number, offense: (typeof s.offense.enumValues)[number], geo: (typeof s.cleryGeography.enumValues)[number], count: number | null];
  const cells2024: Cell[] = [
    [2021, "rape", "on_campus", 3], [2021, "rape", "on_campus_residential", 2], [2021, "fondling", "on_campus", 4],
    [2021, "dating_violence", "on_campus", 2], [2021, "domestic_violence", "on_campus", 1], [2021, "stalking", "on_campus", 3],
    [2022, "rape", "on_campus", 4], [2022, "rape", "on_campus_residential", 3], [2022, "fondling", "on_campus", 5],
    [2022, "dating_violence", "on_campus", 3], [2022, "domestic_violence", "on_campus", 1], [2022, "stalking", "on_campus", 4],
    [2023, "rape", "on_campus", 11], [2023, "rape", "on_campus_residential", 9], [2023, "fondling", "on_campus", 4],
    [2023, "dating_violence", "on_campus", 2], [2023, "domestic_violence", "on_campus", 0], [2023, "stalking", "on_campus", 5],
    [2023, "rape", "public_property", 0], [2023, "stalking", "noncampus", null],
  ];
  const cells2025: Cell[] = [
    [2022, "rape", "on_campus", 4], [2022, "rape", "on_campus_residential", 3], [2022, "fondling", "on_campus", 5],
    [2022, "dating_violence", "on_campus", 3], [2022, "domestic_violence", "on_campus", 1], [2022, "stalking", "on_campus", 4],
    [2023, "rape", "on_campus", 11], [2023, "rape", "on_campus_residential", 9], [2023, "fondling", "on_campus", 4],
    // Revised in the later report (was 2):
    [2023, "dating_violence", "on_campus", 3],
    [2023, "domestic_violence", "on_campus", 0], [2023, "stalking", "on_campus", 5],
    [2024, "rape", "on_campus", 5], [2024, "rape", "on_campus_residential", 4], [2024, "fondling", "on_campus", 3],
    [2024, "dating_violence", "on_campus", 2], [2024, "domestic_violence", "on_campus", 2], [2024, "stalking", "on_campus", 6],
  ];
  const insertCells = (reportId: string, cells: Cell[]) =>
    tx
      .insert(s.crimeStatistics)
      .values(cells.map(([calendarYear, offense, geography, count]) => ({ ...demo, cleryReportId: reportId, calendarYear, offense, geography, count })))
      .returning();
  const stats2024 = await insertCells(r2024.id, cells2024);
  const stats2025 = await insertCells(r2025.id, cells2025);

  const delayedNote = {
    ...demo,
    marker: "*",
    originalText: `${DEMO} The 2023 on-campus rape figure includes one report, made in 2023, describing multiple incidents that occurred in earlier years.`,
    summary: "One delayed report accounts for much of the 2023 increase.",
    page: "p. 00",
  };
  const isDelayedCell = (x: { calendarYear: number; offense: string; geography: string }) =>
    x.calendarYear === 2023 && x.offense === "rape" && (x.geography === "on_campus" || x.geography === "on_campus_residential");

  for (const [report, stats] of [[r2024, stats2024], [r2025, stats2025]] as const) {
    const [note] = await tx.insert(s.statisticFootnotes).values({ ...delayedNote, cleryReportId: report.id }).returning();
    await tx.insert(s.statisticFootnoteLinks).values(
      stats.filter(isDelayedCell).map((st) => ({ footnoteId: note.id, crimeStatisticId: st.id, cleryReportId: report.id })),
    );
  }
  const [revisionNote] = await tx
    .insert(s.statisticFootnotes)
    .values({ ...demo, cleryReportId: r2025.id, marker: "†", originalText: `${DEMO} The 2023 dating violence figure has been updated from the prior report.`, page: "p. 00" })
    .returning();
  const revised = stats2025.find((x) => x.calendarYear === 2023 && x.offense === "dating_violence")!;
  await tx.insert(s.statisticFootnoteLinks).values({ footnoteId: revisionNote.id, crimeStatisticId: revised.id, cleryReportId: r2025.id });

  // --- Institutional record ------------------------------------------------------------------------
  const [investigation, policyChange] = await tx
    .insert(s.institutionActions)
    .values([
      { ...demo, collegeId: college.id, actionDate: "2023-05-01", actionType: "government_investigation", title: "[DEMO] Agency resolution agreement", description: `${DEMO} A government agency and the university entered a resolution agreement concerning Title IX procedures.` },
      { ...demo, collegeId: college.id, actionDate: "2025-08-15", actionType: "policy_change", title: "[DEMO] Revised sexual misconduct policy", description: `${DEMO} The university published a revised policy with updated reporting options.` },
      { ...demo, collegeId: college.id, actionDate: "2024-01-01", datePrecision: "month", actionType: "prevention_initiative", title: "[DEMO] Bystander training for new students", description: `${DEMO} The university announced bystander-intervention training during orientation.` },
    ])
    .returning();
  await tx.insert(s.citations).values([
    { sourceId: agency.id, institutionActionId: investigation.id, pinpoint: "p. 1", excerpt: "[DEMO excerpt]" },
    { sourceId: policyDoc.id, institutionActionId: policyChange.id, pinpoint: "§ 1" },
  ]);

  const responses = await tx
    .insert(s.institutionalResponses)
    .values([
      { ...demo, collegeId: college.id, topic: "title_ix_process", findingKind: "documented", summary: `${DEMO} The published policy describes investigation and hearing procedures.` },
      { ...demo, collegeId: college.id, topic: "outcome_information", findingKind: "not_located", summary: "Outcome information was not located in the public sources reviewed." },
      { ...demo, collegeId: college.id, topic: "prevention_programs", findingKind: "documented", summary: `${DEMO} The university describes required prevention training for incoming students.` },
    ])
    .returning();
  await tx.insert(s.citations).values(
    responses.filter((r) => r.findingKind === "documented").map((r) => ({ sourceId: policyDoc.id, institutionalResponseId: r.id, pinpoint: "§ 4" })),
  );

  const [policy] = await tx
    .insert(s.policies)
    .values({ ...demo, collegeId: college.id, policyType: "sexual_misconduct", title: "[DEMO] Sexual Misconduct Policy", summary: DEMO, effectiveDate: "2025-08-15" })
    .returning();
  await tx.insert(s.citations).values({ sourceId: policyDoc.id, policyId: policy.id });

  const resources = await tx
    .insert(s.studentResources)
    .values([
      { ...demo, collegeId: college.id, category: "emergency", confidentiality: "institutional_reporting", name: "Emergency services", description: "In immediate danger, call 911.", phone: "911", available247: true },
      { ...demo, collegeId: college.id, category: "confidential", confidentiality: "confidential", name: "[DEMO] Confidential Advocacy Center", description: DEMO, phone: "555-0100", available247: true },
      { ...demo, collegeId: college.id, category: "counseling", confidentiality: "confidential", name: "[DEMO] Counseling Services", description: DEMO, phone: "555-0101" },
      { ...demo, collegeId: college.id, category: "title_ix", confidentiality: "institutional_reporting", name: "[DEMO] Title IX Office", description: DEMO, phone: "555-0102", url: "https://example.org/demo/title-ix" },
      { ...demo, collegeId: college.id, category: "campus_police", confidentiality: "institutional_reporting", name: "[DEMO] Campus Police", description: DEMO, phone: "555-0103", available247: true },
      { ...demo, collegeId: college.id, category: "medical", confidentiality: "unknown", name: "[DEMO] Student Health Center", description: DEMO, phone: "555-0104" },
    ])
    .returning();
  await tx.insert(s.citations).values(
    resources.filter((r) => r.category !== "emergency").map((r) => ({ sourceId: policyDoc.id, studentResourceId: r.id, pinpoint: "Appendix A" })),
  );

  // --- Demo case --------------------------------------------------------------------------------
  const [demoCase] = await tx
    .insert(s.cases)
    .values({
      ...demo,
      slug: "demo-case",
      title: "[DEMO] Civil suit concerning Title IX process",
      summary: `${DEMO} A synthetic case used to exercise the timeline, legal-status labels, and citations.`,
      locationContext: "unspecified",
      publicationJustification: `${DEMO} Fixture.`,
    })
    .returning();
  await tx.insert(s.caseColleges).values({ caseId: demoCase.id, collegeId: college.id });

  const ev = (o: Omit<typeof s.caseEvents.$inferInsert, "caseId">) => ({ ...demo, caseId: demoCase.id, ...o });
  const [, complaint, , settlementEvent] = await tx
    .insert(s.caseEvents)
    .values([
      ev({ eventDate: "2022-01-01", datePrecision: "year", eventType: "university_report", description: `${DEMO} According to the civil complaint, a report was made to the university.` }),
      ev({ eventDate: "2024-02-01", eventType: "civil_complaint", description: `${DEMO} A civil complaint was filed. The complaint alleges the university did not follow its own procedures.` }),
      ev({ eventDate: "2024-02-01", sequence: 1, eventType: "institutional_reform", description: `${DEMO} The university announced a review of its Title IX procedures.` }),
      ev({ eventDate: "2025-03-01", eventType: "settlement", description: `${DEMO} Court records state the parties reached a settlement. Terms were not located in the public sources reviewed.` }),
    ])
    .returning();
  await tx.insert(s.citations).values([
    { sourceId: court.id, caseEventId: complaint.id, pinpoint: "Complaint ¶ 12" },
    { sourceId: court.id, caseEventId: settlementEvent.id, pinpoint: "Docket entry 40" },
  ]);

  await tx.insert(s.corrections).values({
    ...demo,
    caseId: demoCase.id,
    correctionDate: "2025-03-15",
    description: `${DEMO} An earlier version of this timeline gave the wrong filing month for the complaint.`,
  });

  await tx.insert(s.collegeCoverage).values([
    { ...demo, collegeId: college.id, sourceId: article.id, scope: "institutional", topic: "policy_change", institutionActionId: policyChange.id, summary: `${DEMO} Reports on the university's revised sexual misconduct policy.` },
    { ...demo, collegeId: college.id, sourceId: court.id, scope: "case", caseId: demoCase.id, topic: "case_development", summary: `${DEMO} Docket for the civil suit concerning the university's Title IX process.` },
  ]);
}

