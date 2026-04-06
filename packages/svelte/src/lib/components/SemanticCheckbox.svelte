<script lang="ts">
  import type { Snippet } from "svelte";
  import { useSemantic } from "../context.svelte.js";

  interface Props {
    name: string;
    label: string;
    checked: boolean;
    description?: string;
    class?: string;
    onchange?: (checked: boolean) => void;
    children?: Snippet<[{ checked: boolean; set: (value: boolean) => void }]>;
  }

  let { name, label, checked, description, class: className, onchange, children }: Props = $props();

  useSemantic(() => ({
    role: "Field",
    title: label,
    fields: [
      {
        key: name,
        label,
        type: "checkbox",
        value: checked,
        description,
        set: (v) => onchange?.(v === true || v === "true" || v === 1),
      },
    ],
  }));
</script>

{#if children}
  {@render children({ checked, set: (v) => onchange?.(v) })}
{:else}
  <div class={className}>
    <label>
      <input type="checkbox" {checked} onchange={() => onchange?.(!checked)} />
      {label}
    </label>
  </div>
{/if}
