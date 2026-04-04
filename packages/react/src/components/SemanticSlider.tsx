import React from "react";
import { useSemantic } from "../context";

export interface SemanticSliderProps {
  /** Field key used in AI commands */
  name: string;
  /** Human-readable label */
  label: string;
  /** Current value */
  value: number;
  /** Change handler */
  onChange: (value: number) => void;
  /** Minimum value */
  min: number;
  /** Maximum value */
  max: number;
  /** Step increment (default 1) */
  step?: number;
  /** AI-facing description */
  description?: string;
  /** Custom className */
  className?: string;
  /** Render prop for full custom rendering */
  children?: (props: {
    value: number;
    set: (v: number) => void;
    min: number;
    max: number;
    step: number;
  }) => React.ReactNode;
}

export function SemanticSlider({
  name,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  description,
  className,
  children,
}: SemanticSliderProps) {
  useSemantic({
    role: "Field",
    title: label,
    fields: [
      {
        key: name,
        label,
        type: "slider",
        value,
        constraints: { min, max, step },
        description,
        set: (v) => onChange(Number(v)),
      },
    ],
  });

  if (children) {
    return <>{children({ value, set: onChange, min, max, step })}</>;
  }

  return (
    <div className={className}>
      <label>
        {label}: {value}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </label>
    </div>
  );
}
