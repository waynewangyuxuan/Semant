import React from "react";
import { useSemantic } from "../core";

export interface SemanticDatePickerProps {
  name: string;
  label: string;
  value: string | null;
  onChange: (date: string) => void;
  min?: string;
  max?: string;
  description?: string;
  className?: string;
  children?: (props: {
    value: string | null;
    select: (date: string) => void;
    min?: string;
    max?: string;
  }) => React.ReactNode;
}

export function SemanticDatePicker({
  name,
  label,
  value,
  onChange,
  min,
  max,
  description,
  className,
  children,
}: SemanticDatePickerProps) {
  useSemantic({
    role: "Field",
    title: label,
    fields: [
      {
        key: name,
        label,
        type: "date",
        value,
        min,
        max,
        description: description ?? `Date range: ${min ?? "any"} to ${max ?? "any"}`,
        set: (v) => onChange(String(v)),
      },
    ],
  });

  if (children) {
    return <>{children({ value, select: onChange, min, max })}</>;
  }

  return (
    <div className={className}>
      <input
        type="date"
        value={value ?? ""}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
