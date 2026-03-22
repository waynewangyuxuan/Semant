import type { SemanticNode, SemanticPage } from "./types";
import { shallowEqualNode } from "./equality";

// ── Store (external store pattern for zero-rerender overhead) ──

type Listener = () => void;

export class SemanticStore {
  private nodes = new Map<string, SemanticNode>();
  private listeners = new Set<Listener>();
  private pageTitle = "";
  private pageDescription = "";
  private version = 0;
  private snapshotCache: SemanticPage | null = null;
  private snapshotVersion = -1;

  setPage(title: string, description?: string) {
    this.pageTitle = title;
    this.pageDescription = description ?? "";
  }

  register(node: SemanticNode) {
    const existing = this.nodes.get(node.id);
    if (existing && shallowEqualNode(existing, node)) {
      // Data unchanged — silently update function refs without notifying
      this.nodes.set(node.id, node);
      return;
    }
    this.nodes.set(node.id, node);
    this.version++;
    this.emit();
  }

  unregister(id: string) {
    this.nodes.delete(id);
    this.version++;
    this.emit();
  }

  update(id: string, partial: Partial<SemanticNode>) {
    const existing = this.nodes.get(id);
    if (existing) {
      this.nodes.set(id, { ...existing, ...partial });
      this.version++;
      this.emit();
    }
  }

  getSnapshot = (): SemanticPage => {
    if (this.snapshotVersion === this.version && this.snapshotCache) {
      return this.snapshotCache;
    }
    const sorted = Array.from(this.nodes.values()).sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0)
    );
    this.snapshotCache = {
      title: this.pageTitle,
      description: this.pageDescription,
      nodes: sorted,
    };
    this.snapshotVersion = this.version;
    return this.snapshotCache;
  };

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  /** Execute a text command like "set party_size 4" or "submit_booking" */
  execute(command: string): { ok: boolean; message: string } {
    const trimmed = command.trim();

    // "set <key> <value>"
    const setMatch = trimmed.match(/^set\s+(\S+)\s+(.+)$/i);
    if (setMatch) {
      const [, key, rawValue] = setMatch;
      for (const node of this.nodes.values()) {
        const field = node.fields.find((f) => f.key === key);
        if (field && field.set) {
          const numVal = Number(rawValue);
          const value = Number.isNaN(numVal) ? rawValue : numVal;
          field.set(value);
          return { ok: true, message: `set ${key} = ${rawValue}` };
        }
      }
      return { ok: false, message: `unknown field: ${key}` };
    }

    // Action: just the action name
    for (const node of this.nodes.values()) {
      const action = node.fields.find(
        (f) => f.type === "action" && f.key === trimmed
      );
      if (action && action.execute) {
        action.execute();
        return { ok: true, message: `executed: ${trimmed}` };
      }
    }

    return { ok: false, message: `unknown command: ${trimmed}` };
  }

  private emit() {
    this.listeners.forEach((l) => l());
  }
}
