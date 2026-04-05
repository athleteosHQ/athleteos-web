'use client'

import React from 'react'

import type { RankResult } from '@/lib/rankCalc'

import {
  STORY_CARD_HEIGHT,
  STORY_CARD_WIDTH,
} from './storyShareConfig'

const BG = '#09090B'
const SURFACE = '#0D1117'
const ACCENT = '#2DDC8F'

export const StoryShareCard = React.forwardRef<
  HTMLDivElement,
  {
    result: RankResult
    founderLabel: string
    cohortLabel: string
    diagnosisLabel: string
    diagnosisHeadline: string
  }
>(function StoryShareCard(
  { result, founderLabel, cohortLabel, diagnosisLabel, diagnosisHeadline },
  ref,
) {
  const topPercent = Math.max(1, 100 - result.overallPct)

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        left: -9999,
        top: -9999,
        width: STORY_CARD_WIDTH,
        height: STORY_CARD_HEIGHT,
        background: BG,
        display: 'flex',
        flexDirection: 'column',
        padding: '84px 72px',
        boxSizing: 'border-box',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        zIndex: -1,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at top right, rgba(255,255,255,0.1), rgba(9,9,11,0) 32%), radial-gradient(circle at bottom left, rgba(45,220,143,0.08), rgba(9,9,11,0) 28%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: -120,
          right: -140,
          width: 560,
          height: 560,
          borderRadius: 999,
          border: '1px solid rgba(255,255,255,0.06)',
          opacity: 0.45,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 260,
          left: -120,
          width: 420,
          height: 420,
          borderRadius: 999,
          border: '1px solid rgba(255,255,255,0.05)',
          opacity: 0.35,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: '#fff',
              boxShadow: '0 0 20px rgba(255,255,255,0.24)',
            }}
          />
          <div style={{ display: 'flex', fontSize: 44, fontWeight: 800, letterSpacing: -1.2, color: '#fff' }}>
            <span>athlete</span>
            <span style={{ color: 'rgba(255,255,255,0.55)' }}>OS</span>
          </div>
        </div>

        <div style={{ marginTop: 72, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 18, color: 'rgba(255,255,255,0.4)', letterSpacing: 4, textTransform: 'uppercase' }}>
            Performance Read
          </div>
          <div style={{ fontSize: 124, lineHeight: 0.92, fontWeight: 900, letterSpacing: -6, color: '#fff' }}>
            TOP {topPercent}%
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 24, color: result.tierColor, letterSpacing: 3, textTransform: 'uppercase' }}>
            {result.tier} Tier · India
          </div>
          <div style={{ maxWidth: 760, fontSize: 34, lineHeight: 1.25, color: 'rgba(255,255,255,0.7)' }}>
            Ahead of {result.overallPct}% of athletes in your weight class.
          </div>
        </div>

        <div
          style={{
            marginTop: 64,
            borderRadius: 32,
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.03)',
            padding: '32px 34px',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          <div style={{ fontFamily: 'monospace', fontSize: 18, color: ACCENT, letterSpacing: 3, textTransform: 'uppercase' }}>
            {diagnosisLabel}
          </div>
          <div style={{ fontSize: 50, lineHeight: 1.14, fontWeight: 800, letterSpacing: -1.8, color: '#fff' }}>
            {diagnosisHeadline}
          </div>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderRadius: 28,
              border: '1px solid rgba(255,255,255,0.08)',
              background: SURFACE,
              padding: '24px 28px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontFamily: 'monospace', fontSize: 16, color: 'rgba(255,255,255,0.4)', letterSpacing: 3, textTransform: 'uppercase' }}>
                Status
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: -1, color: '#fff' }}>
                {founderLabel}
              </div>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: 22, color: 'rgba(255,255,255,0.7)', letterSpacing: 2, textTransform: 'uppercase' }}>
              {cohortLabel}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontFamily: 'monospace',
              fontSize: 24,
              letterSpacing: 2,
              color: 'rgba(255,255,255,0.58)',
            }}
          >
            <span>Check yours at</span>
            <span style={{ color: '#fff', fontWeight: 700 }}>athleteos.io</span>
          </div>
        </div>
      </div>
    </div>
  )
})
