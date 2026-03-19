'use client'

import { motion } from 'framer-motion'

const OUTCOME_ROWS = [
  {
    key: 'RANK_OUTPUT',
    label: 'Where you stand',
    value: 'Top 23% nationally',
    sub: 'Squat · Top 31%   Bench · Top 22%   Deadlift · Top 14%',
    color: 'var(--data-cyan, #00D9FF)',
    bg: 'rgba(0,217,255,0.05)',
    border: 'rgba(0,217,255,0.18)',
  },
  {
    key: 'BOTTLENECK_ID',
    label: 'Primary limiter',
    value: 'Sleep-limited recovery',
    sub: '91% confidence · avg 6.1h on training days vs 8h optimal',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.05)',
    border: 'rgba(245,158,11,0.18)',
  },
  {
    key: 'CORRECTION',
    label: 'What to fix',
    value: '+45 min sleep on training days',
    sub: 'Reduce AMRAP volume by 20% until recovery marker improves',
    color: 'rgba(255,255,255,0.7)',
    bg: 'rgba(255,255,255,0.02)',
    border: 'rgba(255,255,255,0.09)',
  },
  {
    key: 'PROJECTED_GAIN',
    label: 'Expected outcome',
    value: '+8.2 kg squat 1RM',
    sub: '6-week projection · based on current training frequency',
    color: '#2DDC8F',
    bg: 'rgba(45,220,143,0.05)',
    border: 'rgba(45,220,143,0.18)',
  },
]

export function SampleOutcomeBlock() {
  return (
    <section className="px-4 py-20 sm:px-6 md:px-10">
      <div className="mx-auto max-w-screen-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <p className="font-mono-label text-accent mb-3">Sample athlete outcome</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
            From rank to correction plan.
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl">
            One athlete. One bottleneck. One correction path. This section should make the product feel concrete in seconds.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]"
        >
          <div className="card-surface p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-mono-label text-muted-foreground mb-2">Athlete profile</p>
                <h3 className="text-2xl font-display font-bold text-foreground">85kg lifter · 3 years training</h3>
                <p className="mt-2 text-sm text-muted-foreground">Intermediate-advanced strength athlete stuck outside elite tier.</p>
              </div>
              <div className="status-pill">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-glow" />
                <span className="font-mono-label text-muted-foreground">Live simulation</span>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl p-5" style={{ background: 'rgba(0,217,255,0.05)', border: '1px solid rgba(0,217,255,0.18)' }}>
                <p className="font-mono-label text-accent-light/70 mb-2">Current rank</p>
                <p className="font-mono text-4xl font-bold text-foreground">TOP 23%</p>
                <p className="mt-2 text-sm text-muted-foreground">Squat top 31% · Bench top 22% · Deadlift top 14%</p>
              </div>
              <div className="rounded-2xl p-5" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)' }}>
                <p className="font-mono-label text-warning mb-2">Primary limiter</p>
                <p className="text-xl font-bold text-foreground">Sleep-limited recovery</p>
                <p className="mt-2 text-sm text-muted-foreground">91% confidence · avg 6.1h on training days vs 8h optimal</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="font-mono-label text-muted-foreground mb-2">What athleteOS would tell you</p>
              <p className="text-base font-semibold text-foreground leading-relaxed">
                Add 45 minutes of sleep on training days and reduce AMRAP volume by 20% until recovery markers stabilise.
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Projected upside: +8.2kg squat 1RM in 6 weeks if recovery debt closes.
              </p>
            </div>
          </div>

          <div className="card-surface-secondary p-6 sm:p-8">
            <p className="font-mono-label text-accent mb-4">Outcome chain</p>
            <div className="space-y-3">
              {OUTCOME_ROWS.map(({ key, label, value, sub, color, bg, border }, i) => (
                <motion.div
                  key={key}
                  className="rounded-2xl p-4"
                  style={{ background: bg, border: `1px solid ${border}` }}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: 0.08 + i * 0.06 }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-[10px] font-bold" style={{ color, opacity: 0.9 }}>{key}</p>
                      <p className="font-mono-label text-muted-foreground/70 mt-1">{label}</p>
                    </div>
                    <span className="h-2 w-2 rounded-full mt-1" style={{ background: color }} />
                  </div>
                  <p className="mt-3 text-base font-bold text-foreground">{value}</p>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{sub}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">Sample output only. Your exact rank and diagnosis will differ.</p>
              <a href="#rank" className="font-mono-label text-accent hover:text-accent-light transition">Get mine →</a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
