import { describe, it, expect } from "vitest";
import { defineComponent, h, nextTick, ref } from "vue";
import { mount } from "@vue/test-utils";
import { SemanticProvider } from "../components/SemanticProvider";
import { SemanticSelect } from "../components/SemanticSelect";
import { SemanticTextInput } from "../components/SemanticTextInput";
import { SemanticAction } from "../components/SemanticAction";
import { SemanticCheckbox } from "../components/SemanticCheckbox";
import { SemanticBridge } from "../components/SemanticBridge";
import { useSemanticStore } from "../context";

function mountInProvider(children: () => ReturnType<typeof h>) {
  const Wrapper = defineComponent({
    setup() {
      return () =>
        h(SemanticProvider, { title: "Test Page" }, {
          default: children,
        });
    },
  });
  return mount(Wrapper);
}

// ── SemanticSelect ──

describe("SemanticSelect", () => {
  it("renders a <select> with options", () => {
    const wrapper = mountInProvider(() =>
      h(SemanticSelect, {
        name: "color",
        label: "Color",
        options: [
          { value: "red", label: "Red" },
          { value: "blue", label: "Blue" },
        ],
        value: "red",
        onChange: () => {},
      })
    );

    const select = wrapper.find("select");
    expect(select.exists()).toBe(true);
    // placeholder option + 2 real options
    const options = wrapper.findAll("option");
    expect(options).toHaveLength(3);
  });

  it("emits change on selection", async () => {
    const selected = ref<string | number>("red");

    const wrapper = mountInProvider(() =>
      h(SemanticSelect, {
        name: "color",
        label: "Color",
        options: [
          { value: "red", label: "Red" },
          { value: "blue", label: "Blue" },
        ],
        value: selected.value,
        onChange: (v: string | number) => {
          selected.value = v;
        },
      })
    );

    await wrapper.find("select").setValue("blue");
    expect(selected.value).toBe("blue");
  });

  it("registers in the store", async () => {
    let storeRef: ReturnType<typeof useSemanticStore> | undefined;

    const StoreReader = defineComponent({
      setup() {
        storeRef = useSemanticStore();
        return () => null;
      },
    });

    mountInProvider(() => [
      h(SemanticSelect, {
        name: "size",
        label: "Size",
        options: [
          { value: "S", label: "Small" },
          { value: "M", label: "Medium" },
        ],
        value: "S",
        onChange: () => {},
      }),
      h(StoreReader),
    ]);

    await nextTick();
    const snap = storeRef!.getSnapshot();
    expect(snap.nodes.length).toBeGreaterThanOrEqual(1);
    const field = snap.nodes.flatMap((n) => n.fields).find((f) => f.key === "size");
    expect(field).toBeDefined();
    expect(field!.type).toBe("select");
  });
});

// ── SemanticTextInput ──

describe("SemanticTextInput", () => {
  it("renders an <input>", () => {
    const wrapper = mountInProvider(() =>
      h(SemanticTextInput, {
        name: "email",
        label: "Email",
        value: "",
        type: "email",
        onChange: () => {},
      })
    );

    const input = wrapper.find("input");
    expect(input.exists()).toBe(true);
    expect(input.attributes("type")).toBe("email");
  });

  it("emits change on input", async () => {
    const val = ref("");

    const wrapper = mountInProvider(() =>
      h(SemanticTextInput, {
        name: "name",
        label: "Name",
        value: val.value,
        onChange: (v: string) => {
          val.value = v;
        },
      })
    );

    await wrapper.find("input").setValue("Alice");
    expect(val.value).toBe("Alice");
  });
});

// ── SemanticAction ──

describe("SemanticAction", () => {
  it("renders a <button>", () => {
    const wrapper = mountInProvider(() =>
      h(SemanticAction, {
        name: "submit",
        label: "Submit",
        onExecute: () => {},
      })
    );

    const btn = wrapper.find("button");
    expect(btn.exists()).toBe(true);
    expect(btn.text()).toBe("Submit");
  });

  it("disables button when enabled=false", () => {
    const wrapper = mountInProvider(() =>
      h(SemanticAction, {
        name: "submit",
        label: "Submit",
        onExecute: () => {},
        enabled: false,
      })
    );

    expect(wrapper.find("button").attributes("disabled")).toBeDefined();
  });

  it("fires onExecute on click", async () => {
    let fired = false;

    const wrapper = mountInProvider(() =>
      h(SemanticAction, {
        name: "submit",
        label: "Submit",
        onExecute: () => {
          fired = true;
        },
      })
    );

    await wrapper.find("button").trigger("click");
    expect(fired).toBe(true);
  });

  it("registers as action in store", async () => {
    let storeRef: ReturnType<typeof useSemanticStore> | undefined;

    const StoreReader = defineComponent({
      setup() {
        storeRef = useSemanticStore();
        return () => null;
      },
    });

    mountInProvider(() => [
      h(SemanticAction, {
        name: "book",
        label: "Book Now",
        onExecute: () => {},
        requires: ["date", "size"],
      }),
      h(StoreReader),
    ]);

    await nextTick();
    const field = storeRef!
      .getSnapshot()
      .nodes.flatMap((n) => n.fields)
      .find((f) => f.key === "book");
    expect(field).toBeDefined();
    expect(field!.type).toBe("action");
    expect((field!.constraints as any).requires).toEqual(["date", "size"]);
  });
});

// ── SemanticCheckbox ──

describe("SemanticCheckbox", () => {
  it("renders a checkbox <input>", () => {
    const wrapper = mountInProvider(() =>
      h(SemanticCheckbox, {
        name: "outdoor",
        label: "Outdoor seating",
        checked: false,
        onChange: () => {},
      })
    );

    const input = wrapper.find("input[type='checkbox']");
    expect(input.exists()).toBe(true);
  });

  it("toggles on change", async () => {
    const checked = ref(false);

    const wrapper = mountInProvider(() =>
      h(SemanticCheckbox, {
        name: "outdoor",
        label: "Outdoor seating",
        checked: checked.value,
        onChange: (v: boolean) => {
          checked.value = v;
        },
      })
    );

    await wrapper.find("input").trigger("change");
    expect(checked.value).toBe(true);
  });

  it("registers as checkbox type in store", async () => {
    let storeRef: ReturnType<typeof useSemanticStore> | undefined;

    const StoreReader = defineComponent({
      setup() {
        storeRef = useSemanticStore();
        return () => null;
      },
    });

    mountInProvider(() => [
      h(SemanticCheckbox, {
        name: "vip",
        label: "VIP",
        checked: true,
        onChange: () => {},
      }),
      h(StoreReader),
    ]);

    await nextTick();
    const field = storeRef!
      .getSnapshot()
      .nodes.flatMap((n) => n.fields)
      .find((f) => f.key === "vip");
    expect(field).toBeDefined();
    expect(field!.type).toBe("checkbox");
    expect(field!.value).toBe(true);
  });
});

// ── SemanticBridge ──

describe("SemanticBridge", () => {
  it("renders a hidden div with plaintext state", async () => {
    const wrapper = mountInProvider(() => [
      h(SemanticSelect, {
        name: "size",
        label: "Party Size",
        options: [{ value: 1, label: "1" }, { value: 2, label: "2" }],
        value: 2,
        onChange: () => {},
      }),
      h(SemanticBridge),
    ]);

    await nextTick();
    await nextTick();

    const bridge = wrapper.find("#__semant");
    expect(bridge.exists()).toBe(true);
    expect(bridge.attributes("aria-hidden")).toBe("true");
    expect(bridge.attributes("data-semant-version")).toBe("0.1.0");
  });

  it("exposes window.__semant API", async () => {
    mountInProvider(() => [
      h(SemanticSelect, {
        name: "size",
        label: "Party Size",
        options: [{ value: 1, label: "1" }, { value: 2, label: "2" }],
        value: 2,
        onChange: () => {},
      }),
      h(SemanticBridge),
    ]);

    await nextTick();
    await nextTick();

    const api = (window as any).__semant;
    expect(api).toBeDefined();
    expect(api.version).toBe("0.1.0");
    expect(typeof api.getState).toBe("function");
    expect(typeof api.getStructured).toBe("function");
    expect(typeof api.fields).toBe("function");
    expect(typeof api.execute).toBe("function");
  });
});
