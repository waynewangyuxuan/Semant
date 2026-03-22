import React from "react";
import { useSemanticPage } from "../core";
import { toJsonLdScript } from "../outputs/jsonld";

export interface SemanticHeadProps {
  /** Base URL for JSON-LD (e.g. "https://yoursite.com") */
  baseUrl?: string;
}

/**
 * Injects a <script type="application/ld+json"> into <head>
 * with the current semantic state. Updates automatically.
 */
export function SemanticHead({ baseUrl }: SemanticHeadProps) {
  const page = useSemanticPage();
  const jsonLd = toJsonLdScript(page, { baseUrl });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd }}
    />
  );
}
