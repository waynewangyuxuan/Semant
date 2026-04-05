// ── Re-export core (so users can import everything from @semant/vue) ──
export { SemanticStore, toPlainText, toLlmsTxt, toJsonLd, toJsonLdScript, toMCPTools, toHeadHtml } from "@semant/core";
export type { SemanticField, SemanticNode, SemanticPage, MCPToolDefinition, ToMCPToolsOptions, ToHeadHtmlOptions } from "@semant/core";

// ── Vue composables ──
export {
  useSemantic,
  useSemanticPage,
  useSemanticStore,
  SEMANT_KEY,
} from "./context";
export type { UseSemanticOptions } from "./context";

// ── Delivery Components ──
export { SemanticProvider } from "./components/SemanticProvider";
export { SemanticHead } from "./components/SemanticHead";
export { SemanticBridge } from "./components/SemanticBridge";

// ── Reference Components ──
export { SemanticSelect } from "./components/SemanticSelect";
export { SemanticTextInput } from "./components/SemanticTextInput";
export { SemanticAction } from "./components/SemanticAction";
export { SemanticCheckbox } from "./components/SemanticCheckbox";
export { SemanticSlider } from "./components/SemanticSlider";
export { SemanticTextarea } from "./components/SemanticTextarea";
export { SemanticRadioGroup } from "./components/SemanticRadioGroup";
export { SemanticMultiSelect } from "./components/SemanticMultiSelect";
export { SemanticDatePicker } from "./components/SemanticDatePicker";
export { SemanticInfo } from "./components/SemanticInfo";
export { SemanticList } from "./components/SemanticList";

// ── Component prop types ──
export type { SemanticProviderProps } from "./components/SemanticProvider";
export type { SemanticHeadProps } from "./components/SemanticHead";
export type { SemanticBridgeProps } from "./components/SemanticBridge";
export type { SemanticSelectProps } from "./components/SemanticSelect";
export type { SemanticTextInputProps } from "./components/SemanticTextInput";
export type { SemanticActionProps } from "./components/SemanticAction";
export type { SemanticCheckboxProps } from "./components/SemanticCheckbox";
export type { SemanticSliderProps } from "./components/SemanticSlider";
export type { SemanticTextareaProps } from "./components/SemanticTextarea";
export type { SemanticRadioGroupProps } from "./components/SemanticRadioGroup";
export type { SemanticMultiSelectProps } from "./components/SemanticMultiSelect";
export type { SemanticDatePickerProps } from "./components/SemanticDatePicker";
export type { SemanticInfoProps } from "./components/SemanticInfo";
export type { SemanticListProps } from "./components/SemanticList";
