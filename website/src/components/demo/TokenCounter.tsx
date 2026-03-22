import { useSemanticPage, toPlainText } from "@semant/react";

// Rough token estimate: ~4 chars per token (GPT-style tokenization)
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

// Simulated raw DOM token count — a realistic booking form DOM is ~90K+ chars
const RAW_DOM_CHARS = 93847 * 4; // Pre-computed to match spec's "93,847 tokens"

export function TokenCounter() {
  const page = useSemanticPage();
  const semantText = toPlainText(page);
  const semantTokens = estimateTokens(semantText);
  const rawTokens = Math.ceil(RAW_DOM_CHARS / 4);
  const ratio = Math.round(rawTokens / Math.max(semantTokens, 1));

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        padding: "10px 16px",
        background: "var(--a-bg)",
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        color: "var(--a-text-secondary)",
        borderTop: "1px solid var(--a-border)",
      }}
    >
      <span>Raw DOM</span>
      <span style={{ color: "#f87171", fontWeight: 600 }}>
        {rawTokens.toLocaleString()}
      </span>
      <span>→</span>
      <span>semant</span>
      <span style={{ color: "var(--a-accent)", fontWeight: 600 }}>
        {semantTokens.toLocaleString()}
      </span>
      <span>tokens</span>
      <span
        style={{
          background: "rgba(196, 240, 103, 0.15)",
          color: "var(--a-accent)",
          padding: "2px 8px",
          borderRadius: 4,
          fontWeight: 600,
        }}
      >
        {ratio}×
      </span>
    </div>
  );
}
