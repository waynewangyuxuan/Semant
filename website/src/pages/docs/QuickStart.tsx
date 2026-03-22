import { PrincipleCallout } from "../../components/docs/PrincipleCallout";
import { CodeBlock } from "../../components/docs/CodeBlock";

export function QuickStart() {
  return (
    <div>
      <h1 className="heading" style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>
        Quick Start
      </h1>

      <PrincipleCallout name="Mirror, Not Engine">
        semant doesn't manage your state. It reads what you declare on each render. Your component is the source of truth. semant just reflects it.
      </PrincipleCallout>

      <p style={{ marginBottom: 24, lineHeight: 1.7 }}>
        Get AI-readable, AI-operable components in 5 minutes.
      </p>

      {/* Step 1 */}
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>1. Install</h2>
      <CodeBlock language="bash">{`npm install @semant/react`}</CodeBlock>

      {/* Step 2 */}
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>2. Wrap your app</h2>
      <p style={{ marginBottom: 12, lineHeight: 1.7 }}>
        Add <code style={{ background: "#f0f0f0", padding: "1px 4px", borderRadius: 3 }}>SemanticProvider</code> at the root. This creates the semantic store.
      </p>
      <CodeBlock language="tsx">{`import { SemanticProvider } from "@semant/react";

function App() {
  return (
    <SemanticProvider title="My App" description="A demo app">
      {/* your app here */}
    </SemanticProvider>
  );
}`}</CodeBlock>

      {/* Step 3 */}
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>3. Add delivery components</h2>
      <p style={{ marginBottom: 12, lineHeight: 1.7 }}>
        <code style={{ background: "#f0f0f0", padding: "1px 4px", borderRadius: 3 }}>SemanticHead</code> injects
        JSON-LD and a discovery signal into <code style={{ background: "#f0f0f0", padding: "1px 4px", borderRadius: 3 }}>&lt;head&gt;</code>.{" "}
        <code style={{ background: "#f0f0f0", padding: "1px 4px", borderRadius: 3 }}>SemanticBridge</code> creates
        the <code style={{ background: "#f0f0f0", padding: "1px 4px", borderRadius: 3 }}>window.__semant</code> API
        for browser agents.
      </p>
      <CodeBlock language="tsx">{`import { SemanticHead, SemanticBridge } from "@semant/react";

<SemanticProvider title="My App">
  <SemanticHead />
  <SemanticBridge />
  {/* your app */}
</SemanticProvider>`}</CodeBlock>

      {/* Step 4 */}
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>4. Use a semantic component</h2>
      <p style={{ marginBottom: 12, lineHeight: 1.7 }}>
        Drop in a reference component. It renders UI for humans and registers itself in the semantic store for AI.
      </p>
      <CodeBlock language="tsx">{`import { SemanticSelect } from "@semant/react";

const [size, setSize] = useState(2);
const options = [1,2,3,4].map(n => ({ value: n, label: \`\${n} guests\` }));

<SemanticSelect
  name="party_size"
  label="Party Size"
  options={options}
  value={size}
  onChange={setSize}
/>`}</CodeBlock>

      {/* Step 5 */}
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>5. Verify</h2>
      <p style={{ marginBottom: 12, lineHeight: 1.7 }}>
        Open DevTools console and run:
      </p>
      <CodeBlock language="js">{`window.__semant.getState()
// Returns plain text description of your page

window.__semant.execute("set party_size 4")
// { ok: true, message: "set party_size = 4" }
// The UI updates. No screenshots. No DOM parsing.`}</CodeBlock>

      {/* Next */}
      <div
        style={{
          marginTop: 32,
          padding: 20,
          background: "rgba(45, 106, 79, 0.05)",
          borderRadius: 8,
          lineHeight: 1.7,
        }}
      >
        <strong>Next:</strong> See a full working example in{" "}
        <a href="https://github.com/waynewangyuxuan/Semant/tree/main/examples/restaurant-booking" target="_blank" rel="noopener" style={{ color: "var(--h-accent)" }}>
          examples/restaurant-booking
        </a>
        , or learn how to{" "}
        <a href={`${import.meta.env.BASE_URL}docs/guides/wrap-component`} style={{ color: "var(--h-accent)" }}>
          wrap your own component
        </a>.
      </div>
    </div>
  );
}
