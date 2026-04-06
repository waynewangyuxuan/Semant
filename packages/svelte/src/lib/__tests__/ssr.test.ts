/**
 * @vitest-environment node
 *
 * Test that the SSR registration path works correctly.
 * In SSR (typeof window === "undefined"), useSemantic should
 * register nodes synchronously so output renderers have data.
 */
import { describe, it, expect } from "vitest";
import { SemanticStore, toPlainText, toHeadHtml } from "@semant/core";

describe("Svelte SSR (store-level)", () => {
  it("synchronous registration populates store for SSR", () => {
    // Simulate what useSemantic does during SSR:
    // isServer = true → call store.register() synchronously
    const store = new SemanticStore();
    store.setPage("SSR Test", "Server-rendered page");

    // Simulate SemanticSelect registration
    store.register({
      id: "sel-1",
      role: "Field",
      title: "Party Size",
      fields: [
        {
          key: "party_size",
          label: "Party Size",
          type: "select",
          value: 2,
          constraints: { options: [1, 2, 3, 4] },
          set: () => {},
        },
      ],
    });

    // Simulate SemanticAction registration
    store.register({
      id: "act-1",
      role: "Action",
      title: "Book",
      fields: [
        {
          key: "submit",
          label: "Book Now",
          type: "action",
          value: null,
          execute: () => {},
        },
      ],
    });

    const snap = store.getSnapshot();
    expect(snap.nodes).toHaveLength(2);

    // toPlainText should have all fields
    const text = toPlainText(snap);
    expect(text).toContain("SSR Test");
    expect(text).toContain("party_size");
    expect(text).toContain("submit");
    expect(text).toContain("current: 2");
  });

  it("toHeadHtml produces valid head HTML from SSR store", () => {
    const store = new SemanticStore();
    store.setPage("My App");
    store.register({
      id: "n1",
      role: "Field",
      title: "Color",
      fields: [
        {
          key: "color",
          label: "Color",
          type: "select",
          value: "red",
          constraints: { options: ["red", "blue"] },
          set: () => {},
        },
      ],
    });

    const html = toHeadHtml(store.getSnapshot(), { baseUrl: "https://example.com" });
    expect(html).toContain('<meta name="semant" content="0.1.0" />');
    expect(html).toContain("application/ld+json");
    expect(html).toContain("My App");
    expect(html).toContain("https://example.com");
  });

  it("subscriber receives updates during SSR registration", () => {
    const store = new SemanticStore();
    store.setPage("Test");

    let snapshots: number[] = [];
    store.subscribe(() => {
      snapshots.push(store.getSnapshot().nodes.length);
    });

    store.register({ id: "n1", role: "Field", fields: [] });
    store.register({ id: "n2", role: "Field", fields: [] });

    expect(snapshots).toEqual([1, 2]);
  });

  it("isServer detection works in node environment", () => {
    // This test runs in @vitest-environment node, so window is undefined
    expect(typeof window).toBe("undefined");
  });
});
