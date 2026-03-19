'use client'

import { motion } from 'framer-motion'

const STEPS = [
  {
    num: '01',
    label: 'Log food with IFCT accuracy',
    sub: 'Dal, paneer, sabzi — values you can trust.',
    accent: false,
  },
  {
    num: '02',
    label: 'Log PPL training sessions',
    sub: '60+ exercises. Auto-detects push/pull/legs day.',
    accent: false,
  },
  {
    num: '→',
    label: 'Get the bottleneck named',
    sub: 'One diagnosis. Plain English. No guessing.',
    accent: true,
  },
]

export function SystemSection() {
  return (
    <section id="system" className="px-4 py-20 sm:px-6 md:px-10">
      <div className="mx-auto max-w-screen-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 max-w-2xl"
        >
          <p className="font-mono-label text-accent mb-3">HOW_IT_WORKS</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            Three inputs. One answer.
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            athleteOS connects training stress, nutrition accuracy, and block timing into one plain-English diagnosis.
          </p>
        </motion.div>

        <div className="grid items-start gap-5 lg:grid-cols-[1.18fr_0.82fr] lg:gap-6">
          <motion.div
            className="card-surface p-5 sm:p-8"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono-label text-muted-foreground mb-2">Phase-aware targets</p>
                <p className="text-sm text-muted-foreground max-w-lg">
                  Targets shift with your training block, not as static numbers that stay the same all year.
                </p>
              </div>
              <div className="rounded-xl border px-3 py-2" style={{ borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
                <p className="font-mono-label text-muted-foreground">current state</p>
                <p className="mt-1 text-sm font-semibold text-foreground">Intensification block active</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="rounded-2xl border p-4 sm:p-5"
                style={{ borderColor: 'rgba(255,255,255,0.12)', background: 'linear-gradient(90deg, rgba(45,220,143,0.10), rgba(255,255,255,0.01))' }}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-mono-label text-success">Accumulation</p>
                    <p className="mt-1 text-sm font-semibold text-foreground">Weeks 1–4</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-mono text-xl font-bold text-foreground">+250 cal</p>
                    <p className="text-xs text-muted-foreground">surplus · 180g protein</p>
                  </div>
                </div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/8">
                  <div className="h-full rounded-full bg-success/80" style={{ width: '84%' }} />
                </div>
              </div>
              <div className="rounded-2xl border p-4 sm:p-5"
                style={{ borderColor: 'rgba(255,255,255,0.12)', background: 'linear-gradient(90deg, rgba(245,158,11,0.10), rgba(255,255,255,0.01))' }}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-mono-label text-warning">Intensification</p>
                      <span className="status-pill" style={{ padding: '0.25rem 0.5rem', background: 'rgba(245,158,11,0.12)', borderColor: 'rgba(245,158,11,0.18)' }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse-glow" />
                        <span className="font-mono-label text-warning">Active</span>
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-foreground">Weeks 5–8 · current</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-mono text-xl font-bold text-foreground">Maintenance</p>
                    <p className="text-xs text-muted-foreground">160g protein target</p>
                  </div>
                </div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/8">
                  <div className="signal-bar h-full rounded-full bg-warning/80" style={{ width: '56%' }} />
                </div>
              </div>
              <div className="rounded-2xl border p-4 opacity-55 sm:p-5"
                style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.015)' }}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-mono-label text-muted-foreground">Deload</p>
                    <p className="mt-1 text-sm font-semibold text-muted-foreground">Weeks 9–10</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-mono text-base font-bold text-muted-foreground">−150 cal</p>
                    <p className="text-xs text-muted-foreground">slight deficit</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex flex-col gap-3">
            {STEPS.map(({ num, label, sub, accent }, i) => (
              <motion.div
                key={num}
                className={`flex items-start gap-4 rounded-2xl border p-5 transition ${
                  accent ? 'card-surface' : 'card-surface-secondary'
                }`}
                style={accent ? { borderColor: 'rgba(255,122,47,0.24)', background: 'rgba(255,122,47,0.05)' } : undefined}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <span
                  className={`mt-0.5 flex-shrink-0 font-mono text-xl font-bold ${
                    accent ? 'text-accent' : 'text-muted-foreground'
                  }`}
                >
                  {num}
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          className="mt-6 card-surface p-6 sm:p-8"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.15 }}
        >
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="font-mono-label text-accent mb-2">Strength percentile card</p>
              <h3 className="text-2xl font-display font-bold text-foreground">Where you rank. Shareable.</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-xl">
                Your exact percentile against Indian athletes in your weight class. The score is internal. The ranking is what people care about.
              </p>
            </div>
            <div
              className="rounded-2xl p-5 lg:min-w-[250px]"
              style={{ background: 'rgba(11,17,24,0.78)', border: '1px solid rgba(255,122,47,0.20)', boxShadow: '0 0 40px rgba(255,122,47,0.08)' }}
            >
              <p className="font-mono-label text-accent-light/70 mb-3">athleteOS · percentile</p>
              <div className="font-mono text-4xl font-bold text-foreground">TOP 18%</div>
              <p className="mt-1 text-xs text-muted-foreground">Elite tier · India</p>
              <div className="mt-4 space-y-2.5">
                {[
                  ['Squat', '130 kg', 'Top 22%'],
                  ['Bench', '95 kg', 'Top 31%'],
                  ['Deadlift', '165 kg', 'Top 14%'],
                ].map(([label, value, rank]) => (
                  <div key={label} className="flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground">{label}</span>
                    <span className="font-mono text-sm font-bold text-foreground">{value}</span>
                    <span className="rounded-md px-2 py-0.5 text-xs font-bold text-accent" style={{ background: 'rgba(255,122,47,0.12)' }}>{rank}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
