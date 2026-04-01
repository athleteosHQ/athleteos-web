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
        <div className="py-10 text-center px-6">
          <p className="text-sm text-muted-foreground">Athletes are already joining. The founding cohort won&apos;t stay open.</p>
          <a href="#inline-signup-gate" className="mt-2 inline-block font-mono-label text-accent hover:text-accent-light transition">Reserve My Diagnosis →</a>
        </div>
        <TrustStrip />
        <FAQSection />
      </main>
      <Footer />
    </div>
  )
}
