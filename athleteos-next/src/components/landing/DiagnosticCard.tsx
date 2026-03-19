'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SIGNAL_DOT: React.CSSProperties = {
  width: 7,
  height: 7,
  borderRadius: 999,
  background: '#7FB2FF',
  boxShadow: '0 0 0 4px rgba(127,178,255,0.15)',
  animation: 'orbitPulse 2.2s ease-in-out infinite',
  flexShrink: 0,
}

type Scenario = {
  tag: string
  title: string
  eyebrow: string
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
  {
    tag: 'SAMPLE_DIAGNOSIS · WK_04 · ACCUMULATED_LOAD',
    title: 'Training in a fatigued state — 41/100 recovery',
    eyebrow: 'Primary signal',
    activeRow: {
      label: 'HRV vs your 90-day baseline',
      value: '−31%',
      barPct: 31,
      badDots: 5,
      goodDots: 2,
      dotLabel: '5 of 7 days below threshold',
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
  {
    tag: 'SAMPLE_DIAGNOSIS · WK_11 · PEAKING_BLOCK',
    title: 'Top 10% strength in 6 weeks — if one gap closes',
    eyebrow: 'Primary signal',
    activeRow: {
      label: 'Sleep on heavy days vs threshold',
      value: '−82 min',
      barPct: 68,
      badDots: 5,
      goodDots: 1,
      dotLabel: '5 of 6 heavy days below floor',
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
    desc: 'Recovery debt is capping adaptation — 6 weeks out.',
    match: '89%',
    metricLabel: 'ETA top 10%',
    metricValue: '6 wks',
    metricSub: 'if recovery closes',
  },
  {
    tag: 'SAMPLE_DIAGNOSIS · WK_08 · VOLUME_PHASE',
    title: '46% of your training isn\'t adapting you',
    eyebrow: 'Primary signal',
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
      subtext: 'Polarised split: 80% easy / 20% hard',
    },
    row3: {
      label: 'Strength delta vs volume input',
      value: '+0.4%',
      valueClass: 'text-destructive',
      subtext: 'Volume is 3× optimal — strength barely moved',
    },
    reason: 'Training distribution mismatch',
    desc: 'High volume masking low quality — adaptation stalling.',
    match: '88%',
    metricLabel: 'Wasted load',
    metricValue: '46%',
    metricSub: 'per week',
  },
]

const FADE = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -6 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
}

const ROW_DIVIDER = '1px solid rgba(255,255,255,0.07)'
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
          50%       { transform: scale(1.15); opacity: 1; }
        }
      `}</style>

      <motion.div
        className="hero-card w-full max-w-[38rem] p-6 sm:p-7"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      >
        {/* Header */}
        <AnimatePresence mode="wait">
          <motion.div key={`hdr-${idx}`} {...FADE} className="mb-5">
            <div className="flex items-center gap-2 mb-2.5">
              <span style={SIGNAL_DOT} />
              <p className="font-mono-label text-[11px] text-accent-light/80 leading-none">
                {s.tag}
              </p>
            </div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground leading-snug">
              {s.title}
            </h2>
          </motion.div>
        </AnimatePresence>

        {/* Body — simpler editorial split */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`body-${idx}`}
            {...FADE}
            className="grid gap-6 md:grid-cols-[1.06fr_0.94fr] md:gap-6"
          >
            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="font-mono-label text-muted-foreground/70">{s.eyebrow}</p>
                <span className="font-mono-label text-sm font-bold text-accent-light">{s.activeRow.value}</span>
              </div>
              <div
                className="rounded-2xl px-4 py-4"
                style={{
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.02)',
                }}
              >
                <p className="mb-2 text-xs font-medium leading-tight text-foreground/80">{s.activeRow.label}</p>
                <div className="h-1 rounded-full overflow-hidden mb-2" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <motion.div
                    className="h-full rounded-full bg-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${s.activeRow.barPct}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5">
                    {Array.from({ length: s.activeRow.badDots }).map((_, i) => (
                      <span key={i} className="w-1.5 h-1.5 rounded-full bg-destructive" />
                    ))}
                    {Array.from({ length: s.activeRow.goodDots }).map((_, i) => (
                      <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(45,220,143,0.55)' }} />
                    ))}
                  </div>
                  <span className="font-mono-label text-[10px] text-muted-foreground leading-none">{s.activeRow.dotLabel}</span>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="rounded-xl border px-4 py-3.5" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.015)' }}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-3">
                    <span className="text-[11px] font-medium leading-tight text-foreground/70">{s.row2.label}</span>
                    <span className={`font-mono-label text-sm font-bold ${s.row2.valueClass}`}>{s.row2.value}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-muted-foreground">{s.row2.subtext}</p>
                </div>
                <div className="rounded-xl border px-4 py-3.5" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.015)' }}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-3">
                    <span className="text-[11px] font-medium leading-tight text-foreground/70">{s.row3.label}</span>
                    <span className={`font-mono-label text-sm font-bold ${s.row3.valueClass}`}>{s.row3.value}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-muted-foreground">{s.row3.subtext}</p>
                </div>
              </div>
            </div>

            <div
              className="rounded-2xl border px-4 py-4 sm:px-5"
              style={{ borderColor: 'rgba(127,178,255,0.16)', background: 'linear-gradient(180deg, rgba(127,178,255,0.06), rgba(255,255,255,0.015))' }}
            >
              <p className="mb-4 font-mono-label text-[11px] text-accent-light">
                Diagnosis
              </p>

              <div className="pb-4" style={{ borderBottom: ROW_DIVIDER }}>
                <p className="mb-1 font-mono-label text-[10px] text-muted-foreground">Primary reason</p>
                <p className="mb-1.5 text-sm font-bold leading-tight tracking-tight text-foreground">
                  {s.reason}
                </p>
                <p className="text-[11px] leading-[1.5] text-foreground/70">{s.desc}</p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border px-3 py-3" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(7,13,20,0.28)' }}>
                  <p className="mb-0.5 font-mono-label text-[10px] text-muted-foreground">Match</p>
                  <p className="font-display text-2xl font-bold text-foreground">{s.match}</p>
                </div>
                <div className="rounded-xl border px-3 py-3" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(7,13,20,0.28)' }}>
                  <p className="mb-0.5 font-mono-label text-[10px] text-muted-foreground">{s.metricLabel}</p>
                  <p className="font-display text-2xl font-bold leading-none text-accent-light">{s.metricValue}</p>
                  <p className="mt-0.5 font-mono-label text-[10px] text-muted-foreground">{s.metricSub}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Scenario dots */}
        <div
          className="mt-4 flex items-center gap-1.5"
          style={{ borderTop: ROW_DIVIDER, paddingTop: '10px' }}
        >
          {SCENARIOS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className="transition-all duration-300"
              style={{
                width: i === idx ? 18 : 5,
                height: 5,
                borderRadius: 999,
                background: i === idx ? 'var(--accent)' : 'rgba(255,255,255,0.14)',
                border: 'none',
                cursor: 'pointer',
              }}
              aria-label={`Show insight ${i + 1}`}
            />
          ))}
          <span className="ml-auto font-mono text-[10px] text-muted-foreground/40">
            {idx + 1}/{SCENARIOS.length}
          </span>
        </div>
      </motion.div>
    </>
  )
}
