<script lang="ts">
  import type { Snippet } from "svelte";
  import { useSemantic } from "../context.svelte.js";

  interface Props {
    name: string;
    label: string;
    value: string;
    placeholder?: string;
    type?: "text" | "email" | "tel" | "url" | "number";
    description?: string;
    class?: string;
    onchange?: (value: string) => void;
    children?: Snippet<[{ value: string; onChange: (value: string) => void; placeholder?: string }]>;
  }

  let { name, label, value, placeholder, type = "text", description, class: className, onchange, children }: Props = $props();

  useSemantic(() => ({
    role: "Field",
    title: label,
    fields: [
      {
        key: name,
        label,
        type: type === "number" ? "number" : "text",
        value,
        description,
        set: (v) => onchange?.(String(v)),
      },
    ],
  }));
</script>

{#if children}
  {@render children({ value, onChange: (v) => onchange?.(v), placeholder })}
{:else}
  <div class={className}>
    <input
      {type}
      {value}
      placeholder={placeholder ?? label}
      oninput={(e) => onchange?.((e.target as HTMLInputElement).value)}
    />
  </div>
{/if}
