<script lang="ts">
  import type { Snippet } from "svelte";
  import { useSemantic } from "../context.svelte.js";

  interface Props {
    name: string;
    label: string;
    options: Array<{ value: string | number; label: string }>;
    value?: string | number | null;
    description?: string;
    class?: string;
    onchange?: (value: string | number) => void;
    children?: Snippet<[{ options: Props["options"]; selected: Props["value"]; select: (v: string | number) => void }]>;
  }

  let { name, label, options, value = null, description, class: className, onchange, children }: Props = $props();

  useSemantic(() => ({
    role: "Field",
    title: label,
    fields: [
      {
        key: name,
        label,
        type: "select",
        value,
        constraints: { options: options.map((o) => o.value) },
        description,
        set: (v) => onchange?.(v as string | number),
      },
    ],
  }));

  function handleChange(e: Event) {
    const raw = (e.target as HTMLSelectElement).value;
    const num = Number(raw);
    onchange?.(Number.isNaN(num) ? raw : num);
  }
</script>

{#if children}
  {@render children({ options, selected: value, select: (v) => onchange?.(v) })}
{:else}
  <div class={className}>
    <select value={value ?? ""} onchange={handleChange}>
      <option value="" disabled>{label}</option>
      {#each options as opt (opt.value)}
        <option value={opt.value}>{opt.label}</option>
      {/each}
    </select>
  </div>
{/if}
