'use client'

import { motion } from 'framer-motion'
import { fadeUp, blurUp, clipReveal } from '@/lib/motion'
import { trackEvent } from '@/lib/analytics'

const INSIGHT_PATTERNS = [
  {
    key: 'nutrition-timing',
    diagnostic: 'Your protein is on target but timed wrong relative to your training phase — surplus during deload, maintenance during accumulation.',
    explanation: 'Nutrient timing relative to periodization phase.',
    color: 'rgba(255,255,255,0.5)',
    // Visualization: A small bar chart showing surplus vs deficit
    viz: (
      <div className="flex items-end gap-1 h-12 mt-4 opacity-50">
        {[20, 45, 15, 30].map((h, i) => (
          <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}px`, background: i === 1 ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)' }} />
        ))}
      </div>
    )
  },
  {
    key: 'volume-ratio',
    diagnostic: 'Your squat volume went up 18% this block but your deadlift ratio dropped. Programming drift or fatigue?',
    explanation: 'Cross-lift ratio analysis within a training block.',
    color: 'rgba(255,255,255,0.5)',
    // Visualization: Two diverging line segments
    viz: (
      <div className="relative h-12 mt-4 opacity-50 flex items-center justify-center">
        <svg width="100%" height="100%" viewBox="0 0 100 40">
          <path d="M10 30 L90 10" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" />
          <path d="M10 20 L90 35" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="4 2" fill="none" />
        </svg>
      </div>
    )
  },
  {
    key: 'sleep-gap',
    diagnostic: 'You sleep 7.5 hours but only 6.1 on training days. That gap is where recovery debt compounds.',
    explanation: 'Training-day-specific recovery patterns.',
    color: '#2DDC8F',
    // Visualization: A gap indicator
    viz: (
      <div className="flex items-center gap-2 h-12 mt-4 opacity-50">
        <div className="h-2 flex-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-success w-[70%]" />
        </div>
        <span className="text-[10px] font-mono text-success">-1.4h</span>
      </div>
    )
  },
] as const

export function InsightPatternsSection() {
  return (
    <section id="insight-patterns" className="px-6 py-32 md:px-10 min-h-[80vh] flex items-center justify-center">
      <div className="mx-auto max-w-screen-xl">
        <div className="mb-10">
          <p className="font-mono-label text-[#a1a1aa] mb-3">What the system actually reads</p>
          <motion.h2
            {...clipReveal()}
            className="text-3xl md:text-4xl font-display font-semibold tracking-[-0.02em] leading-[1.2] text-foreground"
          >
            <span style={{ background: 'linear-gradient(180deg, #ededed 0%, #a1a1a1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Your apps track numbers. This connects them.
            </span>
          </motion.h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {INSIGHT_PATTERNS.map(({ key, diagnostic, explanation, color, viz }, i) => (
            <motion.div
              key={key}
              {...blurUp(0.08 + i * 0.1)}
              className="surface-card p-6 flex flex-col justify-between"
            >
              <div>
                <span
                  className="mb-4 inline-block h-1.5 w-8 rounded-full"
                  style={{ background: color }}
                />
                <p className="text-base font-semibold text-foreground leading-relaxed mb-3">
                  {diagnostic}
                </p>
                <p className="text-sm text-muted-foreground">
                  {explanation}
                </p>
              </div>
              {viz}
            </motion.div>
          ))}
        </div>

        <motion.div
          {...fadeUp(0.35)}
          className="mt-8 text-center"
        >
          <a
            href="#sample-outcome"
            className="inline-flex items-center gap-2 font-mono-label text-[#fafafa] hover:text-white transition"
            onClick={() => trackEvent('cta_clicked', { cta_source: 'insight_patterns', cta_text: 'See it in action', has_rank_result: false })}
          >
            See it in action
            <span className="animate-bounce">↓</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
