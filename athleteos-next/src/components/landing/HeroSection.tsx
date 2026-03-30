'use client'

import { motion } from 'framer-motion'

export function HeroSection() {
  const handleCTA = () => {
    document.getElementById('rank')?.scrollIntoView({ behavior: 'smooth' })
    window.setTimeout(() => {
      document.getElementById('rank-bw-input')?.focus()
    }, 500)
  }

  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl"
      >
        <h1 className="text-4xl font-display font-bold text-foreground leading-tight sm:text-5xl md:text-6xl">
          Your performance is stuck.
        </h1>
        <p className="mt-4 text-lg text-muted-foreground sm:text-xl">We&apos;ll tell you exactly why.</p>
        <button
          type="button"
          onClick={handleCTA}
          className="cta-glow mt-8 inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 text-base font-bold text-white transition hover:bg-accent-light accent-glow"
        >
          Diagnose My Plateau
          <span className="text-white/60">↓</span>
        </button>
      </motion.div>
    </section>
  )
}
