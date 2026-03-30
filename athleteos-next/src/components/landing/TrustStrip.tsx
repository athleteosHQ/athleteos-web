'use client'

import { motion } from 'framer-motion'
import { useHeadingParallax, staggerContainer, staggerItem } from '@/lib/motion'

const SOURCES = [
  { id: 'IFCT_2017', label: 'IFCT 2017', note: 'Verified food composition data', color: '#2DDC8F' },
  { id: 'IPF_RECORDS', label: 'IPF records', note: 'Competition-calibrated percentiles', color: '#00D9FF' },
  { id: 'ATHLETE_DATABASE', label: '3,200+ athletes', note: 'Competitive lifters in your weight class, not general fitness users', color: '#5E6AD2' },
  { id: 'BROWSER_SAFE', label: 'Browser-side rank', note: 'No server call until signup', color: '#2DDC8F' },
]

export function TrustStrip() {
  const parallax = useHeadingParallax()

  return (
    <section className="px-4 py-14 sm:px-6 md:px-10">
      <motion.div
        className="mx-auto max-w-screen-xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          ref={parallax.ref}
          style={parallax.style}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-5 max-w-2xl"
        >
          <motion.p variants={staggerItem} className="font-mono-label text-accent mb-2">Trust architecture</motion.p>
          <motion.h2 variants={staggerItem} className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Built on real athlete baselines, not generic fitness app guesses.
          </motion.h2>
        </motion.div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SOURCES.map(({ id, label, note, color }) => (
            <div key={id} className="surface-card rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-3 rounded-full" style={{ background: color }} />
                <span className="font-mono-label" style={{ color }}>{label}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{note}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
