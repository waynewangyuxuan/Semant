import { PrincipleCallout } from "../../components/docs/PrincipleCallout";
import { CodeBlock } from "../../components/docs/CodeBlock";

export function WrapComponent() {
  return (
    <div>
      <h1 className="heading" style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>
        Wrap Your Own Component
      </h1>

      <PrincipleCallout name="Open Semantics">
        The <code style={{ background: "rgba(45,106,79,0.1)", padding: "1px 4px", borderRadius: 3 }}>type</code> field
        is a string, not a union. semant doesn't define what types exist. You do. A map component can declare{" "}
        <code style={{ background: "rgba(45,106,79,0.1)", padding: "1px 4px", borderRadius: 3 }}>type: "location"</code>.
        The framework doesn't need to know what that means.
      </PrincipleCallout>

      <p style={{ marginBottom: 24, lineHeight: 1.7 }}>
        Any React component can become semantic in 3 lines using <code style={{ background: "#f0f0f0", padding: "1px 4px", borderRadius: 3 }}>useSemantic()</code>.
        The hook registers your component in the semantic store — AI can then read its state and send commands to it.
      </p>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Before: A plain color picker</h2>
      <CodeBlock language="tsx">{`function ColorPicker({ value, onChange }) {
  return (
    <div>
      <input type="color" value={value} onChange={e => onChange(e.target.value)} />
      <span>{value}</span>
    </div>
  );
}`}</CodeBlock>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>After: A semantic color picker</h2>
      <CodeBlock language="tsx">{`import { useSemantic } from "@semant/react";

function ColorPicker({ value, onChange }) {
  useSemantic({
    role: "Field",
    title: "Color",
    fields: [{
      key: "color",
      label: "Selected Color",
      type: "color",                    // ← open string, you decide
      value,
      constraints: { format: "hex" },   // ← free-form metadata
      set: (v) => onChange(String(v)),   // ← AI calls this
    }],
  });

  return (
    <div>
      <input type="color" value={value} onChange={e => onChange(e.target.value)} />
      <span>{value}</span>
    </div>
  );
}`}</CodeBlock>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>What changed</h2>
      <ol style={{ lineHeight: 2, paddingLeft: 20, marginBottom: 24 }}>
        <li><strong>Import</strong> <code style={{ background: "#f0f0f0", padding: "1px 4px", borderRadius: 3 }}>useSemantic</code> from <code style={{ background: "#f0f0f0", padding: "1px 4px", borderRadius: 3 }}>@semant/react</code></li>
        <li><strong>Call</strong> the hook with a role, fields, and a <code style={{ background: "#f0f0f0", padding: "1px 4px", borderRadius: 3 }}>set</code> callback</li>
        <li><strong>Done</strong> — the component now describes itself to AI on every render</li>
      </ol>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>What AI sees</h2>
      <CodeBlock>{`[Field: Color]
  [Color: color] current: #2D6A4F
    constraints: { format: hex }

## Commands
  set color <value>`}</CodeBlock>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Key concepts</h2>
      <ul style={{ lineHeight: 2, paddingLeft: 20 }}>
        <li><strong>role</strong> — what kind of thing is this? Open string: "Field", "restaurant", "map", anything.</li>
        <li><strong>fields</strong> — interactive state. Each field has a <code style={{ background: "#f0f0f0", padding: "1px 4px", borderRadius: 3 }}>key</code>, <code style={{ background: "#f0f0f0", padding: "1px 4px", borderRadius: 3 }}>type</code>, <code style={{ background: "#f0f0f0", padding: "1px 4px", borderRadius: 3 }}>value</code>, and optional <code style={{ background: "#f0f0f0", padding: "1px 4px", borderRadius: 3 }}>constraints</code>.</li>
        <li><strong>constraints</strong> — free-form <code style={{ background: "#f0f0f0", padding: "1px 4px", borderRadius: 3 }}>{"Record<string, unknown>"}</code>. Use it for options, ranges, formats — whatever makes sense for your type.</li>
        <li><strong>set</strong> — the callback AI uses to update this field. You connect it to your state management.</li>
      </ul>
    </div>
  );
}
