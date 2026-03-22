import React from "react";
import { useSemantic } from "../core";

export interface SemanticActionProps {
  name: string;
  label: string;
  onExecute: () => void;
  enabled?: boolean;
  /** What fields are required before this action can fire */
  requires?: string[];
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export function SemanticAction({
  name,
  label,
  onExecute,
  enabled = true,
  requires,
  description,
  className,
  children,
}: SemanticActionProps) {
  useSemantic({
    role: "Action",
    title: label,
    fields: [
      {
        key: name,
        label,
        type: "action",
        value: null,
        enabled,
        description:
          description ??
          (requires?.length
            ? `Requires: ${requires.join(", ")}`
            : undefined),
        execute: onExecute,
      },
    ],
  });

  return (
    <button
      className={className}
      disabled={!enabled}
      onClick={onExecute}
    >
      {children ?? label}
    </button>
  );
}
