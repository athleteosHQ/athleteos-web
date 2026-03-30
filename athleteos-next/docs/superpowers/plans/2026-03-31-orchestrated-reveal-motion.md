# Orchestrated Reveal Motion — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add one strong choreographed motion sequence to the form→result reveal (score counter, spring bars, insight cascade), plus subtle ambient motion (scroll parallax, stagger reveals, layout-animated mode selector).

**Architecture:** New `AnimatedCounter` component + `useHeadingParallax` hook in motion.ts + spring-driven bars in RankResult + stagger variants for scroll sections + `layoutId` on ModeSelector. All pure Framer Motion, no new deps.

**Tech Stack:** Framer Motion v12 (`useMotionValue`, `useSpring`, `useTransform`, `useScroll`, `animate`, `layoutId`, `LayoutGroup`), React 19, TypeScript

**Spec:** `docs/superpowers/specs/2026-03-31-orchestrated-reveal-motion-design.md`

---

### Task 1: Add motion utilities to motion.ts

**Files:**
- Modify: `src/lib/motion.ts`

- [ ] **Step 1: Add stagger variants and parallax hook**

Append these exports after the existing `fadeUp` function:

```typescript
import { useScroll, useTransform, useReducedMotion } from 'framer-motion'
// Note: useReducedMotion is already imported at top of file — just add useScroll, useTransform to the existing import

/** Stagger container variant for section intros. */
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
} as const

/** Stagger child variant. Pair with staggerContainer. */
export const staggerItem = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.normal, ease: EASE_OUT },
  },
} as const

/** Subtle scroll parallax for section headings. Heading moves 20px slower than content. */
export function useHeadingParallax() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [0, -20])
  return { ref, style: reduced ? undefined : { y } }
}
```

Also add `useRef` to the React import at the top of the file (if not already imported — check first, it may not be there since it's currently only framer-motion imports).

Actually, `motion.ts` currently imports only from `framer-motion`. Add `import { useRef } from 'react'` at the top.

- [ ] **Step 2: Verify build**

Run: `cd athleteos-next && npx tsc --noEmit`
Expected: PASS (new exports, nothing consumes them yet)

- [ ] **Step 3: Commit**

```bash
git add src/lib/motion.ts
git commit -m "feat: add stagger variants and useHeadingParallax hook"
```

---

### Task 2: Create AnimatedCounter component

**Files:**
- Create: `src/components/landing/rank/AnimatedCounter.tsx`
- Modify: `src/components/landing/rank/index.ts`

- [ ] **Step 1: Create AnimatedCounter**

```typescript
'use client'

import { useEffect, useRef } from 'react'
import { useMotionValue, useSpring, useTransform, motion } from 'framer-motion'
import { useMotionSafe } from '@/lib/motion'

interface AnimatedCounterProps {
  value: number
  className?: string
}

export function AnimatedCounter({ value, className }: AnimatedCounterProps) {
  const { reduced } = useMotionSafe()
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { stiffness: 80, damping: 20 })
  const display = useTransform(spring, v => Math.round(v))
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (reduced) {
      motionValue.set(value)
      return
    }
    motionValue.set(value)
  }, [value, motionValue, reduced])

  useEffect(() => {
    const unsubscribe = display.on('change', v => {
      if (ref.current) {
        ref.current.textContent = String(v)
      }
    })
    return unsubscribe
  }, [display])

  return <span ref={ref} className={className}>{reduced ? value : 0}</span>
}
```

- [ ] **Step 2: Update barrel export**

In `src/components/landing/rank/index.ts`, add:
```typescript
export { AnimatedCounter } from './AnimatedCounter'
```

- [ ] **Step 3: Verify build**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/landing/rank/AnimatedCounter.tsx src/components/landing/rank/index.ts
git commit -m "feat: add AnimatedCounter with spring-driven count-up"
```

---

### Task 3: Wire AnimatedCounter into AthleteScoreCard (Beat 2-3)

**Files:**
- Modify: `src/components/landing/AthleteScoreCard.tsx`

- [ ] **Step 1: Add counter and stagger tier badge**

Read the file first. Make these changes:

1. Import `AnimatedCounter` from `./rank/AnimatedCounter` and `motion` from `framer-motion`
2. Replace the static score display `<p className="text-4xl font-display font-bold text-accent tabular-nums">{score}</p>` with:
```tsx
<p className="text-4xl font-display font-bold text-accent tabular-nums">
  <AnimatedCounter value={score} />
</p>
```

3. Wrap the tier/percentile header section in a motion.div for Beat 3:
   - The `<div>` containing "Competitive benchmark percentile", percentileLabel h3, and the tier span — wrap in:
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.18, delay: 0.2 }}
>
```
   - The tier text (`<span className="font-bold text-foreground">{systemStatus}</span>`) — wrap just that span in:
```tsx
<motion.span
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ type: 'spring', stiffness: 400, damping: 25, delay: 0.2 }}
  className="font-bold text-foreground inline-block"
>
  {systemStatus}
</motion.span>
```

4. The score bar animation (currently `duration: 1, delay: 0.5`) — change delay to `0.3` to sync with the reveal sequence (bars start at Beat 4 timing).

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/AthleteScoreCard.tsx
git commit -m "feat: animated counter on score, stagger tier badge reveal"
```

---

### Task 4: Spring-driven diagnostic bars (Beat 4)

**Files:**
- Modify: `src/components/landing/rank/RankResult.tsx`

- [ ] **Step 1: Replace linear bar animation with spring physics**

Read the file first. In `DiagnosticBars` component:

1. Add imports: `useSpring, useTransform, useMotionValue` from `framer-motion` and `useEffect` from `react`
2. Create an inline `SpringBar` component inside `DiagnosticBars` (before the return):

```typescript
function SpringBar({ pct, color, delay }: { pct: number; color: string; delay: number }) {
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { stiffness: 60, damping: 18 })
  const width = useTransform(spring, v => `${v}%`)

  useEffect(() => {
    const timeout = setTimeout(() => motionValue.set(pct), delay * 1000)
    return () => clearTimeout(timeout)
  }, [pct, delay, motionValue])

  return (
    <motion.div
      className="h-full rounded-full"
      style={{ background: color, width }}
    />
  )
}
```

3. Replace the existing bar `motion.div` (lines 45-51 area):
```tsx
{/* Old: */}
<motion.div
  className="h-full rounded-full"
  style={{ background: bar.color }}
  initial={{ width: 0 }}
  animate={{ width: `${bar.pct}%` }}
  transition={{ duration: 0.8, delay: i * 0.12, ease: 'easeOut' }}
/>

{/* New: */}
<SpringBar pct={bar.pct} color={bar.color} delay={0.3 + i * 0.1} />
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/rank/RankResult.tsx
git commit -m "feat: spring-driven diagnostic bars with staggered delay"
```

---

### Task 5: Staggered insight cascade (Beat 5)

**Files:**
- Modify: `src/components/landing/rank/RankResult.tsx`

- [ ] **Step 1: Wrap ResultInsightPanel modules in stagger container**

Read the file. In `ResultInsightPanel` component:

1. Import `motion` from `framer-motion` (if not already imported in this file)
2. Import `EASE_OUT, DURATION` from `@/lib/motion`
3. Define cascade variants at top of `ResultInsightPanel`:

```typescript
const cascadeParent = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.6, staggerChildren: 0.06 },
  },
}
const cascadeChild = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.normal, ease: EASE_OUT },
  },
}
```

4. Change the outer `<div>` of ResultInsightPanel to `<motion.div variants={cascadeParent} initial="hidden" animate="visible">` (keep existing className and style)
5. Wrap each module sub-panel (the 6-7 distinct content blocks) in `<motion.div variants={cascadeChild}>`. Each block that is currently a `<div>` with `surface-card-muted` becomes `<motion.div variants={cascadeChild} className="surface-card-muted ...">`.

The blocks to wrap (in order):
- Status + identity text block (the first few lines with status, identity, progression)
- Efficiency + Strength Age grid
- Primary Constraint (diagnosis) card
- System Read card
- World Benchmark card
- Next Threshold card (conditional)
- Locked cards grid

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/rank/RankResult.tsx
git commit -m "feat: staggered insight cascade with 0.6s delay"
```

---

### Task 6: Update RankSection exit timing (Beat 1)

**Files:**
- Modify: `src/components/landing/RankSection.tsx`

- [ ] **Step 1: Tighten form exit animation**

Read the file. In the AnimatePresence block:

1. Update the form `motion.div` (key="form") exit:
```tsx
exit={{ opacity: 0, y: -12 }}
transition={{ duration: 0.2, ease: EASE_OUT }}
```
(Currently `exit={{ opacity: 0, y: -10 }}` with `duration: 0.4` — change to `y: -12` and `duration: 0.2` for crisper exit)

2. The result `motion.div` (key="result") stays as-is (`duration: 0.32`) — the internal beats handle the choreography.

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/RankSection.tsx
git commit -m "refactor: tighten form exit to 200ms for reveal sequence"
```

---

### Task 7: Mode selector layout animation (B3)

**Files:**
- Modify: `src/components/landing/ModeSelector.tsx`

- [ ] **Step 1: Add layoutId to accent bar**

Read the file. Make these changes:

1. Import `motion, LayoutGroup` from `framer-motion`
2. Wrap the `<div className="surface-control inline-flex" ...>` in `<LayoutGroup>`
3. Change the accent bar `<span>` to `<motion.span>` and add `layoutId="mode-indicator"`:

```tsx
{active && (
  <motion.span
    layoutId="mode-indicator"
    className="absolute bottom-0 left-2 right-2 h-0.5"
    style={{ background: 'var(--accent-light)' }}
  />
)}
```

This makes the bar slide between segments when mode switches, using Framer's built-in layout animation.

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/ModeSelector.tsx
git commit -m "feat: layout-animated mode indicator bar"
```

---

### Task 8: Scroll parallax + stagger on section headers (B1, B2)

**Files:**
- Modify: `src/components/landing/RankSection.tsx`
- Modify: `src/components/landing/SystemSection.tsx`
- Modify: `src/components/landing/TrustStrip.tsx`
- Modify: `src/components/landing/FAQSection.tsx`
- Modify: `src/components/landing/LockedPreviewSection.tsx`

- [ ] **Step 1: Add parallax + stagger to RankSection header**

Read `src/components/landing/RankSection.tsx`. The section header block (around line 65-70):
1. Import `useHeadingParallax, staggerContainer, staggerItem` from `@/lib/motion`
2. Use the hook: `const parallax = useHeadingParallax()`
3. Replace the header `motion.div` with:
```tsx
<motion.div
  ref={parallax.ref}
  style={parallax.style}
  variants={staggerContainer}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  className="mb-8"
>
  <motion.h2 variants={staggerItem} className="text-3xl font-display font-bold text-foreground md:text-4xl">
    Where are you strong. Where are you leaking.
  </motion.h2>
</motion.div>
```

- [ ] **Step 2: Apply same pattern to SystemSection intro**

Read `src/components/landing/SystemSection.tsx`. Find the intro block (the `motion.div` with `{...fadeUp(0)}` that contains the eyebrow, h2, and body text). Replace `{...fadeUp(0)}` with `variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}`. Wrap each child (`<p>`, `<h2>`, `<p>`) in `<motion.p variants={staggerItem}>` or `<motion.h2 variants={staggerItem}>`. Add parallax: `const parallax = useHeadingParallax()`, apply `ref={parallax.ref} style={parallax.style}` to the container.

Import `useHeadingParallax, staggerContainer, staggerItem` from `@/lib/motion`.

- [ ] **Step 3: Apply to TrustStrip intro**

Read `src/components/landing/TrustStrip.tsx`. Same pattern on the intro block (the `mb-5 max-w-2xl` div with eyebrow + h2). Wrap in stagger container with parallax.

- [ ] **Step 4: Apply to FAQSection intro**

Read `src/components/landing/FAQSection.tsx`. Same pattern on the intro block (eyebrow + h2 + body text).

- [ ] **Step 5: Apply to LockedPreviewSection intro**

Read `src/components/landing/LockedPreviewSection.tsx`. Same pattern on the intro block.

- [ ] **Step 6: Verify build**

Run: `npx tsc --noEmit`

- [ ] **Step 7: Full build**

Run: `npm run build`
Expected: Production build succeeds.

- [ ] **Step 8: Commit**

```bash
git add src/components/landing/RankSection.tsx src/components/landing/SystemSection.tsx src/components/landing/TrustStrip.tsx src/components/landing/FAQSection.tsx src/components/landing/LockedPreviewSection.tsx
git commit -m "feat: scroll parallax + stagger reveals on section headers"
```

---

### Task 9: Final verification

- [ ] **Step 1: Type check**

Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: Passes

- [ ] **Step 3: Visual checklist (manual browser test)**

Submit the form and observe the reveal sequence:
- Score counts up from 0 with spring deceleration (~400ms)
- Tier badge snaps in at ~400ms with crisp spring
- Bars fill sequentially with slight overshoot, 100ms stagger
- Insight modules cascade in from ~800ms, 60ms stagger
- Total feels complete by ~1.2s

Ambient:
- Mode selector accent bar slides between Gym/Hybrid
- Section headings have subtle parallax (scroll slowly, observe heading vs content offset)
- Section intros stagger: eyebrow → heading → body text enter sequentially

Reduced motion:
- Toggle prefers-reduced-motion in browser devtools
- Score shows instantly, no counter
- Bars show at final width
- All modules appear at once
