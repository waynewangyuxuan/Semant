import type { SemanticPage, SemanticField, SemanticNode } from "../core";

/**
 * Render a SemanticPage as plain text that an AI can read and operate.
 *
 * Example output:
 *
 *   # Restaurant Booking
 *   > Book a table at Nōri Omakase
 *
 *   [Restaurant Info]
 *     name: Nōri Omakase
 *     cuisine: Japanese Omakase
 *
 *   [Form: Book a Table]
 *     [Select: party_size] options: 1-8, current: 4
 *     [DatePicker: date] range: today → +21d, current: 2026-03-28
 *     [Action: submit_booking] enabled: true
 *
 *   ## Commands
 *     set party_size <1-8>
 *     set date <YYYY-MM-DD>
 *     submit_booking
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

    // Collect commands
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

  // Meta
  if (node.meta) {
    for (const [k, v] of Object.entries(node.meta)) {
      lines.push(`  ${k}: ${formatValue(v)}`);
    }
  }

  // Fields
  for (const field of node.fields) {
    lines.push(formatField(field));
  }

  return lines.join("\n");
}

function formatField(field: SemanticField): string {
  const parts: string[] = [];

  if (field.type === "action") {
    const enabled = field.enabled !== false;
    parts.push(`  [Action: ${field.key}] enabled: ${enabled}`);
    if (field.description) {
      parts.push(`    ${field.description}`);
    }
    return parts.join("\n");
  }

  const typeLabel = field.type.charAt(0).toUpperCase() + field.type.slice(1);
  let line = `  [${typeLabel}: ${field.key}]`;

  if (field.options && field.options.length > 0) {
    line += ` options: [${field.options.join(", ")}]`;
  }
  if (field.min !== undefined || field.max !== undefined) {
    line += ` range: ${field.min ?? "∞"}..${field.max ?? "∞"}`;
  }

  line += ` current: ${formatValue(field.value)}`;
  parts.push(line);

  if (field.description) {
    parts.push(`    ${field.description}`);
  }

  return parts.join("\n");
}

function formatOptionsHint(field: SemanticField): string {
  if (field.options && field.options.length > 0) {
    if (field.options.length <= 8) {
      return `<${field.options.join("|")}>`;
    }
    return `<${field.options[0]}..${field.options[field.options.length - 1]}>`;
  }
  if (field.min !== undefined && field.max !== undefined) {
    return `<${field.min}-${field.max}>`;
  }
  return `<value>`;
}

function formatValue(v: unknown): string {
  if (v === null || v === undefined) return "null";
  if (Array.isArray(v)) return `[${v.join(", ")}]`;
  return String(v);
}
