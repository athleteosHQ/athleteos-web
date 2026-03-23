import { describe, expect, it } from 'vitest'

import type { RankResult } from '@/lib/rankCalc'

import { getWelcomeSharePayload } from './welcomeSharePayload'

const result: RankResult = {
  weightClass: '105kg',
  tier: 'Elite',
  tierColor: '#FF7A2F',
  overallPct: 94,
  athleteScore: 90,
  squat: { estimated1RM: 260, percentile: 91 },
  bench: { estimated1RM: 150, percentile: 62 },
  deadlift: { estimated1RM: 300, percentile: 94 },
}

describe('getWelcomeSharePayload', () => {
  it('builds a share message that includes status and diagnosis', () => {
    const payload = getWelcomeSharePayload({
      founderNumber: 23,
      result,
      diagnosisHeadline: 'Bench is the clearest gap in your current profile.',
    })

    expect(payload.shareMessage).toContain('Founding Member #23')
    expect(payload.shareMessage).toContain("I'm in the top 6%")
    expect(payload.shareMessage).toContain('Bench is the clearest gap')
  })

  it('builds card labels that reinforce identity and next-step utility', () => {
    const payload = getWelcomeSharePayload({
      founderNumber: 23,
      result,
      diagnosisHeadline: 'Bench is the clearest gap in your current profile.',
    })

    expect(payload.badgeLabel).toBe('Early Athlete')
    expect(payload.foundingLabel).toBe('Founding Member #23')
    expect(payload.diagnosisLabel).toBe('First Read')
  })
})
