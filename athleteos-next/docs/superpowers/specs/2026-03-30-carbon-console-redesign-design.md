# Carbon System Console Redesign

## Problem

The landing page is structurally clean but visually template-derived. It lacks the tension, atmosphere, and product-grade framing of a $30k custom site. Hybrid users are invisible until too late. The hero explains too little visually — users see "calculator" before "system." Glassmorphism, glow effects, and decorative gradients undermine the technical authority the product needs.

## Solution

Three changes shipped together:

1. **Visual overhaul** — strip glassmorphism/glow, replace with carbon system console aesthetic (edge-lit surfaces, sharp borders, metallic highlights)
2. **Entry flow** — move the existing Gym / Hybrid toggle into the hero so both audiences are recognized in the first viewport
3. **System language** — define and enforce one visual grammar for surfaces, typography, buttons, modules, and motion

---

## A. Visual Foundation

### Palette

| Token | Value | Notes |
|-------|-------|-------|
| `--background` | `#0C0C0E` | Warmer graphite (was `#050506`) |
| `--foreground` | `#EDEDEF` | Unchanged |
| `--muted-foreground` | `#6B7280` | Cooler gray (was `#8A8F98`) |
| `--secondary` | `#141416` | Card surface base |
| `--accent` | `#6B7AED` | Cooler blue, less purple (was `#5E6AD2`) |
| `--accent-light` | `#8DA0FF` | Was `#8B93E0` |
| `--card` | `rgba(255,255,255,0.03)` | Was `0.04` |
| `--border` | `rgba(255,255,255,0.06)` | Was `0.08` |

### Surface Hierarchy

| Class | Background | Border | Top Edge | Use |
|-------|-----------|--------|----------|-----|
| `surface-card` | `#141416` | `rgba(255,255,255,0.06)` | `border-top: 1px solid rgba(255,255,255,0.08)` | Primary cards, form container, result panels |
| `surface-card-muted` | `#111113` | `rgba(255,255,255,0.04)` | none | Nested sub-panels within cards |
| `surface-input` | `#0F0F11` | `rgba(255,255,255,0.06)` | none | Form inputs. Focus: `border-color: var(--accent)`, no glow ring, no bg change |
| `surface-control` | `#141416` | `rgba(255,255,255,0.08)` | none | Mode selector, toggle controls |
| `surface-divider` | n/a | `1px solid rgba(255,255,255,0.06)` | n/a | Section separators |

Hover on `surface-card`: `border-color: rgba(107,122,237,0.3)`. No glow, no shadow change.

All surface classes use `border-radius: 8px` except `surface-input` which uses `6px`.

### Typography

| Role | Family | Weight | Size | Tracking | Case |
|------|--------|--------|------|----------|------|
| Display heading | Jakarta | 700 | 2.5–3.5rem | -0.02em | Sentence |
| Section heading | Jakarta | 700 | 1.5–2rem | -0.01em | Sentence |
| Body | Inter | 400 | 1rem | 0 | Sentence |
| System label | JetBrains Mono | 500 | 0.6875rem | 0.12em | UPPERCASE |
| Numeric output | JetBrains Mono | 700 | varies | 0 | — |
| Data value | JetBrains Mono | 400 | 0.875rem | 0.02em | — |

Update `.font-mono-label` class: change `letter-spacing` from `0.08em` to `0.12em`.

### Button Hierarchy

| Level | Background | Border | Text | Shadow | Hover |
|-------|-----------|--------|------|--------|-------|
| Primary | accent solid | none | white | `0 1px 2px rgba(0,0,0,0.4)` | bg lighten 10% |
| Secondary | transparent | 1px accent | accent | none | bg `rgba(107,122,237,0.08)` |
| Tertiary | none | none | accent | none | underline |

No `active:scale` on any button. No shine sweep. No glow pulse.

### Background

- Body: solid `#0C0C0E` with one faint radial: `radial-gradient(ellipse 50% 40% at 50% 0%, rgba(107,122,237,0.04), transparent)`
- Grid overlay: `rgba(255,255,255,0.03)` lines, overall opacity `0.08` (changed from `0.18`)
- Grid lines change from accent-tinted (`rgba(94,106,210,0.06)`) to neutral gray
- Remove: rotating conic gradient, animated `--grad-angle`, noise texture (`grid-bg::after`)
- Remove: `@keyframes gradientRotate`

### Section Dividers

Replace `.section-fade-top`:
- `::before`: single `1px solid rgba(255,255,255,0.06)` line. No gradient, no blur.
- Remove `::after` breathing gradient entirely.

### Effects Removed

| Effect | Class/Keyframe |
|--------|---------------|
| Glow utilities | `.glow-accent`, `.glow-success`, `.glow-accent-pulse`, `@keyframes glowPulse` |
| Button shine | `.btn-shine` |
| Glass card | `.glass-card` |
| Gradient border | `.gradient-border` |
| Gradient text headline | `.gradient-text-headline` |
| Gradient text accent | `.gradient-text-accent` |
| Result reveal burst | `.reveal-burst`, `@keyframes revealBurst` |
| Noise overlay | `.grid-bg::after` SVG feTurbulence |
| Gate appear | `@keyframes gateAppear` |
| Legacy animations | `@keyframes ctaSweep`, `@keyframes signalSweep`, `@keyframes pulseGlow`, `.animate-pulse-glow` |
| Orbit pulse | `.signal-dot` animation, `@keyframes orbitPulse` |

**Keep:** `.hero-gradient-word` (gradient on "stuck" only), `.locked-peek` shimmer (accent-tinted sweep for locked cards), `@keyframes peekSweep`.

---

## B. Entry Flow: Mode Selector

### Architectural Decision: Mode Selector Lives in the Hero

The mode selector MUST be visible in the first viewport, before any scroll. This is the core product-positioning requirement: hybrid users must feel recognized in the first 5 seconds.

**Implementation:** `page.tsx` becomes a Client Component (add `'use client'`). Mode state lives in `page.tsx` and is passed down to both `HeroSection` (which renders the ModeSelector) and `RankSection` (which adapts the form and preview).

The hero renders:
1. Headline
2. Subline
3. **ModeSelector** (Gym / Hybrid)
4. CTA button

The CTA scrolls to `#rank` where the form is pre-configured to the selected mode. Changing mode in the hero also changes mode in the form below (single source of truth).

### New Component: `ModeSelector.tsx`

Two-segment control. Rendered in HeroSection, directly below the subline.

**Type:**
```typescript
type AthleteMode = 'gym' | 'hybrid'
```

**Modes and their input fields:**
- **Gym** — bodyweight, squat (weight×reps), bench (weight×reps), deadlift (weight×reps)
- **Hybrid** — bodyweight, squat (weight×reps), deadlift (weight×reps), 5K time (min:sec)
  - Bench is intentionally dropped. Hybrid mode measures strength-endurance balance, not full powerlifting total. The form shows a muted note: "Hybrid mode measures squat + deadlift strength against endurance."

**Visual treatment:**
- Container: `surface-control` class, `border-radius: 6px`, `display: inline-flex`
- Two segments, equal width (~120px each)
- Active segment: accent bg (`var(--accent)`), white text, 2px accent bottom border (both applied)
- Inactive segment: transparent bg, `var(--muted-foreground)` text
- Segment transition: 200ms bg/color/border-color change
- The content panel below (in RankSection) transitions separately at 240ms (see Motion Spec)

**Accessibility:**
- `role="radiogroup"` on container, `role="radio"` on each segment
- `aria-checked` on active segment
- Arrow keys navigate between segments
- `tabindex="0"` on active, `tabindex="-1"` on inactive

**Mobile (< 640px):**
- Segments remain in a single row, no change needed for two segments

**Behavior:**
- Mode state lives in `page.tsx` (Client Component), passed as prop to HeroSection and RankSection
- Mode switch resets form fields and clears any existing result
- Ghost preview labels swap per mode:
  - Gym: "Strength Signal · Squat · Bench · Deadlift"
  - Hybrid: "Strength Signal · Endurance Signal · Balance Ratio"

### Hybrid Mode Changes

**Breaking change:** Hybrid mode drops bench press. Current behavior includes all 3 lifts + 5K. New behavior: squat + deadlift + 5K.

**Rationale:** Hybrid athletes care about strength-endurance balance, not full powerlifting total. Bench is the least relevant lift for hybrid athletes who typically prioritize compound lower-body strength + running capacity.

**`calculateRank` update:** When `trainingType === 'hybrid'`, compute only squat + deadlift percentiles (skip bench). Overall percentile averages squat + deadlift + run5k (3 metrics, not 4).

---

## C. Result Module Hierarchy

### Module mapping per mode

| Module Slot | Gym | Hybrid |
|------------|-----|--------|
| Primary Signal | Percentile + weight class + tier | Percentile + weight class + tier |
| System Efficiency | Efficiency % + strength age | Efficiency % + strength age |
| Primary Constraint | Weakest lift callout | Weakest metric (lift or run) |
| Next Threshold | kg to next bracket (weakest lift) | kg or seconds to next bracket |
| System Read | Performance preview text | Performance preview text |
| Locked System Read | Blurred deeper analysis | Blurred deeper analysis |

### Visual treatment per module

| Module | Label style | Container | Border |
|--------|-----------|-----------|--------|
| Primary Signal | system-label, accent color | `surface-card` | standard |
| System Efficiency | system-label, muted | `surface-card-muted` | standard |
| Primary Constraint | system-label, muted | `surface-card-muted` | standard |
| Next Threshold | system-label, accent | `surface-card-muted` | `border-left: 2px solid var(--accent)` |
| System Read | system-label, muted | `surface-card-muted` | standard |
| Locked System Read | system-label, muted | `surface-card-muted` | standard, content `filter: blur(4px)` |

Spacing: 12px gap between modules. Module padding: 14px.

### Conversion-State Visibility Matrix

Every module has one of four visibility states. This matrix defines exactly what the user sees before and after signup.

| Module | Pre-calculation | Post-calculation (free) | Locked (pre-signup) | Post-signup |
|--------|----------------|------------------------|--------------------:|-------------|
| Primary Signal | Hidden | **Visible** — full percentile, tier, weight class | Visible (unchanged) | Visible |
| System Efficiency | Hidden | **Visible** — full efficiency %, strength age | Visible (unchanged) | Visible |
| Primary Constraint | Hidden | **Visible** — weakest metric name + gap size | Visible (unchanged) | Visible |
| Next Threshold | Hidden | **Visible** — exact kg/seconds to next bracket | Visible (unchanged) | Visible |
| System Read | Hidden | **Partially visible** — first sentence only, rest blurred | First sentence visible, rest `filter: blur(4px)` | Full text visible |
| Locked System Read | Hidden | **Locked** — title visible, content fully blurred | Title + "locked" badge, content `filter: blur(4px)` | Full content visible |
| Share Card | Hidden | **Visible** — share/download before signup gate | Visible | Visible |

**Key rule:** The free layer (Primary Signal through Next Threshold) must be impressive enough to share. The locked layer (System Read, Locked System Read) must be specific enough to create "I need to see this." The transition from free to locked should feel like a natural depth boundary, not a paywall slap.

---

## D. Motion Spec

### Transitions

| Transition | Duration | Easing | Enter | Exit |
|-----------|----------|--------|-------|------|
| Fade | 180ms | ease-out | opacity 0→1 | opacity 1→0 |
| Mode switch panel | 240ms | EASE_OUT | opacity 0→1, y 8→0 | opacity 1→0 (same duration) |
| Section reveal | 300ms | EASE_OUT | opacity 0→1, y 12→0 | n/a (once) |
| Form→Result | 320ms | EASE_OUT | opacity 0→1, y 12→0 | opacity 1→0, y 0→-8 |
| Hover states | 150ms | ease | — | — |

EASE_OUT = `[0.16, 1, 0.3, 1]` (existing constant in `motion.ts`, unchanged).

### `motion.ts` updates

```typescript
export const DURATION = {
  fast: 0.18,    // was 0.15
  normal: 0.24,  // was 0.25
  slow: 0.3,     // was 0.4
  enter: 0.32,   // was 0.55
} as const
// Remove 'hero' key entirely
```

Remove `STAGGER` and `STAGGER_ITEM` exports. Hero text renders without stagger animation.

Update `fadeUp` helper: change `y: 20` to `y: 12`, use `DURATION.enter` (now 0.32s).

### `useMotionSafe` behavior

When `reduced` is true:
- All `initial` props return `false` (skip entrance animation, render final state)
- All `animate` props on loops (like the scroll chevron) return `undefined` (no animation)
- AnimatePresence transitions use `duration: 0` (instant swap)
- The `.locked-peek` CSS shimmer is killed by the existing `@media (prefers-reduced-motion)` rule

### Audit for hardcoded durations

After updating `motion.ts`, grep for raw duration values (`duration: 0.`) across all component files. Replace any that don't use `DURATION.*` constants.

---

## E. File Changes

### Modified files

| File | Changes |
|------|---------|
| `globals.css` | Replace all tokens. Strip glow/glass/gradient/noise/orbit classes and keyframes. Add `surface-card`, `surface-card-muted`, `surface-input`, `surface-control`, `surface-divider` classes. Update `.font-mono-label` tracking. Update body bg. Simplify `.section-fade-top`. Simplify grid overlay. Update `.system-input` to `surface-input` styling. Remove `.card-surface`, `.card-surface-secondary`, `.hero-card`, `.gate-panel` glow/blur. Keep `.locked-peek`, `.hero-gradient-word`. |
| `page.tsx` | Add `'use client'`. Add `mode` state (`AthleteMode`). Pass `mode` + `onModeChange` to HeroSection and RankSection. |
| `HeroSection.tsx` | Remove ambient orbs. Remove `useScroll`/`useTransform` parallax. Remove stagger variants. Render static headline + subline + **ModeSelector** + CTA. Accept `mode` and `onModeChange` props. CTA scrolls to `#rank`. |
| `RankSection.tsx` | Accept `mode` prop (no longer owns mode state). Pass mode to `RankForm`, `GhostTierPreview`. Handle form/result per mode. Remove `reveal-burst` class. Update AnimatePresence transitions to 320ms opacity+y. |
| `rank/RankForm.tsx` | Accept `mode` prop. Render different input sets per mode (Gym: BW+3 lifts, Hybrid: BW+squat+deadlift+5K). Remove `glow-accent btn-shine` from submit button. Use `surface-card` for container. Replace training type toggle with mode-aware inputs. |
| `rank/RankResult.tsx` | Remove `gradient-text-accent` → `text-accent`. Remove `glow-success`. Use `surface-card-muted` for sub-panels. Apply module label hierarchy from Section C. |
| `rank/GhostTierPreview.tsx` | Accept `mode` prop. Swap preview labels per mode (Gym vs Hybrid). Replace glass styling with `surface-card`. Remove icon pulse animation. |
| `rank/GlassInput.tsx` | Rename to `SystemInput.tsx`. Update class from `system-input` to `surface-input` styling. Update barrel export in `rank/index.ts`. |
| `AthleteScoreCard.tsx` | Replace `glass-card` → `surface-card`. Replace `gradient-text-accent` → `text-accent`. |
| `LockedPreviewSection.tsx` | Remove `gradient-border`, `gradient-text-headline`. Use `surface-card-muted`. |
| `SignupGateSection.tsx` | Remove `glow-accent-pulse btn-shine`. Primary button style. Remove `.gate-panel` class → use `surface-card` with accent border. |
| `NavBar.tsx` | Remove `glow-accent btn-shine`. Primary button style. |
| `StickyJoinBar.tsx` | Remove `glow-accent btn-shine`. Remove top gradient on bar. Primary button style. |
| `TrustStrip.tsx` | Replace `glass-card` → `surface-card`. Remove dot glow `boxShadow`. |
| `FAQSection.tsx` | Accordion items: replace inline bg/border with `surface-card-muted`. |
| `DiagnosticCard.tsx` | Remove `.signal-dot` animation (static dot). Use `surface-card-muted` for sub-panels. |
| `ComparisonSection.tsx` | Replace `glass-card` → `surface-card`. (File exists but not in page.tsx; content moved to FAQ accordion.) |
| `SystemSection.tsx` | Update `fadeUp` usage (y changes from 20 to 12 automatically via motion.ts). ProductShowcase already integrated. |
| `lib/rankCalc.ts` | Update `calculateRank()` to handle hybrid without bench (squat + deadlift + 5K only). |
| `lib/rankData.ts` | No changes needed. |
| `lib/motion.ts` | Update `DURATION` values. Remove `STAGGER`, `STAGGER_ITEM`. Update `fadeUp` y offset to 12. Remove `hero` duration key. |

### New files

| File | Purpose |
|------|---------|
| `src/components/landing/ModeSelector.tsx` | **NEW** — Two-segment `gym/hybrid` control |
| `src/components/landing/rank/SystemInput.tsx` | **RENAME** from `rank/GlassInput.tsx` — same component, updated class names |

### Existing files (already in codebase, confirmed)

All `rank/*` files exist from a previous extraction: `rank/RankForm.tsx`, `rank/RankResult.tsx`, `rank/GhostTierPreview.tsx`, `rank/GlassInput.tsx`, `rank/index.ts`. These are being modified, not created.

### Files NOT modified (intentionally)

| File | Reason |
|------|--------|
| `RankShareCard.tsx` | html2canvas requires inline styles, never touch |
| `ShareActions.tsx` | No visual classes to update |
| `ProblemSection.tsx` | Not rendered in page.tsx |
| `ProductShowcase.tsx` | iOS mockup styling is intentional (represents the app, not the site aesthetic) |
| `Footer.tsx` | Minimal component, inherits token changes automatically |
| `ConditionalSampleOutcome.tsx` | Wrapper component, no visual classes |
| `ReferralEntryBanner.tsx` | Will inherit token changes |
| `PillarStrip.tsx`, `CredibilitySection.tsx`, `CTASection.tsx` | Not rendered in page.tsx |

---

## Verification

1. `npx tsc --noEmit` — no type errors
2. `npm run build` — production build succeeds
3. `grep -r "glow-accent\|btn-shine\|glass-card\|gradient-border\|gradient-text" src/components` — returns 0 matches (all removed)
4. `grep -r "duration: 0\." src/components` — audit hardcoded durations, replace with DURATION constants
5. Manual browser test:
   - Mode selector visible in hero (Gym / Hybrid), before any scroll
   - Switching modes swaps form inputs and ghost preview labels (240ms transition)
   - Gym: BW + 3 lifts → strength percentile
   - Hybrid: BW + squat + deadlift + 5K → mixed result (no bench)
   - Result modules use consistent system-label hierarchy
   - No glow, no glass blur, no gradient text (except hero "stuck")
   - Surface cards have edge-lit top border
   - Buttons follow primary/secondary/tertiary hierarchy
   - Grid barely visible, neutral lines, no noise
   - Section dividers are single 1px lines
   - All transitions ≤320ms, no spring, no scale
6. Mobile (375px): mode selector two segments fit naturally
7. Keyboard: arrow keys navigate mode selector, Enter activates
8. `prefers-reduced-motion`: all animations instant, shimmer stops
