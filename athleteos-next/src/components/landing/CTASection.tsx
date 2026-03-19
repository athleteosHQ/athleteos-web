'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import { insertFounder, incrementShareCount, getFounderCount } from '@/lib/supabase'

interface FormState { name: string; email: string; whatsapp: string; discipline: string; experience: string }
interface FounderState { id: string; founderNumber: number; shareCount: number }

const MAX_BOOSTS = 3
const BOOST_SPOTS = 100
const MAX_FOUNDERS = 500

// Founding perks — data-grid rows
const FOUNDING_PERKS = [
  { key: 'PRICE_LOCK',        value: '₹4,999/yr · fixed at founding' },
  { key: 'BETA_ACCESS',       value: 'Pre-launch · diagnosis engine first' },
  { key: 'DIRECT_LINE',       value: 'WhatsApp to founders · not support tickets' },
  { key: 'FEATURE_PRIORITY',  value: 'Founding requests built first' },
  { key: 'FOUNDER_BADGE',     value: 'In-app · permanent' },
]

const DISCIPLINE_OPTIONS = ['POWERLIFTING', 'WEIGHTLIFTING', 'HYBRID', 'GENERAL FITNESS']
const EXPERIENCE_OPTIONS = ['< 1 YR', '1–3 YR', '3–5 YR', '5+ YR']

function GlassField({ type, placeholder, value, onChange, error }: {
  type: string; placeholder: string; value: string
  onChange: (v: string) => void; error?: string
}) {
  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full font-sans text-base text-foreground placeholder:text-muted-foreground/50 transition-all focus:outline-none"
        style={{
          background: 'rgba(11,17,24,0.8)',
          border: `1px solid ${error ? 'rgba(226,75,74,0.5)' : 'rgba(255,255,255,0.10)'}`,
          borderRadius: 4,
          padding: '13px 16px',
        }}
        onFocus={e => { e.target.style.borderColor = 'rgba(127,178,255,0.48)'; e.target.style.boxShadow = '0 0 0 3px rgba(127,178,255,0.08)' }}
        onBlur={e => { e.target.style.borderColor = error ? 'rgba(226,75,74,0.5)' : 'rgba(255,255,255,0.10)'; e.target.style.boxShadow = 'none' }}
      />
      {error && <p className="mt-1 font-mono text-xs text-destructive">{error}</p>}
    </div>
  )
}

function ChipToggle({ options, value, onChange, label }: {
  options: string[]; value: string; onChange: (v: string) => void; label: string
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-muted-foreground mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(value === opt ? '' : opt)}
            className="text-sm font-semibold transition"
            style={{
              padding: '5px 10px',
              borderRadius: 4,
              ...(value === opt
                ? { background: 'rgba(255,122,47,0.14)', border: '1px solid rgba(255,122,47,0.35)', color: '#FF9A5C' }
                : { background: 'transparent', border: '1px solid rgba(255,255,255,0.09)', color: 'var(--muted-foreground)' }
              ),
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Slot counter bar ─────────────────────────────────────────────────────────
function SlotCounter({ count }: { count: number }) {
  const claimed = Math.min(count, MAX_FOUNDERS)
  const pct = Math.round((claimed / MAX_FOUNDERS) * 100)
  const remaining = MAX_FOUNDERS - claimed
  const filled = Math.round(pct / 10)

  return (
    <div
      className="mb-6 p-4"
      style={{
        background: 'rgba(0,217,255,0.04)',
        border: '1px solid rgba(0,217,255,0.14)',
        borderRadius: 4,
      }}
    >
      <div className="flex items-baseline justify-between gap-4 mb-2">
        <span className="font-mono-label" style={{ color: 'var(--data-cyan)', fontSize: '10px' }}>
          REMAINING_SLOTS: {remaining}/{MAX_FOUNDERS}
        </span>
        <span className="font-mono text-xs font-bold" style={{ color: 'var(--data-cyan)' }}>{pct}% CLAIMED</span>
      </div>
      <div className="font-mono text-muted-foreground/60" style={{ fontSize: '12px', letterSpacing: '0.04em' }}>
        {'█'.repeat(filled)}{'░'.repeat(10 - filled)}
      </div>
    </div>
  )
}

// ── Post-signup state ────────────────────────────────────────────────────────
function FounderSuccess({ founder, onShare, onClaim, claimVisible, claiming }: {
  founder: FounderState
  onShare: (p: 'x' | 'wa') => void
  onClaim: () => void
  claimVisible: boolean
  claiming: boolean
}) {
  const effectivePosition = Math.max(1, founder.founderNumber - founder.shareCount * BOOST_SPOTS)
  const queuePct = Math.round(((MAX_FOUNDERS - effectivePosition) / MAX_FOUNDERS) * 100)
  const boostsLeft = MAX_BOOSTS - founder.shareCount

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className="overflow-hidden"
      style={{
        borderRadius: 6,
        background: 'rgba(255,255,255,0.026)',
        border: '1px solid rgba(255,122,47,0.25)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 0 60px rgba(255,122,47,0.08)',
      }}
    >
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #FF7A2F, #FF9A5C, #FF7A2F)' }} />

      <div className="p-8 sm:p-10">
        {/* Cohort badge */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 text-xs font-semibold text-success"
          style={{ borderRadius: 999, background: 'rgba(45,220,143,0.08)', border: '1px solid rgba(45,220,143,0.2)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-glow" />
          Application Approved — Founding Member #{founder.founderNumber}
        </div>

        {/* Queue position */}
        <div className="mb-8">
          <div className="flex items-end gap-6 flex-wrap mb-4">
            <div>
              <p className="font-mono-label text-muted-foreground mb-1">Assigned spot</p>
              <p className="font-display text-4xl font-bold text-muted-foreground">#{founder.founderNumber}</p>
            </div>
            <div className="pb-1 text-muted-foreground font-mono text-xl">→</div>
            <div>
              <p className="font-mono-label text-accent mb-1">Queue position</p>
              <p className="font-display text-4xl font-bold text-accent">#{effectivePosition}</p>
            </div>
          </div>

          {/* Queue bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="font-mono-label text-muted-foreground">Position in founding cohort</span>
              <span className="font-mono text-xs text-accent font-bold">Top {100 - queuePct}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden signal-bar" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #FF7A2F, #FF9A5C)' }}
                initial={{ width: 0 }}
                animate={{ width: `${queuePct}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {effectivePosition} of {MAX_FOUNDERS} founding spots · each share jumps you 100 spots
            </p>
          </div>
        </div>

        {/* Perks locked */}
        <div className="mb-6 space-y-2.5">
          <p className="font-mono-label text-muted-foreground mb-3">What you&apos;ve locked in</p>
          {FOUNDING_PERKS.slice(0, 3).map(({ key, value }) => (
            <div key={key} className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,122,47,0.15)' }}>
                <Check size={10} className="text-accent" />
              </div>
              <p className="text-sm text-muted-foreground">{value}</p>
            </div>
          ))}
        </div>

        {/* Share to boost */}
        <div className="p-5" style={{ borderRadius: 4, background: 'rgba(255,122,47,0.05)', border: '1px solid rgba(255,122,47,0.15)' }}>
          {boostsLeft > 0 ? (
            <>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold text-foreground">Jump the queue by sharing</p>
                <span className="font-mono-label text-accent">{boostsLeft} boost{boostsLeft !== 1 ? 's' : ''} left</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Each share = 100 spots forward. Max 3. Tell serious athletes, not casuals.
              </p>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => onShare('x')}
                  className="flex-1 min-w-[120px] py-2.5 text-sm font-bold text-white transition"
                  style={{ borderRadius: 4, background: '#000', border: '1px solid rgba(255,255,255,0.14)' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)')}
                >
                  𝕏 Post on X
                </button>
                <button
                  onClick={() => onShare('wa')}
                  className="flex-1 min-w-[120px] py-2.5 text-sm font-bold transition"
                  style={{ borderRadius: 4, background: 'rgba(37,211,102,0.10)', border: '1px solid rgba(37,211,102,0.28)', color: '#25D366' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(37,211,102,0.18)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(37,211,102,0.10)')}
                >
                  WhatsApp
                </button>
              </div>
              <AnimatePresence>
                {claimVisible && (
                  <motion.button
                    onClick={onClaim}
                    disabled={claiming}
                    initial={{ opacity: 0, y: 8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -4, height: 0 }}
                    className="mt-3 w-full py-3 text-sm font-bold text-accent transition disabled:opacity-50"
                    style={{ borderRadius: 4, background: 'rgba(255,122,47,0.12)', border: '1px solid rgba(255,122,47,0.35)' }}
                  >
                    {claiming ? 'Claiming…' : '✓ Claim boost — jump 100 spots now →'}
                  </motion.button>
                )}
              </AnimatePresence>
            </>
          ) : (
            <div className="text-center py-2">
              <p className="text-sm font-bold text-foreground mb-1">Maximum queue priority reached</p>
              <p className="font-mono-label text-muted-foreground">3/3 boosts claimed · you&apos;re in the fast lane</p>
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Questions? WhatsApp us at{' '}
          <a href="https://wa.me/916005109043" className="text-accent hover:underline">6005109043</a>
        </p>
      </div>
    </motion.div>
  )
}

// ── Pre-signup state ─────────────────────────────────────────────────────────
export function CTASection() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', whatsapp: '', discipline: '', experience: '' })
  const [errors, setErrors] = useState<Partial<Pick<FormState, 'name' | 'email' | 'whatsapp'>>>({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [founder, setFounder] = useState<FounderState | null>(null)
  const [claimVisible, setClaimVisible] = useState(false)
  const [claiming, setClaiming] = useState(false)
  const [slotCount, setSlotCount] = useState(142)

  useEffect(() => {
    getFounderCount().then(setSlotCount).catch(() => {})
  }, [])

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
  const isValidPhone = (v: string) => /^\+?[0-9\s()-]{10,15}$/.test(v)

  const validate = (): boolean => {
    const e: Partial<Pick<FormState, 'name' | 'email' | 'whatsapp'>> = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!isValidPhone(form.whatsapp)) e.whatsapp = 'Invalid number'
    if (!isValidEmail(form.email)) e.email = 'Invalid email'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')
    if (!validate()) return
    setLoading(true)
    const { data, error } = await insertFounder({
      name: form.name.trim(),
      email: form.email.trim(),
      whatsapp: form.whatsapp.trim(),
      source: 'landing-v2',
      ...(form.discipline ? { discipline: form.discipline } : {}),
      ...(form.experience ? { experience: form.experience } : {}),
    })
    setLoading(false)
    if (error) { setApiError(error.message); return }
    const state = { id: data.id, founderNumber: data.founder_number, shareCount: 0 }
    setFounder(state)
    localStorage.setItem('aos_waitlist', '1')
    localStorage.setItem('aos_founder_data', JSON.stringify({ id: data.id, num: data.founder_number, shareCount: 0 }))
  }

  const handleShare = (platform: 'x' | 'wa') => {
    if (!founder) return
    if (platform === 'x') {
      const txt = encodeURIComponent(`Just locked Founding Member #${founder.founderNumber} on @athleteos_in — ₹4,999/year, price locked forever.\nCheck your India strength rank: https://athleteos.in`)
      window.open(`https://twitter.com/intent/tweet?text=${txt}`, '_blank')
    } else {
      const txt = encodeURIComponent(`Just locked my founding spot on athleteOS — ₹4,999/year, price locked forever. If you're serious about your training, check this out: https://athleteos.in`)
      window.open(`https://wa.me/?text=${txt}`, '_blank')
    }
    if (founder.shareCount < MAX_BOOSTS) {
      setTimeout(() => setClaimVisible(true), 2500)
    }
  }

  const handleClaim = async () => {
    if (!founder || founder.shareCount >= MAX_BOOSTS) return
    setClaiming(true)
    const { data: newCount, error } = await incrementShareCount(founder.id)
    setClaiming(false)
    if (error) { console.error(error); return }
    const updated = { ...founder, shareCount: newCount as number }
    setFounder(updated)
    setClaimVisible(false)
    localStorage.setItem('aos_founder_data', JSON.stringify({ id: updated.id, num: updated.founderNumber, shareCount: updated.shareCount }))
  }

  if (founder) {
    return (
      <section id="waitlist" className="px-6 py-16 md:px-10">
        <div className="mx-auto max-w-3xl">
          <FounderSuccess
            founder={founder}
            onShare={handleShare}
            onClaim={handleClaim}
            claimVisible={claimVisible}
            claiming={claiming}
          />
        </div>
      </section>
    )
  }

  return (
    <section id="waitlist" className="px-6 py-20 md:px-10">
      <div className="mx-auto max-w-6xl">

        {/* Section header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-mono-label text-accent mb-5">APPLY_FOR_FOUNDING_ACCESS</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            You&apos;ve seen the gap.<br />
            <span className="gradient-text">Here&apos;s how you close it.</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">

          {/* Left: founding offer + perks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Founding price card — hero */}
            <div
              className="p-6 mb-4"
              style={{
                borderRadius: 6,
                background: 'linear-gradient(135deg, rgba(255,122,47,0.12) 0%, rgba(255,255,255,0.025) 60%)',
                border: '1px solid rgba(255,122,47,0.30)',
                boxShadow: '0 0 40px rgba(255,122,47,0.08)',
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-mono-label text-accent mb-2">Founding annual · Price locked forever</p>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-5xl font-bold text-foreground">₹4,999</span>
                    <span className="text-muted-foreground">/year</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-3 flex-wrap">
                    <span className="font-display text-lg font-bold text-success">₹416/month</span>
                    <span className="text-xs text-muted-foreground line-through">₹6,999/yr at launch</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span
                    className="inline-block px-3 py-1.5 font-mono text-sm font-bold text-accent"
                    style={{ borderRadius: 4, background: 'rgba(255,122,47,0.15)', border: '1px solid rgba(255,122,47,0.3)' }}
                  >
                    29% OFF
                  </span>
                  <p className="mt-1 text-xs text-muted-foreground">forever</p>
                </div>
              </div>

              {/* The real anchor */}
              <div
                className="p-3 text-base text-muted-foreground leading-relaxed"
                style={{ borderRadius: 4, background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                You spend <span className="text-foreground font-semibold">₹3,000+/month</span> on protein and creatine.
                For <span className="text-accent font-semibold">₹416/month</span> you&apos;ll know if any of it is actually working.
              </div>
            </div>

            {/* WHAT_YOU_LOCK_IN — data-grid */}
            <div
              className="p-5"
              style={{
                borderRadius: 6,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <p className="font-mono-label text-muted-foreground mb-4">What you lock in</p>
              <div className="space-y-0">
                {FOUNDING_PERKS.map(({ key, value }, i) => (
                  <div
                    key={key}
                    className="grid gap-2 sm:gap-4 py-2.5 sm:grid-cols-[140px_1fr]"
                    style={{
                      borderTop: i === 0 ? '1px solid rgba(255,255,255,0.06)' : undefined,
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-accent/70">{key}</span>
                    <span className="text-base text-foreground/80 leading-relaxed">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div
              className="p-6 sticky top-24"
              style={{
                borderRadius: 6,
                background: 'rgba(255,255,255,0.026)',
                border: '1px solid rgba(255,255,255,0.09)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 24px 72px rgba(0,0,0,0.32)',
              }}
            >
              {/* Slot counter */}
              <SlotCounter count={slotCount} />

              <p className="font-mono-label text-accent mb-1">Apply for founding access</p>
              <p className="text-lg font-bold text-foreground mb-1">Lock price + get beta access</p>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                No payment now. This reserves your founding access and locks your launch price.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <GlassField
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={v => setForm(f => ({ ...f, name: v }))}
                  error={errors.name}
                />
                <GlassField
                  type="tel"
                  placeholder="WhatsApp number"
                  value={form.whatsapp}
                  onChange={v => setForm(f => ({ ...f, whatsapp: v }))}
                  error={errors.whatsapp}
                />
                <GlassField
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={v => setForm(f => ({ ...f, email: v }))}
                  error={errors.email}
                />

                {/* Optional segmentation fields */}
                <div className="space-y-3 pt-1">
                  <ChipToggle
                    label="DISCIPLINE (optional)"
                    options={DISCIPLINE_OPTIONS}
                    value={form.discipline}
                    onChange={v => setForm(f => ({ ...f, discipline: v }))}
                  />
                  <ChipToggle
                    label="EXPERIENCE (optional)"
                    options={EXPERIENCE_OPTIONS}
                    value={form.experience}
                    onChange={v => setForm(f => ({ ...f, experience: v }))}
                  />
                </div>

                {apiError && (
                  <p className="font-mono text-xs text-destructive">{apiError}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="cta-glow w-full bg-accent py-4 font-bold text-white transition hover:bg-accent-light accent-glow disabled:opacity-50 mt-2"
                  style={{ borderRadius: 4 }}
                >
                  {loading ? 'Submitting…' : 'Submit Application →'}
                </button>
              </form>

              {/* Trust signals */}
              <div className="mt-5 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="space-y-2">
                  {[
                    'No payment required to reserve',
                    'Cancel within 7 days, no questions',
                    'Price locks the moment you confirm',
                  ].map(t => (
                    <div key={t} className="flex items-center gap-2">
                      <Check size={11} className="text-success flex-shrink-0" />
                      <span className="text-xs text-muted-foreground">{t}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  Not ready?{' '}
                  <a href="https://wa.me/916005109043" className="text-accent hover:underline">
                    Message us on WhatsApp
                  </a>
                  {' '}first.
                </p>
                <p className="mt-2 font-mono-label text-muted-foreground/50">
                  <a href="/privacy" className="hover:text-muted-foreground transition">Privacy Policy</a>
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
