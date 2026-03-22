import { SemanticInfo } from "@semant/react";
import { CodeBlock } from "../../components/docs/CodeBlock";

const h3 = { fontSize: 16, fontWeight: 600 as const, marginBottom: 8, marginTop: 24 };
const desc = { fontSize: 14, color: "var(--h-text-secondary)" as const, marginBottom: 12, lineHeight: 1.6 as const };

export function ApiReference() {
  return (
    <div>
      <SemanticInfo
        role="page"
        title="API Reference"
        meta={{
          summary: "Complete API reference for @semant/react and @semant/core. All public exports with type signatures.",
          sections: ["Types", "Store", "Output Renderers", "React Bindings", "Reference Components", "Delivery Components"],
          exports: [
            "SemanticField", "SemanticNode", "SemanticPage", "SemanticStore",
            "toPlainText", "toLlmsTxt", "toJsonLd", "toJsonLdScript",
            "SemanticProvider", "useSemantic", "useSemanticPage", "useSemanticStore",
            "SemanticSelect", "SemanticDatePicker", "SemanticTextInput", "SemanticAction",
            "SemanticInfo", "SemanticList", "SemanticHead", "SemanticBridge",
          ],
          keywords: ["API", "reference", "types", "hooks", "components", "exports"],
        }}
      />
      <h1 className="heading" style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
        API Reference
      </h1>
      <p style={{ color: "var(--h-text-secondary)", marginBottom: 32 }}>
        All public exports from <code style={{ background: "#f0f0f0", padding: "1px 4px", borderRadius: 3 }}>@semant/react</code> (which re-exports <code style={{ background: "#f0f0f0", padding: "1px 4px", borderRadius: 3 }}>@semant/core</code>).
      </p>

      {/* === TYPES === */}
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16, paddingBottom: 8, borderBottom: "1px solid var(--h-border)" }}>
        Types
      </h2>

      <h3 style={h3}>SemanticField</h3>
      <p style={desc}>The unit of interaction. Open-typed, framework-agnostic.</p>
      <CodeBlock language="ts">{`interface SemanticField {
  key: string;                           // unique ID, used in commands
  label: string;                         // human-readable label
  type: string;                          // open: "select", "date", "color", anything
  value: unknown;                        // current value (JSON-serializable)
  constraints?: Record<string, unknown>; // { options: [...] }, { min, max }, etc.
  description?: string;                  // AI-facing description
  set?: (value: unknown) => void;        // setter for AI commands
  execute?: () => void;                  // for action-type fields
}`}</CodeBlock>

      <h3 style={h3}>SemanticNode</h3>
      <p style={desc}>A registered component in the semantic store.</p>
      <CodeBlock language="ts">{`interface SemanticNode {
  id: string;
  role: string;                          // "Field", "restaurant", "map", anything
  title?: string;
  description?: string;
  meta?: Record<string, unknown>;        // arbitrary metadata
  fields: SemanticField[];
  order?: number;                        // ordering hint
}`}</CodeBlock>

      <h3 style={h3}>SemanticPage</h3>
      <p style={desc}>The page-level container holding all nodes.</p>
      <CodeBlock language="ts">{`interface SemanticPage {
  title: string;
  description?: string;
  nodes: SemanticNode[];
}`}</CodeBlock>

      {/* === STORE === */}
      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 16, paddingBottom: 8, borderBottom: "1px solid var(--h-border)" }}>
        Store
      </h2>

      <h3 style={h3}>SemanticStore</h3>
      <p style={desc}>Framework-agnostic pub/sub store. Created automatically by SemanticProvider.</p>
      <CodeBlock language="ts">{`class SemanticStore {
  setPage(title: string, description?: string): void
  register(node: SemanticNode): void
  unregister(id: string): void
  getSnapshot(): SemanticPage
  subscribe(listener: () => void): () => void
  execute(command: string): Promise<{ ok: boolean; message: string }>
}`}</CodeBlock>

      {/* === RENDERERS === */}
      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 16, paddingBottom: 8, borderBottom: "1px solid var(--h-border)" }}>
        Output Renderers
      </h2>
      <p style={desc}>Pure functions. Input: SemanticPage. Output: string. No side effects.</p>

      <h3 style={h3}>toPlainText(page)</h3>
      <p style={desc}>AI-readable plain text with field state and commands.</p>

      <h3 style={h3}>toLlmsTxt(page)</h3>
      <p style={desc}>llms.txt spec format (markdown-based).</p>

      <h3 style={h3}>toJsonLd(page) / toJsonLdScript(page)</h3>
      <p style={desc}>Schema.org JSON-LD object / script tag string.</p>

      {/* === REACT === */}
      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 16, paddingBottom: 8, borderBottom: "1px solid var(--h-border)" }}>
        React Bindings
      </h2>

      <h3 style={h3}>{"<SemanticProvider>"}</h3>
      <p style={desc}>Wraps your app. Creates the store. Props: <code>title</code>, <code>description?</code>.</p>

      <h3 style={h3}>useSemantic(options)</h3>
      <p style={desc}>Register a component in the semantic store. Call in any component.</p>
      <CodeBlock language="ts">{`interface UseSemanticOptions {
  id?: string;
  role: string;          // required
  title?: string;
  description?: string;
  meta?: Record<string, unknown>;
  fields?: SemanticField[];
  order?: number;
}
// Returns: { id: string; store: SemanticStore }`}</CodeBlock>

      <h3 style={h3}>useSemanticPage()</h3>
      <p style={desc}>Returns current SemanticPage snapshot. Re-renders on store changes.</p>

      <h3 style={h3}>useSemanticStore()</h3>
      <p style={desc}>Returns the SemanticStore instance directly.</p>

      {/* === COMPONENTS === */}
      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 16, paddingBottom: 8, borderBottom: "1px solid var(--h-border)" }}>
        Reference Components
      </h2>
      <p style={desc}>Each renders default UI and registers itself via useSemantic(). All support a <code>children</code> render prop for custom rendering.</p>

      {[
        { name: "SemanticSelect", props: "name, label, options, value, onChange, description?, children?" },
        { name: "SemanticDatePicker", props: "name, label, value, onChange, min?, max?, description?, children?" },
        { name: "SemanticTextInput", props: "name, label, value, onChange, placeholder?, type?, description?, children?" },
        { name: "SemanticAction", props: "name, label, onExecute, enabled?, requires?, description?, children?, render?" },
        { name: "SemanticInfo", props: "role, title?, description?, meta?, order?, children?" },
        { name: "SemanticList", props: "name, label, items, getLabel, getKey, getMeta?, description?, children?" },
      ].map((c) => (
        <div key={c.name} style={{ marginBottom: 12 }}>
          <h3 style={{ ...h3, marginTop: 16 }}>{"<"}{c.name}{">"}</h3>
          <p style={{ fontSize: 13, color: "var(--h-text-secondary)", fontFamily: "var(--font-mono)" }}>{c.props}</p>
        </div>
      ))}

      {/* === DELIVERY === */}
      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 16, paddingBottom: 8, borderBottom: "1px solid var(--h-border)" }}>
        Delivery Components
      </h2>

      <h3 style={h3}>{"<SemanticHead>"}</h3>
      <p style={desc}>Injects <code>{"<meta name=\"semant\">"}</code> discovery signal and JSON-LD <code>{"<script>"}</code> into document head. Props: <code>baseUrl?</code>.</p>

      <h3 style={h3}>{"<SemanticBridge>"}</h3>
      <p style={desc}>Creates hidden DOM node + <code>window.__semant</code> API. Props: <code>nodeId?</code> (default: "__semant"), <code>globalName?</code> (default: "__semant").</p>
      <CodeBlock language="ts">{`// window.__semant API:
{
  version: "0.1.0",
  getState(): string,              // plain text snapshot
  getStructured(): SemanticPage,   // structured object
  fields(): string[],              // all field keys
  execute(cmd: string): Promise<{ ok, message, state }>
}`}</CodeBlock>
    </div>
  );
}
