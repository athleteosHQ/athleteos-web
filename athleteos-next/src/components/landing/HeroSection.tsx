'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { trackEvent } from '@/lib/analytics'
import { useMotionSafe } from '@/lib/motion'
import { LiveSignalFeed } from './LiveSignalFeed'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true })
  const { reduced } = useMotionSafe()

  const handleCTA = () => {
    trackEvent('cta_clicked', { cta_source: 'hero', cta_text: 'Get Your Performance Read', has_rank_result: false })
    document.getElementById('rank')?.scrollIntoView({ behavior: 'smooth' })
    window.setTimeout(() => {
      document.getElementById('rank-bw-input')?.focus()
    }, 500)
  }

  return (
    <section
      id="hero"
      ref={ref}
      className="relative flex min-h-[85vh] flex-col items-center justify-center px-6 py-20 text-center overflow-hidden"
    >
      <LiveSignalFeed />

      {/* ── Hero Spotlight (Smoothly Blended) ── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[180%] h-[135%] opacity-20 blur-[140px]"
          style={{
            background: `
              radial-gradient(ellipse at 50% 0%, 
                rgba(255,255,255,0.055) 0%, 
                rgba(148,163,184,0.04) 18%, 
                rgba(45,220,143,0.03) 38%, 
                rgba(99,102,241,0.02) 56%, 
                transparent 78%
              )
            `,
          }}
        />
      </div>

      <div className="relative z-10 max-w-3xl">
        {/* ── Single headline — lead with pain ── */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <h1 className="text-4xl font-display font-[800] text-foreground leading-[1.0] sm:text-5xl md:text-6xl uppercase tracking-[-0.03em]">
            <span className="hero-gradient-word relative inline-block">
              Your total hasn&apos;t moved in months.
            </span>
          </h1>
        </motion.div>

        {/* ── Subheading — position against current tools ── */}
        <motion.p
          className="mt-5 text-lg text-muted-foreground sm:text-xl max-w-xl mx-auto leading-relaxed"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.12, ease: EASE }}
        >
          Your app tracks the numbers. It doesn&apos;t diagnose the stall. AthleteOS finds the <span className="text-foreground font-medium">one thing limiting progress</span> across training, nutrition, and recovery.
        </motion.p>

        {/* ── ICP filter — full opacity ── */}
        <motion.p
          className="mt-3 text-sm text-muted-foreground font-medium"
          initial={reduced ? false : { opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
        >
          For competitive strength athletes. Not casual gym-goers.
        </motion.p>

        {/* ── CTA ── */}
        <motion.div
          className="mt-8"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.28, ease: EASE }}
        >
          <button
            type="button"
            onClick={handleCTA}
            className="group relative inline-flex cursor-pointer items-center gap-2 rounded-[10px] px-8 py-4 text-base font-bold text-white uppercase tracking-[0.02em] transition-all duration-200 hover:bg-[#fafafa] hover:text-[#09090b] overflow-hidden min-h-[44px]"
            style={{ background: 'linear-gradient(104deg, rgba(253,253,253,0.05) 5%, rgba(240,240,228,0.1) 100%)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" style={{ background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)' }} />
            <span className="relative z-10">Get Your Performance Read</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="relative z-10 transition-transform duration-200 group-hover:translate-x-0.5">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </motion.div>

        {/* ── Data foundation strip ── */}
        <motion.div
          className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
          initial={reduced ? false : { opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4, ease: EASE }}
        >
          {[
            { num: '3,200+', label: 'meet records' },
            { num: '12', label: 'weight classes' },
            { num: 'IFCT', label: 'verified nutrition' },
            { num: 'IPF', label: 'federation standard' },
          ].map(({ num, label }, i) => (
            <div key={label} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-muted-foreground/20 hidden sm:inline">·</span>}
              <span className="text-xs font-mono font-bold text-foreground/70">{num}</span>
              <span className="text-[10px] text-muted-foreground/40">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* ── Mini score card preview ── */}
        <motion.div
          className="mt-8 mx-auto max-w-xs"
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
        >
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-none" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
            <p className="text-[10px] font-mono uppercase tracking-[0.1em] text-muted-foreground/50 mb-4">Sample performance read</p>
            <div className="flex items-end justify-between gap-4 mb-4">
              <div>
                <p className="text-[11px] text-muted-foreground/60 uppercase tracking-[0.08em] mb-1">Baseline</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-display font-[800] text-foreground tabular-nums">78</span>
                  <span className="text-xs text-muted-foreground">/ 100</span>
                </div>
              </div>
              <div className="rounded-full border border-success/20 bg-success/10 px-2.5 py-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.08em] text-success">Top 22%</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="rounded-xl border border-white/[0.05] bg-white/[0.025] px-3 py-3">
                <p className="text-[10px] font-mono uppercase tracking-[0.08em] text-muted-foreground/60 mb-1">Limiter</p>
                <p className="text-[13px] text-foreground/85">Recovery debt is suppressing bench progress relative to squat and deadlift.</p>
              </div>
              <div className="rounded-xl border border-white/[0.05] bg-white/[0.025] px-3 py-3">
                <p className="text-[10px] font-mono uppercase tracking-[0.08em] text-muted-foreground/60 mb-1">Correction Preview</p>
                <p className="text-[13px] text-foreground/85">Increase heavy-day intake and reduce fatigue overlap before the next block.</p>
              </div>
              <p className="text-[11px] text-muted-foreground/50 text-center pt-1">One score. One limiter. One next move.</p>
            </div>
          </div>
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
