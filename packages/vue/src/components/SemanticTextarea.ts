import { defineComponent, h, type PropType } from "vue";
import { useSemantic } from "../context";

export const SemanticTextarea = defineComponent({
  name: "SemanticTextarea",
  props: {
    name: { type: String as PropType<string>, required: true },
    label: { type: String as PropType<string>, required: true },
    value: { type: String as PropType<string>, required: true },
    placeholder: { type: String as PropType<string>, default: undefined },
    rows: { type: Number as PropType<number>, default: undefined },
    maxLength: { type: Number as PropType<number>, default: undefined },
    description: { type: String as PropType<string>, default: undefined },
    class: { type: String as PropType<string>, default: undefined },
  },
  emits: {
    change: (_value: string) => true,
  },
  setup(props, { slots, emit }) {
    const constraints: Record<string, unknown> = {};
    if (props.maxLength !== undefined) constraints.maxLength = props.maxLength;

    useSemantic({
      role: "Field",
      title: props.label,
      fields: [
        {
          key: props.name,
          label: props.label,
          type: "textarea",
          value: props.value,
          constraints: Object.keys(constraints).length > 0 ? constraints : undefined,
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
        h("textarea", {
          value: props.value,
          placeholder: props.placeholder ?? props.label,
          rows: props.rows,
          maxlength: props.maxLength,
          onInput: (e: Event) =>
            emit("change", (e.target as HTMLTextAreaElement).value),
        }),
      ]);
    };
  },
});

export type SemanticTextareaProps = InstanceType<typeof SemanticTextarea>["$props"];
