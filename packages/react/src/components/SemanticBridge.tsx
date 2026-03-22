import React, { useEffect } from "react";
import { useSemanticPage, useSemanticStore } from "../context";
import { toPlainText } from "@semant/core";

export interface SemanticBridgeProps {
  /** ID of the hidden DOM node. Default: "__semant" */
  nodeId?: string;
  /** Global variable name. Default: "__semant" */
  globalName?: string;
}

/**
 * Two-in-one AI bridge:
 * 1. Renders a hidden DOM node with plain-text semantic state
 * 2. Exposes window[globalName] with getState(), getStructured(), execute(), fields(), version
 */
export function SemanticBridge({
  nodeId = "__semant",
  globalName = "__semant",
}: SemanticBridgeProps) {
  const page = useSemanticPage();
  const store = useSemanticStore();
  const plainText = toPlainText(page);

  useEffect(() => {
    const api = {
      version: "0.1.0",
      getState: () => toPlainText(store.getSnapshot()),
      getStructured: () => store.getSnapshot(),
      fields: () => {
        const snap = store.getSnapshot();
        return snap.nodes.flatMap((n) => n.fields.map((f) => f.key));
      },
      execute: (
        command: string
      ): Promise<{ ok: boolean; message: string; state: string }> => {
        const result = store.execute(command);
        if (!result.ok) {
          return Promise.resolve({
            ...result,
            state: toPlainText(store.getSnapshot()),
          });
        }
        return new Promise((resolve) => {
          const timeout = setTimeout(() => {
            unsub();
            resolve({ ...result, state: toPlainText(store.getSnapshot()) });
          }, 100);
          const unsub = store.subscribe(() => {
            clearTimeout(timeout);
            unsub();
            resolve({ ...result, state: toPlainText(store.getSnapshot()) });
          });
        });
      },
    };
    (window as any)[globalName] = api;
    return () => {
      delete (window as any)[globalName];
    };
  }, [store, globalName]);

  return (
    <div
      id={nodeId}
      aria-hidden="true"
      style={{ display: "none" }}
      data-semant-version="0.1.0"
    >
      {plainText}
    </div>
  );
}
