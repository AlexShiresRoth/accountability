"use client";

import { useState } from "react";

/** Status dropdown that says so when a choice hasn't been applied yet. */
export function StatusSelect({ options, defaultValue, current }: { options: { value: string; label: string }[]; defaultValue: string; current: string }) {
  const [value, setValue] = useState(defaultValue);
  const [touched, setTouched] = useState(false);
  return (
    <div className="space-y-1">
      <label htmlFor="f-to" className="block text-sm font-medium">
        Change status to
      </label>
      <select
        id="f-to"
        name="to"
        required
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setTouched(true);
        }}
        className="w-full border border-rule-strong bg-surface px-3 py-2 text-[0.95rem] text-ink focus:outline-none focus-visible:border-accent"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {touched && value !== current && (
        <p className="text-xs font-medium text-caution-ink">Not applied yet. Click &ldquo;Update status&rdquo; below to apply it.</p>
      )}
    </div>
  );
}
