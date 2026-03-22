import type { ReactNode } from "react";

export function PrincipleCallout({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div
      style={{
        borderLeft: "4px solid var(--h-accent)",
        background: "rgba(45, 106, 79, 0.05)",
        padding: "16px 20px",
        borderRadius: "0 8px 8px 0",
        marginBottom: 32,
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--h-accent)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>
        Design Principle: {name}
      </div>
      <div style={{ fontSize: 15, color: "var(--h-text)", lineHeight: 1.6 }}>
        {children}
      </div>
    </div>
  );
}
