# Development Constraints

## Code Style
- TypeScript strict mode. No `any` unless unavoidable (and commented why).
- All public API must be exported from `src/index.ts` with both value and type exports.
- Components use named exports, not default exports.

## Architecture Rules
- `src/outputs/` files are **pure functions** — no React imports, no side effects. Input: `SemanticPage`. Output: string.
- `src/core.tsx` owns all types, the store, and hooks. Components import from `../core`, never the reverse.
- Reference components in `src/components/` must use `useSemantic()` — they are examples of the hook pattern, not special-cased.
- Zero runtime dependencies. React is a peer dependency.

## Adding Components
- Every new reference component needs: domain props, `useSemantic()` registration, default rendering, and `children` render prop for customization.
- `SemanticAction` uses `render` prop instead of `children` (children is button content).
- Register type and props export in `src/index.ts`.

## Adding Output Formats
- New output format = new file in `src/outputs/`. Pure function signature: `(page: SemanticPage, options?) => string`.
- Export from `src/index.ts`.

## Testing
- No test framework set up yet. When added: test outputs as pure functions first (easiest), then component registration lifecycle.

## Git
- Conventional-ish commits. Keep them descriptive.
- `main` branch is the trunk.

## Doc Sync
- If you change the public API surface (new exports, changed props), update README.md API tables.
- If you change the command protocol in `SemanticStore.execute()`, update the README Commands section.
