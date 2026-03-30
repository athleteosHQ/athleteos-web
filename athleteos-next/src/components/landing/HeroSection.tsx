'use client'

import { ModeSelector, type AthleteMode } from './ModeSelector'

interface HeroSectionProps {
  mode: AthleteMode
  onModeChange: (mode: AthleteMode) => void
}

export function HeroSection({ mode, onModeChange }: HeroSectionProps) {
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
          Your performance is{' '}
          <span className="hero-gradient-word">stuck.</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground sm:text-xl max-w-xl mx-auto">
          AthleteOS reads your training, nutrition, and recovery as one system, so the real bottleneck becomes obvious.
        </p>
        <div className="mt-8 flex justify-center">
          <ModeSelector mode={mode} onModeChange={onModeChange} />
        </div>
        <button
          type="button"
          onClick={handleCTA}
          className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-md bg-accent px-8 py-4 text-base font-bold text-white transition-colors hover:bg-accent-light"
          style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
        >
          Run My Performance Check
        </button>
      </div>
    </section>
  )
}
