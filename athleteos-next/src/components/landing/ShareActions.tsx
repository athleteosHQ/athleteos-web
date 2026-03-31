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

const SHARE_URL = 'https://athleteos.io'

export function ShareActions({ result, diagnosisLabel, diagnosisHeadline }: ShareActionsProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [feedback, setFeedback] = useState('')

  const shareMessage = getShareMessage(result.overallPct)
  const founderLabel =
    typeof window === 'undefined' ? '' : getFounderLabel(window.localStorage.getItem('aos_founder_data'))

  const handleShare = async () => {
    trackEvent('card_share_attempted', { method: 'share_api', overallPct: result.overallPct })
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

      trackEvent('card_share_completed', { method: typeof navigator.share === 'function' ? 'native' : 'clipboard', overallPct: result.overallPct })
    } catch {
      setFeedback('Sharing was interrupted. You can try again.')
    }
  }

  const handleDownload = async () => {
    if (!cardRef.current) return
    trackEvent('card_share_attempted', { method: 'download', overallPct: result.overallPct })

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#070D14',
        scale: 2,
      })
      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/png')
      link.download = `athleteos-rank-top${100 - result.overallPct}pct.png`
      link.click()
      trackEvent('card_share_completed', { method: 'download', overallPct: result.overallPct })
    } catch {
      setFeedback('Download failed. Please try again.')
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleShare}
          className="cursor-pointer rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-accent-light min-h-[44px]"
        >
          Share My Rank
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="cursor-pointer rounded-xl border border-white/8 px-4 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-white/16 min-h-[44px]"
        >
          Download Card
        </button>
        {feedback && <span className="text-xs text-muted-foreground">{feedback}</span>}
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
