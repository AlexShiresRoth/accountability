import { caseLocationContexts, datePrecisions } from "@/lib/enums";
import { caseEventTypeInfo } from "@/lib/case-events";
import type { CaseEventType } from "@/lib/enums";
import { formatDate } from "@/lib/dates";
import { EventTypeSelect } from "./event-type-select";
import { SelectField, TextArea, TextField } from "./fields";

export const privacyReminder = (
  <p className="border-l-4 border-caution-rule bg-caution px-4 py-2 text-sm text-caution-ink">
    Never name or identify victims or survivors, and leave out residential or precise locations. Name an accused
    person only where public court or police records do, and only if it is necessary to document the institution&rsquo;s
    response.
  </p>
);

const locationLabels: Record<(typeof caseLocationContexts)[number], string> = {
  on_campus: "On campus",
  off_campus: "Off campus",
  online: "Online",
  unspecified: "Not specified",
};

const precisionLabels: Record<(typeof datePrecisions)[number], string> = {
  day: "Exact day",
  month: "Month only",
  year: "Year only",
  approximate: "Approximate (circa)",
};

type CaseValues = {
  slug?: string;
  title?: string;
  summary?: string;
  locationContext?: string;
  publicationJustification?: string;
};

export function CaseFields({
  values = {},
  colleges,
  linkedCollegeIds = [],
}: {
  values?: CaseValues;
  colleges: { id: string; name: string }[];
  linkedCollegeIds?: string[];
}) {
  return (
    <div className="space-y-4">
      {privacyReminder}
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="title" label="Title" required defaultValue={values.title} hint="Describe the matter, not a person, e.g. “Civil suit over handling of a 2024 sexual assault report”." />
        <TextField name="slug" label="URL slug" required defaultValue={values.slug} hint="e.g. cornell-2024-civil-suit. Avoid names." />
      </div>
      <TextArea name="summary" label="Summary" required rows={3} defaultValue={values.summary} hint="Neutral and attributed. What is alleged, by whom, and the current status." />
      <SelectField
        name="locationContext"
        label="Setting"
        required
        defaultValue={values.locationContext ?? "unspecified"}
        options={caseLocationContexts.map((v) => ({ value: v, label: locationLabels[v] }))}
        hint="Deliberately coarse. Never record a residence or precise location."
      />
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">
          Institutions <span className="text-ink-muted">(required)</span>
        </legend>
        <div className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
          {colleges.map((c) => (
            <label key={c.id} className="flex items-center gap-2">
              <input type="checkbox" name="collegeIds" value={c.id} defaultChecked={linkedCollegeIds.includes(c.id)} />
              {c.name}
            </label>
          ))}
        </div>
      </fieldset>
      <TextArea
        name="publicationJustification"
        label="Editorial justification (internal)"
        required
        rows={3}
        defaultValue={values.publicationJustification}
        hint="Why publishing this serves the public interest: what it shows about the institution's response. Required before verification."
      />
    </div>
  );
}

type EventValues = {
  eventDate?: string;
  datePrecision?: string;
  sequence?: number;
  eventType?: string;
  description?: string;
  supersedesEventId?: string | null;
};

export function EventFields({
  values = {},
  siblings,
  currentId,
}: {
  values?: EventValues;
  siblings: { id: string; eventDate: string; eventType: CaseEventType }[];
  currentId?: string;
}) {
  return (
    <div className="space-y-4">
      {privacyReminder}
      <div className="grid gap-4 sm:grid-cols-3">
        <TextField name="eventDate" label="Date" type="date" required defaultValue={values.eventDate} hint="Use the 1st of the month/year when only that is known." />
        <SelectField
          name="datePrecision"
          label="Date precision"
          required
          defaultValue={values.datePrecision ?? "day"}
          options={datePrecisions.map((v) => ({ value: v, label: precisionLabels[v] }))}
        />
        <TextField name="sequence" label="Order on the same date" type="number" defaultValue={values.sequence ?? 0} hint="Lower first." />
      </div>
      <EventTypeSelect defaultValue={values.eventType} />
      <TextArea name="description" label="Description" required rows={4} defaultValue={values.description} hint="Attributed to its source, as shown above." />
      <SelectField
        name="supersedesEventId"
        label="Updates an earlier entry (optional)"
        defaultValue={values.supersedesEventId}
        placeholder="—"
        options={siblings
          .filter((e) => e.id !== currentId)
          .map((e) => ({ value: e.id, label: `${formatDate(e.eventDate)} · ${caseEventTypeInfo[e.eventType].label}` }))}
        hint="e.g. a dismissal that updates a charge. The earlier entry stays visible, marked as updated."
      />
    </div>
  );
}
