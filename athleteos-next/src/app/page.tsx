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
import { ScanLineObserver } from '@/components/landing/ScanLineObserver'
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
      <ScanLineObserver />
      <main className="relative z-10 flex flex-col">
        {/* 1. Hero — tension + promise */}
        <HeroSection />
        <div className="section-blend" style={{ '--blend-from': '#09090B', '--blend-to': '#0C0C0E' } as React.CSSProperties} />

        {/* 2. Problem proof — why tracking fails (compact) */}
        <ProblemSection />
        <div className="section-blend" style={{ '--blend-from': '#0C0C0E', '--blend-to': '#09090B' } as React.CSSProperties} />

        {/* 3. System proof — how AthleteOS reads inputs together */}
        <InsightPatternsSection />
        <SystemSection />
        <div className="section-blend" style={{ '--blend-from': '#09090B', '--blend-to': '#0C0C0E' } as React.CSSProperties} />

        {/* 4. Sample diagnosis — what the output looks like */}
        <SampleOutcomeBlock />

        {/* 5. Calculator — generate your baseline */}
        <RankSection mode={mode} onModeChange={setMode} onRankResult={setRankResult} />

        {/* 6. Personalized upsell — locked diagnosis using their data */}
        {rankResult && <PersonalizedUpsellStrip rankResult={rankResult} />}

        {/* 7. Mechanism proof — what continues after the first read */}
        {rankResult && (
          <section className="px-6 py-12 md:px-10">
            <div className="mx-auto max-w-2xl">
              <p className="font-mono-label text-accent mb-3">What happens after your first read</p>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <span className="font-mono-label text-accent shrink-0 w-16 pt-0.5">Week 1</span>
                  <p className="text-sm text-muted-foreground">You log training and nutrition. The system builds your baseline from real data — not estimates.</p>
                </div>
                <div className="flex gap-4">
                  <span className="font-mono-label text-accent shrink-0 w-16 pt-0.5">Week 2</span>
                  <p className="text-sm text-muted-foreground">First full diagnosis. One limiter identified across training, nutrition, and recovery. One correction to test.</p>
                </div>
                <div className="flex gap-4">
                  <span className="font-mono-label text-accent shrink-0 w-16 pt-0.5">Week 4</span>
                  <p className="text-sm text-muted-foreground">Re-read. Did the correction land? The system compares before and after — then identifies the next limiter.</p>
                </div>
                <div className="flex gap-4">
                  <span className="font-mono-label text-accent shrink-0 w-16 pt-0.5">Ongoing</span>
                  <p className="text-sm text-muted-foreground">Every block, a sharper read. The system learns your patterns — what works, what doesn&apos;t, what to try next.</p>
                </div>
              </div>
              <p className="mt-5 text-xs text-muted-foreground/60">This is the loop you&apos;re joining. Not a one-time report.</p>
            </div>
          </section>
        )}

        {/* 8. Signup gate */}
        <SignupGateSection overallPct={rankResult?.overallPct ?? null} />

        {/* 9. Fallback trust for skeptics */}
        <TrustStrip />
        <FAQSection />
      </main>
      <Footer />
    </div>
  )
}
