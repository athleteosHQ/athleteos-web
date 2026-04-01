'use client'

import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import { type AthleteMode } from '../ModeSelector'

const GYM_BARS = [
  { label: 'Squat',    color: '#6B7AED', pct: 78 },
  { label: 'Bench',    color: '#F59E0B', pct: 55 },
  { label: 'Deadlift', color: '#EF4444', pct: 84 },
]

const HYBRID_BARS = [
  { label: 'Squat',    color: '#6B7AED', pct: 78 },
  { label: 'Deadlift', color: '#EF4444', pct: 84 },
  { label: '5K Run',   color: '#2DDC8F', pct: 62 },
]

export function GhostTierPreview({ mode }: { mode: AthleteMode }) {
  const GHOST_BARS = mode === 'gym' ? GYM_BARS : HYBRID_BARS

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative"
    >
      {/* Ghost content — visible through overlay */}
      <div className="surface-card overflow-hidden p-6">
        <div className="flex items-center gap-2 mb-5">
          <Activity className="w-3 h-3 text-accent" />
          <p className="font-mono-label text-muted-foreground">System Output</p>
        </div>

        {/* Ghost score circle + tier */}
        <div className="flex items-center gap-4 mb-5" style={{ filter: 'blur(5px)', userSelect: 'none' }}>
          <div
            className="relative flex-shrink-0 w-20 h-20 rounded-full"
            style={{
              background: 'conic-gradient(#5E6AD2 0deg 270deg, rgba(255,255,255,0.06) 270deg 360deg)',
            }}
          >
            <div
              className="absolute inset-2 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(5,5,6,0.92)' }}
            >
              <span className="font-display text-xl font-bold text-accent">74</span>
            </div>
          </div>
          <div>
            <p className="font-mono-label text-accent mb-0.5">Benchmark rank</p>
            <p className="font-display text-2xl font-bold text-foreground">ADVANCED</p>
            <p className="text-xs text-muted-foreground mt-0.5">Top 22% of competitive strength athletes</p>
          </div>
        </div>

        {/* Ghost bars */}
        <div className="space-y-4" style={{ filter: 'blur(3px)', userSelect: 'none' }}>
          {GHOST_BARS.map(bar => (
            <div key={bar.label}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-foreground text-xs">{bar.label}</span>
                <span className="font-mono text-xs font-bold" style={{ color: bar.color }}>
                  Top {100 - bar.pct}%
                </span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${bar.pct}%`, background: bar.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Overlay */}
      <div
        className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-3 p-6 text-center"
        style={{ background: 'linear-gradient(180deg, rgba(5,5,6,0.5) 0%, rgba(5,5,6,0.85) 100%)', backdropFilter: 'blur(2px)' }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(107,122,237,0.12)', border: '1px solid rgba(107,122,237,0.26)', boxShadow: '0 0 20px rgba(94,106,210,0.15)' }}
        >
          <Activity className="w-5 h-5 text-accent" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground mb-1">Your diagnosis will appear here</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Enter your lifts to see your percentile within our competitive athlete benchmark
          </p>
        </div>
        <div className="flex gap-3 flex-wrap justify-center">
          {['Competition-calibrated', '3,200+ competitive athletes'].map(t => (
            <span key={t} className="font-mono-label text-muted-foreground/60" style={{ fontSize: '10px' }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
