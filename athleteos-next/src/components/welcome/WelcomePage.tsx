'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import Link from 'next/link'
import html2canvas from 'html2canvas'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Copy, Download, Share2, Users } from 'lucide-react'

import { RankShareCard } from '@/components/landing/RankShareCard'
import { getFirstReadDiagnosis } from '@/components/landing/firstReadDiagnosis'
import { trackEvent } from '@/lib/analytics'
import { getFounderCount } from '@/lib/supabase'
import type { RankResult } from '@/lib/rankCalc'

import { getWelcomeState, type StoredFounderData } from './welcomeState'
import { getWelcomeSharePayload } from './welcomeSharePayload'

function parseFounderData(raw: string | null): StoredFounderData | null {
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw)
    if (!parsed.id || !parsed.num) return null
    return { id: parsed.id, num: parsed.num, shareCount: parsed.shareCount ?? 0 }
  } catch {
    return null
  }
}

function parseRankResult(raw: string | null): RankResult | null {
  if (!raw) return null

  try {
    return JSON.parse(raw) as RankResult
  } catch {
    return null
  }
}

export function WelcomePage() {
  const [founder, setFounder] = useState<StoredFounderData | null>(null)
  const [rankResult, setRankResult] = useState<RankResult | null>(null)
  const [founderCount, setFounderCount] = useState(142)
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const shareCardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setFounder(parseFounderData(localStorage.getItem('aos_founder_data')))
    setRankResult(parseRankResult(localStorage.getItem('aos_rank_result')))
    getFounderCount().then(setFounderCount).catch(() => {})
  }, [])

  const welcomeState = useMemo(() => {
    if (!founder) return null
    return getWelcomeState({
      founder,
      rankResult: rankResult
        ? { overallPct: rankResult.overallPct, weightClass: rankResult.weightClass }
        : null,
      totalFounders: founderCount,
    })
  }, [founder, founderCount, rankResult])
  const diagnosis = useMemo(() => (rankResult ? getFirstReadDiagnosis(rankResult) : null), [rankResult])
  const sharePayload = useMemo(() => {
    if (!rankResult || !diagnosis || !founder) return null
    return getWelcomeSharePayload({
      founderNumber: founder.num,
      result: rankResult,
      diagnosisHeadline: diagnosis.headline,
    })
  }, [diagnosis, founder, rankResult])

  useEffect(() => {
    if (!welcomeState) return
    trackEvent('welcome_viewed', {
      hasResult: welcomeState.hasResult,
      founderNumber: welcomeState.founderNumber,
      tier: welcomeState.tierLabel,
    })
  }, [welcomeState])

  const inviteLink = welcomeState
    ? `https://athleteos.io/?ref=${welcomeState.founderId}`
    : 'https://athleteos.io/'

  async function copyInviteLink() {
    await navigator.clipboard.writeText(inviteLink)
    trackEvent('welcome_invite_link_copied', {
      founderNumber: welcomeState?.founderNumber ?? null,
      tier: welcomeState?.tierLabel ?? null,
    })
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  async function generateCardImage(): Promise<File | null> {
    if (!shareCardRef.current) return null
    const canvas = await html2canvas(shareCardRef.current, {
      backgroundColor: null,
      scale: 2,
    })
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) { resolve(null); return }
        resolve(new File([blob], 'athleteos-rank-card.png', { type: 'image/png' }))
      }, 'image/png')
    })
  }

  async function downloadCard() {
    if (!shareCardRef.current || !rankResult) return
    trackEvent('welcome_share_card_downloaded', {
      founderNumber: welcomeState?.founderNumber ?? null,
      overallPct: rankResult.overallPct,
    })
    setDownloading(true)
    try {
      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: null,
        scale: 2,
      })
      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/png')
      link.download = 'athleteos-rank-card.png'
      link.click()
    } finally {
      setDownloading(false)
    }
  }

  async function shareToStory() {
    if (!shareCardRef.current || !rankResult || !welcomeState) return
    trackEvent('welcome_share_clicked', {
      channel: 'story',
      founderNumber: welcomeState.founderNumber,
      hasResult: welcomeState.hasResult,
    })
    setDownloading(true)
    try {
      const file = await generateCardImage()
      if (!file) { setDownloading(false); return }

      // Web Share API with file — opens native share sheet with Instagram Stories as an option on mobile
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'AthleteOS',
          text: `${sharePayload?.shareMessage ?? welcomeState.shareMessage}\n${inviteLink}`,
        })
      } else {
        // Fallback: download the image so user can manually add to story
        const url = URL.createObjectURL(file)
        const link = document.createElement('a')
        link.href = url
        link.download = 'athleteos-rank-card.png'
        link.click()
        URL.revokeObjectURL(url)
      }
    } catch {
      // User cancelled share sheet
    } finally {
      setDownloading(false)
    }
  }

  async function handleShare() {
    if (!welcomeState) return
    const message = sharePayload?.shareMessage ?? welcomeState.shareMessage
    trackEvent('welcome_share_clicked', {
      channel: 'native',
      founderNumber: welcomeState.founderNumber,
      hasResult: welcomeState.hasResult,
    })
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'AthleteOS',
          text: message,
          url: inviteLink,
        })
      } else {
        await navigator.clipboard.writeText(`${message}\n${inviteLink}`)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1800)
      }
    } catch {
      // User cancelled share sheet — not an error
    }
  }

  if (!welcomeState || !founder) {
    return (
      <main className="grid-bg relative min-h-screen px-6 py-24 md:px-10">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/8 bg-white/[0.02] p-8 text-center">
          <p className="font-mono-label text-[#fafafa] mb-3">Welcome</p>
          <h1 className="text-4xl font-display font-bold text-foreground mb-3">Your founder status will appear here.</h1>
          <p className="text-base leading-relaxed text-muted-foreground mb-6">
            Claim your founding spot first, then come back here to unlock your early-athlete welcome page.
          </p>
          <Link href="/#waitlist" className="cta-glow inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 font-bold text-white transition hover:bg-accent-light">
            Reserve My Founding Spot
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="grid-bg relative min-h-screen overflow-hidden bg-background px-6 py-10 md:px-10 md:py-14">
      {rankResult && sharePayload && diagnosis && (
        <RankShareCard
          ref={shareCardRef}
          result={rankResult}
          founderLabel={sharePayload.foundingLabel}
          badgeLabel={sharePayload.badgeLabel}
          diagnosisLabel={sharePayload.diagnosisLabel}
          diagnosisHeadline={diagnosis.headline}
        />
      )}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-white/[0.04] blur-[120px]" />
        <div className="absolute right-[8%] top-[22%] h-48 w-48 rounded-full bg-success/6 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-12">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-8 shadow-[0_24px_90px_rgba(0,0,0,0.38)] md:p-12"
        >
          <div className="max-w-4xl">
            <p className="font-mono-label text-[#fafafa] mb-4">Athletes are joining fast.</p>
            <h1 className="text-5xl font-display font-bold tracking-tight text-foreground md:text-7xl">You&apos;re early.</h1>
            <p className="mt-3 font-display text-2xl font-bold text-foreground md:text-4xl">Founding Member #{welcomeState.founderNumber}</p>
            <p className="mt-3 text-lg text-muted-foreground md:text-xl">You train with intent.</p>

            <div className="mt-10 space-y-3">
              <p className="text-4xl font-display font-bold text-foreground md:text-6xl">{welcomeState.percentileLabel}</p>
              <p className="text-lg font-medium text-foreground/90 md:text-2xl">{welcomeState.percentileSubline}</p>
              <p className="text-sm text-muted-foreground md:text-base">{welcomeState.helperLine}</p>
              {diagnosis && (
                <div className="max-w-2xl rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                  <p className="font-mono-label text-[#fafafa] mb-2">{diagnosis.label}</p>
                  <p className="text-base font-semibold text-foreground md:text-lg">{diagnosis.headline}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground md:text-base">{diagnosis.body}</p>
                </div>
              )}
              {welcomeState.hasResult ? (
                <p className="font-display text-2xl font-bold text-[#fafafa] md:text-3xl">Next stop: Top 1%.</p>
              ) : (
                <p className="font-display text-2xl font-bold text-[#fafafa] md:text-3xl">
                  Your benchmark is the starting point for everything that comes next.
                </p>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {welcomeState.hasResult ? (
                <>
                  <button
                    onClick={handleShare}
                    className="cta-glow inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 font-bold text-white transition hover:bg-accent-light"
                  >
                    <Share2 className="h-4 w-4" />
                    Share My Rank
                  </button>
                  <Link
                    href="/#rank"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-6 py-3.5 font-bold text-foreground transition hover:border-white/20 hover:bg-white/[0.03]"
                  >
                    See What Moves Me Higher
                  </Link>
                </>
              ) : (
                <Link
                  href="/#rank"
                  className="cta-glow inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 font-bold text-white transition hover:bg-accent-light"
                >
                  Check My Rank
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        </motion.section>

        {rankResult && (
          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div
              className="rounded-[2rem] border border-white/8 p-6 md:p-8"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono-label text-[#fafafa] mb-2">Performance Card</p>
                  <p className="text-3xl font-display font-bold text-foreground md:text-5xl">{welcomeState.percentileLabel}</p>
                  <p className="mt-2 text-base text-muted-foreground">{welcomeState.percentileSubline}</p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-[#fafafa]">
                  {sharePayload?.badgeLabel ?? 'Early Athlete'}
                </div>
              </div>

              <div
                className="rounded-[1.5rem] border border-white/8 bg-[#070D14] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.34)]"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono-label text-[#fafafa] mb-2">{sharePayload?.badgeLabel ?? 'Early Athlete'}</p>
                    <p className="text-4xl font-display font-bold text-foreground">{welcomeState.percentileLabel}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{welcomeState.helperLine}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono-label text-muted-foreground mb-1">Founding Status</p>
                    <p className="text-lg font-bold text-foreground">{sharePayload?.foundingLabel ?? `#${welcomeState.founderNumber}`}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                  <p className="text-base font-semibold text-foreground">{welcomeState.percentileSubline}</p>
                  {diagnosis && <p className="mt-2 text-sm text-muted-foreground">{diagnosis.headline}</p>}
                  <p className="mt-2 text-sm text-[#fafafa]">Next stop: Top 1%.</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={shareToStory}
                  disabled={downloading}
                  className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-bold text-white transition hover:bg-accent-light disabled:opacity-50"
                >
                  <Share2 className="h-4 w-4" />
                  {downloading ? 'Preparing…' : 'Share as Story'}
                </button>
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-foreground transition hover:border-white/20 hover:bg-white/[0.03]"
                >
                  Share link
                </button>
                <button
                  onClick={downloadCard}
                  disabled={downloading}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-foreground transition hover:border-white/20 hover:bg-white/[0.03] disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  Save image
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/8 bg-white/[0.02] p-6 md:p-8">
              <p className="font-mono-label text-[#fafafa] mb-2">{welcomeState.bridgeLine}</p>
              <h2 className="text-3xl font-display font-bold text-foreground">Move up the founding list</h2>
              <p className="mt-2 text-base text-muted-foreground">{welcomeState.momentumLine}</p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                  <p className="font-mono-label text-muted-foreground mb-2">Position</p>
                  <p className="text-3xl font-display font-bold text-foreground">#{Math.max(1, welcomeState.founderNumber - welcomeState.shareCount * 100)}</p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                  <p className="font-mono-label text-muted-foreground mb-2">Tier</p>
                  <p className="text-3xl font-display font-bold text-foreground">{welcomeState.tierLabel}</p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                <div className="mb-2 flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-foreground">Progress to Elite</p>
                  <p className="font-mono text-xs font-bold text-[#fafafa]">{welcomeState.progressPercent}%</p>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,rgba(255,255,255,0.3),rgba(255,255,255,0.1))] transition-all duration-700"
                    style={{ width: `${welcomeState.progressPercent}%` }}
                  />
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{welcomeState.referralHint}</p>
                <p className="mt-1 text-sm text-foreground">Invite 3 serious athletes to unlock Elite tier.</p>
              </div>

              <div className="mt-6 rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                <p className="font-mono-label text-muted-foreground mb-2">Invite link</p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    readOnly
                    value={inviteLink}
                    className="min-w-0 flex-1 rounded-xl border border-white/8 bg-[#0B1118] px-4 py-3 text-sm text-foreground outline-none"
                  />
                  <button
                    onClick={copyInviteLink}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-foreground transition hover:border-white/20 hover:bg-white/[0.03]"
                  >
                    <Copy className="h-4 w-4" />
                    {copied ? 'Invite link copied' : 'Copy invite link'}
                  </button>
                </div>
                <div className="mt-4">
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 font-bold text-white transition hover:bg-accent-light"
                  >
                    <Share2 className="h-4 w-4" />
                    Share invite
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {!rankResult && (
          <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[2rem] border border-white/8 bg-white/[0.03] p-6 md:p-8">
              <p className="font-mono-label text-[#fafafa] mb-2">Early Athlete</p>
              <h2 className="text-4xl font-display font-bold text-foreground">Now see where you stand.</h2>
              <p className="mt-3 max-w-xl text-lg leading-relaxed text-muted-foreground">
                Most founding members have already checked their benchmark. Yours is the starting point for everything that comes next.
              </p>
              <p className="mt-3 text-sm text-muted-foreground">Takes less than 30 seconds.</p>
              <Link
                href="/#rank"
                className="cta-glow mt-8 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 font-bold text-white transition hover:bg-accent-light"
              >
                Check My Rank
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-[2rem] border border-white/8 bg-white/[0.02] p-6 md:p-8">
              <p className="font-mono-label text-[#fafafa] mb-2">{welcomeState.bridgeLine}</p>
              <h2 className="text-3xl font-display font-bold text-foreground">Move up the founding list</h2>
              <p className="mt-2 text-base text-muted-foreground">{welcomeState.momentumLine}</p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                  <p className="font-mono-label text-muted-foreground mb-2">Position</p>
                  <p className="text-3xl font-display font-bold text-foreground">#{welcomeState.founderNumber}</p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                  <p className="font-mono-label text-muted-foreground mb-2">Tier</p>
                  <p className="text-3xl font-display font-bold text-foreground">{welcomeState.tierLabel}</p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                <div className="mb-2 flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-foreground">Progress to Elite</p>
                  <p className="font-mono text-xs font-bold text-[#fafafa]">{welcomeState.progressPercent}%</p>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,rgba(255,255,255,0.3),rgba(255,255,255,0.1))] transition-all duration-700"
                    style={{ width: `${welcomeState.progressPercent}%` }}
                  />
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{welcomeState.referralHint}</p>
              </div>

              <div className="mt-6 rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                <p className="font-mono-label text-muted-foreground mb-2">Invite link</p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    readOnly
                    value={inviteLink}
                    className="min-w-0 flex-1 rounded-xl border border-white/8 bg-[#0B1118] px-4 py-3 text-sm text-foreground outline-none"
                  />
                  <button
                    onClick={copyInviteLink}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-foreground transition hover:border-white/20 hover:bg-white/[0.03]"
                  >
                    <Copy className="h-4 w-4" />
                    {copied ? 'Invite link copied' : 'Copy invite link'}
                  </button>
                </div>
                <button
                  onClick={handleShare}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 font-bold text-white transition hover:bg-accent-light"
                >
                  <Share2 className="h-4 w-4" />
                  Share invite
                </button>
              </div>
            </div>
          </section>
        )}

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-white/8 bg-white/[0.02] p-6 md:p-8">
            <p className="font-mono-label text-[#fafafa] mb-2">Founding Status</p>
            <h2 className="text-3xl font-display font-bold text-foreground">Only founding members get this. Forever.</h2>
            <div className="mt-6 grid gap-3">
              {[
                '\u20B92,999/year (\u20B9250/mo vs \u20B9599 regular) — locked for life',
                'Founding member badge',
                'Early access before public launch',
                'Priority access to new features',
                'Private athlete community',
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.04]">
                    <Check className="h-4 w-4 text-[#fafafa]" />
                  </div>
                  <p className="text-sm font-medium text-foreground">{benefit}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Members who join later won&apos;t get these terms.</p>
          </div>

          <div className="rounded-[2rem] border border-white/8 bg-white/[0.02] p-6 md:p-8">
            <p className="font-mono-label text-[#fafafa] mb-2">What Happens Next</p>
            <h2 className="text-3xl font-display font-bold text-foreground">You&apos;ll get access before public launch.</h2>
            <div className="mt-6 space-y-4">
              {[
                'Your founding status is locked in',
                "We're building your performance system",
                "You'll get access before everyone else",
              ].map((step, index) => (
                <div key={step} className="flex items-start gap-4 rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-4">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/[0.04] font-mono text-sm font-bold text-[#fafafa]">
                    0{index + 1}
                  </div>
                  <p className="pt-1 text-sm font-medium text-foreground">{step}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">We&apos;ll keep you updated by email and WhatsApp.</p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/8 bg-white/[0.02] p-6 md:p-8">
          <p className="font-mono-label text-[#fafafa] mb-2">Early Circle</p>
          <h2 className="text-3xl font-display font-bold text-foreground">You&apos;re in early with athletes who train seriously.</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            We&apos;ll open a private channel for founding members before launch. Selective, not noisy.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-foreground">
            <Users className="h-4 w-4 text-[#fafafa]" />
            Community access opens soon.
          </div>
        </section>
      </div>
    </main>
  )
}
