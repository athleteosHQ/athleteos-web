'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Users } from 'lucide-react'
import { trackEvent, identifyUser } from '@/lib/analytics'
import { validateFounderForm } from './founderFormValidation'
import { getFounderLabel, getInlineSignupGateContent } from './landingFlow'
import { GlassField } from './rank/SystemInput'
import { insertFounder, getFounderCount } from '@/lib/supabase'

const DIAGNOSTIC_LOOP = [
  { step: 'First week', description: 'You log training and nutrition. The system builds your baseline.' },
  { step: 'First read', description: 'Rank, limiter, correction, projected gain — from your actual training data.' },
  { step: 'Correction', description: 'One change. You track it. The system watches whether the numbers move.' },
  { step: 'Re-read', description: 'New diagnosis. Did the correction land? What\u2019s the next limiter?' },
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
  'Full refund if we don\u2019t deliver',
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
        fields_filled: [
          form.email.trim() ? 'email' : null,
          form.whatsapp.trim() ? 'whatsapp' : null,
        ].filter(Boolean).join(','),
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
    if (!formStartRef.current) {
      formStartRef.current = Date.now()
    }
    if (fieldsFocusedRef.current.has(field)) return
    fieldsFocusedRef.current.add(field)
    trackEvent('signup_form_focused', {
      field,
      has_rank_result: overallPct !== null,
      overallPct: overallPct ?? 0,
    })
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
    localStorage.setItem('aos_founder_data', JSON.stringify({
      id: data.id, num: data.founder_number, shareCount: 0,
    }))
    identifyUser(data.id, {
      founder_number: data.founder_number,
      source: 'rank-gate',
    })
    trackEvent('signup_conversion', {
      overallPct: overallPct ?? 0,
      has_rank_result: overallPct !== null,
      source: 'rank-gate',
    })
    window.dispatchEvent(new Event('aos-founder-data-changed'))
    router.push('/welcome')
  }

  if (founderLabel) {
    return (
      <section id="inline-signup-gate" className="section-fade-top px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-2xl">
          <div
            className="rounded-2xl p-6"
            style={{ background: 'rgba(45,220,143,0.05)', border: '1px solid rgba(45,220,143,0.2)' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(45,220,143,0.15)' }}
              >
                <Check className="w-3.5 h-3.5 text-success" />
              </div>
              <p className="font-bold text-foreground">You&apos;re in. {founderLabel}.</p>
            </div>
            <p className="mt-2 pl-9 text-sm text-muted-foreground">
              <a href="/welcome" className="text-accent hover:underline">Go to your welcome page →</a>
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="inline-signup-gate" className="section-fade-top px-6 py-16 md:px-10 md:py-20">
      <div className="mx-auto max-w-2xl">

        {/* Zone 1 — Diagnostic loop (freestanding, above the panel) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <p className="font-mono-label text-accent mb-4">Your first month</p>
          <div className="space-y-3">
            {DIAGNOSTIC_LOOP.map(({ step, description }) => (
              <div key={step} className="flex gap-3">
                <span className="font-mono-label text-accent shrink-0 w-24 pt-0.5">{step}</span>
                <span className="text-sm text-muted-foreground leading-relaxed">{description}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Zone 2 — Three clarity blocks (method, offer, process) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mb-8 grid gap-4 sm:grid-cols-3"
        >
          <div className="surface-card-muted rounded-xl p-4">
            <p className="font-mono-label text-accent mb-2">What the system reads</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Training load, food intake, and recovery signals — interpreted together to identify what is limiting progress.
            </p>
          </div>
          <div className="surface-card-muted rounded-xl p-4">
            <p className="font-mono-label text-accent mb-2">What founding members get</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Locked founding rate, beta access, direct access to the core team, and influence over what gets built first.
            </p>
          </div>
          <div className="surface-card-muted rounded-xl p-4">
            <p className="font-mono-label text-accent mb-2">What happens next</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Reserve your spot. Before launch, the team contacts you directly — and in some cases schedules a short conversation to understand your needs.
            </p>
          </div>
        </motion.div>

        {/* Zone 3 — Gate panel (commitment block) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="gate-panel p-4 sm:p-6 md:p-8"
        >
          <div className="mb-5">
            <div className="mb-1.5 flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-accent" />
              <span className="font-mono-label text-accent">{gateContent.eyebrow}</span>
            </div>
            <p className="text-xl font-bold leading-snug text-foreground md:text-2xl">{gateContent.headline}</p>
          </div>

          {/* Founding member deliverables */}
          <div className="mb-5 space-y-2">
            {FOUNDING_DELIVERABLES.map(d => (
              <div key={d} className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-success flex-shrink-0 mt-0.5" style={{ filter: 'drop-shadow(0 0 4px rgba(45,220,143,0.4))' }} />
                <span className="text-sm text-muted-foreground leading-snug">{d}</span>
              </div>
            ))}
          </div>

          {/* Pricing — founding price dominant, others as context */}
          <div
            className="mb-5 rounded-2xl px-5 py-5"
            style={{ background: 'rgba(107,122,237,0.06)', border: '1px solid rgba(107,122,237,0.12)' }}
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
              <span className="shrink-0 rounded-full bg-accent/10 border border-accent/20 px-3 py-1 font-mono-label text-accent text-[10px]">
                {founderCount !== null && founderCount > 0 ? `${Math.max(0, 50 - founderCount)} of 50 left` : 'Limited spots'}
              </span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground/60">
              Regular price will be {'\u20B9'}599/month after launch.
            </p>
          </div>

          <div
            className="mb-5 flex items-center gap-2.5 rounded-xl px-4 py-3"
            style={{ background: 'rgba(45,220,143,0.06)', border: '1px solid rgba(45,220,143,0.12)' }}
          >
            <Check className="w-4 h-4 text-success shrink-0" />
            <p className="text-sm font-medium text-foreground">No payment until launch. <span className="text-muted-foreground font-normal">Reserve now, pay only when the product activates.</span></p>
          </div>

          {founderCount !== null && founderCount > 0 && (
            <p className="mb-4 text-sm text-muted-foreground">
              <span className="font-bold text-foreground">{founderCount} athletes</span> have reserved their spot.
            </p>
          )}

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
              <label htmlFor="gate-whatsapp" className="block text-xs font-medium text-muted-foreground mb-1.5">WhatsApp <span className="text-muted-foreground/60">· optional</span></label>
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
              className="w-full cursor-pointer rounded-xl bg-accent py-4 text-base font-bold text-white transition-all hover:bg-accent-light disabled:opacity-50 flex items-center justify-center gap-2 group"
              style={{ boxShadow: '0 2px 8px rgba(107,122,237,0.25), 0 1px 2px rgba(0,0,0,0.4)' }}
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                  Submitting…
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
