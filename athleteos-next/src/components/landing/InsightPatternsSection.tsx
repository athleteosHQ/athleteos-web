'use client'

import { motion } from 'framer-motion'
import { fadeUp } from '@/lib/motion'

const INSIGHT_PATTERNS = [
  {
    key: 'nutrition-timing',
    diagnostic: 'Your protein is on target but timed wrong relative to your training phase — surplus during deload, maintenance during accumulation.',
    explanation: 'Nutrient timing relative to periodization phase.',
    color: '#F59E0B',
  },
  {
    key: 'volume-ratio',
    diagnostic: 'Your squat volume went up 18% this block but your deadlift ratio dropped. Programming drift or fatigue?',
    explanation: 'Cross-lift ratio analysis within a training block.',
    color: 'var(--data-cyan, #00D9FF)',
  },
  {
    key: 'sleep-gap',
    diagnostic: 'You sleep 7.5 hours but only 6.1 on training days. That gap is where recovery debt compounds.',
    explanation: 'Training-day-specific recovery patterns.',
    color: '#2DDC8F',
  },
] as const

export function InsightPatternsSection() {
  return (
    <section className="px-6 py-20 md:px-10">
      <div className="mx-auto max-w-screen-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="font-mono-label text-accent mb-3">What the system actually reads</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            Your apps track numbers. This connects them.
          </h2>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          {INSIGHT_PATTERNS.map(({ key, diagnostic, explanation, color }, i) => (
            <motion.div
              key={key}
              {...fadeUp(0.1 + i * 0.08)}
              className="surface-card p-6"
            >
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
            </motion.div>
          ))}
        </div>

        <motion.div
          {...fadeUp(0.35)}
          className="mt-8 text-center"
        >
          <a
            href="#sample-outcome"
            className="font-mono-label text-accent hover:text-accent-light transition"
          >
            See it in action ↓
          </a>
        </motion.div>
      </div>
    </section>
  )
}
