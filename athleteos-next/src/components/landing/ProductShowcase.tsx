'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

/* ── Weekly recovery data (7 days) ────────────────────────────────── */
const WEEK = [
  { day: 'M', score: 38, below: true },
  { day: 'T', score: 42, below: true },
  { day: 'W', score: 61, below: false },
  { day: 'T', score: 35, below: true },
  { day: 'F', score: 44, below: true },
  { day: 'S', score: 52, below: true },
  { day: 'S', score: 67, below: false },
]

/* ── iOS status bar ───────────────────────────────────────────────── */
function StatusBar() {
  return (
    <div className="relative flex items-center justify-between px-7 pb-1 pt-3">
      <span className="text-[13px] font-semibold text-white" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>9:41</span>
      {/* Dynamic Island */}
      <div
        className="absolute left-1/2 top-[5px] -translate-x-1/2 rounded-full bg-black"
        style={{ width: 120, height: 34 }}
      />
      <div className="flex items-center gap-[5px]">
        {/* Cellular */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          <rect x="0" y="8" width="3" height="4" rx="0.7" fill="white" opacity="0.4"/>
          <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.7" fill="white" opacity="0.6"/>
          <rect x="9" y="3" width="3" height="9" rx="0.7" fill="white" opacity="0.8"/>
          <rect x="13.5" y="0" width="3" height="12" rx="0.7" fill="white"/>
        </svg>
        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="white">
          <path d="M8 10.2a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8z"/>
          <path d="M4.9 8.1a4.4 4.4 0 0 1 6.2 0" stroke="white" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
          <path d="M2.4 5.6a7.8 7.8 0 0 1 11.2 0" stroke="white" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.7"/>
          <path d="M0.2 3.1a11.2 11.2 0 0 1 15.6 0" stroke="white" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.4"/>
        </svg>
        {/* Battery */}
        <div className="flex items-center">
          <div className="relative rounded-[3px]" style={{ width: 25, height: 12, border: '1.2px solid rgba(255,255,255,0.45)' }}>
            <div className="absolute left-[1.5px] top-[1.5px] bottom-[1.5px] rounded-[1.5px] bg-white" style={{ right: 4 }}/>
          </div>
          <div className="rounded-r-[1px]" style={{ width: 2, height: 5, background: 'rgba(255,255,255,0.4)', marginLeft: 1 }}/>
        </div>
      </div>
    </div>
  )
}

/* ── Main export ──────────────────────────────────────────────────── */
export function ProductShowcase() {
  const [barsIn, setBarsIn] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setBarsIn(true), 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="relative w-full max-w-[280px] py-3 sm:max-w-[340px] sm:py-6 lg:py-0">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto"
      >
        {/* ── Phone shell ──────────────────────────────────────────── */}
        <div
          className="rounded-[3rem] p-[2.5px]"
          style={{
            background: 'linear-gradient(160deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.03) 100%)',
            boxShadow: [
              '0 50px 100px rgba(0,0,0,0.55)',
              '0 0 0 0.5px rgba(255,255,255,0.06)',
              'inset 0 1px 0 rgba(255,255,255,0.15)',
            ].join(', '),
          }}
        >
          <div
            className="flex flex-col overflow-hidden rounded-[2.75rem]"
            style={{ background: '#000000' }}
          >
            <StatusBar />

            {/* ── App content ───────────────────────────────────────── */}
            <div className="px-5 pb-2 pt-1" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>

              {/* Large title — iOS style */}
              <h3 className="text-[26px] font-bold leading-tight tracking-[-0.02em] text-white mb-0.5">
                Diagnosis
              </h3>
              <p className="text-[13px] text-white/40 mb-4">
                Week 11 · Intensification block
              </p>

              {/* ── Recovery score card ─────────────────────────────── */}
              <div
                className="rounded-2xl p-4 mb-3"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-[11px] font-medium text-white/45 mb-1 tracking-wide uppercase">Recovery Score</p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[36px] font-bold text-white leading-none tracking-tight">41</span>
                      <span className="text-[14px] font-medium text-white/30">/100</span>
                    </div>
                  </div>
                  {/* Circular progress ring */}
                  <div className="relative" style={{ width: 52, height: 52 }}>
                    <svg width="52" height="52" viewBox="0 0 52 52">
                      <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4"/>
                      <circle
                        cx="26" cy="26" r="22"
                        fill="none"
                        stroke="#E24B4A"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 22 * 0.41} ${2 * Math.PI * 22 * 0.59}`}
                        transform="rotate(-90 26 26)"
                        style={{ transition: 'stroke-dasharray 0.8s ease-out' }}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-destructive">Low</span>
                  </div>
                </div>

                {/* Weekly dots */}
                <div className="flex items-end gap-[6px]">
                  {WEEK.map((d, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 flex-1">
                      <motion.div
                        className="w-full rounded-[3px]"
                        style={{
                          background: d.below
                            ? 'linear-gradient(180deg, #E24B4A, rgba(226,75,74,0.2))'
                            : 'linear-gradient(180deg, #2DDC8F, rgba(45,220,143,0.2))',
                        }}
                        initial={{ height: 0 }}
                        animate={{ height: barsIn ? d.score * 0.45 : 0 }}
                        transition={{ duration: 0.4, delay: 0.06 * i, ease: 'easeOut' }}
                      />
                      <span className="text-[9px] text-white/30 font-medium">{d.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Primary finding ─────────────────────────────────── */}
              <div
                className="rounded-2xl p-3.5 mb-3"
                style={{ background: 'rgba(226,75,74,0.08)', border: '1px solid rgba(226,75,74,0.15)' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="h-[7px] w-[7px] rounded-full bg-destructive flex-shrink-0"
                    style={{ boxShadow: '0 0 0 3px rgba(226,75,74,0.15)' }}
                  />
                  <p className="text-[10px] font-semibold text-destructive/80 tracking-wide uppercase">Blocker Found</p>
                </div>
                <p className="text-[14px] font-semibold leading-snug text-white mb-1">
                  Sleep deficit is capping squat progression
                </p>
                <p className="text-[11px] leading-relaxed text-white/40">
                  5 of 6 heavy days fell below 6.5h threshold. Adaptation rate dropped to 0.3%/wk.
                </p>
              </div>

              {/* ── Metrics row ─────────────────────────────────────── */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <p className="text-[10px] text-white/35 font-medium mb-1">Sleep Debt</p>
                  <p className="text-[22px] font-bold text-destructive leading-none tracking-tight">−82<span className="text-[13px] font-medium text-destructive/60 ml-0.5">min</span></p>
                </div>
                <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <p className="text-[10px] text-white/35 font-medium mb-1">Projected Gain</p>
                  <p className="text-[22px] font-bold text-success leading-none tracking-tight">+8.2<span className="text-[13px] font-medium text-success/60 ml-0.5">kg</span></p>
                </div>
              </div>

              {/* ── Action card ─────────────────────────────────────── */}
              <div
                className="rounded-2xl p-3.5 mb-1"
                style={{ background: 'rgba(45,220,143,0.06)', border: '1px solid rgba(45,220,143,0.12)' }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[10px] font-semibold text-success/70 tracking-wide uppercase">Recommended Fix</p>
                  <span className="text-[10px] font-medium text-success/50">6 weeks</span>
                </div>
                <p className="text-[13px] font-medium text-white/80 leading-snug">
                  Add 45 min sleep on training days. Cut AMRAP volume 20%.
                </p>
              </div>

            </div>

            {/* ── Tab bar ───────────────────────────────────────────── */}
            <div style={{ background: 'rgba(0,0,0,0.85)', borderTop: '0.5px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
              <div className="flex justify-around px-4 pt-2 pb-0.5">
                {[
                  { label: 'Diagnosis', active: true, icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                    </svg>
                  )},
                  { label: 'Log', active: false, icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/>
                    </svg>
                  )},
                  { label: 'Rank', active: false, icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 7 7 7 7"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 17 7 17 7"/>
                      <path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/>
                      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
                    </svg>
                  )},
                  { label: 'Profile', active: false, icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/>
                    </svg>
                  )},
                ].map(({ label, active, icon }) => (
                  <div key={label} className="flex flex-col items-center gap-[2px]" style={{ minWidth: 52 }}>
                    <div className={active ? 'text-[#007AFF]' : 'text-white/25'}>{icon}</div>
                    <span className={`text-[10px] font-medium ${active ? 'text-[#007AFF]' : 'text-white/25'}`}>{label}</span>
                  </div>
                ))}
              </div>
              {/* Home indicator */}
              <div className="flex justify-center pb-2 pt-1.5">
                <div className="h-[5px] w-[134px] rounded-full bg-white/20" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Background atmosphere ────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-8 top-12 h-40 rounded-full bg-accent/6 blur-[80px]" />
        <div className="absolute bottom-8 right-0 h-28 w-28 rounded-full bg-destructive/5 blur-[60px]" />
      </div>
    </div>
  )
}
