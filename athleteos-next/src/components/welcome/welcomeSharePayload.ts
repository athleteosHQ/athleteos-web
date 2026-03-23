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
    diagnosisLabel: 'First Read',
    shareMessage: `I got into AthleteOS early as Founding Member #${founderNumber}. I'm in the top ${topPercent}% and my first read says: ${diagnosisHeadline} Check yours 👇`,
  }
}

export type { WelcomeSharePayload }
