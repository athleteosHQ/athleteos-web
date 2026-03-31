'use client'

import { trackEvent } from '@/lib/analytics'

export function HeroSection() {
  const handleCTA = () => {
    trackEvent('cta_clicked', { cta_source: 'hero', cta_text: 'See Where You Rank', has_rank_result: false })
    document.getElementById('rank')?.scrollIntoView({ behavior: 'smooth' })
    window.setTimeout(() => {
      document.getElementById('rank-bw-input')?.focus()
    }, 500)
  }

  return (
    <section id="hero" className="relative flex min-h-[55vh] flex-col items-center justify-center px-6 py-20 text-center">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-display font-bold text-foreground leading-tight sm:text-5xl md:text-6xl">
          You train. You track.{' '}
          <span className="hero-gradient-word">Your total hasn&apos;t moved in months.</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground sm:text-xl max-w-xl mx-auto">
          AthleteOS finds the one variable actually holding you back — by reading your{' '}
          <span className="text-foreground font-medium">training</span>,{' '}
          <span className="text-foreground font-medium">nutrition</span>, and{' '}
          <span className="text-foreground font-medium">recovery</span>{' '}
          as one system, not three apps.
        </p>
        <button
          type="button"
          onClick={handleCTA}
          className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-accent px-8 py-4 text-base font-bold text-white transition-all hover:bg-accent-light"
          style={{ boxShadow: '0 2px 8px rgba(107,122,237,0.25), 0 1px 2px rgba(0,0,0,0.4)' }}
        >
          See Where You Rank
        </button>
      </div>
    </section>
  )
}
