import React from "react";
import { useSemantic } from "../context";

export interface SemanticCheckboxProps {
  /** Field key used in AI commands */
  name: string;
  /** Human-readable label */
  label: string;
  /** Current checked state */
  checked: boolean;
  /** Change handler */
  onChange: (checked: boolean) => void;
  /** AI-facing description */
  description?: string;
  /** Custom className */
  className?: string;
  /** Render prop for full custom rendering */
  children?: (props: {
    checked: boolean;
    set: (value: boolean) => void;
  }) => React.ReactNode;
}

export function SemanticCheckbox({
  name,
  label,
  checked,
  onChange,
  description,
  className,
  children,
}: SemanticCheckboxProps) {
  useSemantic({
    role: "Field",
    title: label,
    fields: [
      {
        key: name,
        label,
        type: "checkbox",
        value: checked,
        description,
        set: (v) => onChange(v === true || v === "true" || v === 1),
      },
    ],
  });

  if (children) {
    return <>{children({ checked, set: onChange })}</>;
  }

  return (
    <div className={className}>
      <label>
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onChange(!checked)}
        />
        {` ${label}`}
      </label>
    </div>
  );
}
