<script lang="ts">
  import type { Snippet } from "svelte";
  import { useSemantic } from "../context.svelte.js";

  interface Props {
    name: string;
    label: string;
    value: string;
    placeholder?: string;
    rows?: number;
    maxLength?: number;
    description?: string;
    class?: string;
    onchange?: (value: string) => void;
    children?: Snippet<[{ value: string; onChange: (value: string) => void; placeholder?: string }]>;
  }

  let { name, label, value, placeholder, rows, maxLength, description, class: className, onchange, children }: Props = $props();

  useSemantic(() => {
    const constraints: Record<string, unknown> = {};
    if (maxLength !== undefined) constraints.maxLength = maxLength;
    return {
      role: "Field",
      title: label,
      fields: [
        {
          key: name,
          label,
          type: "textarea",
          value,
          constraints: Object.keys(constraints).length > 0 ? constraints : undefined,
          description,
          set: (v) => onchange?.(String(v)),
        },
      ],
    };
  });
</script>

{#if children}
  {@render children({ value, onChange: (v) => onchange?.(v), placeholder })}
{:else}
  <div class={className}>
    <textarea
      {value}
      placeholder={placeholder ?? label}
      {rows}
      maxlength={maxLength}
      oninput={(e) => onchange?.((e.target as HTMLTextAreaElement).value)}
    ></textarea>
  </div>
{/if}
