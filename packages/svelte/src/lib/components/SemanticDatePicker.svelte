<script lang="ts">
  import type { Snippet } from "svelte";
  import { useSemantic } from "../context.svelte.js";

  interface Props {
    name: string;
    label: string;
    value?: string | null;
    min?: string;
    max?: string;
    description?: string;
    class?: string;
    onchange?: (date: string) => void;
    children?: Snippet<[{ value: string | null; select: (d: string) => void; min?: string; max?: string }]>;
  }

  let { name, label, value = null, min, max, description, class: className, onchange, children }: Props = $props();

  useSemantic(() => ({
    role: "Field",
    title: label,
    fields: [
      {
        key: name,
        label,
        type: "date",
        value,
        constraints: { min, max },
        description: description ?? `Date range: ${min ?? "any"} to ${max ?? "any"}`,
        set: (v) => onchange?.(String(v)),
      },
    ],
  }));
</script>

{#if children}
  {@render children({ value, select: (d) => onchange?.(d), min, max })}
{:else}
  <div class={className}>
    <input type="date" value={value ?? ""} {min} {max} onchange={(e) => onchange?.((e.target as HTMLInputElement).value)} />
  </div>
{/if}
