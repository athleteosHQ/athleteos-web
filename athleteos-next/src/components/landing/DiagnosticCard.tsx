'use client'

import { motion } from 'framer-motion'

const SIGNAL_DOT_STYLE: React.CSSProperties = {
  width: 9,
  height: 9,
  borderRadius: 999,
  background: '#FF7A2F',
  boxShadow: '0 0 0 6px rgba(255,122,47,0.12)',
  animation: 'orbitPulse 2.2s ease-in-out infinite',
  flexShrink: 0,
}

const DIAGNOSIS_ROW: React.CSSProperties = {
  background: 'rgba(4,9,15,0.45)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 16,
  padding: '14px 16px',
}

const DIAGNOSIS_ROW_ACTIVE: React.CSSProperties = {
  borderColor: 'rgba(255,122,47,0.28)',
  background: 'linear-gradient(90deg, rgba(255,122,47,0.12), rgba(255,255,255,0.03))',
  borderRadius: 16,
  padding: '14px 16px',
}

const DIAGNOSIS_SHELL: React.CSSProperties = {
  border: '1px solid rgba(255,255,255,0.10)',
  background: 'linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.02))',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
  borderRadius: 26,
  padding: 20,
}

const DIAGNOSIS_METRIC: React.CSSProperties = {
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.03)',
  borderRadius: 16,
  padding: 14,
  minHeight: 80,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}

export function DiagnosticCard() {
  return (
    <>
      {/* Inject pulse keyframe */}
      <style>{`
        @keyframes orbitPulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50%       { transform: scale(1.08); opacity: 1; }
        }
      `}</style>

      <motion.div
        className="hero-card rounded-[28px] p-6 sm:p-8 max-w-xl w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent-light">
              Live diagnosis · Week 7 · Intensification
            </p>
            <h2 className="mt-2 text-xl font-bold tracking-tight text-foreground leading-snug">
              Squat stalled 14 days despite volume
            </h2>
          </div>
          <div
            className="flex items-center gap-2 flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium text-accent-light"
            style={{ border: '1px solid rgba(255,122,47,0.20)', background: 'rgba(255,122,47,0.10)' }}
          >
            <span style={SIGNAL_DOT_STYLE} />
            Signal locked
          </div>
        </div>

        {/* Body grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_1fr]">

          {/* Left: diagnosis rows */}
          <div className="space-y-3">

            {/* Active row */}
            <div style={DIAGNOSIS_ROW_ACTIVE}>
              <div className="flex items-start justify-between gap-3 text-sm text-foreground/80">
                <span className="min-w-0">Protein on heavy lower days</span>
                <span className="font-mono flex-shrink-0 text-accent-light font-bold">-29g</span>
              </div>
              <div className="mt-3 h-1.5 rounded-full overflow-hidden signal-bar" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div className="h-full w-[72%] rounded-full bg-accent" />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex gap-1">
                  {[0,1,2,3].map(i => (
                    <span key={i} className="w-2.5 h-2.5 rounded-full bg-destructive" />
                  ))}
                  {[0,1,2].map(i => (
                    <span key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(45,220,143,0.6)' }} />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">4 of 7 sessions under target</span>
              </div>
            </div>

            {/* Sleep row */}
            <div style={DIAGNOSIS_ROW}>
              <div className="flex items-start justify-between gap-3 text-sm text-foreground/80">
                <span className="min-w-0">Avg sleep on squat days</span>
                <span className="font-mono flex-shrink-0 font-bold text-warning">5h 48m</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Normal floor: 7h 10m · gap: 82 min</p>
            </div>

            {/* Volume row */}
            <div style={DIAGNOSIS_ROW}>
              <div className="flex items-start justify-between gap-3 text-sm text-foreground/80">
                <span className="min-w-0">Weekly volume trend</span>
                <span className="font-mono flex-shrink-0 font-bold text-destructive">+18%</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Exceeded intensification ceiling.</p>
            </div>
          </div>

          {/* Right: diagnosis result */}
          <div style={DIAGNOSIS_SHELL}>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent-light">Diagnosis</p>

            <div
              className="mt-3 rounded-2xl p-3"
              style={{ border: '1px solid rgba(255,122,47,0.20)', background: 'rgba(255,122,47,0.08)' }}
            >
              <p className="text-xs text-muted-foreground">Primary reason</p>
              <p className="mt-1.5 text-lg font-bold leading-tight tracking-tight text-foreground">
                Under-fuelled heavy sessions
              </p>
              <p className="mt-2 text-xs leading-5 text-foreground/70">
                Heavy-day protein consistently below phase target.
              </p>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div style={DIAGNOSIS_METRIC}>
                <p className="text-[0.68rem] text-muted-foreground">Match</p>
                <p className="font-mono text-2xl font-bold text-foreground">84%</p>
              </div>
              <div style={DIAGNOSIS_METRIC}>
                <p className="text-[0.68rem] text-muted-foreground">Trial</p>
                <p className="font-mono text-2xl font-bold text-foreground">₹199</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
