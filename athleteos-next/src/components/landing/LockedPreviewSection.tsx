'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, staggerItem } from '@/lib/motion'

const LOCKED_CARDS = [
  {
    label: 'Lift ratio analysis',
    teaser: 'Bench:squat and deadlift:squat ratio breakdown against population norms in your weight class.',
  },
  {
    label: 'Nutrition × training gap',
    teaser: 'Whether your caloric intake matches your training phase — surplus when building, deficit when cutting.',
  },
  {
    label: 'Weekly performance narrative',
    teaser: 'AI-generated analysis of what worked, what broke, and what to change next week.',
  },
]

/** Standalone locked preview section — appears after calculator result, shows what the full diagnosis covers. */
export function LockedPreviewSection() {
  const [hasResult, setHasResult] = useState(false)

  useEffect(() => {
    const sync = () => {
      setHasResult(!!localStorage.getItem('aos_rank_result'))
    }
    sync()
    window.addEventListener('aos-rank-result-changed', sync)
    return () => window.removeEventListener('aos-rank-result-changed', sync)
  }, [])

  if (!hasResult) return null

  return (
    <section className="section-fade-top px-6 py-16 md:px-10 md:py-20">
      <div className="mx-auto max-w-6xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-8"
        >
          <motion.p variants={staggerItem} className="font-mono-label text-accent mb-2">What your full diagnosis covers</motion.p>
          <motion.h3 variants={staggerItem} className="text-2xl font-display font-bold md:text-3xl text-foreground">
            This is what you&apos;re missing.
          </motion.h3>
        </motion.div>

        <motion.div {...fadeUp(0.1)} className="grid gap-3 sm:grid-cols-3">
          {LOCKED_CARDS.map(({ label, teaser }) => (
            <div
              key={label}
              className="surface-card-muted locked-peek relative overflow-hidden rounded-xl px-5 py-6"
            >
              <p className="text-base font-semibold text-foreground select-none" style={{ filter: 'blur(4px)' }}>
                {label}
              </p>
              <p className="mt-2 text-sm text-muted-foreground select-none" style={{ filter: 'blur(3px)' }}>
                {teaser}
              </p>
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: 'linear-gradient(180deg, rgba(5,5,6,0) 0%, rgba(5,5,6,0.45) 45%, rgba(5,5,6,0.82) 100%)' }}
              />
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[9px] text-accent/40 uppercase tracking-widest">
                locked
              </span>
            </div>
          ))}
        </motion.div>

        <motion.p {...fadeUp(0.15)} className="mt-6 text-sm text-muted-foreground">
          The rank calculator shows where you stand. Founding members get the full system — training, nutrition, and recovery data connected into one diagnostic read.
        </motion.p>
      </div>
    </section>
  )
}
