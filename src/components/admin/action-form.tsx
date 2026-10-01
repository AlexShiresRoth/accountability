"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import { toast } from "./toaster";

export type FormState = { ok?: boolean; message?: string; problems?: string[] } | null;
export type FormAction = (prev: FormState, form: FormData) => Promise<FormState>;

/** Server-action form with pending state and inline problems. */
export function ActionForm({
  action,
  children,
  submitLabel = "Save",
  confirm,
  className = "space-y-4",
  variant = "primary",
}: {
  action: FormAction;
  children?: React.ReactNode;
  submitLabel?: string;
  /** Shown in a confirmation dialog before submitting. */
  confirm?: string;
  className?: string;
  variant?: "primary" | "secondary" | "danger";
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const feedbackRef = useRef<HTMLDivElement>(null);

  // Every result gets a toast; failures also bring the inline details into view.
  useEffect(() => {
    if (!state) return;
    if (state.problems?.length) {
      toast({
        kind: "error",
        title: "Couldn’t save",
        detail: state.problems.length === 1 ? state.problems[0] : `${state.problems.length} problems. See the form for details.`,
      });
      feedbackRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    } else if (state.ok) {
      toast({ kind: "success", title: state.message ?? "Saved" });
    }
  }, [state]);
  const buttonStyles = {
    primary: "bg-ink text-paper hover:opacity-90",
    secondary: "border border-ink text-ink hover:bg-surface",
    danger: "border border-ink text-ink hover:bg-ink hover:text-paper",
  }[variant];

  return (
    <form
      className={className}
      // Submitting via a transition (instead of <form action>) keeps what the researcher entered:
      // React resets uncontrolled forms after a form action, which would wipe input after a failed save.
      onSubmit={(e) => {
        e.preventDefault();
        if (confirm && !window.confirm(confirm)) return;
        const data = new FormData(e.currentTarget);
        startTransition(() => formAction(data));
      }}
    >
      {children}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className={`px-4 py-2 text-sm font-medium disabled:opacity-50 ${buttonStyles}`}>
          {pending ? "Working…" : submitLabel}
        </button>
      </div>
      <div ref={feedbackRef} aria-live="polite">
        {state?.ok && (
          <p role="status" className="border-l-4 border-ink bg-surface px-4 py-2 text-sm">
            <span aria-hidden>✓ </span>
            {state.message ?? "Saved."}
          </p>
        )}
        {state?.problems?.length ? (
          <div role="alert" className="border-l-4 border-caution-rule bg-caution px-4 py-2 text-sm text-caution-ink">
            <p className="font-semibold">
              <span aria-hidden>⚠ </span>Couldn&rsquo;t save
            </p>
            <ul className="mt-1 list-disc space-y-0.5 pl-5">
              {state.problems.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </form>
  );
}
