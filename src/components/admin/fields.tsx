// Plain form fields for the research interface. Usable from server and client components.

type Base = { name: string; label: string; hint?: string; required?: boolean };

const inputClass = "w-full border border-rule-strong bg-surface px-3 py-2 text-[0.95rem] text-ink focus:outline-none focus-visible:border-accent";

function Wrap({ label, hint, required, children, htmlFor }: Omit<Base, "name"> & { children: React.ReactNode; htmlFor: string }) {
  return (
    <div className="space-y-1">
      <label htmlFor={htmlFor} className="block text-sm font-medium">
        {label}
        {required && <span className="text-ink-muted"> (required)</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-ink-muted">{hint}</p>}
    </div>
  );
}

export function TextField({ name, label, hint, required, defaultValue, type = "text", placeholder }: Base & { defaultValue?: string | number | null; type?: "text" | "url" | "date" | "number" | "password"; placeholder?: string }) {
  const id = `f-${name}`;
  return (
    <Wrap label={label} hint={hint} required={required} htmlFor={id}>
      <input id={id} name={name} type={type} required={required} placeholder={placeholder} defaultValue={defaultValue ?? ""} className={inputClass} />
    </Wrap>
  );
}

export function TextArea({ name, label, hint, required, defaultValue, rows = 3 }: Base & { defaultValue?: string | null; rows?: number }) {
  const id = `f-${name}`;
  return (
    <Wrap label={label} hint={hint} required={required} htmlFor={id}>
      <textarea id={id} name={name} rows={rows} required={required} defaultValue={defaultValue ?? ""} className={inputClass} />
    </Wrap>
  );
}

export function SelectField({
  name,
  label,
  hint,
  required,
  defaultValue,
  options,
  placeholder,
}: Base & { defaultValue?: string | null; options: { value: string; label: string }[]; placeholder?: string }) {
  const id = `f-${name}`;
  return (
    <Wrap label={label} hint={hint} required={required} htmlFor={id}>
      <select id={id} name={name} required={required} defaultValue={defaultValue ?? ""} className={inputClass}>
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Wrap>
  );
}

export function PublishedEditWarning({ status }: { status: string }) {
  if (status !== "verified" && status !== "needs_update") return null;
  return (
    <p className="border-l-4 border-caution-rule bg-caution px-4 py-2 text-sm text-caution-ink">
      This record is published. Saving a change will unpublish it until it is re-verified.
    </p>
  );
}
