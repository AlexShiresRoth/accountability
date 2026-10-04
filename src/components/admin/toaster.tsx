"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export type Toast = { id: number; kind: "success" | "error"; title: string; detail?: string };

const EVENT = "admin-toast";

/** Show a toast from any client component in the admin. */
export function toast(t: Omit<Toast, "id">) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: t }));
}

/** Messages for actions that redirect (the form unmounts, so the toast is carried in the URL). */
const notices: Record<string, Omit<Toast, "id">> = {
  "source-created": { kind: "success", title: "Source created", detail: "Saved as a draft." },
  "college-created": { kind: "success", title: "College created", detail: "Saved as a draft." },
  "report-created": { kind: "success", title: "Report created", detail: "Saved as a draft. Enter its figures below." },
  "candidate-accepted": { kind: "success", title: "Accepted as draft", detail: "A draft source and coverage entry were created." },
  "candidate-source": { kind: "success", title: "Saved as a draft source", detail: "Cite it from a case or record, then verify it." },
  deleted: { kind: "success", title: "Deleted" },
  "case-created": { kind: "success", title: "Case created as draft", detail: "Add events with citations, then verify." },
  "record-created": { kind: "success", title: "Created as draft", detail: "Add a citation, then verify it to publish." },
};

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const dismiss = useCallback((id: number) => setToasts((all) => all.filter((t) => t.id !== id)), []);
  const push = useCallback(
    (t: Omit<Toast, "id">) => {
      const id = nextId.current++;
      // A later success supersedes earlier error toasts (inline errors remain beside their own form).
      setToasts((all) => [...(t.kind === "success" ? all.filter((x) => x.kind !== "error") : all).slice(-3), { ...t, id }]);
      // Errors stay until dismissed; confirmations clear themselves.
      if (t.kind === "success") setTimeout(() => dismiss(id), 5000);
    },
    [dismiss],
  );

  useEffect(() => {
    const onToast = (e: Event) => push((e as CustomEvent<Omit<Toast, "id">>).detail);
    window.addEventListener(EVENT, onToast);
    return () => window.removeEventListener(EVENT, onToast);
  }, [push]);

  // Errors describe the page they came from; drop them when navigating away.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setToasts((all) => all.filter((t) => t.kind !== "error"));
  }

  const notice = params.get("notice");
  useEffect(() => {
    if (!notice) return;
    const n = notices[notice];
    if (n) push(n);
    const rest = new URLSearchParams(params);
    rest.delete("notice");
    router.replace(rest.size ? `${pathname}?${rest}` : pathname, { scroll: false });
  }, [notice, params, pathname, push, router]);

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-end gap-2 sm:left-auto sm:w-96">
      {toasts.map((t) => (
        <div
          key={t.id}
          role={t.kind === "error" ? "alert" : "status"}
          className={`pointer-events-auto w-full border-l-4 px-4 py-3 text-sm shadow-lg ${
            t.kind === "error" ? "border-caution-rule bg-caution text-caution-ink" : "border-ink bg-surface text-ink"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold">
                <span aria-hidden>{t.kind === "error" ? "⚠ " : "✓ "}</span>
                {t.title}
              </p>
              {t.detail && <p className="mt-0.5">{t.detail}</p>}
            </div>
            <button type="button" onClick={() => dismiss(t.id)} className="text-xs underline" aria-label="Dismiss notification">
              Close
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
