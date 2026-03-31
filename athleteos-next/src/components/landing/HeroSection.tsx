'use client'

export function HeroSection() {
  const handleCTA = () => {
    document.getElementById('rank')?.scrollIntoView({ behavior: 'smooth' })
    window.setTimeout(() => {
      document.getElementById('rank-bw-input')?.focus()
    }, 500)
  }

  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-display font-bold text-foreground leading-tight sm:text-5xl md:text-6xl">
          You train. You track.{' '}
          <span className="hero-gradient-word">Your total hasn&apos;t moved in months.</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground sm:text-xl max-w-xl mx-auto">
          AthleteOS finds the one variable actually holding you back — by reading your training, nutrition, and recovery as one system, not three apps.
        </p>
        <button
          type="button"
          onClick={handleCTA}
          className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-md bg-accent px-8 py-4 text-base font-bold text-white transition-colors hover:bg-accent-light"
          style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
        >
          See Where You Rank
        </button>
      </div>
    </section>
  )
}
