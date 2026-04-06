<script lang="ts">
  import { toPlainText } from "@semant/core";
  import { useSemanticStore } from "../context.svelte.js";

  interface Props {
    nodeId?: string;
    globalName?: string;
  }

  let { nodeId = "__semant", globalName = "__semant" }: Props = $props();

  const store = useSemanticStore();

  const text = $derived(toPlainText(store.getSnapshot()));

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
            resolve({ ...result, state: toPlainText(store.getSnapshot()) });
          }, 100);
          const unsub = store.subscribe(() => {
            clearTimeout(timeout);
            unsub();
            resolve({ ...result, state: toPlainText(store.getSnapshot()) });
          });
        });
      },
    };
  }

  $effect(() => {
    if (typeof window === "undefined") return;
    (window as any)[globalName] = createApi();
    return () => {
      delete (window as any)[globalName];
    };
  });
</script>

<div
  id={nodeId}
  aria-hidden="true"
  style="display: none;"
  data-semant-version="0.1.0"
>{text}</div>
