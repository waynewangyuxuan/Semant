import { defineComponent, h, type PropType } from "vue";
import { useSemantic } from "../context";

export const SemanticCheckbox = defineComponent({
  name: "SemanticCheckbox",
  props: {
    name: { type: String as PropType<string>, required: true },
    label: { type: String as PropType<string>, required: true },
    checked: { type: Boolean as PropType<boolean>, required: true },
    description: { type: String as PropType<string>, default: undefined },
    class: { type: String as PropType<string>, default: undefined },
  },
  emits: {
    change: (_checked: boolean) => true,
  },
  setup(props, { slots, emit }) {
    useSemantic({
      role: "Field",
      title: props.label,
      fields: [
        {
          key: props.name,
          label: props.label,
          type: "checkbox",
          value: props.checked,
          description: props.description,
          set: (v) => emit("change", Boolean(v)),
        },
      ],
    });

    return () => {
      if (slots.default) {
        return slots.default({
          checked: props.checked,
          toggle: () => emit("change", !props.checked),
        });
      }

      return h("div", { class: props.class }, [
        h("label", [
          h("input", {
            type: "checkbox",
            checked: props.checked,
            onChange: () => emit("change", !props.checked),
          }),
          ` ${props.label}`,
        ]),
      ]);
    };
  },
});

export type SemanticCheckboxProps = InstanceType<
  typeof SemanticCheckbox
>["$props"];
