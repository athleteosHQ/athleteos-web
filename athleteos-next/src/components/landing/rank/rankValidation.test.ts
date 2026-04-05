import { describe, expect, it } from 'vitest'

import {
  getRankFormValidation,
  isValidBodyweight,
} from './rankValidation'

describe('isValidBodyweight', () => {
  it('accepts bodyweight within the supported range', () => {
    expect(isValidBodyweight('83')).toBe(true)
    expect(isValidBodyweight('40')).toBe(true)
    expect(isValidBodyweight('250')).toBe(true)
  })

  it('rejects bodyweight outside the supported range', () => {
    expect(isValidBodyweight('')).toBe(false)
    expect(isValidBodyweight('39.5')).toBe(false)
    expect(isValidBodyweight('251')).toBe(false)
  })
})

describe('getRankFormValidation', () => {
  const baseFields = {
    bw: '83',
    sqW: '',
    sqR: '',
    bpW: '',
    bpR: '',
    dlW: '',
    dlR: '',
    runMin: '',
    runSec: '',
  }

  it('accepts one complete lift with realistic reps', () => {
    const validation = getRankFormValidation({
      fields: { ...baseFields, sqW: '160', sqR: '5' },
      trainingType: 'strength',
    })

    expect(validation.error).toBeNull()
    expect(validation.hasCompleteLift).toBe(true)
  })

  it('rejects a lift weight without reps', () => {
    const validation = getRankFormValidation({
      fields: { ...baseFields, sqW: '160', sqR: '' },
      trainingType: 'strength',
    })

    expect(validation.error).toBe('Complete at least one lift with weight and reps.')
    expect(validation.fieldErrors.sqR).toBe('Reps required')
  })

  it('rejects reps above the supported estimation range', () => {
    const validation = getRankFormValidation({
      fields: { ...baseFields, sqW: '100', sqR: '15' },
      trainingType: 'strength',
    })

    expect(validation.error).toBe('Use 1–12 reps for any lift you enter.')
    expect(validation.fieldErrors.sqR).toBe('Use 1–12 reps')
  })

  it('rejects lift weights below the supported floor once entered', () => {
    const validation = getRankFormValidation({
      fields: { ...baseFields, sqW: '10', sqR: '5' },
      trainingType: 'strength',
    })

    expect(validation.error).toBe('Use 20–500 kg for any lift you enter.')
    expect(validation.fieldErrors.sqW).toBe('Use 20–500 kg')
  })

  it('rejects a partial 5K entry in hybrid mode', () => {
    const validation = getRankFormValidation({
      fields: { ...baseFields, dlW: '180', dlR: '3', runMin: '24', runSec: '' },
      trainingType: 'hybrid',
    })

    expect(validation.error).toBe('Complete the full 5K time or leave it blank.')
    expect(validation.fieldErrors.runSec).toBe('Seconds required')
  })

  it('accepts a complete 5K entry in hybrid mode', () => {
    const validation = getRankFormValidation({
      fields: { ...baseFields, dlW: '180', dlR: '3', runMin: '24', runSec: '30' },
      trainingType: 'hybrid',
    })

    expect(validation.error).toBeNull()
    expect(validation.fieldErrors).toEqual({})
  })
})
