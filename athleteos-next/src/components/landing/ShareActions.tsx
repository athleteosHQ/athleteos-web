'use client'

import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'

import type { RankResult } from '@/lib/rankCalc'
import { trackEvent } from '@/lib/analytics'

import { getFounderLabel, getShareMessage } from './landingFlow'
import { RankShareCard } from './RankShareCard'

interface ShareActionsProps {
  result: RankResult
  diagnosisLabel: string
  diagnosisHeadline: string
}

const SHARE_URL = 'https://athleteos.in'

export function ShareActions({ result, diagnosisLabel, diagnosisHeadline }: ShareActionsProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [feedback, setFeedback] = useState('')

  const shareMessage = getShareMessage(result.overallPct)
  const founderLabel =
    typeof window === 'undefined' ? '' : getFounderLabel(window.localStorage.getItem('aos_founder_data'))

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'AthleteOS',
          text: shareMessage,
          url: SHARE_URL,
        })
      } else {
        await navigator.clipboard.writeText(`${shareMessage}\n${SHARE_URL}`)
        setFeedback('Link copied. Share it where serious athletes will see it.')
      }

      trackEvent('rank_card_shared', { overallPct: result.overallPct, tier: result.tier })
    } catch {
      setFeedback('Sharing was interrupted. You can try again.')
    }
  }

  const handleDownload = async () => {
    if (!cardRef.current) return

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#070D14',
        scale: 2,
      })
      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/png')
      link.download = `athleteos-rank-top${100 - result.overallPct}pct.png`
      link.click()
      trackEvent('rank_card_downloaded', { overallPct: result.overallPct, tier: result.tier })
    } catch {
      setFeedback('Download failed. Please try again.')
    }
  }

  return (
    <>
      <div
        className="rounded-2xl p-5"
        style={{ background: 'rgba(255,255,255,0.026)', border: '1px solid rgba(255,255,255,0.09)' }}
      >
        <p className="font-mono-label text-accent mb-2">Share your signal</p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Capture the rank moment now. Share it first, then continue into the full diagnosis.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="rounded-xl bg-accent px-4 py-3 text-sm font-bold text-white transition hover:bg-accent-light"
          >
            Share My Rank
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-foreground transition hover:border-white/20"
          >
            Download Card
          </button>
        </div>
        {feedback && <p className="mt-3 text-xs text-muted-foreground">{feedback}</p>}
      </div>

      <RankShareCard
        ref={cardRef}
        result={result}
        founderLabel={founderLabel}
        badgeLabel="Athlete"
        diagnosisLabel={diagnosisLabel}
        diagnosisHeadline={diagnosisHeadline}
      />
    </>
  )
}
