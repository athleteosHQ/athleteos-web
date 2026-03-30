# Orchestrated Reveal Motion

## Problem

The carbon console redesign shipped clean surfaces and disciplined typography, but the site feels static. Every transition is a 300ms opacity fade. The result reveal — the single most important moment in the conversion funnel — feels the same as a section scroll. The site needs one strong motion moment at the reveal, with calm ambient motion everywhere else.

## Solution

Two layers:
1. **Orchestrated reveal sequence** — a choreographed 1.2-second, 5-beat animation when the form transitions to the result
2. **Ambient motion** — subtle scroll parallax on headings, staggered children on scroll reveals, layout animation on mode selector

No new dependencies. Pure Framer Motion (v12, already installed). No 3D, no WebGL, no particles.

---

## A. The Orchestrated Reveal Sequence

Triggered when the user submits the form and `result` state transitions from `null` to a `RankResult`. The form exits, then the result enters as a coordinated 5-beat sequence.

### Beat 1 — Form Exit (0-200ms)

Form panel and ghost preview exit together via AnimatePresence `mode="wait"`:
- `exit={{ opacity: 0, y: -12 }}`
- `transition={{ duration: 0.2, ease: EASE_OUT }}`

Result does not begin entering until form has fully exited (AnimatePresence handles this).

### Beat 2 — Score Counter (200-600ms)

The athlete score number (e.g., "74") counts up from 0 to its final value.

**Implementation:**
- New component: `AnimatedCounter` in `src/components/landing/rank/AnimatedCounter.tsx`
- Uses `useMotionValue(0)` initialized at 0
- On mount, `animate(motionValue, targetValue, { type: 'spring', stiffness: 80, damping: 20 })`
- `useTransform(motionValue, v => Math.round(v))` to get integer display value
- Rendered as `<motion.span>` with `useMotionTemplate` or direct subscription via `useMotionValueEvent`

**Spring config:** `stiffness: 80, damping: 20` — decelerates naturally with very slight overshoot (~2-3 above target before settling).

**Where used:** `AthleteScoreCard.tsx` — replace the static `{score}` with `<AnimatedCounter value={score} />` when `animate` prop is false (result state).

### Beat 3 — Tier Badge (400-600ms)

Tier text (e.g., "Advanced") and percentile label appear:
- Tier: `initial={{ opacity: 0, scale: 0.9 }}`, `animate={{ opacity: 1, scale: 1 }}`
- `transition={{ type: 'spring', stiffness: 400, damping: 25, delay: 0.2 }}`
- Percentile label: `initial={{ opacity: 0 }}`, `animate={{ opacity: 1 }}`
- `transition={{ duration: 0.18, delay: 0.2 }}`

The delay values are relative to the result container's entry (Beat 2 starts at t=0 of the result mount). So `delay: 0.2` means 200ms after result enters = 400ms from form submit.

### Beat 4 — Bars Fill (500-900ms)

Each diagnostic bar (squat, bench, deadlift, optionally 5K) fills with spring physics.

**Implementation:**
- New hook: `useSpringBar(targetPct, delay)` in `src/components/landing/rank/RankResult.tsx` (inline, not extracted)
- Uses `useSpring(0, { stiffness: 60, damping: 18 })`
- On mount, after `delay`, set spring target to `targetPct`
- Bar width bound to spring value via `useTransform(spring, v => \`${v}%\`)`

**Spring config:** `stiffness: 60, damping: 18` — bars overshoot target by ~3% then settle. Slower than the score counter for a wave effect.

**Stagger:** Each bar delays by 100ms:
- Bar 0 (squat): delay 0.3s from result mount
- Bar 1 (bench): delay 0.4s
- Bar 2 (deadlift): delay 0.5s
- Bar 3 (5K, if hybrid): delay 0.6s

### Beat 5 — Insight Cascade (800-1200ms)

The insight panel modules enter with staggered fade + slide:

**Implementation:**
- Wrap all modules in a `motion.div` with `variants` using `staggerChildren: 0.06`
- Each module uses a child variant: `initial={{ opacity: 0, y: 8 }}`, `animate={{ opacity: 1, y: 0 }}`
- `transition={{ duration: 0.24, ease: EASE_OUT }}`
- Parent `transition={{ delayChildren: 0.6 }}` — cascade starts 600ms after result mounts

**Module order (top to bottom):**
1. Status + identity text
2. Efficiency + Strength Age cards
3. Primary Constraint card
4. System Read card
5. World Benchmark card
6. Next Threshold card
7. Locked cards (enter last, shimmer sweep starts 200ms after they appear)

### Reduced Motion

When `useMotionSafe().reduced` is true:
- Score counter shows final value instantly (no animation)
- All delays become 0
- All springs become `duration: 0`
- Bars show at final width immediately
- Insight modules appear all at once

---

## B. Ambient Motion

### B1. Scroll Parallax on Section Headings

Add subtle depth to section headings using `useScroll` + `useTransform`.

**Implementation:**
- New utility: `useHeadingParallax()` in `src/lib/motion.ts`
- Uses `useScroll({ target: ref, offset: ['start end', 'end start'] })`
- `useTransform(scrollYProgress, [0, 1], [0, -20])` — heading moves 20px slower than content
- Returns `{ ref, y }` — component applies `style={{ y }}` to heading container

**Applied to:** RankSection header, SystemSection header, LockedPreview header, TrustStrip header, FAQ header.

**Effect:** Headings scroll at ~95% of content speed. Barely perceptible as "an effect" but creates unconscious depth.

### B2. Staggered Scroll Reveals

Upgrade existing `fadeUp` sections to stagger their children.

**Implementation:**
- New variant pair in `src/lib/motion.ts`:

```typescript
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
}

export const staggerItem = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.normal, ease: EASE_OUT },
  },
}
```

**Applied to:** Section headers where heading + subheading + content enter together. Instead of one `fadeUp` on the parent, the parent uses `staggerContainer` and each child uses `staggerItem`.

**Sections to update:** SystemSection intro block, TrustStrip intro block, FAQ intro block, LockedPreview intro block.

### B3. Mode Selector Layout Animation

Add `layoutId="mode-indicator"` to the accent bottom bar in ModeSelector.

**Implementation:**
- In `ModeSelector.tsx`, the `<span>` that renders the accent bottom bar on the active segment gets `layoutId="mode-indicator"` added
- Wrap ModeSelector in `<LayoutGroup>` from framer-motion
- When mode switches, Framer automatically animates the bar sliding between segments

**Spring config:** Default layout spring (framer-motion's built-in, no custom config needed).

---

## C. File Changes

| File | Change |
|------|--------|
| `src/lib/motion.ts` | Add `staggerContainer`, `staggerItem` variants. Add `useHeadingParallax()` hook. |
| `src/components/landing/rank/AnimatedCounter.tsx` | **NEW** — Spring-driven counter component |
| `src/components/landing/rank/RankResult.tsx` | Spring bars (Beat 4), staggered insight cascade (Beat 5) |
| `src/components/landing/RankSection.tsx` | Update AnimatePresence exit timing (Beat 1) |
| `src/components/landing/AthleteScoreCard.tsx` | Use AnimatedCounter for score, stagger tier badge + percentile (Beats 2-3) |
| `src/components/landing/ModeSelector.tsx` | Add `layoutId` on accent bar, wrap in `LayoutGroup` |
| `src/components/landing/SystemSection.tsx` | Apply staggerContainer/staggerItem to intro block, useHeadingParallax |
| `src/components/landing/TrustStrip.tsx` | Apply staggerContainer/staggerItem to intro, useHeadingParallax |
| `src/components/landing/FAQSection.tsx` | Apply staggerContainer/staggerItem to intro, useHeadingParallax |
| `src/components/landing/LockedPreviewSection.tsx` | Apply staggerContainer/staggerItem, useHeadingParallax |
| `src/components/landing/rank/index.ts` | Export AnimatedCounter |

### Files NOT modified

| File | Reason |
|------|--------|
| `HeroSection.tsx` | Above fold, no scroll parallax target. Static entry is intentional. |
| `SignupGateSection.tsx` | Calm — no enhanced motion. Existing fade is sufficient. |
| `NavBar.tsx` | No motion changes. |
| `StickyJoinBar.tsx` | Existing spring slide is already good. |
| `globals.css` | No CSS changes needed. All motion is JS-driven. |

---

## D. Performance

- All springs use `useSpring` (GPU-composited via transform/opacity)
- Counter uses `useMotionValue` (no React re-renders per frame)
- Scroll parallax uses `useTransform` (no re-renders, direct style binding)
- Layout animation on mode selector is a single `layoutId` (framer handles optimization)
- Total new component: 1 (`AnimatedCounter`, ~30 lines)
- No new dependencies

---

## Verification

1. `npx tsc --noEmit` — 0 errors
2. `npm run build` — passes
3. Manual test — submit form, observe:
   - Score counts up from 0 with spring deceleration
   - Tier badge snaps in at 400ms
   - Bars fill sequentially with slight overshoot
   - Insight modules cascade in from 800ms
   - Total sequence feels complete by ~1.2s
4. Mode selector — accent bar slides between Gym/Hybrid
5. Scroll test — headings have subtle parallax offset vs content
6. `prefers-reduced-motion` — all animations instant, no springs
