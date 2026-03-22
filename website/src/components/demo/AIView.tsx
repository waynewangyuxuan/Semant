import { useEffect, useRef, useState } from "react";
import { useSemanticPage, toPlainText } from "@semant/react";
import { useExecutionLog } from "./executionLog";

export function AIView() {
  const page = useSemanticPage();
  const text = toPlainText(page);
  const log = useExecutionLog();

  // Track previous text to detect changed lines
  const [prevText, setPrevText] = useState(text);
  const [changedLines, setChangedLines] = useState<Set<number>>(new Set());
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (text !== prevText) {
      const newLines = text.split("\n");
      const oldLines = prevText.split("\n");
      const changed = new Set<number>();
      for (let i = 0; i < newLines.length; i++) {
        if (newLines[i] !== oldLines[i]) {
          changed.add(i);
        }
      }
      setChangedLines(changed);
      setPrevText(text);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setChangedLines(new Set()), 1200);
    }
  }, [text, prevText]);

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  const lines = text.split("\n");

  return (
    <div style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
      {/* Header */}
      <div
        style={{
          fontSize: 11,
          color: "var(--a-text-secondary)",
          marginBottom: 12,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        AI View — what the agent reads
      </div>

      {/* Plain text with syntax coloring */}
      <div style={{ lineHeight: 1.8 }}>
        {lines.map((line, i) => (
          <div
            key={i}
            style={{
              padding: "1px 6px",
              borderRadius: 3,
              background: changedLines.has(i)
                ? "rgba(196, 240, 103, 0.12)"
                : "transparent",
              transition: "background 0.4s",
            }}
          >
            <PlainTextLine line={line} highlight={changedLines.has(i)} />
          </div>
        ))}
      </div>

      {/* Execution log (inline, below the text) */}
      {log.length > 0 && (
        <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px dashed var(--a-border)" }}>
          <div style={{ fontSize: 11, color: "var(--a-text-secondary)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
            Agent Actions
          </div>
          {log.slice(-5).map((entry, i) => (
            <div
              key={entry.timestamp + i}
              style={{
                marginBottom: 4,
                padding: "3px 8px",
                borderRadius: 3,
                borderLeft: `3px solid ${entry.ok ? "#4ade80" : "#f87171"}`,
                background: entry.ok ? "rgba(74, 222, 128, 0.06)" : "rgba(248, 113, 113, 0.06)",
              }}
            >
              <span style={{ color: "var(--a-text-secondary)" }}>{">"} </span>
              <span style={{ color: "var(--a-text)" }}>{entry.command}</span>
              <span style={{ color: entry.ok ? "#4ade80" : "#f87171", marginLeft: 8, fontSize: 11 }}>
                {entry.ok ? "✓" : "✗"} {entry.message}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** Syntax-color a single line of toPlainText() output */
function PlainTextLine({ line, highlight }: { line: string; highlight: boolean }) {
  if (!line) return <span>{"\u00A0"}</span>;

  // Page title: # Title
  if (line.startsWith("# ")) {
    return <span style={{ color: "var(--a-text)", fontWeight: 600, fontSize: 14 }}>{line}</span>;
  }

  // Description: > text
  if (line.startsWith("> ")) {
    return <span style={{ color: "var(--a-text-secondary)", fontStyle: "italic" }}>{line}</span>;
  }

  // Section header: ## Commands
  if (line.startsWith("## ")) {
    return (
      <span style={{ color: "var(--a-accent)", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>
        {line}
      </span>
    );
  }

  // Node header: [role: title] or [role]
  const nodeMatch = line.match(/^\[([^\]]+)\]$/);
  if (nodeMatch) {
    return colorizeNodeHeader(nodeMatch[1]);
  }

  // Field line: [Type: key] options/range/current
  const fieldMatch = line.match(/^(\s+)\[([A-Za-z]+): ([^\]]+)\](.*)$/);
  if (fieldMatch) {
    return colorizeFieldLine(fieldMatch[1], fieldMatch[2], fieldMatch[3], fieldMatch[4], highlight);
  }

  // Action line: [Action: key] enabled: true/false
  const actionMatch = line.match(/^(\s+)\[Action: ([^\]]+)\] enabled: (true|false)$/);
  if (actionMatch) {
    return colorizeActionLine(actionMatch[1], actionMatch[2], actionMatch[3] === "true");
  }

  // Command line: set key <hint> or action_name
  const cmdMatch = line.match(/^(\s+)(set \S+ .+|\S+)$/);
  if (cmdMatch) {
    return (
      <span>
        <span style={{ color: "var(--a-text-secondary)" }}>{cmdMatch[1]}</span>
        <span style={{ color: "var(--a-accent)" }}>{cmdMatch[2]}</span>
      </span>
    );
  }

  // Meta line: key: value
  const metaMatch = line.match(/^(\s+)(\S+): (.+)$/);
  if (metaMatch) {
    return (
      <span>
        <span style={{ color: "var(--a-text-secondary)" }}>{metaMatch[1]}{metaMatch[2]}: </span>
        <span style={{ color: "var(--a-text)" }}>{metaMatch[3]}</span>
      </span>
    );
  }

  // Fallback
  return <span style={{ color: "var(--a-text)" }}>{line}</span>;
}

function colorizeNodeHeader(content: string) {
  const parts = content.split(": ");
  const role = parts[0];
  const title = parts.slice(1).join(": ");
  return (
    <span>
      <span style={{ color: "var(--a-text-secondary)" }}>[</span>
      <span style={{ color: "var(--a-accent)", fontWeight: 600 }}>{role}</span>
      {title && (
        <>
          <span style={{ color: "var(--a-text-secondary)" }}>: </span>
          <span style={{ color: "var(--a-text)", fontWeight: 500 }}>{title}</span>
        </>
      )}
      <span style={{ color: "var(--a-text-secondary)" }}>]</span>
    </span>
  );
}

function colorizeFieldLine(indent: string, type: string, key: string, rest: string, highlight: boolean) {
  // rest contains things like: options: [...] current: value
  // Highlight the "current: value" part
  const currentMatch = rest.match(/^(.*?)( current: )(.+)$/);

  return (
    <span>
      <span style={{ color: "var(--a-text-secondary)" }}>{indent}[</span>
      <span style={{ color: "var(--a-text-secondary)", fontSize: 11 }}>{type}</span>
      <span style={{ color: "var(--a-text-secondary)" }}>: </span>
      <span style={{ color: "var(--a-accent)" }}>{key}</span>
      <span style={{ color: "var(--a-text-secondary)" }}>]</span>
      {currentMatch ? (
        <>
          <span style={{ color: "var(--a-text-secondary)" }}>{currentMatch[1]}</span>
          <span style={{ color: "var(--a-text-secondary)" }}>{currentMatch[2]}</span>
          <span style={{ color: highlight ? "var(--a-accent)" : "var(--a-text)", fontWeight: highlight ? 600 : 400, transition: "color 0.3s" }}>
            {currentMatch[3]}
          </span>
        </>
      ) : (
        <span style={{ color: "var(--a-text-secondary)" }}>{rest}</span>
      )}
    </span>
  );
}

function colorizeActionLine(indent: string, key: string, enabled: boolean) {
  return (
    <span>
      <span style={{ color: "var(--a-text-secondary)" }}>{indent}[</span>
      <span style={{ color: "var(--a-text-secondary)", fontSize: 11 }}>Action</span>
      <span style={{ color: "var(--a-text-secondary)" }}>: </span>
      <span style={{ color: enabled ? "var(--a-accent)" : "var(--a-text-secondary)" }}>{key}</span>
      <span style={{ color: "var(--a-text-secondary)" }}>] enabled: </span>
      <span style={{ color: enabled ? "#4ade80" : "#f87171" }}>{String(enabled)}</span>
    </span>
  );
}
