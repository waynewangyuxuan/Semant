import { useState, useRef, useEffect } from "react";
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
                <CustomSelect
                  options={opts}
                  selected={selected}
                  onSelect={select}
                  format={(v) => `${v} ${Number(v) === 1 ? "guest" : "guests"}`}
                />
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

function CustomSelect({
  options,
  selected,
  onSelect,
  format,
}: {
  options: Array<{ value: string | number; label: string }>;
  selected: string | number | null;
  onSelect: (value: string | number) => void;
  format?: (value: string | number) => string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const display = selected != null
    ? (format ? format(selected) : options.find((o) => o.value === selected)?.label ?? String(selected))
    : "Select...";

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "10px 36px 10px 12px",
          fontSize: 14,
          fontFamily: "var(--font-body)",
          border: "1px solid var(--h-border)",
          borderRadius: 8,
          background: "#fff",
          color: "var(--h-text)",
          cursor: "pointer",
          textAlign: "left",
          position: "relative",
        }}
      >
        {display}
        <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 10, color: "var(--h-text-secondary)" }}>
          ▼
        </span>
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid var(--h-border)",
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            zIndex: 10,
            overflow: "hidden",
          }}
        >
          {options.map((o) => (
            <div
              key={o.value}
              onClick={() => { onSelect(o.value); setOpen(false); }}
              style={{
                padding: "8px 12px",
                fontSize: 14,
                cursor: "pointer",
                background: o.value === selected ? "rgba(45,106,79,0.06)" : "#fff",
                color: o.value === selected ? "var(--h-accent)" : "var(--h-text)",
                fontWeight: o.value === selected ? 600 : 400,
              }}
              onMouseEnter={(e) => { (e.target as HTMLDivElement).style.background = "rgba(45,106,79,0.06)"; }}
              onMouseLeave={(e) => { (e.target as HTMLDivElement).style.background = o.value === selected ? "rgba(45,106,79,0.06)" : "#fff"; }}
            >
              {format ? format(o.value) : o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
