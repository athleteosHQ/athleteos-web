'use client'

import { useEffect } from 'react'
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion'
import { Activity } from 'lucide-react'
import type { RankResult as RankResultType } from '@/lib/rankCalc'
import { getFirstReadDiagnosis } from '../firstReadDiagnosis'
import { getRankResultMessaging } from '../rankResultMessaging'
import { EASE_OUT, DURATION } from '@/lib/motion'

// ── Spring-driven bar ─────────────────────────────────────────────────────
function SpringBar({ pct, color, delay }: { pct: number; color: string; delay: number }) {
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { stiffness: 60, damping: 18 })
  const width = useTransform(spring, v => `${v}%`)

  useEffect(() => {
    const timeout = setTimeout(() => motionValue.set(pct), delay * 1000)
    return () => clearTimeout(timeout)
  }, [pct, delay, motionValue])

  return (
    <motion.div
      className="h-full rounded-full"
      style={{ background: color, width }}
    />
  )
}

// ── Cascade variants ──────────────────────────────────────────────────────
const cascadeParent = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.6, staggerChildren: 0.06 },
  },
}
const cascadeChild = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.normal, ease: EASE_OUT },
  },
}

// ── Diagnostic bars ───────────────────────────────────────────────────────
export function DiagnosticBars({ result }: { result: RankResultType }) {
  const bars = [
    { label: 'Squat',    pct: result.squat.percentile,    value: result.squat.estimated1RM > 0    ? `Top ${100 - result.squat.percentile}%`    : '—', color: '#5E6AD2', est: result.squat.estimated1RM },
    { label: 'Bench',    pct: result.bench.percentile,    value: result.bench.estimated1RM > 0    ? `Top ${100 - result.bench.percentile}%`    : '—', color: '#F59E0B', est: result.bench.estimated1RM },
    { label: 'Deadlift', pct: result.deadlift.percentile, value: result.deadlift.estimated1RM > 0 ? `Top ${100 - result.deadlift.percentile}%` : '—', color: '#EF4444', est: result.deadlift.estimated1RM },
    ...(result.run5k ? [{ label: '5K Run', pct: result.run5k.percentile, value: `Top ${100 - result.run5k.percentile}%`, color: '#2DDC8F', est: 1 }] : []),
  ]

  return (
    <motion.div
      className="surface-card p-6 space-y-5"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-baseline">
        <div className="flex items-center gap-2">
          <Activity className="w-3 h-3 text-accent" />
          <p className="font-mono-label text-muted-foreground">Strength Signal</p>
        </div>
        <p className="text-xs text-muted-foreground">vs. {result.weightClass} class</p>
      </div>

      {bars.map((bar, i) => (
        <div key={bar.label} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-foreground">{bar.label}</span>
            <div className="flex items-center gap-3">
              {bar.est > 0 && (
                <span className="font-mono text-xs text-muted-foreground">{bar.est.toFixed(1)}kg 1RM</span>
              )}
              <span className="font-mono tabular-nums text-xs font-bold" style={{ color: bar.color }}>{bar.value}</span>
            </div>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <SpringBar pct={bar.pct} color={bar.color} delay={0.3 + i * 0.1} />
          </div>
        </div>
      ))}
    </motion.div>
  )
}

// ── Result insight panel ──────────────────────────────────────────────────
export function ResultInsightPanel({ result }: { result: RankResultType }) {
  const messaging = getRankResultMessaging({
    overallPct: result.overallPct,
    weightClass: result.weightClass,
  })
  const diagnosis = getFirstReadDiagnosis(result)

  return (
    <motion.div
      variants={cascadeParent}
      initial="hidden"
      animate="visible"
      className="surface-card-muted rounded-2xl px-4 py-4"
      style={{ borderColor: 'rgba(94,106,210,0.14)' }}
    >
      <motion.div variants={cascadeChild}>
        <p className="font-mono-label text-accent mb-2">{messaging.status}</p>
        <p className="text-lg font-semibold text-foreground">{messaging.identity}</p>
        <p className="mt-1 text-base font-medium text-foreground/90">{messaging.progression}</p>
      </motion.div>

      {/* Efficiency + Strength Age */}
      <motion.div variants={cascadeChild} className="mt-3 grid grid-cols-2 gap-2">
        <div
          className="surface-card-muted rounded-xl px-3.5 py-3"
          style={{ borderColor: 'rgba(94,106,210,0.14)' }}
        >
          <p className="font-mono-label text-accent mb-1">System Efficiency</p>
          <p className="text-xl font-display font-bold text-accent">{result.efficiencyScore.pct}%</p>
          <p className="text-xs text-muted-foreground mt-0.5">of theoretical ceiling</p>
        </div>
        <div
          className="surface-card-muted rounded-xl px-3.5 py-3"
        >
          <p className="font-mono-label text-muted-foreground mb-1">Strength Age</p>
          <p className="text-xl font-display font-bold text-foreground">{result.strengthAge.years} <span className="text-sm font-normal text-muted-foreground">years</span></p>
          <p className="text-xs text-muted-foreground mt-0.5">estimated training time</p>
        </div>
      </motion.div>

      <motion.div
        variants={cascadeChild}
        className="surface-card-muted mt-4 rounded-xl px-3.5 py-3"
      >
        <p className="font-mono-label text-muted-foreground mb-1.5">{diagnosis.label}</p>
        <p className="text-sm font-semibold text-foreground">{diagnosis.headline}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{diagnosis.body}</p>
      </motion.div>

      <motion.div
        variants={cascadeChild}
        className="surface-card-muted mt-3 rounded-xl px-3.5 py-3"
      >
        <p className="font-mono-label text-muted-foreground mb-1.5">System Read</p>
        <p className="text-sm leading-relaxed text-muted-foreground">{messaging.preview}</p>
      </motion.div>

      <motion.div
        variants={cascadeChild}
        className="mt-3 rounded-xl px-3.5 py-3"
        style={{ background: 'rgba(45,220,143,0.04)', border: '1px solid rgba(45,220,143,0.14)' }}
      >
        <p className="font-mono-label text-success mb-1.5">World Benchmark</p>
        <p className="text-sm leading-relaxed text-muted-foreground">{messaging.worldBenchmark}</p>
      </motion.div>

      {result.nextThreshold && (
        <motion.div
          variants={cascadeChild}
          className="surface-card-muted mt-3 rounded-xl px-3.5 py-3"
          style={{ borderColor: 'rgba(94,106,210,0.18)' }}
        >
          <p className="font-mono-label text-accent mb-1.5">Next Threshold</p>
          <p className="text-sm leading-relaxed text-foreground">
            Your <span className="font-bold">{result.nextThreshold.lift}</span> needs{' '}
            <span className="font-mono font-bold text-accent">+{result.nextThreshold.kgNeeded}kg</span>{' '}
            to move from Top {100 - result.nextThreshold.currentPct}% to{' '}
            <span className="font-bold text-foreground">Top {100 - result.nextThreshold.nextPct}%</span>.
          </p>
        </motion.div>
      )}

      <motion.div variants={cascadeChild} className="mt-4 grid gap-2 sm:grid-cols-3">
        {messaging.lockedCards.map((label) => (
          <div
            key={label}
            className="surface-card-muted locked-peek relative overflow-hidden rounded-lg px-3 py-3"
          >
            <p className="text-sm font-semibold text-foreground select-none" style={{ filter: 'blur(4px)' }}>{label}</p>
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: 'linear-gradient(180deg, rgba(5,5,6,0) 0%, rgba(5,5,6,0.55) 45%, rgba(5,5,6,0.92) 100%)' }}
            />
            <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 font-mono text-[9px] text-muted-foreground/30 uppercase tracking-widest">locked</span>
          </div>
        ))}
      </motion.div>

      <p className="mt-3 text-xs text-muted-foreground">
        Founding members unlock the full performance readout.
      </p>
    </motion.div>
  )
}
