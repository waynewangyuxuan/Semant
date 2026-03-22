import React, {
  createContext,
  useContext,
  useCallback,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";

// ── Types ──

export interface SemanticField {
  /** Unique key for this field, e.g. "party_size" */
  key: string;
  /** Human-readable label */
  label: string;
  /** Component type hint */
  type: "select" | "date" | "time" | "text" | "number" | "toggle" | "action";
  /** Current value (serializable) */
  value: unknown;
  /** Available options for selects/time slots */
  options?: unknown[];
  /** Constraints */
  min?: unknown;
  max?: unknown;
  /** Whether the field is currently enabled */
  enabled?: boolean;
  /** Extra description for AI */
  description?: string;
  /** Setter — called by the command interpreter */
  set?: (value: unknown) => void;
  /** For actions — the execute function */
  execute?: () => void;
}

export interface SemanticNode {
  /** Node id, auto-generated or user-provided */
  id: string;
  /** Semantic role: what is this block? */
  role: string;
  /** Human-readable title */
  title?: string;
  /** Short description */
  description?: string;
  /** Arbitrary metadata */
  meta?: Record<string, unknown>;
  /** Interactive fields */
  fields: SemanticField[];
  /** Ordering hint */
  order?: number;
}

export interface SemanticPage {
  /** Page title */
  title: string;
  /** Page description */
  description?: string;
  /** All registered nodes */
  nodes: SemanticNode[];
}

// ── Store (external store pattern for zero-rerender overhead) ──

type Listener = () => void;

class SemanticStore {
  private nodes = new Map<string, SemanticNode>();
  private listeners = new Set<Listener>();
  private pageTitle = "";
  private pageDescription = "";
  private version = 0;

  setPage(title: string, description?: string) {
    this.pageTitle = title;
    this.pageDescription = description ?? "";
  }

  register(node: SemanticNode) {
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
    const sorted = Array.from(this.nodes.values()).sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0)
    );
    return {
      title: this.pageTitle,
      description: this.pageDescription,
      nodes: sorted,
    };
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
          // Try to parse as number
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

// ── Context ──

interface SemanticContextValue {
  store: SemanticStore;
}

const SemanticContext = createContext<SemanticContextValue | null>(null);

// ── Provider ──

export interface SemanticProviderProps {
  /** Page title for the semantic output */
  title: string;
  /** Page description */
  description?: string;
  children: ReactNode;
}

export function SemanticProvider({
  title,
  description,
  children,
}: SemanticProviderProps) {
  const storeRef = useRef<SemanticStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = new SemanticStore();
  }
  storeRef.current.setPage(title, description);

  return (
    <SemanticContext.Provider value={{ store: storeRef.current }}>
      {children}
    </SemanticContext.Provider>
  );
}

// ── Hook ──

let idCounter = 0;

export interface UseSemanticOptions {
  id?: string;
  role: string;
  title?: string;
  description?: string;
  meta?: Record<string, unknown>;
  fields: SemanticField[];
  order?: number;
}

/**
 * Register a semantic node. Call this in any component to make it
 * self-describing. Returns the store for advanced usage.
 */
export function useSemantic(options: UseSemanticOptions) {
  const ctx = useContext(SemanticContext);
  if (!ctx) throw new Error("useSemantic must be used within <SemanticProvider>");

  const idRef = useRef(options.id ?? `sem_${++idCounter}`);
  const id = idRef.current;

  // Register/update on every render (fields may have changed)
  const node: SemanticNode = {
    id,
    role: options.role,
    title: options.title,
    description: options.description,
    meta: options.meta,
    fields: options.fields,
    order: options.order,
  };
  ctx.store.register(node);

  // Unregister on unmount
  React.useEffect(() => {
    return () => ctx.store.unregister(id);
  }, [ctx.store, id]);

  return { id, store: ctx.store };
}

/**
 * Read the current semantic page state. Re-renders when any node changes.
 */
export function useSemanticPage(): SemanticPage {
  const ctx = useContext(SemanticContext);
  if (!ctx) throw new Error("useSemanticPage must be used within <SemanticProvider>");
  return useSyncExternalStore(ctx.store.subscribe, ctx.store.getSnapshot);
}

/**
 * Get the store directly (for executing commands, etc.)
 */
export function useSemanticStore(): SemanticStore {
  const ctx = useContext(SemanticContext);
  if (!ctx) throw new Error("useSemanticStore must be used within <SemanticProvider>");
  return ctx.store;
}
