import React from "react";
import { useSemantic } from "../core";

export interface SemanticTextInputProps {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "tel" | "url" | "number";
  description?: string;
  className?: string;
}

export function SemanticTextInput({
  name,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  description,
  className,
}: SemanticTextInputProps) {
  useSemantic({
    role: "Field",
    title: label,
    fields: [
      {
        key: name,
        label,
        type: type === "number" ? "number" : "text",
        value,
        description,
        set: (v) => onChange(String(v)),
      },
    ],
  });

  return (
    <div className={className}>
      <input
        type={type}
        value={value}
        placeholder={placeholder ?? label}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
