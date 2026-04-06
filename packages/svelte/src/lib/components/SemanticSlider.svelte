<script lang="ts">
  import type { Snippet } from "svelte";
  import { useSemantic } from "../context.svelte.js";

  interface Props {
    name: string;
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    description?: string;
    class?: string;
    onchange?: (value: number) => void;
    children?: Snippet<[{ value: number; set: (v: number) => void; min: number; max: number; step: number }]>;
  }

  let { name, label, value, min, max, step = 1, description, class: className, onchange, children }: Props = $props();

  useSemantic(() => ({
    role: "Field",
    title: label,
    fields: [
      {
        key: name,
        label,
        type: "slider",
        value,
        constraints: { min, max, step },
        description,
        set: (v) => onchange?.(Number(v)),
      },
    ],
  }));
</script>

{#if children}
  {@render children({ value, set: (v) => onchange?.(v), min, max, step })}
{:else}
  <div class={className}>
    <label>
      {label}: {value}
      <input type="range" {min} {max} {step} {value} oninput={(e) => onchange?.(Number((e.target as HTMLInputElement).value))} />
    </label>
  </div>
{/if}
