import { describe, expect, it } from 'vitest'

import { getRankResultMessaging } from './rankResultMessaging'

describe('getRankResultMessaging', () => {
  it('returns top-tier messaging for athletes in the top 10 percent', () => {
    const messaging = getRankResultMessaging({ overallPct: 94, weightClass: '105kg' })

    expect(messaging.status).toBe('Top 6% · 105kg class')
    expect(messaging.identity).toBe("You're already ahead.")
    expect(messaging.worldBenchmark).toBe('World benchmark: advanced competitive standard')
    expect(messaging.cta).toBe('See What Moves You Higher')
    expect(messaging.lockedCards).toEqual([
      'What to improve first',
      'What separates you from the next tier',
      'Your next performance opportunity',
    ])
  })

  it('returns mid-tier messaging for athletes between the top 11 and 40 percent', () => {
    const messaging = getRankResultMessaging({ overallPct: 62, weightClass: '83kg' })

    expect(messaging.status).toBe('Top 38% · 83kg class')
    expect(messaging.identity).toBe("You're closer than you think.")
    expect(messaging.worldBenchmark).toBe('World benchmark: developing competitive standard')
    expect(messaging.preview).toContain('next level of progress')
    expect(messaging.cta).toBe('See My Next Performance Move')
  })

  it('returns lower-tier messaging for athletes below the top 40 percent', () => {
    const messaging = getRankResultMessaging({ overallPct: 34, weightClass: '74kg' })

    expect(messaging.status).toBe('Current level · 74kg class')
    expect(messaging.identity).toBe("You've got a solid starting point.")
    expect(messaging.worldBenchmark).toBe('World benchmark: foundational competitive standard')
    expect(messaging.progression).toBe('Now find the fastest way up.')
    expect(messaging.cta).toBe('Find My Fastest Way Up')
  })
})
