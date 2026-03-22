import type { SemanticPage, SemanticNode, SemanticField } from "../core";

/**
 * Generate JSON-LD structured data from a SemanticPage.
 *
 * Maps semantic nodes to schema.org types where possible,
 * and falls back to a generic WebPage + InteractionCounter pattern.
 */
export function toJsonLd(
  page: SemanticPage,
  options?: {
    baseUrl?: string;
  }
): object {
  const baseUrl = options?.baseUrl ?? "";

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    description: page.description ?? "",
    url: baseUrl,
    mainEntity: page.nodes.map((node) => nodeToSchema(node)),
  };

  // Add interactive actions as potential actions
  const actions = collectActions(page);
  if (actions.length > 0) {
    jsonLd.potentialAction = actions.map((a) => ({
      "@type": "Action",
      name: a.key,
      description: a.description ?? a.label,
      actionStatus: a.enabled !== false ? "PotentialActionStatus" : "DisabledActionStatus",
    }));
  }

  return jsonLd;
}

/**
 * Convenience: returns the JSON-LD as a string ready to embed in a <script> tag.
 */
export function toJsonLdScript(
  page: SemanticPage,
  options?: { baseUrl?: string }
): string {
  return JSON.stringify(toJsonLd(page, options), null, 2);
}

function nodeToSchema(node: SemanticNode): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    "@type": guessSchemaType(node.role),
    name: node.title ?? node.role,
  };

  if (node.description) {
    schema.description = node.description;
  }

  // Map meta to schema properties
  if (node.meta) {
    for (const [k, v] of Object.entries(node.meta)) {
      schema[k] = v;
    }
  }

  // Map fields
  const fieldData: Record<string, unknown> = {};
  for (const field of node.fields) {
    if (field.type !== "action") {
      fieldData[field.key] = {
        "@type": "PropertyValue",
        name: field.label,
        value: field.value,
        ...(field.options ? { valueReference: field.options } : {}),
      };
    }
  }

  if (Object.keys(fieldData).length > 0) {
    schema.additionalProperty = Object.values(fieldData);
  }

  return schema;
}

function guessSchemaType(role: string): string {
  const map: Record<string, string> = {
    restaurant: "Restaurant",
    product: "Product",
    form: "WebApplication",
    info: "Thing",
    list: "ItemList",
    article: "Article",
    event: "Event",
    person: "Person",
    organization: "Organization",
  };
  return map[role.toLowerCase()] ?? "Thing";
}

function collectActions(page: SemanticPage): SemanticField[] {
  const actions: SemanticField[] = [];
  for (const node of page.nodes) {
    for (const field of node.fields) {
      if (field.type === "action") {
        actions.push(field);
      }
    }
  }
  return actions;
}
