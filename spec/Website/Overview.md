# Website Overview

## Site Architecture

One domain, three areas:

```
semant.dev
├── /                 ← Landing Page (showcase + interactive demo)
├── /docs             ← Documentation (interactive, journey-based)
└── /playground       ← Playground (deferred to Phase 3)
```

Landing is the pitch. Docs is retention and conversion. Both share design language but have different rhythms — Landing is performance, Docs is utility.

## User Journey

```
Twitter/HN link → Landing Page
  → Hero: component collage catches attention
    → Demo area: interact with four real scenarios
      → Impressed → clicks "Docs" or "npm install"
        → Quick Start: running in 5 minutes
          → Using semant in their own project
```

## Tech Stack

- **Monorepo**: Same repo as `@semant/core` and `@semant/react`, using npm workspaces
- **Website directory**: `website/` at repo root, added to workspaces
- **Framework**: Vite + React + React Router for both Landing and Docs (single SPA)
- **Deployment**: GitHub Pages via GitHub Actions (auto-deploys on push to main)
- **No Turborepo** — npm workspaces is sufficient at current scale (see ADR-001)
- **No `@semant/doc-components`** — interactive components live in `website/` (see ADR-001)

### Directory Structure

```
semant/
├── packages/core/
├── packages/react/
├── examples/restaurant-booking/
├── .github/workflows/deploy.yml ← GitHub Pages CI/CD
├── website/                     ← Vite + React + React Router
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts           ← base: "/Semant/" for GitHub Pages
│   └── src/
│       ├── main.tsx
│       ├── App.tsx              ← BrowserRouter with Landing + Docs routes
│       ├── index.css            ← Design tokens as CSS vars
│       ├── pages/
│       │   ├── Landing.tsx      ← 3-screen landing (nav + hero + demo + CTA)
│       │   └── docs/            ← 5 MVP doc pages (TSX, not MDX)
│       │       ├── DocsHome.tsx, Why.tsx, QuickStart.tsx
│       │       ├── WrapComponent.tsx, ApiReference.tsx
│       └── components/
│           ├── demo/            ← Demo scene infrastructure
│           │   ├── DemoScene.tsx, AIView.tsx, AgentConsole.tsx
│           │   ├── CommandTerminal.tsx, TokenCounter.tsx, executionLog.ts
│           │   └── scenes/      ← 4 demo scenes
│           │       ├── BookingScene.tsx, MediumScene.tsx
│           │       ├── MapsScene.tsx, ShopifyScene.tsx
│           └── docs/            ← Docs layout components
│               ├── DocsLayout.tsx, Sidebar.tsx
│               ├── PrincipleCallout.tsx, CodeBlock.tsx
└── package.json                 ← workspaces includes "website"
```

## MVP Scope

### Landing Page — 3 screens
1. **Hero** — Logo + tagline + "See it in action" CTA
2. **Interactive Demo** — Four demo scenes with three-column layout (Human View | AI View | Agent Console) + command input + token counter
3. **Manifesto + CTA** — "The page is its own API." + `npm install` + links

Deferred to Phase 2: Token Economics, Developer Preview, Output Formats.

### Documentation — 5 pages
1. Home (mini demo)
2. Why semant
3. Quick Start
4. Wrap Your Own Component (guide)
5. API Reference

Deferred to Phase 2: Core Concepts (x4), remaining Guides (x4), Why This Way (x4).

## Execution Phases

### Phase 1: MVP Launch ✓
- Complete `@semant/core` and `@semant/react` API surface
- Landing page: Hero + Demo (4 scenes) + CTA
- Docs: 5 pages (Home, Why, Quick Start, Wrap Component, API Reference)
- Dogfooding: every page has `window.__semant` with semantic content
- Deploy to GitHub Pages via Actions

### Phase 2: Content Expansion
- Landing: add Token Economics, Developer Preview, Output Formats screens
- Docs: add Core Concepts, remaining Guides, Why This Way sections
- npm publish `@semant/core` + `@semant/react` (after API freeze)

### Phase 3: Polish + Community
- Playground (`/playground`) — free-form experimentation
- Demo video, README polish
- Community launch (HN, Twitter)

## Performance Budget

| Metric | Landing | Docs |
|--------|---------|------|
| First Contentful Paint | < 1.5s | < 1.0s |
| Total JS bundle (gzip) | < 200KB | < 150KB |
| Largest Contentful Paint | < 2.5s | < 2.0s |

Demo scenes lazy-load: only the active tab loads, others preload in background.

## MVP Delivery Checklist

```
waynewangyuxuan.github.io/Semant/
  ✓ Landing: Nav bar + Hero + Demo (4 scenes, 3-column, agent animation) + CTA
  ✓ Docs: Home (mini demo), Why, Quick Start, Wrap Component, API Reference
  ✓ Dogfooding: every page has window.__semant with semantic content
  ✓ Deployed on GitHub Pages via Actions (auto-deploy on push)
```
