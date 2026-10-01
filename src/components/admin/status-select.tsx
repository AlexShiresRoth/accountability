"use client";

import { useId, useState } from "react";

/** Status dropdown that says so when a choice hasn't been applied yet. */
export function StatusSelect({
  options,
  defaultValue,
  current,
  compact = false,
  label = "Change status to",
  placeholder,
}: {
  options: { value: string; label: string }[];
  defaultValue: string;
  current: string;
  /** Visually hide the label (it stays available to screen readers). */
  compact?: boolean;
  label?: string;
  /** Start on an empty, required choice so nothing changes without a deliberate selection. */
  placeholder?: string;
}) {
  const id = useId();
  const [value, setValue] = useState(placeholder ? "" : defaultValue);
  const [touched, setTouched] = useState(false);
  return (
    <div className="space-y-1">
      <label htmlFor={id} className={compact ? "sr-only" : "block text-sm font-medium"}>
        {label}
      </label>
      <select
        id={id}
        name="to"
        required
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setTouched(true);
        }}
        className={`w-full border border-rule-strong bg-surface text-ink focus:outline-none focus-visible:border-accent ${
          compact ? "px-2 py-1 text-sm" : "px-3 py-2 text-[0.95rem]"
        }`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {touched && value && value !== current && (
        <p className="text-xs font-medium text-caution-ink">Not applied yet. Click &ldquo;Update status&rdquo; to apply it.</p>
      )}
    </div>
  );
}
