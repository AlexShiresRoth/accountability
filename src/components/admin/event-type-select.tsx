"use client";

import { useId, useState } from "react";
import { caseEventTypeInfo, eventCategoryLabels } from "@/lib/case-events";
import { caseEventTypes, type CaseEventType } from "@/lib/enums";

/** How a description of each event type should be attributed. Shown as guidance while writing. */
const attribution: Record<CaseEventType, string> = {
  alleged_incident: "Attribute to whoever alleges it: “According to the civil complaint, …” or “The complaint alleges …”. Never state it as fact.",
  civil_complaint: "“A civil complaint filed on [date] alleges …”. Everything in a complaint is an allegation.",
  police_report: "“Police records state …” or “[Agency] said a report was made …”. A report is not a finding that a crime occurred.",
  university_report: "“According to [source], a report was made to the university …”.",
  investigation_opened: "“[Agency/office] opened an investigation …”. Opening an investigation is not a finding.",
  investigation_reopened: "“[Agency] said it reopened its investigation …”, attributed to the agency's own statement where possible.",
  government_investigation: "“[Agency] opened an investigation into [institution]'s …”. Not a finding of wrongdoing.",
  arrest: "“[Agency] arrested [person/“a student”] …”. Name a person only if public records do. An arrest is not a charge.",
  criminal_charge: "“Prosecutors charged … with [offense, as charged]”. Use the charging document's offense names.",
  prosecution_declined: "“The district attorney declined to prosecute …”, with the stated reason if one was given.",
  conviction: "“… was convicted of [exact offense of conviction]”, which may differ from the original charge.",
  acquittal: "“A jury/court found … not guilty of [offense]”.",
  dismissal: "“The court dismissed … [on the grounds stated in the order]”. Not a finding of innocence unless the record says so.",
  settlement: "“The parties settled; terms were [not] disclosed.” A settlement is usually not an admission of liability.",
  university_discipline: "“The university announced/confirmed …”. Attribute to the university; outcomes are often confidential.",
  institutional_reform: "“The university announced …”, with what changed and when.",
};

export function EventTypeSelect({ defaultValue }: { defaultValue?: string | null }) {
  const id = useId();
  const [type, setType] = useState<CaseEventType>((defaultValue as CaseEventType) ?? "civil_complaint");
  const info = caseEventTypeInfo[type];
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium">
        Event type <span className="text-ink-muted">(required)</span>
      </label>
      <select
        id={id}
        name="eventType"
        required
        value={type}
        onChange={(e) => setType(e.target.value as CaseEventType)}
        className="w-full border border-rule-strong bg-surface px-3 py-2 text-[0.95rem] text-ink focus:outline-none focus-visible:border-accent"
      >
        {caseEventTypes.map((t) => (
          <option key={t} value={t}>
            {eventCategoryLabels[caseEventTypeInfo[t].category]}: {caseEventTypeInfo[t].label}
          </option>
        ))}
      </select>
      <div className="border-l-2 border-rule-strong pl-3 text-xs text-ink-muted">
        <p>
          <strong className="text-ink">Shown publicly as:</strong> {info.meaning}
        </p>
        <p className="mt-1">
          <strong className="text-ink">How to word it:</strong> {attribution[type]}
        </p>
      </div>
    </div>
  );
}
