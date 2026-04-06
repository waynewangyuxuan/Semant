<script lang="ts">
  import type { Snippet } from "svelte";
  import { useSemantic } from "../context.svelte.js";

  interface Props {
    role: string;
    title?: string;
    description?: string;
    meta?: Record<string, unknown>;
    order?: number;
    class?: string;
    children?: Snippet;
  }

  let { role, title, description, meta, order, class: className, children }: Props = $props();

  useSemantic(() => ({
    role,
    title,
    description,
    meta,
    fields: [],
    order,
  }));
</script>

<div class={className}>
  {#if children}
    {@render children()}
  {/if}
</div>
