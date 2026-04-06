<script lang="ts">
  import type { Snippet } from "svelte";
  import { useSemantic } from "../context.svelte.js";

  interface Props {
    name: string;
    label: string;
    items: unknown[];
    getLabel: (item: unknown) => string;
    getKey: (item: unknown) => string;
    getMeta?: (item: unknown) => Record<string, unknown>;
    description?: string;
    order?: number;
    class?: string;
    children?: Snippet<[{ items: unknown[] }]>;
  }

  let { name, label, items, getLabel, getKey, getMeta, description, order, class: className, children }: Props = $props();

  useSemantic(() => {
    const itemDescriptions = items.map((item) => {
      const meta = getMeta?.(item);
      const metaStr = meta
        ? " " + Object.entries(meta).map(([k, v]) => `${k}=${v}`).join(", ")
        : "";
      return `${getLabel(item)}${metaStr}`;
    });
    return {
      role: "List",
      title: label,
      description,
      meta: { count: items.length, items: itemDescriptions },
      fields: [],
      order,
    };
  });
</script>

{#if children}
  <div class={className}>
    {@render children({ items })}
  </div>
{:else}
  <ul class={className}>
    {#each items as item (getKey(item))}
      <li>{getLabel(item)}</li>
    {/each}
  </ul>
{/if}
