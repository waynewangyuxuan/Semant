import { setContext, getContext } from "svelte";
import { SemanticStore } from "@semant/core";
import type { SemanticField, SemanticNode, SemanticPage } from "@semant/core";

const isServer = typeof window === "undefined";

// ── Context ──

interface SemanticContextValue {
  store: SemanticStore;
}

export const SEMANT_KEY = Symbol("semant");

// ── ID generator ──

let idCounter = 0;

function generateId(): string {
  return `sem-svelte-${++idCounter}`;
}

// ── Provider helper ──

export function provideSemanticStore(
  title: string,
  description?: string
): SemanticStore {
  const store = new SemanticStore();
  store.setPage(title, description);
  setContext(SEMANT_KEY, { store } as SemanticContextValue);
  return store;
}

// ── Composables ──

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
 * Register a semantic node. Accepts a plain options object or a getter
 * function. The getter form is required when options depend on reactive
 * props — $effect will track the reads inside the getter.
 */
export function useSemantic(
  optionsOrGetter: UseSemanticOptions | (() => UseSemanticOptions)
): {
  id: string;
  store: SemanticStore;
} {
  const ctx = getContext<SemanticContextValue>(SEMANT_KEY);
  if (!ctx) {
    throw new Error(
      "useSemantic must be used within a <SemanticProvider>"
    );
  }

  const resolve =
    typeof optionsOrGetter === "function"
      ? optionsOrGetter
      : () => optionsOrGetter;

  const initial = resolve();
  const id = initial.id ?? generateId();

  // During SSR, $effect doesn't run. Register synchronously.
  if (isServer) {
    const options = resolve();
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
  }

  // On client, $effect runs after DOM updates and tracks reactive deps.
  $effect(() => {
    const options = resolve();
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

    return () => {
      ctx.store.unregister(id);
    };
  });

  return { id, store: ctx.store };
}

/**
 * Read the current semantic page state. Reactive via $state.
 */
export function useSemanticPage(): { readonly current: SemanticPage } {
  const ctx = getContext<SemanticContextValue>(SEMANT_KEY);
  if (!ctx) {
    throw new Error(
      "useSemanticPage must be used within a <SemanticProvider>"
    );
  }

  let page = $state<SemanticPage>(ctx.store.getSnapshot());

  // During SSR, $effect doesn't run. Subscribe eagerly.
  if (isServer) {
    ctx.store.subscribe(() => {
      page = ctx.store.getSnapshot();
    });
  }

  $effect(() => {
    page = ctx.store.getSnapshot();
    const unsub = ctx.store.subscribe(() => {
      page = ctx.store.getSnapshot();
    });
    return () => unsub();
  });

  return {
    get current() {
      return page;
    },
  };
}

/**
 * Get the store directly (for executing commands, etc.)
 */
export function useSemanticStore(): SemanticStore {
  const ctx = getContext<SemanticContextValue>(SEMANT_KEY);
  if (!ctx) {
    throw new Error(
      "useSemanticStore must be used within a <SemanticProvider>"
    );
  }
  return ctx.store;
}
