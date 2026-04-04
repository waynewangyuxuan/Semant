import { defineComponent, h, type PropType } from "vue";
import { useSemantic } from "../context";

export const SemanticInfo = defineComponent({
  name: "SemanticInfo",
  props: {
    role: { type: String as PropType<string>, required: true },
    title: { type: String as PropType<string>, default: undefined },
    description: { type: String as PropType<string>, default: undefined },
    meta: {
      type: Object as PropType<Record<string, unknown>>,
      default: undefined,
    },
    order: { type: Number as PropType<number>, default: undefined },
    class: { type: String as PropType<string>, default: undefined },
  },
  setup(props, { slots }) {
    useSemantic({
      role: props.role,
      title: props.title,
      description: props.description,
      meta: props.meta,
      fields: [],
      order: props.order,
    });

    return () => h("div", { class: props.class }, slots.default?.());
  },
});

export type SemanticInfoProps = InstanceType<typeof SemanticInfo>["$props"];
