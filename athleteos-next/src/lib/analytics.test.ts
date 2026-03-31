import { describe, expect, it } from 'vitest'

import { buildAnalyticsEvent } from './analytics'

describe('buildAnalyticsEvent', () => {
  it('builds a stable analytics envelope with event and props', () => {
    const payload = buildAnalyticsEvent('welcome_share_clicked', {
      channel: 'whatsapp',
      founderNumber: 23,
    }, '/welcome')

    expect(payload.event).toBe('welcome_share_clicked')
    expect(payload.path).toBe('/welcome')
    expect(payload.props).toEqual({
      channel: 'whatsapp',
      founderNumber: 23,
    })
    expect(typeof payload.ts).toBe('string')
  })
})
