# Technical Architecture

## Package Architecture

Two packages, clear boundary:

```
packages/
  core/     → @semant/core   (pure JS, zero deps, framework-agnostic)
  react/    → @semant/react  (thin React adapter, depends on @semant/core)
```

Monorepo managed by npm workspaces.

### @semant/core
```
packages/core/src/
├── types.ts          # SemanticField, SemanticNode, SemanticPage
├── equality.ts       # shallowEqualField, shallowEqualNode
├── store.ts          # SemanticStore (pub/sub + command interpreter)
├── index.ts          # Public API
└── outputs/          # Pure functions, no framework dependency
    ├── plaintext.ts  # AI-readable text with commands
    ├── llmstxt.ts    # llms.txt spec format
    └── jsonld.ts     # Schema.org JSON-LD
```

### @semant/react
```
packages/react/src/
├── context.tsx       # SemanticProvider, useSemantic, useSemanticPage, useSemanticStore
├── index.ts          # Re-exports @semant/core + React-specific API
└── components/       # Reference components + delivery components
    ├── SemanticSelect.tsx
    ├── SemanticDatePicker.tsx
    ├── SemanticTextInput.tsx
    ├── SemanticAction.tsx
    ├── SemanticInfo.tsx
    ├── SemanticList.tsx
    ├── SemanticHead.tsx      # JSON-LD + <meta> discovery signal
    └── SemanticBridge.tsx    # Hidden DOM + window.__semant API
```

## Key Patterns

### Data Model: Open Constraints
`SemanticField` uses a single `constraints?: Record<string, unknown>` bag instead of fixed fields like `options`, `min`, `max`. This keeps the protocol extensible — a map component uses `constraints: { bounds: [...] }`, a color picker uses `constraints: { format: "hex" }`. The framework never needs to know.

### External Store (store.ts)
`SemanticStore` is a plain JS class with `subscribe()`/`getSnapshot()`. React binds it via `useSyncExternalStore`. Vue/Svelte/vanilla JS can bind it via their own reactivity systems. The store owns no framework code.

### Shallow Equality (equality.ts)
`shallowEqualNode()` compares data fields only, skipping function refs (`set`, `execute`). This prevents spurious notifications when components re-render with new closures but unchanged data. `constraints` is shallow-compared by keys.

### Registration Lifecycle
1. Component mounts → `useEffect` calls `store.register(node)`
2. Component re-renders → `useEffect` fires again, register compares shallowly, skips emit if data unchanged
3. Component unmounts → cleanup effect calls `store.unregister(id)`

### Output Renderers
Pure functions: `SemanticPage → string`. No side effects, no framework imports. Easy to add new formats — just write a function that takes `SemanticPage` and returns a string.

### Reference Components
Each follows the same pattern:
1. Accept domain props (value, onChange, options, etc.)
2. Call `useSemantic()` with field definition using `constraints`
3. Render default UI or delegate to `children` render prop

## Build
- tsup bundles each package to ESM + CJS + types
- `@semant/core` has zero dependencies
- `@semant/react` externalizes `react`, `react-dom`, and `@semant/core`
