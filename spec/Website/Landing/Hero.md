# Hero Section

## Concept

The entire first screen is a canvas of real UI components scattered across the page — a calendar, a dropdown, a map pin list, a cart button, a search box, a star rating. Each component cycles between two faces: **the human UI (front) and the AI semantic description (back)**.

Components flip at staggered intervals, creating a wave-like breathing effect — the whole canvas pulses between "human world" and "AI world."

In the gaps between components, faint DOM code fragments serve as background texture — `<div class="flex items-center justify-between px-4 py-2 bg-white ...">` — nearly invisible, conveying: *this is what AI faces today — meaningless class names.*

The semant logo and tagline sit at center, acting as visual anchor without blocking components.

## Layout

```
┌──────────────────────────────────────────────────────┐
│  (background: faint DOM code fragments, like noise)    │
│                                                        │
│    ┌──────────┐                    ┌──────────┐        │
│    │ ★★★★½    │                    │ Search   │        │
│    │ 4.7 (328)│      semant       │ [🔍    ] │        │
│    └──────────┘                    └──────────┘        │
│                   The web that AI                      │
│  ┌──────────────┐  can operate    ┌─────┐ ┌─────┐     │
│  │ Mar 21 22 23 │                 │  S  │ │  M  │     │
│  │  24  25  26  │                 │  L  │ │ XL  │     │
│  └──────────────┘                 └─────┘ └─────┘     │
│                    ┌──────────────┐                    │
│  ┌──────────┐      │ [Add to Cart]│   ┌────────────┐  │
│  │ 6:00 PM  │      └──────────────┘   │ Nōri       │  │
│  │ 6:30 PM  │                         │ Japanese $ │  │
│  │ 7:00 PM ●│                         └────────────┘  │
│  └──────────┘                                         │
│                  [ See it in action ↓ ]                │
└──────────────────────────────────────────────────────┘
```

### Flip Example

```
Front (human):           Back (AI):
┌──────────┐            ┌──────────────────┐
│ ★★★★½    │    ↔       │ [Info: rating]   │
│ 4.7 (328)│            │  value: 4.7      │
└──────────┘            │  count: 328      │
                        └──────────────────┘
```

## Component-to-Demo Mapping

Hero components are fragments from the four demo scenes. Clicking a component smooth-scrolls to its demo tab.

| Hero Component | Source Demo |
|---------------|-------------|
| Star rating + review count | Medium (GEO) or Shopify |
| Calendar grid | Booking.com (Agentic) |
| Search box | Google Maps (Deep Research) |
| Size selector S/M/L/XL | Shopify (Structured Data) |
| Time slots 6:00/6:30/7:00 | Booking.com (Agentic) |
| Add to Cart button | Shopify (Structured Data) |
| Restaurant name + tags | Google Maps (Deep Research) |

## Interaction Rules

- **Auto-flip**: 3-5 second cycle per component, start times randomly staggered. Limit to 1-2 components flipping simultaneously to avoid visual noise.
- **Hover**: Pauses the component's flip, locks on AI face — implies "you can see underneath."
- **Click**: Smooth-scrolls to the corresponding demo tab.
- **CTA button**: "See it in action ↓" scrolls to demo area.

## Visual References

- Component layout rhythm: Linear landing page style
- Flip effect: CSS 3D transform, restrained — tilt + crossfade rather than full 180° rotation
- Background DOM fragments: Matrix code rain aesthetic, but extremely faint and slow — texture, not animation
