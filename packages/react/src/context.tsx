import React, {
  createContext,
  useContext,
  useId,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { SemanticStore } from "@semant/core";
import type { SemanticField, SemanticNode, SemanticPage } from "@semant/core";

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

// ── Hooks ──

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
