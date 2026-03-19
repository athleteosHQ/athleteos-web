'use client'

import { motion } from 'framer-motion'

const FOOD_DATA = [
  { food: 'Masoor dal (cooked)', mfp: '7.1g',  ifct: '9.0g',  diff: '−21%' },
  { food: 'Paneer (100g)',       mfp: '14.2g', ifct: '18.3g', diff: '−22%' },
  { food: 'Chicken curry',       mfp: '12.8g', ifct: '16.4g', diff: '−28%' },
  { food: 'Whole wheat roti',    mfp: '2.9g',  ifct: '4.0g',  diff: '−27%' },
]

const IMPACT_CONTEXT = [
  { label: 'IFCT 2017', note: 'National Institute of Nutrition, Hyderabad', color: '#2DDC8F' },
  { label: 'vs MyFitnessPal', note: 'crowd-sourced food entries', color: '#F59E0B' },
  { label: 'Per 100g', note: 'cooked or prepared weight', color: '#7FB2FF' },
]

const IMPACT_STATS = [
  { kicker: 'Protein missed in 12 months', value: '5.4 kg', note: 'Likely miscounted because the food data is wrong.' },
  { kicker: 'Potential lean mass left behind', value: '2.1 kg', note: 'The performance cost of tracking with bad numbers.' },
]

export function ProblemSection() {
  return (
    <section id="problem" className="px-6 py-20 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] items-start mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="card-surface p-6 md:p-8"
          >
            <p className="font-mono-label text-accent mb-3">Step 2 · Data gap</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              MFP under-reports Indian food protein by 20–30%.
            </h2>
            <div className="flex max-w-3xl flex-wrap gap-2.5">
              {IMPACT_CONTEXT.map(({ label, note, color }) => (
                <div
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: color }} />
                  <span className="text-sm leading-relaxed text-muted-foreground">
                    <span className="font-semibold text-foreground">{label}</span> {note}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 max-w-3xl">
              {IMPACT_STATS.map(({ kicker, value, note }) => (
                <div
                  key={kicker}
                  className="rounded-2xl p-5"
                  style={{
                    background: 'linear-gradient(180deg, rgba(21,31,43,0.98), rgba(17,26,37,0.96))',
                    border: '1px solid rgba(255,255,255,0.09)',
                  }}
                >
                  <p className="font-mono-label text-destructive mb-2">{kicker}</p>
                  <p className="font-display text-3xl font-bold text-foreground">{value}</p>
                  <p className="mt-2 text-base leading-relaxed text-muted-foreground">{note}</p>
                </div>
              ))}
            </div>
            <div
              className="mt-4 inline-flex items-center gap-2 rounded-full px-3.5 py-2"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              <span className="text-sm text-muted-foreground">Source: NIN · IFCT 2017 · verified against peer literature</span>
            </div>
          </motion.div>

          <motion.div
            className="card-surface-secondary p-6 md:p-8 h-full"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono-label text-muted-foreground mb-2">Protein tracking drift</p>
                <p className="font-display text-5xl font-bold text-foreground">27%</p>
              </div>
              <div
                className="rounded-xl px-3 py-2"
                style={{ background: 'rgba(226,75,74,0.10)', border: '1px solid rgba(226,75,74,0.22)' }}
              >
                <span className="font-mono-label text-destructive">Plateau risk ↑</span>
              </div>
            </div>
            <div className="mt-8 flex items-end gap-2 h-48">
              {[32, 40, 36, 45, 49, 49, 49].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-md relative"
                  style={{
                    height: `${h * 3.4}px`,
                    background: i < 4 ? 'rgba(255,255,255,0.09)' : i === 4 ? 'rgba(127,178,255,0.42)' : 'rgba(226,75,74,0.26)',
                    borderTop: i >= 5 ? '1px dashed rgba(226,75,74,0.55)' : 'none',
                  }}
                >
                  {i === 4 && (
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 rounded-md px-2 py-1 text-[10px] font-bold text-white whitespace-nowrap"
                      style={{ background: '#E24B4A' }}>
                      Plateau point
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-8 pt-5 border-t border-white/8">
              <p className="text-base text-muted-foreground leading-relaxed">
                <span className="font-semibold text-destructive">Critical:</span> you can think you&apos;re hitting 180g protein and still be closer to 145g. That gap compounds for months before it shows up in your lifts.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Data table */}
        <motion.div
          className="card-surface overflow-hidden"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="hidden md:block">
            <div className="grid grid-cols-4 border-b border-border px-4 py-2.5 bg-secondary/40">
              {['Food', 'MFP (protein)', 'IFCT (actual)', 'Gap'].map(h => (
                <p key={h} className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">{h}</p>
              ))}
            </div>
            {FOOD_DATA.map((row, i) => (
              <div
                key={row.food}
                className={`grid grid-cols-4 px-4 py-3 ${i < FOOD_DATA.length - 1 ? 'border-b border-border' : ''}`}
              >
                <p className="text-base text-foreground">{row.food}</p>
                <p className="font-mono text-base text-muted-foreground">{row.mfp}</p>
                <p className="font-mono text-base text-foreground font-semibold">{row.ifct}</p>
                <p className="font-mono text-base font-bold text-destructive">{row.diff}</p>
              </div>
            ))}
          </div>
          <div className="md:hidden divide-y divide-white/6">
            {FOOD_DATA.map(row => (
              <div key={row.food} className="p-4 space-y-3">
                <div className="text-sm font-semibold text-foreground">{row.food}</div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl bg-white/[0.03] p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-1">MFP</p>
                    <p className="font-mono text-sm text-foreground">{row.mfp}</p>
                  </div>
                  <div className="rounded-xl bg-white/[0.03] p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-1">IFCT</p>
                    <p className="font-mono text-sm font-semibold text-foreground">{row.ifct}</p>
                  </div>
                  <div className="rounded-xl bg-white/[0.03] p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-1">Gap</p>
                    <p className="font-mono text-sm font-bold text-destructive">{row.diff}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Formula line */}
        <motion.div
          className="mt-6 px-4 py-3 text-sm font-medium text-muted-foreground text-center"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 4,
          }}
        >
          TRAINING <span className="text-foreground/40">+</span> NUTRITION <span className="text-foreground/40">+</span> RECOVERY <span className="text-foreground/40">→</span> <span className="text-accent">1_DIAGNOSIS</span>
        </motion.div>
      </div>
    </section>
  )
}
