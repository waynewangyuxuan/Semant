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
        type: "radio",
        value,
        constraints: { options: options.map((o) => o.value) },
        description,
        set: (v) => onchange?.(v as string | number),
      },
    ],
  }));
</script>

{#if children}
  {@render children({ options, selected: value, select: (v) => onchange?.(v) })}
{:else}
  <fieldset class={className}>
    <legend>{label}</legend>
    {#each options as opt (opt.value)}
      <label>
        <input type="radio" {name} value={opt.value} checked={value === opt.value} onchange={() => onchange?.(opt.value)} />
        {opt.label}
      </label>
    {/each}
  </fieldset>
{/if}
