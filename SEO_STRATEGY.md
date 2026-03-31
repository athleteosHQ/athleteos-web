# athleteOS — SEO & Backlink Strategy
*Last updated: March 2026 — reflects Saffron Orbit brand identity, Live Signal Feed section, redesigned insight cards, and Performance Debugger positioning.*

---

## Brand Alignment Notes (applied March 2026)

The following brand changes from the athleteOS Brand Identity Guidelines v1.0 have been applied throughout this document and must be reflected in all copy, assets, and content:

| Element | Old | Correct | Rule |
|---|---|---|---|
| Product name in body copy | AthleteOS | athleteOS | Lowercase "athlete", uppercase "OS" always. Exception: sentence-start position only → "AthleteOS". |
| Product name in titles/H1 | AthleteOS | athleteOS | Same rule applies in meta titles, H1, H2. |
| Primary typeface | Inter | Plus Jakarta Sans 800 | All hero/wordmark contexts. |
| Data/metrics typeface | SF Mono / monospace | Space Mono | All performance numbers, percentiles, timestamps. |
| Primary brand colour | #F97316 (Tailwind orange-500) | #FF7A2F (Saffron Primary) | Dark backgrounds. Use #E05A00 (Ember) on light. |
| Background | #05050F / #080810 | #0B1118 (Deep Ink) | Slightly warmer — removes the cold-blue tint. |
| Ambient accent colours | Purple, blue, orange | Saffron-family only | Remove all purple/blue orbs, glows, gradients. |
| Logo mark | Square "OS" block | Saffron Orbit SVG | Three-satellite orbital system. See brand doc Section 02. |
| OG/share cards | Generic | Deep Ink + Saffron, Space Mono metrics | See brand doc Section 06A for full card spec. |

---

## 1. Meta Tags

```html
<!-- Title (60 chars, primary keywords front-loaded) -->
<title>athleteOS — Strength Training Analytics & Performance Intelligence for Indian Athletes</title>

<!-- Meta Description (155 chars, CTA + keywords) -->
<meta name="description"
  content="athleteOS finds what no single app can see: cross-signal patterns hiding your plateau. Connects training load, nutrition timing, sleep, and recovery. Built for Indian athletes." />
```

**Why this meta description:** The framing — "what no single app can see" — directly matches the Performance Debugger positioning and is a far stronger differentiator against Strong, Hevy, and MyFitnessPal. "Cross-signal patterns" seeds the diagnostic category athleteOS owns. Note: title and description use the brand-correct lowercase "athleteOS", not "AthleteOS" — consistent with the wordmark specification in the brand guidelines.

---

## 2. Target Keyword Clusters

### Primary (High Intent)
| Keyword | Monthly Volume (IN) | Difficulty | Intent |
|---|---|---|---|
| athlete performance tracking | ~1,200 | Medium | Research |
| strength training analytics | ~800 | Medium | Research |
| workout and nutrition tracking | ~1,500 | Low | Commercial |
| performance tracking for athletes | ~900 | Medium | Research |
| strength athlete analytics | ~300 | Low | Research |

### Secondary (Long-Tail, Low Competition)
| Keyword | Notes |
|---|---|
| strength training app for indian athletes | Very low competition — OWN this |
| why are my lifts not progressing | High intent — matches hero section |
| squat plateau cause protein | Long-tail, problem-aware audience |
| crossfit performance tracker india | Niche, low competition |
| hybrid athlete nutrition tracking | Emerging term, claim early |
| training and nutrition correlation app | Informational, top-of-funnel |
| protein target for powerlifters india | Very specific, low competition |

### Cluster A — Problem-Aware (Highest Intent, Lowest Competition)
| Keyword | Notes |
|---|---|
| why am I not getting stronger despite training | Exact pain state — highest conversion intent |
| why has my squat stopped progressing | High volume, low competition |
| bench press plateau reasons | Specific lift, strong buyer intent |
| deadlift not improving reasons | Same — own all three major lift plateau queries |
| strength gains stopped what to do | Broader, top-of-funnel |
| why am I losing strength in the gym | Regression query — strong distress signal |
| squat plateau after bulking | Very specific, long-tail, low competition |

### Cluster B — Recovery & Sleep (Entirely Uncontested for Indian Athletes)
| Keyword | Notes |
|---|---|
| sleep and strength training performance | Zero Indian competitors on this topic |
| how sleep affects muscle gains | Evergreen, high volume |
| overtraining signs strength athletes | High distress — links to diagnosis angle |
| recovery debt training | Emerging term, claim early |
| CNS fatigue strength training | Technical but searched by serious athletes |
| how to recover faster from strength training | High volume, top-of-funnel |
| sleep scheduling for lifters | New — no competition, directly maps to sleep insight card |
| pre-deadlift sleep quality | Extremely specific, zero competition — own the concept |

### Cluster C — Conditioning Interference (Unique to Hybrid/CrossFit)
| Keyword | Notes |
|---|---|
| cardio and strength training interference | Directly maps to AthleteOS feature |
| CrossFit and strength gains | High intent — CrossFit athletes searching this |
| concurrent training strength loss | Academic term, low competition |
| how much cardio is too much for strength | High volume, conversational |
| hybrid athlete programming india | Niche — own it completely |
| concurrent training cortisol effect | New angle from live feed — zero competition |
| HIIT and bench press plateau | Very specific, emerging query |

### Cluster D — App Comparison (Highest Commercial Intent)
| Keyword | Notes |
|---|---|
| Strong app nutrition tracking | Users who identified the exact gap AthleteOS fills |
| MyFitnessPal for powerlifters | Commercial intent, low competition |
| best app for strength training and nutrition | High volume, moderate competition |
| fitness tracker for serious athletes india | Geo + niche combo |
| Strong app alternative | Purchase-intent, competitor traffic |
| MyFitnessPal alternative for athletes | Same — high converting |
| Strong app vs MyFitnessPal for athletes | Query users ask when they've already identified the gap |

### Cluster E — Cross-Signal / Timing Intelligence (NEW — Own this category)
*These terms are emerging and have near-zero competition. AthleteOS can own the entire category.*
| Keyword | Notes |
|---|---|
| protein timing for strength training | Directly maps to new protein insight card (5/7 days) |
| pre-workout protein window | Emerging, low competition |
| reverse calorie cycling athletes | From live feed card — no one ranks for this |
| calorie periodization strength training | Technical, serious athlete query |
| volume distribution training frequency | From live feed Rohit card — academic, low comp |
| RPE trend overtraining detection | Emerging — serious athletes search this |
| fatigue masking strength gains | Concept from Ananya live feed card — claim early |
| sleep session scheduling powerlifting | From live feed Kiran/Siddharth cards — zero comp |

### Semantic / LSI Keywords (weave into body copy)
- progressive overload tracking
- muscle protein synthesis
- training load management
- strength training plateau
- powerlifting nutrition india
- CrossFit analytics
- performance plateau cause
- recovery debt
- CNS fatigue
- conditioning interference
- concurrent training
- protein timing window
- pre-session protein distribution
- cross-signal analysis
- multi-stream performance diagnosis
- calorie periodization
- volume frequency adaptation
- RPE trend analysis
- sleep-session correlation
- fatigue masking fitness
- reverse calorie cycling

---

## 3. Page Heading Hierarchy (Updated)

```
H1: "Know exactly why your lifts stalled."

  └── H2: "Built for athletes who train seriously."
        └── H3: Strength Athletes
        └── H3: Hybrid Athletes
        └── H3: CrossFit Athletes
        └── H3: 4–6 Days/Week Athletes

  └── H2: "You're training 5 days a week. Your numbers stopped moving. You don't know why."
        └── H3: Training apps track sets and reps — nothing more
        └── H3: Nutrition apps track macros in total isolation
        └── H3: Nobody connects training + nutrition for Indian athletes

  └── H2: "Not another fitness app."

  └── H2: "AthleteOS is a performance diagnosis system."
        └── H3: Connect your training data
        └── H3: Connect your recovery signals
        └── H3: AthleteOS runs the diagnosis

  └── H2: "The findings no single app has ever seen."  ← NEW (Live Signal Feed)

  └── H2: "Every feature built for serious strength & hybrid athletes"
        └── H3: Cross-Stream Intelligence Engine
        └── H3: Plateau Detection Engine
        └── H3: India-First Nutrition Database
        └── H3: Dynamic Training-Day Protein Targets
        └── H3: Advanced Strength Training Analytics
        └── H3: CrossFit & Hybrid Athlete Support

  └── H2: "Serious athletes. Real feedback." (Social proof)
  └── H2: "Intelligence that feels like having a data analyst for your training" (Product preview)
  └── H2: "Join athletes who train with data on their side" (CTA)
  └── H2: "Why Do Lifts Plateau?" (Education section)
  └── H2: "Stop guessing. Start performing." (Final CTA)
```

---

## 4. On-Page SEO Checklist

- [x] H1 contains primary product thesis (unique, keyword-adjacent)
- [x] H2s contain target keywords naturally: "strength training analytics", "athlete training platform"
- [x] H3s support semantic depth
- [x] `<title>` under 60 characters, keywords front-loaded
- [x] Meta description under 155 characters, includes CTA
- [x] `lang="en"` on `<html>`
- [x] `og:locale` set to `en_IN` for Indian audience signals
- [x] JSON-LD structured data (SoftwareApplication schema)
- [x] Canonical tag present
- [x] `rel="preconnect"` for font performance
- [x] Image alt text: all product images should include "AthleteOS strength training dashboard"
- [x] Internal anchor links in footer (signal keyword importance to crawlers)
- [x] Mobile-first layout (Core Web Vitals)
- [x] Live Signal Feed section adds 8 unique diagnosis concepts as indexable keyword-rich content
- [x] Cross-signal terminology throughout body copy (new semantic cluster)
- [ ] TODO: Add FAQ schema markup to "Why Do Lifts Plateau?" section
- [ ] TODO: Add `<link rel="sitemap" href="/sitemap.xml" />`
- [ ] TODO: Add Google Analytics / Plausible snippet
- [ ] TODO: Compress all images to WebP

---

## 5. Technical SEO Requirements

### Core Web Vitals Targets
| Metric | Target | Notes |
|---|---|---|
| LCP (Largest Contentful Paint) | < 2.5s | Preload hero fonts + OG image |
| FID / INP | < 100ms | Live feed uses CSS animation only — no JS scroll events |
| CLS | < 0.1 | Fixed navbar height, fixed feed container height (540px) |

### Implementation Notes
- Replace Tailwind CDN with local build for production (saves ~300KB)
- Host OG image at `/og-image.jpg` — 1200×630px, include app name + tagline
- Live Signal Feed is CSS-animation only (`will-change: transform`) — no layout shift risk
- Add `robots.txt` and `sitemap.xml` when going live
- Submit sitemap to Google Search Console
- Set up Plausible or GA4 for conversion tracking

---

## 6. Backlink Strategy

### Tier 1 — High Authority, Relevant Communities

| Target | Platform | Tactic |
|---|---|---|
| r/IndianFitness | Reddit | Share genuine insight post (not promo), link in profile bio |
| r/powerlifting | Reddit | Share "plateau analysis" educational thread, mention athleteOS |
| r/crossfit | Reddit | Comment helpfully on nutrition threads, soft mention |
| r/weightroom | Reddit | Post original training data analysis |
| r/gainit | Reddit | The "both misses were training days" protein insight makes a perfect data post |

### Tier 2 — Indian Fitness Blogs & Publications

| Target | Tactic |
|---|---|
| HealthShots.com | Pitch guest article: "Why Indian strength athletes plateau — a data perspective" |
| TheHealthSite.com | Pitch: "Strength training data: what Indian athletes are missing" |
| Sportskeeda Fitness | Pitch original content on performance intelligence |
| FitPage (fitpage.in) | Partnership / co-marketing with Indian fitness platform |
| GymShark India Blog | Guest contribution on strength training analytics |

### Tier 3 — CrossFit & Strength Communities

| Target | Platform | Tactic |
|---|---|
| CrossFit India (crossfitindia.com) | Website/Forum | Partner or sponsor content |
| Indian strength coaches on Instagram | Instagram | Affiliate / ambassador DMs |
| Barbell Brigade India equivalent | FB Group | Value-add posts, link in bio |
| StartingStrength community | Forum/Discord | Educational contribution |
| r/leangains | Reddit | Protein timing + training correlation posts |

### Tier 4 — Sports Science & Nutrition Blogs

| Target | Tactic |
|---|---|
| Alan Aragon Research Review | Mention in citations / research context |
| Greg Nuckols / Stronger by Science | Data-driven guest article outreach — the cross-signal angle is exactly their audience |
| Eric Helms / 3DMJ | Collaboration or mention outreach |
| Examine.com | Link building through cited data |
| NSCA India (nsca.com India chapter) | Sponsorship / educational content |

### Tier 5 — Directories & Lists

- Product Hunt launch (target #1 of the day in Health & Fitness)
- BetaList submission (captures early-stage tech audience)
- AlternativeTo.net listing (competitor comparison traffic)
- Futurepedia.io or AI tool directories (cross-signal intelligence angle fits AI tools)
- IndianStartups.com or YourStory feature pitch

### Tier 6 — High-Value Additions

| Target | Tactic |
|---|---|
| Indian strength coaching YouTube channels (Fitness FAQs India, TRS Clips fitness) | Data-led video collab: "We analyzed 50 Indian athletes' plateaus — here's what we found" — generates links + waitlist signups |
| MuscleBlaze / Ritebite / Wellbeing Nutrition | Co-marketing content on protein timing for Indian athletes — the "5/7 days hit target, both misses on training days" finding is a shareable stat for them |
| Cult.fit / Gold's Gym India / Anytime Fitness India blogs | Guest posts: "Performance tracking for serious gym athletes" |
| NSCA-certified coaches in India (find on LinkedIn) | Offer free founding access — they mention athleteOS to clients, links follow |
| r/IndianFitness (correct approach) | Post: "We analyzed training + nutrition from 30 Indian athletes — here's the pattern nobody talks about." Use the live feed findings as real data points. Data-led posts get pinned. |

---

## 7. Content Marketing SEO Strategy (First 90 Days)

### Blog Posts to Write (target long-tail keywords)

**Priority 1 — Write before launch (highest ROI)**
```
/blog/athleteos-vs-strong-vs-myfitnesspal  → "athleteOS vs Strong vs MyFitnessPal: which app actually explains your plateau?"
                                              Target: "Strong app alternative", "MyFitnessPal for athletes"
                                              Why: Comparison posts convert at 3–5x the rate of general content

/blog/why-bench-press-stopped             → "Why your bench press stopped going up (and it's not your programming)"
                                              Target: "bench press plateau reasons"
                                              Why: High volume, low competition, immediate audience match

/blog/sleep-and-strength-loss            → "Sleep debt and strength loss: what Indian athletes ignore"
                                              Target: "sleep and strength training performance"
                                              Why: Zero Indian competitors on this topic
```

**Priority 2 — Publish in first 30 days**
```
/blog/protein-timing-vs-protein-total    → "You're hitting your protein target — and still plateauing. Here's why."
                                              Target: "protein timing for strength training", "pre-workout protein window"
                                              Why: Directly from the athleteOS insight card. Counterintuitive headline.
                                              Hook: "5 of 7 days at target. Both misses: leg day and pull day."

/blog/reverse-calorie-cycling            → "You're eating more on rest days than training days. Most athletes are."
                                              Target: "reverse calorie cycling athletes", "calorie periodization strength"
                                              Why: From live feed card. Zero competition. Extremely shareable finding.

/blog/cardio-killing-your-squat          → "Is your cardio killing your squat? The concurrent training problem"
                                              Target: "cardio and strength training interference"

/blog/sleep-scheduling-not-sleep-amount  → "It's not how much you sleep. It's which nights you sleep badly."
                                              Target: "sleep session scheduling powerlifting", "pre-deadlift sleep quality"
                                              Why: From live feed Siddharth/Kiran cards. Zero competition on this angle.
```

**Priority 3 — Ongoing**
```
/blog/why-indian-athletes-plateau        → "Why Indian strength athletes plateau: the data behind stalled lifts"
/blog/overtraining-vs-under-recovering   → "Overtraining vs under-recovering: Indian athletes often confuse the two"
/blog/why-lifts-regressed               → "Why your lifts went backwards after a good training block"
/blog/volume-distribution-frequency     → "The same weekly volume spread across 2 sessions beats 1 session. Here's why."
                                              Target: "volume distribution training frequency"
/blog/fatigue-masking-strength          → "Your deload isn't losing gains. Fatigue is hiding them."
                                              Target: "fatigue masking strength gains", "RPE trend overtraining"
/blog/squat-plateau-causes               → "Your squat has stalled. Here are 7 data-backed reasons why"
/blog/crossfit-nutrition-india           → "CrossFit nutrition for Indian athletes: the complete guide"
/blog/india-protein-sources-athletes     → "Best protein sources for Indian athletes: dal to whey, ranked by macro density"
/blog/hydration-strength-training        → "How dehydration silently tanks your lifts — especially in Indian summers"
/blog/hybrid-athlete-tracking            → "How hybrid athletes should track both strength and conditioning"
```

Each post should:
1. Target a long-tail keyword with < 500 monthly searches (low competition)
2. Link to the landing page CTA in the first and last paragraph
3. Include an athleteOS insight card example as a visual/pull quote (saffron-on-ink card per brand guidelines)
4. Be 1,200–2,000 words, structured with H2/H3
5. Include a "What athleteOS tracks" section at the end linking to the 9-signals section
6. Use at least one of the live feed diagnosis scenarios as a real-world example

### Shareable Data Posts (for social + backlinks)

These are standalone findings from the live feed that can be posted as X/Instagram graphics. Each one is a link magnet:

| Finding | Format | Target platform |
|---|---|---|
| "5/7 days hitting protein target. Both misses: leg day + pull day." | Graphic + chart | X, Instagram, Reddit |
| "7.1h weekly sleep average — looks fine. 5.4h before every deadlift." | Graphic | X, fitness communities |
| "Volume +31%. Calories +0. RPE on same weights: 6.8 → 9.4." | Graphic | X, r/powerlifting |
| "Bench plateau started exactly 6 weeks after adding Saturday HIIT." | Thread post | X, r/weightroom |
| "You can hit your protein target every day and still be 38g short on the days it matters." | Carousel | Instagram, LinkedIn |

### Topic Cluster Hub Structure (for topical authority)
```
Pillar: /why-lifts-plateau          (2,500 words — head keyword hub)
  └── /blog/squat-plateau-causes
  └── /blog/bench-press-plateau
  └── /blog/deadlift-not-improving
  └── /blog/sleep-scheduling-not-sleep-amount
  └── /blog/overtraining-recovery
  └── /blog/fatigue-masking-strength          ← NEW

Pillar: /performance-factors        (lists all 9 signals AthleteOS analyzes)
  └── /blog/training-load-management
  └── /blog/progressive-overload-tracking
  └── /blog/conditioning-interference
  └── /blog/hydration-strength-training
  └── /blog/volume-distribution-frequency     ← NEW
  └── /blog/rpe-trend-analysis                ← NEW

Pillar: /indian-athlete-nutrition   (geo + category)
  └── /blog/india-protein-sources
  └── /blog/protein-timing-vs-protein-total   ← NEW (highest priority)
  └── /blog/reverse-calorie-cycling           ← NEW
  └── /blog/crossfit-nutrition-india
  └── /blog/hybrid-athlete-tracking
```

---

## 8. Launch Sequence

```
Week 0  → Landing page live with SEO meta, sitemap, robots.txt
Week 1  → Product Hunt launch + Reddit posts in r/IndianFitness, r/powerlifting
            Post the "5/7 protein days" finding as a standalone data thread
Week 2  → First blog post live ("you're hitting protein target and still plateauing")
            Submit to Google Search Console
Week 3  → Outreach to 5 Indian fitness creators for link/mention
            Share "reverse calorie cycling" finding on X
Week 4  → Guest article pitch to HealthShots / Sportskeeda
Week 6  → Second blog post + "sleep scheduling" finding repurposed as Instagram carousel
Week 8  → Review GSC data, double down on highest-traffic keyword pages
Week 10 → "Volume distribution" and "fatigue masking" posts — target r/weightroom
```

---

## 9. Analytics & Tracking Setup

```html
<!-- Add before </head> -->

<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Key Conversion Events to Track
| Event | Trigger | Priority |
|---|---|---|
| `waitlist_signup` | Email form submission | Critical |
| `cta_click` | Any "Get Early Access" button click | Critical |
| `insight_card_viewed` | Hero insight card in viewport | High |
| `insight_tab_switch` | User clicks Protein / Sleep / Recovery tab | High |
| `live_feed_engaged` | User hovers live feed (pauses scroll) | Medium |
| `live_feed_card_hover` | User hovers individual feed card | Medium |
| `section_view` | Scroll to each section (IntersectionObserver) | Medium |
| `comparison_table_viewed` | User scrolls to competitor comparison | Medium |

### Funnel to Measure
```
Landing → Insight Card View → Comparison Table View → Live Feed Engaged → Waitlist CTA → Signup
```
The live feed is the new mid-funnel credibility builder. Track drop-off between "live feed engaged" and "waitlist CTA" to measure its impact.

---

## 10. Quick Implementation Guide

### Next.js Conversion Path
```
athleteos-landing/
├── app/
│   ├── layout.tsx        ← Move <head> SEO tags + metadata export here
│   │                        Note: use "athleteOS" (lowercase athlete, uppercase OS) in all metadata
│   ├── page.tsx          ← Convert index.html sections to React components
│   └── globals.css       ← Move <style> block here. Brand tokens: --saffron, --ink, --ember, --slate
├── components/
│   ├── Nav.tsx           ← Saffron Orbit SVG mark + Plus Jakarta Sans 800 wordmark
│   ├── Hero.tsx
│   │   └── InsightCards.tsx     ← Protein / Sleep / Recovery tabbed cards
│   ├── WhoItsFor.tsx
│   ├── Problem.tsx
│   ├── Comparison.tsx
│   ├── Solution.tsx
│   ├── IndiaFirst.tsx
│   ├── Features.tsx
│   ├── SocialProof.tsx
│   ├── LiveSignalFeed.tsx       ← dual-column auto-scrolling feed
│   │   └── feedData.ts          ← Extract 8 diagnosis objects here
│   ├── ProductPreview.tsx
│   ├── EmailCapture.tsx
│   ├── WhyPlateaus.tsx
│   └── Footer.tsx               ← Saffron Orbit mark inline lockup (22px)
├── public/
│   ├── og-image.jpg      ← 1200×630px — use Deep Ink (#0B1118) background, Saffron mark + wordmark
│   ├── favicon.ico       ← Saffron Orbit mark, 3-element version at 32px (see brand guidelines)
│   ├── apple-touch-icon.png ← 180×180px, Deep Ink bg, full orbit mark
│   ├── robots.txt
│   └── sitemap.xml
└── tailwind.config.ts    ← Brand tokens: saffron #FF7A2F, ember #E05A00, ink #0B1118, slate #1A2535, warm #FAF8F5
```

### LiveSignalFeed Data Shape (for `feedData.ts`)
```typescript
interface FeedDiagnosis {
  id: string;
  athlete: string;         // "ARJUN M."
  city: string;            // "MUMBAI"
  lift: string;            // "SQUAT"
  signals: string[];       // ["CALORIE DISTRIBUTION", "SESSION LOAD"]
  dataLines: { label: string; value: string; flag?: 'red' | 'green' | 'neutral' }[];
  diagnosis: string;
  subtext: string;
  fix: string;
  confidence: number;      // 89
  timeAgo: string;         // "12m ago"
}
```

### Email Integration Options (choose one)
```typescript
// Option A: Mailchimp (form action attribute)
// Set action="https://YOUR_LIST.us1.list-manage.com/subscribe/post?u=XXX&id=XXX"

// Option B: ConvertKit
await fetch('https://app.convertkit.com/forms/FORM_ID/subscriptions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email_address: email, first_name: '' })
});

// Option C: Resend (via Next.js API route)
// app/api/subscribe/route.ts
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);
// Add contact to audience, then send welcome email
```

### Suggested Visuals to Create
| Asset | Spec | Brand Notes |
|---|---|---|
| OG image | 1200×630px JPG | Deep Ink (#0B1118) bg. Saffron Orbit hero lockup (56px mark + 32px wordmark). Tagline: "The only system that tells you exactly why your performance is stuck." |
| Hero screenshot | ~900×600px | Dark mode. Deep Ink bg. Saffron accent. Space Mono for all data/metric values. |
| Dashboard mockup | 1200×800px | Replace mock HTML dashboard. Same Dark + Saffron palette. |
| App icon / favicon | 32×32 (3-element orbit) + 180×180 (full orbit on #0B1118 rounded square) | See brand guidelines Section 05 for size-specific simplification rules. |
| Twitter/X card image | 800×418px | Same as OG image treatment — Deep Ink + Saffron Orbit mark. |
| Shareable strength card | 1200×630px | Strength percentile card per brand guidelines Section 06A. Deep Ink bg, Space Mono metrics, Saffron "TOP X%" callout. |
| Shareable data graphics (5) | 1080×1080px | From live feed findings — saffron-on-ink. See Section 7. |

---

## 11. Structured Data Additions (TODO)

### FAQ Schema for "Why Do Lifts Plateau?" section
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Why do lifts plateau even with consistent training?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Plateaus are almost never caused by programming alone. athleteOS cross-analyzes 9 signals simultaneously — including protein timing relative to session load, sleep quality on specific training nights, accumulated recovery debt, and calorie availability during volume accumulation blocks. The cause is almost always found in the intersection of these signals, not in any single one."
      }
    },
    {
      "@type": "Question",
      "name": "Can protein intake cause a strength plateau even if you're hitting your daily target?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Total daily protein can be adequate while timing distribution is causing a plateau. If 78% of your protein is consumed after training, your pre-session muscle protein synthesis window is consistently underfueled. athleteOS detects this pattern by correlating daily protein logs against training session timestamps."
      }
    },
    {
      "@type": "Question",
      "name": "How does sleep cause a strength plateau if my weekly average is fine?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Weekly sleep averages are misleading. The critical variable is sleep quality on the nights before your heaviest sessions. athleteOS correlates sleep data with session scheduling to detect patterns like consistently poor sleep before deadlift days — patterns that aggregate averages completely hide."
      }
    }
  ]
}
```

---

*Generated for athleteOS — Performance Intelligence for Indian Athletes*
*Page: v3.0 — Live Signal Feed, redesigned insight cards, cross-signal positioning, Saffron Orbit brand identity applied.*
