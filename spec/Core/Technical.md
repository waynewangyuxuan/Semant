# Technical Architecture

## Code Organization
```
src/
├── core.tsx          # SemanticStore, Provider, hooks, types (the heart)
├── index.ts          # Public API re-exports
├── components/       # Reference components
│   ├── SemanticSelect.tsx
│   ├── SemanticDatePicker.tsx
│   ├── SemanticTextInput.tsx
│   ├── SemanticAction.tsx
│   ├── SemanticInfo.tsx
│   ├── SemanticList.tsx
│   ├── SemanticHead.tsx      # JSON-LD injection into <head>
│   └── SemanticBridge.tsx    # Hidden DOM + window.__semant
└── outputs/          # Pure functions, no React dependency
    ├── plaintext.ts  # AI-readable text with commands
    ├── llmstxt.ts    # llms.txt spec format
    └── jsonld.ts     # Schema.org JSON-LD
```

## Key Patterns

### External Store (core.tsx)
`SemanticStore` uses React's `useSyncExternalStore` for zero-overhead subscriptions. Components register via `useSemantic()` hook which calls `store.register()` in a `useEffect`. Shallow comparison (`shallowEqualNode`) prevents unnecessary re-renders when only function refs change.

### Registration Lifecycle
1. Component mounts → `useEffect` calls `store.register(node)`
2. Component re-renders → `useEffect` fires again, register compares shallowly, skips emit if data unchanged
3. Component unmounts → cleanup effect calls `store.unregister(id)`

### Output Renderers
Pure functions: `SemanticPage → string`. No side effects, no React imports. Easy to add new formats — just write a function that takes `SemanticPage` and returns a string.

### Reference Components
Each follows the same pattern:
1. Accept domain props (value, onChange, options, etc.)
2. Call `useSemantic()` with a field definition
3. Render default UI or delegate to `children` render prop

## Build
- tsup bundles to ESM (`dist/index.js`) + CJS (`dist/index.cjs`) + types (`dist/index.d.ts`)
- React is a peer dependency, not bundled
- Zero runtime dependencies
