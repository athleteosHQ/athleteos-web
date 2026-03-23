# AthleteOS Action Plan

> Generated: 2026-03-24
> Last updated: 2026-03-24 (post build review)
> Context: Post-critique pivot from "status theater" to "utility-first" architecture

---

## Current State

### Build status: CLEAN (tsc passes, no errors)

### Complete

- [x] `/welcome` page shell with localStorage read + fallback UI
- [x] `WelcomePage.tsx` — 5 sections (hero, performance card, referral, benefits + timeline, community)
- [x] `welcomeState.ts` + test — pure logic for deriving welcome page state
- [x] `welcomeSharePayload.ts` + test — share card labels + message composition
- [x] `firstReadDiagnosis.ts` + test — rule-based first-read diagnosis (weakest lift, balanced, partial)
- [x] `rankResultMessaging.ts` + test — tiered copy (90+/60+/<60 percentile)
- [x] `founderFormValidation.ts` + test — extracted validation logic
- [x] `RankSection.tsx` — stores rank result in localStorage, `ResultInsightPanel`, `ResultActions`
- [x] `CTASection.tsx` + `InlineSignupGate` — both redirect to `/welcome` after signup
- [x] `RankShareCard.tsx` — 1080×1080 off-screen card with diagnosis block, lift bars, percentile ring
- [x] `ReferralEntryBanner.tsx` — personalized banner on `?ref=` landing via `/api/founders/referrer`
- [x] `referralLandingState.ts` + test — referral landing copy logic
- [x] `analytics.ts` + test — `trackEvent` with `sendBeacon` fallback
- [x] `/api/analytics/track` — server-side analytics endpoint (console.log stub)
- [x] `/api/founders/referrer` — GET referrer name + founder# for referral banner
- [x] `/api/founders/reserve` — POST with server-side validation (service role key)
- [x] `/api/founders/count` — GET founder count
- [x] `/api/founders/boost` — POST increment share count
- [x] `supabase.ts` — rewritten to use API routes (no client-side DB access)
- [x] `supabase-server.ts` — server-only client with service role key
- [x] Mobile-first responsive rewrites across all landing sections
- [x] TypeScript compiles clean

### Partially complete

- [~] Referral flow — entry banner works, but no referral attribution on signup (referrer_id not sent to `/api/founders/reserve`)
- [~] Analytics — events fire client-side, but server just logs to console (no persistence)
- [~] Share card export — `html2canvas` wired up, but not tested with actual render

---

## Shortcomings to Address

| # | Critique | Source | Status |
|---|----------|--------|--------|
| 1 | "The OS is a lie" — no system, just a landing page | VC/PM review | Open |
| 2 | Too SaaS-y, not sport-y — reads like crypto, not a performance lab | Growth review | Open |
| 3 | Manual data entry = garbage data + one-time novelty | Growth review | Open |
| 4 | Rank sharing is gated behind signup — kills viral loop | PM review | Open |
| 5 | No retention mechanic — one-time novelty, no reason to return | VC review | Open |
| 6 | "Core → Elite" tier system is empty status without product value | PM review | Open |
| 7 | Referral attribution not persisted (ref param captured but not sent on signup) | Build review | Open |
| 8 | Analytics not persisted (console.log only) | Build review | Open |

---

## Phase 1 — Copy & Tone Pivot

> Effort: 2–3 hours | Impact: High | Addresses: #2, #6

Rewrite all copy from SaaS onboarding language to sport/performance language.

### Changes

| What | File | Change |
|------|------|--------|
| Kill "Core → Elite" tier labels | `welcomeState.ts`, `WelcomePage.tsx` | Replace with position-based: "Position #23 → #18 after 2 shares". Remove `tierLabel`, `progressPercent`, `referralHint` fields |
| Demote Founding Member # | `WelcomePage.tsx` hero section | Lead with rank/performance, not membership number. Founder # becomes small badge, not h1 |
| Replace "Move up the founding list" | `WelcomePage.tsx` referral section | → "Jump ahead" or "Climb the queue" — sport language |
| Fix "World Benchmark" UI label | `RankSection.tsx` `ResultInsightPanel` | Change heading from "World Benchmark" to "Competitive Benchmark" |
| Remove "Early Athlete" badge | `WelcomePage.tsx`, `welcomeSharePayload.ts` | Replace with weight class or tier from rank result |
| Rewrite share messages | `welcomeState.ts`, `welcomeSharePayload.ts` | Lead with performance: "I'm in the top X% of Indian strength athletes. Check yours" instead of "I got into AthleteOS early" |
| Fix referral banner copy | `referralLandingState.ts` | "See where you stack up" not "see what the system reads" — sport language |

### Acceptance Criteria

- [ ] No mention of "tier," "Core," or "Elite" anywhere in the UI
- [ ] No "Progress to Elite" progress bar on `/welcome`
- [ ] Founding Member # is secondary to rank percentile on `/welcome`
- [ ] Share messages lead with performance identity, not product membership
- [ ] "World Benchmark" replaced with "Competitive Benchmark" in all UI headings
- [ ] "Early Athlete" badge replaced with contextual label (weight class or rank tier)

---

## Phase 2 — Rank-First Sharing (Pre-Signup)

> Effort: 4–6 hours | Impact: High | Addresses: #4

Make rank result shareable without signup. The share card IS the acquisition channel.

### Changes

| What | File | Change |
|------|------|--------|
| Share rank without signup | `RankSection.tsx` | Add "Share My Rank" buttons immediately after rank result — above `InlineSignupGate` |
| Lightweight pre-signup share | New: `src/components/landing/RankShareInline.tsx` | WhatsApp/X share + Download buttons using existing `RankShareCard` (pass anonymous labels instead of founder labels) |
| Gate diagnosis, not rank | `ResultInsightPanel` in `RankSection.tsx` | Show "First Read" diagnosis freely. Keep locked cards blurred behind signup |
| Reduce form friction | `RankSection.tsx` | Default reps to 1. Add "I know my 1RM" toggle that hides rep fields |

### Acceptance Criteria

- [ ] User can share rank card on WhatsApp/X without creating an account
- [ ] Share card footer says "athleteos.in" (not heavy branding)
- [ ] First Read diagnosis visible without signup
- [ ] Locked cards ("What to improve first") still require signup
- [ ] Rank form supports "I know my 1RM" mode (fewer fields)

---

## Phase 2.5 — Referral Attribution + Analytics Persistence

> Effort: 2–3 hours | Impact: Medium | Addresses: #7, #8

Wire up the loose ends from the referral and analytics systems.

### Changes

| What | File | Change |
|------|------|--------|
| Send referrer_id on signup | `CTASection.tsx`, `RankSection.tsx` `InlineSignupGate` | Read `localStorage('aos_referrer_id')` and include in `insertFounder()` call |
| Accept referrer_id in API | `/api/founders/reserve/route.ts` | Add optional `referrer_id` field, store in DB |
| Persist analytics to Supabase | `/api/analytics/track/route.ts` | Insert into `analytics_events` table (or append to a log) instead of `console.log` |
| Track key funnel events | `RankSection.tsx`, `CTASection.tsx` | Add `trackEvent` calls: `rank_calculated`, `rank_shared_presignup`, `signup_completed`, `signup_from_rank_gate` |

### Acceptance Criteria

- [ ] Referral attribution persisted: can query "which signups came from which referrer"
- [ ] Analytics events stored server-side (not just console.log)
- [ ] Key funnel events tracked: rank calc → share → signup → welcome view

---

## Phase 3 — Diagnosis MVP

> Effort: 1–2 weeks | Impact: Critical | Addresses: #1

This is what makes "OS" real. Ship a rule-based diagnosis that goes beyond lift percentiles.

### Changes

| What | File | Change |
|------|------|--------|
| Post-rank survey | New: `src/components/landing/DiagnosisSurvey.tsx` | 5-field optional form after rank result: training frequency, protein (g/day), sleep hours, training age, program type |
| Rule-based diagnosis engine | New: `src/lib/diagnose.ts` | Input: rank result + survey. Output: single actionable recommendation referencing user's numbers |
| Store diagnosis | `RankSection.tsx` | Save survey answers + diagnosis to `localStorage('aos_diagnosis')` |
| Show on `/welcome` | `WelcomePage.tsx` | Replace generic "First Read" with full diagnosis when available |
| Include in share card | `RankShareCard.tsx`, `welcomeSharePayload.ts` | Add diagnosis headline to share card when available |

### Diagnosis Logic (Rule-Based)

```
IF bench_pct < squat_pct by 20+ points
   AND training_frequency <= 3x/week
   → "Your pressing volume relative to your squat work is the most likely limiter."

IF protein_intake < 1.6 * bodyweight
   AND any lift_pct < 50
   → "At Xg/day for Ykg bodyweight, protein is likely limiting recovery."

IF sleep < 7 hours
   AND training_frequency >= 5x/week
   → "High frequency with low sleep compounds fatigue. Recovery is the bottleneck."

IF training_age < 2 years
   AND all lifts > 60th percentile
   → "You're progressing fast. Consistency matters more than optimization right now."

IF spread between lifts < 10 percentile points
   AND average > 70th percentile
   → "Your profile is balanced. The next jump needs precision targeting, not broad changes."
```

### Acceptance Criteria

- [ ] Post-rank survey appears as optional ("Want a deeper read?") — not blocking
- [ ] Diagnosis outputs one specific, actionable recommendation
- [ ] Recommendation references user's actual numbers (e.g., "At 120g protein for 85kg bodyweight...")
- [ ] Stored in localStorage alongside rank result
- [ ] Visible on `/welcome` page when available
- [ ] Included in share card when available
- [ ] Unit tests with 80%+ coverage on `diagnose.ts`

---

## Phase 4 — Retention Mechanics

> Effort: 3–5 days | Impact: High | Addresses: #5

Create a reason to return. Turn rank check from one-time novelty into periodic habit.

### Changes

| What | File | Change |
|------|------|--------|
| Rank history | New: `src/lib/rankHistory.ts` | Store array of `{ date, overallPct, squat, bench, deadlift }` in localStorage. Max 12 entries. |
| Show delta on `/welcome` | `WelcomePage.tsx` | "Squat: Top 22% → Top 18% (+4 since last check)" |
| Re-test CTA | `WelcomePage.tsx`, new: `src/lib/retestReminder.ts` | Store rank date. Show "Re-test available" after 28 days. Countdown when < 28 days. |
| WhatsApp reminder opt-in | New: `/api/founders/reminder/route.ts` | "Get a WhatsApp ping to re-test in 4 weeks" — uses existing number from signup |

### Acceptance Criteria

- [ ] Rank history persists across sessions (localStorage array, max 12)
- [ ] `/welcome` shows delta when 2+ rank checks exist
- [ ] "Re-test in X days" countdown visible after first check
- [ ] WhatsApp reminder is opt-in, not default
- [ ] Re-test from `/welcome` links to `/#rank` with form pre-filled from last entry

---

## Phase 5 — Data Quality

> Effort: Ongoing | Impact: Medium | Addresses: #3

Improve data accuracy without requiring API integration (Month 3+ feature).

### Changes

| What | File | Change |
|------|------|--------|
| Sanity check on entries | `RankSection.tsx` submit logic | Flag impossible entries using Wilks-based bounds: "A 60kg athlete benching 200kg is unusual. Confirm?" |
| Import hints | Rank form UI | "Using Strong app? Export CSV and enter your recent maxes." |
| Future integration teaser | Landing page or `/welcome` | "Automatic sync with Garmin, Strava, and Apple Health — coming soon" |

### Acceptance Criteria

- [ ] Outlier entries trigger a soft confirmation (not a block)
- [ ] No false positives on legitimate entries (e.g., 120kg+ class lifters)
- [ ] Import hint is subtle, not blocking the form

---

## Priority & Timeline

```
Week 1:    Phase 1 (copy pivot) + Phase 2 (rank-first sharing)
Week 1-2:  Phase 2.5 (referral attribution + analytics persistence)
Week 2-3:  Phase 3 (diagnosis MVP)
Week 3-4:  Phase 4 (retention mechanics)
Ongoing:   Phase 5 (data quality)
```

---

## Key Metrics to Track

| Metric | Current | Target | Phase |
|--------|---------|--------|-------|
| Rank form completion rate | Unknown | 30%+ | 2 |
| Rank → share rate (no signup) | 0% (gated) | 10%+ | 2 |
| Share → new visitor rate | Unknown | 5%+ | 2 |
| Signup → /welcome visit | Unknown | 90%+ | 1 |
| Referral attribution rate | 0% (not wired) | 100% of ref signups | 2.5 |
| Re-test rate (28 days) | 0% (no mechanic) | 15%+ | 4 |
| Diagnosis survey completion | N/A | 40%+ | 3 |
| Analytics events persisted | 0% (console only) | 100% | 2.5 |

---

## Files Reference

### Existing (to modify)

| File | Phases |
|------|--------|
| `src/components/welcome/WelcomePage.tsx` (505 lines) | 1, 3, 4 |
| `src/components/welcome/welcomeState.ts` | 1 |
| `src/components/welcome/welcomeSharePayload.ts` | 1, 3 |
| `src/components/landing/RankSection.tsx` (655 lines) | 2, 2.5, 5 |
| `src/components/landing/RankShareCard.tsx` | 2, 3 |
| `src/components/landing/rankResultMessaging.ts` | 1 |
| `src/components/landing/referralLandingState.ts` | 1 |
| `src/components/landing/firstReadDiagnosis.ts` | 3 |
| `src/components/landing/CTASection.tsx` (586 lines) | 2.5 |
| `src/app/api/founders/reserve/route.ts` | 2.5 |
| `src/app/api/analytics/track/route.ts` | 2.5 |

### New (to create)

| File | Phase |
|------|-------|
| `src/components/landing/RankShareInline.tsx` | 2 |
| `src/components/landing/DiagnosisSurvey.tsx` | 3 |
| `src/lib/diagnose.ts` + test | 3 |
| `src/lib/rankHistory.ts` + test | 4 |
| `src/lib/retestReminder.ts` + test | 4 |
| `src/app/api/founders/reminder/route.ts` | 4 |

---

## Architecture Notes

### localStorage keys in use
| Key | Set by | Read by |
|-----|--------|---------|
| `aos_founder_data` | `CTASection`, `InlineSignupGate` | `WelcomePage`, `StickyJoinBar` |
| `aos_waitlist` | `CTASection`, `InlineSignupGate` | `StickyJoinBar`, `InlineSignupGate` |
| `aos_rank_result` | `RankSection` submit | `WelcomePage` |
| `aos_referrer_id` | `ReferralEntryBanner` | (Not yet read on signup — Phase 2.5) |

### API routes
| Route | Method | Auth | Purpose |
|-------|--------|------|---------|
| `/api/founders/reserve` | POST | Service role | Create waitlist entry |
| `/api/founders/count` | GET | Service role | Founder count |
| `/api/founders/boost` | POST | Service role | Increment share count |
| `/api/founders/referrer` | GET | Service role | Get referrer preview for banner |
| `/api/analytics/track` | POST | None | Log analytics events (console only) |

### File size warnings
| File | Lines | Note |
|------|-------|------|
| `RankSection.tsx` | 655 | Approaching limit. Consider extracting `ResultInsightPanel`, `InlineSignupGate`, `GhostTierPreview` into separate files |
| `CTASection.tsx` | 586 | `FounderSuccess` component should be removed (dead code — signup now redirects to `/welcome`) |
| `WelcomePage.tsx` | 505 | Acceptable for now, but will grow with Phase 3+4 additions. Plan to extract sections. |
