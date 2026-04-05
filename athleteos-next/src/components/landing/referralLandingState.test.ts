import { describe, expect, it } from 'vitest'

import { getReferralLandingState } from './referralLandingState'

describe('getReferralLandingState', () => {
  it('builds inviter-aware copy when founder details are available', () => {
    const state = getReferralLandingState({ founderNumber: 23, firstName: 'Aman' })

    expect(state.eyebrow).toBe('Invited by a founding member')
    expect(state.headline).toBe('Aman got in early as a Founding Member in the First Cohort.')
    expect(state.body.toLowerCase()).toContain('check where you stand')
    expect(state.primaryCta).toBe('Check My Rank')
  })

  it('falls back gracefully when only founder number is known', () => {
    const state = getReferralLandingState({ founderNumber: 23 })

    expect(state.headline).toBe('A Founding Member in the First Cohort got in early.')
    expect(state.body.toLowerCase()).toContain('check where you stand')
  })
})
