import { describe, expect, it } from 'vitest'

import {
  buildLocalResetUrl,
  buildFounderResetBrowserScript,
  getFounderResetTarget,
} from './founderReset'

describe('getFounderResetTarget', () => {
  it('accepts an email target', () => {
    expect(getFounderResetTarget({ email: 'athlete@example.com' })).toEqual({
      column: 'email',
      value: 'athlete@example.com',
    })
  })

  it('accepts an id target', () => {
    expect(getFounderResetTarget({ id: 'founder-123' })).toEqual({
      column: 'id',
      value: 'founder-123',
    })
  })

  it('rejects missing targets', () => {
    expect(() => getFounderResetTarget({})).toThrow(
      'Provide exactly one of --email or --id.',
    )
  })

  it('rejects both email and id together', () => {
    expect(() =>
      getFounderResetTarget({ email: 'athlete@example.com', id: 'founder-123' }),
    ).toThrow('Provide exactly one of --email or --id.')
  })
})

describe('buildFounderResetBrowserScript', () => {
  it('returns the browser cleanup snippet', () => {
    expect(buildFounderResetBrowserScript()).toContain(
      "localStorage.removeItem('aos_founder_data')",
    )
    expect(buildFounderResetBrowserScript()).toContain(
      "localStorage.removeItem('aos_waitlist')",
    )
    expect(buildFounderResetBrowserScript()).toContain('location.reload()')
  })
})

describe('buildLocalResetUrl', () => {
  it('uses localhost by default', () => {
    expect(buildLocalResetUrl()).toBe('http://localhost:3000/reset-local')
  })

  it('normalizes a custom origin', () => {
    expect(buildLocalResetUrl('http://localhost:4000/')).toBe(
      'http://localhost:4000/reset-local',
    )
  })
})
