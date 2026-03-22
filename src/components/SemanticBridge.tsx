import React, { useEffect } from "react";
import { useSemanticPage, useSemanticStore } from "../core";
import { toPlainText } from "../outputs/plaintext";

export interface SemanticBridgeProps {
  /** ID of the hidden DOM node. Default: "semantic-state" */
  nodeId?: string;
  /** Global variable name. Default: "__semant" */
  globalName?: string;
}

/**
 * Two-in-one AI bridge:
 * 1. Renders a hidden DOM node with plain-text semantic state (for browser agents reading DOM)
 * 2. Exposes window[globalName] with getState() and execute() (for agents running JS)
 *
 * execute() returns a Promise that resolves with the updated state
 * after React has re-rendered, so agents can: await execute → read new state in one step.
 */
export function SemanticBridge({
  nodeId = "semantic-state",
  globalName = "__semant",
}: SemanticBridgeProps) {
  const page = useSemanticPage();
  const store = useSemanticStore();
  const plainText = toPlainText(page);

  // Expose global JS API
  useEffect(() => {
    const api = {
      getState: () => toPlainText(store.getSnapshot()),
      execute: (command: string): Promise<{ ok: boolean; message: string; state: string }> => {
        const result = store.execute(command);
        if (!result.ok) {
          return Promise.resolve({ ...result, state: toPlainText(store.getSnapshot()) });
        }
        // Wait for React to re-render and store to reflect the new state
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
      data-semant="true"
    >
      {plainText}
    </div>
  );
}
