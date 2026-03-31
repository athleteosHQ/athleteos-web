# Landing Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the AthleteOS landing page from a 12-section encyclopedia to a product-first funnel: hero → calculator → share → signup gate.

**Architecture:** Strip HeroSection to 3 lines. Tighten RankSection post-result flow to 4 elements (was 7). Absorb PostResultBridge copy into InlineSignupGate. Replace CTASection (586 lines) with a 30-line CTA strip. Add share card mechanic. Fix referral attribution.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, Framer Motion, html2canvas, Supabase (via API routes)

**Spec:** `docs/superpowers/specs/2026-03-27-landing-page-redesign-design.md`

---

## File Map

### New files
| File | Responsibility |
|------|---------------|
| `src/components/landing/ShareActions.tsx` | Share + download rank card buttons with html2canvas capture |
| `src/components/landing/ConditionalSampleOutcome.tsx` | Client wrapper that hides SampleOutcomeBlock if `aos_rank_result` exists in localStorage |

### Modified files
| File | Current lines | Change summary |
|------|--------------|----------------|
| `src/app/page.tsx` | 137 | Remove 5 sections + 3 inline callouts + order classes. Add ConditionalSampleOutcome. Replace CTASection render. |
| `src/components/landing/HeroSection.tsx` | 136 → ~40 | Strip to headline + subline + CTA with scroll+focus handler |
| `src/components/landing/RankSection.tsx` | 675 | Replace heading. Remove ResultActions. Add ShareActions + InlineSignupGate tiered copy. Add id attrs. |
| `src/components/landing/CTASection.tsx` | 589 → ~30 | Gut to CTA strip with two anchor links |
| `src/components/landing/NavBar.tsx` | 90 | Remove 'Problem' and 'System' from nav links |
| `src/components/landing/StickyJoinBar.tsx` | 76 | Remove slot counter, change text, target `#inline-signup-gate` |
| `src/lib/supabase.ts` | 54 | Add `referrer_id` to FounderInsert |
| `src/app/api/founders/reserve/route.ts` | 91 | Add `referrer_id`, duplicate email 409, dynamic column retry |

---

## Task 1: Server-side — Referral attribution + duplicate email detection

**Files:**
- Modify: `src/lib/supabase.ts` (line 3-10 — FounderInsert interface)
- Modify: `src/app/api/founders/reserve/route.ts` (lines 4-11, 56-88 — ReserveBody + insert logic)

This is the launch blocker. Do it first so all signup changes can use it.

- [ ] **Step 1: Add `referrer_id` to FounderInsert interface**

In `athleteos-next/src/lib/supabase.ts`, add `referrer_id` to the interface:

```typescript
// src/lib/supabase.ts — line 10, add before closing brace
  referrer_id?: string
```

- [ ] **Step 2: Add `referrer_id` to ReserveBody in the API route**

In `athleteos-next/src/app/api/founders/reserve/route.ts`, add to interface (line 4-11):

```typescript
interface ReserveBody {
  name: string
  email: string
  whatsapp: string
  source: string
  discipline?: string
  experience?: string
  referrer_id?: string
}
```

- [ ] **Step 3: Pass `referrer_id` through to insertData**

In `athleteos-next/src/app/api/founders/reserve/route.ts`, after the existing optional field handling (around line 63), add:

```typescript
  if (body.referrer_id) insertData.referrer_id = body.referrer_id
```

- [ ] **Step 4: Add duplicate email detection (409)**

In `athleteos-next/src/app/api/founders/reserve/route.ts`, replace the error handling block (lines 71-88) with:

```typescript
  if (error) {
    // Duplicate email — Postgres unique constraint violation
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'This email is already registered' },
        { status: 409 }
      )
    }

    // Missing optional column — retry without it
    const msg = error.message ?? ''
    const missingCol = ['discipline', 'experience', 'referrer_id'].find(
      col => msg.includes(`Could not find the '${col}' column`)
    )
    if (missingCol) {
      const retryData = { ...insertData }
      delete retryData[missingCol]
      const { data: retryResult, error: retryError } = await supabaseAdmin
        .from('founders_waitlist')
        .insert(retryData)
        .select('id, founder_number')
        .single()

      if (retryError) {
        return NextResponse.json({ error: retryError.message }, { status: 500 })
      }
      return NextResponse.json({ id: retryResult.id, founder_number: retryResult.founder_number })
    }

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
```

- [ ] **Step 5: Verify TypeScript compiles**

Run: `cd athleteos-next && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 6: Commit**

```bash
cd athleteos-next && git add src/lib/supabase.ts src/app/api/founders/reserve/route.ts && git commit -m "feat: add referrer_id attribution + duplicate email 409 detection"
```

---

## Task 2: Strip HeroSection to 3 lines

**Files:**
- Modify: `src/components/landing/HeroSection.tsx` (full rewrite — 136 → ~40 lines)

- [ ] **Step 1: Rewrite HeroSection**

Replace the entire contents of `athleteos-next/src/components/landing/HeroSection.tsx` with:

```tsx
'use client'

import { motion } from 'framer-motion'

export function HeroSection() {
  const handleCTA = () => {
    document.getElementById('rank')?.scrollIntoView({ behavior: 'smooth' })
    setTimeout(() => {
      document.getElementById('rank-bw-input')?.focus()
    }, 500)
  }

  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl"
      >
        <h1 className="text-4xl font-display font-bold text-foreground sm:text-5xl md:text-6xl leading-tight">
          Your performance is stuck.
        </h1>
        <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
          We&apos;ll tell you exactly why.
        </p>
        <button
          onClick={handleCTA}
          className="cta-glow mt-8 inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 text-base font-bold text-white transition hover:bg-accent-light accent-glow"
        >
          Diagnose My Plateau
          <span className="text-white/60">↓</span>
        </button>
      </motion.div>
    </section>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `cd athleteos-next && npx tsc --noEmit`
Expected: No errors (ProductShowcase import removed — the component is unused elsewhere)

- [ ] **Step 3: Commit**

```bash
cd athleteos-next && git add src/components/landing/HeroSection.tsx && git commit -m "feat: strip HeroSection to 3 lines + scroll-to-rank CTA"
```

---

## Task 3: Gut CTASection to CTA Strip

**Files:**
- Modify: `src/components/landing/CTASection.tsx` (589 → ~30 lines)

- [ ] **Step 1: Replace CTASection with CTA Strip**

Replace the entire contents of `athleteos-next/src/components/landing/CTASection.tsx` with:

```tsx
'use client'

export function CTASection() {
  return (
    <section id="waitlist" className="py-12 px-6 text-center">
      <p className="text-sm text-muted-foreground mb-3">
        Haven&apos;t checked your rank yet?
      </p>
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <a
          href="#rank"
          className="font-mono-label text-accent hover:text-accent-light transition"
        >
          Check now →
        </a>
        <span className="text-muted-foreground/30">|</span>
        <a
          href="#inline-signup-gate"
          className="font-mono-label text-accent hover:text-accent-light transition"
        >
          Lock your spot →
        </a>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `cd athleteos-next && npx tsc --noEmit`
Expected: No errors. Unused imports (`insertFounder`, `incrementShareCount`, etc.) are gone with the full rewrite.

- [ ] **Step 3: Commit**

```bash
cd athleteos-next && git add src/components/landing/CTASection.tsx && git commit -m "feat: replace CTASection with lightweight CTA strip — no duplicate forms"
```

---

## Task 4: Update NavBar + StickyJoinBar

**Files:**
- Modify: `src/components/landing/NavBar.tsx` (line 69 — nav links array)
- Modify: `src/components/landing/StickyJoinBar.tsx` (full simplification)

- [ ] **Step 1: Update NavBar links**

In `athleteos-next/src/components/landing/NavBar.tsx`, find line 69:

```tsx
{(['Problem', 'System', 'Rank', 'Join'] as const).map(link => (
```

Replace with:

```tsx
{(['Rank', 'Join'] as const).map(link => (
```

- [ ] **Step 2: Simplify StickyJoinBar**

Replace the entire contents of `athleteos-next/src/components/landing/StickyJoinBar.tsx` with:

```tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function StickyJoinBar() {
  const [visible, setVisible] = useState(false)
  const [alreadyJoined] = useState(() =>
    typeof window !== 'undefined' && !!localStorage.getItem('aos_founder_data')
  )

  useEffect(() => {
    const onScroll = () => {
      const threshold = window.innerWidth < 768 ? 160 : 560
      setVisible(window.scrollY > threshold)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (alreadyJoined) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 72 }}
          animate={{ y: 0 }}
          exit={{ y: 72 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-white/8"
          style={{
            background: 'rgba(7,13,20,0.92)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          <div className="mx-auto flex max-w-screen-xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <p className="text-sm text-muted-foreground hidden sm:block">
              Lock founding member pricing
            </p>
            <a
              href="#inline-signup-gate"
              className="cta-glow ml-auto rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white transition hover:bg-accent-light"
            >
              <span className="sm:hidden">Lock spot</span>
              <span className="hidden sm:inline">Lock my spot →</span>
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 3: Verify build**

Run: `cd athleteos-next && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
cd athleteos-next && git add src/components/landing/NavBar.tsx src/components/landing/StickyJoinBar.tsx && git commit -m "feat: update NavBar links + simplify StickyJoinBar"
```

---

## Task 5: Create ShareActions component

**Files:**
- Create: `src/components/landing/ShareActions.tsx`

- [ ] **Step 1: Create ShareActions**

Create `athleteos-next/src/components/landing/ShareActions.tsx`:

```tsx
'use client'

import { useRef, useCallback } from 'react'
import type { RankResult } from '@/lib/rankCalc'
import { RankShareCard } from './RankShareCard'
import { trackEvent } from '@/lib/analytics'

interface ShareActionsProps {
  result: RankResult
  diagnosisLabel: string
  diagnosisHeadline: string
}

export function ShareActions({ result, diagnosisLabel, diagnosisHeadline }: ShareActionsProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const founderLabel = (() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('aos_founder_data') : null
      if (!raw) return ''
      const parsed = JSON.parse(raw)
      return parsed?.num ? `Founding Member #${parsed.num}` : ''
    } catch {
      return ''
    }
  })()

  const top = 100 - result.overallPct
  const shareText = `I'm in the top ${top}% of Indian strength athletes. Check yours → athleteos.in`

  const handleShare = useCallback(async () => {
    trackEvent('rank_card_shared', { top })
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText, url: 'https://athleteos.in' })
      } catch {
        // User cancelled — not an error
      }
    } else {
      await navigator.clipboard.writeText(`${shareText}\nhttps://athleteos.in`)
    }
  }, [shareText, top])

  const handleDownload = useCallback(async () => {
    trackEvent('rank_card_downloaded', { top })
    const { default: html2canvas } = await import('html2canvas')
    if (!cardRef.current) return
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: '#070D14',
      scale: 2,
      width: 1080,
      height: 1080,
    })
    const link = document.createElement('a')
    link.download = `athleteos-rank-top${top}pct.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }, [top])

  return (
    <>
      <div className="flex gap-3">
        <button
          onClick={handleShare}
          className="flex-1 rounded-xl border border-white/10 py-3 text-sm font-semibold text-muted-foreground transition hover:text-foreground hover:border-white/20"
        >
          Share My Rank
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 rounded-xl border border-white/10 py-3 text-sm font-semibold text-muted-foreground transition hover:text-foreground hover:border-white/20"
        >
          Download Card
        </button>
      </div>

      {/* Off-screen card for html2canvas capture */}
      <RankShareCard
        ref={cardRef}
        result={result}
        founderLabel={founderLabel}
        badgeLabel="Athlete"
        diagnosisLabel={diagnosisLabel}
        diagnosisHeadline={diagnosisHeadline}
      />
    </>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `cd athleteos-next && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
cd athleteos-next && git add src/components/landing/ShareActions.tsx && git commit -m "feat: add ShareActions with native share + html2canvas download"
```

---

## Task 6: Create ConditionalSampleOutcome wrapper

**Files:**
- Create: `src/components/landing/ConditionalSampleOutcome.tsx`

- [ ] **Step 1: Create ConditionalSampleOutcome**

Create `athleteos-next/src/components/landing/ConditionalSampleOutcome.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { SampleOutcomeBlock } from './SampleOutcomeBlock'

export function ConditionalSampleOutcome() {
  const [hasResult] = useState(() =>
    typeof window !== 'undefined' && !!localStorage.getItem('aos_rank_result')
  )
  if (hasResult) return null
  return <SampleOutcomeBlock />
}
```

- [ ] **Step 2: Verify build**

Run: `cd athleteos-next && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
cd athleteos-next && git add src/components/landing/ConditionalSampleOutcome.tsx && git commit -m "feat: add ConditionalSampleOutcome — hide sample after real result"
```

---

## Task 7: Rewrite RankSection — heading, result flow, InlineSignupGate

This is the largest task. It modifies `RankSection.tsx` to:
1. Replace the heading block
2. Add `id="rank-bw-input"` to bodyweight input
3. Remove `ResultActions` from result view, add reset to score card area
4. Add `ShareActions` to result view
5. Rewrite `InlineSignupGate` with tiered copy, `overallPct` prop, field-level errors, `referrer_id`, `aos_founder_data` check

**Files:**
- Modify: `src/components/landing/RankSection.tsx` (multiple sections)

- [ ] **Step 1: Add ShareActions import**

In `athleteos-next/src/components/landing/RankSection.tsx`, add after the existing imports (after line 13):

```typescript
import { ShareActions } from './ShareActions'
import { RankShareCard } from './RankShareCard'
```

Note: `RankShareCard` is not directly used in RankSection — it's rendered by `ShareActions`. But we need `getFirstReadDiagnosis` which is already imported (line 10). Remove the `RankShareCard` import — it's not needed here. Only add:

```typescript
import { ShareActions } from './ShareActions'
```

- [ ] **Step 2: Add `error` prop to GlassField**

In `athleteos-next/src/components/landing/RankSection.tsx`, replace `GlassField` (lines 43-64) with:

```tsx
function GlassField({ type, placeholder, value, onChange, error }: {
  type: string; placeholder: string; value: string; onChange: (v: string) => void; error?: string
}) {
  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-xl font-sans text-sm text-foreground placeholder:text-muted-foreground/50 transition-all focus:outline-none"
        style={{
          background: 'rgba(11,17,24,0.8)',
          border: `1px solid ${error ? 'rgba(226,75,74,0.5)' : 'rgba(255,255,255,0.10)'}`,
          borderRadius: 12,
          padding: '12px 14px',
        }}
        onFocus={e => { e.target.style.borderColor = 'rgba(127,178,255,0.48)'; e.target.style.boxShadow = '0 0 0 3px rgba(127,178,255,0.08)' }}
        onBlur={e => { e.target.style.borderColor = error ? 'rgba(226,75,74,0.5)' : 'rgba(255,255,255,0.10)'; e.target.style.boxShadow = 'none' }}
      />
      {error && <p className="mt-1 font-mono text-xs text-destructive">{error}</p>}
    </div>
  )
}
```

- [ ] **Step 3: Remove `ResultActions` component**

Delete lines 200-222 (the `ResultActions` function). It will be replaced by a small reset link in the result view and the share buttons.

- [ ] **Step 4: Rewrite `InlineSignupGate` with tiered copy and referrer_id**

Replace lines 325-469 (the entire `InlineSignupGate` function and `GateForm` interface) with:

```tsx
function InlineSignupGate({ overallPct }: { overallPct: number }) {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState('')

  const [founderData] = useState<{ num: number } | null>(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('aos_founder_data') : null
      if (!raw) return null
      const parsed = JSON.parse(raw)
      return parsed?.num ? { num: parsed.num } : null
    } catch {
      return null
    }
  })

  if (founderData) {
    return (
      <div
        id="inline-signup-gate"
        className="rounded-2xl p-5"
        style={{ background: 'rgba(45,220,143,0.05)', border: '1px solid rgba(45,220,143,0.2)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(45,220,143,0.15)' }}
          >
            <Check className="w-3.5 h-3.5 text-success" />
          </div>
          <p className="font-bold text-foreground">
            You&apos;re in. Founding Member #{founderData.num}.
          </p>
        </div>
        <p className="text-sm text-muted-foreground mt-2 pl-9">
          <a href="/welcome" className="text-accent hover:underline">Go to your welcome page →</a>
        </p>
      </div>
    )
  }

  const headline =
    overallPct >= 90
      ? "You're ahead. Now see what separates you from the top 1%."
      : overallPct >= 60
        ? "You're closer than you think. See the one thing holding you back."
        : "Your starting point is clear. See the fastest path up."

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

    const referrerId = typeof window !== 'undefined'
      ? localStorage.getItem('aos_referrer_id')
      : null

    const { data, error: apiErr } = await insertFounder({
      name: form.name.trim(),
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
    router.push('/welcome')
  }

  return (
    <motion.div
      id="inline-signup-gate"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="rounded-2xl p-6"
      style={{
        background: 'linear-gradient(135deg, rgba(255,122,47,0.08) 0%, rgba(255,255,255,0.02) 60%)',
        border: '1px solid rgba(255,122,47,0.22)',
        boxShadow: '0 0 40px rgba(255,122,47,0.06)',
      }}
    >
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1.5">
          <Users className="w-3.5 h-3.5 text-accent" />
          <span className="font-mono-label text-accent">Founding members · first access</span>
        </div>
        <p className="text-lg font-bold text-foreground leading-snug">
          {headline}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          athleteOS connects training, nutrition, and recovery into one diagnosis.
          <br />No payment now. Founding price locked at ₹4,999/year.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2.5">
        <div className="grid sm:grid-cols-2 gap-2.5">
          <GlassField
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={v => setForm(f => ({ ...f, name: v }))}
            error={errors.name}
          />
          <GlassField
            type="tel"
            placeholder="WhatsApp number"
            value={form.whatsapp}
            onChange={v => setForm(f => ({ ...f, whatsapp: v }))}
            error={errors.whatsapp}
          />
        </div>
        <GlassField
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={v => setForm(f => ({ ...f, email: v }))}
          error={errors.email}
        />
        {apiError && <p className="font-mono text-xs text-destructive">{apiError}</p>}
        <button
          type="submit"
          disabled={loading}
          id="gate-name-input"
          className="cta-glow w-full rounded-xl bg-accent py-3.5 font-bold text-white transition hover:bg-accent-light accent-glow disabled:opacity-50 flex items-center justify-center gap-2 group"
        >
          {loading ? 'Locking…' : (
            <>
              Lock My Spot — Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3">
        {['No payment now', 'Cancel anytime', 'Price locked forever'].map(t => (
          <div key={t} className="flex items-center gap-1.5">
            <Check className="w-3 h-3 text-success flex-shrink-0" />
            <span className="text-xs text-muted-foreground">{t}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 5: Replace RankSection heading block**

In `athleteos-next/src/components/landing/RankSection.tsx`, find the heading block (starts around line 514 after previous edits — the `motion.div` containing "Step 1 · Free rank check", `<h2>Know where you stand.`, the paragraph, and the chip badges). Replace the entire heading `<motion.div>` with:

```tsx
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            Where do you stand?
          </h2>
        </motion.div>
```

- [ ] **Step 6: Add `id="rank-bw-input"` to bodyweight input**

Find the bodyweight `<GlassInput>` (the one with `placeholder="kg"` and `value={f.bw}`). Add `id` by changing the `GlassInput` component to accept an optional `id` prop, OR add it directly. The simplest approach: wrap the bodyweight input area. Find:

```tsx
<GlassInput placeholder="kg" value={f.bw} onChange={upd('bw')} min={40} max={250} step={0.5} />
```

Add `id` prop to `GlassInput`. Update the `GlassInput` function signature to accept `id?: string` and pass it to the `<input>`:

```tsx
function GlassInput({ label, value, onChange, placeholder, min, max, step, id }: {
  label?: string; value: string; onChange: (v: string) => void
  placeholder: string; min?: number; max?: number; step?: number; id?: string
}) {
  return (
    <input
      id={id}
      type="number"
      // ... rest unchanged
```

Then update the bodyweight usage:

```tsx
<GlassInput id="rank-bw-input" placeholder="kg" value={f.bw} onChange={upd('bw')} min={40} max={250} step={0.5} />
```

- [ ] **Step 7: Update result view layout**

Find the result view section (the `motion.div` with `key="result"`). Replace its children with the tightened 4-element flow:

```tsx
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="space-y-5"
            >
              <div className="grid md:grid-cols-2 gap-6 items-start">
                <div>
                  <AthleteScoreCard
                    score={result.athleteScore}
                    systemStatus={result.tier}
                    percentileLabel={`Top ${100 - result.overallPct}% of competitive Indian strength athletes`}
                    animate={false}
                    metrics={[
                      { label: 'Strength',  value: result.squat.estimated1RM > 0    ? `Top ${100 - result.squat.percentile}%`    : '—', status: result.squat.percentile >= 60    ? 'up' : result.squat.percentile >= 30    ? 'neutral' : 'down' },
                      { label: 'Bench',     value: result.bench.estimated1RM > 0    ? `Top ${100 - result.bench.percentile}%`    : '—', status: result.bench.percentile >= 60    ? 'up' : result.bench.percentile >= 30    ? 'neutral' : 'down' },
                      { label: 'Deadlift',  value: result.deadlift.estimated1RM > 0 ? `Top ${100 - result.deadlift.percentile}%` : '—', status: result.deadlift.percentile >= 60 ? 'up' : result.deadlift.percentile >= 30 ? 'neutral' : 'down' },
                      ...(result.run5k ? [{ label: '5K Run', value: `Top ${100 - result.run5k.percentile}%`, status: (result.run5k.percentile >= 60 ? 'up' : result.run5k.percentile >= 30 ? 'neutral' : 'down') as 'up' | 'neutral' | 'down' }] : []),
                    ]}
                  />
                  <button
                    onClick={reset}
                    className="mt-3 text-sm text-muted-foreground hover:text-foreground transition"
                  >
                    ↩ Check again
                  </button>
                </div>
                <div className="space-y-4">
                  <DiagnosticBars result={result} />
                  <ResultInsightPanel result={result} />
                </div>
              </div>

              <ShareActions
                result={result}
                diagnosisLabel={(() => {
                  const d = getFirstReadDiagnosis(result)
                  return d?.label ?? 'DIAGNOSIS'
                })()}
                diagnosisHeadline={(() => {
                  const d = getFirstReadDiagnosis(result)
                  return d?.headline ?? ''
                })()}
              />

              <InlineSignupGate overallPct={result.overallPct} />
            </motion.div>
```

- [ ] **Step 8: Verify build**

Run: `cd athleteos-next && npx tsc --noEmit`
Expected: No errors. Fix any issues from the edits (e.g., unused imports — remove `Activity` from lucide imports if no longer used after heading removal).

- [ ] **Step 9: Commit**

```bash
cd athleteos-next && git add src/components/landing/RankSection.tsx && git commit -m "feat: tighten RankSection — 4-element result flow, tiered signup gate, share actions"
```

---

## Task 8: Restructure page.tsx

**Files:**
- Modify: `src/app/page.tsx` (full rewrite — 137 → ~25 lines)

- [ ] **Step 1: Rewrite page.tsx**

Replace the entire contents of `athleteos-next/src/app/page.tsx` with:

```tsx
import { NavBar }          from '@/components/landing/NavBar'
import { HeroSection }     from '@/components/landing/HeroSection'
import { RankSection }     from '@/components/landing/RankSection'
import { CTASection }      from '@/components/landing/CTASection'
import { FAQSection }      from '@/components/landing/FAQSection'
import { TrustStrip }      from '@/components/landing/TrustStrip'
import { StickyJoinBar }   from '@/components/landing/StickyJoinBar'
import { Footer }          from '@/components/landing/Footer'
import { ReferralEntryBanner } from '@/components/landing/ReferralEntryBanner'
import { ConditionalSampleOutcome } from '@/components/landing/ConditionalSampleOutcome'

export default function LandingV2() {
  return (
    <div className="grid-bg relative min-h-screen antialiased">
      <NavBar />
      <StickyJoinBar />
      <ReferralEntryBanner />
      <main className="relative z-10 flex flex-col">
        <HeroSection />
        <RankSection />
        <ConditionalSampleOutcome />
        <CTASection />
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
Expected: No errors. The removed imports (ProblemSection, SystemSection) are simply gone — their files remain on disk but are unused.

- [ ] **Step 3: Commit**

```bash
cd athleteos-next && git add src/app/page.tsx && git commit -m "feat: restructure page.tsx — linear flow, no order classes, no filler sections"
```

---

## Task 9: Final verification

- [ ] **Step 1: Full TypeScript check**

Run: `cd athleteos-next && npx tsc --noEmit`
Expected: Clean — 0 errors

- [ ] **Step 2: Dev server smoke test**

Run: `cd athleteos-next && npm run dev`

Manual checks:
1. Fresh visit → hero shows 3 lines + CTA, fills ~70vh
2. CTA click → smooth scroll to `#rank`, bodyweight input focused
3. First-time visitor → SampleOutcomeBlock visible below calculator
4. Complete rank calculation → 4-element result: score card, diagnostics, share buttons, signup gate
5. InlineSignupGate headline varies by percentile
6. Share button → native share / clipboard
7. Download button → PNG download
8. Signup → redirects to `/welcome`
9. Returning visitor (has `aos_rank_result`) → SampleOutcomeBlock hidden
10. Already signed up → gate shows "You're in. Founding Member #X"
11. CTAStrip links work (`#rank`, `#inline-signup-gate`)
12. NavBar: only Rank + Join links
13. StickyJoinBar: "Lock founding member pricing", targets `#inline-signup-gate`
14. `?ref=abc` → ReferralEntryBanner shows, then signup sends referrer_id
15. Mobile: hero CTA reachable without scroll

- [ ] **Step 3: Final commit if any fixes needed**

```bash
cd athleteos-next && git add -A && git commit -m "fix: address verification issues from landing page redesign"
```

Only run this step if Step 2 revealed issues that needed fixing.
