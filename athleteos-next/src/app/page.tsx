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
    <div className="relative min-h-screen antialiased overflow-x-hidden">
      <NavBar />
      <StickyJoinBar />
      <Suspense fallback={null}>
        <ReferralEntryBanner />
      </Suspense>
      <ScanLineObserver />
      <main className="relative z-10 flex flex-col gap-24">
        {/* 1. Hero — pain + CTA + score preview */}
        <section className="floating-widget-container">
          <HeroSection />
        </section>

        {/* 2. Problem — why tracking fails (builds urgency) */}
        <section className="floating-widget-container">
          <ProblemSection />
        </section>

        {/* 3. Sample output — show what the diagnosis looks like (satisfy curiosity) */}
        <section className="floating-widget-container">
          <SampleOutcomeBlock />
        </section>

        {/* 4. Calculator — generate your baseline (fast path to value) */}
        <section className="floating-widget-container">
          <RankSection mode={mode} onModeChange={setMode} onRankResult={setRankResult} />
        </section>

        {/* 5. Personalized upsell — locked diagnosis using their data */}
        {rankResult && (
          <section className="floating-widget-container">
            <PersonalizedUpsellStrip rankResult={rankResult} />
          </section>
        )}

        {/* 6. How it works — for skeptics who scroll past the calculator */}
        <section className="floating-widget-container flex flex-col gap-24">
          <InsightPatternsSection />
          <SystemSection />
        </section>

        {/* 7. Mechanism proof — what continues after the first read */}
        {rankResult && (
          <section className="floating-widget-container px-6 py-12 md:px-10">
            <div className="mx-auto max-w-2xl p-8 surface-card relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <ScanLineObserver />
              </div>
              <p className="font-mono-label text-success mb-6 tracking-widest">Post-Baseline Protocol</p>
              <h3 className="text-2xl font-display font-bold text-foreground mb-8">What happens after your first read</h3>
              
              <div className="space-y-3">
                {[
                  { week: 'Week 1', text: 'You log training and nutrition. The system builds your baseline from real data — not estimates.' },
                  { week: 'Week 2', text: 'First full diagnosis. One limiter identified across training, nutrition, and recovery. One correction to test.' },
                  { week: 'Week 4', text: 'Re-read. Did the correction land? The system compares before and after — then identifies the next limiter.' },
                  { week: 'Ongoing', text: 'Every block, a sharper read. The system learns your patterns — what works, what doesn\'t, what to try next.' }
                ].map((step, i) => (
                  <div key={step.week} className="flex gap-4 p-4 rounded-xl surface-inset border border-white/5 transition-colors hover:border-white/10 group">
                    <span className="font-mono-label text-success shrink-0 w-16 pt-0.5 opacity-70 group-hover:opacity-100 transition-opacity">{step.week}</span>
                    <p className="text-sm text-muted-foreground group-hover:text-foreground/90 transition-colors">{step.text}</p>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-xs text-muted-foreground/40 font-mono-label italic text-center">This is the loop you&apos;re joining. Not a one-time report.</p>
            </div>
          </section>
        )}

        {/* 8. Signup gate */}
        <section className="floating-widget-container">
          <SignupGateSection overallPct={rankResult?.overallPct ?? null} />
        </section>

        {/* 9. Fallback trust for skeptics */}
        <section className="floating-widget-container flex flex-col gap-24">
          <TrustStrip />
          <FAQSection />
        </section>
      </main>
      <Footer />
    </div>
  )
}
