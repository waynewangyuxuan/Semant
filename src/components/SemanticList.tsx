import React from "react";
import { useSemantic } from "../core";

export interface SemanticListProps<T> {
  name: string;
  label: string;
  items: T[];
  /** Extract a display label from each item */
  getLabel: (item: T) => string;
  /** Extract a unique key from each item */
  getKey: (item: T) => string;
  /** Optional: extract status/metadata per item */
  getMeta?: (item: T) => Record<string, unknown>;
  description?: string;
  order?: number;
  className?: string;
  children?: (props: { items: T[] }) => React.ReactNode;
}

export function SemanticList<T>({
  name,
  label,
  items,
  getLabel,
  getKey,
  getMeta,
  description,
  order,
  className,
  children,
}: SemanticListProps<T>) {
  const itemDescriptions = items.map((item) => {
    const meta = getMeta?.(item);
    const metaStr = meta
      ? " " + Object.entries(meta).map(([k, v]) => `${k}=${v}`).join(", ")
      : "";
    return `${getLabel(item)}${metaStr}`;
  });

  useSemantic({
    role: "List",
    title: label,
    description,
    meta: {
      count: items.length,
      items: itemDescriptions,
    },
    fields: [],
    order,
  });

  if (children) {
    return <div className={className}>{children({ items })}</div>;
  }

  return (
    <ul className={className}>
      {items.map((item) => (
        <li key={getKey(item)}>{getLabel(item)}</li>
      ))}
    </ul>
  );
}
