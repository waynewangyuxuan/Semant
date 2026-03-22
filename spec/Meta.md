# semant — Project Spec
> Semantic protocol for AI-readable, AI-operable web pages.
**Documents**: 0 | **Subfolders**: 3

## Context Injection Guide
| Task Scenario | Read These Files | Lines |
|---------------|------------------|-------|
| Understand the product and protocol | `Core/Product.md` | ~90 |
| Add a new reference component | `Core/Technical.md`, `Core/Regulation.md`, any existing component in `packages/react/src/components/` | ~120 |
| Add a new output format | `Core/Product.md` (four channels), `Core/Technical.md`, `packages/core/src/outputs/plaintext.ts` as reference | ~130 |
| Modify the core store or types | `Core/Product.md`, `Core/Technical.md`, `Core/Regulation.md` | ~150 |
| Add a framework adapter (Vue, Svelte) | `Core/Product.md`, `Core/Technical.md`, `packages/react/` as reference adapter | ~150 |
| Fix a bug in existing component | `Core/Regulation.md`, the relevant component file | ~60 |
| Build the landing page | `Website/Overview.md`, `Website/Landing/Hero.md`, `Website/Landing/DemoScenes.md`, `Website/DesignLanguage.md` | ~430 |
| Build the documentation site | `Website/Overview.md`, `Website/Docs/Architecture.md`, `Website/Docs/InteractiveElements.md` | ~340 |
| Understand a past architecture decision | `Decisions/ADR-001-website-scope.md` | ~55 |

## Subfolders
| Folder | Purpose | Start With |
|--------|---------|------------|
| Core/ | Product definition, technical architecture, development constraints | `Core/Product.md` |
| Website/ | Landing page, documentation, design language specifications | `Website/Meta.md` |
| Decisions/ | Architecture Decision Records | `ADR-001-website-scope.md` |
