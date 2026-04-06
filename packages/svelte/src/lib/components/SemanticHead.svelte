<script lang="ts">
  import { toJsonLdScript } from "@semant/core";
  import { useSemanticPage } from "../context.svelte.js";

  interface Props {
    baseUrl?: string;
  }

  let { baseUrl }: Props = $props();

  const page = useSemanticPage();

  const jsonLd = $derived(toJsonLdScript(page.current, { baseUrl }));
</script>

<svelte:head>
  <meta name="semant" content="0.1.0" />
  {@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>
