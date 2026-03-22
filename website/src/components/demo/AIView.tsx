import { useEffect, useRef, useState, useMemo } from "react";
import { useSemanticPage } from "@semant/react";
import type { SemanticNode, SemanticField } from "@semant/react";
import { useExecutionLog } from "./executionLog";

export function AIView() {
  const page = useSemanticPage();

  // Track changed field keys for highlight animation
  const [changedKeys, setChangedKeys] = useState<Set<string>>(new Set());
  const prevValuesRef = useRef<Map<string, unknown>>(new Map());
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Collect all fields and detect changes
  const allFields = useMemo(() => {
    const fields: { nodeId: string; field: SemanticField }[] = [];
    for (const node of page.nodes) {
      for (const field of node.fields) {
        fields.push({ nodeId: node.id, field });
      }
    }
    return fields;
  }, [page]);

  useEffect(() => {
    const changed = new Set<string>();
    for (const { field } of allFields) {
      const prev = prevValuesRef.current.get(field.key);
      if (prev !== undefined && prev !== field.value) {
        changed.add(field.key);
      }
      prevValuesRef.current.set(field.key, field.value);
    }
    if (changed.size > 0) {
      setChangedKeys(changed);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setChangedKeys(new Set()), 900);
    }
  }, [allFields]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const log = useExecutionLog();

  // Separate fields from actions, and extract semantic state vs commands
  const stateNodes = page.nodes.filter((n) => n.role !== "Action");
  const actions = allFields
    .filter(({ field }) => field.type === "action")
    .map(({ field }) => field);
  const settableFields = allFields.filter(
    ({ field }) => field.type !== "action" && field.set
  );

  return (
    <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div
        style={{
          fontSize: 11,
          color: "var(--a-text-secondary)",
          padding: "16px 24px 8px",
          textTransform: "uppercase",
          letterSpacing: 1,
          flexShrink: 0,
        }}
      >
        AI View — Semantic State
      </div>

      {/* ── SCROLLABLE STATE + LOG ── */}
      <div style={{ flex: 1, overflow: "auto", padding: "8px 24px" }}>
        {stateNodes.map((node) => (
          <NodeBlock key={node.id} node={node} changedKeys={changedKeys} />
        ))}

        {/* Execution Log */}
        {log.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <div
              style={{
                fontSize: 11,
                color: "var(--a-text-secondary)",
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 8,
                paddingTop: 10,
                borderTop: "1px dashed var(--a-border)",
              }}
            >
              Execution Log
            </div>
            {log.slice(-5).map((entry, i) => (
              <div
                key={entry.timestamp + i}
                style={{
                  marginBottom: 6,
                  padding: "4px 8px",
                  borderRadius: 4,
                  background: entry.ok ? "rgba(74, 222, 128, 0.08)" : "rgba(248, 113, 113, 0.08)",
                  borderLeft: `3px solid ${entry.ok ? "#4ade80" : "#f87171"}`,
                }}
              >
                <div>
                  <span style={{ color: "var(--a-text-secondary)" }}>{">"} </span>
                  <span style={{ color: "var(--a-text)" }}>{entry.command}</span>
                </div>
                <div
                  style={{
                    color: entry.ok ? "#4ade80" : "#f87171",
                    fontSize: 11,
                    paddingLeft: 14,
                  }}
                >
                  {entry.ok ? "✓" : "✗"} {entry.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── COMMANDS SECTION (pinned to bottom) ── */}
      {(settableFields.length > 0 || actions.length > 0) && (
        <div
          style={{
            flexShrink: 0,
            padding: "12px 24px 16px",
            borderTop: "1px solid var(--a-border)",
            background: "var(--a-bg)",
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "var(--a-accent)",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            Available Commands
          </div>

          {settableFields.map(({ field }) => (
            <div key={field.key} style={{ marginBottom: 4, color: "var(--a-text)" }}>
              <span style={{ color: "var(--a-text-secondary)" }}>set</span>{" "}
              <span style={{ color: "var(--a-accent)" }}>{field.key}</span>{" "}
              <span style={{ color: "var(--a-text-secondary)" }}>
                {formatConstraintHint(field)}
              </span>
            </div>
          ))}

          {actions.map((field) => {
            const enabled = field.constraints?.enabled !== false;
            return (
              <div key={field.key} style={{ marginBottom: 4, color: "var(--a-text)" }}>
                <span style={{ color: enabled ? "var(--a-accent)" : "var(--a-text-secondary)" }}>
                  {field.key}
                </span>
                {!enabled && (
                  <span style={{ color: "var(--a-text-secondary)", marginLeft: 8 }}>
                    (disabled)
                  </span>
                )}
                {field.constraints?.requires != null && (
                  <span style={{ color: "var(--a-text-secondary)", marginLeft: 8, fontSize: 11 }}>
                    requires: {String(field.constraints.requires)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function NodeBlock({
  node,
  changedKeys,
}: {
  node: SemanticNode;
  changedKeys: Set<string>;
}) {
  const interactiveFields = node.fields.filter((f) => f.type !== "action");
  const hasMeta = node.meta && Object.keys(node.meta).length > 0;

  return (
    <div style={{ marginBottom: 14 }}>
      {/* Node header */}
      <div style={{ marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            background: "rgba(196, 240, 103, 0.12)",
            color: "var(--a-accent)",
            padding: "2px 8px",
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 600,
            textTransform: "capitalize",
          }}
        >
          {node.role}
        </span>
        {node.title && (
          <span style={{ color: "var(--a-text)", fontWeight: 500 }}>{node.title}</span>
        )}
      </div>

      {/* Meta */}
      {hasMeta && (
        <div style={{ paddingLeft: 12, marginBottom: 6 }}>
          {Object.entries(node.meta!).map(([key, val]) => {
            const display = formatValue(val);
            return (
              <div key={key} style={{ color: "var(--a-text-secondary)", marginBottom: 2 }}>
                <span>{key}</span>
                <span style={{ color: "var(--a-text-secondary)" }}>: </span>
                <span style={{ color: "var(--a-text)" }}>{display}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Fields */}
      {interactiveFields.map((field) => {
        const isChanged = changedKeys.has(field.key);
        return (
          <div
            key={field.key}
            style={{
              paddingLeft: 12,
              marginBottom: 4,
              padding: "3px 6px 3px 12px",
              borderRadius: 4,
              background: isChanged ? "rgba(196, 240, 103, 0.12)" : "transparent",
              transition: "background 0.3s",
            }}
          >
            <span
              style={{
                color: "var(--a-text-secondary)",
                fontSize: 11,
                textTransform: "uppercase",
              }}
            >
              {field.type}
            </span>{" "}
            <span style={{ color: "var(--a-accent)" }}>{field.key}</span>
            {field.value !== null && field.value !== undefined && field.value !== "" && (
              <>
                <span style={{ color: "var(--a-text-secondary)" }}> = </span>
                <span
                  style={{
                    color: isChanged ? "var(--a-accent)" : "var(--a-text)",
                    fontWeight: isChanged ? 600 : 400,
                    transition: "color 0.3s",
                  }}
                >
                  {formatValue(field.value)}
                </span>
              </>
            )}
            {field.constraints && Object.keys(field.constraints).length > 0 && (
              <span style={{ color: "var(--a-text-secondary)", fontSize: 11, marginLeft: 8 }}>
                {formatConstraints(field.constraints)}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function formatValue(val: unknown): string {
  if (val === null || val === undefined) return "—";
  if (typeof val === "string") return `"${val}"`;
  if (Array.isArray(val)) {
    if (val.length <= 5) return `[${val.map((v) => formatValue(v)).join(", ")}]`;
    return `[${val.slice(0, 3).map((v) => formatValue(v)).join(", ")}, ... +${val.length - 3}]`;
  }
  return String(val);
}

function formatConstraints(c: Record<string, unknown>): string {
  const parts: string[] = [];
  for (const [key, val] of Object.entries(c)) {
    if (key === "enabled" || key === "requires") continue; // shown separately for actions
    if (key === "options" && Array.isArray(val)) {
      if (val.length <= 6) {
        parts.push(`options: [${val.join(", ")}]`);
      } else {
        parts.push(`options: [${val.slice(0, 4).join(", ")}, ...+${val.length - 4}]`);
      }
    } else {
      parts.push(`${key}: ${formatValue(val)}`);
    }
  }
  return parts.length ? `(${parts.join(", ")})` : "";
}

function formatConstraintHint(field: SemanticField): string {
  if (field.type === "date") return "<YYYY-MM-DD>";
  if (field.type === "number") return "<number>";
  if (field.constraints?.options && Array.isArray(field.constraints.options)) {
    const opts = field.constraints.options;
    if (opts.length <= 6) return `<${opts.join("|")}>`;
    return `<${opts.slice(0, 4).join("|")}|...>`;
  }
  return "<value>";
}
