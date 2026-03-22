import { useEffect, useRef, useState } from "react";
import { useSemanticPage, toPlainText } from "@semant/react";

export function AIView() {
  const page = useSemanticPage();
  const text = toPlainText(page);
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
      timeoutRef.current = setTimeout(() => setChangedLines(new Set()), 800);
    }
  }, [text, prevText]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const lines = text.split("\n");

  return (
    <div>
      <div
        style={{
          fontSize: 11,
          color: "var(--a-text-secondary)",
          marginBottom: 12,
          fontFamily: "var(--font-mono)",
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        AI View — Plain Text
      </div>
      <pre
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          lineHeight: 1.7,
          color: "var(--a-text)",
          margin: 0,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {lines.map((line, i) => (
          <div
            key={i}
            style={{
              padding: "1px 4px",
              borderRadius: 3,
              background: changedLines.has(i)
                ? "rgba(196, 240, 103, 0.15)"
                : "transparent",
              color: changedLines.has(i) ? "var(--a-accent)" : undefined,
              transition: "background 0.3s, color 0.3s",
            }}
          >
            {line || "\u00A0"}
          </div>
        ))}
      </pre>
    </div>
  );
}
