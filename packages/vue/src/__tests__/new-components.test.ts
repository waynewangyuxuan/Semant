import { describe, it, expect } from "vitest";
import { defineComponent, h, nextTick, ref } from "vue";
import { mount } from "@vue/test-utils";
import { SemanticProvider } from "../components/SemanticProvider";
import { SemanticSlider } from "../components/SemanticSlider";
import { SemanticTextarea } from "../components/SemanticTextarea";
import { SemanticRadioGroup } from "../components/SemanticRadioGroup";
import { SemanticMultiSelect } from "../components/SemanticMultiSelect";
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

// ── SemanticSlider ──

describe("SemanticSlider", () => {
  it("renders a range <input>", () => {
    const wrapper = mountInProvider(() =>
      h(SemanticSlider, {
        name: "volume",
        label: "Volume",
        value: 50,
        min: 0,
        max: 100,
        onChange: () => {},
      })
    );

    const input = wrapper.find("input[type='range']");
    expect(input.exists()).toBe(true);
    expect(input.attributes("min")).toBe("0");
    expect(input.attributes("max")).toBe("100");
  });

  it("registers as slider type in store", async () => {
    let storeRef: ReturnType<typeof useSemanticStore> | undefined;

    const StoreReader = defineComponent({
      setup() {
        storeRef = useSemanticStore();
        return () => null;
      },
    });

    mountInProvider(() => [
      h(SemanticSlider, {
        name: "brightness",
        label: "Brightness",
        value: 75,
        min: 0,
        max: 100,
        step: 5,
        onChange: () => {},
      }),
      h(StoreReader),
    ]);

    await nextTick();
    const field = storeRef!
      .getSnapshot()
      .nodes.flatMap((n) => n.fields)
      .find((f) => f.key === "brightness");
    expect(field).toBeDefined();
    expect(field!.type).toBe("slider");
    expect((field!.constraints as any).min).toBe(0);
    expect((field!.constraints as any).max).toBe(100);
    expect((field!.constraints as any).step).toBe(5);
  });
});

// ── SemanticTextarea ──

describe("SemanticTextarea", () => {
  it("renders a <textarea>", () => {
    const wrapper = mountInProvider(() =>
      h(SemanticTextarea, {
        name: "notes",
        label: "Notes",
        value: "",
        onChange: () => {},
      })
    );

    expect(wrapper.find("textarea").exists()).toBe(true);
  });

  it("emits change on input", async () => {
    const val = ref("");

    const wrapper = mountInProvider(() =>
      h(SemanticTextarea, {
        name: "notes",
        label: "Notes",
        value: val.value,
        onChange: (v: string) => { val.value = v; },
      })
    );

    await wrapper.find("textarea").setValue("hello world");
    expect(val.value).toBe("hello world");
  });

  it("registers as textarea type in store", async () => {
    let storeRef: ReturnType<typeof useSemanticStore> | undefined;

    const StoreReader = defineComponent({
      setup() {
        storeRef = useSemanticStore();
        return () => null;
      },
    });

    mountInProvider(() => [
      h(SemanticTextarea, {
        name: "bio",
        label: "Bio",
        value: "test",
        maxLength: 500,
        onChange: () => {},
      }),
      h(StoreReader),
    ]);

    await nextTick();
    const field = storeRef!
      .getSnapshot()
      .nodes.flatMap((n) => n.fields)
      .find((f) => f.key === "bio");
    expect(field).toBeDefined();
    expect(field!.type).toBe("textarea");
    expect((field!.constraints as any).maxLength).toBe(500);
  });
});

// ── SemanticRadioGroup ──

describe("SemanticRadioGroup", () => {
  const options = [
    { value: "s", label: "Small" },
    { value: "m", label: "Medium" },
    { value: "l", label: "Large" },
  ];

  it("renders radio inputs", () => {
    const wrapper = mountInProvider(() =>
      h(SemanticRadioGroup, {
        name: "size",
        label: "Size",
        options,
        value: "m",
        onChange: () => {},
      })
    );

    const radios = wrapper.findAll("input[type='radio']");
    expect(radios).toHaveLength(3);
  });

  it("checks the selected option", () => {
    const wrapper = mountInProvider(() =>
      h(SemanticRadioGroup, {
        name: "size",
        label: "Size",
        options,
        value: "m",
        onChange: () => {},
      })
    );

    const radios = wrapper.findAll("input[type='radio']");
    const checked = radios.find(
      (r) => (r.element as HTMLInputElement).checked
    );
    expect((checked!.element as HTMLInputElement).value).toBe("m");
  });

  it("registers as radio type in store", async () => {
    let storeRef: ReturnType<typeof useSemanticStore> | undefined;

    const StoreReader = defineComponent({
      setup() {
        storeRef = useSemanticStore();
        return () => null;
      },
    });

    mountInProvider(() => [
      h(SemanticRadioGroup, {
        name: "size",
        label: "Size",
        options,
        value: "s",
        onChange: () => {},
      }),
      h(StoreReader),
    ]);

    await nextTick();
    const field = storeRef!
      .getSnapshot()
      .nodes.flatMap((n) => n.fields)
      .find((f) => f.key === "size");
    expect(field).toBeDefined();
    expect(field!.type).toBe("radio");
    expect((field!.constraints as any).options).toEqual(["s", "m", "l"]);
  });
});

// ── SemanticMultiSelect ──

describe("SemanticMultiSelect", () => {
  const options = [
    { value: "pepperoni", label: "Pepperoni" },
    { value: "mushrooms", label: "Mushrooms" },
    { value: "olives", label: "Olives" },
  ];

  it("renders checkboxes for each option", () => {
    const wrapper = mountInProvider(() =>
      h(SemanticMultiSelect, {
        name: "toppings",
        label: "Toppings",
        options,
        value: ["pepperoni"],
        onChange: () => {},
      })
    );

    const checkboxes = wrapper.findAll("input[type='checkbox']");
    expect(checkboxes).toHaveLength(3);
  });

  it("checks selected options", () => {
    const wrapper = mountInProvider(() =>
      h(SemanticMultiSelect, {
        name: "toppings",
        label: "Toppings",
        options,
        value: ["pepperoni", "olives"],
        onChange: () => {},
      })
    );

    const checked = wrapper
      .findAll("input[type='checkbox']")
      .filter((c) => (c.element as HTMLInputElement).checked);
    expect(checked).toHaveLength(2);
  });

  it("toggles selection on change", async () => {
    const selected = ref<Array<string | number>>(["pepperoni"]);

    const wrapper = mountInProvider(() =>
      h(SemanticMultiSelect, {
        name: "toppings",
        label: "Toppings",
        options,
        value: selected.value,
        onChange: (v: Array<string | number>) => { selected.value = v; },
      })
    );

    // click "mushrooms"
    const checkboxes = wrapper.findAll("input[type='checkbox']");
    await checkboxes[1].trigger("change");
    expect(selected.value).toContain("mushrooms");
    expect(selected.value).toContain("pepperoni");
  });

  it("registers as multi-select type in store", async () => {
    let storeRef: ReturnType<typeof useSemanticStore> | undefined;

    const StoreReader = defineComponent({
      setup() {
        storeRef = useSemanticStore();
        return () => null;
      },
    });

    mountInProvider(() => [
      h(SemanticMultiSelect, {
        name: "toppings",
        label: "Toppings",
        options,
        value: ["pepperoni"],
        onChange: () => {},
      }),
      h(StoreReader),
    ]);

    await nextTick();
    const field = storeRef!
      .getSnapshot()
      .nodes.flatMap((n) => n.fields)
      .find((f) => f.key === "toppings");
    expect(field).toBeDefined();
    expect(field!.type).toBe("multi-select");
    expect(field!.value).toEqual(["pepperoni"]);
  });
});
