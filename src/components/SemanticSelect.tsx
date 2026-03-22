import React from "react";
import { useSemantic } from "../core";

export interface SemanticSelectProps {
  /** Field key used in AI commands, e.g. "party_size" */
  name: string;
  /** Human-readable label */
  label: string;
  /** Available options */
  options: Array<{ value: string | number; label: string }>;
  /** Current value */
  value: string | number | null;
  /** Change handler */
  onChange: (value: string | number) => void;
  /** AI-facing description */
  description?: string;
  /** Custom className */
  className?: string;
  /** Render prop for full custom rendering */
  children?: (props: {
    options: Array<{ value: string | number; label: string }>;
    selected: string | number | null;
    select: (value: string | number) => void;
  }) => React.ReactNode;
}

export function SemanticSelect({
  name,
  label,
  options,
  value,
  onChange,
  description,
  className,
  children,
}: SemanticSelectProps) {
  useSemantic({
    role: "Field",
    title: label,
    fields: [
      {
        key: name,
        label,
        type: "select",
        value,
        options: options.map((o) => o.value),
        description,
        set: (v) => onChange(v as string | number),
      },
    ],
  });

  // If render prop is provided, use it
  if (children) {
    return <>{children({ options, selected: value, select: onChange })}</>;
  }

  // Default render
  return (
    <div className={className}>
      <select
        value={value ?? ""}
        onChange={(e) => {
          const num = Number(e.target.value);
          onChange(Number.isNaN(num) ? e.target.value : num);
        }}
      >
        <option value="" disabled>
          {label}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
