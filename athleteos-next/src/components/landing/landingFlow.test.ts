import { describe, expect, it } from 'vitest'
import {
  getFounderLabel,
  hasFounderData,
  getInlineSignupGateContent,
  getShareMessage,
} from './landingFlow'

describe('getInlineSignupGateContent', () => {
  it('returns default gate content when overallPct is null', () => {
    const content = getInlineSignupGateContent(null)
    expect(content.headline).toBe(
      "Your training data tells a story. The full system reads it.",
    )
  })

  it('returns top-tier copy for athletes in the top 10 percent', () => {
    const content = getInlineSignupGateContent(93)
    expect(content.headline).toBe(
      "You're already ahead of most lifters. Now find the gap that keeps you from the next tier.",
    )
  })

  it('returns mid-tier copy for athletes between 60 and 89 percent', () => {
    expect(getInlineSignupGateContent(72).headline).toBe(
      "You're closer than you think. The variable holding you back probably isn't the one you blame.",
    )
  })

  it('returns starting-point copy for athletes below the top 60 percent', () => {
    expect(getInlineSignupGateContent(41).headline).toBe(
      'Your numbers show exactly where to start. AthleteOS shows what to fix first.',
    )
  })
})

describe('getShareMessage', () => {
  it('formats the share message from the rank percentile', () => {
    expect(getShareMessage(77)).toBe(
      "I'm in the top 23% of competitive strength athletes. Check yours -> athleteos.io",
    )
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
