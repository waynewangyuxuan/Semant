import React from "react";
import { useSemantic } from "../context";

export interface SemanticInfoProps {
  /** Semantic role, e.g. "restaurant", "product", "article" */
  role: string;
  title?: string;
  description?: string;
  /** Key-value metadata — all of this becomes AI-readable */
  meta?: Record<string, unknown>;
  order?: number;
  children?: React.ReactNode;
  className?: string;
}

/**
 * A non-interactive semantic block. Use it to expose static
 * information (restaurant details, product specs, etc.) to AI.
 */
export function SemanticInfo({
  role,
  title,
  description,
  meta,
  order,
  children,
  className,
}: SemanticInfoProps) {
  useSemantic({
    role,
    title,
    description,
    meta,
    fields: [],
    order,
  });

  return <div className={className}>{children}</div>;
}
