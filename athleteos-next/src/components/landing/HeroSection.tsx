'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { DiagnosticCard } from './DiagnosticCard'
import { PillarStrip } from './PillarStrip'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
})

export function HeroSection() {
  return (
    <section className="editorial-stage relative overflow-hidden px-4 py-24 sm:px-6 sm:py-28 md:px-10 md:py-32">

      {/* Spotlight orbs */}
      <div
        className="pointer-events-none absolute -left-[10%] bottom-[8%] w-[520px] h-[520px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(127,178,255,0.16), transparent 65%)', filter: 'blur(32px)' }}
      />
      <div
        className="pointer-events-none absolute -right-[10%] top-[5%] w-[400px] h-[400px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(184,212,255,0.10), transparent 68%)', filter: 'blur(32px)' }}
      />

      {/* Faint grid inside hero */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '88px 88px',
          maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.9), transparent 80%)',
        }}
      />

      <div className="relative container mx-auto grid max-w-screen-xl items-center gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">

        {/* Left */}
        <div>
          {/* Kicker — plain mono text, no pill */}
          <motion.div {...fadeUp(0)} className="flex items-center gap-2 mb-7">
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-accent animate-pulse-glow"
            />
            <span className="font-mono-label text-muted-foreground/90">Performance diagnostic system</span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.1)}
            className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground leading-[1.0] tracking-tight mb-8"
          >
            You&apos;re not stuck.{' '}
            <span className="gradient-text">You&apos;re just missing the signal.</span>
          </motion.h1>

          {/* CTA row */}
          <motion.div {...fadeUp(0.2)} className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <a
              href="#rank"
              className="cta-glow inline-flex items-center gap-2 bg-accent text-white font-bold px-7 py-3.5 rounded group transition hover:bg-accent-light accent-glow"
            >
              Find My Rank
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <span className="max-w-[24rem] text-sm leading-relaxed text-muted-foreground">
              Founding Cohort · Max 500 · Price locked forever
            </span>
          </motion.div>

          {/* Inline stats — no pills, just text */}
          <motion.div {...fadeUp(0.28)} className="mb-6 flex flex-wrap items-center gap-y-2">
            {[
              { val: 'IPF-CALIBRATED', sep: true },
              { val: '3,200+ INDIA', sep: true },
              { val: 'FREE', sep: false },
            ].map(({ val, sep }) => (
              <span key={val} className="flex items-center">
                <span className="text-sm font-medium text-muted-foreground">{val.replace('+', '+ ').replace('-', ' ')}</span>
                {sep && <span className="mx-3 hidden text-sm text-muted-foreground/35 sm:inline">·</span>}
              </span>
            ))}
          </motion.div>

          {/* System status — plain mono text, thin top divider */}
          <motion.div
            {...fadeUp(0.33)}
            className="pt-4 text-sm text-muted-foreground/75"
            style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="flex flex-wrap gap-x-4 gap-y-1.5">
              <span>SYSTEM_STATUS: ACTIVE</span>
              <span>ATHLETES_INDEXED: 3,200+</span>
              <span>COHORT_SLOTS: 142/500</span>
            </div>
          </motion.div>

          {/* Numbered steps */}
          <motion.div {...fadeUp(0.4)} className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { num: '01', label: 'Get your rank',      active: true  },
              { num: '02', label: 'Find the gap',       active: false },
              { num: '03', label: 'Fix the bottleneck', active: false },
            ].map(({ num, label, active }, i) => (
              <div
                key={num}
                className="rounded-2xl border px-4 py-3"
                style={{
                  borderColor: active ? 'rgba(127,178,255,0.18)' : 'rgba(255,255,255,0.08)',
                  background: active ? 'rgba(127,178,255,0.06)' : 'rgba(255,255,255,0.02)',
                }}
              >
                <div className="mb-1 flex items-center justify-between gap-3">
                  <span className={`font-mono text-xs font-bold ${active ? 'text-accent' : 'text-muted-foreground/60'}`}>
                    {num}
                  </span>
                  {i < 2 && <span className="hidden font-mono text-[10px] text-muted-foreground/50 sm:inline">NEXT</span>}
                </div>
                <span className={`block text-base ${active ? 'text-foreground' : 'text-muted-foreground/80'}`}>
                  {label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: card floats directly — no stage-frame wrapper */}
        <motion.div
          className="flex flex-col items-center lg:items-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <DiagnosticCard />
          <p className="mt-3 text-xs text-muted-foreground/50 text-center lg:text-right">
            Sample output · your data will differ
          </p>
        </motion.div>

      </div>

      {/* PillarStrip anchored to bottom of Hero */}
      <div className="relative mt-20">
        <PillarStrip />
      </div>
    </section>
  )
}
