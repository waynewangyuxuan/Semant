import { defineComponent, h, type PropType } from "vue";
import { useSemantic } from "../context";

export const SemanticSlider = defineComponent({
  name: "SemanticSlider",
  props: {
    name: { type: String as PropType<string>, required: true },
    label: { type: String as PropType<string>, required: true },
    value: { type: Number as PropType<number>, required: true },
    min: { type: Number as PropType<number>, required: true },
    max: { type: Number as PropType<number>, required: true },
    step: { type: Number as PropType<number>, default: 1 },
    description: { type: String as PropType<string>, default: undefined },
    class: { type: String as PropType<string>, default: undefined },
  },
  emits: {
    change: (_value: number) => true,
  },
  setup(props, { slots, emit }) {
    useSemantic({
      role: "Field",
      title: props.label,
      fields: [
        {
          key: props.name,
          label: props.label,
          type: "slider",
          value: props.value,
          constraints: { min: props.min, max: props.max, step: props.step },
          description: props.description,
          set: (v) => emit("change", Number(v)),
        },
      ],
    });

    return () => {
      if (slots.default) {
        return slots.default({
          value: props.value,
          set: (v: number) => emit("change", v),
          min: props.min,
          max: props.max,
          step: props.step,
        });
      }

      return h("div", { class: props.class }, [
        h("label", [
          `${props.label}: ${props.value}`,
          h("input", {
            type: "range",
            min: props.min,
            max: props.max,
            step: props.step,
            value: props.value,
            onInput: (e: Event) =>
              emit("change", Number((e.target as HTMLInputElement).value)),
          }),
        ]),
      ]);
    };
  },
});

export type SemanticSliderProps = InstanceType<typeof SemanticSlider>["$props"];
