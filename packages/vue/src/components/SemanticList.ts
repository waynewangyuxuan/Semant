import { defineComponent, h, type PropType } from "vue";
import { useSemantic } from "../context";

export const SemanticList = defineComponent({
  name: "SemanticList",
  props: {
    name: { type: String as PropType<string>, required: true },
    label: { type: String as PropType<string>, required: true },
    items: { type: Array as PropType<unknown[]>, required: true },
    getLabel: {
      type: Function as PropType<(item: unknown) => string>,
      required: true,
    },
    getKey: {
      type: Function as PropType<(item: unknown) => string>,
      required: true,
    },
    getMeta: {
      type: Function as PropType<(item: unknown) => Record<string, unknown>>,
      default: undefined,
    },
    description: { type: String as PropType<string>, default: undefined },
    order: { type: Number as PropType<number>, default: undefined },
    class: { type: String as PropType<string>, default: undefined },
  },
  setup(props, { slots }) {
    const itemDescriptions = () =>
      props.items.map((item) => {
        const meta = props.getMeta?.(item);
        const metaStr = meta
          ? " " +
            Object.entries(meta)
              .map(([k, v]) => `${k}=${v}`)
              .join(", ")
          : "";
        return `${props.getLabel(item)}${metaStr}`;
      });

    useSemantic({
      role: "List",
      title: props.label,
      description: props.description,
      meta: {
        count: props.items.length,
        items: itemDescriptions(),
      },
      fields: [],
      order: props.order,
    });

    return () => {
      if (slots.default) {
        return h("div", { class: props.class }, slots.default({ items: props.items }));
      }

      return h(
        "ul",
        { class: props.class },
        props.items.map((item) =>
          h("li", { key: props.getKey(item) }, props.getLabel(item))
        )
      );
    };
  },
});

export type SemanticListProps = InstanceType<typeof SemanticList>["$props"];
