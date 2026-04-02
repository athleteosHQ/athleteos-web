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

// Gradient text style
const gradText = {
  background: 'linear-gradient(135deg, #FF6B35, #FF0080)',
  WebkitBackgroundClip: 'text' as const,
  WebkitTextFillColor: 'transparent' as const,
  backgroundClip: 'text' as const,
}

// Gradient button style
const gradBtn = {
  background: 'linear-gradient(135deg, #FF6B35 0%, #FF0080 100%)',
  boxShadow: '0 4px 20px rgba(255,107,53,0.3), 0 2px 8px rgba(255,0,128,0.2), 0 1px 3px rgba(0,0,0,0.4)',
}

function parseFounderData(raw: string | null): StoredFounderData | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (!parsed.id || !parsed.num) return null
    return { id: parsed.id, num: parsed.num, shareCount: parsed.shareCount ?? 0 }
  } catch { return null }
}

function parseRankResult(raw: string | null): RankResult | null {
  if (!raw) return null
  try { return JSON.parse(raw) as RankResult } catch { return null }
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
      rankResult: rankResult ? { overallPct: rankResult.overallPct, weightClass: rankResult.weightClass } : null,
      totalFounders: founderCount,
    })
  }, [founder, founderCount, rankResult])

  const diagnosis = useMemo(() => (rankResult ? getFirstReadDiagnosis(rankResult) : null), [rankResult])

  const sharePayload = useMemo(() => {
    if (!rankResult || !diagnosis || !founder) return null
    return getWelcomeSharePayload({ founderNumber: founder.num, result: rankResult, diagnosisHeadline: diagnosis.headline })
  }, [diagnosis, founder, rankResult])

  useEffect(() => {
    if (!welcomeState) return
    trackEvent('welcome_viewed', { hasResult: welcomeState.hasResult, founderNumber: welcomeState.founderNumber, tier: welcomeState.tierLabel })
  }, [welcomeState])

  const inviteLink = welcomeState ? `https://athleteos.io/?ref=${welcomeState.founderId}` : 'https://athleteos.io/'

  async function copyInviteLink() {
    await navigator.clipboard.writeText(inviteLink)
    trackEvent('welcome_invite_link_copied', { founderNumber: welcomeState?.founderNumber ?? null, tier: welcomeState?.tierLabel ?? null })
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  async function generateCardImage(): Promise<File | null> {
    if (!shareCardRef.current) return null
    const canvas = await html2canvas(shareCardRef.current, { backgroundColor: null, scale: 2 })
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) { resolve(null); return }
        resolve(new File([blob], 'athleteos-rank-card.png', { type: 'image/png' }))
      }, 'image/png')
    })
  }

  async function downloadCard() {
    if (!shareCardRef.current || !rankResult) return
    trackEvent('welcome_share_card_downloaded', { founderNumber: welcomeState?.founderNumber ?? null, overallPct: rankResult.overallPct })
    setDownloading(true)
    try {
      const canvas = await html2canvas(shareCardRef.current, { backgroundColor: null, scale: 2 })
      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/png')
      link.download = 'athleteos-rank-card.png'
      link.click()
    } finally { setDownloading(false) }
  }

  async function shareToStory() {
    if (!shareCardRef.current || !rankResult || !welcomeState) return
    trackEvent('welcome_share_clicked', { channel: 'story', founderNumber: welcomeState.founderNumber, hasResult: welcomeState.hasResult })
    setDownloading(true)
    try {
      const file = await generateCardImage()
      if (!file) { setDownloading(false); return }
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'AthleteOS', text: `${sharePayload?.shareMessage ?? welcomeState.shareMessage}\n${inviteLink}` })
      } else {
        const url = URL.createObjectURL(file)
        const link = document.createElement('a')
        link.href = url; link.download = 'athleteos-rank-card.png'; link.click()
        URL.revokeObjectURL(url)
      }
    } catch { /* user cancelled */ } finally { setDownloading(false) }
  }

  async function handleShare() {
    if (!welcomeState) return
    const message = sharePayload?.shareMessage ?? welcomeState.shareMessage
    trackEvent('welcome_share_clicked', { channel: 'native', founderNumber: welcomeState.founderNumber, hasResult: welcomeState.hasResult })
    try {
      if (navigator.share) {
        await navigator.share({ title: 'AthleteOS', text: message, url: inviteLink })
      } else {
        await navigator.clipboard.writeText(`${message}\n${inviteLink}`)
        setCopied(true); window.setTimeout(() => setCopied(false), 1800)
      }
    } catch { /* user cancelled */ }
  }

  // ── Not-logged-in state ──
  if (!welcomeState || !founder) {
    return (
      <main className="grid-bg relative min-h-screen px-6 py-24 md:px-10">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8 text-center">
          <p className="font-mono-label mb-3" style={gradText}>Welcome</p>
          <h1 className="text-4xl font-display font-bold text-foreground mb-3"
            style={{ fontFamily: "'Syne', var(--font-jakarta), sans-serif" }}>
            Your founder status will appear here.
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground mb-6">
            Claim your founding spot first, then come back here to unlock your early-athlete welcome page.
          </p>
          <Link
            href="/#waitlist"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-bold text-white"
            style={gradBtn}
          >
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

      {/* Ambient gradient blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2"
          style={{ width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(255,107,53,0.12) 0%, rgba(255,0,128,0.07) 40%, transparent 70%)' }}
        />
        <div
          className="absolute right-[8%] top-[22%]"
          style={{ width: 300, height: 300, background: 'radial-gradient(circle, rgba(123,47,255,0.06) 0%, transparent 65%)' }}
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-12">

        {/* ── Hero card ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2rem] p-8 md:p-12"
          style={{
            background: 'rgba(255,255,255,0.025)',
            boxShadow: '0 24px 90px rgba(0,0,0,0.4)',
          }}
        >
          {/* Gradient border */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[2rem]"
            style={{
              background: 'linear-gradient(135deg, rgba(255,107,53,0.3), rgba(255,0,128,0.2), rgba(123,47,255,0.15))',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              WebkitMaskComposite: 'xor',
              padding: '1px',
            }}
          />
          {/* Corner glow */}
          <div
            className="pointer-events-none absolute top-0 right-0 w-64 h-64"
            style={{ background: 'radial-gradient(circle at top right, rgba(255,107,53,0.1), rgba(255,0,128,0.06) 40%, transparent 70%)' }}
          />

          <div className="max-w-4xl relative z-10">
            <p className="font-mono-label mb-4" style={gradText}>Athletes are joining fast.</p>
            <h1
              className="text-5xl font-bold tracking-tight text-foreground md:text-7xl"
              style={{ fontFamily: "'Syne', var(--font-jakarta), sans-serif", letterSpacing: '-0.03em' }}
            >
              You&apos;re early.
            </h1>
            <p
              className="mt-3 text-2xl font-bold text-foreground md:text-4xl"
              style={{ fontFamily: "'Syne', var(--font-jakarta), sans-serif" }}
            >
              Founding Member #{welcomeState.founderNumber}
            </p>
            <p className="mt-3 text-lg text-muted-foreground md:text-xl">You train with intent.</p>

            <div className="mt-10 space-y-3">
              <p
                className="text-4xl font-bold text-foreground md:text-6xl"
                style={{ fontFamily: "'Syne', var(--font-jakarta), sans-serif" }}
              >
                {welcomeState.percentileLabel}
              </p>
              <p className="text-lg font-medium text-foreground/90 md:text-2xl">{welcomeState.percentileSubline}</p>
              <p className="text-sm text-muted-foreground md:text-base">{welcomeState.helperLine}</p>

              {diagnosis && (
                <div
                  className="max-w-2xl rounded-2xl px-4 py-4"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,107,53,0.15)' }}
                >
                  <p className="font-mono-label mb-2" style={gradText}>{diagnosis.label}</p>
                  <p className="text-base font-semibold text-foreground md:text-lg">{diagnosis.headline}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground md:text-base">{diagnosis.body}</p>
                </div>
              )}

              <p
                className="text-2xl font-bold md:text-3xl"
                style={{ fontFamily: "'Syne', var(--font-jakarta), sans-serif", ...gradText }}
              >
                {welcomeState.hasResult ? 'Next stop: Top 1%.' : 'Your benchmark is the starting point for everything that comes next.'}
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {welcomeState.hasResult ? (
                <>
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-bold text-white transition-opacity hover:opacity-90"
                    style={gradBtn}
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
                  className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-bold text-white transition-opacity hover:opacity-90"
                  style={gradBtn}
                >
                  Check My Rank
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        </motion.section>

        {/* ── Performance card + referral ── */}
        {rankResult && (
          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] border border-white/[0.08] p-6 md:p-8" style={{ background: 'rgba(255,255,255,0.025)' }}>
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono-label mb-2" style={gradText}>Performance Card</p>
                  <p className="text-3xl font-display font-bold text-foreground md:text-5xl">{welcomeState.percentileLabel}</p>
                  <p className="mt-2 text-base text-muted-foreground">{welcomeState.percentileSubline}</p>
                </div>
                <div
                  className="rounded-full px-3 py-1.5 text-xs font-semibold"
                  style={{ background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.25)', color: '#FF6B35' }}
                >
                  {sharePayload?.badgeLabel ?? 'Early Athlete'}
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/[0.08] p-6" style={{ background: 'rgba(0,0,0,0.35)', boxShadow: '0 18px 50px rgba(0,0,0,0.35)' }}>
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono-label mb-2" style={gradText}>{sharePayload?.badgeLabel ?? 'Early Athlete'}</p>
                    <p className="text-4xl font-display font-bold text-foreground">{welcomeState.percentileLabel}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{welcomeState.helperLine}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono-label text-muted-foreground mb-1">Founding Status</p>
                    <p className="text-lg font-bold text-foreground">{sharePayload?.foundingLabel ?? `#${welcomeState.founderNumber}`}</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-4">
                  <p className="text-base font-semibold text-foreground">{welcomeState.percentileSubline}</p>
                  {diagnosis && <p className="mt-2 text-sm text-muted-foreground">{diagnosis.headline}</p>}
                  <p className="mt-2 text-sm font-bold" style={gradText}>Next stop: Top 1%.</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={shareToStory}
                  disabled={downloading}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={gradBtn}
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

            <ReferralPanel
              welcomeState={welcomeState}
              inviteLink={inviteLink}
              copied={copied}
              onCopy={copyInviteLink}
              onShare={handleShare}
            />
          </section>
        )}

        {/* ── No rank yet ── */}
        {!rankResult && (
          <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[2rem] border border-white/[0.08] bg-white/[0.025] p-6 md:p-8">
              <p className="font-mono-label mb-2" style={gradText}>Early Athlete</p>
              <h2 className="text-4xl font-display font-bold text-foreground" style={{ fontFamily: "'Syne', var(--font-jakarta), sans-serif" }}>
                Now see where you stand.
              </h2>
              <p className="mt-3 max-w-xl text-lg leading-relaxed text-muted-foreground">
                Most founding members have already checked their benchmark. Yours is the starting point for everything that comes next.
              </p>
              <p className="mt-3 text-sm text-muted-foreground">Takes less than 30 seconds.</p>
              <Link
                href="/#rank"
                className="mt-8 inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-bold text-white transition-opacity hover:opacity-90"
                style={gradBtn}
              >
                Check My Rank
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <ReferralPanel
              welcomeState={welcomeState}
              inviteLink={inviteLink}
              copied={copied}
              onCopy={copyInviteLink}
              onShare={handleShare}
            />
          </section>
        )}

        {/* ── Founding benefits + next steps ── */}
        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-white/[0.08] bg-white/[0.02] p-6 md:p-8">
            <p className="font-mono-label mb-2" style={gradText}>Founding Status</p>
            <h2 className="text-3xl font-display font-bold text-foreground" style={{ fontFamily: "'Syne', var(--font-jakarta), sans-serif" }}>
              Only founding members get this. Forever.
            </h2>
            <div className="mt-6 grid gap-3">
              {[
                '₹2,999/year (₹250/mo vs ₹599 regular) — locked for life',
                'Founding member badge',
                'Early access before public launch',
                'Priority access to new features',
                'Private athlete community',
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-4 py-3">
                  <div
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
                    style={{ background: 'rgba(255,107,53,0.12)', border: '1px solid rgba(255,107,53,0.2)' }}
                  >
                    <Check className="h-4 w-4" style={{ color: '#FF6B35' }} />
                  </div>
                  <p className="text-sm font-medium text-foreground">{benefit}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Members who join later won&apos;t get these terms.</p>
          </div>

          <div className="rounded-[2rem] border border-white/[0.08] bg-white/[0.02] p-6 md:p-8">
            <p className="font-mono-label mb-2" style={gradText}>What Happens Next</p>
            <h2 className="text-3xl font-display font-bold text-foreground" style={{ fontFamily: "'Syne', var(--font-jakarta), sans-serif" }}>
              You&apos;ll get access before public launch.
            </h2>
            <div className="mt-6 space-y-4">
              {[
                'Your founding status is locked in',
                "We're building your performance system",
                "You'll get access before everyone else",
              ].map((step, index) => (
                <div key={step} className="flex items-start gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-4 py-4">
                  <div
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full font-mono text-sm font-bold"
                    style={{ ...gradText, background: 'linear-gradient(135deg, #FF6B35, #FF0080)' }}
                  >
                    0{index + 1}
                  </div>
                  <p className="pt-1 text-sm font-medium text-foreground">{step}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">We&apos;ll keep you updated by email and WhatsApp.</p>
          </div>
        </section>

        {/* ── Community section ── */}
        <section className="rounded-[2rem] border border-white/[0.08] bg-white/[0.02] p-6 md:p-8">
          <p className="font-mono-label mb-2" style={gradText}>Early Circle</p>
          <h2 className="text-3xl font-display font-bold text-foreground" style={{ fontFamily: "'Syne', var(--font-jakarta), sans-serif" }}>
            You&apos;re in early with athletes who train seriously.
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            We&apos;ll open a private channel for founding members before launch. Selective, not noisy.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-foreground">
            <Users className="h-4 w-4" style={{ color: '#FF6B35' }} />
            Community access opens soon.
          </div>
        </section>
      </div>
    </main>
  )
}

// ── Referral panel ────────────────────────────────────────────────────────
interface ReferralPanelProps {
  welcomeState: NonNullable<ReturnType<typeof getWelcomeState>>
  inviteLink: string
  copied: boolean
  onCopy: () => void
  onShare: () => void
}

function ReferralPanel({ welcomeState, inviteLink, copied, onCopy, onShare }: ReferralPanelProps) {
  return (
    <div className="rounded-[2rem] border border-white/[0.08] bg-white/[0.02] p-6 md:p-8">
      <p className="font-mono-label mb-2" style={{
        background: 'linear-gradient(135deg, #FF6B35, #FF0080)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>{welcomeState.bridgeLine}</p>
      <h2 className="text-3xl font-display font-bold text-foreground" style={{ fontFamily: "'Syne', var(--font-jakarta), sans-serif" }}>
        Move up the founding list
      </h2>
      <p className="mt-2 text-base text-muted-foreground">{welcomeState.momentumLine}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
          <p className="font-mono-label text-muted-foreground mb-2">Position</p>
          <p className="text-3xl font-display font-bold text-foreground">#{Math.max(1, welcomeState.founderNumber - welcomeState.shareCount * 100)}</p>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
          <p className="font-mono-label text-muted-foreground mb-2">Tier</p>
          <p className="text-3xl font-display font-bold text-foreground">{welcomeState.tierLabel}</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
        <div className="mb-2 flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-foreground">Progress to Elite</p>
          <p className="font-mono text-xs font-bold" style={{ color: '#FF6B35' }}>{welcomeState.progressPercent}%</p>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${welcomeState.progressPercent}%`, background: 'linear-gradient(90deg, #FF6B35, #FF0080, #7B2FFF)' }}
          />
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{welcomeState.referralHint}</p>
        <p className="mt-1 text-sm text-foreground">Invite 3 serious athletes to unlock Elite tier.</p>
      </div>

      <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
        <p className="font-mono-label text-muted-foreground mb-2">Invite link</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            readOnly
            value={inviteLink}
            className="min-w-0 flex-1 rounded-xl border border-white/[0.08] bg-black/40 px-4 py-3 text-sm text-foreground outline-none"
          />
          <button
            onClick={onCopy}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-foreground transition hover:border-white/20 hover:bg-white/[0.03]"
          >
            <Copy className="h-4 w-4" />
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="mt-4">
          <button
            onClick={onShare}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF0080 100%)', boxShadow: '0 4px 20px rgba(255,107,53,0.3)' }}
          >
            <Share2 className="h-4 w-4" />
            Share invite
          </button>
        </div>
      </div>
    </div>
  )
}
