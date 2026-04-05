# Design System Overhaul: Monochrome + Warmth

**Date:** 2026-04-02
**Status:** Approved
**Branch:** exp_2

## Summary

Replace the generic blue/orange theme with a monochrome zinc palette inspired by Linear, Resend, and Nike/Adidas minimalism. CSS-level changes only — no layout, HTML structure, or JS behavior changes. Zero score degradation.

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Palette direction | Monochrome + Warmth (option C) | Nike confidence in type + Resend/Linear surfaces + warm-white CTA accent. No brand color. |
| Typography aggression | Mixed (option C) | Hero gets full Nike editorial (uppercase, 800wt, -0.03em). Inner sections stay Linear-precise (mixed case, 600wt, -0.02em). |
| CTA hover behavior | Resend-style invert (option A) | Glass fills to solid white, text flips to black. Clean, no scale gimmicks. |

## Color Token Changes

### Removed
- `--accent: #6B7AED` (blue-purple) — fully removed
- `--accent-light: #8DA0FF` — fully removed
- `--data-cyan: #7FCFFF` — removed or replaced with neutral
- All blue/green radial gradients on body background
- All orange-tinted accents or borders

### Changed
| Token | Old | New |
|-------|-----|-----|
| `--background` | `#0C0C0E` | `#09090B` |
| `--foreground` | `#EDEDEF` | `#FAFAFA` |
| `--muted-foreground` | `#6B7280` | `#71717A` |
| `--card` | `rgba(255,255,255,0.03)` | `#111113` |
| `--border` | `rgba(255,255,255,0.06)` | `rgba(255,255,255,0.06)` (same value, no color tint) |
| `--secondary` | `#141416` | `#1C1C1F` |

### Preserved (functional colors)
- `--success: #2DDC8F` — kept for positive indicators
- `--warning: #F3B24E` — kept for caution states
- `--destructive: #EF4444` — kept for error states

### New
- `--surface-elevated: #1C1C1F` — for raised cards/controls
- No `--accent` replacement. White serves as the action color.

## Body Background

**Kill:**
```css
/* OLD — remove entirely */
background:
  radial-gradient(ellipse 60% 45% at 50% 0%, rgba(107,122,237,0.07), transparent 70%),
  radial-gradient(ellipse 40% 30% at 80% 60%, rgba(45,220,143,0.025), transparent 70%),
  radial-gradient(ellipse 35% 25% at 15% 80%, rgba(107,122,237,0.03), transparent 70%),
  #0C0C0E;
```

**Replace:**
```css
/* NEW — single neutral glow */
background:
  radial-gradient(ellipse 60% 45% at 50% 0%, rgba(161,161,170,0.04), transparent 70%),
  #09090B;
```

## Typography System

### Hero Section (Nike Editorial)
- Font weight: 800
- Letter spacing: -0.03em
- Text transform: uppercase
- Line height: 1.0
- Gradient text: `linear-gradient(180deg, #fff 20%, #a1a1aa 100%)` with `-webkit-background-clip: text`

### Section Headings (Linear Precision)
- Font weight: 600
- Letter spacing: -0.02em
- Text transform: none (mixed case)
- Line height: 1.2
- Gradient text: `linear-gradient(180deg, #ededed 0%, #a1a1a1 100%)`

### Body Text
- Color: `#71717A` (muted) or `#a1a1aa` (secondary)
- Font size: 15-16px
- Line height: 1.6

## Button System

### Primary CTA
```css
/* Default state — glass */
background: linear-gradient(104deg, rgba(253,253,253,0.05) 5%, rgba(240,240,228,0.1) 100%);
border: 1px solid rgba(255,255,255,0.1);
color: #fff;
font-weight: 700;
text-transform: uppercase;
letter-spacing: 0.02em;
border-radius: 10px;
backdrop-filter: blur(12px);

/* Hover state — Resend invert */
background: #fafafa;
color: #09090b;
border-color: #fafafa;
```

### Secondary
```css
background: transparent;
border: 1px solid rgba(255,255,255,0.1);
color: #a1a1aa;
border-radius: 10px;
```

### Ghost
```css
background: none;
border: none;
color: #a1a1aa;
/* Arrow suffix: → */
```

## Card Surfaces

All cards use the existing `.surface-card` pattern but with updated tokens:
```css
.surface-card {
  background: #111113;
  border: 1px solid rgba(255,255,255,0.04);
  border-top: 1px solid rgba(255,255,255,0.06);
  border-radius: 16px;
}
```

Progress bars change from accent-colored to neutral white gradient:
```css
/* OLD */
background: linear-gradient(90deg, var(--accent), var(--accent-light));

/* NEW */
background: linear-gradient(90deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1));
```

## Section Dividers (Resend-style)

Replace hard borders between sections with subtle gradient lines:
```css
/* Centered gradient line */
.section-divider {
  height: 1px;
  background: rgba(255,255,255,0.06);
  position: relative;
}
.section-divider::after {
  content: "";
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(161,161,170,0.4), transparent);
}
```

## Gate Panel (Signup Section)

```css
/* OLD — accent-tinted */
border: 1px solid rgba(107,122,237,0.18);

/* NEW — neutral */
border: 1px solid rgba(255,255,255,0.08);
background: linear-gradient(180deg, #141418, #111113);
```

## Surface Hierarchy (complete)

The full tonal layering system, updated from the current Stitch-imported values:

| Level | Old | New | Usage |
|-------|-----|-----|-------|
| `--background` | `#0C0C0E` | `#09090B` | Page background |
| `.surface-inset` | `#0e0e10` | `#0C0C0E` | Recessed content inside cards |
| `.surface-card-muted` | `#111113` | `#111113` | Muted cards (unchanged) |
| `.surface-card` | `#131315` | `#131315` | Primary cards (unchanged) |
| `--card` variable | `rgba(255,255,255,0.03)` | `#131315` | Aligned with .surface-card |
| `.surface-control` | `#141416` | `#1C1C1F` | Interactive controls |
| `--secondary` | `#141416` | `#1C1C1F` | Elevated surfaces |

## globals.css Accent Cleanup (comprehensive)

All accent-colored references in globals.css that must be neutralized:

| Line area | What | Old value | New value |
|-----------|------|-----------|-----------|
| `:root` tokens | `--accent`, `--accent-light`, `--data-cyan` | `#6B7AED`, `#8DA0FF`, `#7FCFFF` | Remove entirely |
| `.hero-gradient-word` | Gradient using `#6B7AED` | Blue gradient | `linear-gradient(180deg, #fff 20%, #a1a1aa 100%)` |
| `.locked-peek::after` | Shimmer overlay | `rgba(94,106,210,0.1)` | `rgba(161,161,170,0.06)` |
| `.section-fade-top` | Scan-line divider using `var(--accent)` | Accent-colored | Replace with neutral gradient or remove |
| Focus rings | `focus-visible` outlines | `var(--accent)` | `rgba(255,255,255,0.3)` |
| Input focus | Border color on focus | `var(--accent)` | `rgba(255,255,255,0.2)` |
| Scrollbar thumb | `::-webkit-scrollbar-thumb` | `rgba(94,106,210,0.18)` | `rgba(255,255,255,0.1)` |
| Utility classes | `.text-accent`, `.bg-accent`, `.border-accent` etc. | Reference `--accent` | Remap to white/neutral or remove if unused |

## Scope of Changes

### Files to modify

**Core styling:**
1. `src/app/globals.css` — tokens, body bg, surface classes, gate-panel, focus rings, scrollbar, hero-gradient-word, locked-peek, section-fade-top, utility classes

**Landing components — typography & headings:**
2. `src/components/landing/HeroSection.tsx` — uppercase, tracking, gradient text
3. `src/components/landing/ProblemSection.tsx` — heading gradient text
4. `src/components/landing/SystemSection.tsx` — heading gradient text
5. `src/components/landing/InsightPatternsSection.tsx` — heading gradient text
6. `src/components/landing/CTASection.tsx` — button styling

**Landing components — accent color references:**
7. `src/components/landing/SignupGateSection.tsx` — border/background token swap
8. `src/components/landing/NavBar.tsx` — any accent-colored elements
9. `src/components/landing/RankSection.tsx` — accent references
10. `src/components/landing/rank/RankForm.tsx` — button/input accent colors
11. `src/components/landing/rank/RankResult.tsx` — progress bars, accent highlights
12. `src/components/landing/rank/GhostTierPreview.tsx` — hardcoded `#6B7AED` bar colors
13. `src/components/landing/AthleteScoreCard.tsx` — progress bar color
14. `src/components/landing/DiagnosticCard.tsx` — `var(--accent)` dot indicators and carousel pips
15. `src/components/landing/ModeSelector.tsx` — `var(--accent)` selected-state background
16. `src/components/landing/FAQSection.tsx` — `var(--accent)` colored text span

**Outside landing directory:**
17. `src/components/welcome/WelcomePage.tsx` — `var(--accent)` in progress bar gradients
18. `src/app/icon.svg` — hardcoded `#6B7AED` throughout (app favicon)

**Intentionally excluded:**
- `src/lib/email.ts` — hardcodes `#6B7AED` in inline HTML email styles, but email templates render remotely and don't use CSS variables. Will address in a separate email-template pass if needed.

### Files NOT modified
- `landingFlow.ts` / `landingFlow.test.ts` — business logic untouched
- `analytics.ts` / `posthog.ts` — tracking untouched
- `layout.tsx` — structure untouched
- `page.tsx` — composition untouched

## Score Preservation

- All changes are CSS custom properties + Tailwind class swaps
- Same HTML structure and semantic elements
- Contrast ratios improve: zinc-50 (#FAFAFA) on zinc-950 (#09090B) = 19.4:1 (exceeds WCAG AAA)
- No new dependencies
- No layout shifts or CLS impact
- Functional colors preserved for data visualization and status indicators
- Focus states explicitly updated to neutral — no broken outlines from removed `--accent`
