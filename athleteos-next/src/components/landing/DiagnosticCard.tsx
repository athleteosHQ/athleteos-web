'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  flex: 1,
}

const DIAGNOSIS_ROW_ACTIVE: React.CSSProperties = {
  borderColor: 'rgba(255,122,47,0.28)',
  background: 'linear-gradient(90deg, rgba(255,122,47,0.12), rgba(255,255,255,0.03))',
  borderRadius: 16,
  padding: '14px 16px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  flex: 1,
}

const DIAGNOSIS_SHELL: React.CSSProperties = {
  border: '1px solid rgba(255,255,255,0.10)',
  background: 'linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.02))',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
  borderRadius: 26,
  padding: 20,
  display: 'flex',
  flexDirection: 'column',
}

const DIAGNOSIS_METRIC: React.CSSProperties = {
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.03)',
  borderRadius: 16,
  padding: 14,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  flex: 1,
  minHeight: 76,
}

type Scenario = {
  tag: string
  title: string
  activeRow: {
    label: string
    value: string
    barPct: number
    badDots: number
    goodDots: number
    dotLabel: string
  }
  row2: { label: string; value: string; valueClass: string; subtext: string }
  row3: { label: string; value: string; valueClass: string; subtext: string }
  reason: string
  desc: string
  match: string
  metricLabel: string
  metricValue: string
  metricSub: string
}

const SCENARIOS: Scenario[] = [
  // ─── 1. Recovery Deficit — makes invisible visible ───────────────────────────
  {
    tag: 'Live diagnosis · Week 4 · Accumulated load',
    title: 'Training in a fatigued state — 41/100 recovery',
    activeRow: {
      label: 'HRV vs your 90-day baseline',
      value: '−31%',
      barPct: 31,
      badDots: 5,
      goodDots: 2,
      dotLabel: '5 of 7 days below recovery threshold',
    },
    row2: {
      label: 'Sleep debt this training block',
      value: '4h 20m',
      valueClass: 'text-warning',
      subtext: 'Averaging 3.7h below target per night',
    },
    row3: {
      label: 'Consecutive high-load days',
      value: '6 days',
      valueClass: 'text-destructive',
      subtext: 'Safe ceiling for your profile: 3–4 days',
    },
    reason: 'Accumulated fatigue block',
    desc: 'Progressive overreach without adequate recovery window.',
    match: '91%',
    metricLabel: 'Recovery',
    metricValue: '41',
    metricSub: '/ 100 score',
  },

  // ─── 2. Near-Breakthrough Signal — hope + focus ───────────────────────────────
  {
    tag: 'Live diagnosis · Week 11 · Peaking block',
    title: 'Top 10% strength in 6 weeks — if one gap closes',
    activeRow: {
      label: 'Sleep on heavy days vs threshold',
      value: '−82 min',
      barPct: 68,
      badDots: 5,
      goodDots: 1,
      dotLabel: '5 of 6 heavy days below recovery floor',
    },
    row2: {
      label: 'Current percentile rank',
      value: 'Top 18%',
      valueClass: 'text-accent-light',
      subtext: 'Gap to top 10%: 2 competition lifts',
    },
    row3: {
      label: 'Adaptation rate (8-week)',
      value: '+0.3%/wk',
      valueClass: 'text-warning',
      subtext: 'Expected with full recovery: +1.1%/wk',
    },
    reason: 'Sleep-limited peak',
    desc: 'Recovery debt is capping adaptation — you\'re 6 weeks out.',
    match: '89%',
    metricLabel: 'ETA top 10%',
    metricValue: '6 wks',
    metricSub: 'if recovery closes',
  },

  // ─── 3. Effort Inefficiency — reframes wasted work ───────────────────────────
  {
    tag: 'Live diagnosis · Week 8 · Volume phase',
    title: '46% of your training isn\'t adapting you',
    activeRow: {
      label: 'Sessions below adaptation threshold',
      value: '46%',
      barPct: 46,
      badDots: 5,
      goodDots: 4,
      dotLabel: '5 of 9 sessions generating no stimulus',
    },
    row2: {
      label: 'Intensity distribution',
      value: '68% low',
      valueClass: 'text-warning',
      subtext: 'Polarised split needed: 80% easy / 20% hard',
    },
    row3: {
      label: 'Strength delta vs volume input',
      value: '+0.4%',
      valueClass: 'text-destructive',
      subtext: 'Volume is 3× optimal — strength barely moved',
    },
    reason: 'Training distribution mismatch',
    desc: 'High volume masking low quality — adaptation is stalling.',
    match: '88%',
    metricLabel: 'Wasted load',
    metricValue: '46%',
    metricSub: 'per week',
  },
]

const FADE = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
  transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
}

export function DiagnosticCard() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % SCENARIOS.length), 4500)
    return () => clearInterval(t)
  }, [])

  const s = SCENARIOS[idx]

  return (
    <>
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
        <AnimatePresence mode="wait">
          <motion.div key={`hdr-${idx}`} {...FADE} className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent-light">
                {s.tag}
              </p>
              <h2 className="mt-2 text-xl font-bold tracking-tight text-foreground leading-snug">
                {s.title}
              </h2>
            </div>
            <div
              className="flex items-center gap-2 flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium text-accent-light"
              style={{ border: '1px solid rgba(255,122,47,0.20)', background: 'rgba(255,122,47,0.10)' }}
            >
              <span style={SIGNAL_DOT_STYLE} />
              Signal locked
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Body grid */}
        <AnimatePresence mode="wait">
          <motion.div key={`body-${idx}`} {...FADE} className="mt-6 grid gap-4 sm:grid-cols-[1fr_1fr] items-stretch">

            {/* Left: signal rows */}
            <div className="flex flex-col gap-3">

              {/* Active row */}
              <div style={DIAGNOSIS_ROW_ACTIVE}>
                <div className="flex items-start justify-between gap-3 text-sm text-foreground/80">
                  <span className="min-w-0">{s.activeRow.label}</span>
                  <span className="font-mono flex-shrink-0 text-accent-light font-bold">{s.activeRow.value}</span>
                </div>
                <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className="h-full rounded-full bg-accent" style={{ width: `${s.activeRow.barPct}%` }} />
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex gap-1">
                    {Array.from({ length: s.activeRow.badDots }).map((_, i) => (
                      <span key={i} className="w-2.5 h-2.5 rounded-full bg-destructive" />
                    ))}
                    {Array.from({ length: s.activeRow.goodDots }).map((_, i) => (
                      <span key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(45,220,143,0.6)' }} />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{s.activeRow.dotLabel}</span>
                </div>
              </div>

              {/* Row 2 */}
              <div style={DIAGNOSIS_ROW}>
                <div className="flex items-start justify-between gap-3 text-sm text-foreground/80">
                  <span className="min-w-0">{s.row2.label}</span>
                  <span className={`font-mono flex-shrink-0 font-bold ${s.row2.valueClass}`}>{s.row2.value}</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{s.row2.subtext}</p>
              </div>

              {/* Row 3 */}
              <div style={DIAGNOSIS_ROW}>
                <div className="flex items-start justify-between gap-3 text-sm text-foreground/80">
                  <span className="min-w-0">{s.row3.label}</span>
                  <span className={`font-mono flex-shrink-0 font-bold ${s.row3.valueClass}`}>{s.row3.value}</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{s.row3.subtext}</p>
              </div>
            </div>

            {/* Right: diagnosis shell */}
            <div style={DIAGNOSIS_SHELL}>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent-light">Diagnosis</p>

              <div
                className="mt-3 rounded-2xl p-3 flex flex-col"
                style={{ border: '1px solid rgba(255,122,47,0.20)', background: 'rgba(255,122,47,0.08)', flex: '1 1 auto' }}
              >
                <p className="text-xs text-muted-foreground">Primary reason</p>
                <p className="mt-1.5 text-lg font-bold leading-tight tracking-tight text-foreground">
                  {s.reason}
                </p>
                <p className="mt-2 text-xs leading-5 text-foreground/70">{s.desc}</p>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div style={DIAGNOSIS_METRIC}>
                  <p className="text-[0.68rem] text-muted-foreground">Match</p>
                  <p className="font-mono text-2xl font-bold text-foreground">{s.match}</p>
                </div>
                <div style={DIAGNOSIS_METRIC}>
                  <p className="text-[0.68rem] text-muted-foreground">{s.metricLabel}</p>
                  <p className="font-mono text-2xl font-bold text-accent-light">{s.metricValue}</p>
                  <p className="text-[0.6rem] text-muted-foreground leading-tight">{s.metricSub}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Scenario indicator */}
        <div className="mt-5 flex justify-center gap-2">
          {SCENARIOS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className="transition-all duration-300"
              style={{
                width: i === idx ? 20 : 6,
                height: 6,
                borderRadius: 999,
                background: i === idx ? 'var(--accent)' : 'rgba(255,255,255,0.15)',
                border: 'none',
                cursor: 'pointer',
              }}
              aria-label={`Show insight ${i + 1}`}
            />
          ))}
        </div>
      </motion.div>
    </>
  )
}
