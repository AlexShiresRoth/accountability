"use client";

import { useRef, useState, useTransition } from "react";
import { draftSummaryAction } from "@/app/admin/actions";

/**
 * "Draft summary" for the inbox's accept form: asks for an AI draft of the neutral summary and puts it in the
 * form's `summary` field for the researcher to check. Also submits the draft itself (hidden), so the coverage
 * entry records that its summary began as an AI draft and whether it was edited.
 */
export function SummaryDrafter({ candidateId }: { candidateId: string }) {
  const [pending, start] = useTransition();
  const [draft, setDraft] = useState<{ summary: string; model: string } | null>(null);
  const [message, setMessage] = useState<{ kind: "caution" | "error"; text: string } | null>(null);
  const [pasted, setPasted] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const run = () => {
    const form = ref.current?.closest("form");
    if (!form) return;
    const articleUrl = (form.elements.namedItem("articleUrl") as HTMLInputElement | null)?.value;
    setMessage(null);
    start(async () => {
      const result = await draftSummaryAction(candidateId, { articleUrl, pastedText: pasted });
      if (!result.ok) {
        setMessage({ kind: "error", text: result.reason });
        return;
      }
      const field = form.elements.namedItem("summary") as HTMLTextAreaElement | null;
      if (field) {
        field.value = result.summary;
        field.focus();
      }
      setDraft({ summary: result.summary, model: result.model });
      setMessage(result.caution ? { kind: "caution", text: result.caution } : null);
    });
  };

  return (
    <div ref={ref} className="space-y-2 border-l-2 border-rule-strong pl-3">
      <input type="hidden" name="summaryDraft" value={draft?.summary ?? ""} />
      <input type="hidden" name="summaryModel" value={draft?.model ?? ""} />
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={run}
          disabled={pending}
          className="border border-ink px-3 py-1.5 text-sm font-medium text-ink hover:bg-surface disabled:opacity-60"
        >
          {pending ? "Drafting…" : draft ? "Draft again" : "Draft summary with AI"}
        </button>
        <span className="text-xs text-ink-muted">
          Reads the article and suggests a neutral sentence. Check it against the article before accepting.
        </span>
      </div>
      {message && (
        <p role="status" className={`text-sm ${message.kind === "error" ? "text-caution-ink" : "text-ink"}`}>
          {message.kind === "caution" ? <strong>Check: </strong> : null}
          {message.text}
        </p>
      )}
      <details>
        <summary className="cursor-pointer text-xs font-medium">Paywalled or blocked? Paste the article text</summary>
        <textarea
          value={pasted}
          onChange={(e) => setPasted(e.target.value)}
          rows={5}
          placeholder="Paste the article's text here, then Draft summary. It is used only for the draft and not saved."
          className="mt-2 w-full border border-rule-strong bg-surface px-3 py-2 text-sm text-ink focus:outline-none focus-visible:border-accent"
        />
      </details>
    </div>
  );
}
