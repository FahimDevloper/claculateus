"use client";

import { FieldDef } from "@/lib/calculators/types";

interface Props {
  field: FieldDef;
  value: number | string | boolean | undefined;
  onChange: (v: number | string | boolean) => void;
}

export default function FieldRenderer({ field, value, onChange }: Props) {
  const widthClass =
    field.width === "half" ? "sm:col-span-1" : field.width === "third" ? "sm:col-span-1" : "sm:col-span-2";

  if (field.type === "select") {
    return (
      <label className={`flex flex-col gap-1.5 ${widthClass}`}>
        <span className="text-sm font-medium text-foreground">{field.label}</span>
        <select
          className="field-input"
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
        >
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {field.help && <span className="text-xs text-muted">{field.help}</span>}
      </label>
    );
  }

  if (field.type === "radio") {
    return (
      <div className={`flex flex-col gap-1.5 ${widthClass}`}>
        <span className="text-sm font-medium text-foreground">{field.label}</span>
        <div className="flex flex-wrap gap-2">
          {field.options?.map((o) => (
            <button
              type="button"
              key={o.value}
              onClick={() => onChange(o.value)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                value === o.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-surface-2 text-foreground hover:border-muted"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (field.type === "checkbox") {
    return (
      <label className={`flex items-center gap-2.5 ${widthClass}`}>
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 accent-[var(--primary)]"
        />
        <span className="text-sm font-medium text-foreground">{field.label}</span>
      </label>
    );
  }

  if (field.type === "date") {
    return (
      <label className={`flex flex-col gap-1.5 ${widthClass}`}>
        <span className="text-sm font-medium text-foreground">{field.label}</span>
        <input
          type="date"
          className="field-input"
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
        />
        {field.help && <span className="text-xs text-muted">{field.help}</span>}
      </label>
    );
  }

  return (
    <label className={`flex flex-col gap-1.5 ${widthClass}`}>
      <span className="text-sm font-medium text-foreground">{field.label}</span>
      <div className="relative">
        <input
          type={field.type === "number" ? "number" : "text"}
          className="field-input"
          value={value === undefined ? "" : String(value)}
          placeholder={field.placeholder}
          min={field.min}
          max={field.max}
          step={field.step ?? "any"}
          onChange={(e) =>
            onChange(field.type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value)
          }
        />
        {field.unit && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted">
            {field.unit}
          </span>
        )}
      </div>
      {field.help && <span className="text-xs text-muted">{field.help}</span>}
    </label>
  );
}
