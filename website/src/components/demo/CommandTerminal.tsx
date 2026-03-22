import { useState, useImperativeHandle, forwardRef } from "react";
import { useSemanticStore } from "@semant/react";
import { pushLogEntry } from "./executionLog";

export interface TerminalHandle {
  agentExecute: (command: string) => Promise<void>;
}

export const CommandTerminal = forwardRef<TerminalHandle>(function CommandTerminal(_, ref) {
  const store = useSemanticStore();
  const [input, setInput] = useState("");
  const [typingText, setTypingText] = useState<string | null>(null);

  const executeCommand = async (cmd: string) => {
    const result = await store.execute(cmd);
    pushLogEntry({ command: cmd, ok: result.ok, message: result.message });
  };

  useImperativeHandle(ref, () => ({
    agentExecute: async (command: string) => {
      setTypingText("");
      for (let i = 0; i <= command.length; i++) {
        await new Promise((r) => setTimeout(r, 30));
        setTypingText(command.slice(0, i));
      }
      await new Promise((r) => setTimeout(r, 200));
      setTypingText(null);
      await executeCommand(command);
    },
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;
    await executeCommand(cmd);
    setInput("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "8px 16px",
        background: "#1a1a1e",
        borderTop: "1px solid var(--a-border)",
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
        {typingText !== null ? "agent $" : "$"}
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
          <span style={{ opacity: 0.5 }}>▊</span>
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
  );
});
