export function CodeBlock({ children, language }: { children: string; language?: string }) {
  return (
    <div style={{ position: "relative", marginBottom: 20 }}>
      {language && (
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 12,
            fontSize: 11,
            color: "var(--a-text-secondary)",
            fontFamily: "var(--font-mono)",
            textTransform: "uppercase",
          }}
        >
          {language}
        </div>
      )}
      <pre
        style={{
          background: "var(--a-bg)",
          color: "var(--a-text)",
          padding: "16px 20px",
          borderRadius: "var(--a-radius)",
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          lineHeight: 1.7,
          overflow: "auto",
          whiteSpace: "pre",
        }}
      >
        <code>{children}</code>
      </pre>
    </div>
  );
}
