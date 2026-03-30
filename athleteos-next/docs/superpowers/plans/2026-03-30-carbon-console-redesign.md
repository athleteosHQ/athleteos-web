# Carbon System Console Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the landing page from glassmorphism/glow aesthetic to a carbon system console, move the Gym/Hybrid mode selector into the hero viewport, and enforce a consistent surface/typography/motion language.

**Architecture:** CSS-first visual overhaul (globals.css token + class replacement), then component updates to consume new classes, then entry-flow restructuring (ModeSelector in hero, mode state in page.tsx). Each task produces a buildable state.

**Tech Stack:** Next.js 16, React, TypeScript, Tailwind CSS, Framer Motion, CSS custom properties

**Spec:** `docs/superpowers/specs/2026-03-30-carbon-console-redesign-design.md`

---

### Task 1: Update motion.ts constants

**Files:**
- Modify: `src/lib/motion.ts`

- [ ] **Step 1: Update DURATION values and remove stagger exports**

Remove `STAGGER`, `STAGGER_ITEM`, and `hero` duration key. Update timing values.

```typescript
// Replace the entire DURATION block:
export const DURATION = {
  fast: 0.18,
  normal: 0.24,
  slow: 0.3,
  enter: 0.32,
} as const
```

Remove `STAGGER` and `STAGGER_ITEM` const exports (lines 39-53).

Update `fadeUp`: change `y: 20` to `y: 12`, and `DURATION.enter` is already referenced (value changes automatically).

- [ ] **Step 2: Verify build**

Run: `cd athleteos-next && npx tsc --noEmit`
Expected: May show errors in HeroSection.tsx (imports STAGGER/STAGGER_ITEM). That's fine — fixed in Task 4.

- [ ] **Step 3: Commit**

```bash
git add src/lib/motion.ts
git commit -m "refactor: update motion constants for carbon console redesign"
```

---

### Task 2: Overhaul globals.css — tokens, surfaces, strip effects

**Files:**
- Modify: `src/app/globals.css`

This is the largest single task. It replaces the entire visual foundation.

- [ ] **Step 1: Update design tokens in :root**

Replace these token values:
```css
--background:        #0C0C0E;      /* was #050506 */
--muted-foreground:  #6B7280;      /* was #8A8F98 */
--card:              rgba(255,255,255,0.03);  /* was 0.04 */
--border:            rgba(255,255,255,0.06);  /* was 0.08 */
--secondary:         #141416;      /* was #0a0a0c */
--accent:            #6B7AED;      /* was #5E6AD2 */
--accent-light:      #8DA0FF;      /* was #8B93E0 */
```

- [ ] **Step 2: Replace body background**

Remove the rotating conic gradient, animated `--grad-angle` property, and `@keyframes gradientRotate`. Replace body background with:
```css
body {
  background: radial-gradient(ellipse 50% 40% at 50% 0%, rgba(107,122,237,0.04), transparent), #0C0C0E;
  color: var(--foreground);
  font-family: var(--font-inter), sans-serif;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}
```

Remove `@property --grad-angle` block entirely.

- [ ] **Step 3: Simplify grid overlay**

Change `.grid-bg::before` grid lines from `rgba(94,106,210,0.06)` to `rgba(255,255,255,0.03)`. Change opacity from `0.18` to `0.08`.

Remove `.grid-bg::after` (noise texture overlay) entirely.

- [ ] **Step 4: Replace card/surface classes**

Remove: `.card-surface`, `.card-surface:hover`, `.card-surface-secondary`, `.hero-card`, `.status-pill`.

Add new surface hierarchy:
```css
.surface-card {
  background: #141416;
  border: 1px solid rgba(255,255,255,0.06);
  border-top: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  transition: border-color 150ms ease;
}
.surface-card:hover {
  border-color: rgba(107,122,237,0.3);
}
.surface-card-muted {
  background: #111113;
  border: 1px solid rgba(255,255,255,0.04);
  border-radius: 8px;
}
.surface-control {
  background: #141416;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 6px;
}
```

- [ ] **Step 5: Update gate-panel**

Remove `backdrop-filter`, `animation: gateAppear`, and `@keyframes gateAppear`. Replace with:
```css
.gate-panel {
  background: #141416;
  border: 1px solid rgba(107,122,237,0.3);
  border-top: 1px solid rgba(107,122,237,0.4);
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.4);
}
```

- [ ] **Step 6: Update system-input**

Replace background with `#0F0F11`. Update focus-visible:
```css
.system-input:focus-visible {
  outline: none;
  border-color: var(--accent);
}
```
Remove the glow ring (`box-shadow`) and background change on focus.

- [ ] **Step 7: Simplify section-fade-top**

Replace `.section-fade-top::before` with simple line:
```css
.section-fade-top::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: rgba(255,255,255,0.06);
}
```
Remove `.section-fade-top::after` entirely.

- [ ] **Step 8: Update font-mono-label**

Change `letter-spacing` from `0.08em` to `0.12em`.

- [ ] **Step 9: Strip all removed effects**

Delete these classes and their keyframes:
- `.glow-accent`, `.glow-accent:hover`, `.glow-success`, `.glow-accent-pulse`, `@keyframes glowPulse`
- `.btn-shine`, `.btn-shine::after`, `.btn-shine:hover::after`
- `.glass-card`, `.glass-card:hover`
- `.gradient-text-accent`, `.gradient-text-headline`
- `.gradient-border`, `.gradient-border::before`
- `.reveal-burst`, `@keyframes revealBurst`
- `.signal-dot`, `@keyframes orbitPulse`
- `.surface-impact-card`, `.surface-dim-panel`, `.pill-destructive`
- `.diagnostic-row`, `.diagnostic-diagnosis-panel`, `.diagnostic-metric-cell`
- `@keyframes ctaSweep`, `@keyframes signalSweep`, `@keyframes pulseGlow`, `.animate-pulse-glow`
- `.cta-glow`, `.cta-glow::after`, `.accent-glow`, `.signal-bar`, `.signal-bar::after`

Keep: `.hero-gradient-word`, `.locked-peek`, `@keyframes peekSweep`.

- [ ] **Step 10: Verify build**

Run: `cd athleteos-next && npx tsc --noEmit`
Expected: Passes (CSS changes don't affect TS). Components using removed classes will still render but without styling — fixed in subsequent tasks.

- [ ] **Step 11: Commit**

```bash
git add src/app/globals.css
git commit -m "refactor: replace visual foundation with carbon console tokens and surfaces"
```

---

### Task 3: Create ModeSelector component

**Files:**
- Create: `src/components/landing/ModeSelector.tsx`

- [ ] **Step 1: Create ModeSelector**

```typescript
'use client'

export type AthleteMode = 'gym' | 'hybrid'

interface ModeSelectorProps {
  mode: AthleteMode
  onModeChange: (mode: AthleteMode) => void
}

const MODES: { value: AthleteMode; label: string }[] = [
  { value: 'gym', label: 'Gym' },
  { value: 'hybrid', label: 'Hybrid' },
]

export function ModeSelector({ mode, onModeChange }: ModeSelectorProps) {
  const handleKeyDown = (e: React.KeyboardEvent, current: AthleteMode) => {
    const idx = MODES.findIndex(m => m.value === current)
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      onModeChange(MODES[(idx + 1) % MODES.length].value)
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      onModeChange(MODES[(idx - 1 + MODES.length) % MODES.length].value)
    }
  }

  return (
    <div className="surface-control inline-flex" role="radiogroup" aria-label="Training mode">
      {MODES.map(({ value, label }) => {
        const active = mode === value
        return (
          <button
            key={value}
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onModeChange(value)}
            onKeyDown={e => handleKeyDown(e, value)}
            className="relative px-6 py-2 font-mono-label transition-colors duration-200"
            style={{
              minWidth: 120,
              color: active ? '#fff' : 'var(--muted-foreground)',
              background: active ? 'var(--accent)' : 'transparent',
              borderRadius: 4,
            }}
          >
            {label}
            {active && (
              <span
                className="absolute bottom-0 left-2 right-2 h-0.5"
                style={{ background: 'var(--accent-light)' }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `cd athleteos-next && npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/ModeSelector.tsx
git commit -m "feat: add ModeSelector component for Gym/Hybrid toggle"
```

---

### Task 4: Rewrite HeroSection — static render + ModeSelector

**Files:**
- Modify: `src/components/landing/HeroSection.tsx`

- [ ] **Step 1: Rewrite HeroSection**

Remove: `useRef`, `useScroll`, `useTransform`, `STAGGER`, `STAGGER_ITEM`, `useMotionSafe`, ambient orbs, scroll parallax, scroll chevron.

Add: `ModeSelector` import, accept `mode` and `onModeChange` props.

```typescript
'use client'

import { ModeSelector, type AthleteMode } from './ModeSelector'

interface HeroSectionProps {
  mode: AthleteMode
  onModeChange: (mode: AthleteMode) => void
}

export function HeroSection({ mode, onModeChange }: HeroSectionProps) {
  const handleCTA = () => {
    document.getElementById('rank')?.scrollIntoView({ behavior: 'smooth' })
    window.setTimeout(() => {
      document.getElementById('rank-bw-input')?.focus()
    }, 500)
  }

  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-display font-bold text-foreground leading-tight sm:text-5xl md:text-6xl">
          Your performance is{' '}
          <span className="hero-gradient-word">stuck.</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground sm:text-xl max-w-xl mx-auto">
          AthleteOS reads your training, nutrition, and recovery as one system, so the real bottleneck becomes obvious.
        </p>
        <div className="mt-8 flex justify-center">
          <ModeSelector mode={mode} onModeChange={onModeChange} />
        </div>
        <button
          type="button"
          onClick={handleCTA}
          className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-md bg-accent px-8 py-4 text-base font-bold text-white transition-colors hover:bg-accent-light"
          style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
        >
          Run My Performance Check
        </button>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `cd athleteos-next && npx tsc --noEmit`
Expected: Errors in page.tsx (HeroSection now requires props). Fixed in Task 5.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/HeroSection.tsx
git commit -m "refactor: simplify HeroSection, add ModeSelector to first viewport"
```

---

### Task 5: Update page.tsx — client component with mode state

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add 'use client' and mode state**

```typescript
'use client'

import { useState, Suspense } from 'react'
import type { AthleteMode } from '@/components/landing/ModeSelector'

// ... existing imports (remove ComparisonSection, CTASection if still imported)

export default function LandingV2() {
  const [mode, setMode] = useState<AthleteMode>('gym')

  return (
    <div className="grid-bg relative min-h-screen antialiased">
      <NavBar />
      <StickyJoinBar />
      <Suspense fallback={null}>
        <ReferralEntryBanner />
      </Suspense>
      <main className="relative z-10 flex flex-col">
        <HeroSection mode={mode} onModeChange={setMode} />
        <RankSection mode={mode} />
        <ConditionalSampleOutcome />
        <SystemSection />
        <LockedPreviewSection />
        <SignupGateSection />
        <TrustStrip />
        <FAQSection />
      </main>
      <Footer />
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `cd athleteos-next && npx tsc --noEmit`
Expected: Error in RankSection (doesn't accept `mode` prop yet). Fixed in Task 6.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "refactor: make page.tsx client component with mode state"
```

---

### Task 6: Update RankSection to accept mode prop

**Files:**
- Modify: `src/components/landing/RankSection.tsx`

- [ ] **Step 1: Accept mode prop, remove internal trainingType state**

Add `mode` prop. Map `mode` to the existing `trainingType` used by `calculateRank`:
- `'gym'` → `'strength'`
- `'hybrid'` → `'hybrid'`

Remove the internal `trainingType` state and the toggle. Reset form fields when `mode` changes (useEffect).

Remove `reveal-burst` class from result container. Update AnimatePresence transitions:
- Enter: `opacity: 0, y: 12` → `opacity: 1, y: 0`, duration `DURATION.enter`
- Exit: `opacity: 1, y: 0` → `opacity: 0, y: -8`, duration `DURATION.enter`

Pass `mode` to `RankForm` and `GhostTierPreview`.

- [ ] **Step 2: Verify build**

Run: `cd athleteos-next && npx tsc --noEmit`
Expected: Errors in RankForm/GhostTierPreview (don't accept mode yet). Fixed in Tasks 7-8.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/RankSection.tsx
git commit -m "refactor: RankSection accepts mode prop, removes internal toggle"
```

---

### Task 7: Update RankForm to accept mode prop

**Files:**
- Modify: `src/components/landing/rank/RankForm.tsx`

- [ ] **Step 1: Accept mode, render mode-specific inputs**

Replace `trainingType`/`onTrainingTypeChange` props with `mode: AthleteMode` (import type from ModeSelector).

Remove the training type toggle buttons from the form.

Render inputs based on mode:
- `'gym'`: BW + Squat + Bench + Deadlift (current strength layout)
- `'hybrid'`: BW + Squat + Deadlift + 5K time (no bench). Add muted note below inputs: "Hybrid mode measures squat + deadlift strength against endurance."

Replace container inline styles with `surface-card` class. Remove `glow-accent btn-shine` from submit button. Add `style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.4)' }}` for primary button depth.

- [ ] **Step 2: Verify build**

Run: `cd athleteos-next && npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/rank/RankForm.tsx
git commit -m "refactor: RankForm accepts mode prop, renders Gym/Hybrid input sets"
```

---

### Task 8: Update GhostTierPreview to accept mode prop

**Files:**
- Modify: `src/components/landing/rank/GhostTierPreview.tsx`

- [ ] **Step 1: Accept mode, swap labels**

Import `AthleteMode`. Add `mode` prop.

Ghost bar labels per mode:
- `'gym'`: Squat, Bench, Deadlift (current)
- `'hybrid'`: Squat, Deadlift, 5K Run

Replace glass container styling with `surface-card` class. Remove icon pulse animation (the `animate={{ scale: [1, 1.08, 1] }}` on the Activity icon). Make it static.

- [ ] **Step 2: Verify build**

Run: `cd athleteos-next && npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/rank/GhostTierPreview.tsx
git commit -m "refactor: GhostTierPreview swaps labels per mode, uses surface-card"
```

---

### Task 9: Update RankResult module labels and surfaces

**Files:**
- Modify: `src/components/landing/rank/RankResult.tsx`

- [ ] **Step 1: Replace classes and apply module hierarchy**

- Replace `card-surface` → `surface-card` on DiagnosticBars container
- Replace `glow-success` → remove (no class replacement, just remove the class)
- Replace `gradient-text-accent` → `text-accent`
- Replace all inline `style={{ background: 'rgba(...)' }}` sub-panels with `surface-card-muted` class
- Remove `signal-bar` class from bar track divs
- Remove bar glow `boxShadow` from animated bar divs

Module labels: "Strength Signal", "System Efficiency", "Primary Constraint", "Next Threshold", "System Read" are already in place from earlier copy changes.

- [ ] **Step 2: Verify build**

Run: `cd athleteos-next && npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/rank/RankResult.tsx
git commit -m "refactor: RankResult uses surface-card-muted, removes glow effects"
```

---

### Task 10: Update remaining landing components

**Files:**
- Modify: `src/components/landing/AthleteScoreCard.tsx`
- Modify: `src/components/landing/NavBar.tsx`
- Modify: `src/components/landing/StickyJoinBar.tsx`
- Modify: `src/components/landing/SignupGateSection.tsx`
- Modify: `src/components/landing/LockedPreviewSection.tsx`
- Modify: `src/components/landing/TrustStrip.tsx`
- Modify: `src/components/landing/FAQSection.tsx`
- Modify: `src/components/landing/DiagnosticCard.tsx`

- [ ] **Step 1: AthleteScoreCard**

Replace `glass-card` → `surface-card`. Replace `gradient-text-accent` → `text-accent`.

- [ ] **Step 2: NavBar**

Remove `glow-accent btn-shine` from CTA button. Add `style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.4)' }}`.

- [ ] **Step 3: StickyJoinBar**

Remove `glow-accent btn-shine` from CTA button. Remove top gradient from bar background (use flat `rgba(12,12,14,0.95)` instead of gradient). Add primary button shadow.

- [ ] **Step 4: SignupGateSection**

Remove `glow-accent-pulse btn-shine` from submit button. Add primary button shadow. The `.gate-panel` class is updated via globals.css (Task 2).

- [ ] **Step 5: LockedPreviewSection**

Remove `gradient-border` class. Remove `gradient-text-headline` class → use `text-foreground`. Use `surface-card-muted` for locked cards (replace inline background styles).

- [ ] **Step 6: TrustStrip**

Replace `glass-card` → `surface-card`. Remove `boxShadow` from colored dots (use flat dots).

- [ ] **Step 7: FAQSection**

Replace AccordionItem inline background/border styles with `surface-card-muted` class. Remove inline `style={{ background: ... }}` on open/closed states — use `surface-card-muted` for both, with accent border-color when open.

- [ ] **Step 8: DiagnosticCard**

Remove `signal-dot` class reference → use static inline dot (no animation). Replace `diagnostic-row`, `diagnostic-diagnosis-panel`, `diagnostic-metric-cell` classes with `surface-card-muted` or inline equivalents using new token values.

- [ ] **Step 9: Verify build**

Run: `cd athleteos-next && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 10: Commit**

```bash
git add src/components/landing/AthleteScoreCard.tsx src/components/landing/NavBar.tsx src/components/landing/StickyJoinBar.tsx src/components/landing/SignupGateSection.tsx src/components/landing/LockedPreviewSection.tsx src/components/landing/TrustStrip.tsx src/components/landing/FAQSection.tsx src/components/landing/DiagnosticCard.tsx
git commit -m "refactor: update all landing components to carbon console surface classes"
```

---

### Task 11: Rename GlassInput → SystemInput + update barrel

**Files:**
- Rename: `src/components/landing/rank/GlassInput.tsx` → `src/components/landing/rank/SystemInput.tsx`
- Modify: `src/components/landing/rank/index.ts`

- [ ] **Step 1: Rename file**

```bash
cd athleteos-next
mv src/components/landing/rank/GlassInput.tsx src/components/landing/rank/SystemInput.tsx
```

- [ ] **Step 2: Update barrel export**

In `rank/index.ts`, change:
```typescript
export { GlassInput, GlassField, LiftRow } from './SystemInput'
```

- [ ] **Step 3: Verify build**

Run: `npx tsc --noEmit`

- [ ] **Step 4: Commit**

```bash
git add src/components/landing/rank/
git commit -m "refactor: rename GlassInput to SystemInput"
```

---

### Task 12: Update hybrid calculation in rankCalc.ts

**Files:**
- Modify: `src/lib/rankCalc.ts`

- [ ] **Step 1: Skip bench in hybrid mode**

In `calculateRank`, when `trainingType === 'hybrid'`:
- Still compute `benchResult` (for data completeness) but exclude it from overall percentile
- Overall percentile for hybrid = average of squat + deadlift + run5k (3 metrics, not 4)

Find the hybrid branch (around line 95-100) and update:
```typescript
if (trainingType === 'hybrid' && run5k) {
  // ... existing run5k computation stays ...
  // Change overallPct to exclude bench:
  overallPct = (squatResult.percentile + deadliftResult.percentile + run5kResult.percentile) / 3
}
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add src/lib/rankCalc.ts
git commit -m "feat: hybrid mode excludes bench from overall percentile"
```

---

### Task 13: Audit hardcoded durations + final cleanup

**Files:**
- Multiple component files

- [ ] **Step 1: Grep for hardcoded durations**

Run: `grep -rn "duration: 0\." src/components/landing/ --include="*.tsx"`

Replace any hardcoded `duration: 0.X` values with `DURATION.*` constants from `@/lib/motion`.

- [ ] **Step 2: Grep for removed class names**

Run: `grep -rn "glow-accent\|btn-shine\|glass-card\|gradient-border\|gradient-text\|reveal-burst\|card-surface" src/components/ --include="*.tsx"`

Fix any remaining references. Expected: 0 matches after all tasks complete.

- [ ] **Step 3: Full build**

Run: `npm run build`
Expected: Production build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: audit hardcoded durations and remove stale class references"
```

---

### Task 14: Verification

- [ ] **Step 1: Type check**

Run: `npx tsc --noEmit`

- [ ] **Step 2: Production build**

Run: `npm run build`

- [ ] **Step 3: Stale class audit**

Run: `grep -rn "glow-accent\|btn-shine\|glass-card\|gradient-border\|gradient-text" src/components/`
Expected: 0 matches

- [ ] **Step 4: Visual checklist (manual browser test)**

- Mode selector visible in hero (Gym / Hybrid), before any scroll
- Switching modes in hero changes form inputs below
- Gym: BW + 3 lifts → strength percentile
- Hybrid: BW + squat + deadlift + 5K → result (no bench)
- No glow, no glass blur, no gradient text (except hero "stuck")
- Surface cards have edge-lit top border (`border-top` slightly brighter)
- Buttons have subtle depth shadow, no glow
- Grid barely visible, neutral gray lines
- Section dividers are single 1px lines
- All transitions ≤320ms, no spring, no scale

- [ ] **Step 5: Mobile test (375px)**

- Mode selector two segments fit in one row
- Form stacks vertically
- No horizontal overflow

- [ ] **Step 6: Keyboard test**

- Arrow keys navigate mode selector
- Tab moves between form inputs
- Enter submits form
