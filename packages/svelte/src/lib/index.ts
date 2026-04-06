// ── Re-export core (so users can import everything from @semant/svelte) ──
export { SemanticStore, toPlainText, toLlmsTxt, toJsonLd, toJsonLdScript, toMCPTools, toHeadHtml } from "@semant/core";
export type { SemanticField, SemanticNode, SemanticPage, MCPToolDefinition, ToMCPToolsOptions, ToHeadHtmlOptions } from "@semant/core";

// ── Svelte composables ──
export {
  useSemantic,
  useSemanticPage,
  useSemanticStore,
  SEMANT_KEY,
} from "./context.svelte.js";
export type { UseSemanticOptions } from "./context.svelte.js";

// ── Delivery Components ──
export { default as SemanticProvider } from "./components/SemanticProvider.svelte";
export { default as SemanticHead } from "./components/SemanticHead.svelte";
export { default as SemanticBridge } from "./components/SemanticBridge.svelte";

// ── Reference Components ──
export { default as SemanticSelect } from "./components/SemanticSelect.svelte";
export { default as SemanticTextInput } from "./components/SemanticTextInput.svelte";
export { default as SemanticAction } from "./components/SemanticAction.svelte";
export { default as SemanticCheckbox } from "./components/SemanticCheckbox.svelte";
export { default as SemanticSlider } from "./components/SemanticSlider.svelte";
export { default as SemanticTextarea } from "./components/SemanticTextarea.svelte";
export { default as SemanticRadioGroup } from "./components/SemanticRadioGroup.svelte";
export { default as SemanticMultiSelect } from "./components/SemanticMultiSelect.svelte";
export { default as SemanticDatePicker } from "./components/SemanticDatePicker.svelte";
export { default as SemanticInfo } from "./components/SemanticInfo.svelte";
export { default as SemanticList } from "./components/SemanticList.svelte";
