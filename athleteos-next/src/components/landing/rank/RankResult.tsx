'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring, useTransform, useMotionValue, AnimatePresence } from 'framer-motion'
import { Activity, ChevronDown } from 'lucide-react'
import type { RankResult as RankResultType } from '@/lib/rankCalc'
import { getFirstReadDiagnosis } from '../firstReadDiagnosis'
import { getRankResultMessaging } from '../rankResultMessaging'
import { EASE_OUT, DURATION } from '@/lib/motion'

// Gradient text helper
const gradStyle = {
  background: 'linear-gradient(135deg, #FF6B35, #FF0080)',
  WebkitBackgroundClip: 'text' as const,
  WebkitTextFillColor: 'transparent' as const,
  backgroundClip: 'text' as const,
}

// ── Spring-driven bar ─────────────────────────────────────────────────────
function SpringBar({ pct, color, delay }: { pct: number; color: string; delay: number }) {
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { stiffness: 55, damping: 16 })
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

const cascadeParent = {
  hidden: {},
  visible: { transition: { delayChildren: 0.5, staggerChildren: 0.07 } },
}
const cascadeChild = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.normal, ease: EASE_OUT } },
}

// ── Diagnostic bars ───────────────────────────────────────────────────────
export function DiagnosticBars({ result }: { result: RankResultType }) {
  const bars = [
    {
      label: 'Squat',
      pct: result.squat.percentile,
      value: result.squat.estimated1RM > 0 ? `Top ${100 - result.squat.percentile}%` : '—',
      color: 'linear-gradient(90deg, #FF6B35, #FF0080)',
      colorFlat: '#FF6B35',
      est: result.squat.estimated1RM,
    },
    {
      label: 'Bench',
      pct: result.bench.percentile,
      value: result.bench.estimated1RM > 0 ? `Top ${100 - result.bench.percentile}%` : '—',
      color: '#F59E0B',
      colorFlat: '#F59E0B',
      est: result.bench.estimated1RM,
    },
    {
      label: 'Deadlift',
      pct: result.deadlift.percentile,
      value: result.deadlift.estimated1RM > 0 ? `Top ${100 - result.deadlift.percentile}%` : '—',
      color: '#EF4444',
      colorFlat: '#EF4444',
      est: result.deadlift.estimated1RM,
    },
    ...(result.run5k
      ? [{
          label: '5K Run',
          pct: result.run5k.percentile,
          value: `Top ${100 - result.run5k.percentile}%`,
          color: '#2DDC8F',
          colorFlat: '#2DDC8F',
          est: 1,
        }]
      : []),
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
          <Activity className="w-3 h-3" style={{ color: '#FF6B35' }} />
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
              <span
                className="font-mono tabular-nums text-xs font-bold"
                style={i === 0 ? gradStyle : { color: bar.colorFlat }}
              >
                {bar.value}
              </span>
            </div>
          </div>
          <div className="h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <SpringBar pct={bar.pct} color={bar.color} delay={0.3 + i * 0.1} />
          </div>
        </div>
      ))}
    </motion.div>
  )
}

// ── Result insight panel ──────────────────────────────────────────────────
export function ResultInsightPanel({ result }: { result: RankResultType }) {
  const [expanded, setExpanded] = useState(false)
  const messaging = getRankResultMessaging({ overallPct: result.overallPct, weightClass: result.weightClass })
  const diagnosis = getFirstReadDiagnosis(result)

  return (
    <motion.div
      variants={cascadeParent}
      initial="hidden"
      animate="visible"
      className="rounded-2xl px-4 py-4"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,107,53,0.12)',
      }}
    >
      <motion.div variants={cascadeChild}>
        <p className="font-mono-label mb-2" style={gradStyle}>{messaging.status}</p>
        <p className="text-lg font-semibold text-foreground">{messaging.identity}</p>
        <p className="mt-1 text-base font-medium text-foreground/90">{messaging.progression}</p>
      </motion.div>

      <motion.div
        variants={cascadeChild}
        className="mt-4 rounded-xl px-3.5 py-3"
        style={{
          background: 'linear-gradient(#0C0C0E, #0C0C0E) padding-box, linear-gradient(135deg, rgba(255,80,120,0.4), rgba(80,120,255,0.4)) border-box',
          border: '1px solid transparent',
        }}
      >
        <p className="font-mono-label text-muted-foreground mb-1.5">{diagnosis.label}</p>
        <p className="text-sm font-semibold text-foreground">{diagnosis.headline}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{diagnosis.body}</p>
      </motion.div>

      {result.nextThreshold && (
        <motion.div
          variants={cascadeChild}
          className="mt-3 rounded-xl px-3.5 py-3"
          style={{
            background: 'linear-gradient(#0C0C0E, #0C0C0E) padding-box, linear-gradient(135deg, rgba(255,107,53,0.45), rgba(255,0,128,0.35)) border-box',
            border: '1px solid transparent',
          }}
        >
          <p className="font-mono-label mb-1.5" style={gradStyle}>Next Threshold</p>
          <p className="text-sm leading-relaxed text-foreground">
            Your <span className="font-bold">{result.nextThreshold.lift}</span> needs{' '}
            <span className="font-mono font-bold" style={gradStyle}>+{result.nextThreshold.kgNeeded}kg</span>{' '}
            to move from Top {100 - result.nextThreshold.currentPct}% to{' '}
            <span className="font-bold text-foreground">Top {100 - result.nextThreshold.nextPct}%</span>.
          </p>
        </motion.div>
      )}

      <motion.div variants={cascadeChild} className="mt-3">
        <button
          type="button"
          onClick={() => setExpanded(prev => !prev)}
          aria-expanded={expanded}
          className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground py-2"
        >
          <ChevronDown
            className="w-3.5 h-3.5 transition-transform duration-200"
            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
          {expanded ? 'Hide full breakdown' : 'See full breakdown'}
        </button>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: EASE_OUT }}
              style={{ overflow: 'hidden' }}
            >
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-2">
                  <div
                    className="rounded-xl px-3.5 py-3"
                    style={{
                      background: 'linear-gradient(#0C0C0E, #0C0C0E) padding-box, linear-gradient(135deg, rgba(255,80,120,0.4), rgba(80,120,255,0.4)) border-box',
                      border: '1px solid transparent',
                    }}
                  >
                    <p className="font-mono-label mb-1" style={gradStyle}>System Efficiency</p>
                    <p className="text-xl font-bold" style={{ fontFamily: "'Syne', sans-serif", ...gradStyle }}>
                      {result.efficiencyScore.pct}%
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">of theoretical ceiling</p>
                  </div>
                  <div
                    className="rounded-xl px-3.5 py-3"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <p className="font-mono-label text-muted-foreground mb-1">Strength Age</p>
                    <p className="text-xl font-bold text-foreground" style={{ fontFamily: "'Syne', sans-serif" }}>
                      {result.strengthAge.years}{' '}
                      <span className="text-sm font-normal text-muted-foreground">years</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">estimated training time</p>
                  </div>
                </div>

                <div
                  className="rounded-xl px-3.5 py-3"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <p className="font-mono-label text-muted-foreground mb-1.5">System Read</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{messaging.preview}</p>
                </div>

                <div
                  className="rounded-xl px-3.5 py-3"
                  style={{ background: 'rgba(45,220,143,0.04)', border: '1px solid rgba(45,220,143,0.14)' }}
                >
                  <p className="font-mono-label text-success mb-1.5">World Benchmark</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{messaging.worldBenchmark}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <p className="mt-3 text-xs text-muted-foreground">
        This is your rank. Scroll down to see what the full diagnosis would reveal.
      </p>
    </motion.div>
  )
}
