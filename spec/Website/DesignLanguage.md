# Design Language

## Dual-Face System

The core visual metaphor: **warm for humans, cold for AI**. This duality runs through every component on both Landing and Docs.

| Dimension | Human Side (warm) | AI Side (cold) |
|-----------|-------------------|----------------|
| Background | `#FAFAF8` warm white | `#0C0C0E` deep black |
| Text | `#1A1A1A` dark gray | `#E8E6E3` light gray |
| Accent | `#2D6A4F` forest green | `#C4F067` neon green |
| Headings | Fraunces (serif) | JetBrains Mono (monospace) |
| Body | DM Sans (sans-serif) | JetBrains Mono (monospace) |
| Border radius | 12-20px (soft) | 6px (sharp) |
| Shadows | Soft, present | None |

## Landing vs Docs Style

| Dimension | Landing Page | Documentation |
|-----------|-------------|---------------|
| Rhythm | Performance. Large whitespace, large type, emotion-driven | Utility. Compact, info-dense, efficiency-driven |
| Animation | Component flips, state flashes, number counters | Minimal. Only Live Playground real-time rendering |
| Info density | One point per screen | Multiple concepts per page, clear hierarchy |
| Scrolling | Full-page scroll, linear narrative | Sidebar navigation, in-page scroll |
| CTAs | "See it live" / "npm install" | "Edit this code" / "Try this command" |

## Global Navigation

Shared top nav bar across Landing and Docs:

```
┌──────────────────────────────────────────────────────┐
│  semant                   [Demo] [Docs] [GitHub] [npm] │
└──────────────────────────────────────────────────────┘
```

- `semant` logo — returns to Landing
- `Demo` — scrolls to Landing demo area (or navigates there)
- `Docs` — enters documentation
- `GitHub` / `npm` — external links

**On Landing:** Nav starts transparent, becomes solid on scroll.
**On Docs:** Nav always solid, sidebar visible.

## Deep Linking Principle

All Landing-to-Docs links go to **specific pages**, never the docs index:

- Demo area → `/docs/quickstart`
- Output Formats tab → `/docs/guides/llmstxt` or `/docs/guides/jsonld`
- Manifesto "Read the Docs" → `/docs/why`

Users should never re-navigate inside docs after arriving from Landing.

## Design Principle Callout

Used on every documentation page — a bordered box at the top explaining the design decision behind that API:

```
┌────────────────────────────────────────────────┐
│ ┃  Design Principle: [Principle Name]           │
│ ┃                                               │
│ ┃  One or two sentences explaining why this     │
│ ┃  API is designed this way. Not philosophy —   │
│ ┃  practical design rationale.                  │
└────────────────────────────────────────────────┘
```

Style: green left border (`--accent`), slightly tinted background, larger font. Keep it to 2-3 lines maximum.
