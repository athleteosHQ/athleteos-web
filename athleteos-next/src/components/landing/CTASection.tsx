'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { insertFounder, incrementShareCount } from '@/lib/supabase'

interface FormState {
  name: string
  email: string
  whatsapp: string
}

interface FounderState {
  id: string
  founderNumber: number
  shareCount: number
}

const MAX_BOOSTS = 3
const BOOST_SPOTS = 100

const TIERS = [
  { label: 'Trial',   price: '₹199',   sub: '7-day full access'    },
  { label: 'Monthly', price: '₹999',   sub: '₹583/mo going annual' },
  { label: 'Annual',  price: '₹6,999', sub: '42% off · save ₹4,989' },
]

const PERKS = [
  '₹4,999/year locked. Price stays fixed at launch.',
  'Beta access before public launch. You run the diagnosis engine first.',
]

function FieldInput({ type, placeholder, value, onChange }: {
  type: string; placeholder: string; value: string; onChange: (v: string) => void
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:border-accent/50 focus:outline-none transition"
    />
  )
}

export function CTASection() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', whatsapp: '' })
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [founder, setFounder] = useState<FounderState | null>(null)
  const [claimVisible, setClaimVisible] = useState(false)
  const [claiming, setClaiming] = useState(false)

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
  const isValidPhone = (v: string) => /^\+?[0-9\s()-]{10,15}$/.test(v)

  const validate = (): boolean => {
    const e: Partial<FormState> = {}
    if (!form.name.trim()) e.name = 'Enter your name'
    if (!isValidPhone(form.whatsapp)) e.whatsapp = 'Enter a valid WhatsApp number'
    if (!isValidEmail(form.email)) e.email = 'Enter a valid email address'
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
      const txt = encodeURIComponent(`Just locked Founding Member #${founder.founderNumber} on @athleteos_in — ₹4,999/year before launch.\nCheck your India strength rank: athleteos.in/rank`)
      window.open(`https://twitter.com/intent/tweet?text=${txt}`, '_blank')
    } else {
      const txt = encodeURIComponent(`Just locked my founding spot on athleteOS — ₹4,999/year, price fixed forever.\nhttps://athleteos.in/rank`)
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

  const effectivePosition = founder
    ? Math.max(1, founder.founderNumber - founder.shareCount * BOOST_SPOTS)
    : 0

  if (founder) {
    return (
      <section id="waitlist" className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <motion.div
            className="card-surface inner-glow p-8 sm:p-10 border-accent/20"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* Position display */}
            <div className="mb-6 flex flex-wrap items-end gap-6">
              <div>
                <p className="font-mono-label text-muted-foreground mb-1">Base spot</p>
                <p className="font-mono text-4xl font-bold text-muted-foreground">#{founder.founderNumber}</p>
              </div>
              <p className="pb-1 font-mono text-xl text-muted-foreground">→</p>
              <div>
                <p className="font-mono-label text-accent mb-1">Effective position</p>
                <p className="font-mono text-4xl font-bold text-accent">#{effectivePosition}</p>
              </div>
            </div>

            <p className="text-sm font-bold text-foreground">You&apos;re in the first performance cohort.</p>
            <div className="mt-3 space-y-2.5">
              {PERKS.map(item => (
                <div key={item} className="flex items-start gap-2.5">
                  <CheckCircle size={14} className="mt-0.5 flex-shrink-0 text-accent" />
                  <p className="text-sm text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>

            {/* Share to boost */}
            <div className="mt-6 border-t border-border pt-6">
              {founder.shareCount < MAX_BOOSTS ? (
                <>
                  <p className="mb-3 font-mono-label text-muted-foreground">
                    Each share moves you{' '}
                    <span className="text-foreground">100 spots forward</span>{' '}
                    · {founder.shareCount}/{MAX_BOOSTS} boosts used
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleShare('x')}
                      className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:border-foreground/20 hover:text-foreground"
                    >
                      Share on X →
                    </button>
                    <button
                      onClick={() => handleShare('wa')}
                      className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:border-foreground/20 hover:text-foreground"
                    >
                      Share on WhatsApp →
                    </button>
                  </div>
                  {claimVisible && (
                    <motion.button
                      onClick={handleClaim}
                      disabled={claiming}
                      className="mt-3 w-full rounded-xl border border-accent/40 bg-accent/10 py-2.5 text-sm font-bold text-accent transition hover:bg-accent/15 disabled:opacity-50"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {claiming ? 'Claiming…' : 'Claim boost — move up 100 spots →'}
                    </motion.button>
                  )}
                </>
              ) : (
                <p className="font-mono-label text-muted-foreground">3/3 boosts claimed. Maximum queue priority reached.</p>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section id="waitlist" className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <motion.div
          className="card-surface inner-glow p-8 sm:p-10 border-accent/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-mono-label text-accent mb-3">Step 3 · Founding Access</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            athleteOS is not a tracker.<br />It&apos;s a diagnostic system.
          </h2>
          <p className="text-muted-foreground mb-1">
            You&apos;ve seen where you rank. athleteOS diagnoses what&apos;s holding you there.
          </p>
          <p className="text-sm text-muted-foreground/60">Built for serious athletes. Not for casual gym-goers.</p>

          {/* Founding pricing card */}
          <div className="mt-6 rounded-xl border border-accent/20 bg-accent/5 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono-label text-accent-light mb-1">Founding Annual</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-mono text-3xl font-bold text-foreground">₹4,999</span>
                  <span className="text-sm text-muted-foreground">/year</span>
                  <span className="font-mono text-sm text-muted-foreground line-through">₹6,999</span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-success">₹416/mo effective</span>
                  <span className="text-xs text-muted-foreground">· locked forever</span>
                </div>
              </div>
              <span className="rounded border border-accent/25 bg-accent/10 px-2.5 py-1 font-mono-label font-bold text-accent">
                29% OFF
              </span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              You&apos;re spending ₹3,000/month on protein. Spend ₹416/month knowing if it&apos;s working.{' '}
              <span className="font-bold text-accent-light">Less than half the cost of 1kg Whey.</span>
            </p>
          </div>

          {/* Standard tiers */}
          <div className="mt-3 grid grid-cols-3 gap-2">
            {TIERS.map(t => (
              <div key={t.label} className="card-surface p-3 text-center">
                <p className="font-mono-label text-muted-foreground mb-1">{t.label}</p>
                <p className="font-mono text-lg font-bold text-foreground">{t.price}</p>
                <p className="font-mono-label text-muted-foreground mt-0.5">{t.sub}</p>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 grid gap-3 sm:grid-cols-2">
            <div>
              <FieldInput type="text" placeholder="Your name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
              {errors.name && <p className="mt-1 font-mono text-xs text-destructive">{errors.name}</p>}
            </div>
            <div>
              <FieldInput type="tel" placeholder="WhatsApp number" value={form.whatsapp} onChange={v => setForm(f => ({ ...f, whatsapp: v }))} />
              {errors.whatsapp && <p className="mt-1 font-mono text-xs text-destructive">{errors.whatsapp}</p>}
            </div>
            <div className="sm:col-span-2">
              <FieldInput type="email" placeholder="you@domain.com" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} />
              {errors.email && <p className="mt-1 font-mono text-xs text-destructive">{errors.email}</p>}
            </div>
            {apiError && <p className="font-mono text-xs text-destructive sm:col-span-2">{apiError}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-accent py-4 text-sm font-bold text-white transition hover:bg-accent-light accent-glow disabled:opacity-50 sm:col-span-2"
            >
              {loading ? 'Locking price…' : 'Claim founding spot — ₹4,999/year'}
            </button>
          </form>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono-label text-muted-foreground">
              Founding pricing ends before public launch
            </p>
            <p className="text-xs text-muted-foreground">Contact: WhatsApp 6005109043</p>
          </div>
          <p className="mt-1.5 font-mono-label text-muted-foreground/60">
            Price locks on signup.{' '}
            <a href="/privacy" className="underline transition hover:text-muted-foreground">Privacy Policy</a>.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
