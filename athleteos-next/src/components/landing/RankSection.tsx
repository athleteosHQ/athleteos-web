'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { calculateRank, type RankInput, type RankResult } from '@/lib/rankCalc'
import { trackEvent } from '@/lib/analytics'
import { EASE_OUT, useHeadingParallax, staggerContainer, staggerItem } from '@/lib/motion'
import { AthleteScoreCard } from './AthleteScoreCard'
import { getFirstReadDiagnosis } from './firstReadDiagnosis'
import { ShareActions } from './ShareActions'
import { RankForm, type RankFormFields } from './rank/RankForm'
import { DiagnosticBars, ResultInsightPanel } from './rank/RankResult'
import { GhostTierPreview } from './rank/GhostTierPreview'
import { type AthleteMode, ModeSelector } from './ModeSelector'

// ── Main export ───────────────────────────────────────────────────────────
interface RankSectionProps {
  mode: AthleteMode
  onModeChange: (mode: AthleteMode) => void
  onRankResult: (result: RankResult) => void
}

export function RankSection({ mode, onModeChange, onRankResult }: RankSectionProps) {
  const parallax = useHeadingParallax()
  const trainingType = mode === 'gym' ? 'strength' : 'hybrid'
  const [f, setF] = useState<RankFormFields>({ bw: '', sqW: '', sqR: '', bpW: '', bpR: '', dlW: '', dlR: '', runMin: '', runSec: '' })
  const [result, setResult] = useState<RankResult | null>(null)
  const [error, setError] = useState('')
  const focusedFieldsRef = useRef<Set<string>>(new Set())
  const hasMountedRef = useRef(false)

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
    } else {
      trackEvent('rank_mode_changed', { from_mode: mode === 'gym' ? 'hybrid' : 'gym', to_mode: mode === 'gym' ? 'gym' : 'hybrid', had_result: result !== null })
    }
    setF({ bw: '', sqW: '', sqR: '', bpW: '', bpR: '', dlW: '', dlR: '', runMin: '', runSec: '' })
    setResult(null)
    setError('')
    focusedFieldsRef.current = new Set()
  }, [mode])

  const upd = (k: keyof RankFormFields) => (v: string) => setF(prev => ({ ...prev, [k]: v }))

  const handleFieldFocus = (field: keyof RankFormFields) => {
    if (focusedFieldsRef.current.has(field)) return
    focusedFieldsRef.current.add(field)
    const filledCount = Object.values(f).filter(v => v !== '').length
    trackEvent('rank_form_field_focused', { field, mode: trainingType, fields_already_filled: filledCount })
  }

  const submit = () => {
    setError('')
    trackEvent('rank_check_started', { trainingType })
    const bw = parseFloat(f.bw)
    if (isNaN(bw) || bw < 40 || bw > 250) { setError('Enter a valid bodyweight (40–250 kg)'); trackEvent('rank_form_error', { error_type: 'invalid_bodyweight', mode: trainingType, fields_filled: Object.values(f).filter(v => v !== '').length }); return }
    const input: RankInput = {
      bodyweight: bw,
      trainingType,
      squat:    { weight: parseFloat(f.sqW) || 0, reps: parseInt(f.sqR) || 0 },
      bench:    { weight: parseFloat(f.bpW) || 0, reps: parseInt(f.bpR) || 0 },
      deadlift: { weight: parseFloat(f.dlW) || 0, reps: parseInt(f.dlR) || 0 },
      ...(trainingType === 'hybrid' ? { run5k: { minutes: parseInt(f.runMin) || 0, seconds: parseInt(f.runSec) || 0 } } : {}),
    }
    const hasLift = input.squat.weight > 20 || input.bench.weight > 20 || input.deadlift.weight > 20
    if (!hasLift) { setError('Enter at least one lift above 20 kg'); trackEvent('rank_form_error', { error_type: 'no_lift_above_20', mode: trainingType, fields_filled: Object.values(f).filter(v => v !== '').length }); return }
    const r = calculateRank(input)
    if (!r) { setError('Could not calculate. Check your inputs.'); trackEvent('rank_form_error', { error_type: 'calculation_failed', mode: trainingType, fields_filled: Object.values(f).filter(v => v !== '').length }); return }
    localStorage.setItem('aos_rank_result', JSON.stringify(r))
    trackEvent('rank_result_viewed', {
      overallPct: r.overallPct,
      tier: r.tier,
      weightClass: r.weightClass,
      trainingType,
    })
    setResult(r)
    onRankResult(r)

    // Auto-scroll to personalized upsell strip after a brief pause
    window.setTimeout(() => {
      document.getElementById('personalized-upsell')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 800)
  }

  const reset = () => {
    trackEvent('rank_check_again', { previous_tier: result?.tier ?? '', previous_overallPct: result?.overallPct ?? 0 })
    setResult(null)
    setError('')
  }

  return (
    <section id="rank" className="section-fade-top py-24 px-6 md:px-10">
      <div className="container mx-auto max-w-6xl">

        {/* Section header */}
        <motion.div
          ref={parallax.ref}
          style={parallax.style}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-8"
        >
          <motion.span variants={staggerItem} className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 border border-accent/20 px-3 py-1 font-mono-label text-accent mb-3">Step 1</motion.span>
          <motion.h2 variants={staggerItem} className="text-3xl font-display font-bold text-foreground md:text-4xl">Generate your baseline signal</motion.h2>
          <motion.p variants={staggerItem} className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Your rank is not the answer — it&apos;s the first data point. AthleteOS uses it to build a system read:
            <span className="text-foreground"> what&apos;s limiting progress</span>, <span className="text-foreground">what to change</span>, and <span className="text-foreground">what outcome to track next</span>.
          </motion.p>
          <motion.div
            variants={staggerItem}
            className="mt-5 inline-flex flex-wrap items-center gap-2 rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3"
          >
            {[
              'Baseline',
              'Limiter',
              'Correction',
              'Outcome',
            ].map((step, index) => (
              <div key={step} className="inline-flex items-center gap-2">
                <span className="rounded-full bg-white/[0.05] px-2.5 py-1 font-mono-label text-muted-foreground">
                  {step}
                </span>
                {index < 3 && <span className="text-accent/70">→</span>}
              </div>
            ))}
          </motion.div>
        </motion.div>

        <div className="mb-8 flex items-center gap-3">
          <span className="text-sm text-muted-foreground">I train for</span>
          <ModeSelector mode={mode} onModeChange={onModeChange} />
        </div>

        <AnimatePresence mode="wait">
          {!result ? (
            /* ── Idle: 2-column (form + ghost preview) ── */
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
              className="grid lg:grid-cols-2 gap-6 items-start"
            >
              <RankForm
                mode={mode}
                fields={f}
                onFieldChange={upd}
                onSubmit={submit}
                error={error}
                onFieldFocus={handleFieldFocus}
              />
              <GhostTierPreview mode={mode} />
            </motion.div>
          ) : (
            /* ── Result: score card + bars + insight ── */
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.32, ease: EASE_OUT }}
              className="space-y-5"
            >
              {/* Initial Audit header */}
              <div className="rounded-xl px-4 py-3 mb-1" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p className="font-mono-label text-accent mb-1">Initial audit</p>
                <p className="text-sm text-foreground font-medium">
                  Your baseline is set. This is the starting signal — not the answer.
                </p>
                {(() => {
                  const lifts = [
                    { name: 'Squat', pct: result.squat.percentile, est: result.squat.estimated1RM },
                    { name: 'Bench', pct: result.bench.percentile, est: result.bench.estimated1RM },
                    { name: 'Deadlift', pct: result.deadlift.percentile, est: result.deadlift.estimated1RM },
                  ].filter(l => l.est > 0)
                  const weakest = lifts.reduce((min, l) => l.pct < min.pct ? l : min, lifts[0])
                  const strongest = lifts.reduce((max, l) => l.pct > max.pct ? l : max, lifts[0])
                  if (!weakest || !strongest || weakest.name === strongest.name) return null
                  return (
                    <p className="mt-2 text-sm text-muted-foreground">
                      <span className="font-mono-label text-muted-foreground/60">System observation:</span>{' '}
                      {strongest.name} is your strongest signal (Top {100 - strongest.pct}%), but {weakest.name} is a structural outlier (Top {100 - weakest.pct}%). The full diagnostic loop identifies whether the gap is training distribution, nutrition timing, or recovery debt.
                    </p>
                  )
                })()}
              </div>
              <div className="grid md:grid-cols-2 gap-6 items-start">
                <AthleteScoreCard
                  score={result.athleteScore}
                  systemStatus={result.tier}
                  percentileLabel={`Top ${100 - result.overallPct}% of competitive strength athletes`}
                  animate={false}
                  metrics={[
                    { label: 'Strength',  value: result.squat.estimated1RM > 0    ? `Top ${100 - result.squat.percentile}%`    : '—', status: result.squat.percentile >= 60    ? 'up' : result.squat.percentile >= 30    ? 'neutral' : 'down' },
                    { label: 'Bench',     value: result.bench.estimated1RM > 0    ? `Top ${100 - result.bench.percentile}%`    : '—', status: result.bench.percentile >= 60    ? 'up' : result.bench.percentile >= 30    ? 'neutral' : 'down' },
                    { label: 'Deadlift',  value: result.deadlift.estimated1RM > 0 ? `Top ${100 - result.deadlift.percentile}%` : '—', status: result.deadlift.percentile >= 60 ? 'up' : result.deadlift.percentile >= 30 ? 'neutral' : 'down' },
                    ...(result.run5k ? [{ label: '5K Run', value: `Top ${100 - result.run5k.percentile}%`, status: (result.run5k.percentile >= 60 ? 'up' : result.run5k.percentile >= 30 ? 'neutral' : 'down') as 'up' | 'neutral' | 'down' }] : []),
                  ]}
                />
                <div className="space-y-4">
                  <DiagnosticBars result={result} />
                  <ResultInsightPanel result={result} />
                </div>
              </div>
              <button
                type="button"
                onClick={reset}
                className="text-sm text-muted-foreground transition hover:text-foreground"
              >
                ↩ Check again
              </button>
              <ShareActions
                result={result}
                diagnosisLabel={getFirstReadDiagnosis(result).label}
                diagnosisHeadline={getFirstReadDiagnosis(result).headline}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  )
}
