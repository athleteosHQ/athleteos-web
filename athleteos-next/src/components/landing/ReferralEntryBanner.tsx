'use client'

import { useEffect, useMemo, useState } from 'react'

import { useSearchParams } from 'next/navigation'

import { motion } from 'framer-motion'

import { trackEvent } from '@/lib/analytics'

import { getReferralLandingState } from './referralLandingState'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

interface ReferrerPreview {
  firstName: string | null
  founderNumber: number
}

export function ReferralEntryBanner() {
  const searchParams = useSearchParams()
  const ref = searchParams.get('ref')
  const [preview, setPreview] = useState<ReferrerPreview | null>(null)

  useEffect(() => {
    if (!ref) return

    if (ref && UUID_RE.test(ref)) {
      localStorage.setItem('aos_referrer_id', ref)
      trackEvent('referral_entry_viewed', { referrerId: ref })
    }

    fetch(`/api/founders/referrer?id=${encodeURIComponent(ref)}`)
      .then(async (response) => {
        if (!response.ok) return null
        return (await response.json()) as ReferrerPreview
      })
      .then((data) => setPreview(data))
      .catch(() => setPreview(null))
  }, [ref])

  const state = useMemo(() => {
    if (!preview) return null
    return getReferralLandingState({
      founderNumber: preview.founderNumber,
      firstName: preview.firstName,
    })
  }, [preview])

  if (!state) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="mx-auto mt-6 max-w-4xl px-6 md:px-10"
    >
      <div
        className="rounded-2xl p-5 md:p-6"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02))',
          border: '1px solid rgba(255,255,255,0.10)',
        }}
      >
        <p className="font-mono-label text-[#fafafa] mb-2">{state.eyebrow}</p>
        <p className="text-2xl font-display font-bold text-foreground md:text-3xl">{state.headline}</p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">{state.body}</p>
        <a
          href="#rank"
          onClick={() => trackEvent('referral_entry_cta_clicked', { referrerId: ref, target: 'rank' })}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 font-bold text-white transition hover:bg-accent-light"
        >
          {state.primaryCta}
        </a>
      </div>
    </motion.div>
  )
}
