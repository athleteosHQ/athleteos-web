'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Activity, Check, Users, Download, Share2 } from 'lucide-react'
import { calculateRank, type RankInput, type RankResult } from '@/lib/rankCalc'
import { AthleteScoreCard } from './AthleteScoreCard'
import { insertFounder } from '@/lib/supabase'
import { RankShareCard } from './RankShareCard'

// ── Shared number input ───────────────────────────────────────────────────────
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

// ── Shared text/email/tel input ───────────────────────────────────────────────
function GlassField({ type, placeholder, value, onChange }: {
  type: string; placeholder: string; value: string; onChange: (v: string) => void
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full rounded-xl font-sans text-sm text-foreground placeholder:text-muted-foreground/50 transition-all focus:outline-none"
      style={{
        background: 'rgba(11,17,24,0.8)',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: 12,
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
      <div className="mb-1.5 grid grid-cols-[1fr_96px] gap-2">
        <p className="text-[11px] font-medium text-muted-foreground">Weight (kg)</p>
        <p className="text-[11px] font-medium text-muted-foreground">Reps</p>
      </div>
      <div className="flex gap-2">
        <GlassInput placeholder="e.g. 190" value={weightVal} onChange={onWeight} min={0} step={0.5} />
        <div className="w-24 flex-shrink-0">
          <GlassInput placeholder="e.g. 1" value={repsVal} onChange={onReps} min={1} max={30} />
        </div>
      </div>
    </div>
  )
}

// ── Diagnostic bars ───────────────────────────────────────────────────────────
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

// ── Ghost tier preview (idle state right column) ──────────────────────────────
const GHOST_BARS = [
  { label: 'Squat',    color: '#FF7A2F', pct: 78 },
  { label: 'Bench',    color: '#F59E0B', pct: 55 },
  { label: 'Deadlift', color: '#E24B4A', pct: 84 },
]

function GhostTierPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative"
    >
      {/* Ghost content — visible through overlay */}
      <div
        className="rounded-2xl overflow-hidden p-6"
        style={{
          background: 'rgba(255,255,255,0.026)',
          border: '1px solid rgba(255,255,255,0.09)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        <div className="flex items-center gap-2 mb-5">
          <Activity className="w-3 h-3 text-accent" />
          <p className="font-mono-label text-muted-foreground">Sample Output</p>
        </div>

        {/* Ghost score circle + tier */}
        <div className="flex items-center gap-4 mb-5" style={{ filter: 'blur(5px)', userSelect: 'none' }}>
          <div
            className="relative flex-shrink-0 w-20 h-20 rounded-full"
            style={{
              background: 'conic-gradient(#FF7A2F 0deg 270deg, rgba(255,255,255,0.06) 270deg 360deg)',
            }}
          >
            <div
              className="absolute inset-2 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(7,13,20,0.92)' }}
            >
              <span className="font-mono text-xl font-bold text-accent">74</span>
            </div>
          </div>
          <div>
            <p className="font-mono-label text-accent mb-0.5">India Rank</p>
            <p className="font-mono text-2xl font-bold text-foreground">ADVANCED</p>
            <p className="text-xs text-muted-foreground mt-0.5">Top 22% nationally</p>
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
        style={{ background: 'rgba(7,13,20,0.72)', backdropFilter: 'blur(2px)' }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(255,122,47,0.12)', border: '1px solid rgba(255,122,47,0.30)' }}
        >
          <Activity className="w-5 h-5 text-accent" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground mb-1">Your diagnosis will appear here</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Enter your lifts to see your India percentile rank
          </p>
        </div>
        <div className="flex gap-3 flex-wrap justify-center">
          {['IPF-calibrated', '3,200+ Indian athletes'].map(t => (
            <span key={t} className="font-mono-label text-muted-foreground/60" style={{ fontSize: '10px' }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ── Inline signup gate (post-result, peak motivation) ─────────────────────────
interface GateForm { name: string; email: string; whatsapp: string }

function InlineSignupGate() {
  const [form, setForm] = useState<GateForm>({ name: '', email: '', whatsapp: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(() => (
    typeof window !== 'undefined' && !!localStorage.getItem('aos_waitlist')
  ))
  const [founderNum, setFounderNum] = useState<number | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.email.trim() || !form.whatsapp.trim()) {
      setError('All fields required')
      return
    }
    setLoading(true)
    const { data, error: apiErr } = await insertFounder({
      name: form.name.trim(),
      email: form.email.trim(),
      whatsapp: form.whatsapp.trim(),
      source: 'rank-gate',
    })
    setLoading(false)
    if (apiErr) { setError(apiErr.message); return }
    setFounderNum(data.founder_number)
    setDone(true)
    localStorage.setItem('aos_waitlist', '1')
    localStorage.setItem('aos_founder_data', JSON.stringify({
      id: data.id, num: data.founder_number, shareCount: 0,
    }))
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5"
        style={{ background: 'rgba(45,220,143,0.05)', border: '1px solid rgba(45,220,143,0.2)' }}
      >
        <div className="flex items-center gap-3 mb-1.5">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(45,220,143,0.15)' }}
          >
            <Check className="w-3.5 h-3.5 text-success" />
          </div>
          <p className="font-bold text-foreground">
            {founderNum ? `Founding Member #${founderNum} confirmed` : `You're on the founding list`}
          </p>
        </div>
        <p className="text-sm text-muted-foreground pl-9">
          Price locked at ₹4,999/year.{' '}
          <a href="#waitlist" className="text-accent hover:underline">View full details →</a>
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="rounded-2xl p-6"
      style={{
        background: 'linear-gradient(135deg, rgba(255,122,47,0.08) 0%, rgba(255,255,255,0.02) 60%)',
        border: '1px solid rgba(255,122,47,0.22)',
        boxShadow: '0 0 40px rgba(255,122,47,0.06)',
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Users className="w-3.5 h-3.5 text-accent" />
            <span className="font-mono-label text-accent">Founding Cohort · Max 500</span>
          </div>
          <p className="text-lg font-bold text-foreground leading-snug">
            You&apos;ve seen where you stand.<br className="hidden sm:block" />
            <span className="gradient-text"> Lock your founding price.</span>
          </p>
          <p className="text-sm text-muted-foreground mt-1">₹4,999/year · price locked forever · no payment now</p>
        </div>
        <div
          className="flex-shrink-0 rounded-xl px-3 py-1.5 font-mono text-sm font-bold text-accent self-start"
          style={{ background: 'rgba(255,122,47,0.12)', border: '1px solid rgba(255,122,47,0.25)' }}
        >
          29% OFF
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2.5">
        <div className="grid sm:grid-cols-2 gap-2.5">
          <GlassField
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={v => setForm(f => ({ ...f, name: v }))}
          />
          <GlassField
            type="tel"
            placeholder="WhatsApp number"
            value={form.whatsapp}
            onChange={v => setForm(f => ({ ...f, whatsapp: v }))}
          />
        </div>
        <GlassField
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={v => setForm(f => ({ ...f, email: v }))}
        />
        {error && <p className="font-mono text-xs text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="cta-glow w-full rounded-xl bg-accent py-3.5 font-bold text-white transition hover:bg-accent-light accent-glow disabled:opacity-50 flex items-center justify-center gap-2 group"
        >
          {loading ? 'Reserving…' : (
            <>
              Lock My Founding Price
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3">
        {['No payment now', '7-day cancel', 'Price locks on confirm'].map(t => (
          <div key={t} className="flex items-center gap-1.5">
            <Check className="w-3 h-3 text-success flex-shrink-0" />
            <span className="text-xs text-muted-foreground">{t}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ── Share helpers ─────────────────────────────────────────────────────────────
async function captureAndDownload(el: HTMLElement, tier: string) {
  const html2canvas = (await import('html2canvas')).default
  const canvas = await html2canvas(el, {
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#070D14',
    width: 1080,
    height: 1080,
    scale: 1,
    logging: false,
  })
  const link = document.createElement('a')
  link.download = `athleteos-rank-${tier.toLowerCase()}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}

function shareOnX(tier: string, overallPct: number) {
  const top = 100 - overallPct
  const text = encodeURIComponent(
    `Top ${top}% in India on athleteOS.\nTier: ${tier}\n\nCheck your rank free: https://athleteos.in #IndiaStrength`
  )
  window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
}

function shareOnWhatsApp(tier: string, overallPct: number) {
  const top = 100 - overallPct
  const text = encodeURIComponent(
    `I just checked my India strength rank on athleteOS 💪\nTop ${top}% nationally · Tier: ${tier}\n\nCheck yours free: https://athleteos.in`
  )
  window.open(`https://wa.me/?text=${text}`, '_blank')
}

// ── Main export ───────────────────────────────────────────────────────────────
export function RankSection() {
  const [trainingType, setTrainingType] = useState<'strength' | 'hybrid'>('strength')
  const [f, setF] = useState({ bw: '', sqW: '', sqR: '', bpW: '', bpR: '', dlW: '', dlR: '', runMin: '', runSec: '' })
  const [result, setResult] = useState<RankResult | null>(null)
  const [error, setError] = useState('')
  const [capturing, setCapturing] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

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

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <p className="font-mono-label text-accent mb-3">Step 1 · Free rank check</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            Know where you stand.
          </h2>
          <p className="text-muted-foreground mb-4">
            Before you can fix a plateau, you need a baseline. Find exactly where you rank against Indian athletes in your weight class, right now, for free.
          </p>

          {/* Social proof chips */}
          <div className="flex flex-wrap gap-2">
            {['IPF-calibrated percentiles', '3,200+ Indian athletes', 'Free · no account'].map(chip => (
              <span
                key={chip}
                className="font-mono-label text-muted-foreground rounded-full px-3 py-1"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  fontSize: '11px',
                }}
              >
                {chip}
              </span>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!result ? (
            /* ── Idle: 2-column (form + ghost preview) ── */
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="grid lg:grid-cols-2 gap-6 items-start"
            >
              {/* Form panel */}
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
                  <div>
                    <p className="font-mono-label text-muted-foreground mb-1.5">Enter your best recent set for each lift</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Use <span className="text-foreground font-semibold">weight × reps</span>. Sets are not needed. Example: <span className="text-foreground font-semibold">190 × 1</span> or <span className="text-foreground font-semibold">140 × 5</span>.
                    </p>
                  </div>
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
                  Find My Rank
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Ghost tier preview */}
              <GhostTierPreview />
            </motion.div>
          ) : (
            /* ── Result: score card + bars + inline gate ── */
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="space-y-5"
            >
              <div className="grid md:grid-cols-2 gap-6 items-start">
                <AthleteScoreCard
                  score={result.athleteScore}
                  systemStatus={result.tier}
                  percentileLabel={`Top ${100 - result.overallPct}% in India`}
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

                  {/* Share card actions */}
                  <div
                    className="rounded-2xl p-4 space-y-3"
                    style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <p className="font-mono-label text-muted-foreground" style={{ fontSize: 11 }}>SHARE YOUR PERCENTILE</p>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={async () => {
                          if (!cardRef.current) return
                          setCapturing(true)
                          try { await captureAndDownload(cardRef.current, result.tier) } finally { setCapturing(false) }
                        }}
                        disabled={capturing}
                        className="flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition disabled:opacity-50"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)' }}
                      >
                        <Download size={12} />
                        {capturing ? '…' : 'PNG'}
                      </button>
                      <button
                        onClick={() => shareOnX(result.tier, result.overallPct)}
                        className="flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition"
                        style={{ background: '#000', border: '1px solid rgba(255,255,255,0.18)', color: '#fff' }}
                      >
                        𝕏 Post
                      </button>
                      <button
                        onClick={() => shareOnWhatsApp(result.tier, result.overallPct)}
                        className="flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition"
                        style={{ background: 'rgba(37,211,102,0.10)', border: '1px solid rgba(37,211,102,0.28)', color: '#25D366' }}
                      >
                        <Share2 size={12} />
                        WA
                      </button>
                    </div>
                  </div>

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

              {/* Inline gate — peak motivation */}
              <InlineSignupGate />

              {/* Off-screen card for PNG capture */}
              <RankShareCard result={result} ref={cardRef} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  )
}
