'use client'

import { motion } from 'framer-motion'
import { clipReveal, slideFromLeft, slideFromRight } from '@/lib/motion'
import { BarChart3, AlertTriangle, Wrench, TrendingUp } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

const OUTCOME_ROWS = [
  {
    key: 'RANK_OUTPUT',
    label: 'Where you stand',
    value: 'Top 23% of competitive strength athletes',
    sub: 'Squat · Top 31%   Bench · Top 22%   Deadlift · Top 14%',
    color: 'var(--data-cyan, #00D9FF)',
    bg: 'rgba(0,217,255,0.03)',
    border: 'rgba(0,217,255,0.10)',
    Icon: BarChart3,
  },
  {
    key: 'BOTTLENECK_ID',
    label: 'Primary limiter',
    value: 'Protein timing inverted across training phases',
    sub: '89% confidence · surplus during deload, deficit during accumulation',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.03)',
    border: 'rgba(245,158,11,0.10)',
    Icon: AlertTriangle,
  },
  {
    key: 'CORRECTION',
    label: 'What to fix',
    value: '+40g protein on heavy squat days, reduce on rest days',
    sub: 'DL:squat ratio 1.08 → redistribute volume after nutrition fix',
    color: 'rgba(255,255,255,0.7)',
    bg: 'rgba(255,255,255,0.02)',
    border: 'rgba(255,255,255,0.05)',
    Icon: Wrench,
  },
  {
    key: 'PROJECTED_GAIN',
    label: 'Expected outcome',
    value: '+8.2 kg squat 1RM in 6 weeks',
    sub: 'Based on current training frequency and corrected intake',
    color: '#2DDC8F',
    bg: 'rgba(45,220,143,0.03)',
    border: 'rgba(45,220,143,0.10)',
    Icon: TrendingUp,
  },
]

export function SampleOutcomeBlock() {
  return (
    <section id="sample-outcome" className="px-4 py-20 sm:px-6 md:px-10">
      <div className="mx-auto max-w-screen-xl">
        <div className="mb-8">
          <p className="font-mono-label text-accent mb-3">Sample athlete outcome</p>
          <motion.h2
            {...clipReveal()}
            className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2"
          >
            From baseline to diagnosis to tracked progress.
          </motion.h2>
          <p className="text-sm text-muted-foreground max-w-2xl">
            One athlete. One bottleneck. One correction path. One measurable outcome to track in the next block.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div {...slideFromLeft(0.1)} className="surface-card p-4 sm:p-6 md:p-8">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono-label text-muted-foreground mb-1.5">Athlete profile</p>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-foreground">85kg lifter · 3 yrs training</h3>
              </div>
              <div className="status-pill shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-glow" />
                <span className="font-mono-label text-muted-foreground">Live</span>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl p-3.5 sm:p-4" style={{ background: 'rgba(0,217,255,0.04)', border: '1px solid rgba(0,217,255,0.10)' }}>
                <p className="font-mono-label text-accent-light/70 mb-1.5">Current rank</p>
                <p className="font-mono text-2xl sm:text-3xl font-bold text-foreground">TOP 23%</p>
                <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">Squat 31% · Bench 22% · Deadlift 14%</p>
              </div>
              <div className="rounded-xl p-3.5 sm:p-4" style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.10)' }}>
                <p className="font-mono-label text-warning mb-1.5">Primary limiter</p>
                <p className="text-base sm:text-lg font-bold text-foreground">Nutrition timing inverted</p>
                <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">89% confidence · protein surplus during deload, deficit during accumulation</p>
              </div>
            </div>

            <div className="mt-3 rounded-xl p-3.5 sm:p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <p className="font-mono-label text-muted-foreground mb-1.5">What athleteOS would tell you</p>
              <p className="text-sm sm:text-base font-semibold text-foreground leading-relaxed">
                Shift 40g protein from rest days to heavy squat days. DL:squat ratio (1.08) shows posterior chain compensating — redistribute volume after nutrition fix.
              </p>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                Projected: +8.2kg squat 1RM in 6 weeks.
              </p>
            </div>
          </motion.div>

          <motion.div {...slideFromRight(0.15)} className="surface-card-muted p-4 sm:p-6 md:p-8">
            <p className="font-mono-label text-accent mb-3">Outcome chain</p>
            <div className="space-y-2.5">
              {OUTCOME_ROWS.map(({ key, label, value, sub, color, bg, border, Icon }, i) => (
                <motion.div
                  key={key}
                  className="rounded-xl p-3 sm:p-4"
                  style={{ background: bg, border: `1px solid ${border}` }}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: 0.08 + i * 0.06 }}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-lg"
                      style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                    >
                      <Icon size={12} className="sm:hidden" style={{ color }} />
                      <Icon size={14} className="hidden sm:block" style={{ color }} />
                    </div>
                    <p className="font-mono-label text-muted-foreground/70">{label}</p>
                  </div>
                  <p className="mt-2 text-sm sm:text-base font-bold text-foreground">{value}</p>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">{sub}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">Sample output only. Your exact rank and diagnosis will differ.</p>
              <a href="#rank" className="font-mono-label text-accent hover:text-accent-light transition" onClick={() => trackEvent('sample_outcome_cta_clicked', { time_on_page_seconds: Math.round((Date.now() - performance.timeOrigin) / 1000) })}>Start yours →</a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
