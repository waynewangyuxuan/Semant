import { describe, it, expect } from "vitest";
import { defineComponent, h, nextTick, ref } from "vue";
import { mount } from "@vue/test-utils";
import { SemanticProvider } from "../components/SemanticProvider";
import { SemanticDatePicker } from "../components/SemanticDatePicker";
import { SemanticInfo } from "../components/SemanticInfo";
import { SemanticList } from "../components/SemanticList";
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

// ── SemanticDatePicker ──

describe("SemanticDatePicker", () => {
  it("renders a date <input>", () => {
    const wrapper = mountInProvider(() =>
      h(SemanticDatePicker, {
        name: "check_in",
        label: "Check-in",
        value: "2025-06-15",
        onChange: () => {},
      })
    );

    const input = wrapper.find("input[type='date']");
    expect(input.exists()).toBe(true);
    expect((input.element as HTMLInputElement).value).toBe("2025-06-15");
  });

  it("applies min and max constraints", () => {
    const wrapper = mountInProvider(() =>
      h(SemanticDatePicker, {
        name: "check_in",
        label: "Check-in",
        value: "2025-06-15",
        min: "2025-01-01",
        max: "2025-12-31",
        onChange: () => {},
      })
    );

    const input = wrapper.find("input[type='date']");
    expect(input.attributes("min")).toBe("2025-01-01");
    expect(input.attributes("max")).toBe("2025-12-31");
  });

  it("emits change on input", async () => {
    const val = ref("2025-06-15");

    const wrapper = mountInProvider(() =>
      h(SemanticDatePicker, {
        name: "check_in",
        label: "Check-in",
        value: val.value,
        onChange: (d: string) => { val.value = d; },
      })
    );

    await wrapper.find("input").setValue("2025-07-01");
    expect(val.value).toBe("2025-07-01");
  });

  it("registers as date type in store", async () => {
    let storeRef: ReturnType<typeof useSemanticStore> | undefined;

    const StoreReader = defineComponent({
      setup() {
        storeRef = useSemanticStore();
        return () => null;
      },
    });

    mountInProvider(() => [
      h(SemanticDatePicker, {
        name: "departure",
        label: "Departure",
        value: "2025-08-01",
        min: "2025-01-01",
        onChange: () => {},
      }),
      h(StoreReader),
    ]);

    await nextTick();
    const field = storeRef!
      .getSnapshot()
      .nodes.flatMap((n) => n.fields)
      .find((f) => f.key === "departure");
    expect(field).toBeDefined();
    expect(field!.type).toBe("date");
    expect((field!.constraints as any).min).toBe("2025-01-01");
  });
});

// ── SemanticInfo ──

describe("SemanticInfo", () => {
  it("renders a wrapper div with slot content", () => {
    const wrapper = mountInProvider(() =>
      h(
        SemanticInfo,
        { role: "restaurant", title: "Test Cafe" },
        { default: () => h("span", "Hello") }
      )
    );

    expect(wrapper.find("div").exists()).toBe(true);
    expect(wrapper.find("span").text()).toBe("Hello");
  });

  it("registers with role and meta in store", async () => {
    let storeRef: ReturnType<typeof useSemanticStore> | undefined;

    const StoreReader = defineComponent({
      setup() {
        storeRef = useSemanticStore();
        return () => null;
      },
    });

    mountInProvider(() => [
      h(SemanticInfo, {
        role: "restaurant",
        title: "Sushi Place",
        description: "Best sushi in town",
        meta: { cuisine: "Japanese", rating: 4.5 },
      }),
      h(StoreReader),
    ]);

    await nextTick();
    const node = storeRef!
      .getSnapshot()
      .nodes.find((n) => n.role === "restaurant");
    expect(node).toBeDefined();
    expect(node!.title).toBe("Sushi Place");
    expect(node!.meta?.cuisine).toBe("Japanese");
    expect(node!.meta?.rating).toBe(4.5);
    expect(node!.fields).toHaveLength(0);
  });
});

// ── SemanticList ──

describe("SemanticList", () => {
  const items = [
    { id: "1", name: "Apple", price: 1.5 },
    { id: "2", name: "Banana", price: 0.75 },
    { id: "3", name: "Cherry", price: 3.0 },
  ];

  it("renders a <ul> with <li> items", () => {
    const wrapper = mountInProvider(() =>
      h(SemanticList, {
        name: "fruits",
        label: "Fruits",
        items,
        getLabel: (i: any) => i.name,
        getKey: (i: any) => i.id,
      })
    );

    const lis = wrapper.findAll("li");
    expect(lis).toHaveLength(3);
    expect(lis[0].text()).toBe("Apple");
    expect(lis[2].text()).toBe("Cherry");
  });

  it("registers as List role with item meta in store", async () => {
    let storeRef: ReturnType<typeof useSemanticStore> | undefined;

    const StoreReader = defineComponent({
      setup() {
        storeRef = useSemanticStore();
        return () => null;
      },
    });

    mountInProvider(() => [
      h(SemanticList, {
        name: "fruits",
        label: "Fruits",
        items,
        getLabel: (i: any) => i.name,
        getKey: (i: any) => i.id,
        getMeta: (i: any) => ({ price: i.price }),
      }),
      h(StoreReader),
    ]);

    await nextTick();
    const node = storeRef!
      .getSnapshot()
      .nodes.find((n) => n.role === "List");
    expect(node).toBeDefined();
    expect(node!.title).toBe("Fruits");
    expect((node!.meta as any).count).toBe(3);
    expect((node!.meta as any).items).toContain("Apple price=1.5");
    expect(node!.fields).toHaveLength(0);
  });

  it("uses slot when provided", () => {
    const wrapper = mountInProvider(() =>
      h(
        SemanticList,
        {
          name: "fruits",
          label: "Fruits",
          items,
          getLabel: (i: any) => i.name,
          getKey: (i: any) => i.id,
        },
        {
          default: (props: { items: typeof items }) =>
            h("ol", props.items.map((i) => h("li", { key: i.id }, i.name))),
        }
      )
    );

    expect(wrapper.find("ol").exists()).toBe(true);
    expect(wrapper.findAll("li")).toHaveLength(3);
  });
});
