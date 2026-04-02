'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { trackEvent } from '@/lib/analytics'
import { useMotionSafe } from '@/lib/motion'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true })
  const { reduced } = useMotionSafe()

  const handleCTA = () => {
    trackEvent('cta_clicked', { cta_source: 'hero', cta_text: 'Start Your First Read', has_rank_result: false })
    document.getElementById('rank')?.scrollIntoView({ behavior: 'smooth' })
    window.setTimeout(() => {
      document.getElementById('rank-bw-input')?.focus()
    }, 500)
  }

  return (
    <section
      id="hero"
      ref={ref}
      className="relative flex min-h-[55vh] flex-col items-center justify-center px-6 py-20 text-center overflow-hidden"
    >
      {/* ── Background System Interconnect Visual ── */}
      {!reduced && (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-10" aria-hidden="true">
          <svg width="100%" height="100%" viewBox="0 0 1000 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <circle cx="200" cy="150" r="2" fill="rgba(255,255,255,0.4)" />
            <circle cx="800" cy="450" r="2" fill="rgba(255,255,255,0.25)" />
            <circle cx="300" cy="500" r="2" fill="#2DDC8F" />
            <path d="M200 150 Q500 300 800 450" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" strokeDasharray="4 12" className="animate-[dash_40s_linear_infinite]" />
            <path d="M800 450 Q500 300 300 500" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" strokeDasharray="4 12" className="animate-[dash_35s_linear_infinite]" />
            <path d="M300 500 Q500 300 200 150" stroke="#2DDC8F" strokeWidth="0.5" strokeDasharray="4 12" className="animate-[dash_45s_linear_infinite]" />
          </svg>
        </div>
      )}

      {/* ── Ambient gradient atmosphere ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {!reduced && (
          <div
            className="absolute top-[-20%] left-1/2 -translate-x-1/2"
            style={{
              width: '800px',
              height: '500px',
              background: 'radial-gradient(ellipse 70% 55%, rgba(161,161,170,0.08) 0%, rgba(161,161,170,0.03) 50%, transparent 70%)',
              filter: 'blur(2px)',
            }}
          />
        )}
      </div>

      <div className="relative z-10 max-w-3xl">
        {/* ── Line 1: "You train. You track." — stagger in ── */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <h1 className="text-4xl font-display font-bold text-foreground leading-tight sm:text-5xl md:text-6xl uppercase tracking-[-0.03em] leading-[1.0] font-[800]">
            <span style={{ background: 'linear-gradient(180deg, #fff 20%, #a1a1aa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>You train. You track.</span>
          </h1>
        </motion.div>

        {/* ── Line 2: gradient emphasis — delayed reveal ── */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.12, ease: EASE }}
        >
          <h1 className="text-4xl font-display font-bold leading-tight sm:text-5xl md:text-6xl uppercase tracking-[-0.03em] leading-[1.0] font-[800]">
            <span className="hero-gradient-word relative inline-block">
              Your total hasn&apos;t moved in months.
            </span>
          </h1>
        </motion.div>

        {/* ── Subheading ── */}
        <motion.p
          className="mt-5 text-lg text-muted-foreground sm:text-xl max-w-xl mx-auto leading-relaxed"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.26, ease: EASE }}
        >
          AthleteOS reads training, nutrition, and recovery together to identify what is <span className="text-foreground font-medium">limiting progress</span> and what to <span className="text-foreground font-medium">change next</span>.
        </motion.p>

        {/* ── ICP filter ── */}
        <motion.p
          className="mt-3 text-sm text-muted-foreground/60"
          initial={reduced ? false : { opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.34, ease: EASE }}
        >
          Built for serious strength athletes, not casual gym-goers.
        </motion.p>

        {/* ── CTA ── */}
        <motion.div
          className="mt-8"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
        >
          <button
            type="button"
            onClick={handleCTA}
            className="group relative inline-flex cursor-pointer items-center gap-2 rounded-[10px] px-8 py-4 text-base font-bold text-white uppercase tracking-[0.02em] transition-all duration-200 hover:bg-[#fafafa] hover:text-[#09090b] overflow-hidden"
            style={{ background: 'linear-gradient(104deg, rgba(253,253,253,0.05) 5%, rgba(240,240,228,0.1) 100%)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}
          >
            {/* Hover shimmer */}
            <span
              className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
              style={{
                background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
              }}
            />
            <span className="relative z-10">Start Your First Read</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="relative z-10 transition-transform duration-200 group-hover:translate-x-0.5">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </motion.div>
      </div>

      {/* ── Scroll cue ── */}
      {!reduced && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <motion.div
            className="w-px h-8"
            style={{ background: 'linear-gradient(to bottom, rgba(161,161,170,0.08), transparent)' }}
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      )}
    </section>
  )
}
