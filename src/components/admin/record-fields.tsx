import type { CollegeRecordKey } from "@/lib/admin/records";
import {
  confidentialityLevels,
  coverageScopes,
  coverageTopics,
  datePrecisions,
  institutionActionTypes,
  policyTypes,
  resourceCategories,
  responseFindingKinds,
  responseTopics,
} from "@/lib/enums";
import {
  actionTypeLabels,
  confidentialityLabels,
  coverageTopicLabels,
  policyTypeLabels,
  resourceCategoryLabels,
  responseTopicLabels,
} from "@/lib/labels";
import { SelectField, TextArea, TextField } from "./fields";
import { SourcePicker } from "./source-picker";
import type { SourceOption, SourceScope } from "@/lib/source-search";

export type RecordOptions = {
  sources: SourceOption[];
  /** Offers this college's sources first in the source picker. */
  sourceScope?: SourceScope;
  cases: { id: string; title: string }[];
  actions: { id: string; title: string; actionDate: string }[];
};

type Values = Record<string, unknown>;

const str = (v: unknown) => (v === null || v === undefined ? null : String(v));
const opts = <T extends string>(values: readonly T[], label: (v: T) => string) => values.map((value) => ({ value, label: label(value) }));

const precisionLabels: Record<(typeof datePrecisions)[number], string> = {
  day: "Exact day",
  month: "Month only",
  year: "Year only",
  approximate: "Approximate (circa)",
};

/** Form fields for each institutional record type. `values` pre-fills an edit form. */
export function RecordFields({ recordKey, values = {}, options }: { recordKey: CollegeRecordKey; values?: Values; options: RecordOptions }) {
  const v = (k: string) => str(values[k]);
  switch (recordKey) {
    case "institution_action":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField name="actionDate" label="Date" type="date" required defaultValue={v("actionDate")} hint="Use the first of the month/year when only that is known, and set precision." />
          <SelectField name="datePrecision" label="Date precision" required defaultValue={v("datePrecision") ?? "day"} options={opts(datePrecisions, (p) => precisionLabels[p])} />
          <SelectField name="actionType" label="Type" required defaultValue={v("actionType")} options={opts(institutionActionTypes, (t) => actionTypeLabels[t])} />
          <TextField name="title" label="Title" required defaultValue={v("title")} hint="Neutral and factual, e.g. “Office for Civil Rights opens Title IX investigation”." />
          <div className="sm:col-span-2">
            <TextArea
              name="description"
              label="Description"
              required
              rows={4}
              defaultValue={v("description")}
              hint="Attribute claims to their source (“The complaint alleges…”, “The university announced…”). Favorable and unfavorable developments alike."
            />
          </div>
        </div>
      );

    case "institutional_response":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField name="topic" label="Topic" required defaultValue={v("topic")} options={opts(responseTopics, (t) => responseTopicLabels[t])} />
          <SelectField
            name="findingKind"
            label="Finding"
            required
            defaultValue={v("findingKind") ?? "documented"}
            options={[
              { value: responseFindingKinds[0], label: "Documented in public sources" },
              { value: responseFindingKinds[1], label: "Not located in the public sources reviewed" },
            ]}
          />
          <div className="sm:col-span-2">
            <TextArea
              name="summary"
              label="Summary"
              required
              rows={4}
              defaultValue={v("summary")}
              hint="For “not located”, say what was searched, e.g. “Outcome information was not located in the public sources reviewed (Title IX annual report, policy pages).” Never imply no action was taken."
            />
          </div>
        </div>
      );

    case "policy":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField name="policyType" label="Type" required defaultValue={v("policyType")} options={opts(policyTypes, (t) => policyTypeLabels[t])} />
          <TextField name="effectiveDate" label="Effective date" type="date" defaultValue={v("effectiveDate")} />
          <div className="sm:col-span-2">
            <TextField name="title" label="Title" required defaultValue={v("title")} hint="The policy's own title." />
          </div>
          <div className="sm:col-span-2">
            <TextArea name="summary" label="Summary" rows={3} defaultValue={v("summary")} />
          </div>
        </div>
      );

    case "student_resource":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField name="name" label="Name" required defaultValue={v("name")} />
          <SelectField name="category" label="Category" required defaultValue={v("category")} options={opts(resourceCategories, (c) => resourceCategoryLabels[c])} />
          <SelectField
            name="confidentiality"
            label="Confidentiality"
            required
            defaultValue={v("confidentiality") ?? "unknown"}
            options={opts(confidentialityLevels, (c) => confidentialityLabels[c].title)}
            hint="Only mark confidential when a source says so. Otherwise choose “Confidentiality not stated”."
          />
          <SelectField
            name="available247"
            label="Available 24/7"
            defaultValue={values.available247 === true ? "yes" : values.available247 === false ? "no" : ""}
            options={[
              { value: "", label: "Not stated" },
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ]}
          />
          <TextField name="phone" label="Phone" defaultValue={v("phone")} />
          <TextField name="url" label="Website" type="url" defaultValue={v("url")} />
          <TextField name="hours" label="Hours" defaultValue={v("hours")} />
          <TextField name="sortOrder" label="Order within category" type="number" defaultValue={v("sortOrder") ?? "0"} />
          <div className="sm:col-span-2">
            <TextArea name="description" label="Description" rows={3} defaultValue={v("description")} />
          </div>
        </div>
      );

    case "college_coverage":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <SourcePicker
              name="sourceId"
              label="Article (source)"
              required
              defaultValue={v("sourceId")}
              sources={options.sources}
              scope={options.sourceScope}
              hint="Create the source first under Sources, or accept it from the inbox."
            />
          </div>
          <SelectField name="topic" label="Topic" required defaultValue={v("topic")} options={opts(coverageTopics, (t) => coverageTopicLabels[t])} />
          <SelectField
            name="scope"
            label="Scope"
            required
            defaultValue={v("scope") ?? "institutional"}
            options={opts(coverageScopes, (sc) => (sc === "institutional" ? "Institution-level" : "About a specific case"))}
            hint="Case-specific coverage is only published once the linked case is verified."
          />
          <SelectField name="caseId" label="Case (if case-specific)" defaultValue={v("caseId")} placeholder="—" options={options.cases.map((c) => ({ value: c.id, label: c.title }))} />
          <SelectField
            name="institutionActionId"
            label="Related timeline entry (optional)"
            defaultValue={v("institutionActionId")}
            placeholder="—"
            options={options.actions.map((a) => ({ value: a.id, label: `${a.actionDate} · ${a.title}` }))}
          />
          <div className="sm:col-span-2">
            <TextArea
              name="summary"
              label="Neutral summary (shown publicly)"
              required
              rows={2}
              defaultValue={v("summary")}
              hint="One sentence in your words, attributed where needed. Not the headline. Do not name victims."
            />
          </div>
        </div>
      );

    case "correction":
      return (
        <div className="grid gap-4">
          <TextField name="correctionDate" label="Date of correction" type="date" required defaultValue={v("correctionDate") ?? new Date().toISOString().slice(0, 10)} />
          <TextArea
            name="description"
            label="What was corrected"
            required
            rows={3}
            defaultValue={v("description")}
            hint="Shown at the top of the profile, as prominently as the original. Say what was wrong and what it now says."
          />
        </div>
      );
  }
}

export const recordLabels: Record<CollegeRecordKey, { singular: string; plural: string }> = {
  institution_action: { singular: "Timeline entry", plural: "Accountability timeline" },
  institutional_response: { singular: "Institutional response", plural: "Institutional response" },
  policy: { singular: "Policy", plural: "Policies" },
  student_resource: { singular: "Student resource", plural: "Reporting and support resources" },
  college_coverage: { singular: "Coverage", plural: "Coverage" },
  correction: { singular: "Correction", plural: "Corrections" },
};
