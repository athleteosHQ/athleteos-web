import { describe, expect, it } from 'vitest'

import type { RankResult } from '@/lib/rankCalc'

import { getFirstReadDiagnosis } from './firstReadDiagnosis'

function makeResult(overrides: Partial<RankResult>): RankResult {
  return {
    weightClass: '93kg',
    tier: 'Advanced',
    tierColor: '#F59E0B',
    overallPct: 72,
    athleteScore: 71,
    squat: { estimated1RM: 220, percentile: 78 },
    bench: { estimated1RM: 130, percentile: 46 },
    deadlift: { estimated1RM: 250, percentile: 81 },
    ...overrides,
  }
}

describe('getFirstReadDiagnosis', () => {
  it('flags a clearly lagging lift as the first read', () => {
    const diagnosis = getFirstReadDiagnosis(makeResult({}))

    expect(diagnosis.label).toBe('First Read')
    expect(diagnosis.headline).toBe('Bench is the clearest gap in your current profile.')
    expect(diagnosis.body).toContain('Bringing it closer to your squat and deadlift')
  })

  it('calls out balanced profiles as needing precision rather than broad changes', () => {
    const diagnosis = getFirstReadDiagnosis(
      makeResult({
        overallPct: 91,
        squat: { estimated1RM: 260, percentile: 91 },
        bench: { estimated1RM: 170, percentile: 88 },
        deadlift: { estimated1RM: 295, percentile: 92 },
      }),
    )

    expect(diagnosis.headline).toBe('Your profile is already well balanced.')
    expect(diagnosis.body).toContain('precision')
  })

  it('asks for more data when the result is built from one lift only', () => {
    const diagnosis = getFirstReadDiagnosis(
      makeResult({
        overallPct: 44,
        squat: { estimated1RM: 0, percentile: 0 },
        bench: { estimated1RM: 110, percentile: 44 },
        deadlift: { estimated1RM: 0, percentile: 0 },
      }),
    )

    expect(diagnosis.headline).toBe('This is a useful start, but the read is still partial.')
    expect(diagnosis.body).toContain('Add your other lifts')
  })
})
