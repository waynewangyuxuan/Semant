/**
 * @vitest-environment node
 */
import { describe, it, expect } from "vitest";
import { createSSRApp, defineComponent, h } from "vue";
import { renderToString } from "vue/server-renderer";
import { SemanticProvider } from "../components/SemanticProvider";
import { SemanticSelect } from "../components/SemanticSelect";
import { SemanticAction } from "../components/SemanticAction";
import { SemanticCheckbox } from "../components/SemanticCheckbox";
import { SemanticBridge } from "../components/SemanticBridge";

describe("Vue SSR", () => {
  it("populates store during SSR — bridge contains semantic state", async () => {
    const App = defineComponent({
      setup() {
        return () =>
          h(SemanticProvider, { title: "SSR Test" }, {
            default: () => [
              h(SemanticSelect, {
                name: "size",
                label: "Party Size",
                options: [
                  { value: 1, label: "1" },
                  { value: 2, label: "2" },
                  { value: 3, label: "3" },
                ],
                value: 2,
                onChange: () => {},
              }),
              h(SemanticAction, {
                name: "submit",
                label: "Book Now",
                onExecute: () => {},
              }),
              h(SemanticBridge),
            ],
          });
      },
    });

    const app = createSSRApp(App);
    const html = await renderToString(app);

    // Bridge div should exist with semantic state
    expect(html).toContain('id="__semant"');
    expect(html).toContain("data-semant-version");

    // Should contain registered field data (plaintext output)
    expect(html).toContain("Party Size");
    expect(html).toContain("size");
  });

  it("renders multiple nodes into bridge plaintext", async () => {
    const App = defineComponent({
      setup() {
        return () =>
          h(SemanticProvider, { title: "Multi Node" }, {
            default: () => [
              h(SemanticSelect, {
                name: "color",
                label: "Color",
                options: [
                  { value: "red", label: "Red" },
                  { value: "blue", label: "Blue" },
                ],
                value: "red",
                onChange: () => {},
              }),
              h(SemanticCheckbox, {
                name: "gift_wrap",
                label: "Gift Wrap",
                checked: true,
                onChange: () => {},
              }),
              h(SemanticBridge),
            ],
          });
      },
    });

    const app = createSSRApp(App);
    const html = await renderToString(app);

    expect(html).toContain("Color");
    expect(html).toContain("Gift Wrap");
  });

  it("does not crash without SemanticBridge", async () => {
    const App = defineComponent({
      setup() {
        return () =>
          h(SemanticProvider, { title: "No Bridge" }, {
            default: () => [
              h(SemanticSelect, {
                name: "x",
                label: "X",
                options: [{ value: 1, label: "1" }],
                value: 1,
                onChange: () => {},
              }),
            ],
          });
      },
    });

    const app = createSSRApp(App);
    const html = await renderToString(app);
    expect(html).toBeDefined();
  });
});
