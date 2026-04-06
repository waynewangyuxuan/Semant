<script lang="ts">
  import type { Snippet } from "svelte";
  import { useSemantic } from "../context.svelte.js";

  interface Props {
    name: string;
    label: string;
    options: Array<{ value: string | number; label: string }>;
    value: Array<string | number>;
    description?: string;
    class?: string;
    onchange?: (value: Array<string | number>) => void;
    children?: Snippet<[{ options: Props["options"]; selected: Array<string | number>; toggle: (v: string | number) => void }]>;
  }

  let { name, label, options, value, description, class: className, onchange, children }: Props = $props();

  function toggle(v: string | number) {
    if (value.includes(v)) {
      onchange?.(value.filter((x) => x !== v));
    } else {
      onchange?.([...value, v]);
    }
  }

  useSemantic(() => ({
    role: "Field",
    title: label,
    fields: [
      {
        key: name,
        label,
        type: "multi-select",
        value,
        constraints: { options: options.map((o) => o.value) },
        description,
        set: (v) => {
          if (typeof v === "string") {
            try {
              const parsed = JSON.parse(v);
              if (Array.isArray(parsed)) { onchange?.(parsed); return; }
            } catch { /* not JSON */ }
            onchange?.([v]);
            return;
          }
          if (Array.isArray(v)) {
            onchange?.(v as Array<string | number>);
          } else {
            onchange?.([v as string | number]);
          }
        },
      },
    ],
  }));
</script>

{#if children}
  {@render children({ options, selected: value, toggle })}
{:else}
  <fieldset class={className}>
    <legend>{label}</legend>
    {#each options as opt (opt.value)}
      <label>
        <input type="checkbox" checked={value.includes(opt.value)} onchange={() => toggle(opt.value)} />
        {opt.label}
      </label>
    {/each}
  </fieldset>
{/if}
