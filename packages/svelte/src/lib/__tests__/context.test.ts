/**
 * Test the core store integration used by Svelte composables.
 * Since Svelte runes ($effect, $state) require a Svelte component context,
 * we test the store-level behavior that the composables rely on.
 */
import { describe, it, expect } from "vitest";
import { SemanticStore } from "@semant/core";
import type { SemanticNode } from "@semant/core";

describe("SemanticStore (Svelte adapter foundation)", () => {
  it("registers and retrieves nodes", () => {
    const store = new SemanticStore();
    store.setPage("Test Page");

    const node: SemanticNode = {
      id: "n1",
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
    };

    store.register(node);
    const snap = store.getSnapshot();

    expect(snap.title).toBe("Test Page");
    expect(snap.nodes).toHaveLength(1);
    expect(snap.nodes[0].fields[0].key).toBe("party_size");
  });

  it("unregisters nodes", () => {
    const store = new SemanticStore();
    store.setPage("Test");
    store.register({ id: "n1", role: "Field", fields: [] });
    store.register({ id: "n2", role: "Field", fields: [] });

    expect(store.getSnapshot().nodes).toHaveLength(2);

    store.unregister("n1");
    expect(store.getSnapshot().nodes).toHaveLength(1);
    expect(store.getSnapshot().nodes[0].id).toBe("n2");
  });

  it("executes set commands", () => {
    const store = new SemanticStore();
    store.setPage("Test");
    let val = 2;
    store.register({
      id: "n1",
      role: "Field",
      fields: [
        {
          key: "size",
          label: "Size",
          type: "select",
          value: val,
          set: (v) => { val = v as number; },
        },
      ],
    });

    const result = store.execute("set size 4");
    expect(result.ok).toBe(true);
    expect(val).toBe(4);
  });

  it("executes action commands", () => {
    const store = new SemanticStore();
    store.setPage("Test");
    let fired = false;
    store.register({
      id: "n1",
      role: "Action",
      fields: [
        {
          key: "submit",
          label: "Submit",
          type: "action",
          value: null,
          execute: () => { fired = true; },
        },
      ],
    });

    const result = store.execute("submit");
    expect(result.ok).toBe(true);
    expect(fired).toBe(true);
  });

  it("notifies subscribers on register", () => {
    const store = new SemanticStore();
    store.setPage("Test");
    let notified = false;
    store.subscribe(() => { notified = true; });

    store.register({ id: "n1", role: "Field", fields: [] });
    expect(notified).toBe(true);
  });

  it("returns snapshot with correct page metadata", () => {
    const store = new SemanticStore();
    store.setPage("My App", "A test application");

    const snap = store.getSnapshot();
    expect(snap.title).toBe("My App");
    expect(snap.description).toBe("A test application");
    expect(snap.nodes).toHaveLength(0);
  });
});
