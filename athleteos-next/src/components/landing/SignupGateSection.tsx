'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Users } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import { validateFounderForm } from './founderFormValidation'
import { getFounderLabel, getInlineSignupGateContent } from './landingFlow'
import { GlassField } from './rank/SystemInput'
import { insertFounder } from '@/lib/supabase'

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

  useEffect(() => {
    const syncFounder = () => {
      setFounderLabel(getFounderLabel(localStorage.getItem('aos_founder_data')))
    }
    syncFounder()
    window.addEventListener('aos-founder-data-changed', syncFounder)
    return () => window.removeEventListener('aos-founder-data-changed', syncFounder)
  }, [])

  const gateContent = getInlineSignupGateContent(overallPct)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setApiError('')

    const validationErrors = validateFounderForm(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

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
      setApiError(apiErr.message)
      return
    }

    localStorage.setItem('aos_waitlist', '1')
    localStorage.setItem('aos_founder_data', JSON.stringify({
      id: data.id, num: data.founder_number, shareCount: 0,
    }))
    trackEvent('signup_conversion', {
      overallPct: overallPct ?? 0,
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
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="gate-panel rounded-lg p-6 md:p-8"
        >
          <div className="mb-6">
            <div className="mb-1.5 flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-accent" />
              <span className="font-mono-label text-accent">{gateContent.eyebrow}</span>
            </div>
            <p className="text-xl font-bold leading-snug text-foreground md:text-2xl">{gateContent.headline}</p>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {gateContent.productLine}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <GlassField
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={v => setForm(f => ({ ...f, email: v }))}
              error={errors.email}
            />
            <div>
              <GlassField
                type="tel"
                placeholder="+XX XXXXXXXXXX"
                value={form.whatsapp}
                onChange={v => setForm(f => ({ ...f, whatsapp: v }))}
                error={errors.whatsapp}
              />
              <p className="mt-1 text-xs text-muted-foreground/60">WhatsApp (for early access updates) · optional</p>
            </div>
            {apiError && <p className="font-mono text-xs text-destructive">{apiError}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer rounded-md bg-accent py-4 text-base font-bold text-white transition-all hover:bg-accent-light disabled:opacity-50 flex items-center justify-center gap-2 group"
              style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
            >
              {loading ? 'Submitting…' : (
                <>
                  Reserve My Diagnosis
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-4">
            {gateContent.trustChips.map(t => (
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
