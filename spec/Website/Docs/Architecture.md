# Documentation Architecture

## Design Principles

1. **Every concept has a live demo next to it.** Code on the left, running result on the right, real-time. Change the code, the output updates. Readers play, not study.

2. **Ideology is embedded, not separated.** No standalone "Philosophy" page. Each API page opens with a Design Principle callout (see `../DesignLanguage.md`) explaining why the API is designed this way.

3. **The docs eat their own dogfood.** Every documentation page has `window.__semant`. Search is `SemanticTextInput` + `SemanticList`. Readers can open DevTools and inspect the page's semantic state.

## Information Architecture

Organized by reader journey, not by technical taxonomy:

```
Home (30s understanding — mini demo)
├── Why semant (motivation + DOM vs semant demo)
├── Quick Start (5 min — minimal working example + live preview)
├── Core Concepts
│   ├── The Mirror Principle (state flow animation)
│   ├── Semantic Fields (field explorer)
│   ├── Command Protocol (embedded terminal)
│   └── Delivery Channels (four-tab output demo)
├── Guides
│   ├── Wrap Your Own Component (3 lines to integrate)
│   ├── Auto-generate llms.txt
│   ├── Auto-generate JSON-LD
│   ├── Set Up window.__semant
│   └── Use with Next.js / Remix / Vite
├── Reference
│   ├── API Reference (every export, full signatures)
│   ├── SemanticField Schema
│   └── Command Syntax
└── Why This Way (exit, not entrance)
    ├── The Web's Missing Layer
    ├── Mirror, Not Engine
    ├── Open Semantics
    └── The Page Is Its Own API
```

## MVP Pages (Phase 1)

| Page | Content | Interactive Element |
|------|---------|-------------------|
| Home | One-line definition + mini demo (one select + AI output) + two buttons | Live Playground |
| Why semant | DOM vs semant comparison | Before/after demo |
| Quick Start | Minimal working example, step-by-step | Live Playground + Terminal |
| Wrap Your Own Component | 3-line integration guide | Live Playground |
| API Reference | Every export with full type signatures | None (static) |

Phase 2 pages: Core Concepts (x4), remaining Guides (x4), Why This Way (x4).

## Home Page Spec

Not a table of contents. It is:
1. One-line definition of semant
2. A mini live demo (single select component + AI text output)
3. Two buttons: "5 min Quick Start" and "Why semant?"

Readers experience semant on the home page before navigating anywhere.

## Tech Stack

- **Framework:** Nextra (Next.js docs) or Fumadocs — both support MDX for embedding React components
- **Editor:** CodeMirror 6 or Sandpack for Live Playground (not Monaco — too heavy at ~2MB)
- **Deployment:** Vercel, under `/docs` path of semant.dev
- **Search:** Built-in framework search (Nextra/Fumadocs provide this)

## Directory Structure (MVP)

```
website/
├── src/                        ← Landing page (Vite + React)
└── docs/
    ├── content/
    │   ├── index.mdx           ← Home (mini demo)
    │   ├── why.mdx             ← Why semant
    │   ├── quickstart.mdx      ← Quick Start
    │   └── guides/
    │       └── wrap-component.mdx
    ├── reference/
    │   └── api.mdx             ← API Reference
    └── components/
        ├── LivePlayground.tsx
        ├── CommandTerminal.tsx
        └── PrincipleCallout.tsx
```
