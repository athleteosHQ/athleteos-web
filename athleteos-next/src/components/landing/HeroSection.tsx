'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { ProductShowcase } from './ProductShowcase'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
})

export function HeroSection() {
  return (
    <section className="editorial-stage relative overflow-hidden px-4 py-16 sm:px-6 sm:py-28 md:px-10 md:py-32">

      {/* Background Atmosphere Image — The Hybrid Athlete */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.10] grayscale contrast-[1.15] scale-105"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80")',
            maskImage: 'radial-gradient(ellipse 100% 70% at 30% 30%, black 10%, transparent 90%)',
            WebkitMaskImage: 'radial-gradient(ellipse 100% 70% at 30% 30%, black 10%, transparent 90%)'
          }}
        />
        {/* Melding Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/20 via-transparent to-transparent" />
      </div>

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

      <div className="relative container mx-auto grid max-w-screen-xl items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">

        {/* Left */}
        <div>
          <motion.div {...fadeUp(0)} className="mb-5 flex items-center gap-2 md:mb-7">
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-accent animate-pulse-glow"
            />
            <span className="font-mono-label text-muted-foreground/90">Strength athlete diagnostic system · launching soon on iOS &amp; Android</span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.1)}
            className="mb-6 text-4xl font-display font-bold leading-[1.0] tracking-tight text-foreground md:mb-8 md:text-6xl lg:text-7xl"
          >
            Your training is stalling.{' '}
            <span className="gradient-text">We&apos;ll tell you exactly why.</span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.15)}
            className="body-copy-strong mb-6 max-w-2xl md:mb-8"
          >
            Check where you rank against 3,200+ competitive Indian strength athletes. Then find out whether training load, nutrition, or recovery is the bottleneck — and track whether the fix is working.
          </motion.p>

          {/* CTA row */}
          <motion.div {...fadeUp(0.2)} className="mb-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center md:mb-8 md:gap-4">
            <a
              href="#rank"
              className="cta-glow inline-flex items-center gap-2 bg-accent text-white font-bold px-7 py-3.5 rounded group transition hover:bg-accent-light accent-glow"
            >
              Diagnose My Plateau — Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <span className="max-w-[24rem] text-sm leading-relaxed text-muted-foreground">
              Free rank check · No account needed · Founding members get first app access
            </span>
          </motion.div>

          <motion.div {...fadeUp(0.28)} className="mb-5 flex flex-wrap items-center gap-y-2 md:mb-6">
            {[
              { val: 'IPF-calibrated benchmark', sep: true },
              { val: '3,200+ athlete records', sep: true },
              { val: 'Weight-class percentile', sep: false },
            ].map(({ val, sep }) => (
              <span key={val} className="flex items-center">
                <span className="text-sm font-medium text-muted-foreground">{val}</span>
                {sep && <span className="mx-3 hidden text-sm text-muted-foreground/35 sm:inline">·</span>}
              </span>
            ))}
          </motion.div>

          <motion.div
            {...fadeUp(0.33)}
            className="mt-2 hidden flex-wrap items-center gap-x-6 gap-y-2 pt-4 md:flex"
            style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
          >
            {[
              { step: '01', label: 'Check your rank' },
              { step: '02', label: 'Log food + training' },
              { step: '03', label: 'Get the diagnosis' },
            ].map(({ step, label }, i) => (
              <div key={step} className="flex items-center gap-2">
                {i > 0 && <span className="text-muted-foreground/30 font-mono text-xs">→</span>}
                <span className="font-mono text-xs font-bold text-accent">{step}</span>
                <span className="text-sm text-muted-foreground">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: product artifact inside device frame */}
        <div className="hidden flex-col items-center lg:flex lg:items-end">
          <ProductShowcase />
          <p className="mt-5 hidden text-center text-xs text-muted-foreground/50 md:block lg:mt-8 lg:text-right">
            Sample app view · founding members get early access on iOS and Android
          </p>
        </div>

      </div>
    </section>
  )
}
