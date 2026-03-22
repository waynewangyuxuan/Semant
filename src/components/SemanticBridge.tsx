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
 * Both update automatically when any semantic node changes.
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
      getState: () => toPlainText(page),
      execute: (command: string) => store.execute(command),
    };
    (window as any)[globalName] = api;
    return () => {
      delete (window as any)[globalName];
    };
  }, [page, store, globalName]);

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
