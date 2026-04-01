import type { RankResult } from '@/lib/rankCalc'

interface WelcomeSharePayloadInput {
  founderNumber: number
  result: RankResult
  diagnosisHeadline: string
}

interface WelcomeSharePayload {
  badgeLabel: string
  foundingLabel: string
  diagnosisLabel: string
  shareMessage: string
}

export function getWelcomeSharePayload({
  founderNumber,
  result,
  diagnosisHeadline,
}: WelcomeSharePayloadInput): WelcomeSharePayload {
  const topPercent = Math.max(1, 100 - result.overallPct)

  return {
    badgeLabel: 'Early Athlete',
    foundingLabel: `Founding Member #${founderNumber}`,
    diagnosisLabel: 'Primary Constraint',
    shareMessage: `Top ${topPercent}% of competitive strength athletes. AthleteOS flagged my ${diagnosisHeadline.split(' ')[0].toLowerCase()} as the gap. Founding Member #${founderNumber} — check where you stand: athleteos.io`,
  }
}

export type { WelcomeSharePayload }
