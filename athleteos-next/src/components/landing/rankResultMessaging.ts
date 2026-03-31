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
      progression: 'The question is what moves you higher.',
      preview: 'Your lift ratios and weight-class position suggest specific areas where small changes would have the most impact. The full system connects this with your nutrition and recovery data.',
      worldBenchmark: 'World benchmark: advanced competitive standard',
      lockedCards: [
        'Lift ratio breakdown vs your weight class',
        'Where the gap to the next tier actually is',
        'What changes when nutrition data is added',
      ],
      cta: 'See What Moves You Higher',
    }
  }

  if (overallPct >= 60) {
    return {
      status: `Top ${topPercent}% · ${weightClass} class`,
      identity: "You're closer than you think.",
      progression: 'The question is which variable to fix first.',
      preview: 'Your percentile and lift ratios point to a likely weak area. The full system adds nutrition and recovery context to confirm whether that is actually the bottleneck.',
      worldBenchmark: 'World benchmark: developing competitive standard',
      lockedCards: [
        'Your biggest ratio imbalance',
        'What changes when nutrition data is added',
        'How your lift balance compares to your weight class',
      ],
      cta: 'See My Next Performance Move',
    }
  }

  return {
    status: `Current level · ${weightClass} class`,
    identity: "You've got a solid starting point.",
    progression: 'The question is where to focus first.',
    preview: 'Your lift numbers give a clear picture of relative strengths. The full system layers nutrition and recovery data on top to identify the real constraint.',
    worldBenchmark: 'World benchmark: foundational competitive standard',
    lockedCards: [
      'Where to focus first based on your ratios',
      'What changes when nutrition data is added',
      'How far each lift is from the next bracket',
    ],
    cta: 'Find My Fastest Way Up',
  }
}

export type { RankResultMessaging }
