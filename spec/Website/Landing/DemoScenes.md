# Demo Scenes

## Design Principle

Each demo is a **command-driven showcase** that can be **interrupted by human interaction**. On page load, an agent "types" commands in the terminal — each command executes via `store.execute()`, and the UI updates as a result. This demonstrates the core value: AI operates the page through text, not screenshots. User click cancels the animation; the user can then type their own commands.

## Scene Overview

| # | Capability | Target Product | Target Audience | AI View Format |
|---|-----------|---------------|-----------------|----------------|
| 1 | GEO/SEO Boost | Medium article | SEO/GEO practitioners, content creators | Plain text |
| 2 | Deep Research | Google Maps panel | Technical users, AI researchers | Plain text |
| 3 | Agentic Browsing | Booking.com search | AI agent developers, PMs | Plain text |
| 4 | Structured Data | Shopify product page | E-commerce, SEO practitioners | JSON-LD |

## Scene 1: Medium Article — GEO/SEO Boost

**Message:** "AI search engines can precisely understand and cite your content."

**Components:** SemanticInfo (article metadata), SemanticList (related articles), SemanticAction (bookmark, share, clap)

**Style:** Medium-like — white background, serif headings, generous line height, author avatar + date, tag pills.

**Animation cycle:** Semantic tags highlight sequentially in AI view — title → author → summary → related articles. Demonstrates: AI extracts every structured field precisely, not just "understanding" the page.

**AI view sample:**
```
[Article: "Why Component-Level Semantics Will Replace Schema.org"]
  author: Wayne Zhang | published: 2026-03-21
  tags: [web development, AI, semantic web]
[List: Related Articles] count: 3
[Action: bookmark_article] [Action: share_article]
```

## Scene 2: Google Maps — Deep Research

**Message:** "AI agents can efficiently perform complex multi-step search and filtering via text."

**Components:** SemanticTextInput (search query), SemanticSelect (cuisine, price, rating), SemanticList (results), SemanticAction (select, next page)

**Style:** Google Maps left panel — white with shadow, search box, filter pills, result cards with ratings.

**Animation cycle:** Search box types "ramen near me" → cuisine filter changes to "Japanese" → price to "$$" → results update → first result selected → reset.

**AI view sample:**
```
[Form: Location Search]
  [Text: query] current: "ramen near me"
  [Select: cuisine] current: "Japanese"
  [Select: price] current: "$$"
[List: Search Results] count: 3
  1. Menya Ultra — ★4.6 (892) — 0.3 mi — $$
## Commands: set query, set cuisine, set price, select_result, next_page
```

## Scene 3: Booking.com — Agentic Browsing

**Message:** "The date picker that breaks every AI agent? One text command."

**Components:** SemanticTextInput (destination), SemanticDatePicker (check-in, check-out), SemanticSelect (guests, rooms), SemanticAction (search, book), SemanticList (hotel results)

**Style:** Booking.com — deep blue `#003580`, white form cards, compact layout, calendar component.

**Animation cycle:** Destination types "San Diego, CA" → date picker selects check-in/check-out (emphasize: agents fail on 24px calendar cells) → guests=2, rooms=1 → search → hotel result appears → book → reset.

**AI view sample:**
```
[Form: Hotel Search]
  [Text: destination] current: "San Diego, CA"
  [Date: check_in] current: "2026-04-15"
  [Date: check_out] current: "2026-04-18"
  # No vision model needed. Just: set check_in 2026-04-15
[Action: search_hotels] enabled: true
## Commands: set destination, set check_in <YYYY-MM-DD>, search_hotels, book_hotel
```

## Scene 4: Shopify Product Page — Structured Data

**Message:** "Structured data auto-generated from component state. Zero manual maintenance."

**Components:** SemanticInfo (product name, price, SKU, brand, rating), SemanticSelect (color, size), SemanticTextInput (quantity), SemanticAction (add to cart)

**Style:** Shopify default theme — clean commercial feel, product image placeholder, specs selector, quantity stepper, large Add to Cart button.

**Animation cycle:** Color switches "Black" → "Forest Green" → size "M" → "L" → quantity 1 → 2 → JSON-LD view updates in real-time showing synced `color`, `size`, `offers.price` fields → Add to Cart flashes → reset.

**AI view sample (JSON-LD, not plain text):**
```json
{
  "@type": "Product",
  "name": "Merino Wool Crewneck",
  "color": "Forest Green",       // ← live, synced with UI
  "size": "L",                   // ← live, synced with UI
  "offers": { "price": 98.00, "availability": "InStock" },
  "aggregateRating": { "ratingValue": 4.6, "reviewCount": 284 }
}
```

## Demo Area Layout

```
┌──────────────────────────────────────────────────────────────┐
│ [GEO/SEO]  [Deep Research]  [Agentic]  [Structured Data]     │ ← tabs
├────────────────┬─────────────────┬───────────────────────────┤
│  HUMAN VIEW    │  AI VIEW        │  AGENT CONSOLE            │
│  (product UI,  │  (toPlainText   │  (terminal-style log of   │
│   interactive) │   + syntax      │   executed commands with   │
│                │   coloring,     │   results)                │
│                │   values flash  │                           │
│                │   on change)    │  agent $ set check_in ... │
│                │                 │  → set check_in = ...     │
├────────────────┴─────────────────┴───────────────────────────┤
│  $ set check_in 2026-04-15                               [↵] │ ← input only
├──────────────────────────────────────────────────────────────┤
│  Raw DOM: 93,847 → semant: 712 tokens              (131×)   │ ← token counter
└──────────────────────────────────────────────────────────────┘
```

- Three-column layout: Human View | AI View (plaintext) | Agent Console
- AI View uses `toPlainText()` output with syntax coloring — shows what agents actually read
- Agent Console shows command execution flow in terminal style (separate from AI View)
- Animation is command-driven: agent "types" commands in terminal, executes via `store.execute()`, UI updates as result. Runs once on page load, stops after completing the sequence.
- Bottom bar is input-only — user can type commands manually
- Token counter: numbers must be verifiable from real DOM measurements
