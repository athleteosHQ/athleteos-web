import { Suspense } from 'react'

import { CTASection } from '@/components/landing/CTASection'
import { ConditionalSampleOutcome } from '@/components/landing/ConditionalSampleOutcome'
import { FAQSection } from '@/components/landing/FAQSection'
import { Footer } from '@/components/landing/Footer'
import { HeroSection } from '@/components/landing/HeroSection'
import { NavBar } from '@/components/landing/NavBar'
import { RankSection } from '@/components/landing/RankSection'
import { ReferralEntryBanner } from '@/components/landing/ReferralEntryBanner'
import { StickyJoinBar } from '@/components/landing/StickyJoinBar'
import { TrustStrip } from '@/components/landing/TrustStrip'

export default function LandingV2() {
  return (
    <div className="grid-bg relative min-h-screen antialiased">
      <NavBar />
      <StickyJoinBar />
      <Suspense fallback={null}>
        <ReferralEntryBanner />
      </Suspense>
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
