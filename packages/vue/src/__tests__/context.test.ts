import { describe, it, expect, vi } from "vitest";
import { defineComponent, h, nextTick, ref } from "vue";
import { mount } from "@vue/test-utils";
import { SemanticStore } from "@semant/core";
import {
  useSemantic,
  useSemanticPage,
  useSemanticStore,
  SEMANT_KEY,
} from "../context";
import { SemanticProvider } from "../components/SemanticProvider";

// ── Helper: wrap a composable inside a SemanticProvider ──

function mountWithProvider(
  child: ReturnType<typeof defineComponent>,
  providerProps = { title: "Test Page" }
) {
  const Wrapper = defineComponent({
    setup() {
      return () =>
        h(SemanticProvider, providerProps, {
          default: () => h(child),
        });
    },
  });
  return mount(Wrapper);
}

// ── useSemantic ──

describe("useSemantic", () => {
  it("registers a node in the store after mount", async () => {
    let store: SemanticStore | undefined;

    const Child = defineComponent({
      setup() {
        const result = useSemantic({
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
        store = result.store;
        return () => h("div");
      },
    });

    mountWithProvider(Child);
    await nextTick(); // flush: 'post' needs a tick

    const snap = store!.getSnapshot();
    expect(snap.nodes).toHaveLength(1);
    expect(snap.nodes[0].role).toBe("Field");
    expect(snap.nodes[0].fields[0].key).toBe("party_size");
  });

  it("unregisters node on unmount", async () => {
    let store: SemanticStore | undefined;

    const Child = defineComponent({
      setup() {
        const result = useSemantic({
          role: "Field",
          title: "Name",
          fields: [
            {
              key: "name",
              label: "Name",
              type: "text",
              value: "",
              set: () => {},
            },
          ],
        });
        store = result.store;
        return () => h("div");
      },
    });

    const showChild = ref(true);
    const Wrapper = defineComponent({
      setup() {
        return () =>
          h(SemanticProvider, { title: "Test" }, {
            default: () => (showChild.value ? h(Child) : null),
          });
      },
    });

    mount(Wrapper);
    await nextTick();
    expect(store!.getSnapshot().nodes).toHaveLength(1);

    showChild.value = false;
    await nextTick();
    expect(store!.getSnapshot().nodes).toHaveLength(0);
  });

  it("throws when used outside SemanticProvider", () => {
    const Child = defineComponent({
      setup() {
        useSemantic({
          role: "Field",
          title: "Test",
          fields: [],
        });
        return () => h("div");
      },
    });

    expect(() => mount(Child)).toThrow(
      "useSemantic must be used within a <SemanticProvider>"
    );
  });

  it("generates unique IDs for multiple nodes", async () => {
    let store: SemanticStore | undefined;

    const Child1 = defineComponent({
      setup() {
        const result = useSemantic({
          role: "Field",
          title: "A",
          fields: [],
        });
        store = result.store;
        return () => h("div");
      },
    });

    const Child2 = defineComponent({
      setup() {
        useSemantic({
          role: "Field",
          title: "B",
          fields: [],
        });
        return () => h("div");
      },
    });

    const Wrapper = defineComponent({
      setup() {
        return () =>
          h(SemanticProvider, { title: "Test" }, {
            default: () => [h(Child1), h(Child2)],
          });
      },
    });

    mount(Wrapper);
    await nextTick();

    const snap = store!.getSnapshot();
    expect(snap.nodes).toHaveLength(2);
    expect(snap.nodes[0].id).not.toBe(snap.nodes[1].id);
  });
});

// ── useSemanticPage ──

describe("useSemanticPage", () => {
  it("returns reactive page state", async () => {
    let pageTitle = "";

    const Reader = defineComponent({
      setup() {
        const page = useSemanticPage();
        return () => {
          pageTitle = page.value.title;
          return h("div");
        };
      },
    });

    mountWithProvider(Reader, { title: "My Page" });
    await nextTick();

    expect(pageTitle).toBe("My Page");
  });

  it("updates when a node registers", async () => {
    let nodeCount = 0;
    const showField = ref(false);

    const Field = defineComponent({
      setup() {
        useSemantic({
          role: "Field",
          title: "Dynamic",
          fields: [
            {
              key: "dyn",
              label: "Dynamic",
              type: "text",
              value: "",
              set: () => {},
            },
          ],
        });
        return () => h("div");
      },
    });

    const Reader = defineComponent({
      setup() {
        const page = useSemanticPage();
        return () => {
          nodeCount = page.value.nodes.length;
          return h("div");
        };
      },
    });

    const Wrapper = defineComponent({
      setup() {
        return () =>
          h(SemanticProvider, { title: "Test" }, {
            default: () => [
              h(Reader),
              showField.value ? h(Field) : null,
            ],
          });
      },
    });

    mount(Wrapper);
    await nextTick();
    expect(nodeCount).toBe(0);

    showField.value = true;
    await nextTick();
    await nextTick(); // extra tick for flush: 'post'
    expect(nodeCount).toBe(1);
  });

  it("throws when used outside SemanticProvider", () => {
    const Child = defineComponent({
      setup() {
        useSemanticPage();
        return () => h("div");
      },
    });

    expect(() => mount(Child)).toThrow(
      "useSemanticPage must be used within a <SemanticProvider>"
    );
  });
});

// ── useSemanticStore ──

describe("useSemanticStore", () => {
  it("returns the store for command execution", async () => {
    let store: SemanticStore | undefined;
    const val = ref(2);

    const Field = defineComponent({
      setup() {
        useSemantic({
          role: "Field",
          title: "Size",
          fields: [
            {
              key: "size",
              label: "Size",
              type: "select",
              value: val.value,
              constraints: { options: [1, 2, 3] },
              set: (v) => {
                val.value = v as number;
              },
            },
          ],
        });
        return () => h("div");
      },
    });

    const Commander = defineComponent({
      setup() {
        store = useSemanticStore();
        return () => h("div");
      },
    });

    const Wrapper = defineComponent({
      setup() {
        return () =>
          h(SemanticProvider, { title: "Test" }, {
            default: () => [h(Field), h(Commander)],
          });
      },
    });

    mount(Wrapper);
    await nextTick();

    const result = store!.execute("set size 3");
    expect(result.ok).toBe(true);
    expect(val.value).toBe(3);
  });

  it("throws when used outside SemanticProvider", () => {
    const Child = defineComponent({
      setup() {
        useSemanticStore();
        return () => h("div");
      },
    });

    expect(() => mount(Child)).toThrow(
      "useSemanticStore must be used within a <SemanticProvider>"
    );
  });
});
