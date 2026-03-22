import { useState, useRef, useEffect } from "react";
import { useSemanticStore } from "@semant/react";
import { pushLogEntry } from "./executionLog";

interface HistoryEntry {
  command: string;
  ok: boolean;
  message: string;
}

export function CommandTerminal() {
  const store = useSemanticStore();
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    const result = await store.execute(cmd);
    setHistory((h) => [...h, { command: cmd, ok: result.ok, message: result.message }]);
    pushLogEntry({ command: cmd, ok: result.ok, message: result.message });
    setInput("");
  };

  return (
    <div
      style={{
        background: "#1a1a1e",
        borderTop: "1px solid var(--a-border)",
      }}
    >
      {/* History */}
      {history.length > 0 && (
        <div
          ref={scrollRef}
          style={{
            maxHeight: 120,
            overflow: "auto",
            padding: "8px 16px",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
          }}
        >
          {history.map((entry, i) => (
            <div key={i} style={{ marginBottom: 4 }}>
              <span style={{ color: "var(--a-text-secondary)" }}>{">"} </span>
              <span style={{ color: "var(--a-text)" }}>{entry.command}</span>
              <div
                style={{
                  color: entry.ok ? "#4ade80" : "#f87171",
                  paddingLeft: 16,
                }}
              >
                {entry.ok ? "✓" : "✗"} {entry.message}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "8px 16px",
          borderTop: history.length > 0 ? "1px solid var(--a-border)" : "none",
        }}
      >
        <span
          style={{
            color: "var(--a-accent)",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            marginRight: 8,
            flexShrink: 0,
          }}
        >
          ▸
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a command... e.g. set check_in 2026-04-15"
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "var(--a-text)",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
          }}
        />
        <button
          type="submit"
          style={{
            background: "transparent",
            border: "1px solid var(--a-border)",
            borderRadius: 4,
            color: "var(--a-text-secondary)",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            padding: "4px 12px",
            cursor: "pointer",
          }}
        >
          ↵
        </button>
      </form>
    </div>
  );
}
