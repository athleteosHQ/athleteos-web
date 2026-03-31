import { describe, expect, it } from 'vitest'
import { validateFounderForm } from './founderFormValidation'

describe('validateFounderForm', () => {
  it('rejects invalid email addresses', () => {
    expect(
      validateFounderForm({ email: 'not-an-email', whatsapp: '' }),
    ).toEqual({ email: 'Invalid email' })
  })

  it('rejects invalid phone numbers when provided', () => {
    expect(
      validateFounderForm({ email: 'athlete@example.com', whatsapp: '123' }),
    ).toEqual({ whatsapp: 'Invalid number' })
  })

  it('allows empty whatsapp (optional field)', () => {
    expect(
      validateFounderForm({ email: 'athlete@example.com', whatsapp: '' }),
    ).toEqual({})
  })

  it('returns no errors for valid inputs', () => {
    expect(
      validateFounderForm({ email: 'athlete@example.com', whatsapp: '+91 98765 43210' }),
    ).toEqual({})
  })
})
