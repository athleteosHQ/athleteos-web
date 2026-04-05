'use client'

import React from 'react'
import type { RankResult } from '@/lib/rankCalc'

// ── Off-screen card rendered at 1080×1080 for html2canvas capture ─────────────
// All styles are inline (no CSS vars, no Tailwind) so html2canvas can capture them.

const BG = '#070D14'
const ACCENT = '#5E6AD2'

function Bar({ label, pct, est1rm, color }: { label: string; pct: number; est1rm: number; color: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontFamily: 'monospace', fontSize: 18, color: 'rgba(255,255,255,0.7)', letterSpacing: 1 }}>
          {label.toUpperCase()}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {est1rm > 0 && (
            <span style={{ fontFamily: 'monospace', fontSize: 15, color: 'rgba(255,255,255,0.35)' }}>
              {est1rm.toFixed(0)}kg
            </span>
          )}
          <span style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 700, color }}>
            {est1rm > 0 ? `TOP ${100 - pct}%` : '—'}
          </span>
        </div>
      </div>
      <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, borderRadius: 4, background: color }} />
      </div>
    </div>
  )
}

export const RankShareCard = React.forwardRef<
  HTMLDivElement,
  { result: RankResult; founderLabel: string; badgeLabel: string; diagnosisLabel: string; diagnosisHeadline: string }
>(
  function RankShareCard({ result, founderLabel, badgeLabel, diagnosisLabel, diagnosisHeadline }, ref) {
    const tierUpper = result.tier.toUpperCase()
    const top = 100 - result.overallPct
    const score = result.athleteScore
    const circumference = 2 * Math.PI * 54
    const dashOffset = circumference - (score / 100) * circumference

    return (
      <div
        ref={ref}
        style={{
          position: 'fixed',
          left: -9999,
          top: -9999,
          width: 1080,
          height: 1080,
          background: BG,
          display: 'flex',
          flexDirection: 'column',
          padding: '80px 88px',
          boxSizing: 'border-box',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          zIndex: -1,
        }}
      >
        {/* Top bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: `linear-gradient(90deg, ${ACCENT}, #D8E7FF, ${ACCENT})`,
          }}
        />

        {/* Header row: logo + tagline */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 64 }}>
          <div>
            <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1, color: '#fff' }}>
              athlete<span style={{ color: ACCENT }}>OS</span>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: 14, color: 'rgba(255,255,255,0.3)', letterSpacing: 3, marginTop: 4 }}>
              EARLY ATHLETE PERFORMANCE CARD
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
            <div
              style={{
                border: `1px solid ${ACCENT}33`,
                background: `${ACCENT}10`,
                borderRadius: 999,
                padding: '8px 16px',
                fontFamily: 'monospace',
                fontSize: 14,
                fontWeight: 700,
                color: '#D8E7FF',
                letterSpacing: 2,
              }}
            >
              {badgeLabel.toUpperCase()}
            </div>
            <div
              style={{
                border: `1px solid ${result.tierColor}44`,
                background: `${result.tierColor}12`,
                borderRadius: 12,
                padding: '10px 20px',
              }}
            >
              <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'rgba(255,255,255,0.4)', letterSpacing: 2 }}>WEIGHT CLASS</div>
              <div style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 700, color: '#fff', marginTop: 2 }}>{result.weightClass}</div>
            </div>
          </div>
        </div>

        {/* Center: percentile + tier */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 64, marginBottom: 72 }}>
          {/* Percentile ring */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <svg width={140} height={140} viewBox="0 0 128 128">
              <circle cx={64} cy={64} r={54} stroke="rgba(255,255,255,0.08)" strokeWidth={10} fill="none" />
              <circle
                cx={64} cy={64} r={54}
                stroke={result.tierColor}
                strokeWidth={10}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '64px 64px' }}
              />
            </svg>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ fontFamily: 'monospace', fontSize: 36, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{score}</div>
              <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: 2, marginTop: 2 }}>SIGNAL</div>
            </div>
          </div>

          {/* Percentile + tier */}
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: 13, color: result.tierColor, letterSpacing: 4, marginBottom: 8 }}>
              INDIA PERCENTILE
            </div>
            <div
              style={{
                fontSize: 72,
                fontWeight: 900,
                color: '#fff',
                lineHeight: 0.9,
                letterSpacing: -3,
              }}
            >
              TOP {top}%
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: 18, color: 'rgba(255,255,255,0.62)', marginTop: 16, letterSpacing: 1 }}>
              {tierUpper} TIER · INDIA
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: 14, color: 'rgba(255,255,255,0.34)', marginTop: 10, letterSpacing: 1.4 }}>
              Ahead of {result.overallPct}% of athletes in your class
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: 14, color: '#D8E7FF', marginTop: 12, letterSpacing: 1.4 }}>
              {founderLabel.toUpperCase()}
            </div>
          </div>
        </div>

        <div
          style={{
            marginBottom: 32,
            borderRadius: 24,
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.03)',
            padding: '24px 26px',
          }}
        >
          <div style={{ fontFamily: 'monospace', fontSize: 13, color: ACCENT, letterSpacing: 3, marginBottom: 14 }}>
            {diagnosisLabel.toUpperCase()}
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#fff', lineHeight: 1.2, letterSpacing: -0.8 }}>
            {diagnosisHeadline}
          </div>
        </div>

        {/* Lift bars */}
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'rgba(255,255,255,0.3)', letterSpacing: 3, marginBottom: 24 }}>
            LIFT BREAKDOWN
          </div>
          {result.squat.estimated1RM > 0 && (
            <Bar label="Squat" pct={result.squat.percentile} est1rm={result.squat.estimated1RM} color="#5E6AD2" />
          )}
          {result.bench.estimated1RM > 0 && (
            <Bar label="Bench" pct={result.bench.percentile} est1rm={result.bench.estimated1RM} color="rgba(255,255,255,0.5)" />
          )}
          {result.deadlift.estimated1RM > 0 && (
            <Bar label="Deadlift" pct={result.deadlift.percentile} est1rm={result.deadlift.estimated1RM} color="#EF4444" />
          )}
          {result.run5k && (
            <Bar label="5K Run" pct={result.run5k.percentile} est1rm={1} color="#2DDC8F" />
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.07)',
            paddingTop: 28,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontFamily: 'monospace', fontSize: 14, color: 'rgba(255,255,255,0.25)', letterSpacing: 2 }}>
            COMPETITION-CALIBRATED · 3,200+ ATHLETES
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 700, color: ACCENT, letterSpacing: 1 }}>
            athleteos.io
          </div>
        </div>
      </div>
    )
  }
)
