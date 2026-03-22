# ADR-001: Website MVP Scope and Architecture

**Status:** Accepted
**Date:** 2026-03-22

## Context

Three design documents (website-overview, page-layout, doc-design) define the full vision for semant.dev — a landing page with four interactive demo scenes, comprehensive documentation with five types of interactive elements, and a shared dual-face design language.

The full vision is substantial. semant is in v0.1 (protocol design phase), so the website MVP must ship fast while preserving the core "wow" moment: AI operating a real web page via text commands.

## Decisions

### 1. Four demo scenes — all four ship in MVP

The four scenes (Medium/GEO, Google Maps/Deep Research, Booking.com/Agentic, Shopify/Structured Data) each target a distinct audience. Cutting scenes means losing audience segments. All four ship.

### 2. Landing page: 3 screens, not 6

MVP ships Hero + Demo + CTA. The three deferred screens (Token Economics, Developer Preview, Output Formats) move to Phase 2. The demo area already demonstrates token reduction and output formats implicitly.

### 3. Documentation: 5 pages, not 17

MVP docs: Home (mini demo), Why semant, Quick Start, Wrap Your Own Component, API Reference. Remaining pages (Core Concepts x4, Guides x4, Why This Way x4) ship in Phase 2 after user feedback.

### 4. npm workspaces, not Turborepo

Current repo already uses npm workspaces. Turborepo adds orchestration overhead with no benefit at this scale (2 packages + 1 example + 1 website). Revisit when build times become a problem.

### 5. No `@semant/doc-components` package

Interactive documentation components (Playground, Terminal, Field Explorer, etc.) live inside the `website/` directory. No separate package until there is proven external demand for reuse.

### 6. Website in the same monorepo

The website imports `@semant/react` directly from the monorepo. Changes to the core protocol are immediately testable in the website. No cross-repo sync overhead.

### 7. npm publish deferred past Phase 1

`@semant/core` and `@semant/react` APIs are still evolving (v0.1). Publishing to npm before stabilization creates breaking-change churn. Phase 1 focuses on landing page + docs. npm publish happens after API freeze.

## Consequences

- Phase 1 is scoped to: website (3-screen landing + 5-page docs) + 4 demo scenes
- `website/` directory will be added to monorepo workspaces
- No npm packages are published until Phase 2+
- The three deferred landing screens and 12 deferred doc pages become Phase 2 backlog
- Turborepo and doc-components extraction are revisit-when-needed items, not planned work
