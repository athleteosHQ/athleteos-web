'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Users, Zap } from 'lucide-react'
import { trackEvent, identifyUser } from '@/lib/analytics'
import { validateFounderForm } from './founderFormValidation'
import { getFounderLabel, getInlineSignupGateContent } from './landingFlow'
import { GlassField } from './rank/SystemInput'
import { insertFounder, getFounderCount } from '@/lib/supabase'

const DIAGNOSTIC_LOOP = [
  { step: 'Week 1', description: 'You log training and nutrition. The system builds your baseline.' },
  { step: 'First read', description: 'Rank, limiter, correction, projected gain — from your actual data.' },
  { step: 'Correction', description: 'One change. You track it. The system watches whether the numbers move.' },
  { step: 'Re-read', description: 'New diagnosis. Did the correction land? What\'s the next limiter?' },
] as const

const FOUNDING_DELIVERABLES = [
  'Full diagnostic system at launch — rank, limiter, correction, projected gain',
  'IFCT-verified nutrition tracking — Indian and South Asian food data',
  'Direct WhatsApp access to the founder — first 90 days',
  'You decide what gets built next',
] as const

const TRUST_CHIPS = [
  'No payment until launch',
  'Founding rate locked forever',
  'Full refund if we don\'t deliver',
] as const

interface GateForm { email: string; whatsapp: string }

interface SignupGateSectionProps {
  overallPct: number | null
}

export function SignupGateSection({ overallPct }: SignupGateSectionProps) {
  const router = useRouter()
  const [form, setForm] = useState<GateForm>({ email: '', whatsapp: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState('')
  const [founderLabel, setFounderLabel] = useState('')
  const [founderCount, setFounderCount] = useState<number | null>(null)
  const formStartRef = useRef<number | null>(null)
  const fieldsFocusedRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    const syncFounder = () => {
      setFounderLabel(getFounderLabel(localStorage.getItem('aos_founder_data')))
    }
    syncFounder()
    window.addEventListener('aos-founder-data-changed', syncFounder)
    return () => window.removeEventListener('aos-founder-data-changed', syncFounder)
  }, [])

  useEffect(() => {
    getFounderCount().then(setFounderCount)
  }, [])

  useEffect(() => {
    const handleBeforeUnload = () => {
      const hasValues = form.email.trim() || form.whatsapp.trim()
      if (!hasValues) return
      const timeInForm = formStartRef.current ? Math.round((Date.now() - formStartRef.current) / 1000) : 0
      trackEvent('signup_form_abandoned', {
        fields_filled: [form.email.trim() ? 'email' : null, form.whatsapp.trim() ? 'whatsapp' : null].filter(Boolean).join(','),
        has_rank_result: overallPct !== null,
        overallPct: overallPct ?? 0,
        time_in_form_seconds: timeInForm,
      })
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [form, overallPct])

  const gateContent = getInlineSignupGateContent(overallPct)

  const handleFieldFocus = (field: string) => {
    if (!formStartRef.current) formStartRef.current = Date.now()
    if (fieldsFocusedRef.current.has(field)) return
    fieldsFocusedRef.current.add(field)
    trackEvent('signup_form_focused', { field, has_rank_result: overallPct !== null, overallPct: overallPct ?? 0 })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setApiError('')

    const validationErrors = validateFounderForm(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      for (const [field, msg] of Object.entries(validationErrors)) {
        trackEvent('signup_form_validation_error', { field, error_type: msg })
      }
      return
    }

    const timeInForm = formStartRef.current ? Math.round((Date.now() - formStartRef.current) / 1000) : 0
    trackEvent('signup_form_submitted', {
      has_whatsapp: form.whatsapp.trim().length > 0,
      has_rank_result: overallPct !== null,
      overallPct: overallPct ?? 0,
      time_in_form_seconds: timeInForm,
    })
    setLoading(true)
    const referrerId = typeof window !== 'undefined' ? localStorage.getItem('aos_referrer_id') : null
    const { data, error: apiErr } = await insertFounder({
      email: form.email.trim(),
      whatsapp: form.whatsapp.trim(),
      source: 'rank-gate',
      ...(referrerId ? { referrer_id: referrerId } : {}),
    })
    setLoading(false)
    if (apiErr) {
      const emailDomain = form.email.includes('@') ? form.email.split('@')[1] : 'unknown'
      trackEvent('signup_api_error', { error_message: apiErr.message, email_domain: emailDomain })
      setApiError(apiErr.message)
      return
    }

    localStorage.setItem('aos_waitlist', '1')
    localStorage.setItem('aos_founder_data', JSON.stringify({ id: data.id, num: data.founder_number, shareCount: 0 }))
    identifyUser(data.id, { founder_number: data.founder_number, source: 'rank-gate' })
    trackEvent('signup_conversion', { overallPct: overallPct ?? 0, has_rank_result: overallPct !== null, source: 'rank-gate' })
    window.dispatchEvent(new Event('aos-founder-data-changed'))
    router.push('/welcome')
  }

  // ── Already signed up ──
  if (founderLabel) {
    return (
      <section id="inline-signup-gate" className="section-fade-top px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl p-6" style={{ background: 'rgba(45,220,143,0.05)', border: '1px solid rgba(45,220,143,0.2)' }}>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(45,220,143,0.15)' }}>
                <Check className="w-3.5 h-3.5 text-success" />
              </div>
              <p className="font-bold text-foreground">You&apos;re in. {founderLabel}.</p>
            </div>
            <p className="mt-2 pl-9 text-sm text-muted-foreground">
              <a href="/welcome" className="hover:underline" style={{ color: '#FF6B35' }}>Go to your welcome page →</a>
            </p>
          </div>
        </div>
      </section>
    )
  }

  const spotsLeft = founderCount !== null && founderCount > 0 ? Math.max(0, 50 - founderCount) : null

  return (
    <section id="inline-signup-gate" className="section-fade-top px-6 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-2xl">

        {/* ── Social proof + urgency header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          {/* Waitlist counter */}
          <div className="inline-flex items-center gap-3 proof-strip mb-5">
            <div className="flex -space-x-1.5">
              {['#FF6B35', '#F59E0B', '#2DDC8F', '#7FCFFF', '#FF6B35'].map((c, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full border-2 border-background flex-shrink-0"
                  style={{ background: `radial-gradient(circle at 35% 35%, ${c}cc, ${c}66)` }}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-foreground">
              <span className="font-bold" style={{ color: '#FF6B35' }}>
                {founderCount !== null && founderCount > 0 ? `${founderCount}+` : '2,400+'}
              </span>{' '}
              athletes on the waitlist
            </span>
            {spotsLeft !== null && spotsLeft <= 20 && (
              <span
                className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                <Zap className="w-3 h-3" />
                {spotsLeft} left
              </span>
            )}
          </div>

          <h2
            className="text-3xl font-bold text-foreground md:text-4xl"
            style={{ fontFamily: "'Syne', var(--font-jakarta), sans-serif" }}
          >
            {gateContent.headline}
          </h2>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
            Reserve your founding spot. No payment until launch.
          </p>
        </motion.div>

        {/* ── Diagnostic loop ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <p className="font-mono-label mb-4" style={{ color: '#FF6B35' }}>Your first month</p>
          <div className="space-y-3">
            {DIAGNOSTIC_LOOP.map(({ step, description }) => (
              <div key={step} className="flex gap-3">
                <span className="font-mono-label shrink-0 w-20 pt-0.5" style={{ color: '#FF6B35' }}>{step}</span>
                <span className="text-sm text-muted-foreground leading-relaxed">{description}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Three clarity blocks ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mb-8 grid gap-4 sm:grid-cols-3"
        >
          {[
            { label: 'What the system reads', body: 'Training load, food intake, and recovery signals — interpreted together to identify your limiter.' },
            { label: 'What founding members get', body: 'Locked founding rate, beta access, direct team contact, and influence over what gets built first.' },
            { label: 'What happens next', body: 'Reserve your spot. Before launch, the team contacts you directly.' },
          ].map(({ label, body }) => (
            <div key={label} className="surface-card-muted rounded-xl p-4">
              <p className="font-mono-label mb-2" style={{ color: '#FF6B35' }}>{label}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
            </div>
          ))}
        </motion.div>

        {/* ── Gate panel ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="gate-panel p-4 sm:p-6 md:p-8"
        >
          <div className="mb-5">
            <div className="mb-1.5 flex items-center gap-2">
              <Users className="w-3.5 h-3.5" style={{ color: '#FF6B35' }} />
              <span className="font-mono-label" style={{ color: '#FF6B35' }}>{gateContent.eyebrow}</span>
            </div>
            <p className="text-xl font-bold leading-snug text-foreground md:text-2xl" style={{ fontFamily: "'Syne', var(--font-jakarta), sans-serif" }}>
              {gateContent.headline}
            </p>
          </div>

          {/* Deliverables */}
          <div className="mb-5 space-y-2">
            {FOUNDING_DELIVERABLES.map(d => (
              <div key={d} className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-success flex-shrink-0 mt-0.5" style={{ filter: 'drop-shadow(0 0 4px rgba(45,220,143,0.4))' }} />
                <span className="text-sm text-muted-foreground leading-snug">{d}</span>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div
            className="mb-5 rounded-2xl px-5 py-5"
            style={{ background: 'rgba(255,107,53,0.05)', border: '1px solid rgba(255,107,53,0.15)' }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-3xl font-display font-bold text-foreground">
                  {'\u20B9'}2,999<span className="text-base font-normal text-muted-foreground">/year</span>
                </p>
                <p className="mt-1 text-base text-foreground/80">
                  {'\u20B9'}250/month · locked forever
                </p>
              </div>
              <span
                className="shrink-0 rounded-full px-3 py-1 font-mono-label text-[10px]"
                style={{ background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.25)', color: '#FF6B35' }}
              >
                {spotsLeft !== null && spotsLeft > 0 ? `${spotsLeft} of 50 left` : 'Limited spots'}
              </span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground/60">
              Regular price will be {'\u20B9'}599/month after launch.
            </p>
          </div>

          {/* No payment guarantee */}
          <div
            className="mb-5 flex items-center gap-2.5 rounded-xl px-4 py-3"
            style={{ background: 'rgba(45,220,143,0.06)', border: '1px solid rgba(45,220,143,0.12)' }}
          >
            <Check className="w-4 h-4 text-success shrink-0" />
            <p className="text-sm font-medium text-foreground">
              No payment until launch.{' '}
              <span className="text-muted-foreground font-normal">Reserve now, pay only when the product activates.</span>
            </p>
          </div>

          {founderCount !== null && founderCount > 0 && (
            <p className="mb-4 text-sm text-muted-foreground">
              <span className="font-bold text-foreground">{founderCount} athletes</span> have already reserved their spot.
            </p>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="gate-email" className="block text-xs font-medium text-muted-foreground mb-1.5">Email address</label>
              <GlassField
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={v => setForm(f => ({ ...f, email: v }))}
                error={errors.email}
                required
                autoComplete="email"
                ariaLabel="Email address"
                onFocus={() => handleFieldFocus('email')}
              />
            </div>
            <div>
              <label htmlFor="gate-whatsapp" className="block text-xs font-medium text-muted-foreground mb-1.5">
                WhatsApp <span className="text-muted-foreground/60">· optional</span>
              </label>
              <GlassField
                type="tel"
                placeholder="+XX XXXXXXXXXX"
                value={form.whatsapp}
                onChange={v => setForm(f => ({ ...f, whatsapp: v }))}
                error={errors.whatsapp}
                autoComplete="tel"
                ariaLabel="WhatsApp number (optional)"
                onFocus={() => handleFieldFocus('whatsapp')}
              />
              <p className="mt-1 text-xs text-muted-foreground/60">For early access updates</p>
            </div>
            {apiError && <p className="font-mono text-xs text-destructive">{apiError}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer rounded-xl py-4 text-base font-bold text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 group relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #FF6B35 0%, #FF0080 100%)',
                boxShadow: '0 4px 24px rgba(255,107,53,0.35), 0 2px 8px rgba(255,0,128,0.2), 0 1px 3px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.14)',
              }}
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                  Reserving your spot…
                </>
              ) : (
                <>
                  Reserve My Diagnosis
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-4">
            {TRUST_CHIPS.map(t => (
              <div key={t} className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-success flex-shrink-0" style={{ filter: 'drop-shadow(0 0 4px rgba(45,220,143,0.4))' }} />
                <span className="text-xs text-muted-foreground">{t}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
