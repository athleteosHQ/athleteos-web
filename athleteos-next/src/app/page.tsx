'use client'

import { useState, Suspense } from 'react'
import type { AthleteMode } from '@/components/landing/ModeSelector'

import { ConditionalSampleOutcome } from '@/components/landing/ConditionalSampleOutcome'
import { FAQSection } from '@/components/landing/FAQSection'
import { Footer } from '@/components/landing/Footer'
import { HeroSection } from '@/components/landing/HeroSection'
import { LockedPreviewSection } from '@/components/landing/LockedPreviewSection'
import { NavBar } from '@/components/landing/NavBar'
import { RankSection } from '@/components/landing/RankSection'
import { ReferralEntryBanner } from '@/components/landing/ReferralEntryBanner'
import { SignupGateSection } from '@/components/landing/SignupGateSection'
import { StickyJoinBar } from '@/components/landing/StickyJoinBar'
import { SystemSection } from '@/components/landing/SystemSection'
import { TrustStrip } from '@/components/landing/TrustStrip'

export default function LandingV2() {
  const [mode, setMode] = useState<AthleteMode>('gym')

  return (
    <div className="grid-bg relative min-h-screen antialiased">
      <NavBar />
      <StickyJoinBar />
      <Suspense fallback={null}>
        <ReferralEntryBanner />
      </Suspense>
      <main className="relative z-10 flex flex-col">
        <HeroSection mode={mode} onModeChange={setMode} />
        <RankSection mode={mode} />
        <ConditionalSampleOutcome />
        <SystemSection />
        <LockedPreviewSection />
        <SignupGateSection />
        <TrustStrip />
        <FAQSection />
      </main>
      <Footer />
    </div>
  )
}
