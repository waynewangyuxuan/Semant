import { defineComponent, h, type PropType } from "vue";
import { useSemantic } from "../context";

export const SemanticAction = defineComponent({
  name: "SemanticAction",
  props: {
    name: { type: String as PropType<string>, required: true },
    label: { type: String as PropType<string>, required: true },
    onExecute: {
      type: Function as PropType<() => void>,
      required: true,
    },
    enabled: { type: Boolean as PropType<boolean>, default: true },
    requires: {
      type: Array as PropType<string[]>,
      default: undefined,
    },
    description: { type: String as PropType<string>, default: undefined },
    class: { type: String as PropType<string>, default: undefined },
  },
  setup(props, { slots }) {
    useSemantic({
      role: "Action",
      title: props.label,
      fields: [
        {
          key: props.name,
          label: props.label,
          type: "action",
          value: null,
          constraints: { enabled: props.enabled, requires: props.requires },
          description:
            props.description ??
            (props.requires?.length
              ? `Requires: ${props.requires.join(", ")}`
              : undefined),
          execute: props.onExecute,
        },
      ],
    });

    return () => {
      // "render" slot for full custom rendering (matches React's render prop)
      if (slots.render) {
        return slots.render({
          execute: props.onExecute,
          enabled: props.enabled,
          label: props.label,
        });
      }

      return h(
        "button",
        {
          class: props.class,
          disabled: !props.enabled,
          onClick: props.onExecute,
        },
        slots.default?.() ?? props.label
      );
    };
  },
});

export type SemanticActionProps = InstanceType<
  typeof SemanticAction
>["$props"];
