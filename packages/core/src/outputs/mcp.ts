import type { SemanticPage, SemanticField } from "../types";

// ── Types ──

export interface MCPToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export interface ToMCPToolsOptions {
  /** Prefix for set tools. Default: "set_" */
  setPrefix?: string;
  /** Prefix for introspection tools. Default: "semant_" */
  introspectionPrefix?: string;
  /** Include get_state and list_fields introspection tools. Default: true */
  introspection?: boolean;
}

// ── Main function ──

/**
 * Convert a SemanticPage into an array of MCP-compatible tool definitions.
 * Each settable field becomes a "set_<key>" tool, each action becomes a tool,
 * and optional introspection tools provide page state access.
 */
export function toMCPTools(
  page: SemanticPage,
  options?: ToMCPToolsOptions
): MCPToolDefinition[] {
  const setPrefix = options?.setPrefix ?? "set_";
  const introspectionPrefix = options?.introspectionPrefix ?? "semant_";
  const includeIntrospection = options?.introspection !== false;

  const tools: MCPToolDefinition[] = [];

  for (const node of page.nodes) {
    for (const field of node.fields) {
      if (field.type === "action" && field.execute) {
        tools.push(actionToTool(field));
      } else if (field.set) {
        tools.push(fieldToTool(field, setPrefix));
      }
    }
  }

  if (includeIntrospection) {
    tools.push({
      name: `${introspectionPrefix}get_state`,
      description: `Get the current state of all fields on "${page.title}" as plain text`,
      inputSchema: { type: "object", properties: {} },
    });
    tools.push({
      name: `${introspectionPrefix}list_fields`,
      description: `List all available field keys and their current values on "${page.title}"`,
      inputSchema: { type: "object", properties: {} },
    });
  }

  // Collision detection
  const names = tools.map((t) => t.name);
  const seen = new Set<string>();
  for (const name of names) {
    if (seen.has(name)) {
      throw new Error(
        `toMCPTools: duplicate tool name "${name}". ` +
          `If a field key collides with an introspection tool, ` +
          `use the introspectionPrefix or setPrefix option to resolve it.`
      );
    }
    seen.add(name);
  }

  return tools;
}

// ── Helpers ──

function fieldToTool(
  field: SemanticField,
  setPrefix: string
): MCPToolDefinition {
  const schema = fieldToJsonSchema(field);
  const current = formatValue(field.value);
  const desc =
    field.description ??
    `Set ${field.label} (current: ${current})`;

  return {
    name: `${setPrefix}${field.key}`,
    description: desc,
    inputSchema: {
      type: "object",
      properties: { value: schema },
      required: ["value"],
    },
  };
}

function actionToTool(field: SemanticField): MCPToolDefinition {
  const enabled = field.constraints?.enabled !== false;
  let desc = field.description ?? `Execute action: ${field.label}`;
  if (!enabled) {
    desc += " (currently disabled)";
  }

  return {
    name: field.key,
    description: desc,
    inputSchema: { type: "object", properties: {} },
  };
}

function fieldToJsonSchema(
  field: SemanticField
): Record<string, unknown> {
  const constraints = field.constraints ?? {};
  const options = constraints.options as unknown[] | undefined;

  // Options → enum
  if (options && options.length > 0) {
    const jsonType = inferJsonType(options[0]);
    const schema: Record<string, unknown> = {
      type: jsonType,
      enum: options,
    };
    if (field.description) schema.description = field.description;
    return schema;
  }

  // Date
  if (field.type === "date") {
    const schema: Record<string, unknown> = {
      type: "string",
      format: "date",
    };
    if (field.description) schema.description = field.description;
    if (constraints.min !== undefined) schema.minimum = constraints.min;
    if (constraints.max !== undefined) schema.maximum = constraints.max;
    return schema;
  }

  // Number (explicit type or has min/max)
  const min = constraints.min;
  const max = constraints.max;
  if (
    field.type === "number" ||
    typeof min === "number" ||
    typeof max === "number"
  ) {
    const schema: Record<string, unknown> = { type: "number" };
    if (typeof min === "number") schema.minimum = min;
    if (typeof max === "number") schema.maximum = max;
    if (field.description) schema.description = field.description;
    return schema;
  }

  // Default: string
  const schema: Record<string, unknown> = { type: "string" };
  if (field.description) schema.description = field.description;
  return schema;
}

function inferJsonType(sample: unknown): string {
  if (typeof sample === "number") return "number";
  if (typeof sample === "boolean") return "boolean";
  return "string";
}

function formatValue(v: unknown): string {
  if (v === null || v === undefined) return "null";
  if (Array.isArray(v)) return `[${v.join(", ")}]`;
  return String(v);
}
