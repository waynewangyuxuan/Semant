import { PrincipleCallout } from "../../components/docs/PrincipleCallout";
import { CodeBlock } from "../../components/docs/CodeBlock";

const RAW_DOM = `<div class="flex items-center justify-between px-4 py-2
  bg-white rounded-lg shadow-sm border border-gray-200">
  <div class="flex items-center space-x-3">
    <div class="w-10 h-10 rounded-full bg-gradient-to-r
      from-blue-500 to-purple-600"></div>
    <div>
      <div class="text-sm font-semibold text-gray-900">2</div>
      <div class="text-xs text-gray-500">Guests</div>
    </div>
  </div>
  <svg class="w-4 h-4 text-gray-400" ...>
    <path d="M6 9l6 6 6-6" />
  </svg>
</div>`;

const SEMANT_OUTPUT = `[Field: Party Size]
  [Select: party_size]
    options: [1, 2, 3, 4, 5, 6]
    current: 2

## Commands
  set party_size <1|2|3|4|5|6>`;

export function Why() {
  return (
    <div>
      <h1 className="heading" style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>
        Why semant
      </h1>

      <PrincipleCallout name="The Web's Missing Layer">
        The web was designed for humans to see and AI to guess. semant adds a layer where components describe themselves — so AI can read and operate pages without screenshots or DOM parsing.
      </PrincipleCallout>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>The Problem</h2>
      <p style={{ marginBottom: 16, lineHeight: 1.7 }}>
        Today, AI agents understand web pages by either taking screenshots (slow, expensive, error-prone) or parsing raw DOM (meaningless class names, no semantic structure). A simple dropdown that says "2 Guests" looks like this to an AI:
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#f87171", marginBottom: 8, fontFamily: "var(--font-mono)" }}>
            ✗ What AI sees today — Raw DOM
          </div>
          <CodeBlock language="html">{RAW_DOM}</CodeBlock>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#4ade80", marginBottom: 8, fontFamily: "var(--font-mono)" }}>
            ✓ What AI sees with semant
          </div>
          <CodeBlock>{SEMANT_OUTPUT}</CodeBlock>
        </div>
      </div>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>The Solution</h2>
      <p style={{ marginBottom: 12, lineHeight: 1.7 }}>
        semant components describe themselves. Each component knows how to render itself for humans <strong>and</strong> explain itself to AI — as plain text, llms.txt, or JSON-LD. One source of truth, no separate metadata layer.
      </p>
      <p style={{ marginBottom: 24, lineHeight: 1.7 }}>
        The AI gets field names, current values, available options, and executable commands — all from the component's own state. When the user picks a different value, the AI description updates automatically.
      </p>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>What semant is NOT</h2>
      <ul style={{ lineHeight: 2, paddingLeft: 20 }}>
        <li><strong>Not a UI library.</strong> It composes with your existing components. It replaces nothing.</li>
        <li><strong>Not state management.</strong> It reads your state on each render. It doesn't own it.</li>
        <li><strong>Not auto-inference.</strong> Developers declare semantics explicitly. No magic, no guessing.</li>
        <li><strong>Not a closed schema.</strong> The <code style={{ background: "#f0f0f0", padding: "1px 4px", borderRadius: 3 }}>type</code> field is an open string. You define what types exist.</li>
      </ul>
    </div>
  );
}
