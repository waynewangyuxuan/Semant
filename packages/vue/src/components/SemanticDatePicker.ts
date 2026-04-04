import { defineComponent, h, type PropType } from "vue";
import { useSemantic } from "../context";

export const SemanticDatePicker = defineComponent({
  name: "SemanticDatePicker",
  props: {
    name: { type: String as PropType<string>, required: true },
    label: { type: String as PropType<string>, required: true },
    value: {
      type: String as PropType<string | null>,
      default: null,
    },
    min: { type: String as PropType<string>, default: undefined },
    max: { type: String as PropType<string>, default: undefined },
    description: { type: String as PropType<string>, default: undefined },
    class: { type: String as PropType<string>, default: undefined },
  },
  emits: {
    change: (_date: string) => true,
  },
  setup(props, { slots, emit }) {
    useSemantic({
      role: "Field",
      title: props.label,
      fields: [
        {
          key: props.name,
          label: props.label,
          type: "date",
          value: props.value,
          constraints: { min: props.min, max: props.max },
          description:
            props.description ??
            `Date range: ${props.min ?? "any"} to ${props.max ?? "any"}`,
          set: (v) => emit("change", String(v)),
        },
      ],
    });

    return () => {
      if (slots.default) {
        return slots.default({
          value: props.value,
          select: (d: string) => emit("change", d),
          min: props.min,
          max: props.max,
        });
      }

      return h("div", { class: props.class }, [
        h("input", {
          type: "date",
          value: props.value ?? "",
          min: props.min,
          max: props.max,
          onChange: (e: Event) =>
            emit("change", (e.target as HTMLInputElement).value),
        }),
      ]);
    };
  },
});

export type SemanticDatePickerProps = InstanceType<typeof SemanticDatePicker>["$props"];
