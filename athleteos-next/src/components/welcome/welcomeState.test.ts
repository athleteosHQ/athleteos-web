import { describe, expect, it } from 'vitest'

import { getWelcomeState } from './welcomeState'

describe('getWelcomeState', () => {
  it('builds the result state for founders with a stored rank result', () => {
    const state = getWelcomeState({
      founder: { id: 'abc', num: 23, shareCount: 1 },
      rankResult: { overallPct: 94, weightClass: '105kg' },
      totalFounders: 142,
    })

    expect(state.hasResult).toBe(true)
    expect(state.founderNumber).toBe(23)
    expect(state.percentileLabel).toBe('Top 6%')
    expect(state.percentileSubline).toBe("You're ahead of 94% of athletes in your weight class.")
    expect(state.primaryCtaLabel).toBe('Share My Card')
    expect(state.tierLabel).toBe('Core')
    expect(state.invitesRemaining).toBe(2)
    expect(state.momentumLine).toBe('142 athletes already joined.')
  })

  it('builds the no-result activation state for founders without a stored result', () => {
    const state = getWelcomeState({
      founder: { id: 'abc', num: 23, shareCount: 0 },
      rankResult: null,
      totalFounders: 142,
    })

    expect(state.hasResult).toBe(false)
    expect(state.percentileLabel).toBe('Now see where you stand.')
    expect(state.percentileSubline).toBe('Most founding members have already checked their benchmark.')
    expect(state.primaryCtaLabel).toBe('Check My Rank')
    expect(state.helperLine).toBe('Takes less than 30 seconds.')
    expect(state.invitesRemaining).toBe(3)
  })

  it('unlocks elite tier after three invites', () => {
    const state = getWelcomeState({
      founder: { id: 'abc', num: 23, shareCount: 3 },
      rankResult: { overallPct: 62, weightClass: '83kg' },
      totalFounders: 200,
    })

    expect(state.tierLabel).toBe('Elite')
    expect(state.invitesRemaining).toBe(0)
    expect(state.progressPercent).toBe(100)
    expect(state.referralHint).toBe('Elite tier unlocked')
  })
})
