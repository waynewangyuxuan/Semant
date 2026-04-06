<script lang="ts">
  import type { Snippet } from "svelte";
  import { useSemantic } from "../context.svelte.js";

  interface Props {
    name: string;
    label: string;
    onExecute: () => void;
    enabled?: boolean;
    requires?: string[];
    description?: string;
    class?: string;
    children?: Snippet;
    render?: Snippet<[{ execute: () => void; enabled: boolean; label: string }]>;
  }

  let { name, label, onExecute, enabled = true, requires, description, class: className, children, render }: Props = $props();

  useSemantic(() => ({
    role: "Action",
    title: label,
    fields: [
      {
        key: name,
        label,
        type: "action",
        value: null,
        constraints: { enabled, requires },
        description:
          description ??
          (requires?.length
            ? `Requires: ${requires.join(", ")}`
            : undefined),
        execute: onExecute,
      },
    ],
  }));
</script>

{#if render}
  {@render render({ execute: onExecute, enabled, label })}
{:else}
  <button class={className} disabled={!enabled} onclick={onExecute}>
    {#if children}
      {@render children()}
    {:else}
      {label}
    {/if}
  </button>
{/if}
