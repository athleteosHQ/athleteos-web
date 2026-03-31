import { describe, expect, it } from 'vitest'

import { validateFounderForm } from './founderFormValidation'

describe('validateFounderForm', () => {
  it('requires a non-empty name', () => {
    expect(
      validateFounderForm({
        name: '   ',
        email: 'athlete@example.com',
        whatsapp: '+919876543210',
      }),
    ).toEqual({ name: 'Required' })
  })

  it('rejects invalid email addresses', () => {
    expect(
      validateFounderForm({
        name: 'Athlete',
        email: 'not-an-email',
        whatsapp: '+919876543210',
      }),
    ).toEqual({ email: 'Invalid email' })
  })

  it('rejects invalid phone numbers', () => {
    expect(
      validateFounderForm({
        name: 'Athlete',
        email: 'athlete@example.com',
        whatsapp: '123',
      }),
    ).toEqual({ whatsapp: 'Invalid number' })
  })

  it('returns no errors for valid trimmed inputs', () => {
    expect(
      validateFounderForm({
        name: ' Athlete ',
        email: 'athlete@example.com',
        whatsapp: '+91 98765 43210',
      }),
    ).toEqual({})
  })
})
