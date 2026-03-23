import { NavBar }          from '@/components/landing/NavBar'
import { HeroSection }     from '@/components/landing/HeroSection'
import { RankSection }     from '@/components/landing/RankSection'
import { ProblemSection }  from '@/components/landing/ProblemSection'
import { SystemSection }   from '@/components/landing/SystemSection'
import { CTASection }      from '@/components/landing/CTASection'
import { FAQSection }      from '@/components/landing/FAQSection'
import { StickyJoinBar }   from '@/components/landing/StickyJoinBar'
import { Footer }          from '@/components/landing/Footer'
import { ReferralEntryBanner } from '@/components/landing/ReferralEntryBanner'

export default function LandingV2() {
  return (
    <div className="grid-bg relative min-h-screen antialiased">
      <NavBar />
      <StickyJoinBar />
      <ReferralEntryBanner />
      <main className="relative z-10 flex flex-col">
        <div className="order-1">
          <HeroSection />
        </div>

        <div className="order-2">
          <RankSection />
          <div className="section-line mx-auto max-w-screen-xl px-6 md:px-10" />
        </div>

        <div className="order-3 md:order-6">
          <div className="section-line mx-auto hidden max-w-screen-xl px-6 md:block md:px-10" />
          <CTASection />
        </div>

        <div className="order-4 mx-auto max-w-4xl px-6 py-8 md:hidden">
          <div
            className="rounded-xl p-5"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <p className="font-mono-label text-accent mb-3">Why athletes join</p>
            <div className="grid gap-3">
              {[
                '3,200+ athlete records benchmark your lifts against serious Indian strength athletes.',
                'athleteOS connects training load, nutrition, and recovery into one diagnosis.',
                'Founding members lock the lowest price and get first access on launch.',
              ].map((point) => (
                <p key={point} className="text-sm leading-relaxed text-muted-foreground">
                  {point}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="order-5 md:order-3">
          <div className="md:hidden section-line mx-auto max-w-screen-xl px-6 md:px-10" />
          <ProblemSection />
        </div>

        {/* Stack gap callout — bridge between Problem and System */}
        <div className="order-6 mx-auto max-w-4xl px-6 py-8 md:order-4 md:px-10 md:py-10">
          <div
            className="rounded-xl p-5 md:hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(127,178,255,0.06) 0%, rgba(255,255,255,0.015) 100%)',
              border: '1px solid rgba(127,178,255,0.14)',
            }}
          >
            <p className="font-mono-label text-accent mb-2">Why this matters</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Strong, MyFitnessPal, and wearables each track one thing. athleteOS connects them so the actual limiter is obvious.
            </p>
          </div>
          <div
            className="hidden rounded-xl p-6 md:block md:p-8"
            style={{
              background: 'linear-gradient(135deg, rgba(127,178,255,0.06) 0%, rgba(255,255,255,0.015) 100%)',
              border: '1px solid rgba(127,178,255,0.14)',
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-accent"
                style={{ boxShadow: '0 0 0 4px rgba(127,178,255,0.12)' }}
              />
              <div>
                <p className="text-base md:text-lg font-semibold text-foreground leading-snug mb-2">
                  You&apos;re already using Strong + MyFitnessPal + a wearable. You&apos;re still guessing.
                </p>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Each tool tracks one thing in isolation. Your wearable sees strain but not nutrition.
                  MFP logs food but with wrong data for Indian meals. Strong records sets but can&apos;t tell you
                  why the weight isn&apos;t moving. When your squat stalls, no single app can distinguish between
                  sleep debt, protein drift, or accumulated overload.
                  athleteOS is the layer that connects all three and isolates the actual limiter.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="order-7 md:order-5">
          <div className="section-line mx-auto max-w-screen-xl px-6 md:px-10" />
          <SystemSection />
        </div>

        {/* Credibility strip — honest founder context */}
        <div className="order-8 mx-auto max-w-4xl px-6 py-12 md:order-7 md:px-10">
          <div
            className="rounded-xl p-6 text-center"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <p className="text-sm font-semibold text-foreground mb-2">Built by athletes who train, not just code.</p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              athleteOS is built by competitive strength athletes and software engineers in India.
              We built this because we couldn&apos;t find a system that connected training, nutrition, and recovery
              into one honest diagnosis — so we&apos;re making it.
            </p>
            <p className="mt-3 text-xs text-muted-foreground/60">
              Questions before joining?{' '}
              <a href="https://wa.me/916005109043" className="text-accent hover:underline">WhatsApp us directly</a>
            </p>
          </div>
        </div>

        <div className="order-9 md:order-8">
          <FAQSection />
        </div>
      </main>
      <Footer />
    </div>
  )
}
