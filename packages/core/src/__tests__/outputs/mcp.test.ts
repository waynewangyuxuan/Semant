import { describe, it, expect } from "vitest";
import { toMCPTools } from "../../outputs/mcp";
import type { SemanticPage } from "../../types";

function makePage(
  overrides?: Partial<SemanticPage>
): SemanticPage {
  return {
    title: "Test Page",
    description: "A test page",
    nodes: [],
    ...overrides,
  };
}

describe("toMCPTools", () => {
  it("generates a tool for a select field with enum", () => {
    const page = makePage({
      nodes: [
        {
          id: "n1",
          role: "form",
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
        },
      ],
    });

    const tools = toMCPTools(page, { introspection: false });
    expect(tools).toHaveLength(1);

    const tool = tools[0];
    expect(tool.name).toBe("set_party_size");
    expect(tool.inputSchema.required).toEqual(["value"]);

    const valueProp = tool.inputSchema.properties.value as Record<string, unknown>;
    expect(valueProp.type).toBe("number");
    expect(valueProp.enum).toEqual([1, 2, 3, 4]);
  });

  it("generates a tool for a date field", () => {
    const page = makePage({
      nodes: [
        {
          id: "n1",
          role: "form",
          fields: [
            {
              key: "check_in",
              label: "Check-in Date",
              type: "date",
              value: "2025-06-15",
              set: () => {},
            },
          ],
        },
      ],
    });

    const tools = toMCPTools(page, { introspection: false });
    const valueProp = tools[0].inputSchema.properties.value as Record<string, unknown>;
    expect(valueProp.type).toBe("string");
    expect(valueProp.format).toBe("date");
  });

  it("generates a tool for a number field with min/max", () => {
    const page = makePage({
      nodes: [
        {
          id: "n1",
          role: "form",
          fields: [
            {
              key: "quantity",
              label: "Quantity",
              type: "number",
              value: 1,
              constraints: { min: 1, max: 10 },
              set: () => {},
            },
          ],
        },
      ],
    });

    const tools = toMCPTools(page, { introspection: false });
    const valueProp = tools[0].inputSchema.properties.value as Record<string, unknown>;
    expect(valueProp.type).toBe("number");
    expect(valueProp.minimum).toBe(1);
    expect(valueProp.maximum).toBe(10);
  });

  it("generates a tool for a text field (default string)", () => {
    const page = makePage({
      nodes: [
        {
          id: "n1",
          role: "form",
          fields: [
            {
              key: "guest_name",
              label: "Guest Name",
              type: "text",
              value: "",
              description: "Name of the guest",
              set: () => {},
            },
          ],
        },
      ],
    });

    const tools = toMCPTools(page, { introspection: false });
    const valueProp = tools[0].inputSchema.properties.value as Record<string, unknown>;
    expect(valueProp.type).toBe("string");
    expect(valueProp.description).toBe("Name of the guest");
  });

  it("generates a tool for an action field with empty input", () => {
    const page = makePage({
      nodes: [
        {
          id: "n1",
          role: "form",
          fields: [
            {
              key: "submit_booking",
              label: "Submit Booking",
              type: "action",
              value: null,
              description: "Submit the booking",
              execute: () => {},
            },
          ],
        },
      ],
    });

    const tools = toMCPTools(page, { introspection: false });
    expect(tools).toHaveLength(1);

    const tool = tools[0];
    expect(tool.name).toBe("submit_booking");
    expect(tool.description).toBe("Submit the booking");
    expect(tool.inputSchema.properties).toEqual({});
    expect(tool.inputSchema.required).toBeUndefined();
  });

  it("marks disabled actions in description", () => {
    const page = makePage({
      nodes: [
        {
          id: "n1",
          role: "form",
          fields: [
            {
              key: "submit",
              label: "Submit",
              type: "action",
              value: null,
              description: "Submit form",
              constraints: { enabled: false },
              execute: () => {},
            },
          ],
        },
      ],
    });

    const tools = toMCPTools(page, { introspection: false });
    expect(tools[0].description).toContain("(currently disabled)");
  });

  it("includes introspection tools by default with semant_ prefix", () => {
    const page = makePage();
    const tools = toMCPTools(page);

    const names = tools.map((t) => t.name);
    expect(names).toContain("semant_get_state");
    expect(names).toContain("semant_list_fields");
  });

  it("excludes introspection tools when introspection: false", () => {
    const page = makePage();
    const tools = toMCPTools(page, { introspection: false });
    expect(tools).toHaveLength(0);
  });

  it("uses custom setPrefix", () => {
    const page = makePage({
      nodes: [
        {
          id: "n1",
          role: "form",
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
        },
      ],
    });

    const tools = toMCPTools(page, { setPrefix: "update_", introspection: false });
    expect(tools[0].name).toBe("update_color");
  });

  it("uses custom introspectionPrefix", () => {
    const page = makePage();
    const tools = toMCPTools(page, { introspectionPrefix: "page_" });

    const names = tools.map((t) => t.name);
    expect(names).toContain("page_get_state");
    expect(names).toContain("page_list_fields");
  });

  it("throws on name collision between field and introspection tool", () => {
    const page = makePage({
      nodes: [
        {
          id: "n1",
          role: "form",
          fields: [
            {
              key: "semant_get_state",
              label: "State",
              type: "action",
              value: null,
              execute: () => {},
            },
          ],
        },
      ],
    });

    expect(() => toMCPTools(page)).toThrow(/duplicate tool name/);
  });

  it("skips fields without set or execute", () => {
    const page = makePage({
      nodes: [
        {
          id: "n1",
          role: "info",
          fields: [
            {
              key: "rating",
              label: "Rating",
              type: "number",
              value: 4.5,
              // no set, no execute — read-only display
            },
          ],
        },
      ],
    });

    const tools = toMCPTools(page, { introspection: false });
    expect(tools).toHaveLength(0);
  });

  it("handles multiple nodes with mixed field types", () => {
    const page = makePage({
      nodes: [
        {
          id: "n1",
          role: "form",
          fields: [
            {
              key: "size",
              label: "Size",
              type: "select",
              value: "M",
              constraints: { options: ["S", "M", "L"] },
              set: () => {},
            },
          ],
        },
        {
          id: "n2",
          role: "cart",
          fields: [
            {
              key: "add_to_cart",
              label: "Add to Cart",
              type: "action",
              value: null,
              execute: () => {},
            },
          ],
        },
      ],
    });

    const tools = toMCPTools(page, { introspection: false });
    expect(tools).toHaveLength(2);
    expect(tools[0].name).toBe("set_size");
    expect(tools[1].name).toBe("add_to_cart");
  });

  it("infers string type for string options", () => {
    const page = makePage({
      nodes: [
        {
          id: "n1",
          role: "form",
          fields: [
            {
              key: "color",
              label: "Color",
              type: "select",
              value: "red",
              constraints: { options: ["red", "green", "blue"] },
              set: () => {},
            },
          ],
        },
      ],
    });

    const tools = toMCPTools(page, { introspection: false });
    const valueProp = tools[0].inputSchema.properties.value as Record<string, unknown>;
    expect(valueProp.type).toBe("string");
    expect(valueProp.enum).toEqual(["red", "green", "blue"]);
  });
});
