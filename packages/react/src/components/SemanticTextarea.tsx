import React from "react";
import { useSemantic } from "../context";

export interface SemanticTextareaProps {
  /** Field key used in AI commands */
  name: string;
  /** Human-readable label */
  label: string;
  /** Current value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Number of visible rows */
  rows?: number;
  /** Maximum character length */
  maxLength?: number;
  /** AI-facing description */
  description?: string;
  /** Custom className */
  className?: string;
  /** Render prop for full custom rendering */
  children?: (props: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  }) => React.ReactNode;
}

export function SemanticTextarea({
  name,
  label,
  value,
  onChange,
  placeholder,
  rows,
  maxLength,
  description,
  className,
  children,
}: SemanticTextareaProps) {
  const constraints: Record<string, unknown> = {};
  if (maxLength !== undefined) constraints.maxLength = maxLength;

  useSemantic({
    role: "Field",
    title: label,
    fields: [
      {
        key: name,
        label,
        type: "textarea",
        value,
        constraints: Object.keys(constraints).length > 0 ? constraints : undefined,
        description,
        set: (v) => onChange(String(v)),
      },
    ],
  });

  if (children) {
    return <>{children({ value, onChange, placeholder })}</>;
  }

  return (
    <div className={className}>
      <textarea
        value={value}
        placeholder={placeholder ?? label}
        rows={rows}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
