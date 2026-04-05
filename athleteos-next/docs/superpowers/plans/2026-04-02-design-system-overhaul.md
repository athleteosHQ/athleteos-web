# Design System Overhaul: Monochrome + Warmth — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generic blue/orange theme with a monochrome zinc palette (Nike + Linear + Resend inspired) across the entire AthleteOS landing site without degrading any performance scores.

**Architecture:** CSS-first approach. Phase 1 rewrites the design tokens and global styles in `globals.css` — this cascades to every component using `var(--accent)` etc. Phase 2 updates components that use Tailwind utility classes like `bg-accent`, `text-accent`, or hardcoded hex values. Phase 3 handles typography upgrades (hero Nike editorial, section Linear precision). No JS logic changes.

**Tech Stack:** Tailwind CSS, CSS custom properties, Next.js/React (JSX class changes only)

**Spec:** `docs/superpowers/specs/2026-04-02-design-system-overhaul-design.md`

---

## File Map

**Core styling (cascade foundation):**
- Modify: `src/app/globals.css` — all tokens, body bg, surfaces, focus, scrollbar, utilities
- Modify: `src/app/icon.svg` — favicon colors

**Hero typography overhaul:**
- Modify: `src/components/landing/HeroSection.tsx`

**Section heading typography:**
- Modify: `src/components/landing/ProblemSection.tsx`
- Modify: `src/components/landing/SystemSection.tsx`
- Modify: `src/components/landing/InsightPatternsSection.tsx`

**Landing components — accent class/hex cleanup (26 files total):**
- Modify: `src/components/landing/CTASection.tsx`
- Modify: `src/components/landing/SignupGateSection.tsx`
- Modify: `src/components/landing/NavBar.tsx`
- Modify: `src/components/landing/RankSection.tsx`
- Modify: `src/components/landing/rank/RankForm.tsx`
- Modify: `src/components/landing/rank/RankResult.tsx`
- Modify: `src/components/landing/rank/GhostTierPreview.tsx`
- Modify: `src/components/landing/AthleteScoreCard.tsx`
- Modify: `src/components/landing/DiagnosticCard.tsx`
- Modify: `src/components/landing/ModeSelector.tsx`
- Modify: `src/components/landing/FAQSection.tsx`
- Modify: `src/components/landing/ComparisonSection.tsx`
- Modify: `src/components/landing/SampleOutcomeBlock.tsx`
- Modify: `src/components/landing/Footer.tsx`
- Modify: `src/components/landing/TrustStrip.tsx`
- Modify: `src/components/landing/PillarStrip.tsx`
- Modify: `src/components/landing/PersonalizedUpsellStrip.tsx`
- Modify: `src/components/landing/CredibilitySection.tsx`
- Modify: `src/components/landing/ReferralEntryBanner.tsx`
- Modify: `src/components/landing/ShareActions.tsx`
- Modify: `src/components/landing/StickyJoinBar.tsx`
- Modify: `src/components/landing/ProductShowcase.tsx`
- Modify: `src/components/landing/RankShareCard.tsx` (if accent refs found)

**Outside landing:**
- Modify: `src/components/welcome/WelcomePage.tsx`

---

### Task 1: globals.css — Design Token Foundation

This is the critical cascade layer. Changing tokens here fixes every component using `var(--accent)` automatically.

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Update `:root` token block**

Replace the `:root` block (lines 4-18) tokens. Remove `--accent`, `--accent-light`, `--data-cyan`. Update base tokens:

```css
:root {
  --background:        #09090B;
  --foreground:        #FAFAFA;
  --muted-foreground:  #71717A;
  --card:              #131315;  /* aligned with .surface-card, not #111113 from spec Changed table — Surface Hierarchy table is authoritative */
  --border:            rgba(255,255,255,0.06);
  --secondary:         #1C1C1F;
  --success:           #2DDC8F;
  --warning:           #F3B24E;
  --destructive:       #EF4444;
  --font-display:      var(--font-jakarta);
  --font-mono-label:   var(--font-mono);

  /* Surface elevated (replaces accent for raised elements) */
  --surface-elevated:  #1C1C1F;
```

- [ ] **Step 2: Update body background**

Replace the body background (lines 39-49) with neutral:

```css
body {
  background:
    radial-gradient(ellipse 60% 45% at 50% 0%, rgba(161,161,170,0.04), transparent 70%),
    #09090B;
  color: var(--foreground);
  font-family: var(--font-inter), sans-serif;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}
```

- [ ] **Step 3: Update surface hierarchy**

Update `.surface-inset` bg from `#0e0e10` to `#0C0C0E` and `.surface-control` bg from `#141416` to `#1C1C1F`. Leave `.surface-card` and `.surface-card-muted` unchanged per spec.

- [ ] **Step 4: Neutralize gate-panel**

Replace `.gate-panel` (lines 98-104):

```css
.gate-panel {
  background: linear-gradient(180deg, #141418, #111113);
  border: 1px solid rgba(255,255,255,0.08);
  border-top: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.35);
}
```

- [ ] **Step 5: Update hero-gradient-word**

Replace line 108:

```css
.hero-gradient-word {
  background: linear-gradient(180deg, #fff 20%, #a1a1aa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

- [ ] **Step 6: Neutralize locked-peek shimmer**

Replace `rgba(94,106,210,0.1)` on line 121 with `rgba(161,161,170,0.06)`.

- [ ] **Step 7: Neutralize section-fade-top**

Replace `var(--accent)` on line 144 with `rgba(161,161,170,0.5)`.

- [ ] **Step 8: Neutralize system-input focus**

Replace lines 179-182:

```css
.system-input:focus-visible {
  outline: none;
  border-color: rgba(255,255,255,0.2);
  box-shadow: 0 0 0 2px rgba(255,255,255,0.08), 0 0 12px rgba(255,255,255,0.04);
}
```

- [ ] **Step 9: Update utility classes**

Replace `.text-accent`, `.text-accent-light`, `.bg-accent`, `.bg-accent-light`, `.hover\:bg-accent-light:hover`, and the `.bg-accent:hover` glow (lines 203-225):

```css
/* Monochrome action utilities (replace accent) */
.text-accent           { color: #FAFAFA; }
.text-accent-light     { color: #a1a1aa; }
.bg-accent             { background: linear-gradient(104deg, rgba(253,253,253,0.05) 5%, rgba(240,240,228,0.1) 100%); border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(12px); }
.bg-accent:hover       { background: #fafafa; color: #09090b; box-shadow: none; }
.bg-accent-light       { background: rgba(255,255,255,0.08); }
.hover\:bg-accent-light:hover { background: #fafafa; color: #09090b; }
```

- [ ] **Step 10: Neutralize scrollbar**

Replace line 235:

```css
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
```

- [ ] **Step 11: Neutralize focus rings**

Replace lines 238-248:

```css
:focus-visible {
  outline: 2px solid rgba(255,255,255,0.3);
  outline-offset: 2px;
}
a:focus-visible,
button:focus-visible {
  outline: 2px solid rgba(255,255,255,0.3);
  outline-offset: 2px;
  border-radius: 4px;
}
```

- [ ] **Step 12: Add section-divider class (Resend-style)**

Add after the `.section-fade-top` rules:

```css
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

- [ ] **Step 13: Add secondary and ghost button utilities**

Add after the accent utility block:

```css
.btn-secondary {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.1);
  color: #a1a1aa;
  border-radius: 10px;
  transition: border-color 200ms ease, color 200ms ease;
}
.btn-secondary:hover {
  border-color: rgba(255,255,255,0.2);
  color: #fafafa;
}
.btn-ghost {
  background: none;
  border: none;
  color: #a1a1aa;
  transition: color 200ms ease;
}
.btn-ghost:hover { color: #fafafa; }
```

- [ ] **Step 14: Build check**

Run: `cd athleteos-next && npm run build`
Expected: Clean build, no errors.

- [ ] **Step 13: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: overhaul design tokens to monochrome zinc palette

Kill --accent (#6B7AED), --accent-light, --data-cyan.
Replace body gradients with neutral zinc glow.
Neutralize focus rings, scrollbar, gate-panel, shimmer."
```

---

### Task 2: icon.svg — Favicon Update

**Files:**
- Modify: `src/app/icon.svg`

- [ ] **Step 1: Replace all `#6B7AED` with `#FAFAFA`**

The icon has 13 references to `#6B7AED`. Replace all with `#FAFAFA` for monochrome favicon.

- [ ] **Step 2: Commit**

```bash
git add src/app/icon.svg
git commit -m "feat: update favicon to monochrome white"
```

---

### Task 3: HeroSection — Nike Editorial Typography

**Files:**
- Modify: `src/components/landing/HeroSection.tsx`

- [ ] **Step 1: Replace accent SVG dots/paths**

Replace `fill="var(--accent)"` and `stroke="var(--accent)"` with `fill="rgba(255,255,255,0.4)"` and `stroke="rgba(255,255,255,0.2)"`. Replace `#F59E0B` (orange) dots/strokes with `rgba(255,255,255,0.25)`.

- [ ] **Step 2: Update hero heading typography**

Find the main `<h1>` heading. Add/update classes for Nike editorial:
- `uppercase font-[800] tracking-[-0.03em] leading-[1.0]`
- Apply gradient text: wrap in a span with `style={{ background: 'linear-gradient(180deg, #fff 20%, #a1a1aa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}`

- [ ] **Step 3: Update CTA button**

Replace `bg-accent ... hover:bg-accent-light` button class with the glass primary CTA pattern:
```
className="group relative inline-flex cursor-pointer items-center gap-2 rounded-[10px] px-8 py-4 text-base font-bold text-white uppercase tracking-[0.02em] transition-all duration-200 overflow-hidden"
style={{ background: 'linear-gradient(104deg, rgba(253,253,253,0.05) 5%, rgba(240,240,228,0.1) 100%)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}
```
Add hover classes: `hover:bg-[#fafafa] hover:text-[#09090b] hover:border-[#fafafa]`

- [ ] **Step 4: Neutralize ambient gradient**

Replace `var(--accent)` in the ambient gradient `style` prop with neutral: `rgba(161,161,170,0.08)`.

- [ ] **Step 5: Build check**

Run: `cd athleteos-next && npm run build`

- [ ] **Step 6: Commit**

```bash
git add src/components/landing/HeroSection.tsx
git commit -m "feat: hero section Nike editorial typography + monochrome"
```

---

### Task 4: Section Headings — Linear Precision Typography

**Files:**
- Modify: `src/components/landing/ProblemSection.tsx`
- Modify: `src/components/landing/SystemSection.tsx`
- Modify: `src/components/landing/InsightPatternsSection.tsx`

- [ ] **Step 1: Update ProblemSection heading**

Find the section `<h2>` heading. Update to Linear precision style:
- `font-semibold tracking-[-0.02em] leading-[1.2]`
- Apply gradient text: `style={{ background: 'linear-gradient(180deg, #ededed 0%, #a1a1a1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}`

Replace any `text-accent` or `font-mono-label text-accent` eyebrows with `text-[#71717a]` or `text-[#a1a1aa]`.

- [ ] **Step 2: Update SystemSection heading**

Same treatment as ProblemSection. Find `<h2>`, apply Linear gradient text. Neutralize accent references.

- [ ] **Step 3: Update InsightPatternsSection heading + accent refs**

Same heading treatment. Also:
- Replace `var(--data-cyan, #00D9FF)` with `rgba(255,255,255,0.5)` or `#a1a1aa`
- Replace `stroke="var(--data-cyan)"` in SVG with `stroke="rgba(255,255,255,0.3)"`
- Replace `text-accent` / `text-accent-light` utility classes with `text-[#fafafa]` / `text-[#a1a1aa]`

- [ ] **Step 4: Build check**

Run: `cd athleteos-next && npm run build`

- [ ] **Step 5: Commit**

```bash
git add src/components/landing/ProblemSection.tsx src/components/landing/SystemSection.tsx src/components/landing/InsightPatternsSection.tsx
git commit -m "feat: section headings to Linear precision gradient text"
```

---

### Task 5: Landing Components — Accent Class Cleanup (Batch 1: CTA & Forms)

**Files:**
- Modify: `src/components/landing/CTASection.tsx`
- Modify: `src/components/landing/SignupGateSection.tsx`
- Modify: `src/components/landing/RankSection.tsx`
- Modify: `src/components/landing/rank/RankForm.tsx`
- Modify: `src/components/landing/rank/RankResult.tsx`
- Modify: `src/components/landing/rank/GhostTierPreview.tsx`
- Modify: `src/components/landing/AthleteScoreCard.tsx`

- [ ] **Step 1: CTASection — replace accent button/text classes**

Search for `bg-accent`, `text-accent`, `hover:bg-accent-light`. The `.bg-accent` utility in globals.css now handles the glass→invert pattern, so classes may work as-is after Task 1. If there are hardcoded hex values, replace `#6B7AED` with the glass pattern inline.

- [ ] **Step 2: SignupGateSection — verify gate-panel cascades**

The `.gate-panel` class was neutralized in Task 1. Check for any inline `accent` styles or hardcoded hex values and replace.

- [ ] **Step 3: RankSection + RankForm — neutralize accent refs**

Replace all `bg-accent`/`text-accent`/`hover:bg-accent-light` patterns. Replace any hardcoded `#6B7AED` or accent-colored inline styles.

- [ ] **Step 4: RankResult — progress bars**

Replace any accent-colored progress bar backgrounds with `bg-[linear-gradient(90deg,rgba(255,255,255,0.3),rgba(255,255,255,0.1))]` or a Tailwind equivalent like `bg-white/30`.

- [ ] **Step 5: GhostTierPreview — hardcoded hex**

Replace hardcoded `#6B7AED` bar colors with `rgba(255,255,255,0.2)` or neutral values.

- [ ] **Step 6: AthleteScoreCard — progress bar + text**

Replace `text-accent` on score display with `text-[#fafafa]`. Replace `bg-accent` progress bar fill with `bg-white/30`.

- [ ] **Step 7: Build check**

Run: `cd athleteos-next && npm run build`

- [ ] **Step 8: Commit**

```bash
git add src/components/landing/CTASection.tsx src/components/landing/SignupGateSection.tsx src/components/landing/RankSection.tsx src/components/landing/rank/ src/components/landing/AthleteScoreCard.tsx
git commit -m "feat: neutralize accent in CTA, rank, and score components"
```

---

### Task 6: Landing Components — Accent Class Cleanup (Batch 2: Remaining)

**Files:**
- Modify: all remaining landing components with accent references (DiagnosticCard, ModeSelector, FAQSection, ComparisonSection, SampleOutcomeBlock, Footer, TrustStrip, PillarStrip, PersonalizedUpsellStrip, CredibilitySection, ReferralEntryBanner, ShareActions, StickyJoinBar, NavBar, ProductShowcase)

> **Note:** These 15 files are plan-discovered additions beyond the spec's enumerated scope. They were found via `grep` and contain accent references that would break or look inconsistent after Task 1 token changes.

- [ ] **Step 0: Pre-grep to confirm no ring/shadow/decoration accent patterns**

Run: `grep -rn "ring-accent\|shadow.*accent\|decoration-accent" --include="*.tsx" athleteos-next/src/components/landing/`
Expected: Zero matches. If any found, add to substitution table.

- [ ] **Step 1: Grep and fix all remaining accent refs**

For each file, apply this substitution pattern:
| Old class/value | New class/value |
|----------------|-----------------|
| `text-accent` | `text-[#fafafa]` |
| `text-accent-light` | `text-[#a1a1aa]` |
| `text-accent/80` | `text-[#a1a1aa]` |
| `bg-accent` (on buttons) | keep class — globals.css handles glass pattern |
| `bg-accent/10` (tinted backgrounds) | `bg-white/[0.04]` |
| `bg-accent/[0.03]` | `bg-white/[0.02]` |
| `border-accent/25` | `border-white/10` |
| `hover:bg-accent-light` | keep class — globals.css handles invert |
| `hover:text-accent-light` | `hover:text-white` |
| `fill-accent` | `fill-current` |
| `#6B7AED` hardcoded | `rgba(255,255,255,0.3)` or context-appropriate neutral |
| `#F59E0B` (orange) | `rgba(255,255,255,0.25)` |
| `rgba(94,106,210,*)` | `rgba(255,255,255,*)` at same opacity |
| `var(--data-cyan, #00D9FF)` | `rgba(255,255,255,0.5)` |

- [ ] **Step 2: ComparisonSection special attention**

This file has complex accent usage (accent/10 bg, accent bar with box-shadow, accent fill). Replace:
- `bg-accent/10` → `bg-white/[0.04]`
- `bg-accent` bar → `bg-white/20`
- `boxShadow: '0 2px 20px rgba(94,106,210,0.4)'` → `boxShadow: '0 2px 20px rgba(255,255,255,0.1)'`

- [ ] **Step 3: ModeSelector — inline accent style**

Replace `background: 'var(--accent)'` with `background: 'rgba(255,255,255,0.15)'`.

- [ ] **Step 4: DiagnosticCard — dot indicators**

Replace `var(--accent)` inline styles with `rgba(255,255,255,0.4)`.

- [ ] **Step 5: Build check**

Run: `cd athleteos-next && npm run build`

- [ ] **Step 6: Commit**

```bash
git add src/components/landing/
git commit -m "feat: neutralize accent across all landing components"
```

---

### Task 7: WelcomePage — Accent Cleanup

**Files:**
- Modify: `src/components/welcome/WelcomePage.tsx`

This file has ~35 accent references — the most of any single file.

- [ ] **Step 1: Batch replace accent utility classes**

Apply same substitution table from Task 6. Key patterns in this file:
- `text-accent` (used ~15 times for labels) → `text-[#fafafa]`
- `bg-accent` (used ~8 times for buttons) → keep class (globals handles it)
- `bg-accent/10` (glows) → `bg-white/[0.04]`
- `border-accent/25` → `border-white/10`
- `hover:bg-accent-light` → keep class
- `bg-[linear-gradient(90deg,var(--accent),#B8D4FF)]` → `bg-[linear-gradient(90deg,rgba(255,255,255,0.3),rgba(255,255,255,0.1))]`

- [ ] **Step 2: Build check**

Run: `cd athleteos-next && npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/components/welcome/WelcomePage.tsx
git commit -m "feat: neutralize accent in welcome page"
```

---

### Task 8: Final Verification

- [ ] **Step 1: Full accent grep — zero tolerance**

Run: `grep -rn "6B7AED\|accent-light\|data-cyan\|#8DA0FF\|#7FCFFF\|F59E0B\|rgba(94,106,210" --include="*.tsx" --include="*.css" --include="*.svg" athleteos-next/src/`

Expected: Zero matches (except possibly `email.ts` which is intentionally excluded).

- [ ] **Step 2: Check for broken var() references**

Run: `grep -rn "var(--accent)" --include="*.tsx" --include="*.css" athleteos-next/src/`

Expected: Only the redefined utility classes in `globals.css` (`.text-accent`, `.bg-accent` etc). No component should reference `var(--accent)` directly.

- [ ] **Step 3: Full build**

Run: `cd athleteos-next && npm run build`
Expected: Clean build, zero warnings about missing CSS variables.

- [ ] **Step 4: Dev server visual check**

Run: `cd athleteos-next && npm run dev`
Open http://localhost:3000 and verify:
- Black zinc background, no blue glow
- Hero heading: uppercase, heavy weight, white→gray gradient text
- Section headings: mixed case, semi-bold, gradient text
- Buttons: glass default, white on hover
- Cards: neutral borders, no blue tint
- Progress bars: white gradient, no accent color
- Scrollbar: neutral
- Focus rings: white, not blue

- [ ] **Step 5: Final commit**

```bash
git commit --allow-empty -m "chore: design system overhaul complete — monochrome + warmth"
```
