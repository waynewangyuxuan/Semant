import { defineComponent, h, type PropType } from "vue";
import { useSemantic } from "../context";

export const SemanticMultiSelect = defineComponent({
  name: "SemanticMultiSelect",
  props: {
    name: { type: String as PropType<string>, required: true },
    label: { type: String as PropType<string>, required: true },
    options: {
      type: Array as PropType<Array<{ value: string | number; label: string }>>,
      required: true,
    },
    value: {
      type: Array as PropType<Array<string | number>>,
      required: true,
    },
    description: { type: String as PropType<string>, default: undefined },
    class: { type: String as PropType<string>, default: undefined },
  },
  emits: {
    change: (_value: Array<string | number>) => true,
  },
  setup(props, { slots, emit }) {
    const toggle = (v: string | number) => {
      if (props.value.includes(v)) {
        emit("change", props.value.filter((x) => x !== v));
      } else {
        emit("change", [...props.value, v]);
      }
    };

    useSemantic(() => ({
      role: "Field",
      title: props.label,
      fields: [
        {
          key: props.name,
          label: props.label,
          type: "multi-select",
          value: props.value,
          constraints: { options: props.options.map((o) => o.value) },
          description: props.description,
          set: (v) => {
            // Try JSON array string first (e.g. '["a","b"]')
            if (typeof v === "string") {
              try {
                const parsed = JSON.parse(v);
                if (Array.isArray(parsed)) {
                  emit("change", parsed);
                  return;
                }
              } catch {
                // not JSON — wrap single value as array
              }
              emit("change", [v]);
              return;
            }
            if (Array.isArray(v)) {
              emit("change", v as Array<string | number>);
            } else {
              // Single non-string value — wrap as array (set semantics, not toggle)
              emit("change", [v as string | number]);
            }
          },
        },
      ],
    }));

    return () => {
      if (slots.default) {
        return slots.default({
          options: props.options,
          selected: props.value,
          toggle,
        });
      }

      return h("fieldset", { class: props.class }, [
        h("legend", props.label),
        ...props.options.map((opt) =>
          h("label", { key: opt.value }, [
            h("input", {
              type: "checkbox",
              checked: props.value.includes(opt.value),
              onChange: () => toggle(opt.value),
            }),
            ` ${opt.label}`,
          ])
        ),
      ]);
    };
  },
});

export type SemanticMultiSelectProps = InstanceType<typeof SemanticMultiSelect>["$props"];
