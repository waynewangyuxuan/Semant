import type { SemanticPage } from "../types";
import { toJsonLdScript } from "./jsonld";

export interface ToHeadHtmlOptions {
  /** Base URL for JSON-LD (e.g. "https://yoursite.com") */
  baseUrl?: string;
  /** Semant protocol version. Default: "0.1.0" */
  version?: string;
}

/**
 * Render the semantic <head> HTML for SSR injection.
 * Returns a <meta> discovery tag + <script type="application/ld+json">.
 * Useful for SSR frameworks that inject head content programmatically
 * (Next.js generateMetadata, Nuxt useHead, SvelteKit handle).
 */
export function toHeadHtml(
  page: SemanticPage,
  options?: ToHeadHtmlOptions
): string {
  const version = options?.version ?? "0.1.0";
  const jsonLd = toJsonLdScript(page, { baseUrl: options?.baseUrl });
  return [
    `<meta name="semant" content="${version}" />`,
    `<script type="application/ld+json">${jsonLd}</script>`,
  ].join("\n");
}
