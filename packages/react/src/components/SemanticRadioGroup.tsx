import React from "react";
import { useSemantic } from "../context";

export interface SemanticRadioGroupProps {
  /** Field key used in AI commands */
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

export function SemanticRadioGroup({
  name,
  label,
  options,
  value,
  onChange,
  description,
  className,
  children,
}: SemanticRadioGroupProps) {
  useSemantic({
    role: "Field",
    title: label,
    fields: [
      {
        key: name,
        label,
        type: "radio",
        value,
        constraints: { options: options.map((o) => o.value) },
        description,
        set: (v) => onChange(v as string | number),
      },
    ],
  });

  if (children) {
    return <>{children({ options, selected: value, select: onChange })}</>;
  }

  return (
    <fieldset className={className}>
      <legend>{label}</legend>
      {options.map((opt) => (
        <label key={opt.value}>
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
          />
          {` ${opt.label}`}
        </label>
      ))}
    </fieldset>
  );
}
