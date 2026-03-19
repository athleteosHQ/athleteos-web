'use client'

import { motion } from 'framer-motion'

const SOURCES = [
  { id: 'IFCT_2017', label: 'IFCT 2017', note: 'Indian food composition tables', color: '#2DDC8F' },
  { id: 'IPF_RECORDS', label: 'IPF records', note: 'Competition-calibrated percentiles', color: '#00D9FF' },
  { id: 'INDIA_DATABASE', label: '3,200+ athletes', note: 'Indian athlete benchmark base', color: '#7FB2FF' },
  { id: 'BROWSER_SAFE', label: 'Browser-side rank', note: 'No server call until signup', color: '#2DDC8F' },
]

export function TrustStrip() {
  return (
    <section className="px-4 py-14 sm:px-6 md:px-10">
      <motion.div
        className="mx-auto max-w-screen-xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-5 max-w-2xl">
          <p className="font-mono-label text-accent mb-2">Trust architecture</p>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Built on real athlete baselines, not generic fitness app guesses.
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SOURCES.map(({ id, label, note, color }) => (
            <div key={id} className="card-surface-secondary rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full" style={{ background: color }} />
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
