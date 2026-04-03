import { defineComponent, h, Teleport, type PropType } from "vue";
import { toJsonLdScript } from "@semant/core";
import { useSemanticPage } from "../context";

export const SemanticHead = defineComponent({
  name: "SemanticHead",
  props: {
    baseUrl: {
      type: String as PropType<string>,
      default: undefined,
    },
  },
  setup(props) {
    const page = useSemanticPage();

    return () => {
      const jsonLd = toJsonLdScript(page.value, { baseUrl: props.baseUrl });

      return h(Teleport, { to: "head" }, [
        h("meta", { name: "semant", content: "0.1.0" }),
        h("script", {
          type: "application/ld+json",
          innerHTML: jsonLd,
        }),
      ]);
    };
  },
});

export type SemanticHeadProps = InstanceType<typeof SemanticHead>["$props"];
