interface RankResultMessagingInput {
  overallPct: number
  weightClass: string
}

interface RankResultMessaging {
  status: string
  identity: string
  progression: string
  preview: string
  worldBenchmark: string
  lockedCards: [string, string, string]
  cta: string
}

export function getRankResultMessaging({
  overallPct,
  weightClass,
}: RankResultMessagingInput): RankResultMessaging {
  const topPercent = Math.max(1, 100 - overallPct)

  if (overallPct >= 90) {
    return {
      status: `Top ${topPercent}% · ${weightClass} class`,
      identity: "You're already ahead.",
      progression: 'Now see what moves you higher.',
      preview: 'From your lifts and bodyweight, we can already see where your next gains are most likely to come from.',
      worldBenchmark: 'World benchmark: advanced competitive standard',
      lockedCards: [
        'Lift ratio analysis vs population norms',
        'Where your programming leaks volume',
        'Your next performance threshold',
      ],
      cta: 'See What Moves You Higher',
    }
  }

  if (overallPct >= 60) {
    return {
      status: `Top ${topPercent}% · ${weightClass} class`,
      identity: "You're closer than you think.",
      progression: 'Now see what moves you up fastest.',
      preview: 'From your current profile, we can already see the area most likely to unlock your next level of progress.',
      worldBenchmark: 'World benchmark: developing competitive standard',
      lockedCards: [
        'Your biggest ratio imbalance',
        'The variable you\'re probably ignoring',
        'Your fastest path to the next bracket',
      ],
      cta: 'See My Next Performance Move',
    }
  }

  return {
    status: `Current level · ${weightClass} class`,
    identity: "You've got a solid starting point.",
    progression: 'Now find the fastest way up.',
    preview: 'From your lifts and bodyweight, we can already see where the biggest early gains are most likely to come from.',
    worldBenchmark: 'World benchmark: foundational competitive standard',
    lockedCards: [
      'Where to focus first',
      'The lift that unlocks the most progress',
      'Your fastest path up',
    ],
    cta: 'Find My Fastest Way Up',
  }
}

export type { RankResultMessaging }
