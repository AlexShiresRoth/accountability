import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { caseEventTypeInfo, eventCategoryLabels } from "@/lib/case-events";
import { caseEventTypes, type CaseEventType } from "@/lib/enums";
import type { PublicCaseEvent, PublicCitation } from "@/lib/public";
import { CaseTimeline, hasDocumentedOutcome } from "./case-timeline";
import { LegalStatusBadge } from "./legal-status-badge";

const text = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

let n = 0;
const event = (o: Partial<PublicCaseEvent> = {}): PublicCaseEvent => ({
  id: `e${++n}`,
  eventDate: "2024-03-01",
  datePrecision: "day",
  sequence: 0,
  eventType: "police_report",
  description: "Police records state a report was made.",
  supersedesEventId: null,
  supersededByEventId: null,
  underReview: false,
  isDemo: false,
  ...o,
});

const citation: PublicCitation = {
  id: "c1",
  pinpoint: "¶ 12",
  excerpt: null,
  claim: null,
  source: {
    id: "s1",
    type: "court_record",
    publisher: "County Court",
    title: "Docket",
    url: "https://example.org/docket",
    publicationDate: null,
    retrievedAt: null,
    archivedUrl: null,
    notes: null,
    isDemo: false,
  },
};

describe("LegalStatusBadge", () => {
  it.each(caseEventTypes)("renders %s with its own category and label", (type) => {
    const html = text(renderToStaticMarkup(<LegalStatusBadge type={type} />));
    const info = caseEventTypeInfo[type];
    expect(html).toBe(`${eventCategoryLabels[info.category]} ${info.label}`);
  });

  it("never renders an allegation with outcome language", () => {
    for (const type of ["alleged_incident", "civil_complaint"] as CaseEventType[]) {
      const html = text(renderToStaticMarkup(<LegalStatusBadge type={type} />));
      expect(html).toMatch(/^Allegation /);
      expect(html).not.toMatch(/Conviction|Court outcome|Convicted|Guilty/i);
    }
  });

  it("labels arrest, charge, and conviction distinctly", () => {
    const [arrest, charge, conviction] = (["arrest", "criminal_charge", "conviction"] as const).map((t) =>
      text(renderToStaticMarkup(<LegalStatusBadge type={t} />)),
    );
    expect(arrest).toBe("Legal proceeding Arrest");
    expect(charge).toBe("Legal proceeding Criminal charge");
    expect(conviction).toBe("Court outcome Conviction");
  });
});

describe("CaseTimeline", () => {
  it("renders events in the order given (the query layer sorts them)", () => {
    const html = renderToStaticMarkup(
      <CaseTimeline
        events={[
          event({ eventType: "police_report", description: "FIRST" }),
          event({ eventType: "arrest", description: "SECOND" }),
          event({ eventType: "criminal_charge", description: "THIRD" }),
        ]}
        citations={{}}
      />,
    );
    expect(html.indexOf("FIRST")).toBeLessThan(html.indexOf("SECOND"));
    expect(html.indexOf("SECOND")).toBeLessThan(html.indexOf("THIRD"));
  });

  it("shows each event's plain-language meaning alongside the badge", () => {
    const html = text(renderToStaticMarkup(<CaseTimeline events={[event({ eventType: "arrest" })]} citations={{}} />));
    expect(html).toContain("An arrest is not a charge or a conviction.");
  });

  it("never shows more date precision than was recorded", () => {
    const html = text(
      renderToStaticMarkup(
        <CaseTimeline events={[event({ eventDate: "2022-01-01", datePrecision: "year" })]} citations={{}} />,
      ),
    );
    expect(html).toContain("2022 (exact date not given in sources)");
    expect(html).not.toContain("January 1, 2022");
  });

  it("marks superseded events and links both directions", () => {
    const original = event({ id: "orig", eventType: "criminal_charge", eventDate: "2024-01-10", supersededByEventId: "upd" });
    const update = event({ id: "upd", eventType: "dismissal", eventDate: "2024-06-01", supersedesEventId: "orig" });
    const html = renderToStaticMarkup(<CaseTimeline events={[original, update]} citations={{}} />);
    expect(text(html)).toContain("Updated: see June 1, 2024");
    expect(html).toContain('href="#event-upd"');
    expect(text(html)).toContain("Updates the entry from January 10, 2024");
    expect(html).toContain('href="#event-orig"');
  });

  it("shows a citation control only for events that have citations", () => {
    const cited = event({ id: "cited" });
    const uncited = event({ id: "uncited" });
    const html = renderToStaticMarkup(
      <CaseTimeline events={[cited, uncited]} citations={{ "caseEvent:cited": [citation] }} />,
    );
    expect(html).toContain('popoverTarget="cite-event-cited"');
    expect(html).not.toContain("cite-event-uncited");
    expect(text(html)).toContain("Location in source: ¶ 12");
  });

  it("marks events under review", () => {
    const html = text(renderToStaticMarkup(<CaseTimeline events={[event({ underReview: true })]} citations={{}} />));
    expect(html).toContain("Under review");
  });

  it("renders only phrasing content inside paragraphs (no hydration-breaking nesting)", () => {
    const html = renderToStaticMarkup(
      <CaseTimeline events={[event({ id: "x" })]} citations={{ "caseEvent:x": [citation] }} />,
    );
    for (const p of html.match(/<p[\s>][\s\S]*?<\/p>/g) ?? []) {
      expect(p).not.toMatch(/<(div|ol|ul|li|blockquote|section|aside|dl)[\s>]/);
    }
  });
});

describe("hasDocumentedOutcome", () => {
  it("is false when only allegations, reports, and proceedings are documented", () => {
    expect(
      hasDocumentedOutcome([event({ eventType: "civil_complaint" }), event({ eventType: "arrest" }), event({ eventType: "criminal_charge" })]),
    ).toBe(false);
  });

  it("is true for court outcomes, university outcomes, and settlements", () => {
    for (const type of ["conviction", "acquittal", "dismissal", "university_discipline", "settlement"] as CaseEventType[]) {
      expect(hasDocumentedOutcome([event({ eventType: type })]), type).toBe(true);
    }
  });
});
