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
  strengthAge: { years: '5+', description: 'Consistent with 5+ years of structured training' },
  efficiencyScore: { pct: 62, ceilingTotal: 1100, actualTotal: 710 },
}

describe('getWelcomeSharePayload', () => {
  it('builds a share message that includes status and diagnosis', () => {
    const payload = getWelcomeSharePayload({
      diagnosisHeadline: 'Bench is the clearest gap in your current profile.',
    })

    expect(payload.shareMessage).toContain('Founding Member')
    expect(payload.shareMessage).toContain('bench')
    expect(payload.shareMessage).toContain('First Cohort')
    expect(payload.shareMessage).toContain('athleteos.io')
  })

  it('builds card labels that reinforce identity and next-step utility', () => {
    const payload = getWelcomeSharePayload({
      diagnosisHeadline: 'Bench is the clearest gap in your current profile.',
    })

    expect(payload.badgeLabel).toBe('Founding Member')
    expect(payload.foundingLabel).toBe('First Cohort')
    expect(payload.diagnosisLabel).toBe('Primary Constraint')
  })
})
