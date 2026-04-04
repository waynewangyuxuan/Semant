import { defineComponent, h, watch, onMounted, onUnmounted, type PropType } from "vue";
import { toPlainText } from "@semant/core";
import { useSemanticPage, useSemanticStore } from "../context";

export const SemanticBridge = defineComponent({
  name: "SemanticBridge",
  props: {
    nodeId: {
      type: String as PropType<string>,
      default: "__semant",
    },
    globalName: {
      type: String as PropType<string>,
      default: "__semant",
    },
  },
  setup(props) {
    const page = useSemanticPage();
    const store = useSemanticStore();

    function createApi() {
      return {
        version: "0.1.0",
        getState: () => toPlainText(store.getSnapshot()),
        getStructured: () => store.getSnapshot(),
        fields: () => {
          const snap = store.getSnapshot();
          return snap.nodes.flatMap((n) => n.fields.map((f) => f.key));
        },
        execute: (
          command: string
        ): Promise<{ ok: boolean; message: string; state: string }> => {
          const result = store.execute(command);
          if (!result.ok) {
            return Promise.resolve({
              ...result,
              state: toPlainText(store.getSnapshot()),
            });
          }
          return new Promise((resolve) => {
            const timeout = setTimeout(() => {
              unsub();
              resolve({
                ...result,
                state: toPlainText(store.getSnapshot()),
              });
            }, 100);
            const unsub = store.subscribe(() => {
              clearTimeout(timeout);
              unsub();
              resolve({
                ...result,
                state: toPlainText(store.getSnapshot()),
              });
            });
          });
        },
      };
    }

    onMounted(() => {
      (window as any)[props.globalName] = createApi();
    });

    // Re-register under new key if globalName changes
    watch(
      () => props.globalName,
      (newName, oldName) => {
        if (oldName) delete (window as any)[oldName];
        (window as any)[newName] = createApi();
      }
    );

    onUnmounted(() => {
      delete (window as any)[props.globalName];
    });

    return () =>
      h(
        "div",
        {
          id: props.nodeId,
          "aria-hidden": "true",
          style: { display: "none" },
          "data-semant-version": "0.1.0",
        },
        toPlainText(page.value)
      );
  },
});

export type SemanticBridgeProps = InstanceType<
  typeof SemanticBridge
>["$props"];
