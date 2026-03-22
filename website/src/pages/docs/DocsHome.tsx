import { useState } from "react";
import { Link } from "react-router-dom";
import { SemanticProvider, SemanticSelect, useSemanticPage, toPlainText } from "@semant/react";

function MiniDemo() {
  const [size, setSize] = useState<number>(2);
  const options = [1, 2, 3, 4, 5, 6].map((n) => ({ value: n, label: `${n}` }));

  return (
    <SemanticProvider title="Mini Demo" description="A single component demo">
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        {/* Human side */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: "var(--h-text-secondary)", marginBottom: 8, fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>
            Your UI
          </div>
          <div style={{ padding: 16, border: "1px solid var(--h-border)", borderRadius: 8 }}>
            <label style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 8 }}>Party Size</label>
            <SemanticSelect
              name="party_size"
              label="Party Size"
              options={options}
              value={size}
              onChange={(v) => setSize(v as number)}
            >
              {({ options: opts, selected, select }) => (
                <div style={{ display: "flex", gap: 6 }}>
                  {opts.map((o) => (
                    <button
                      key={o.value}
                      onClick={() => select(o.value)}
                      style={{
                        width: 40,
                        height: 40,
                        border: selected === o.value ? "2px solid var(--h-accent)" : "1px solid var(--h-border)",
                        borderRadius: 8,
                        background: selected === o.value ? "rgba(45,106,79,0.08)" : "#fff",
                        color: selected === o.value ? "var(--h-accent)" : "var(--h-text)",
                        fontWeight: selected === o.value ? 700 : 400,
                        fontSize: 15,
                        cursor: "pointer",
                      }}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              )}
            </SemanticSelect>
          </div>
        </div>

        {/* AI side */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: "var(--a-text-secondary)", marginBottom: 8, fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>
            What AI reads
          </div>
          <AIOutput />
        </div>
      </div>
    </SemanticProvider>
  );
}

function AIOutput() {
  const page = useSemanticPage();
  const text = toPlainText(page);
  return (
    <pre
      style={{
        background: "var(--a-bg)",
        color: "var(--a-accent)",
        padding: 16,
        borderRadius: "var(--a-radius)",
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        lineHeight: 1.7,
        whiteSpace: "pre-wrap",
        margin: 0,
      }}
    >
      {text}
    </pre>
  );
}

export function DocsHome() {
  return (
    <div>
      <h1 className="heading" style={{ fontSize: 32, fontWeight: 700, marginBottom: 12 }}>
        semant
      </h1>
      <p style={{ fontSize: 18, color: "var(--h-text-secondary)", marginBottom: 32 }}>
        React components that describe themselves to AI.
      </p>

      <MiniDemo />

      <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
        <Link
          to={"/docs/quickstart"}
          style={{
            padding: "10px 24px",
            background: "var(--h-accent)",
            color: "#fff",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          5 min Quick Start →
        </Link>
        <Link
          to={"/docs/why"}
          style={{
            padding: "10px 24px",
            border: "1px solid var(--h-border)",
            color: "var(--h-text)",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 500,
            fontSize: 14,
          }}
        >
          Why semant?
        </Link>
      </div>
    </div>
  );
}
