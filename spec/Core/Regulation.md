# Development Constraints

## Code Style
- TypeScript strict mode. No `any` unless unavoidable (and commented why).
- All public API must be exported from each package's `src/index.ts` with both value and type exports.
- `@semant/react` re-exports all of `@semant/core` so users can import everything from one place.
- Components use named exports, not default exports.

## Architecture Rules
- `@semant/core` has **zero dependencies** and **no framework imports**. Pure JavaScript only.
- `packages/core/src/outputs/` files are **pure functions** — no side effects. Input: `SemanticPage`. Output: string.
- `packages/core/src/store.ts` owns the store. `packages/core/src/types.ts` owns all type definitions.
- Reference components in `packages/react/src/components/` must use `useSemantic()` — they are examples of the hook pattern, not special-cased.
- `SemanticField` uses open `constraints: Record<string, unknown>` — never add fixed fields like `options`, `min`, `max` to the interface.
- The store does not validate commands. Validation is the developer's responsibility.

## Adding Components
- Every new reference component needs: domain props, `useSemantic()` registration, default rendering, and `children` render prop for customization.
- `SemanticAction` uses `render` prop instead of `children` (children is button content).
- Register type and props export in `packages/react/src/index.ts`.

## Adding Output Formats
- New output format = new file in `packages/core/src/outputs/`. Pure function signature: `(page: SemanticPage, options?) => string`.
- Export from `packages/core/src/index.ts`.

## Adding Framework Adapters
- New adapter = new package in `packages/`. Thin wrapper around `@semant/core`'s `SemanticStore`.
- Follow `@semant/react` as the reference implementation.

## Testing
- No test framework set up yet. When added: test outputs as pure functions first (easiest), then store logic, then component registration lifecycle.

## Git
- Conventional-ish commits. Keep them descriptive.
- `main` branch is the trunk.

## Doc Sync
- If you change the public API surface (new exports, changed props), update README.md API tables.
- If you change the command protocol in `SemanticStore.execute()`, update the README Commands section.
