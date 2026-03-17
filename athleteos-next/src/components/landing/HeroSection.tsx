'use client'

import { motion } from 'framer-motion'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { DiagnosticCard } from './DiagnosticCard'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
})

export function HeroSection() {
  return (
    <section className="relative py-24 px-4 sm:py-32 sm:px-6 overflow-hidden">

      {/* Spotlight orbs */}
      <div
        className="pointer-events-none absolute -left-[10%] bottom-[8%] w-[520px] h-[520px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(255,122,47,0.18), transparent 65%)', filter: 'blur(32px)' }}
      />
      <div
        className="pointer-events-none absolute -right-[10%] top-[5%] w-[400px] h-[400px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(255,154,92,0.12), transparent 68%)', filter: 'blur(32px)' }}
      />

      {/* Faint grid inside hero */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
          backgroundSize: '88px 88px',
          maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.95), transparent 88%)',
        }}
      />

      <div className="relative container mx-auto max-w-6xl grid lg:grid-cols-2 gap-16 items-center">

        {/* Left */}
        <div>
          <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2.5 mb-8 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
            <span className="font-mono-label text-muted-foreground">Performance Diagnostic System</span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.1)}
            className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground leading-[1.0] tracking-tight mb-6"
          >
            You&apos;re not stuck.{' '}
            <span className="gradient-text">You&apos;re just missing the signal.</span>
          </motion.h1>

          <motion.p {...fadeUp(0.2)} className="text-lg text-muted-foreground leading-relaxed max-w-md mb-10">
            Most athletes can&apos;t see the friction between their fuel, fatigue, and force.
            athleteOS finds the gap.
          </motion.p>

          <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <a
              href="#rank"
              className="cta-glow inline-flex items-center gap-2 bg-accent text-white font-bold px-8 py-4 rounded-xl group transition hover:bg-accent-light accent-glow"
            >
              Get Your Athlete Score
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#system"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-4 text-sm font-semibold text-muted-foreground backdrop-blur-sm transition hover:border-white/20 hover:text-foreground"
            >
              See How It Works
              <ChevronRight className="w-4 h-4" />
            </a>
          </motion.div>

          <motion.div {...fadeUp(0.4)} className="mt-10 flex items-center gap-6">
            {[
              { num: '01', label: 'Get your rank',      active: true  },
              { num: '02', label: 'Find the gap',       active: false },
              { num: '03', label: 'Fix the bottleneck', active: false },
            ].map(({ num, label, active }) => (
              <div key={num} className="flex items-center gap-2">
                <span
                  className="text-xs font-mono font-bold w-6 h-6 rounded-full flex items-center justify-center border"
                  style={active
                    ? { color: 'var(--accent)', borderColor: 'rgba(255,122,47,0.4)', background: 'rgba(255,122,47,0.1)' }
                    : { color: 'var(--muted-foreground)', borderColor: 'var(--border)', background: 'transparent' }
                  }
                >
                  {num}
                </span>
                <span className={`text-xs font-medium ${active ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {label}
                </span>
              </div>
            ))}
          </motion.div>

          <motion.div {...fadeUp(0.5)} className="mt-8 flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <span className="font-mono tabular-nums text-foreground font-semibold">₹199</span>
              <span>trial ·</span>
              <span className="font-mono tabular-nums text-accent font-semibold">₹4,999/yr</span>
              <span className="font-mono-label text-accent border border-accent/25 bg-accent/8 px-2 py-0.5 rounded">founding</span>
            </div>
          </motion.div>
        </div>

        {/* Right: Diagnostic Card */}
        <div className="flex flex-col items-center lg:items-end gap-3">
          <p className="font-mono-label text-muted-foreground self-start lg:self-auto">
            Sample output · your data will differ
          </p>
          <DiagnosticCard />
        </div>

      </div>
    </section>
  )
}
