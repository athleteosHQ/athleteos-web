'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Activity } from 'lucide-react'
import { calculateRank, type RankInput, type RankResult } from '@/lib/rankCalc'
import { AthleteScoreCard } from './AthleteScoreCard'

function GlassInput({ label, value, onChange, placeholder, min, max, step }: {
  label?: string; value: string; onChange: (v: string) => void
  placeholder: string; min?: number; max?: number; step?: number
}) {
  return (
    <input
      type="number"
      aria-label={label ?? placeholder}
      placeholder={placeholder}
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={e => onChange(e.target.value)}
      className="w-full rounded-xl font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-all"
      style={{
        background: 'rgba(11,17,24,0.8)',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: '12px',
        padding: '12px 14px',
      }}
      onFocus={e => { e.target.style.borderColor = 'rgba(255,122,47,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(255,122,47,0.08)' }}
      onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.10)'; e.target.style.boxShadow = 'none' }}
    />
  )
}

function LiftRow({ label, weightVal, repsVal, onWeight, onReps }: {
  label: string; weightVal: string; repsVal: string
  onWeight: (v: string) => void; onReps: (v: string) => void
}) {
  return (
    <div>
      <p className="font-mono-label text-muted-foreground mb-1.5">{label}</p>
      <div className="flex gap-2">
        <GlassInput placeholder="kg" value={weightVal} onChange={onWeight} min={0} step={0.5} />
        <div className="w-24 flex-shrink-0">
          <GlassInput placeholder="reps" value={repsVal} onChange={onReps} min={1} max={30} />
        </div>
      </div>
    </div>
  )
}

const BAR_CONFIGS = [
  { key: 'squat',    label: 'Squat',    color: '#FF7A2F' },
  { key: 'bench',    label: 'Bench',    color: '#F59E0B' },
  { key: 'deadlift', label: 'Deadlift', color: '#E24B4A' },
  { key: 'run5k',    label: '5K Run',   color: '#2DDC8F' },
] as const

function DiagnosticBars({ result }: { result: RankResult }) {
  const bars = [
    { label: 'Squat',    pct: result.squat.percentile,    value: result.squat.estimated1RM > 0    ? `Top ${100 - result.squat.percentile}%`    : '—', color: '#FF7A2F', est: result.squat.estimated1RM },
    { label: 'Bench',    pct: result.bench.percentile,    value: result.bench.estimated1RM > 0    ? `Top ${100 - result.bench.percentile}%`    : '—', color: '#F59E0B', est: result.bench.estimated1RM },
    { label: 'Deadlift', pct: result.deadlift.percentile, value: result.deadlift.estimated1RM > 0 ? `Top ${100 - result.deadlift.percentile}%` : '—', color: '#E24B4A', est: result.deadlift.estimated1RM },
    ...(result.run5k ? [{ label: '5K Run', pct: result.run5k.percentile, value: `Top ${100 - result.run5k.percentile}%`, color: '#2DDC8F', est: 1 }] : []),
  ]

  return (
    <motion.div
      className="card-surface p-6 space-y-5"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-baseline">
        <div className="flex items-center gap-2">
          <Activity className="w-3 h-3 text-accent" />
          <p className="font-mono-label text-muted-foreground">Diagnostic Output</p>
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
          <div className="h-1.5 rounded-full overflow-hidden signal-bar" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: bar.color }}
              initial={{ width: 0 }}
              animate={{ width: `${bar.pct}%` }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: 'easeOut' }}
            />
          </div>
        </div>
      ))}
    </motion.div>
  )
}

export function RankSection() {
  const [trainingType, setTrainingType] = useState<'strength' | 'hybrid'>('strength')
  const [f, setF] = useState({ bw: '', sqW: '', sqR: '', bpW: '', bpR: '', dlW: '', dlR: '', runMin: '', runSec: '' })
  const [result, setResult] = useState<RankResult | null>(null)
  const [error, setError] = useState('')

  const upd = (k: keyof typeof f) => (v: string) => setF(prev => ({ ...prev, [k]: v }))

  const submit = () => {
    setError('')
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
    setResult(r)
  }

  const reset = () => { setResult(null); setError('') }

  return (
    <section id="rank" className="py-24 px-4 sm:px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="font-mono-label text-accent mb-3">Step 1 · Diagnostic Engine</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            Run your first diagnosis.
          </h2>
          <p className="text-muted-foreground">
            Enter your numbers. We identify where you stand — and what&apos;s holding you back.
          </p>
          <p className="mt-1 font-mono-label text-muted-foreground">India percentile · IFCT 2017 verified data</p>
        </motion.div>

        {!result ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Glass panel */}
            <div
              className="rounded-2xl p-6 sm:p-8"
              style={{
                background: 'rgba(255,255,255,0.026)',
                border: '1px solid rgba(255,255,255,0.09)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 24px 72px rgba(0,0,0,0.32)',
              }}
            >
              {/* Training type toggle */}
              <div className="flex gap-2 mb-8">
                {(['strength', 'hybrid'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTrainingType(t)}
                    className="px-4 py-2 rounded-xl font-mono-label transition"
                    style={trainingType === t
                      ? { background: 'rgba(255,122,47,0.14)', border: '1px solid rgba(255,122,47,0.35)', color: '#FF9A5C' }
                      : { background: 'transparent', border: '1px solid rgba(255,255,255,0.09)', color: 'var(--muted-foreground)' }
                    }
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="space-y-5">
                <div>
                  <p className="font-mono-label text-muted-foreground mb-1.5">Bodyweight</p>
                  <div className="w-40">
                    <GlassInput placeholder="kg" value={f.bw} onChange={upd('bw')} min={40} max={250} step={0.5} />
                  </div>
                </div>
                <div
                  className="h-px"
                  style={{ background: 'linear-gradient(90deg, rgba(255,122,47,0.2), rgba(255,255,255,0.04), transparent)' }}
                />
                <LiftRow label="Squat"    weightVal={f.sqW} repsVal={f.sqR} onWeight={upd('sqW')} onReps={upd('sqR')} />
                <LiftRow label="Bench"    weightVal={f.bpW} repsVal={f.bpR} onWeight={upd('bpW')} onReps={upd('bpR')} />
                <LiftRow label="Deadlift" weightVal={f.dlW} repsVal={f.dlR} onWeight={upd('dlW')} onReps={upd('dlR')} />
                {trainingType === 'hybrid' && (
                  <div>
                    <p className="font-mono-label text-muted-foreground mb-1.5">5K Run Time</p>
                    <div className="flex gap-2 w-52">
                      <GlassInput placeholder="min" value={f.runMin} onChange={upd('runMin')} min={12} max={60} />
                      <GlassInput placeholder="sec" value={f.runSec} onChange={upd('runSec')} min={0} max={59} />
                    </div>
                  </div>
                )}
              </div>

              {error && <p className="mt-4 font-mono text-xs text-destructive">{error}</p>}

              <button
                onClick={submit}
                className="cta-glow mt-8 w-full bg-accent text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 group transition hover:bg-accent-light accent-glow"
              >
                Run Diagnosis
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 items-start">
            <AthleteScoreCard
              score={result.athleteScore}
              systemStatus={result.tier}
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
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={reset}
                  className="border border-white/10 text-muted-foreground py-3 rounded-xl text-sm font-semibold transition hover:text-foreground hover:border-white/20"
                >
                  ↩ Re-run
                </button>
                <a
                  href="#waitlist"
                  className="cta-glow bg-accent text-white py-3 rounded-xl text-sm font-bold text-center transition hover:bg-accent-light"
                >
                  Diagnose the gap →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
