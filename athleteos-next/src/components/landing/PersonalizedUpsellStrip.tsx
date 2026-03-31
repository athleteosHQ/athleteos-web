'use client'

import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import type { RankResult } from '@/lib/rankCalc'
import { fadeUp } from '@/lib/motion'

interface PersonalizedUpsellStripProps {
  rankResult: RankResult
}

function getWeakestLift(result: RankResult): { name: string; pct: number } {
  const lifts = [
    { name: 'Squat', pct: result.squat.percentile },
    { name: 'Bench', pct: result.bench.percentile },
    { name: 'Deadlift', pct: result.deadlift.percentile },
  ].filter(l => l.pct > 0)

  if (lifts.length === 0) return { name: 'Squat', pct: 0 }
  return lifts.reduce((min, l) => (l.pct < min.pct ? l : min), lifts[0])
}

function getStrongestLift(result: RankResult): { name: string; pct: number } {
  const lifts = [
    { name: 'Squat', pct: result.squat.percentile },
    { name: 'Bench', pct: result.bench.percentile },
    { name: 'Deadlift', pct: result.deadlift.percentile },
  ].filter(l => l.pct > 0)

  if (lifts.length === 0) return { name: 'Squat', pct: 0 }
  return lifts.reduce((max, l) => (l.pct > max.pct ? l : max), lifts[0])
}

const LOCKED_ROWS = [
  {
    key: 'LIMITER',
    label: 'Primary limiter',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.05)',
    border: 'rgba(245,158,11,0.18)',
  },
  {
    key: 'CORRECTION',
    label: 'What to fix',
    color: 'rgba(255,255,255,0.7)',
    bg: 'rgba(255,255,255,0.02)',
    border: 'rgba(255,255,255,0.09)',
  },
  {
    key: 'PROJECTED_GAIN',
    label: 'Expected outcome',
    color: '#2DDC8F',
    bg: 'rgba(45,220,143,0.05)',
    border: 'rgba(45,220,143,0.18)',
  },
] as const

export function PersonalizedUpsellStrip({ rankResult }: PersonalizedUpsellStripProps) {
  const weakest = getWeakestLift(rankResult)
  const strongest = getStrongestLift(rankResult)
  const topPct = 100 - rankResult.overallPct

  const limiterCopy = `Your ${strongest.name.toLowerCase()} is Top ${100 - strongest.pct}% but your ${weakest.name.toLowerCase()} is Top ${100 - weakest.pct}%. The full system read identifies whether the gap is training distribution, nutrition timing, or recovery debt — and tells you exactly what to change first.`

  const lockedContent: Record<string, string> = {
    LIMITER: limiterCopy,
    CORRECTION: `One specific change. Based on your numbers at ${rankResult.weightClass}, not a template.`,
    PROJECTED_GAIN: '6-week projection calibrated to your current training frequency and weight class.',
  }

  return (
    <section id="personalized-upsell" className="px-6 py-16 md:px-10">
      <div className="mx-auto max-w-screen-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <p className="font-mono-label text-accent mb-2">Your diagnosis preview</p>
          <h3 className="text-2xl font-display font-bold text-foreground md:text-3xl">
            You&apos;re Top {topPct}%. Here&apos;s what the full read would tell you.
          </h3>
        </motion.div>

        {/* Real rank row */}
        <motion.div
          {...fadeUp(0.1)}
          className="rounded-2xl p-4 mb-3"
          style={{
            background: 'rgba(0,217,255,0.05)',
            border: '1px solid rgba(0,217,255,0.18)',
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] font-bold" style={{ color: 'var(--data-cyan, #00D9FF)', opacity: 0.9 }}>YOUR_RANK</p>
              <p className="font-mono-label text-muted-foreground/70 mt-1">Where you stand</p>
            </div>
            <span className="h-2 w-2 rounded-full mt-1" style={{ background: 'var(--data-cyan, #00D9FF)' }} />
          </div>
          <p className="mt-3 text-base font-bold text-foreground">
            Top {topPct}% of competitive strength athletes
          </p>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Squat · Top {100 - rankResult.squat.percentile}%
            {' '}  Bench · Top {100 - rankResult.bench.percentile}%
            {' '}  Deadlift · Top {100 - rankResult.deadlift.percentile}%
          </p>
        </motion.div>

        {/* Locked rows */}
        <div className="space-y-3">
          {LOCKED_ROWS.map(({ key, label, color, bg, border }, i) => (
            <motion.div
              key={key}
              {...fadeUp(0.15 + i * 0.06)}
              className="relative rounded-2xl p-4 overflow-hidden"
              style={{ background: bg, border: `1px solid ${border}` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] font-bold" style={{ color, opacity: 0.9 }}>{key}</p>
                  <p className="font-mono-label text-muted-foreground/70 mt-1">{label}</p>
                </div>
                <Lock className="w-3.5 h-3.5 mt-1 text-muted-foreground/40" />
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed select-none" style={{ filter: 'blur(2.5px)', opacity: 0.75 }}>
                {lockedContent[key]}
              </p>
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(5,5,6,0.25) 75%, rgba(5,5,6,0.45) 100%)' }}
              />
            </motion.div>
          ))}
        </div>

        <motion.div {...fadeUp(0.4)} className="mt-8 text-center">
          <a
            href="#inline-signup-gate"
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-accent px-8 py-4 text-base font-bold text-white transition-all hover:bg-accent-light"
            style={{ boxShadow: '0 2px 8px rgba(107,122,237,0.25), 0 1px 2px rgba(0,0,0,0.4)' }}
          >
            Unlock your full read
          </a>
        </motion.div>
      </div>
    </section>
  )
}
