import { NavBar }              from '@/components/landing/NavBar'
import { HeroSection }         from '@/components/landing/HeroSection'
import { RankSection }         from '@/components/landing/RankSection'
import { ProblemSection }      from '@/components/landing/ProblemSection'
import { SystemSection }       from '@/components/landing/SystemSection'
import { FAQSection }          from '@/components/landing/FAQSection'
import { CTASection }          from '@/components/landing/CTASection'
import { StickyJoinBar }       from '@/components/landing/StickyJoinBar'
import { Footer }              from '@/components/landing/Footer'

export default function LandingV2() {
  return (
    <div className="grid-bg relative min-h-screen antialiased">
      <NavBar />
      <StickyJoinBar />
      <main className="relative z-10">
        <HeroSection />
        <RankSection />
        <div className="section-line mx-auto max-w-screen-xl px-6 md:px-10" />
        <ProblemSection />
        <div className="section-line mx-auto max-w-screen-xl px-6 md:px-10 mt-6" />
        <SystemSection />
        <div className="section-line mx-auto max-w-screen-xl px-6 md:px-10" />
        <CTASection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  )
}
