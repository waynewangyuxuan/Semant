import React from "react";
import { useSemantic } from "../context";

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
  /** Render prop for full custom rendering */
  render?: (props: {
    execute: () => void;
    enabled: boolean;
    label: string;
  }) => React.ReactNode;
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
  render,
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
        constraints: { enabled, requires },
        description:
          description ??
          (requires?.length
            ? `Requires: ${requires.join(", ")}`
            : undefined),
        execute: onExecute,
      },
    ],
  });

  if (render) {
    return <>{render({ execute: onExecute, enabled, label })}</>;
  }

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
