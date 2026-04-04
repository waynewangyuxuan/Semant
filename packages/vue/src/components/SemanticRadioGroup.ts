import { defineComponent, h, type PropType } from "vue";
import { useSemantic } from "../context";

export const SemanticRadioGroup = defineComponent({
  name: "SemanticRadioGroup",
  props: {
    name: { type: String as PropType<string>, required: true },
    label: { type: String as PropType<string>, required: true },
    options: {
      type: Array as PropType<Array<{ value: string | number; label: string }>>,
      required: true,
    },
    value: {
      type: [String, Number] as PropType<string | number | null>,
      default: null,
    },
    description: { type: String as PropType<string>, default: undefined },
    class: { type: String as PropType<string>, default: undefined },
  },
  emits: {
    change: (_value: string | number) => true,
  },
  setup(props, { slots, emit }) {
    useSemantic(() => ({
      role: "Field",
      title: props.label,
      fields: [
        {
          key: props.name,
          label: props.label,
          type: "radio",
          value: props.value,
          constraints: { options: props.options.map((o) => o.value) },
          description: props.description,
          set: (v) => emit("change", v as string | number),
        },
      ],
    }));

    return () => {
      if (slots.default) {
        return slots.default({
          options: props.options,
          selected: props.value,
          select: (v: string | number) => emit("change", v),
        });
      }

      return h("fieldset", { class: props.class }, [
        h("legend", props.label),
        ...props.options.map((opt) =>
          h("label", { key: opt.value }, [
            h("input", {
              type: "radio",
              name: props.name,
              value: opt.value,
              checked: props.value === opt.value,
              onChange: () => emit("change", opt.value),
            }),
            ` ${opt.label}`,
          ])
        ),
      ]);
    };
  },
});

export type SemanticRadioGroupProps = InstanceType<typeof SemanticRadioGroup>["$props"];
