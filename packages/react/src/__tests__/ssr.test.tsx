/**
 * @vitest-environment node
 */
import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { SemanticProvider, useSemantic, useSemanticPage } from "../context";
import { SemanticSelect } from "../components/SemanticSelect";
import { SemanticAction } from "../components/SemanticAction";
import { SemanticCheckbox } from "../components/SemanticCheckbox";
import { SemanticTextInput } from "../components/SemanticTextInput";
import { SemanticBridge } from "../components/SemanticBridge";
import { SemanticHead } from "../components/SemanticHead";

describe("React SSR", () => {
  it("does not crash during renderToString", () => {
    const html = renderToString(
      React.createElement(
        SemanticProvider,
        { title: "SSR Test" },
        React.createElement(SemanticSelect, {
          name: "size",
          label: "Party Size",
          options: [
            { value: 1, label: "1" },
            { value: 2, label: "2" },
          ],
          value: 1,
          onChange: () => {},
        })
      )
    );

    expect(html).toBeDefined();
    expect(html).toContain("select");
  });

  it("populates bridge with semantic state during SSR", () => {
    const html = renderToString(
      React.createElement(
        SemanticProvider,
        { title: "SSR Bridge" },
        React.createElement(SemanticSelect, {
          name: "color",
          label: "Color",
          options: [
            { value: "red", label: "Red" },
            { value: "blue", label: "Blue" },
          ],
          value: "red",
          onChange: () => {},
        }),
        React.createElement(SemanticAction, {
          name: "submit",
          label: "Submit",
          onExecute: () => {},
        }),
        React.createElement(SemanticBridge, {})
      )
    );

    // Bridge div present
    expect(html).toContain('id="__semant"');
    expect(html).toContain("data-semant-version");

    // Semantic state populated (plaintext contains field data)
    expect(html).toContain("Color");
    expect(html).toContain("color");
    expect(html).toContain("submit");
  });

  it("renders SemanticHead with JSON-LD during SSR", () => {
    const html = renderToString(
      React.createElement(
        SemanticProvider,
        { title: "Head Test" },
        React.createElement(SemanticSelect, {
          name: "meal",
          label: "Meal Choice",
          options: [
            { value: "lunch", label: "Lunch" },
            { value: "dinner", label: "Dinner" },
          ],
          value: "lunch",
          onChange: () => {},
        }),
        React.createElement(SemanticHead, { baseUrl: "https://test.com" })
      )
    );

    // Meta discovery tag
    expect(html).toContain('name="semant"');
    expect(html).toContain('content="0.1.0"');

    // JSON-LD script with actual data
    expect(html).toContain("application/ld+json");
    expect(html).toContain("Head Test");
  });

  it("handles multiple components registering during SSR", () => {
    const html = renderToString(
      React.createElement(
        SemanticProvider,
        { title: "Multi" },
        React.createElement(SemanticSelect, {
          name: "size",
          label: "Size",
          options: [{ value: "S", label: "S" }, { value: "M", label: "M" }],
          value: "S",
          onChange: () => {},
        }),
        React.createElement(SemanticTextInput, {
          name: "name",
          label: "Name",
          value: "Alice",
          onChange: () => {},
        }),
        React.createElement(SemanticCheckbox, {
          name: "vip",
          label: "VIP",
          checked: true,
          onChange: () => {},
        }),
        React.createElement(SemanticAction, {
          name: "book",
          label: "Book",
          onExecute: () => {},
          requires: ["size", "name"],
        }),
        React.createElement(SemanticBridge, {})
      )
    );

    // All fields present in bridge plaintext
    expect(html).toContain("Size");
    expect(html).toContain("Name");
    expect(html).toContain("VIP");
    expect(html).toContain("book");
  });

  it("custom useSemantic works during SSR", () => {
    function CustomField() {
      useSemantic({
        role: "Field",
        title: "Custom",
        fields: [
          {
            key: "custom_field",
            label: "Custom Field",
            type: "text",
            value: "hello",
            set: () => {},
          },
        ],
      });
      return React.createElement("div", null, "custom");
    }

    const html = renderToString(
      React.createElement(
        SemanticProvider,
        { title: "Custom SSR" },
        React.createElement(CustomField, {}),
        React.createElement(SemanticBridge, {})
      )
    );

    expect(html).toContain("custom_field");
    expect(html).toContain("[Field: Custom]");
  });
});
