import type { SemanticPage } from "../core";

/**
 * Generate an llms.txt-compatible output from a SemanticPage.
 *
 * Follows the llmstxt.org spec:
 * - H1 with project/page name
 * - Blockquote with summary
 * - Sections with key info
 * - Links to detailed resources
 *
 * For interactive pages, we extend the format with a Commands section
 * so AI agents know what operations are available.
 */
export function toLlmsTxt(
  page: SemanticPage,
  options?: {
    /** Base URL of the site */
    baseUrl?: string;
    /** Additional links to include */
    links?: Array<{ title: string; url: string; description?: string }>;
  }
): string {
  const lines: string[] = [];
  const baseUrl = options?.baseUrl ?? "";

  // H1 — required
  lines.push(`# ${page.title}`);
  lines.push("");

  // Blockquote — summary
  if (page.description) {
    lines.push(`> ${page.description}`);
    lines.push("");
  }

  // Content sections
  for (const node of page.nodes) {
    lines.push(`## ${node.title ?? node.role}`);

    if (node.description) {
      lines.push(node.description);
    }

    // Metadata as key-value
    if (node.meta) {
      lines.push("");
      for (const [k, v] of Object.entries(node.meta)) {
        lines.push(`- **${k}**: ${v}`);
      }
    }

    // Interactive fields
    const interactiveFields = node.fields.filter(
      (f) => f.type !== "action" && f.set
    );
    const actions = node.fields.filter((f) => f.type === "action");

    if (interactiveFields.length > 0) {
      lines.push("");
      lines.push("### Fields");
      for (const field of interactiveFields) {
        let entry = `- **${field.label}** (\`${field.key}\`)`;
        if (field.options?.length) {
          entry += `: ${field.options.join(", ")}`;
        }
        if (field.value !== null && field.value !== undefined) {
          entry += ` — current: ${field.value}`;
        }
        lines.push(entry);
      }
    }

    if (actions.length > 0) {
      lines.push("");
      lines.push("### Actions");
      for (const action of actions) {
        let entry = `- \`${action.key}\``;
        if (action.description) entry += `: ${action.description}`;
        if (action.enabled === false) entry += " (disabled)";
        lines.push(entry);
      }
    }

    lines.push("");
  }

  // Additional links
  if (options?.links?.length) {
    lines.push("## Resources");
    for (const link of options.links) {
      let entry = `- [${link.title}](${link.url})`;
      if (link.description) entry += `: ${link.description}`;
      lines.push(entry);
    }
    lines.push("");
  }

  return lines.join("\n");
}
