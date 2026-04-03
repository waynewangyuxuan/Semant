import {
  inject,
  provide,
  shallowRef,
  watchEffect,
  onUnmounted,
  onMounted,
  type InjectionKey,
  type Ref,
} from "vue";
import { SemanticStore } from "@semant/core";
import type { SemanticField, SemanticNode, SemanticPage } from "@semant/core";

// ── Context ──

interface SemanticContextValue {
  store: SemanticStore;
}

export const SEMANT_KEY: InjectionKey<SemanticContextValue> =
  Symbol("semant");

// ── ID generator ──

let idCounter = 0;

function generateId(): string {
  return `sem-vue-${++idCounter}`;
}

// ── Provider helper ──

/**
 * Call inside a component's setup() to create and provide a SemanticStore.
 * Typically used by the SemanticProvider component.
 */
export function provideSemanticStore(
  title: string,
  description?: string
): SemanticStore {
  const store = new SemanticStore();
  store.setPage(title, description);
  provide(SEMANT_KEY, { store });
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
 * Register a semantic node. Call this in any component's setup() to make it
 * self-describing. Returns the store for advanced usage.
 */
export function useSemantic(options: UseSemanticOptions): {
  id: string;
  store: SemanticStore;
} {
  const ctx = inject(SEMANT_KEY);
  if (!ctx) {
    throw new Error(
      "useSemantic must be used within a <SemanticProvider>"
    );
  }

  const id = options.id ?? generateId();

  // Register after every render via watchEffect with flush: 'post'
  // to match React's useEffect post-render timing.
  // Store's shallowEqualNode deduplicates redundant registers.
  watchEffect(
    () => {
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
    },
    { flush: "post" }
  );

  onUnmounted(() => {
    ctx.store.unregister(id);
  });

  return { id, store: ctx.store };
}

/**
 * Read the current semantic page state. Reactive — updates when any node changes.
 */
export function useSemanticPage(): Readonly<Ref<SemanticPage>> {
  const ctx = inject(SEMANT_KEY);
  if (!ctx) {
    throw new Error(
      "useSemanticPage must be used within a <SemanticProvider>"
    );
  }

  const page = shallowRef<SemanticPage>(ctx.store.getSnapshot());
  let unsub: (() => void) | null = null;

  onMounted(() => {
    // Sync initial state (may have changed between setup and mount)
    page.value = ctx.store.getSnapshot();
    unsub = ctx.store.subscribe(() => {
      page.value = ctx.store.getSnapshot();
    });
  });

  onUnmounted(() => {
    unsub?.();
  });

  return page as Readonly<Ref<SemanticPage>>;
}

/**
 * Get the store directly (for executing commands, etc.)
 */
export function useSemanticStore(): SemanticStore {
  const ctx = inject(SEMANT_KEY);
  if (!ctx) {
    throw new Error(
      "useSemanticStore must be used within a <SemanticProvider>"
    );
  }
  return ctx.store;
}
