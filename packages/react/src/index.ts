// ── Re-export core (so users can import everything from @semant/react) ──
export { SemanticStore, toPlainText, toLlmsTxt, toJsonLd, toJsonLdScript } from "@semant/core";
export type { SemanticField, SemanticNode, SemanticPage } from "@semant/core";

// ── React bindings ──
export {
  SemanticProvider,
  useSemantic,
  useSemanticPage,
  useSemanticStore,
} from "./context";
export type { SemanticProviderProps, UseSemanticOptions } from "./context";

// ── Reference Components ──
export { SemanticSelect } from "./components/SemanticSelect";
export { SemanticDatePicker } from "./components/SemanticDatePicker";
export { SemanticTextInput } from "./components/SemanticTextInput";
export { SemanticAction } from "./components/SemanticAction";
export { SemanticInfo } from "./components/SemanticInfo";
export { SemanticList } from "./components/SemanticList";
export { SemanticHead } from "./components/SemanticHead";
export { SemanticBridge } from "./components/SemanticBridge";

export type { SemanticSelectProps } from "./components/SemanticSelect";
export type { SemanticDatePickerProps } from "./components/SemanticDatePicker";
export type { SemanticTextInputProps } from "./components/SemanticTextInput";
export type { SemanticActionProps } from "./components/SemanticAction";
export type { SemanticInfoProps } from "./components/SemanticInfo";
export type { SemanticListProps } from "./components/SemanticList";
export type { SemanticHeadProps } from "./components/SemanticHead";
export type { SemanticBridgeProps } from "./components/SemanticBridge";
