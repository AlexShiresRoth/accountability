import { describe, expect, it } from "vitest";
import { caseEventTypeInfo, eventCategoryLabels, type EventCategory } from "./case-events";
import { caseEventTypes } from "./enums";

describe("case event classification", () => {
  it("classifies every event type", () => {
    for (const type of caseEventTypes) {
      expect(caseEventTypeInfo[type], type).toBeDefined();
      expect(eventCategoryLabels[caseEventTypeInfo[type].category]).toBeTruthy();
    }
  });

  it("never renders allegations, reports, or proceedings as outcomes", () => {
    const outcomeCategories: EventCategory[] = ["court_outcome", "university_outcome", "resolution"];
    const notOutcomes = [
      "alleged_incident",
      "civil_complaint",
      "police_report",
      "university_report",
      "investigation_opened",
      "investigation_reopened",
      "government_investigation",
      "arrest",
      "criminal_charge",
      "prosecution_declined",
    ] as const;
    for (const type of notOutcomes) {
      expect(outcomeCategories, type).not.toContain(caseEventTypeInfo[type].category);
    }
  });

  it("keeps alleged, arrested, charged, and convicted distinct", () => {
    const labels = (["alleged_incident", "arrest", "criminal_charge", "conviction"] as const).map(
      (t) => caseEventTypeInfo[t].label,
    );
    expect(new Set(labels).size).toBe(4);
    expect(caseEventTypeInfo.alleged_incident.category).toBe("allegation");
    expect(caseEventTypeInfo.civil_complaint.category).toBe("allegation");
    expect(caseEventTypeInfo.conviction.category).toBe("court_outcome");
  });

  it("matches the reviewed classification (update deliberately if this changes)", () => {
    const mapping = Object.fromEntries(Object.entries(caseEventTypeInfo).map(([k, v]) => [k, `${v.category}: ${v.label}`]));
    expect(mapping).toMatchInlineSnapshot(`
      {
        "acquittal": "court_outcome: Acquittal",
        "alleged_incident": "allegation: Alleged incident",
        "arrest": "legal_proceeding: Arrest",
        "civil_complaint": "allegation: Civil complaint filed",
        "conviction": "court_outcome: Conviction",
        "criminal_charge": "legal_proceeding: Criminal charge",
        "dismissal": "court_outcome: Dismissal",
        "government_investigation": "investigation: Government investigation",
        "institutional_reform": "institutional_change: Institutional reform",
        "investigation_opened": "investigation: Investigation opened",
        "investigation_reopened": "investigation: Investigation reopened",
        "police_report": "report: Police report",
        "prosecution_declined": "legal_proceeding: Prosecution declined",
        "settlement": "resolution: Settlement",
        "university_discipline": "university_outcome: University disciplinary outcome",
        "university_report": "report: Reported to university",
      }
    `);
  });
});
