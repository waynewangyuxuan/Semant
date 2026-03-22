import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import { useSemanticStore } from "@semant/react";
import { pushLogEntry } from "./executionLog";

interface HistoryEntry {
  command: string;
  ok: boolean;
  message: string;
  source: "user" | "agent";
}

export interface TerminalHandle {
  /** Simulate an agent typing and executing a command */
  agentExecute: (command: string) => Promise<void>;
}

export const CommandTerminal = forwardRef<TerminalHandle>(function CommandTerminal(_, ref) {
  const store = useSemanticStore();
  const [input, setInput] = useState("");
  const [typingText, setTypingText] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = async (cmd: string, source: "user" | "agent") => {
    const result = await store.execute(cmd);
    setHistory((h) => [...h, { command: cmd, ok: result.ok, message: result.message, source }]);
    pushLogEntry({ command: cmd, ok: result.ok, message: result.message });
  };

  useImperativeHandle(ref, () => ({
    agentExecute: async (command: string) => {
      // Simulate typing effect
      setTypingText("");
      for (let i = 0; i <= command.length; i++) {
        await new Promise((r) => setTimeout(r, 30));
        setTypingText(command.slice(0, i));
      }
      await new Promise((r) => setTimeout(r, 200));
      setTypingText(null);
      await executeCommand(command, "agent");
    },
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;
    await executeCommand(cmd, "user");
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
            maxHeight: 140,
            overflow: "auto",
            padding: "8px 16px",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
          }}
        >
          {history.map((entry, i) => (
            <div key={i} style={{ marginBottom: 4 }}>
              <span style={{ color: entry.source === "agent" ? "var(--a-accent)" : "var(--a-text-secondary)" }}>
                {entry.source === "agent" ? "agent ▸ " : "> "}
              </span>
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
            color: typingText !== null ? "var(--a-accent)" : "var(--a-text-secondary)",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            marginRight: 8,
            flexShrink: 0,
          }}
        >
          {typingText !== null ? "agent ▸" : "▸"}
        </span>
        {typingText !== null ? (
          <div
            style={{
              flex: 1,
              color: "var(--a-accent)",
              fontFamily: "var(--font-mono)",
              fontSize: 13,
            }}
          >
            {typingText}
            <span style={{ opacity: 0.5, animation: "none" }}>▊</span>
          </div>
        ) : (
          <input
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
        )}
        <button
          type="submit"
          disabled={typingText !== null}
          style={{
            background: "transparent",
            border: "1px solid var(--a-border)",
            borderRadius: 4,
            color: "var(--a-text-secondary)",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            padding: "4px 12px",
            cursor: typingText !== null ? "default" : "pointer",
          }}
        >
          ↵
        </button>
      </form>
    </div>
  );
});
