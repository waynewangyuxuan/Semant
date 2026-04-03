import { defineComponent, h, type PropType } from "vue";
import { useSemantic } from "../context";

export const SemanticSelect = defineComponent({
  name: "SemanticSelect",
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
    useSemantic({
      role: "Field",
      title: props.label,
      fields: [
        {
          key: props.name,
          label: props.label,
          type: "select",
          value: props.value,
          constraints: { options: props.options.map((o) => o.value) },
          description: props.description,
          set: (v) => emit("change", v as string | number),
        },
      ],
    });

    return () => {
      if (slots.default) {
        return slots.default({
          options: props.options,
          selected: props.value,
          select: (v: string | number) => emit("change", v),
        });
      }

      return h("div", { class: props.class }, [
        h(
          "select",
          {
            value: props.value ?? "",
            onChange: (e: Event) => {
              const raw = (e.target as HTMLSelectElement).value;
              const num = Number(raw);
              emit("change", Number.isNaN(num) ? raw : num);
            },
          },
          [
            h("option", { value: "", disabled: true }, props.label),
            ...props.options.map((opt) =>
              h("option", { key: opt.value, value: opt.value }, opt.label)
            ),
          ]
        ),
      ]);
    };
  },
});

export type SemanticSelectProps = InstanceType<
  typeof SemanticSelect
>["$props"];
