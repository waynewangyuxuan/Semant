import React, {
  createContext,
  useContext,
  useId,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";

// ── Types ──

/** Built-in types for autocomplete; any string is accepted for custom types */
export type SemanticFieldType =
  | "select" | "date" | "time" | "text" | "number" | "toggle" | "action"
  | (string & {});

export interface SemanticField<T = unknown> {
  /** Unique key for this field, e.g. "party_size" */
  key: string;
  /** Human-readable label */
  label: string;
  /** Component type hint — use built-in types or any custom string */
  type: SemanticFieldType;
  /** Current value (serializable) */
  value: T;
  /** Available options for selects/time slots */
  options?: T[];
  /** Constraints */
  min?: T;
  max?: T;
  /** Whether the field is currently enabled */
  enabled?: boolean;
  /** Extra description for AI */
  description?: string;
  /** Structured hint for custom types, e.g. { inputMode: "color", format: "hex" } */
  typeHint?: Record<string, unknown>;
  /** Optional validation. Return an error string if invalid, or null/undefined if valid. */
  validate?: (value: T) => string | null | undefined;
  /** Setter — called by the command interpreter */
  set?: (value: T) => void;
  /** For actions — the execute function */
  execute?: () => void;
}

/** Helper to create a typed field with inference */
export function field<T>(def: SemanticField<T>): SemanticField {
  return def as SemanticField;
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

// ── Shallow comparison (skip function refs, compare data only) ──

function shallowEqualField(a: SemanticField, b: SemanticField): boolean {
  if (a.key !== b.key || a.label !== b.label || a.type !== b.type ||
      a.value !== b.value || a.enabled !== b.enabled ||
      a.description !== b.description ||
      a.min !== b.min || a.max !== b.max) return false;
  if (a.options !== b.options) {
    if (!a.options || !b.options || a.options.length !== b.options.length) return false;
    for (let i = 0; i < a.options.length; i++) {
      if (a.options[i] !== b.options[i]) return false;
    }
  }
  return true;
}

function shallowEqualNode(a: SemanticNode, b: SemanticNode): boolean {
  if (a.role !== b.role || a.title !== b.title ||
      a.description !== b.description || a.order !== b.order) return false;
  if (a.fields.length !== b.fields.length) return false;
  for (let i = 0; i < a.fields.length; i++) {
    if (!shallowEqualField(a.fields[i], b.fields[i])) return false;
  }
  if (a.meta !== b.meta) {
    if (!a.meta || !b.meta) return false;
    const aKeys = Object.keys(a.meta);
    const bKeys = Object.keys(b.meta);
    if (aKeys.length !== bKeys.length) return false;
    for (const k of aKeys) {
      if (a.meta[k] !== b.meta[k]) return false;
    }
  }
  return true;
}

// ── Store (external store pattern for zero-rerender overhead) ──

type Listener = () => void;

class SemanticStore {
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
          // Try to parse as number
          const numVal = Number(rawValue);
          const value = Number.isNaN(numVal) ? rawValue : numVal;
          if (field.validate) {
            const error = field.validate(value);
            if (error) {
              return { ok: false, message: `validation failed for ${key}: ${error}` };
            }
          }
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

  const reactId = useId();
  const idRef = useRef(options.id ?? `sem${reactId}`);
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
  // Register after every render (effect, not render phase) to avoid
  // triggering useSyncExternalStore updates in sibling components.
  // The shallow compare in register() skips emit when data is unchanged.
  React.useEffect(() => {
    ctx.store.register(node);
  });

  // Unregister only on real unmount
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
