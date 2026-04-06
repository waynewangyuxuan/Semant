import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import { userEvent } from "@testing-library/user-event";
import { tick } from "svelte";

// We need wrapper components that include SemanticProvider.
// Since we can't easily compose Svelte components in pure TS tests,
// we test the store integration directly and verify the HTML output
// via render of individual components wrapped in a test helper.

import { SemanticStore, toPlainText } from "@semant/core";

describe("Component store registration patterns", () => {
  it("SemanticSelect registers a select field", () => {
    const store = new SemanticStore();
    store.setPage("Test");
    store.register({
      id: "sel-1",
      role: "Field",
      title: "Color",
      fields: [
        {
          key: "color",
          label: "Color",
          type: "select",
          value: "red",
          constraints: { options: ["red", "blue", "green"] },
          set: () => {},
        },
      ],
    });

    const snap = store.getSnapshot();
    expect(snap.nodes).toHaveLength(1);
    expect(snap.nodes[0].fields[0].type).toBe("select");
    expect(snap.nodes[0].fields[0].value).toBe("red");

    const text = toPlainText(snap);
    expect(text).toContain("color");
    expect(text).toContain("red");
  });

  it("SemanticCheckbox registers a checkbox field", () => {
    const store = new SemanticStore();
    store.setPage("Test");
    store.register({
      id: "cb-1",
      role: "Field",
      title: "VIP",
      fields: [
        {
          key: "vip",
          label: "VIP",
          type: "checkbox",
          value: true,
          set: (v) => {},
        },
      ],
    });

    const field = store.getSnapshot().nodes[0].fields[0];
    expect(field.type).toBe("checkbox");
    expect(field.value).toBe(true);
  });

  it("SemanticAction registers an action field", () => {
    const store = new SemanticStore();
    store.setPage("Test");
    let fired = false;
    store.register({
      id: "act-1",
      role: "Action",
      title: "Book",
      fields: [
        {
          key: "book",
          label: "Book Now",
          type: "action",
          value: null,
          constraints: { enabled: true, requires: ["date", "size"] },
          execute: () => { fired = true; },
        },
      ],
    });

    const result = store.execute("book");
    expect(result.ok).toBe(true);
    expect(fired).toBe(true);
  });

  it("SemanticSlider registers with min/max/step constraints", () => {
    const store = new SemanticStore();
    store.setPage("Test");
    store.register({
      id: "slider-1",
      role: "Field",
      title: "Volume",
      fields: [
        {
          key: "volume",
          label: "Volume",
          type: "slider",
          value: 50,
          constraints: { min: 0, max: 100, step: 5 },
          set: () => {},
        },
      ],
    });

    const c = store.getSnapshot().nodes[0].fields[0].constraints as any;
    expect(c.min).toBe(0);
    expect(c.max).toBe(100);
    expect(c.step).toBe(5);
  });

  it("SemanticTextarea registers with maxLength constraint", () => {
    const store = new SemanticStore();
    store.setPage("Test");
    store.register({
      id: "ta-1",
      role: "Field",
      title: "Notes",
      fields: [
        {
          key: "notes",
          label: "Notes",
          type: "textarea",
          value: "",
          constraints: { maxLength: 500 },
          set: () => {},
        },
      ],
    });

    const c = store.getSnapshot().nodes[0].fields[0].constraints as any;
    expect(c.maxLength).toBe(500);
  });

  it("SemanticRadioGroup registers with options constraint", () => {
    const store = new SemanticStore();
    store.setPage("Test");
    store.register({
      id: "radio-1",
      role: "Field",
      title: "Size",
      fields: [
        {
          key: "size",
          label: "Size",
          type: "radio",
          value: "M",
          constraints: { options: ["S", "M", "L"] },
          set: () => {},
        },
      ],
    });

    const field = store.getSnapshot().nodes[0].fields[0];
    expect(field.type).toBe("radio");
    expect((field.constraints as any).options).toEqual(["S", "M", "L"]);
  });

  it("SemanticMultiSelect set() wraps single value as array", () => {
    const store = new SemanticStore();
    store.setPage("Test");
    let result: any;
    store.register({
      id: "ms-1",
      role: "Field",
      title: "Toppings",
      fields: [
        {
          key: "toppings",
          label: "Toppings",
          type: "multi-select",
          value: ["pepperoni"],
          constraints: { options: ["pepperoni", "mushrooms", "olives"] },
          set: (v) => {
            // Simulates the Svelte component's set logic
            if (typeof v === "string") {
              try {
                const parsed = JSON.parse(v);
                if (Array.isArray(parsed)) { result = parsed; return; }
              } catch { /* not JSON */ }
              result = [v];
              return;
            }
            if (Array.isArray(v)) { result = v; }
            else { result = [v]; }
          },
        },
      ],
    });

    // Single string value → wrapped as array
    store.execute('set toppings mushrooms');
    expect(result).toEqual(["mushrooms"]);

    // JSON array string → parsed as array
    store.execute('set toppings ["pepperoni","olives"]');
    expect(result).toEqual(["pepperoni", "olives"]);
  });

  it("SemanticDatePicker registers with date constraints", () => {
    const store = new SemanticStore();
    store.setPage("Test");
    store.register({
      id: "dp-1",
      role: "Field",
      title: "Check-in",
      fields: [
        {
          key: "checkin",
          label: "Check-in",
          type: "date",
          value: "2025-06-15",
          constraints: { min: "2025-01-01", max: "2025-12-31" },
          set: () => {},
        },
      ],
    });

    const c = store.getSnapshot().nodes[0].fields[0].constraints as any;
    expect(c.min).toBe("2025-01-01");
    expect(c.max).toBe("2025-12-31");
  });

  it("SemanticInfo registers with empty fields and meta", () => {
    const store = new SemanticStore();
    store.setPage("Test");
    store.register({
      id: "info-1",
      role: "restaurant",
      title: "Sushi Place",
      description: "Best sushi",
      meta: { cuisine: "Japanese", rating: 4.5 },
      fields: [],
    });

    const node = store.getSnapshot().nodes[0];
    expect(node.role).toBe("restaurant");
    expect(node.fields).toHaveLength(0);
    expect(node.meta?.cuisine).toBe("Japanese");
  });

  it("SemanticList registers with item descriptions", () => {
    const store = new SemanticStore();
    store.setPage("Test");
    store.register({
      id: "list-1",
      role: "List",
      title: "Fruits",
      meta: {
        count: 3,
        items: ["Apple price=1.5", "Banana price=0.75", "Cherry price=3"],
      },
      fields: [],
    });

    const node = store.getSnapshot().nodes[0];
    expect(node.role).toBe("List");
    expect((node.meta as any).count).toBe(3);
    expect((node.meta as any).items).toHaveLength(3);
  });

  it("Full page with multiple nodes produces correct plaintext", () => {
    const store = new SemanticStore();
    store.setPage("Booking", "Book a table");

    store.register({
      id: "info",
      role: "restaurant",
      title: "Nori",
      meta: { cuisine: "Japanese" },
      fields: [],
      order: 0,
    });

    store.register({
      id: "select",
      role: "Field",
      title: "Size",
      fields: [
        {
          key: "size",
          label: "Size",
          type: "select",
          value: 2,
          constraints: { options: [1, 2, 3, 4] },
          set: () => {},
        },
      ],
      order: 1,
    });

    store.register({
      id: "action",
      role: "Action",
      title: "Submit",
      fields: [
        {
          key: "submit",
          label: "Submit",
          type: "action",
          value: null,
          execute: () => {},
        },
      ],
      order: 2,
    });

    const text = toPlainText(store.getSnapshot());
    expect(text).toContain("# Booking");
    expect(text).toContain("[restaurant: Nori]");
    expect(text).toContain("cuisine: Japanese");
    expect(text).toContain("[Select: size]");
    expect(text).toContain("current: 2");
    expect(text).toContain("[Action: submit]");
    expect(text).toContain("## Commands");
    expect(text).toContain("set size");
  });
});
