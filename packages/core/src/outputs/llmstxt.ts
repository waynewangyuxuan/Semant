import type { SemanticPage } from "../types";

/**
 * Generate an llms.txt-compatible output from a SemanticPage.
 * Follows the llmstxt.org spec.
 */
export function toLlmsTxt(
  page: SemanticPage,
  options?: {
    baseUrl?: string;
    links?: Array<{ title: string; url: string; description?: string }>;
  }
): string {
  const lines: string[] = [];

  lines.push(`# ${page.title}`);
  lines.push("");

  if (page.description) {
    lines.push(`> ${page.description}`);
    lines.push("");
  }

  for (const node of page.nodes) {
    lines.push(`## ${node.title ?? node.role}`);

    if (node.description) {
      lines.push(node.description);
    }

    if (node.meta) {
      lines.push("");
      for (const [k, v] of Object.entries(node.meta)) {
        lines.push(`- **${k}**: ${v}`);
      }
    }

    const interactiveFields = node.fields.filter(
      (f) => f.type !== "action" && f.set
    );
    const actions = node.fields.filter((f) => f.type === "action");

    if (interactiveFields.length > 0) {
      lines.push("");
      lines.push("### Fields");
      for (const field of interactiveFields) {
        const options = field.constraints?.options as unknown[] | undefined;
        let entry = `- **${field.label}** (\`${field.key}\`)`;
        if (options?.length) {
          entry += `: ${options.join(", ")}`;
        }
        if (field.value !== null && field.value !== undefined) {
          entry += ` \u2014 current: ${field.value}`;
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
        if (action.constraints?.enabled === false) entry += " (disabled)";
        lines.push(entry);
      }
    }

    lines.push("");
  }

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
