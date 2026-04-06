<script lang="ts">
  import type { Snippet } from "svelte";
  import { provideSemanticStore } from "../context.svelte.js";

  interface Props {
    title: string;
    description?: string;
    children: Snippet;
  }

  let { title, description, children }: Props = $props();

  const store = provideSemanticStore(title, description);

  $effect(() => {
    store.setPage(title, description);
  });
</script>

{@render children()}
