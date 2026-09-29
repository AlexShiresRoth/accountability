import Link from "next/link";
import { dataQualityNotes, type DataQualityNoteKind } from "@/lib/data-quality";

export function DataQualityNote({ kind, compact = false }: { kind: DataQualityNoteKind; compact?: boolean }) {
  const note = dataQualityNotes[kind];
  return (
    <aside
      aria-label={note.title}
      className={`border-l-4 border-caution-rule bg-caution text-caution-ink ${compact ? "px-4 py-3 text-[0.95rem]" : "px-5 py-4"}`}
    >
      <p className="font-semibold">{note.title}</p>
      <p className="mt-1">
        {note.body}{" "}
        <Link href={`/methodology#${note.anchor}`} className="whitespace-nowrap text-caution-ink">
          Methodology
        </Link>
      </p>
    </aside>
  );
}

export function DataQualityNotes({ kinds }: { kinds: DataQualityNoteKind[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {kinds.map((kind) => (
        <DataQualityNote key={kind} kind={kind} compact />
      ))}
    </div>
  );
}
