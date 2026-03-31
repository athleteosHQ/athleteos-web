p# Landing Page Conversion Overhaul

**Date:** 2026-03-31
**Status:** Approved

## Problem

The current landing page leads with a free calculator, follows with a sample outcome that hides itself after use, buries the signup gate behind three selling sections, and uses abstract messaging that doesn't define the ICP or product category above the fold. The result: the calculator is interesting but the system behind it is unclear, the best conversion content is either hidden or in the wrong scroll position, and the signup gate has too many fields at the peak-conversion moment.

## Design

### Page Flow (New)

| # | Section | Status | Purpose |
|---|---------|--------|---------|
| 1 | NavBar | existing | navigation |
| 2 | StickyJoinBar | existing | persistent CTA |
| 3 | HeroSection | rewrite | ICP + product category + single CTA |
| 4 | InsightPatternsSection | **new** | proof of understanding — 3 diagnostic pattern cards |
| 5 | SampleOutcomeBlock | modify | always-visible demo mode, never transitions |
| 6 | RankSection | modify | mode selector moves here, reframed as step 1 |
| 6.5 | PersonalizedUpsellStrip | **new** | appears after rank result, uses real numbers, locked rows |
| 7 | SignupGateSection | modify | immediately after upsell, email + optional WhatsApp |
| 8 | SystemSection | rewrite | fallback persuasion for users who scrolled past gate |
| 9 | ProblemSection | restore | IFCT credibility layer, downstream trust |
| 10 | TrustStrip | existing | trust indicators |
| 11 | FAQSection | existing | FAQ |
| 12 | Footer | existing | footer |

**Removed:** ConditionalSampleOutcome (wrapper), LockedPreviewSection (redundant — its job is now handled by PersonalizedUpsellStrip and existing locked cards in RankResult).

### HeroSection Rewrite

Three elements only. No mode selector, no toggle, no secondary options.

- **Headline:** "You train. You track. Your total hasn't moved in months."
- **Subheading:** "AthleteOS finds the one variable actually holding you back — by reading your training, nutrition, and recovery as one system, not three apps."
- **CTA:** "See Where You Rank" — scrolls to #rank, accurate to what the calculator delivers.

The hero answers three above-the-fold questions:
- **Who:** strength athletes whose numbers have stalled
- **What:** a performance diagnosis system, not a tracker
- **Why now:** the bottleneck is invisible to you but visible to the system

### InsightPatternsSection (New)

Compact section demonstrating the system's analytical patterns — not features, not empathy, but specific observations that reveal blind spots the user didn't know they had.

- **Eyebrow:** "What the system actually reads"
- **Heading:** "Your apps track numbers. This connects them."
- **3 insight cards**, each with one diagnostic sentence + one-line explanation:
  1. "Your protein is on target but timed wrong relative to your training phase — surplus during deload, maintenance during accumulation." — Nutrient timing relative to periodization phase.
  2. "Your squat volume went up 18% this block but your deadlift ratio dropped. Programming drift or fatigue?" — Cross-lift ratio analysis within a training block.
  3. "You sleep 7.5 hours but only 6.1 on training days. That gap is where recovery debt compounds." — Training-day-specific recovery patterns.

Visual treatment: surface-card style matching existing design language. No charts, no data tables.

### SampleOutcomeBlock (Modified)

**Change:** Remove ConditionalSampleOutcome wrapper. SampleOutcomeBlock renders directly in the page, always visible, always in demo mode. It never transitions or accepts a rankResult prop.

**Purpose:** Pre-calculator proof. Shows the full diagnostic chain (rank, limiter, correction, projected gain) for a fictional athlete. Primes the user to understand what the system produces before they engage with the calculator.

**Content:** Unchanged from current implementation — 85kg lifter, Top 23%, sleep-limited recovery, +45 min sleep correction, +8.2 kg squat projection. **Exception:** Bottom CTA copy changes from "Get mine" to "Check yours" (per CTA audit).

**CTA at bottom:** "Check yours" → scrolls to `#rank` anchor on RankSection.

### RankSection (Modified)

**Mode selector** moves from HeroSection to top of RankSection, rendered above the section heading and form. Label: "I train for..." with Gym / Hybrid options. In this context it's a natural setup question before data entry.

**Section heading:** Reframed to position calculator as step 1 of a larger diagnosis. Not "Where are you strong. Where are you leaking." — instead, language like "Step 1: See where you stand" that makes clear this is the beginning, not the whole product.

**Interface change:** Accepts new `onRankResult: (result: RankResult) => void` prop. Calls it on form submit alongside existing localStorage persistence.

**Result display:** Existing AthleteScoreCard, DiagnosticBars, ResultInsightPanel, ShareActions remain. The locked cards already inside RankResult stay — they're doing their job in-place.

### PersonalizedUpsellStrip (New)

Renders as a standalone section in page.tsx, positioned between RankSection and SignupGateSection. Not nested inside RankSection. Only appears when rankResult is non-null.

**Architecture:** Receives rankResult prop. Uses the user's real numbers to create personalized upsell copy for the three locked diagnostic layers.

**Content structure:**
- **Rank row:** User's real percentile and lift breakdown (pulled from rankResult)
- **Limiter row (locked):** Blurred/locked visual state. Personalized copy referencing their actual weak lift and spread. E.g. "Your squat is Top 31% but your bench is Top 22%. The full system read identifies whether the gap is training distribution, nutrition timing, or recovery debt — and tells you exactly what to change first."
- **Correction row (locked):** "One specific change. Based on your numbers, not a template."
- **Projected gain row (locked):** "6-week projection calibrated to your current training frequency and weight class."

**Visual treatment:** Glass blur or lock icon on locked rows. Same surface-card style as SampleOutcomeBlock so the visual language is consistent.

**CTA:** Points to signup gate below — natural scroll momentum.

### SignupGateSection (Simplified)

**Fields:**
- Email (required) — standard email input
- WhatsApp (optional) — single text input, placeholder: `+91 9XXXXXXXXX`, labeled "WhatsApp (for early access updates)". No country code dropdown. Parse and validate server-side.

**Removed from gate:** Name, country dropdown. Both collected on /welcome as part of onboarding profile.

**Visibility:** Always rendered. The gate is visible whether or not the user has completed the calculator. No `return null` when overallPct is missing.

**Gate headline — two states:**

*Default state (overallPct is null — user hasn't used calculator):*
- Generic headline that sells the system without referencing rank data. E.g. "See what's actually limiting your progress — training, nutrition, or recovery."

*Personalized state (overallPct is non-null — user has rank result):*
- >= 90th: "You're already ahead of most lifters. Now find the gap that keeps you from the next tier."
- 60-89th: "You're closer than you think. The variable holding you back probably isn't the one you blame."
- < 60th: "Your numbers show exactly where to start. AthleteOS shows what to fix first."

**CTA:** "Reserve My Diagnosis" — forward-looking, honest about waitlist, doesn't promise immediate delivery.

**Trust chips:** Unchanged — "No payment required", "Cancel anytime", "Founding rate locked".

**Post-submission:** Redirect to /welcome which collects name, country, training frequency, experience level, current phase.

### Validation & API Changes

**`founderFormValidation.ts`:** Remove `name` from `FounderFormInput` interface and validation. Keep `email` (required) and `whatsapp` (optional, existing phone regex `^\+?[0-9\s()-]{10,15}$}` is sufficient for the freeform input). Remove name-empty check from `validateFounderForm()`.

**`src/lib/supabase.ts` (`insertFounder`):** The `FounderInsert` interface currently requires `name`, `email`, `whatsapp`, `country`, `source`, `discipline`, `experience`, `referrer_id`. Changes: `name` becomes optional (send empty string or null at signup, collected on /welcome). `country` becomes optional (omitted at signup, collected on /welcome). The API endpoint `/api/founders/reserve` and backend schema must accept nullable name and country — if the schema enforces NOT NULL, send empty string as placeholder.

**`landingFlow.ts`:** Remove `shouldShowSampleOutcome()` (no longer needed — SampleOutcomeBlock is always visible). `getInlineSignupGateContent()`, `getShareMessage()`, `getFounderLabel()`, `hasFounderData()` remain unchanged — the tiered headline logic and founder labeling still work as-is.

### SystemSection (Rewritten)

Moves from position 4 to position 8 — now fallback persuasion for users who scrolled past the signup gate.

**Eyebrow:** "How AthleteOS diagnoses the stall"
**Heading:** Replace "Three inputs. One answer." with concrete language about the diagnostic chain — rank, bottleneck isolation, correction, projected gain.
**Cards:** Rewrite to describe what the system *does* (diagnose, isolate, prescribe) rather than what it *takes* (nutrition, training, recovery).
**Diagnosis output box:** Tighter copy focused on variable isolation.

### ProblemSection (Restored)

Restored from codebase but repositioned downstream (position 9). IFCT food data table becomes a credibility layer for skeptics who are still scrolling, not an attention-layer at the top.

No content changes needed — the masoor dal / paneer / chicken curry / roti comparison table is strong evidence for users who have already been hooked and want to validate the data quality claim.

### LockedPreviewSection (Removed)

Killed entirely. Its job (showing locked/blurred premium content) is now handled by:
1. PersonalizedUpsellStrip — using the user's actual numbers
2. Locked cards already inside RankResult

Three locked-content moments was two too many.

### CTA Audit

| Component | Old CTA | New CTA | Rationale |
|-----------|---------|---------|-----------|
| HeroSection | "Run My Performance Check" | "See Where You Rank" | Accurate to calculator output, triggers status motivation |
| InsightPatternsSection | n/a | "See it in action" → scrolls to SampleOutcomeBlock | Bridges pattern cards to concrete example |
| SampleOutcomeBlock | "Get mine" | "Check yours" → scrolls to calculator | Natural transition from demo to engagement |
| PersonalizedUpsellStrip | n/a | "Unlock your full read" → scrolls to signup gate | Uses their data as leverage |
| SignupGateSection | "Get My Full System Read" | "Reserve My Diagnosis" | Honest about waitlist, forward-looking |
| SystemSection | "Start your first scan" | "See Where You Rank" → scrolls to calculator | Catches skeptics, loops them back |
| StickyJoinBar | "Get Full System Read →" | "Reserve My Diagnosis" → scrolls to signup gate | Consistent with gate CTA, always accessible |

### State Architecture (Critical Refactor)

**Current state:** RankSection manages `rankResult` as local state (useState inside the component). SignupGateSection reads `overallPct` from localStorage via useEffect and hides itself when null. Components communicate through localStorage and custom events (`aos-rank-result-changed`).

**New state:** Lift `rankResult` to `page.tsx` as page-level state. All components receive data via props — no localStorage reads for rank data in render logic.

```
page.tsx state:
  - mode: AthleteMode (gym | hybrid)
  - rankResult: RankResult | null   ← lifted from RankSection

Props flow:
  HeroSection              → no props (static content, CTA scrolls to #rank)
  InsightPatternsSection   → no props (static content)
  SampleOutcomeBlock       → no props (static content, always demo mode)
  RankSection              → mode, onModeChange, onRankResult callback
  PersonalizedUpsellStrip  → rankResult (renders only when non-null)
  SignupGateSection        → overallPct from rankResult (always rendered; generic headline when null, tiered headline when non-null)
  SystemSection            → no props (static content)
  ProblemSection           → no props (static content)
```

**RankSection interface change:** Add `onRankResult: (result: RankResult) => void` prop. On form submit, call both `onRankResult(result)` and persist to localStorage (for page reload recovery). RankSection still manages its own UI state (form values, loading, show/hide form vs result) but delegates rankResult to the parent.

**SignupGateSection interface change:** Replace localStorage read with `overallPct: number | null` prop. Component is always rendered — never returns null. When overallPct is null, renders with a generic default headline. When overallPct is non-null, renders with the tiered personalized headline.

**localStorage still used for:** Page reload recovery (read rankResult from localStorage on mount in page.tsx), founder data persistence, referral tracking. Not used for cross-component communication during a session.

### ReferralEntryBanner

Stays in page.tsx, position unchanged (between StickyJoinBar and HeroSection, wrapped in Suspense). Not affected by this overhaul — referral flow is orthogonal to the conversion funnel changes.

### Files Changed

| File | Action |
|------|--------|
| `src/app/page.tsx` | Reorder sections, remove ConditionalSampleOutcome/LockedPreviewSection, add InsightPatternsSection + PersonalizedUpsellStrip, restore ProblemSection |
| `src/components/landing/HeroSection.tsx` | Full rewrite — 3 elements only, no mode selector |
| `src/components/landing/InsightPatternsSection.tsx` | **New file** — 3 diagnostic pattern cards |
| `src/components/landing/SampleOutcomeBlock.tsx` | Remove rankResult prop logic, always demo mode |
| `src/components/landing/PersonalizedUpsellStrip.tsx` | **New file** — personalized locked upsell using real rank data |
| `src/components/landing/RankSection.tsx` | Add mode selector, reframe heading/messaging |
| `src/components/landing/SignupGateSection.tsx` | Simplify to email + WhatsApp text input, new CTA |
| `src/components/landing/SystemSection.tsx` | Rewrite messaging — concrete diagnostic chain language |
| `src/components/landing/ProblemSection.tsx` | No content changes, just re-added to page.tsx |
| `src/components/landing/ConditionalSampleOutcome.tsx` | **Delete** |
| `src/components/landing/LockedPreviewSection.tsx` | **Delete** |
| `src/components/landing/landingFlow.ts` | Remove shouldShowSampleOutcome; other exports unchanged |
| `src/components/landing/founderFormValidation.ts` | Remove name from interface and validation |
| `src/lib/supabase.ts` | Make name and country optional in FounderInsert |
| `src/components/landing/StickyJoinBar.tsx` | Update CTA copy to "Reserve My Diagnosis", verify anchor target resolves after section reorder |

### Welcome Page Changes

The /welcome page needs to collect fields removed from the signup gate:
- Name (text input)
- Country (dropdown or text)
- Training frequency, experience level, current phase (onboarding profile)

This is a separate implementation concern — the landing page spec does not modify the welcome flow beyond noting the field migration.
