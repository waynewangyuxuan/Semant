import { defineComponent, h, type PropType } from "vue";
import { useSemantic } from "../context";

export const SemanticTextInput = defineComponent({
  name: "SemanticTextInput",
  props: {
    name: { type: String as PropType<string>, required: true },
    label: { type: String as PropType<string>, required: true },
    value: { type: String as PropType<string>, required: true },
    placeholder: { type: String as PropType<string>, default: undefined },
    type: {
      type: String as PropType<"text" | "email" | "tel" | "url" | "number">,
      default: "text",
    },
    description: { type: String as PropType<string>, default: undefined },
    class: { type: String as PropType<string>, default: undefined },
  },
  emits: {
    change: (_value: string) => true,
  },
  setup(props, { slots, emit }) {
    useSemantic({
      role: "Field",
      title: props.label,
      fields: [
        {
          key: props.name,
          label: props.label,
          type: props.type === "number" ? "number" : "text",
          value: props.value,
          description: props.description,
          set: (v) => emit("change", String(v)),
        },
      ],
    });

    return () => {
      if (slots.default) {
        return slots.default({
          value: props.value,
          onChange: (v: string) => emit("change", v),
          placeholder: props.placeholder,
        });
      }

      return h("div", { class: props.class }, [
        h("input", {
          type: props.type,
          value: props.value,
          placeholder: props.placeholder ?? props.label,
          onInput: (e: Event) =>
            emit("change", (e.target as HTMLInputElement).value),
        }),
      ]);
    };
  },
});

export type SemanticTextInputProps = InstanceType<
  typeof SemanticTextInput
>["$props"];
