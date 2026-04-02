'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring, useTransform, useMotionValue, AnimatePresence } from 'framer-motion'
import { Activity, ChevronDown } from 'lucide-react'
import type { RankResult as RankResultType } from '@/lib/rankCalc'
import { getFirstReadDiagnosis } from '../firstReadDiagnosis'
import { getRankResultMessaging } from '../rankResultMessaging'
import { EASE_OUT, DURATION } from '@/lib/motion'
import { insertFounder } from '@/lib/supabase'
import { trackEvent, identifyUser } from '@/lib/analytics'

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
    { label: 'Squat',    pct: result.squat.percentile,    value: result.squat.estimated1RM > 0    ? `Top ${100 - result.squat.percentile}%`    : '—', color: 'rgba(255,255,255,0.3)', est: result.squat.estimated1RM },
    { label: 'Bench',    pct: result.bench.percentile,    value: result.bench.estimated1RM > 0    ? `Top ${100 - result.bench.percentile}%`    : '—', color: 'rgba(255,255,255,0.5)', est: result.bench.estimated1RM },
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
      style={{ borderColor: 'rgba(255,255,255,0.06)' }}
    >
      {/* ── Primary: always visible ── */}
      <motion.div variants={cascadeChild}>
        <p className="font-mono-label text-accent mb-2">{messaging.status}</p>
        <p className="text-lg font-semibold text-foreground">{messaging.identity}</p>
        <p className="mt-1 text-base font-medium text-foreground/90">{messaging.progression}</p>
      </motion.div>

      <motion.div
        variants={cascadeChild}
        className="surface-card-muted mt-4 rounded-xl px-3.5 py-3"
      >
        <p className="font-mono-label text-muted-foreground mb-1.5">{diagnosis.label}</p>
        <p className="text-sm font-semibold text-foreground">{diagnosis.headline}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{diagnosis.body}</p>
      </motion.div>

      {result.nextThreshold && (
        <motion.div
          variants={cascadeChild}
          className="surface-card-muted mt-3 rounded-xl px-3.5 py-3"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}
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

      {/* ── Secondary: collapsible ── */}
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
                    className="surface-card-muted rounded-xl px-3.5 py-3"
                    style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                  >
                    <p className="font-mono-label text-accent mb-1">System Efficiency</p>
                    <p className="text-xl font-display font-bold text-accent">{result.efficiencyScore.pct}%</p>
                    <p className="text-xs text-muted-foreground mt-0.5">of theoretical ceiling</p>
                  </div>
                  <div className="surface-card-muted rounded-xl px-3.5 py-3">
                    <p className="font-mono-label text-muted-foreground mb-1">Strength Age</p>
                    <p className="text-xl font-display font-bold text-foreground">{result.strengthAge.years} <span className="text-sm font-normal text-muted-foreground">years</span></p>
                    <p className="text-xs text-muted-foreground mt-0.5">estimated training time</p>
                  </div>
                </div>

                <div className="surface-card-muted rounded-xl px-3.5 py-3">
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

      {/* ── Conversion bridge — momentum → commitment ── */}
      <div className="mt-8 surface-inset rounded-xl p-5 border border-white/[0.04]">
        <p className="font-mono-label text-[10px] tracking-[0.1em] text-muted-foreground/50 mb-3">THIS IS JUST THE SURFACE</p>
        <p className="text-sm text-foreground font-medium leading-relaxed mb-2">
          You now know where you stand. But you don&apos;t know <span className="text-foreground">why</span>.
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed mb-4">
          The full system reads your training, nutrition, and recovery together — finds the one thing stalling progress — and gives you the exact correction. Every block, a sharper read.
        </p>

        <div className="flex items-center gap-3 mb-4 py-2 px-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Founding rate</span>
            <span className="text-sm text-foreground font-bold">₹250/mo</span>
          </div>
          <div className="h-8 w-px bg-white/[0.06]" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Payment</span>
            <span className="text-sm text-foreground font-bold">Not until launch</span>
          </div>
          <div className="h-8 w-px bg-white/[0.06]" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Slots</span>
            <span className="text-sm text-foreground font-bold">Limited</span>
          </div>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault()
            const form = e.currentTarget
            const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement
            const email = emailInput?.value?.trim()
            if (!email) return

            const btn = form.querySelector('button[type="submit"]') as HTMLButtonElement
            if (btn) { btn.disabled = true; btn.textContent = 'Joining...' }

            try {
              const { error } = await insertFounder({ email, whatsapp: '', source: 'inline_rank_result' })
              if (error) {
                if (btn) { btn.disabled = false; btn.textContent = 'Start My Diagnosis →' }
                return
              }
              trackEvent('signup_conversion', { source: 'inline_rank_result', email })
              identifyUser(email)
              if (btn) { btn.textContent = '✓ You\u2019re in' }
              localStorage.setItem('aos_founder_data', JSON.stringify({ email, ts: Date.now() }))
            } catch {
              if (btn) { btn.disabled = false; btn.textContent = 'Start My Diagnosis →' }
            }
          }}
          className="flex gap-2"
        >
          <input
            type="email"
            placeholder="your@email.com"
            required
            className="flex-1 rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-white/20 transition-colors min-h-[44px]"
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg px-5 py-2.5 text-sm font-bold text-white uppercase tracking-[0.02em] transition-all duration-200 hover:bg-[#fafafa] hover:text-[#09090b] min-h-[44px]"
            style={{ background: 'linear-gradient(104deg, rgba(253,253,253,0.05) 5%, rgba(240,240,228,0.1) 100%)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            Start My Diagnosis &rarr;
          </button>
        </form>
      </div>
    </motion.div>
  )
}
