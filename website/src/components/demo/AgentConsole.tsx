import { useEffect, useRef } from "react";
import { useExecutionLog } from "./executionLog";

export function AgentConsole() {
  const log = useExecutionLog();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [log]);

  return (
    <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div
        style={{
          fontSize: 11,
          color: "var(--a-text-secondary)",
          padding: "16px 16px 8px",
          textTransform: "uppercase",
          letterSpacing: 1,
          borderBottom: "1px solid var(--a-border)",
          flexShrink: 0,
        }}
      >
        Agent Console
      </div>

      {/* Log entries */}
      <div ref={scrollContainerRef} style={{ flex: 1, overflow: "auto", padding: "8px 12px" }}>
        {log.length === 0 && (
          <div style={{ color: "var(--a-text-secondary)", fontSize: 11, padding: "12px 4px", lineHeight: 1.6 }}>
            <div style={{ marginBottom: 8 }}>Waiting for agent...</div>
            <div style={{ color: "var(--a-text-secondary)", opacity: 0.5 }}>
              Commands will appear here as the agent operates the page.
            </div>
          </div>
        )}

        {log.map((entry, i) => (
          <div key={entry.timestamp + i} style={{ marginBottom: 8 }}>
            <div>
              <span style={{ color: "var(--a-accent)" }}>agent</span>
              <span style={{ color: "var(--a-text-secondary)" }}> $ </span>
              <span style={{ color: "var(--a-text)" }}>{entry.command}</span>
            </div>
            <div
              style={{
                color: entry.ok ? "#4ade80" : "#f87171",
                paddingLeft: 2,
                fontSize: 11,
              }}
            >
              {entry.ok ? "→" : "✗"} {entry.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
