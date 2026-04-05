import { describe, it, expect } from "vitest";
import { toHeadHtml } from "../../outputs/head";
import type { SemanticPage } from "../../types";

function makePage(overrides?: Partial<SemanticPage>): SemanticPage {
  return {
    title: "Test Page",
    description: "A test page",
    nodes: [],
    ...overrides,
  };
}

describe("toHeadHtml", () => {
  it("returns meta tag and JSON-LD script", () => {
    const page = makePage();
    const html = toHeadHtml(page);

    expect(html).toContain('<meta name="semant" content="0.1.0" />');
    expect(html).toContain('<script type="application/ld+json">');
    expect(html).toContain("</script>");
  });

  it("includes node data in JSON-LD", () => {
    const page = makePage({
      nodes: [
        {
          id: "n1",
          role: "restaurant",
          title: "Sushi Place",
          fields: [],
        },
      ],
    });
    const html = toHeadHtml(page);

    expect(html).toContain("Sushi Place");
  });

  it("uses custom version", () => {
    const page = makePage();
    const html = toHeadHtml(page, { version: "0.2.0" });

    expect(html).toContain('content="0.2.0"');
  });

  it("passes baseUrl to JSON-LD", () => {
    const page = makePage();
    const html = toHeadHtml(page, { baseUrl: "https://example.com" });

    expect(html).toContain("https://example.com");
  });
});
