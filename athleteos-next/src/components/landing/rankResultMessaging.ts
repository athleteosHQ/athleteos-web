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
        'What to improve first',
        'What separates you from the next tier',
        'Your next performance opportunity',
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
        'Your biggest opportunity',
        'What to fix first',
        'Your fastest path up',
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
      'Your main focus area',
      'What to improve first',
      'Your fastest path up',
    ],
    cta: 'Find My Fastest Way Up',
  }
}

export type { RankResultMessaging }
