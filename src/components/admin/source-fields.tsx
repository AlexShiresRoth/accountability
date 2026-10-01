import { sourceTypes } from "@/lib/source-types";
import { SelectField, TextArea, TextField } from "./fields";

type SourceValues = {
  type?: string;
  publisher?: string;
  title?: string;
  url?: string | null;
  publicationDate?: string | null;
  retrievedAt?: string | null;
  archivedUrl?: string | null;
  documentPath?: string | null;
  notes?: string | null;
};

export function SourceFields({ source = {} }: { source?: SourceValues }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <SelectField
        name="type"
        label="Source type"
        required
        defaultValue={source.type ?? "university"}
        options={Object.entries(sourceTypes).map(([value, t]) => ({ value, label: t.label }))}
      />
      <TextField name="publisher" label="Publisher" required defaultValue={source.publisher} hint="e.g. Cornell University, The Cornell Daily Sun" />
      <div className="sm:col-span-2">
        <TextField name="title" label="Title" required defaultValue={source.title} hint="The document's own title." />
      </div>
      <TextField name="url" label="URL" type="url" defaultValue={source.url} />
      <TextField name="archivedUrl" label="Archived URL" type="url" defaultValue={source.archivedUrl} hint="e.g. a web.archive.org snapshot." />
      <TextField name="publicationDate" label="Publication date" type="date" defaultValue={source.publicationDate} />
      <TextField name="retrievedAt" label="Retrieved on" type="date" defaultValue={source.retrievedAt} hint="Required before verification." />
      <TextField name="documentPath" label="Stored document path" defaultValue={source.documentPath} hint="Only where storing a copy is legally appropriate." />
      <div className="sm:col-span-2">
        <TextArea name="notes" label="Public notes" defaultValue={source.notes} hint="Shown with the source, e.g. which pages hold the statistics." />
      </div>
    </div>
  );
}
