interface StoredFounderData {
  id: string
  num: number
  shareCount?: number
}

interface StoredRankResult {
  overallPct: number
  weightClass: string
}

interface WelcomeStateInput {
  founder: StoredFounderData
  rankResult: StoredRankResult | null
  totalFounders: number
}

interface WelcomeState {
  hasResult: boolean
  founderId: string
  founderNumber: number
  shareCount: number
  percentileLabel: string
  percentileSubline: string
  helperLine: string
  bridgeLine: string
  primaryCtaLabel: string
  secondaryCtaLabel: string | null
  tierLabel: 'Core' | 'Elite'
  invitesRemaining: number
  progressPercent: number
  referralHint: string
  momentumLine: string
  shareMessage: string
}

const INVITES_FOR_ELITE = 3

export function getWelcomeState({
  founder,
  rankResult,
  totalFounders,
}: WelcomeStateInput): WelcomeState {
  const shareCount = founder.shareCount ?? 0
  const invitesRemaining = Math.max(0, INVITES_FOR_ELITE - shareCount)
  const progressPercent = Math.min(100, Math.round((shareCount / INVITES_FOR_ELITE) * 100))
  const tierLabel = invitesRemaining === 0 ? 'Elite' : 'Core'

  if (rankResult) {
    const topPercent = Math.max(1, 100 - rankResult.overallPct)

    return {
      hasResult: true,
      founderId: founder.id,
      founderNumber: founder.num,
      shareCount,
      percentileLabel: `Top ${topPercent}%`,
      percentileSubline: `You're ahead of ${rankResult.overallPct}% of athletes in your weight class.`,
      helperLine: 'Based on real performance data from athletes like you.',
      bridgeLine: 'Want to move up?',
      primaryCtaLabel: 'Share My Card',
      secondaryCtaLabel: 'See What Moves Me Higher',
      tierLabel,
      invitesRemaining,
      progressPercent,
      referralHint: invitesRemaining > 0 ? `${invitesRemaining} more invite${invitesRemaining === 1 ? '' : 's'} to unlock Elite` : 'Elite tier unlocked',
      momentumLine: `${totalFounders} athletes already joined.`,
      shareMessage: `I just got into AthleteOS early. I'm in the top ${topPercent}%. Check yours 👇`,
    }
  }

  return {
    hasResult: false,
    founderId: founder.id,
    founderNumber: founder.num,
    shareCount,
    percentileLabel: 'Now see where you stand.',
    percentileSubline: 'Most founding members have already checked their benchmark.',
    helperLine: 'Takes less than 30 seconds.',
    bridgeLine: 'Want to move up?',
    primaryCtaLabel: 'Check My Rank',
    secondaryCtaLabel: null,
    tierLabel,
    invitesRemaining,
    progressPercent,
    referralHint: invitesRemaining > 0 ? `${invitesRemaining} more invite${invitesRemaining === 1 ? '' : 's'} to unlock Elite` : 'Elite tier unlocked',
    momentumLine: `${totalFounders} athletes already joined.`,
    shareMessage: "I just got into AthleteOS early. Check where you stand 👇",
  }
}

export type { StoredFounderData, StoredRankResult, WelcomeState }
