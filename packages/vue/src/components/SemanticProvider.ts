import { defineComponent, h, watchEffect, type PropType } from "vue";
import { provideSemanticStore } from "../context";

export const SemanticProvider = defineComponent({
  name: "SemanticProvider",
  props: {
    title: {
      type: String as PropType<string>,
      required: true,
    },
    description: {
      type: String as PropType<string>,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    const store = provideSemanticStore(props.title, props.description);

    // Keep page metadata in sync when props change
    watchEffect(() => {
      store.setPage(props.title, props.description);
    });

    return () => slots.default?.();
  },
});

export type SemanticProviderProps = InstanceType<
  typeof SemanticProvider
>["$props"];
