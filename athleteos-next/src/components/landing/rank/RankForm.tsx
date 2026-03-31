'use client'

import { ArrowRight } from 'lucide-react'
import { GlassInput, LiftRow } from './SystemInput'
import { type AthleteMode } from '../ModeSelector'

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
}

export function RankForm({ mode, fields: f, onFieldChange: upd, onSubmit, error }: RankFormProps) {
  return (
    <div className="surface-card p-6 sm:p-8">
      <div className="space-y-4">
        <div className="grid grid-cols-[80px_1fr_72px] items-center gap-2">
          <p className="font-mono-label text-muted-foreground">BW</p>
          <div className="col-span-2 w-36">
            <GlassInput
              id="rank-bw-input"
              placeholder="kg"
              value={f.bw}
              onChange={upd('bw')}
              min={40}
              max={250}
              step={0.5}
              label="Bodyweight"
            />
          </div>
        </div>
        <LiftRow label="Squat"    weightVal={f.sqW} repsVal={f.sqR} onWeight={upd('sqW')} onReps={upd('sqR')} />
        {mode === 'gym' ? (
          <LiftRow label="Bench" weightVal={f.bpW} repsVal={f.bpR} onWeight={upd('bpW')} onReps={upd('bpR')} />
        ) : null}
        <LiftRow label="Deadlift" weightVal={f.dlW} repsVal={f.dlR} onWeight={upd('dlW')} onReps={upd('dlR')} />
        {mode === 'hybrid' && (
          <div className="grid grid-cols-[80px_1fr_72px] items-center gap-2">
            <p className="font-mono-label text-muted-foreground">5K Run</p>
            <GlassInput placeholder="min" value={f.runMin} onChange={upd('runMin')} min={12} max={60} label="5K minutes" />
            <GlassInput placeholder="sec" value={f.runSec} onChange={upd('runSec')} min={0} max={59} label="5K seconds" />
          </div>
        )}
        {mode === 'hybrid' && (
          <p className="mt-2 text-xs text-muted-foreground">Hybrid mode measures squat + deadlift strength against endurance.</p>
        )}
      </div>

      {error && <p className="mt-4 font-mono text-xs text-destructive" role="alert">{error}</p>}

      <button
        onClick={onSubmit}
        className="mt-6 w-full cursor-pointer bg-accent text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 group transition-all hover:bg-accent-light"
        style={{ boxShadow: '0 2px 8px rgba(107,122,237,0.25), 0 1px 2px rgba(0,0,0,0.4)' }}
      >
        See My Rank
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
      <p className="mt-2 text-center font-mono text-[11px] text-muted-foreground/60">vs. 3,200+ competitive strength athletes</p>
    </div>
  )
}
