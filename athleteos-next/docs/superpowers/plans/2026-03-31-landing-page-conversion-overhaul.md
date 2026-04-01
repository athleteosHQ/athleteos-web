# Landing Page Conversion Overhaul — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the AthleteOS landing page flow, messaging, and signup gate to convert more visitors by leading with proof-of-understanding, placing conversion content in the right scroll position, and reducing signup friction.

**Architecture:** Lift `rankResult` state from `RankSection` to `page.tsx` so downstream components (`PersonalizedUpsellStrip`, `SignupGateSection`) receive data via props instead of localStorage events. Replace the conditional show/hide pattern with always-rendered components that adapt their content based on available data. Two new components (`InsightPatternsSection`, `PersonalizedUpsellStrip`), two deletions (`ConditionalSampleOutcome`, `LockedPreviewSection`).

**Tech Stack:** Next.js 14, React, TypeScript, Framer Motion, Tailwind CSS, Vitest

**Spec:** `docs/superpowers/specs/2026-03-31-landing-page-conversion-overhaul-design.md`

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `src/app/page.tsx` | Modify | Page layout, section ordering, state lifting |
| `src/components/landing/HeroSection.tsx` | Rewrite | ICP headline, product category, single CTA |
| `src/components/landing/InsightPatternsSection.tsx` | Create | 3 diagnostic pattern cards |
| `src/components/landing/SampleOutcomeBlock.tsx` | Modify | CTA copy change, remove conditional logic |
| `src/components/landing/RankSection.tsx` | Modify | Add mode selector, onRankResult callback, reframe heading |
| `src/components/landing/PersonalizedUpsellStrip.tsx` | Create | Personalized locked upsell using real rank data |
| `src/components/landing/SignupGateSection.tsx` | Modify | Simplify fields, always-render, new CTA |
| `src/components/landing/SystemSection.tsx` | Rewrite | Concrete diagnostic chain messaging |
| `src/components/landing/StickyJoinBar.tsx` | Modify | Update CTA copy and anchor target |
| `src/components/landing/founderFormValidation.ts` | Modify | Remove name field |
| `src/components/landing/founderFormValidation.test.ts` | Modify | Update tests for new interface |
| `src/components/landing/landingFlow.ts` | Modify | Remove shouldShowSampleOutcome, add default gate content |
| `src/components/landing/landingFlow.test.ts` | Modify | Update/remove tests for changed exports |
| `src/lib/supabase.ts` | Modify | Make name and country optional |
| `src/app/api/founders/reserve/route.ts` | Modify | Make name optional in API validation |
| `src/components/landing/ConditionalSampleOutcome.tsx` | Delete | Replaced by direct SampleOutcomeBlock render |
| `src/components/landing/LockedPreviewSection.tsx` | Delete | Replaced by PersonalizedUpsellStrip |

---

### Task 1: Update founderFormValidation — remove name field

**Files:**
- Modify: `src/components/landing/founderFormValidation.ts`
- Modify: `src/components/landing/founderFormValidation.test.ts`

- [ ] **Step 1: Update tests for new interface (RED)**

In `founderFormValidation.test.ts`, rewrite tests to match the new interface without `name`:

```typescript
import { describe, expect, it } from 'vitest'
import { validateFounderForm } from './founderFormValidation'

describe('validateFounderForm', () => {
  it('rejects invalid email addresses', () => {
    expect(
      validateFounderForm({ email: 'not-an-email', whatsapp: '' }),
    ).toEqual({ email: 'Invalid email' })
  })

  it('rejects invalid phone numbers when provided', () => {
    expect(
      validateFounderForm({ email: 'athlete@example.com', whatsapp: '123' }),
    ).toEqual({ whatsapp: 'Invalid number' })
  })

  it('allows empty whatsapp (optional field)', () => {
    expect(
      validateFounderForm({ email: 'athlete@example.com', whatsapp: '' }),
    ).toEqual({})
  })

  it('returns no errors for valid inputs', () => {
    expect(
      validateFounderForm({ email: 'athlete@example.com', whatsapp: '+91 98765 43210' }),
    ).toEqual({})
  })
})
```

- [ ] **Step 2: Run tests — verify RED**

Run: `cd athleteos-next && npx vitest run src/components/landing/founderFormValidation.test.ts`
Expected: FAIL — `validateFounderForm` still expects `name` parameter

- [ ] **Step 3: Update founderFormValidation.ts (GREEN)**

Replace the full file content:

```typescript
interface FounderFormInput {
  email: string
  whatsapp: string
}

type FounderFormErrors = Partial<Record<keyof FounderFormInput, string>>

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
}

function isValidPhone(value: string): boolean {
  return /^\+?[0-9\s()-]{10,15}$/.test(value.trim())
}

export function validateFounderForm({
  email,
  whatsapp,
}: FounderFormInput): FounderFormErrors {
  const errors: FounderFormErrors = {}

  if (!isValidEmail(email)) errors.email = 'Invalid email'
  if (whatsapp.trim() && !isValidPhone(whatsapp)) errors.whatsapp = 'Invalid number'

  return errors
}

export type { FounderFormErrors, FounderFormInput }
```

Key change: `whatsapp` validation only triggers when non-empty (optional field).

- [ ] **Step 4: Run tests — verify GREEN**

Run: `cd athleteos-next && npx vitest run src/components/landing/founderFormValidation.test.ts`
Expected: ALL PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/landing/founderFormValidation.ts src/components/landing/founderFormValidation.test.ts
git commit -m "refactor: remove name from founder form validation, make whatsapp optional"
```

---

### Task 2: Update landingFlow — remove shouldShowSampleOutcome, add default gate content

**Files:**
- Modify: `src/components/landing/landingFlow.ts`
- Modify: `src/components/landing/landingFlow.test.ts`

- [ ] **Step 1: Update tests (RED)**

In `landingFlow.test.ts`:
- Remove the entire `shouldShowSampleOutcome` describe block
- Add a test for default gate content when `overallPct` is null
- Update existing `getInlineSignupGateContent` tests to match current production copy (the test file has stale expected values that don't match `landingFlow.ts`)

```typescript
import { describe, expect, it } from 'vitest'
import {
  getFounderLabel,
  hasFounderData,
  getInlineSignupGateContent,
  getShareMessage,
} from './landingFlow'

describe('getInlineSignupGateContent', () => {
  it('returns default gate content when overallPct is null', () => {
    const content = getInlineSignupGateContent(null)
    expect(content.headline).toBe(
      "See what's actually limiting your progress — training, nutrition, or recovery.",
    )
  })

  it('returns top-tier copy for athletes in the top 10 percent', () => {
    const content = getInlineSignupGateContent(93)
    expect(content.headline).toBe(
      "You're already ahead of most lifters. Now find the gap that keeps you from the next tier.",
    )
  })

  it('returns mid-tier copy for athletes between 60 and 89 percent', () => {
    expect(getInlineSignupGateContent(72).headline).toBe(
      "You're closer than you think. The variable holding you back probably isn't the one you blame.",
    )
  })

  it('returns starting-point copy for athletes below the top 60 percent', () => {
    expect(getInlineSignupGateContent(41).headline).toBe(
      'Your numbers show exactly where to start. AthleteOS shows what to fix first.',
    )
  })
})

describe('getShareMessage', () => {
  it('formats the share message from the rank percentile', () => {
    expect(getShareMessage(77)).toBe(
      "I'm in the top 23% of competitive strength athletes. Check yours -> athleteos.app",
    )
  })
})

describe('getFounderLabel', () => {
  it('reads the founder number from local storage payloads', () => {
    expect(getFounderLabel('{"id":"abc","num":23,"shareCount":0}')).toBe('Founding Member #23')
  })

  it('falls back cleanly on invalid payloads', () => {
    expect(getFounderLabel('not-json')).toBe('')
    expect(getFounderLabel(null)).toBe('')
  })
})

describe('hasFounderData', () => {
  it('treats stored founder payloads with a founder number as joined', () => {
    expect(hasFounderData('{"id":"abc","num":23,"shareCount":0}')).toBe(true)
  })

  it('rejects missing or malformed founder payloads', () => {
    expect(hasFounderData('{"id":"abc"}')).toBe(false)
    expect(hasFounderData('not-json')).toBe(false)
    expect(hasFounderData(null)).toBe(false)
  })
})
```

- [ ] **Step 2: Run tests — verify RED**

Run: `cd athleteos-next && npx vitest run src/components/landing/landingFlow.test.ts`
Expected: FAIL — `getInlineSignupGateContent(null)` not supported yet

- [ ] **Step 3: Update landingFlow.ts (GREEN)**

Change `getInlineSignupGateContent` signature to accept `number | null`. Add default headline. Remove `shouldShowSampleOutcome`.

```typescript
interface InlineSignupGateContent {
  eyebrow: string
  headline: string
  productLine: string
  trustChips: readonly string[]
}

const SHARED_GATE_CONTENT = {
  eyebrow: 'Founding members · first access',
  productLine: 'Training, nutrition, and recovery interpreted together — not in isolation. No payment now. Founding members get first access.',
  trustChips: ['No payment required', 'Cancel anytime', 'Founding rate locked'],
} as const

export function getInlineSignupGateContent(overallPct: number | null): InlineSignupGateContent {
  if (overallPct === null) {
    return {
      ...SHARED_GATE_CONTENT,
      headline: "See what's actually limiting your progress — training, nutrition, or recovery.",
    }
  }

  if (overallPct >= 90) {
    return {
      ...SHARED_GATE_CONTENT,
      headline: "You're already ahead of most lifters. Now find the gap that keeps you from the next tier.",
    }
  }

  if (overallPct >= 60) {
    return {
      ...SHARED_GATE_CONTENT,
      headline: "You're closer than you think. The variable holding you back probably isn't the one you blame.",
    }
  }

  return {
    ...SHARED_GATE_CONTENT,
    headline: 'Your numbers show exactly where to start. AthleteOS shows what to fix first.',
  }
}

export function getShareMessage(overallPct: number): string {
  return `I'm in the top ${100 - overallPct}% of competitive strength athletes. Check yours -> athleteos.app`
}

export function getFounderLabel(serializedFounderData: string | null): string {
  if (!serializedFounderData) return ''
  try {
    const parsed = JSON.parse(serializedFounderData) as { num?: number }
    return parsed.num ? `Founding Member #${parsed.num}` : ''
  } catch {
    return ''
  }
}

export function hasFounderData(serializedFounderData: string | null): boolean {
  return getFounderLabel(serializedFounderData) !== ''
}
```

- [ ] **Step 4: Run tests — verify GREEN**

Run: `cd athleteos-next && npx vitest run src/components/landing/landingFlow.test.ts`
Expected: ALL PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/landing/landingFlow.ts src/components/landing/landingFlow.test.ts
git commit -m "refactor: remove shouldShowSampleOutcome, add null-safe gate content"
```

---

### Task 3: Update supabase client + API route — make name and country optional

**Files:**
- Modify: `src/lib/supabase.ts`
- Modify: `src/app/api/founders/reserve/route.ts`

- [ ] **Step 1: Update FounderInsert interface**

In `src/lib/supabase.ts`, change `name` and `country` from required to optional:

```typescript
export interface FounderInsert {
  name?: string
  email: string
  whatsapp: string
  country?: string
  source: string
  discipline?: string
  experience?: string
  referrer_id?: string
}
```

- [ ] **Step 2: Update API route — make name optional**

In `src/app/api/founders/reserve/route.ts`:

1. Update `ReserveBody` interface — make `name` and `country` optional:
```typescript
interface ReserveBody {
  name?: string
  email: string
  whatsapp: string
  country?: string
  source: string
  discipline?: string
  experience?: string
  referrer_id?: string
}
```

2. Remove the name-required validation (lines 46-48):
```typescript
// DELETE these lines:
// if (!name?.trim()) {
//   return NextResponse.json({ error: 'Name is required' }, { status: 400 })
// }
```

3. Update `insertData` to default name to empty string:
```typescript
const insertData: Record<string, string> = {
  name: name?.trim() || '',
  email: email.trim(),
  whatsapp: whatsapp?.trim() || '',
  country: country?.trim() || '',
  source: source.trim(),
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `cd athleteos-next && npx tsc --noEmit --pretty 2>&1 | head -30`
Expected: No new errors from this change (callers may have type errors that get fixed in later tasks)

- [ ] **Step 4: Commit**

```bash
git add src/lib/supabase.ts src/app/api/founders/reserve/route.ts
git commit -m "refactor: make name and country optional in FounderInsert and API route"
```

---

**Note: Tasks 4–11 individually change component interfaces. TypeScript will not compile cleanly until Task 12 wires everything together in page.tsx. This is expected — each task is a focused, independently reviewable change.**

---

### Task 4: Rewrite HeroSection — ICP headline, no mode selector

**Files:**
- Modify: `src/components/landing/HeroSection.tsx`

- [ ] **Step 1: Rewrite HeroSection**

Replace the full component. Three elements only: headline, subheading, CTA button. No mode selector, no props.

```tsx
'use client'

export function HeroSection() {
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
          You train. You track.{' '}
          <span className="hero-gradient-word">Your total hasn&apos;t moved in months.</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground sm:text-xl max-w-xl mx-auto">
          AthleteOS finds the one variable actually holding you back — by reading your training, nutrition, and recovery as one system, not three apps.
        </p>
        <button
          type="button"
          onClick={handleCTA}
          className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-md bg-accent px-8 py-4 text-base font-bold text-white transition-colors hover:bg-accent-light"
          style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
        >
          See Where You Rank
        </button>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify no TypeScript errors in this file**

Run: `cd athleteos-next && npx tsc --noEmit --pretty 2>&1 | grep HeroSection`
Expected: May show errors in page.tsx (passing props to HeroSection that no longer exist) — that's expected, fixed in Task 9.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/HeroSection.tsx
git commit -m "feat: rewrite hero — ICP headline, product category, single CTA"
```

---

### Task 5: Create InsightPatternsSection

**Files:**
- Create: `src/components/landing/InsightPatternsSection.tsx`

- [ ] **Step 1: Create InsightPatternsSection.tsx**

```tsx
'use client'

import { motion } from 'framer-motion'
import { fadeUp } from '@/lib/motion'

const INSIGHT_PATTERNS = [
  {
    key: 'nutrition-timing',
    diagnostic: 'Your protein is on target but timed wrong relative to your training phase — surplus during deload, maintenance during accumulation.',
    explanation: 'Nutrient timing relative to periodization phase.',
    color: '#F59E0B',
  },
  {
    key: 'volume-ratio',
    diagnostic: 'Your squat volume went up 18% this block but your deadlift ratio dropped. Programming drift or fatigue?',
    explanation: 'Cross-lift ratio analysis within a training block.',
    color: 'var(--data-cyan, #00D9FF)',
  },
  {
    key: 'sleep-gap',
    diagnostic: 'You sleep 7.5 hours but only 6.1 on training days. That gap is where recovery debt compounds.',
    explanation: 'Training-day-specific recovery patterns.',
    color: '#2DDC8F',
  },
] as const

export function InsightPatternsSection() {
  return (
    <section className="px-6 py-20 md:px-10">
      <div className="mx-auto max-w-screen-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="font-mono-label text-accent mb-3">What the system actually reads</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            Your apps track numbers. This connects them.
          </h2>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          {INSIGHT_PATTERNS.map(({ key, diagnostic, explanation, color }, i) => (
            <motion.div
              key={key}
              {...fadeUp(0.1 + i * 0.08)}
              className="surface-card p-6"
            >
              <span
                className="mb-4 inline-block h-1.5 w-8 rounded-full"
                style={{ background: color }}
              />
              <p className="text-base font-semibold text-foreground leading-relaxed mb-3">
                {diagnostic}
              </p>
              <p className="text-sm text-muted-foreground">
                {explanation}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          {...fadeUp(0.35)}
          className="mt-8 text-center"
        >
          <a
            href="#sample-outcome"
            className="font-mono-label text-accent hover:text-accent-light transition"
          >
            See it in action ↓
          </a>
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `cd athleteos-next && npx tsc --noEmit --pretty 2>&1 | grep InsightPatterns`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/InsightPatternsSection.tsx
git commit -m "feat: add InsightPatternsSection — 3 diagnostic pattern cards"
```

---

### Task 6: Modify SampleOutcomeBlock — static demo mode, update CTA

**Files:**
- Modify: `src/components/landing/SampleOutcomeBlock.tsx`

- [ ] **Step 1: Add id anchor and update CTA copy**

Add `id="sample-outcome"` to the section element (line 46). Change CTA text from "Get mine →" to "Check yours →" (line 136).

In `src/components/landing/SampleOutcomeBlock.tsx`:
- Line 46: `<section className="px-4 py-20 sm:px-6 md:px-10">` → `<section id="sample-outcome" className="px-4 py-20 sm:px-6 md:px-10">`
- Line 136: `<a href="#rank" className="font-mono-label text-accent hover:text-accent-light transition">Get mine →</a>` → `<a href="#rank" className="font-mono-label text-accent hover:text-accent-light transition">Check yours →</a>`

- [ ] **Step 2: Verify no TypeScript errors**

Run: `cd athleteos-next && npx tsc --noEmit --pretty 2>&1 | grep SampleOutcome`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/SampleOutcomeBlock.tsx
git commit -m "feat: update SampleOutcomeBlock — add anchor id, update CTA copy"
```

---

### Task 7: Modify RankSection — add mode selector, onRankResult callback, reframe heading

**Files:**
- Modify: `src/components/landing/RankSection.tsx`

- [ ] **Step 1: Update RankSection interface and add mode selector**

Changes to `src/components/landing/RankSection.tsx`:

1. Update the props type (line 17) to add `onModeChange` and `onRankResult`:

```typescript
interface RankSectionProps {
  mode: AthleteMode
  onModeChange: (mode: AthleteMode) => void
  onRankResult: (result: RankResult) => void
}

export function RankSection({ mode, onModeChange, onRankResult }: RankSectionProps) {
```

2. Import `ModeSelector` at the top (add after other imports):

```typescript
import { ModeSelector } from './ModeSelector'
```

3. In the `submit` function, after `setResult(r)` (line 57), add `onRankResult(r)` and remove the `dispatchEvent` call (line 50) since no component listens for it anymore — `SignupGateSection` now gets `overallPct` via props:

```typescript
    localStorage.setItem('aos_rank_result', JSON.stringify(r))
    // Remove: window.dispatchEvent(new Event('aos-rank-result-changed'))
    trackEvent('rank_result_viewed', { ... })
    setResult(r)
    onRankResult(r)
```

4. Replace the section heading (line 76):

```tsx
<motion.p variants={staggerItem} className="font-mono-label text-accent mb-2">Step 1</motion.p>
<motion.h2 variants={staggerItem} className="text-3xl font-display font-bold text-foreground md:text-4xl">See where you stand</motion.h2>
```

5. Add `ModeSelector` between the heading and the AnimatePresence block. After the closing `</motion.div>` of the header (line 77), add:

```tsx
<div className="mb-8 flex items-center gap-3">
  <span className="text-sm text-muted-foreground">I train for</span>
  <ModeSelector mode={mode} onModeChange={onModeChange} />
</div>
```

- [ ] **Step 2: Verify component renders without TypeScript errors in isolation**

Run: `cd athleteos-next && npx tsc --noEmit --pretty 2>&1 | grep RankSection`
Expected: May show errors in page.tsx (not passing new props) — fixed in Task 9.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/RankSection.tsx
git commit -m "feat: add mode selector to RankSection, add onRankResult callback, reframe heading"
```

---

### Task 8: Create PersonalizedUpsellStrip

**Files:**
- Create: `src/components/landing/PersonalizedUpsellStrip.tsx`

- [ ] **Step 1: Create PersonalizedUpsellStrip.tsx**

```tsx
'use client'

import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import type { RankResult } from '@/lib/rankCalc'
import { fadeUp } from '@/lib/motion'

interface PersonalizedUpsellStripProps {
  rankResult: RankResult
}

function getWeakestLift(result: RankResult): { name: string; pct: number } {
  const lifts = [
    { name: 'Squat', pct: result.squat.percentile },
    { name: 'Bench', pct: result.bench.percentile },
    { name: 'Deadlift', pct: result.deadlift.percentile },
  ].filter(l => l.pct > 0)

  return lifts.reduce((min, l) => (l.pct < min.pct ? l : min), lifts[0])
}

function getStrongestLift(result: RankResult): { name: string; pct: number } {
  const lifts = [
    { name: 'Squat', pct: result.squat.percentile },
    { name: 'Bench', pct: result.bench.percentile },
    { name: 'Deadlift', pct: result.deadlift.percentile },
  ].filter(l => l.pct > 0)

  return lifts.reduce((max, l) => (l.pct > max.pct ? l : max), lifts[0])
}

const LOCKED_ROWS = [
  {
    key: 'LIMITER',
    label: 'Primary limiter',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.05)',
    border: 'rgba(245,158,11,0.18)',
  },
  {
    key: 'CORRECTION',
    label: 'What to fix',
    color: 'rgba(255,255,255,0.7)',
    bg: 'rgba(255,255,255,0.02)',
    border: 'rgba(255,255,255,0.09)',
  },
  {
    key: 'PROJECTED_GAIN',
    label: 'Expected outcome',
    color: '#2DDC8F',
    bg: 'rgba(45,220,143,0.05)',
    border: 'rgba(45,220,143,0.18)',
  },
] as const

export function PersonalizedUpsellStrip({ rankResult }: PersonalizedUpsellStripProps) {
  const weakest = getWeakestLift(rankResult)
  const strongest = getStrongestLift(rankResult)
  const topPct = 100 - rankResult.overallPct

  const limiterCopy = `Your ${strongest.name.toLowerCase()} is Top ${100 - strongest.pct}% but your ${weakest.name.toLowerCase()} is Top ${100 - weakest.pct}%. The full system read identifies whether the gap is training distribution, nutrition timing, or recovery debt — and tells you exactly what to change first.`

  const lockedContent: Record<string, string> = {
    LIMITER: limiterCopy,
    CORRECTION: `One specific change. Based on your numbers at ${rankResult.weightClass}, not a template.`,
    PROJECTED_GAIN: `6-week projection calibrated to your current training frequency and weight class.`,
  }

  return (
    <section className="px-6 py-16 md:px-10">
      <div className="mx-auto max-w-screen-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <p className="font-mono-label text-accent mb-2">Your diagnosis preview</p>
          <h3 className="text-2xl font-display font-bold text-foreground md:text-3xl">
            You&apos;re Top {topPct}%. Here&apos;s what the full read would tell you.
          </h3>
        </motion.div>

        {/* Real rank row */}
        <motion.div
          {...fadeUp(0.1)}
          className="rounded-2xl p-4 mb-3"
          style={{
            background: 'rgba(0,217,255,0.05)',
            border: '1px solid rgba(0,217,255,0.18)',
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] font-bold" style={{ color: 'var(--data-cyan, #00D9FF)', opacity: 0.9 }}>YOUR_RANK</p>
              <p className="font-mono-label text-muted-foreground/70 mt-1">Where you stand</p>
            </div>
            <span className="h-2 w-2 rounded-full mt-1" style={{ background: 'var(--data-cyan, #00D9FF)' }} />
          </div>
          <p className="mt-3 text-base font-bold text-foreground">
            Top {topPct}% of competitive strength athletes
          </p>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Squat · Top {100 - rankResult.squat.percentile}%
            {' '}  Bench · Top {100 - rankResult.bench.percentile}%
            {' '}  Deadlift · Top {100 - rankResult.deadlift.percentile}%
          </p>
        </motion.div>

        {/* Locked rows */}
        <div className="space-y-3">
          {LOCKED_ROWS.map(({ key, label, color, bg, border }, i) => (
            <motion.div
              key={key}
              {...fadeUp(0.15 + i * 0.06)}
              className="relative rounded-2xl p-4 overflow-hidden"
              style={{ background: bg, border: `1px solid ${border}` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] font-bold" style={{ color, opacity: 0.9 }}>{key}</p>
                  <p className="font-mono-label text-muted-foreground/70 mt-1">{label}</p>
                </div>
                <Lock className="w-3.5 h-3.5 mt-1 text-muted-foreground/40" />
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed" style={{ filter: 'blur(1px)' }}>
                {lockedContent[key]}
              </p>
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(5,5,6,0.6) 100%)' }}
              />
            </motion.div>
          ))}
        </div>

        <motion.div {...fadeUp(0.4)} className="mt-8 text-center">
          <a
            href="#inline-signup-gate"
            className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-accent px-8 py-4 text-base font-bold text-white transition-colors hover:bg-accent-light"
            style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
          >
            Unlock your full read
          </a>
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `cd athleteos-next && npx tsc --noEmit --pretty 2>&1 | grep PersonalizedUpsell`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/PersonalizedUpsellStrip.tsx
git commit -m "feat: add PersonalizedUpsellStrip — locked upsell with real rank data"
```

---

### Task 9: Rewrite SignupGateSection — simplify fields, always render

**Files:**
- Modify: `src/components/landing/SignupGateSection.tsx`

- [ ] **Step 1: Rewrite SignupGateSection**

Key changes:
1. Accept `overallPct: number | null` as a prop instead of reading from localStorage
2. Remove `name` and `country` fields from the form
3. Change WhatsApp to a plain text input with placeholder `+91 9XXXXXXXXX` and label
4. Always render — no `return null` when overallPct is null
5. Use `getInlineSignupGateContent(overallPct)` which now accepts null
6. Update CTA to "Reserve My Diagnosis"
7. Remove `COUNTRIES` array and country select
8. Update `insertFounder` call to omit name and country

Full replacement for `SignupGateSection.tsx`:

```tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Users } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import { validateFounderForm } from './founderFormValidation'
import { getFounderLabel, getInlineSignupGateContent } from './landingFlow'
import { GlassField } from './rank/SystemInput'
import { insertFounder } from '@/lib/supabase'

interface GateForm { email: string; whatsapp: string }

interface SignupGateSectionProps {
  overallPct: number | null
}

export function SignupGateSection({ overallPct }: SignupGateSectionProps) {
  const router = useRouter()
  const [form, setForm] = useState<GateForm>({ email: '', whatsapp: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState('')
  const [founderLabel, setFounderLabel] = useState('')

  useEffect(() => {
    const syncFounder = () => {
      setFounderLabel(getFounderLabel(localStorage.getItem('aos_founder_data')))
    }
    syncFounder()
    window.addEventListener('aos-founder-data-changed', syncFounder)
    return () => window.removeEventListener('aos-founder-data-changed', syncFounder)
  }, [])

  const gateContent = getInlineSignupGateContent(overallPct)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setApiError('')

    const validationErrors = validateFounderForm(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    const referrerId = typeof window !== 'undefined' ? localStorage.getItem('aos_referrer_id') : null
    const { data, error: apiErr } = await insertFounder({
      email: form.email.trim(),
      whatsapp: form.whatsapp.trim(),
      source: 'rank-gate',
      ...(referrerId ? { referrer_id: referrerId } : {}),
    })
    setLoading(false)
    if (apiErr) {
      setApiError(apiErr.message)
      return
    }

    localStorage.setItem('aos_waitlist', '1')
    localStorage.setItem('aos_founder_data', JSON.stringify({
      id: data.id, num: data.founder_number, shareCount: 0,
    }))
    trackEvent('signup_conversion', {
      overallPct: overallPct ?? 0,
      source: 'rank-gate',
    })
    window.dispatchEvent(new Event('aos-founder-data-changed'))
    router.push('/welcome')
  }

  if (founderLabel) {
    return (
      <section id="inline-signup-gate" className="section-fade-top px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-2xl">
          <div
            className="rounded-2xl p-6"
            style={{ background: 'rgba(45,220,143,0.05)', border: '1px solid rgba(45,220,143,0.2)' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(45,220,143,0.15)' }}
              >
                <Check className="w-3.5 h-3.5 text-success" />
              </div>
              <p className="font-bold text-foreground">You&apos;re in. {founderLabel}.</p>
            </div>
            <p className="mt-2 pl-9 text-sm text-muted-foreground">
              <a href="/welcome" className="text-accent hover:underline">Go to your welcome page →</a>
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="inline-signup-gate" className="section-fade-top px-6 py-16 md:px-10 md:py-20">
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="gate-panel rounded-lg p-6 md:p-8"
        >
          <div className="mb-6">
            <div className="mb-1.5 flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-accent" />
              <span className="font-mono-label text-accent">{gateContent.eyebrow}</span>
            </div>
            <p className="text-xl font-bold leading-snug text-foreground md:text-2xl">{gateContent.headline}</p>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {gateContent.productLine}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <GlassField
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={v => setForm(f => ({ ...f, email: v }))}
              error={errors.email}
            />
            <div>
              <GlassField
                type="tel"
                placeholder="+91 9XXXXXXXXX"
                value={form.whatsapp}
                onChange={v => setForm(f => ({ ...f, whatsapp: v }))}
                error={errors.whatsapp}
              />
              <p className="mt-1 text-xs text-muted-foreground/60">WhatsApp (for early access updates) · optional</p>
            </div>
            {apiError && <p className="font-mono text-xs text-destructive">{apiError}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer rounded-md bg-accent py-4 text-base font-bold text-white transition-all hover:bg-accent-light disabled:opacity-50 flex items-center justify-center gap-2 group"
              style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
            >
              {loading ? 'Submitting…' : (
                <>
                  Reserve My Diagnosis
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-4">
            {gateContent.trustChips.map(t => (
              <div key={t} className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-success flex-shrink-0" style={{ filter: 'drop-shadow(0 0 4px rgba(45,220,143,0.4))' }} />
                <span className="text-xs text-muted-foreground">{t}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `cd athleteos-next && npx tsc --noEmit --pretty 2>&1 | grep SignupGate`
Expected: May show error in page.tsx for missing prop — fixed in Task 12.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/SignupGateSection.tsx
git commit -m "feat: simplify signup gate — email + optional WhatsApp, always render, new CTA"
```

---

### Task 10: Rewrite SystemSection — concrete diagnostic chain messaging

**Files:**
- Modify: `src/components/landing/SystemSection.tsx`

- [ ] **Step 1: Rewrite SystemSection messaging**

Replace the heading, subheading, card content, and diagnosis output copy. Keep the existing layout structure and motion patterns.

Key changes:
- Line 57: Eyebrow stays "How athleteOS diagnoses the stall"
- Line 58: Heading changes from "Three inputs. One answer." → "Rank. Isolate. Correct. Track."
- Line 61: Subheading → "Your rank shows where you stand. The system finds the one variable holding you back, tells you what to change, and tracks whether it worked."
- Cards rewrite — describe what the system *does*:
  1. Key `rank`: eyebrow "Step 1", title "Competitive Rank", description "See where your lifts land against athletes in your weight class. Identify which lift is the gap."
  2. Key `isolate`: eyebrow "Step 2", title "Bottleneck Isolation", description "Training, nutrition, and recovery data read together to identify the one variable limiting progress."
  3. Key `correct`: eyebrow "Step 3", title "Correction + Tracking", description "One specific change to make. One metric to track. Re-read after each block to verify the fix landed."
- Diagnosis output heading: "One likely bottleneck. One next move." → "The output is a decision, not a dashboard."
- Diagnosis output copy: Update to focus on variable isolation
- CTA: "Start your first scan" → "See Where You Rank" (pointing to #rank)

- [ ] **Step 2: Verify no TypeScript errors**

Run: `cd athleteos-next && npx tsc --noEmit --pretty 2>&1 | grep SystemSection`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/SystemSection.tsx
git commit -m "feat: rewrite SystemSection — concrete diagnostic chain messaging"
```

---

### Task 11: Update StickyJoinBar — new CTA copy and anchor target

**Files:**
- Modify: `src/components/landing/StickyJoinBar.tsx`

- [ ] **Step 1: Update CTA copy and description**

In `src/components/landing/StickyJoinBar.tsx`:
- Line 46: `<p>` text → "Join founding members — reserve your full diagnosis"
- Line 52: `<span className="sm:hidden">` → "Reserve →"
- Line 53: `<span className="hidden sm:inline">` → "Reserve My Diagnosis"

- [ ] **Step 2: Verify no TypeScript errors**

Run: `cd athleteos-next && npx tsc --noEmit --pretty 2>&1 | grep StickyJoinBar`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/StickyJoinBar.tsx
git commit -m "feat: update StickyJoinBar — Reserve My Diagnosis CTA"
```

---

### Task 12: Rewire page.tsx — new section order, state lifting, delete old components

**Files:**
- Modify: `src/app/page.tsx`
- Delete: `src/components/landing/ConditionalSampleOutcome.tsx`
- Delete: `src/components/landing/LockedPreviewSection.tsx`

- [ ] **Step 1: Rewrite page.tsx**

```tsx
'use client'

import { useState, useEffect, Suspense } from 'react'
import type { AthleteMode } from '@/components/landing/ModeSelector'
import type { RankResult } from '@/lib/rankCalc'

import { FAQSection } from '@/components/landing/FAQSection'
import { Footer } from '@/components/landing/Footer'
import { HeroSection } from '@/components/landing/HeroSection'
import { InsightPatternsSection } from '@/components/landing/InsightPatternsSection'
import { NavBar } from '@/components/landing/NavBar'
import { PersonalizedUpsellStrip } from '@/components/landing/PersonalizedUpsellStrip'
import { ProblemSection } from '@/components/landing/ProblemSection'
import { RankSection } from '@/components/landing/RankSection'
import { ReferralEntryBanner } from '@/components/landing/ReferralEntryBanner'
import { SampleOutcomeBlock } from '@/components/landing/SampleOutcomeBlock'
import { SignupGateSection } from '@/components/landing/SignupGateSection'
import { StickyJoinBar } from '@/components/landing/StickyJoinBar'
import { SystemSection } from '@/components/landing/SystemSection'
import { TrustStrip } from '@/components/landing/TrustStrip'

export default function LandingV2() {
  const [mode, setMode] = useState<AthleteMode>('gym')
  const [rankResult, setRankResult] = useState<RankResult | null>(null)

  // Recover rank result from localStorage on mount (page reload recovery)
  useEffect(() => {
    const stored = localStorage.getItem('aos_rank_result')
    if (stored) {
      try {
        setRankResult(JSON.parse(stored))
      } catch { /* ignore corrupt data */ }
    }
  }, [])

  return (
    <div className="grid-bg relative min-h-screen antialiased">
      <NavBar />
      <StickyJoinBar />
      <Suspense fallback={null}>
        <ReferralEntryBanner />
      </Suspense>
      <main className="relative z-10 flex flex-col">
        <HeroSection />
        <InsightPatternsSection />
        <SampleOutcomeBlock />
        <RankSection mode={mode} onModeChange={setMode} onRankResult={setRankResult} />
        {rankResult && <PersonalizedUpsellStrip rankResult={rankResult} />}
        <SignupGateSection overallPct={rankResult?.overallPct ?? null} />
        <SystemSection />
        <ProblemSection />
        <TrustStrip />
        <FAQSection />
      </main>
      <Footer />
    </div>
  )
}
```

- [ ] **Step 2: Delete ConditionalSampleOutcome.tsx**

```bash
rm src/components/landing/ConditionalSampleOutcome.tsx
```

- [ ] **Step 3: Delete LockedPreviewSection.tsx**

```bash
rm src/components/landing/LockedPreviewSection.tsx
```

- [ ] **Step 4: Run full TypeScript check**

Run: `cd athleteos-next && npx tsc --noEmit --pretty`
Expected: No errors. All imports resolve, all props match.

- [ ] **Step 5: Verify the dev server starts**

Run: `cd athleteos-next && npx next build 2>&1 | tail -20`
Expected: Build succeeds

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx
git rm src/components/landing/ConditionalSampleOutcome.tsx src/components/landing/LockedPreviewSection.tsx
git commit -m "feat: rewire page layout — new section order, state lifting, remove ConditionalSampleOutcome and LockedPreviewSection"
```

---

### Task 13: Final verification — full test suite + build

- [ ] **Step 1: Run all tests**

Run: `cd athleteos-next && npx vitest run`
Expected: ALL PASS

- [ ] **Step 2: Run full build**

Run: `cd athleteos-next && npx next build`
Expected: Build succeeds with no errors

- [ ] **Step 3: Visual spot-check**

Run: `cd athleteos-next && npx next dev`
Manual check:
- Hero shows new headline, subheading, "See Where You Rank" CTA
- InsightPatternsSection renders 3 cards below hero
- SampleOutcomeBlock always visible with "Check yours →" CTA
- Calculator shows mode selector at top, "Step 1: See where you stand" heading
- After submitting lifts, PersonalizedUpsellStrip appears below with real numbers and locked rows
- SignupGateSection visible below (with generic headline before calc, tiered after calc)
- Only email + WhatsApp fields in signup
- SystemSection and ProblemSection appear as fallback sections
- StickyJoinBar shows "Reserve My Diagnosis"

- [ ] **Step 4: Final commit if any fixes needed**

```bash
git add -A && git commit -m "fix: address final verification issues"
```
