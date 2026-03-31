'use client'

import { useState, useEffect } from 'react'
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

  useEffect(() => {
    setF({ bw: '', sqW: '', sqR: '', bpW: '', bpR: '', dlW: '', dlR: '', runMin: '', runSec: '' })
    setResult(null)
    setError('')
  }, [mode])

  const upd = (k: keyof RankFormFields) => (v: string) => setF(prev => ({ ...prev, [k]: v }))

  const submit = () => {
    setError('')
    trackEvent('rank_check_started', { trainingType })
    const bw = parseFloat(f.bw)
    if (isNaN(bw) || bw < 40 || bw > 250) { setError('Enter a valid bodyweight (40–250 kg)'); return }
    const input: RankInput = {
      bodyweight: bw,
      trainingType,
      squat:    { weight: parseFloat(f.sqW) || 0, reps: parseInt(f.sqR) || 0 },
      bench:    { weight: parseFloat(f.bpW) || 0, reps: parseInt(f.bpR) || 0 },
      deadlift: { weight: parseFloat(f.dlW) || 0, reps: parseInt(f.dlR) || 0 },
      ...(trainingType === 'hybrid' ? { run5k: { minutes: parseInt(f.runMin) || 0, seconds: parseInt(f.runSec) || 0 } } : {}),
    }
    const hasLift = input.squat.weight > 20 || input.bench.weight > 20 || input.deadlift.weight > 20
    if (!hasLift) { setError('Enter at least one lift above 20 kg'); return }
    const r = calculateRank(input)
    if (!r) { setError('Could not calculate. Check your inputs.'); return }
    localStorage.setItem('aos_rank_result', JSON.stringify(r))
    trackEvent('rank_result_viewed', {
      overallPct: r.overallPct,
      tier: r.tier,
      weightClass: r.weightClass,
      trainingType,
    })
    setResult(r)
    onRankResult(r)
  }

  const reset = () => { setResult(null); setError('') }

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
          <motion.p variants={staggerItem} className="font-mono-label text-accent mb-2">Step 1</motion.p>
          <motion.h2 variants={staggerItem} className="text-3xl font-display font-bold text-foreground md:text-4xl">See where you stand</motion.h2>
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
