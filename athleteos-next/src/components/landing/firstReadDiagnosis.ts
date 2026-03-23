import type { RankResult } from '@/lib/rankCalc'

interface FirstReadDiagnosis {
  label: string
  headline: string
  body: string
}

type LiftKey = 'squat' | 'bench' | 'deadlift'

const LIFT_LABELS: Record<LiftKey, string> = {
  squat: 'Squat',
  bench: 'Bench',
  deadlift: 'Deadlift',
}

export function getFirstReadDiagnosis(result: RankResult): FirstReadDiagnosis {
  const lifts = (['squat', 'bench', 'deadlift'] as const)
    .map((key) => ({
      key,
      percentile: result[key].percentile,
      estimated1RM: result[key].estimated1RM,
    }))
    .filter((lift) => lift.estimated1RM > 0)

  if (lifts.length <= 1) {
    return {
      label: 'First Read',
      headline: 'This is a useful start, but the read is still partial.',
      body: 'Add your other lifts to see the clearest next move instead of guessing from one number.',
    }
  }

  const sorted = [...lifts].sort((a, b) => a.percentile - b.percentile)
  const weakest = sorted[0]
  const strongest = sorted[sorted.length - 1]
  const spread = strongest.percentile - weakest.percentile
  const average = Math.round(sorted.reduce((sum, lift) => sum + lift.percentile, 0) / sorted.length)

  if (spread >= 18) {
    return {
      label: 'First Read',
      headline: `${LIFT_LABELS[weakest.key as LiftKey]} is the clearest gap in your current profile.`,
      body: `Bringing it closer to your ${sorted.filter((lift) => lift.key !== weakest.key).map((lift) => LIFT_LABELS[lift.key as LiftKey].toLowerCase()).join(' and ')} is the fastest way to move your overall standing.`,
    }
  }

  if (average >= 80) {
    return {
      label: 'First Read',
      headline: 'Your profile is already well balanced.',
      body: 'The next jump is less about doing more everywhere and more about precision on the smallest weakness in your current setup.',
    }
  }

  return {
    label: 'First Read',
    headline: 'You have a real base to build from.',
    body: 'The next jump will come from tightening the weakest part of your lift profile instead of spreading effort across everything at once.',
  }
}

export type { FirstReadDiagnosis }
