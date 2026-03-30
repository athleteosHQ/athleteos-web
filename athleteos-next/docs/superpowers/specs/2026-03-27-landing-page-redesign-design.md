# Landing Page Redesign: Product-First Experience

**Date:** 2026-03-27
**Status:** Draft (Rev 3 — post PM/VC review)
**Decision:** Option B — minimal hero + immediate rank calculator

---

## Problem

The current landing page has ~12 sections of explanatory content (ProblemSection, SystemSection, PillarStrip, inline callouts) that create an encyclopedia feel. Users read *about* athleteOS instead of *experiencing* it. The rank calculator — the actual product hook — sits below marketing content that serious athletes skip or bounce from.

## Goal

Users reach the rank calculator within 3 seconds of landing. Signup form is visible within ONE scroll of the result. No duplicate forms. No filler between value delivery and conversion.

## Design Principle

> The hero doesn't sell the product. It sells the result.
> Between result and signup: nothing that doesn't drive conversion.

---

## Implementation Priority

| # | Change | Why it matters most |
|---|--------|---------------------|
| 1 | Fix HeroSection (3 lines max) | First impression. Determines if anyone scrolls at all. |
| 2 | Tighten post-result flow (4 elements, not 7) | Every extra scroll between result and signup loses 15-20% of mobile users. |
| 3 | Reframe InlineSignupGate (absorb bridge copy) | The gate IS the bridge. One component, not two. |
| 4 | Add share card mechanic to RankSection | Virality happens at peak emotion (right after result). Currently missing. |
| 5 | Replace CTASection with CTA Strip | No duplicate forms. One lightweight nudge back to the gate or calculator. |
| 6 | Fix referral attribution | Launch blocker. `aos_referrer_id` is captured but never sent on signup. |

Supporting changes (sections removed, page.tsx restructure, NavBar, StickyJoinBar) are executed alongside these priorities.

---

## Page Structure (New)

| Order | Component | Purpose |
|-------|-----------|---------|
| 1 | HeroSection | One headline + one CTA. Scrolls to calculator. |
| 2 | RankSection | The product. Calculator → result → share → signup gate. |
| 3 | SampleOutcomeBlock | Shows what the full system does. **Conditional:** only visible if user has NOT submitted the calculator. Hidden after result is displayed. |
| 4 | CTAStrip | Lightweight nudge: "Haven't checked your rank?" + "Lock your spot" links. No form. |
| 5 | TrustStrip | Data credibility (IFCT 2017, IPF, 3200+ athletes). |
| 6 | FAQSection | Objection handling. |
| 7 | Footer | Standard footer. |

Same order on mobile and desktop. No `order-*` responsive reordering needed.

---

## Priority 1: HeroSection — 3 Lines Max

### What changes

Strip from ~137 lines to ~40 lines.

**Remove:**
- ProductShowcase image + its import
- 3-step process flow ("Enter lifts → Get your rank → See your diagnosis")
- "IPF-calibrated benchmark" callout
- All subtitles, body text, social proof chips

**What remains — exactly this, nothing more:**

```
Headline: Your performance is stuck.
Subline:  We'll tell you exactly why.
CTA:      [Diagnose My Plateau ↓]
```

- ~70vh on mobile, centered vertically
- Dark background, sharp typography, subtle fade-in on load
- CTA smooth-scrolls to `#rank`
- After scroll completes (~500ms), programmatically `.focus()` the bodyweight input in RankSection. This is the ONLY auto-focus trigger — no IntersectionObserver.

### Behavior

```typescript
const handleCTA = () => {
  document.getElementById('rank')?.scrollIntoView({ behavior: 'smooth' })
  setTimeout(() => {
    document.getElementById('rank-bw-input')?.focus()
  }, 500)
}
```

RankSection must add `id="rank-bw-input"` to the bodyweight `<input>`.

---

## Priority 2: Tighten Post-Result Flow

### Problem with previous spec

The previous spec stacked 7 elements between the result and the signup form:
1. AthleteScoreCard → 2. DiagnosticBars → 3. ResultInsightPanel → 4. ResultActions → 5. ShareActions → 6. PostResultBridge → 7. InlineSignupGate

On mobile, this is 4-5 scroll heights. The excitement window after seeing your rank is ~10 seconds. That flow burns it.

### New post-result flow (4 elements)

```
1. AthleteScoreCard (the big number — your rank)
2. DiagnosticBars + ResultInsightPanel (combined into one panel)
3. ShareActions (share + download — at peak emotion)
4. InlineSignupGate (immediately after share, no bridge)
```

**Specific changes:**

- **Remove `ResultActions` as a separate panel.** Move the "Check again" reset button to a small text link inside the AthleteScoreCard header. Not its own component.
- **Remove `PostResultBridge` entirely.** Its best copy line is absorbed into the InlineSignupGate headline (see Priority 3). A separate bridge between share and signup is a momentum killer.
- **Combine DiagnosticBars + ResultInsightPanel** into one visual panel. The bars and the text insight are about the same thing (your lift breakdown). Rendering them as separate panels with separate animations doubles the scroll without adding information.

### Result view layout (inside RankSection)

```tsx
{/* Result view — replaces the form */}
<div className="space-y-5">
  <div className="grid md:grid-cols-2 gap-6 items-start">
    <AthleteScoreCard ... resetButton={<button onClick={reset}>Check again</button>} />
    <div className="space-y-4">
      <DiagnosticBars result={result} />
      <ResultInsightPanel result={result} />
    </div>
  </div>
  <ShareActions result={result} ... />
  <InlineSignupGate />
</div>
```

The signup form is visible within ONE scroll of the result on mobile.

---

## Priority 3: InlineSignupGate — Absorb Bridge Copy

### Location

Inside `RankSection.tsx`, rendered immediately after `ShareActions` in the result view. No intermediate bridge component.

### Copy — absorbs PostResultBridge's best line

The gate headline varies by tier (this is where PostResultBridge's tiered copy lives now):

| Percentile | Eyebrow | Headline |
|------------|---------|----------|
| 90+ | "Founding members · first access" | "You're ahead. Now see what separates you from the top 1%." |
| 60-89 | "Founding members · first access" | "You're closer than you think. See the one thing holding you back." |
| <60 | "Founding members · first access" | "Your starting point is clear. See the fastest path up." |

**Below the headline (same for all tiers):**

```
athleteOS connects training, nutrition, and recovery into one diagnosis.
No payment now. Founding price locked at ₹4,999/year.
```

**Props change:** `InlineSignupGate` now takes `overallPct: number` to select the tiered headline.

### Form fields (3 only)

| Field | Type | Placeholder | Validation | ID |
|-------|------|-------------|------------|----|
| Name | text | "Your name" | Non-empty | `gate-name-input` |
| Email | email | "Email address" | Valid email regex | — |
| WhatsApp | tel | "WhatsApp number" | 10-15 digit phone regex | — |

Wrapper gets `id="inline-signup-gate"`.

Two-column on sm+: `[Name] [WhatsApp]` on first row, `[Email]` full-width on second row.

### Button

```
[Lock My Spot — Free]
```

### Trust chips

```
No payment now · Cancel anytime · Price locked forever
```

### Remove

- "29% OFF" badge — discount language cheapens the product
- "Founding cohort · 500 spots" — artificial scarcity

### Submit flow

1. Client-side validation via `validateFounderForm` (reduced — no discipline/experience)
2. Call `insertFounder({ name, email, whatsapp, source: 'rank-gate', referrer_id })` — **note: `referrer_id` is new** (Priority 6)
3. On success:
   - Store `aos_founder_data` in localStorage: `{ id, num: founder_number, shareCount: 0 }`
   - Store `aos_waitlist: '1'` in localStorage
   - `router.push('/welcome')`
4. On error: display error below each field, keep form state

### Error states

| Error | Display |
|-------|---------|
| Network failure | "Network error — please try again" |
| Duplicate email | Route returns **409** with `{ error: "This email is already registered" }`. See Priority 6. |
| Invalid input | Field-level validation errors below each field |
| Generic server error | "Something went wrong. Please try again." |

### Field-level errors

Add an optional `error?: string` prop to `GlassField` in `RankSection.tsx`, matching the `CTASection.tsx` pattern (red border when set, error `<p>` below input).

Change validation from single-string to per-field error state:

```typescript
const [errors, setErrors] = useState<Record<string, string>>({})

// On submit:
const validationErrors = validateFounderForm(form)
if (Object.keys(validationErrors).length > 0) {
  setErrors(validationErrors)
  return
}
```

### Already-signed-up state

**Source of truth:** `aos_founder_data` in localStorage (NOT `aos_waitlist`).

```typescript
const getFounderData = (): { num: number } | null => {
  try {
    const raw = localStorage.getItem('aos_founder_data')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.num ? { num: parsed.num } : null
  } catch {
    return null
  }
}
```

If founder data exists and parses:

```
✓ You're in. Founding Member #23.
  [Go to your welcome page →]
```

If parse fails or key missing: show the form (graceful fallback).

**Note:** Replace the existing `aos_waitlist` check (line 334) with this `aos_founder_data` check.

---

## Priority 4: Share Card Mechanic in RankSection

The `RankShareCard` component exists but is NOT rendered anywhere on the landing page. Users see their rank at peak emotion and have no way to share.

### What to add

Inside the result view, between the DiagnosticBars/InsightPanel and InlineSignupGate:

```
[Share My Rank]  [Download Card]
```

**Behavior:**

1. **"Share My Rank"** — `navigator.share` on mobile, copy-link on desktop
   - Share text: `"I'm in the top ${100 - overallPct}% of Indian strength athletes. Check yours → athleteos.in"`
   - Share URL: `https://athleteos.in`

2. **"Download Card"** — `html2canvas` captures off-screen `RankShareCard`, triggers download
   - Filename: `athleteos-rank-top${100 - overallPct}pct.png`

### Implementation

- Render `RankShareCard` off-screen (existing pattern: `position: fixed; left: -9999`)
- Internal constants (resolved inside component, NOT props):
  - `founderLabel`: read from `aos_founder_data` → `"Founding Member #${num}"`, or `""` if not signed up
  - `badgeLabel`: `"Athlete"` (hardcoded)
- Props: `result: RankResult`, `diagnosisLabel: string`, `diagnosisHeadline: string`
- Track analytics: `rank_card_shared`, `rank_card_downloaded`
- Buttons NOT gated behind signup — share first, signup after

### New file: `src/components/landing/ShareActions.tsx` (~80 lines)

---

## Priority 5: Replace CTASection with CTA Strip

### Problem with previous spec

The previous spec kept a full `CTASection` (~200 lines) with the same 3 fields as `InlineSignupGate`. Two identical forms on one page creates confusion ("Do I need to fill both?") and signals desperation, not premium.

### Solution: CTA Strip (~30 lines)

Replace the full `CTASection` with a lightweight strip. No form. Just two links:

```tsx
<section id="waitlist" className="py-12 px-6 text-center">
  <p className="text-sm text-muted-foreground mb-3">
    Haven't checked your rank yet?
  </p>
  <div className="flex items-center justify-center gap-4 flex-wrap">
    <a href="#rank" className="font-mono-label text-accent hover:text-accent-light transition">
      Check now →
    </a>
    <span className="text-muted-foreground/30">|</span>
    <a href="#inline-signup-gate" className="font-mono-label text-accent hover:text-accent-light transition">
      Lock your spot →
    </a>
  </div>
</section>
```

**Key details:**
- Keeps `id="waitlist"` so the `#join` NavBar link still works
- Scrolls user to either the calculator (if they haven't used it) or the inline gate (if they have)
- ~30 lines replaces ~586 lines. No duplicate form. No dead code.

### What happens to CTASection.tsx

The file is gutted to this strip. All removed code:
- `FounderSuccess` (dead code)
- Perks grid, `SlotCounter`, `ChipToggle`
- `MAX_BOOSTS`, `BOOST_SPOTS`, `MAX_FOUNDERS` constants
- `FOUNDING_PERKS`, `DISCIPLINE_OPTIONS`, `EXPERIENCE_OPTIONS` arrays
- `incrementShareCount`, `getFounderCount` imports (dead)
- All share-to-boost handlers
- The full 3-field signup form (now only in InlineSignupGate)

---

## Priority 6: Referral Attribution Fix — Launch Blocker

### Current state

1. `ReferralEntryBanner.tsx` detects `?ref=` URL param and stores `aos_referrer_id` in localStorage
2. `InlineSignupGate` does NOT read or send `aos_referrer_id` on signup
3. The `founders_waitlist` table may or may not have a `referrer_id` column

### Required changes

#### Client side (`insertFounder` in `src/lib/supabase.ts`)

Add optional `referrer_id` field to `FounderInsert`:

```typescript
export interface FounderInsert {
  name: string
  email: string
  whatsapp: string
  source: string
  discipline?: string
  experience?: string
  referrer_id?: string   // NEW
}
```

#### InlineSignupGate

Before calling `insertFounder`, read referrer from localStorage:

```typescript
const referrerId = typeof window !== 'undefined'
  ? localStorage.getItem('aos_referrer_id')
  : null

await insertFounder({
  name, email, whatsapp,
  source: 'rank-gate',
  ...(referrerId ? { referrer_id: referrerId } : {}),
})
```

#### Server side (`/api/founders/reserve/route.ts`)

Add `referrer_id` to `ReserveBody` and pass through to insert:

```typescript
interface ReserveBody {
  name: string
  email: string
  whatsapp: string
  source: string
  discipline?: string
  experience?: string
  referrer_id?: string   // NEW
}
```

```typescript
if (body.referrer_id) insertData.referrer_id = body.referrer_id
```

#### Duplicate email detection (NEW)

Supabase/Postgres returns error code `23505` for unique violations. Return 409:

```typescript
if (error) {
  if (error.code === '23505') {
    return NextResponse.json(
      { error: 'This email is already registered' },
      { status: 409 }
    )
  }
  // ... existing retry logic ...
}
```

#### Database — missing column retry

Replace the hardcoded retry object with a dynamic approach:

```typescript
if (error) {
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

---

## Supporting Changes

### Sections Removed from page.tsx

| Section | File | Reason |
|---------|------|--------|
| ProblemSection | `ProblemSection.tsx` | Research paper feel. Explains instead of demonstrating. |
| SystemSection | `SystemSection.tsx` | Explains product architecture. User should experience it. |
| PillarStrip | `PillarStrip.tsx` | Stats strip nobody processes mid-scroll. |
| "Why athletes join" callout | inline in `page.tsx` | Text connector between removed sections. |
| "Why this matters" bridge | inline in `page.tsx` | Text connector between removed sections. |
| Credibility strip ("Built by athletes...") | inline in `page.tsx` | Inline callout between removed sections. |

Files are NOT deleted — imports and rendering removed from `page.tsx`.

### RankSection heading

Replace the entire heading block (lines 519-541). Remove: "Step 1 · Free rank check" label, `<h2>` "Know where you stand.", descriptive paragraph, chip badges.

Replace with: **"Where do you stand?"** — a question, not an instruction. Matches the hero's diagnostic framing. Preserves the intelligence positioning without sounding like a generic calculator.

### SampleOutcomeBlock — conditional rendering

**Show only if user has NOT submitted the calculator.** Once the result is displayed, SampleOutcomeBlock is hidden — the user already experienced the real product. Showing a hypothetical outcome after a real one creates cognitive dissonance.

Implementation: SampleOutcomeBlock stays as-is, but `page.tsx` wraps it in a client component that checks `aos_rank_result` in localStorage. If present, the block is hidden.

```tsx
// src/components/landing/ConditionalSampleOutcome.tsx (~15 lines)
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

### NavBar

Update nav links: remove `'Problem'` and `'System'`. Keep: `['Rank', 'Join']`.

### StickyJoinBar

- Remove slot counter
- Replace text: "Lock founding member pricing"
- CTA scrolls to `#inline-signup-gate`
- Keep scroll-threshold logic, localStorage hide check

### page.tsx — final structure

```tsx
<ReferralEntryBanner />
<NavBar />
<HeroSection />
<RankSection />
<ConditionalSampleOutcome />
<CTAStrip />                   {/* ~30 lines, id="waitlist" */}
<TrustStrip />
<FAQSection />
<StickyJoinBar />
<Footer />
```

Remove all `order-*` responsive classes, section-line dividers, inline callout divs.

---

## Files Summary

### New files

| File | Purpose | ~Lines |
|------|---------|--------|
| `src/components/landing/ShareActions.tsx` | Share + download card buttons with html2canvas | ~80 |
| `src/components/landing/ConditionalSampleOutcome.tsx` | Show SampleOutcomeBlock only pre-result | ~15 |

### Modified files

| File | Change |
|------|--------|
| `src/app/page.tsx` | Remove 5 sections + 3 inline callouts + dividers + order classes. Add ConditionalSampleOutcome. Replace CTASection with CTAStrip. Linear flow. |
| `src/components/landing/HeroSection.tsx` | Strip to 3 lines + CTA with auto-focus handler (~40 lines). Remove ProductShowcase import. |
| `src/components/landing/RankSection.tsx` | Replace heading → "Where do you stand?". Add `id="rank-bw-input"`. Tighten result view to 4 elements. Absorb bridge copy into InlineSignupGate. Add ShareActions + off-screen RankShareCard. Add `overallPct` prop to InlineSignupGate. |
| `src/components/landing/CTASection.tsx` | Gut to ~30-line CTA strip. Remove all form code, imports, constants. Keep `id="waitlist"`. |
| `src/components/landing/NavBar.tsx` | Remove `'Problem'` and `'System'` from nav links. |
| `src/components/landing/StickyJoinBar.tsx` | Replace slot counter with "Lock founding pricing". CTA targets `#inline-signup-gate`. |
| `src/lib/supabase.ts` | Add `referrer_id` to `FounderInsert` interface. |
| `src/app/api/founders/reserve/route.ts` | Add `referrer_id`, duplicate email 409, dynamic column retry. |

### Unchanged files

| File | Reason |
|------|--------|
| `src/components/landing/SampleOutcomeBlock.tsx` | Works as-is (wrapped by ConditionalSampleOutcome) |
| `src/components/landing/TrustStrip.tsx` | Works as-is |
| `src/components/landing/FAQSection.tsx` | Works as-is |
| `src/components/landing/Footer.tsx` | Works as-is |
| `src/components/landing/ReferralEntryBanner.tsx` | Works as-is |
| `src/components/landing/RankShareCard.tsx` | Works as-is (reused in ShareActions) |
| `src/components/landing/rankResultMessaging.ts` | Works as-is |
| `src/components/landing/firstReadDiagnosis.ts` | Works as-is |
| `src/components/landing/founderFormValidation.ts` | Works as-is |

### Files removed from page (not deleted)

| File | Status |
|------|--------|
| `src/components/landing/ProblemSection.tsx` | Import removed |
| `src/components/landing/SystemSection.tsx` | Import removed |
| `src/components/landing/PillarStrip.tsx` | Import removed |
| `src/components/landing/DiagnosticCard.tsx` | Used by SystemSection only |
| `src/components/landing/ProductShowcase.tsx` | Used by HeroSection only |

### Files no longer created (removed from spec)

| File | Reason |
|------|--------|
| ~~`PostResultBridge.tsx`~~ | Absorbed into InlineSignupGate tiered headline. Bridge was a momentum killer between share and signup. |

---

## Verification

1. `npx tsc --noEmit` — no type errors
2. Fresh visit → hero shows 3 lines + CTA, fills ~70vh
3. CTA click → smooth scroll to `#rank` section
4. After scroll settles → bodyweight input (`#rank-bw-input`) is focused
5. First-time visitor scrolling past calculator → SampleOutcomeBlock visible
6. Returning visitor (has `aos_rank_result`) → SampleOutcomeBlock hidden
7. Complete rank calculation → result view shows 4 elements: score card, diagnostics, share, signup gate
8. Share → `navigator.share` on mobile, copy fallback on desktop
9. Download card → html2canvas generates PNG, triggers download
10. InlineSignupGate headline varies by percentile tier (90+, 60-89, <60)
11. InlineSignupGate submit → `referrer_id` sent if `aos_referrer_id` in localStorage
12. Duplicate email → returns "This email is already registered" (409)
13. Field validation → per-field error messages below each input
14. Signup success → redirects to `/welcome`
15. Already signed up (`aos_founder_data`) → gate shows "You're in" with founder number
16. Malformed `aos_founder_data` → gate shows the form (graceful fallback)
17. CTAStrip `id="waitlist"` anchor reachable via `#join` nav link
18. CTAStrip links scroll to `#rank` and `#inline-signup-gate`
19. NavBar: only `#rank` and `#join` links — no dead anchors
20. StickyJoinBar: "Lock founding member pricing", CTA scrolls to `#inline-signup-gate`
21. `?ref=` visitor → ReferralEntryBanner renders, `aos_referrer_id` stored
22. Mobile: hero CTA reachable without scroll, WhatsApp field preserves `type="tel"`
23. No duplicate signup forms on the page

---

## Out of Scope

- `/welcome` page changes (separate spec)
- Analytics persistence (console.log stub — tracked in ACTION_PLAN.md)
- RankSection file decomposition (655+ lines — separate effort)
- Share card aspect ratio variants (story/feed) — v2
