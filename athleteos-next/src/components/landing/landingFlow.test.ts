import { describe, expect, it } from 'vitest'

import {
  getFounderLabel,
  hasFounderData,
  getInlineSignupGateContent,
  getShareMessage,
  shouldShowSampleOutcome,
} from './landingFlow'

describe('getInlineSignupGateContent', () => {
  it('returns top-tier conversion copy for athletes in the top 10 percent', () => {
    expect(getInlineSignupGateContent(93)).toEqual({
      eyebrow: 'Founding members · first access',
      headline: "You're ahead. Now see what separates you from the top 1%.",
      productLine: 'athleteOS connects training, nutrition, and recovery into one diagnosis.',
      pricingLine: 'No payment now. Founding price locked at ₹4,999/year.',
      trustChips: ['No payment now', 'Cancel anytime', 'Price locked forever'],
    })
  })

  it('returns mid-tier conversion copy for athletes between 60 and 89 percent', () => {
    expect(getInlineSignupGateContent(72).headline).toBe(
      "You're closer than you think. See the one thing holding you back.",
    )
  })

  it('returns starting-point copy for athletes below the top 60 percent', () => {
    expect(getInlineSignupGateContent(41).headline).toBe(
      'Your starting point is clear. See the fastest path up.',
    )
  })
})

describe('getShareMessage', () => {
  it('formats the share message from the rank percentile', () => {
    expect(getShareMessage(77)).toBe(
      "I'm in the top 23% of Indian strength athletes. Check yours -> athleteos.in",
    )
  })
})

describe('shouldShowSampleOutcome', () => {
  it('shows the sample outcome before the user has a result', () => {
    expect(shouldShowSampleOutcome(null)).toBe(true)
  })

  it('hides the sample outcome once the user has a result', () => {
    expect(shouldShowSampleOutcome({ overallPct: 63 })).toBe(false)
  })
})

describe('getFounderLabel', () => {
  it('reads the founder number from local storage payloads', () => {
    expect(getFounderLabel('{"id":"abc","num":23,"shareCount":0}')).toBe('Founding Member #23')
  })

  it('falls back cleanly on invalid payloads', () => {
    expect(getFounderLabel('not-json')).toBe('')
    expect(getFounderLabel(null)).toBe('')
  })
})

describe('hasFounderData', () => {
  it('treats stored founder payloads with a founder number as joined', () => {
    expect(hasFounderData('{"id":"abc","num":23,"shareCount":0}')).toBe(true)
  })

  it('rejects missing or malformed founder payloads', () => {
    expect(hasFounderData('{"id":"abc"}')).toBe(false)
    expect(hasFounderData('not-json')).toBe(false)
    expect(hasFounderData(null)).toBe(false)
  })
})
