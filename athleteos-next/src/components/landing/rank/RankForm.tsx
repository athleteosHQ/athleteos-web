'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { GlassInput, LiftRow } from './SystemInput'
import { type AthleteMode } from '../ModeSelector'
import { EASE_OUT } from '@/lib/motion'

const QUICK_PRESETS = [
  { label: 'Beginner', bw: '75', sqW: '80', sqR: '5', bpW: '55', bpR: '5', dlW: '100', dlR: '5' },
  { label: 'Intermediate', bw: '83', sqW: '120', sqR: '3', bpW: '85', bpR: '3', dlW: '150', dlR: '3' },
  { label: 'Advanced', bw: '93', sqW: '170', sqR: '2', bpW: '120', bpR: '2', dlW: '210', dlR: '2' },
] as const

export interface RankFormFields {
  bw: string; sqW: string; sqR: string; bpW: string; bpR: string
  dlW: string; dlR: string; runMin: string; runSec: string
}

interface RankFormProps {
  mode: AthleteMode
  fields: RankFormFields
  onFieldChange: (key: keyof RankFormFields) => (value: string) => void
  onSubmit: () => void
  error: string
  onFieldFocus?: (field: keyof RankFormFields) => void
}

type Stage = 'profile' | 'lifts' | 'ready'

export function RankForm({ mode, fields: f, onFieldChange: upd, onSubmit, error, onFieldFocus }: RankFormProps) {
  const [stage, setStage] = useState<Stage>('profile')

  const bwValid = f.bw !== '' && !isNaN(parseFloat(f.bw)) && parseFloat(f.bw) >= 40

  const hasLift = (parseFloat(f.sqW) || 0) > 20
    || (parseFloat(f.bpW) || 0) > 20
    || (parseFloat(f.dlW) || 0) > 20

  const advanceToLifts = () => {
    if (bwValid) setStage('lifts')
  }

  const advanceToReady = () => {
    if (hasLift) setStage('ready')
  }

  return (
    <div className="surface-card p-4 sm:p-6 md:p-8">
      {/* Progress indicator */}
      <div className="flex items-center gap-2 mb-5">
        {(['profile', 'lifts', 'ready'] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300"
              style={{
                background: stage === s ? 'rgba(255,255,255,0.15)' : ((['profile', 'lifts', 'ready'].indexOf(stage) > i) ? 'rgba(45,220,143,0.15)' : 'rgba(255,255,255,0.05)'),
                color: stage === s ? '#fff' : ((['profile', 'lifts', 'ready'].indexOf(stage) > i) ? 'var(--success)' : 'var(--muted-foreground)'),
                border: stage === s ? 'none' : '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {['profile', 'lifts', 'ready'].indexOf(stage) > i ? <Check className="w-3 h-3" /> : i + 1}
            </div>
            {i < 2 && (
              <div
                className="w-8 h-px transition-all duration-300"
                style={{ background: ['profile', 'lifts', 'ready'].indexOf(stage) > i ? 'var(--success)' : 'rgba(255,255,255,0.06)' }}
              />
            )}
          </div>
        ))}
        <span className="ml-2 font-mono-label text-muted-foreground/50">
          {stage === 'profile' && 'Athlete profile'}
          {stage === 'lifts' && 'Training data'}
          {stage === 'ready' && 'Generating read'}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {/* ── Stage 1: Profile ── */}
        {stage === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
          >
            <div className="mb-6">
              <p className="text-[10px] font-mono uppercase tracking-[0.1em] text-muted-foreground/40 mb-3">Quick start — pick the closest</p>
              <div className="flex gap-2">
                {QUICK_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      upd('bw')(preset.bw)
                      upd('sqW')(preset.sqW)
                      upd('sqR')(preset.sqR)
                      upd('bpW')(preset.bpW)
                      upd('bpR')(preset.bpR)
                      upd('dlW')(preset.dlW)
                      upd('dlR')(preset.dlR)
                      setStage('ready')
                    }}
                    className="flex-1 rounded-lg px-3 py-3 text-center transition-all duration-200 hover:bg-white/[0.06] hover:border-white/[0.12]"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <span className="block text-xs font-medium text-foreground">{preset.label}</span>
                    <span className="block text-[10px] text-muted-foreground/50 mt-1">{preset.bw}kg · S{preset.sqW} B{preset.bpW} D{preset.dlW}</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-white/[0.06]" />
                <span className="text-[10px] text-muted-foreground/30 uppercase tracking-widest">or enter manually</span>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              The system needs your weight class to calibrate the baseline.
            </p>
            <div className="grid grid-cols-[56px_1fr_56px] sm:grid-cols-[80px_1fr_72px] items-center gap-2">
              <p className="font-mono-label text-muted-foreground">BW</p>
              <div className="col-span-2 w-28 sm:w-36">
                <GlassInput
                  id="rank-bw-input"
                  placeholder="kg"
                  value={f.bw}
                  onChange={upd('bw')}
                  min={40}
                  max={250}
                  step={0.5}
                  label="Bodyweight"
                  onFocus={() => onFieldFocus?.('bw')}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={advanceToLifts}
              disabled={!bwValid}
              className="mt-5 w-full cursor-pointer bg-accent/90 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next: Enter lifts
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* ── Stage 2: Lifts ── */}
        {stage === 'lifts' && (
          <motion.div
            key="lifts"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
          >
            <p className="text-sm text-muted-foreground mb-4">
              Enter at least one lift above 20kg. The more data, the sharper the read.
            </p>
            <div className="space-y-4">
              <LiftRow label="Squat" weightVal={f.sqW} repsVal={f.sqR} onWeight={upd('sqW')} onReps={upd('sqR')} onWeightFocus={() => onFieldFocus?.('sqW')} onRepsFocus={() => onFieldFocus?.('sqR')} />
              {mode === 'gym' && (
                <LiftRow label="Bench" weightVal={f.bpW} repsVal={f.bpR} onWeight={upd('bpW')} onReps={upd('bpR')} onWeightFocus={() => onFieldFocus?.('bpW')} onRepsFocus={() => onFieldFocus?.('bpR')} />
              )}
              <LiftRow label="Deadlift" weightVal={f.dlW} repsVal={f.dlR} onWeight={upd('dlW')} onReps={upd('dlR')} onWeightFocus={() => onFieldFocus?.('dlW')} onRepsFocus={() => onFieldFocus?.('dlR')} />
              {mode === 'hybrid' && (
                <div className="grid grid-cols-[56px_1fr_56px] sm:grid-cols-[80px_1fr_72px] items-center gap-2">
                  <p className="font-mono-label text-muted-foreground">5K Run</p>
                  <GlassInput placeholder="min" value={f.runMin} onChange={upd('runMin')} min={12} max={60} label="5K minutes" onFocus={() => onFieldFocus?.('runMin')} />
                  <GlassInput placeholder="sec" value={f.runSec} onChange={upd('runSec')} min={0} max={59} label="5K seconds" onFocus={() => onFieldFocus?.('runSec')} />
                </div>
              )}
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setStage('profile')}
                className="px-4 py-3 rounded-xl text-sm text-muted-foreground transition hover:text-foreground"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                Back
              </button>
              <button
                type="button"
                onClick={advanceToReady}
                disabled={!hasLift}
                className="flex-1 cursor-pointer bg-accent/90 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next: Generate baseline
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Stage 3: Ready to run ── */}
        {stage === 'ready' && (
          <motion.div
            key="ready"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
          >
            <div className="mb-5 rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="font-mono-label text-accent mb-2">System inputs received</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p><span className="text-foreground">{f.bw}kg</span> · {mode === 'gym' ? 'Strength' : 'Hybrid'}</p>
                {parseFloat(f.sqW) > 0 && <p>Squat: <span className="text-foreground">{f.sqW}kg × {f.sqR || '?'}</span></p>}
                {parseFloat(f.bpW) > 0 && <p>Bench: <span className="text-foreground">{f.bpW}kg × {f.bpR || '?'}</span></p>}
                {parseFloat(f.dlW) > 0 && <p>Deadlift: <span className="text-foreground">{f.dlW}kg × {f.dlR || '?'}</span></p>}
                {mode === 'hybrid' && f.runMin && <p>5K: <span className="text-foreground">{f.runMin}:{f.runSec || '00'}</span></p>}
              </div>
            </div>

            {error && <p className="mb-4 font-mono text-xs text-destructive" role="alert">{error}</p>}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStage('lifts')}
                className="px-4 py-3 rounded-xl text-sm text-muted-foreground transition hover:text-foreground"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={onSubmit}
                className="flex-1 cursor-pointer bg-accent text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 group transition-all hover:bg-accent-light"
                style={{ boxShadow: '0 2px 8px rgba(255,255,255,0.08), 0 1px 2px rgba(0,0,0,0.4)' }}
              >
                Run First Read
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <p className="mt-2 text-center font-mono text-xs text-muted-foreground/60">vs. 3,200+ competitive strength athletes</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
