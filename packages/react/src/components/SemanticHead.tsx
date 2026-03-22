import React from "react";
import { useSemanticPage } from "../context";
import { toJsonLdScript } from "@semant/core";

export interface SemanticHeadProps {
  /** Base URL for JSON-LD (e.g. "https://yoursite.com") */
  baseUrl?: string;
}

/**
 * Injects a <meta name="semant"> discovery signal and
 * <script type="application/ld+json"> into <head>.
 * Updates automatically when semantic state changes.
 */
export function SemanticHead({ baseUrl }: SemanticHeadProps) {
  const page = useSemanticPage();
  const jsonLd = toJsonLdScript(page, { baseUrl });

  return (
    <>
      <meta name="semant" content="0.1.0" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
    </>
  );
}
