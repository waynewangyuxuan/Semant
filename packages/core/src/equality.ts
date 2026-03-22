import type { SemanticField, SemanticNode } from "./types";

// ── Shallow comparison (skip function refs, compare data only) ──

export function shallowEqualField(a: SemanticField, b: SemanticField): boolean {
  if (
    a.key !== b.key ||
    a.label !== b.label ||
    a.type !== b.type ||
    a.value !== b.value ||
    a.description !== b.description
  )
    return false;

  // Shallow-compare constraints
  if (a.constraints !== b.constraints) {
    if (!a.constraints || !b.constraints) return false;
    const aKeys = Object.keys(a.constraints);
    const bKeys = Object.keys(b.constraints);
    if (aKeys.length !== bKeys.length) return false;
    for (const k of aKeys) {
      if (a.constraints[k] !== b.constraints[k]) return false;
    }
  }

  return true;
}

export function shallowEqualNode(a: SemanticNode, b: SemanticNode): boolean {
  if (
    a.role !== b.role ||
    a.title !== b.title ||
    a.description !== b.description ||
    a.order !== b.order
  )
    return false;

  if (a.fields.length !== b.fields.length) return false;
  for (let i = 0; i < a.fields.length; i++) {
    if (!shallowEqualField(a.fields[i], b.fields[i])) return false;
  }

  if (a.meta !== b.meta) {
    if (!a.meta || !b.meta) return false;
    const aKeys = Object.keys(a.meta);
    const bKeys = Object.keys(b.meta);
    if (aKeys.length !== bKeys.length) return false;
    for (const k of aKeys) {
      if (a.meta[k] !== b.meta[k]) return false;
    }
  }

  return true;
}
