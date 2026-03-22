import type { SemanticPage, SemanticField, SemanticNode } from "../types";

/**
 * Render a SemanticPage as plain text that an AI can read and operate.
 */
export function toPlainText(page: SemanticPage): string {
  const lines: string[] = [];

  lines.push(`# ${page.title}`);
  if (page.description) {
    lines.push(`> ${page.description}`);
  }
  lines.push("");

  const commands: string[] = [];

  for (const node of page.nodes) {
    lines.push(formatNode(node));
    lines.push("");

    for (const field of node.fields) {
      if (field.type === "action" && field.execute) {
        commands.push(field.key);
      } else if (field.set) {
        const hint = formatOptionsHint(field);
        commands.push(`set ${field.key} ${hint}`);
      }
    }
  }

  if (commands.length > 0) {
    lines.push("## Commands");
    for (const cmd of commands) {
      lines.push(`  ${cmd}`);
    }
  }

  return lines.join("\n");
}

function formatNode(node: SemanticNode): string {
  const lines: string[] = [];
  const header = node.title ? `[${node.role}: ${node.title}]` : `[${node.role}]`;
  lines.push(header);

  if (node.description) {
    lines.push(`  ${node.description}`);
  }

  if (node.meta) {
    for (const [k, v] of Object.entries(node.meta)) {
      lines.push(`  ${k}: ${formatValue(v)}`);
    }
  }

  for (const field of node.fields) {
    lines.push(formatField(field));
  }

  return lines.join("\n");
}

function formatField(field: SemanticField): string {
  const parts: string[] = [];
  const constraints = field.constraints ?? {};

  if (field.type === "action") {
    const enabled = constraints.enabled !== false;
    parts.push(`  [Action: ${field.key}] enabled: ${enabled}`);
    if (field.description) {
      parts.push(`    ${field.description}`);
    }
    return parts.join("\n");
  }

  const typeLabel = field.type.charAt(0).toUpperCase() + field.type.slice(1);
  let line = `  [${typeLabel}: ${field.key}]`;

  const options = constraints.options as unknown[] | undefined;
  if (options && options.length > 0) {
    line += ` options: [${options.join(", ")}]`;
  }

  const min = constraints.min;
  const max = constraints.max;
  if (min !== undefined || max !== undefined) {
    line += ` range: ${min ?? "\u221E"}..${max ?? "\u221E"}`;
  }

  line += ` current: ${formatValue(field.value)}`;
  parts.push(line);

  if (field.description) {
    parts.push(`    ${field.description}`);
  }

  return parts.join("\n");
}

function formatOptionsHint(field: SemanticField): string {
  const constraints = field.constraints ?? {};
  const options = constraints.options as unknown[] | undefined;

  if (options && options.length > 0) {
    if (options.length <= 8) {
      return `<${options.join("|")}>`;
    }
    return `<${options[0]}..${options[options.length - 1]}>`;
  }

  const min = constraints.min;
  const max = constraints.max;
  if (min !== undefined && max !== undefined) {
    return `<${min}-${max}>`;
  }

  return `<value>`;
}

function formatValue(v: unknown): string {
  if (v === null || v === undefined) return "null";
  if (Array.isArray(v)) return `[${v.join(", ")}]`;
  return String(v);
}
