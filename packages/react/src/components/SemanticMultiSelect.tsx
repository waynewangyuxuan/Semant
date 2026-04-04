import React from "react";
import { useSemantic } from "../context";

export interface SemanticMultiSelectProps {
  /** Field key used in AI commands */
  name: string;
  /** Human-readable label */
  label: string;
  /** Available options */
  options: Array<{ value: string | number; label: string }>;
  /** Currently selected values */
  value: Array<string | number>;
  /** Change handler */
  onChange: (value: Array<string | number>) => void;
  /** AI-facing description */
  description?: string;
  /** Custom className */
  className?: string;
  /** Render prop for full custom rendering */
  children?: (props: {
    options: Array<{ value: string | number; label: string }>;
    selected: Array<string | number>;
    toggle: (value: string | number) => void;
  }) => React.ReactNode;
}

export function SemanticMultiSelect({
  name,
  label,
  options,
  value,
  onChange,
  description,
  className,
  children,
}: SemanticMultiSelectProps) {
  const toggle = (v: string | number) => {
    if (value.includes(v)) {
      onChange(value.filter((x) => x !== v));
    } else {
      onChange([...value, v]);
    }
  };

  useSemantic({
    role: "Field",
    title: label,
    fields: [
      {
        key: name,
        label,
        type: "multi-select",
        value,
        constraints: { options: options.map((o) => o.value) },
        description,
        set: (v) => {
          // Try JSON array string first (e.g. '["a","b"]')
          if (typeof v === "string") {
            try {
              const parsed = JSON.parse(v);
              if (Array.isArray(parsed)) {
                onChange(parsed);
                return;
              }
            } catch {
              // not JSON — wrap single value as array
            }
            onChange([v]);
            return;
          }
          if (Array.isArray(v)) {
            onChange(v as Array<string | number>);
          } else {
            // Single non-string value — wrap as array (set semantics, not toggle)
            onChange([v as string | number]);
          }
        },
      },
    ],
  });

  if (children) {
    return <>{children({ options, selected: value, toggle })}</>;
  }

  return (
    <fieldset className={className}>
      <legend>{label}</legend>
      {options.map((opt) => (
        <label key={opt.value}>
          <input
            type="checkbox"
            checked={value.includes(opt.value)}
            onChange={() => toggle(opt.value)}
          />
          {` ${opt.label}`}
        </label>
      ))}
    </fieldset>
  );
}
