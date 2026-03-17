import { NavBar }         from '@/components/landing/NavBar'
import { HeroSection }    from '@/components/landing/HeroSection'
import { PillarStrip }    from '@/components/landing/PillarStrip'
import { RankSection }    from '@/components/landing/RankSection'
import { ProblemSection } from '@/components/landing/ProblemSection'
import { SystemSection }  from '@/components/landing/SystemSection'
import { CTASection }     from '@/components/landing/CTASection'
import { Footer }         from '@/components/landing/Footer'

export default function LandingV2() {
  return (
    <div className="grid-bg relative min-h-screen antialiased">
      <NavBar />
      <main className="relative z-10">
        <HeroSection />
        <PillarStrip />
        <div className="section-line mx-auto max-w-6xl px-4 sm:px-6" />
        <RankSection />
        <div className="section-line mx-auto max-w-6xl px-4 sm:px-6" />
        <ProblemSection />
        <div className="section-line mx-auto max-w-6xl px-4 sm:px-6" />
        <SystemSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
