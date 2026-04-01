import { describe, expect, it, vi } from 'vitest'

import { LOCAL_RESET_KEYS, clearAthleteOsLocalState } from './localReset'

describe('LOCAL_RESET_KEYS', () => {
  it('covers the founder and rank storage keys', () => {
    expect(LOCAL_RESET_KEYS).toEqual([
      'aos_founder_data',
      'aos_waitlist',
      'aos_rank_result',
      'aos_referrer_id',
    ])
  })
})

describe('clearAthleteOsLocalState', () => {
  it('removes all reset keys and dispatches the founder-data event', () => {
    const removeItem = vi.fn()
    const dispatchEvent = vi.fn()

    clearAthleteOsLocalState({
      storage: { removeItem } as Pick<Storage, 'removeItem'>,
      dispatchEvent,
    })

    expect(removeItem).toHaveBeenCalledTimes(4)
    for (const key of LOCAL_RESET_KEYS) {
      expect(removeItem).toHaveBeenCalledWith(key)
    }
    expect(dispatchEvent).toHaveBeenCalledTimes(1)
    expect(dispatchEvent.mock.calls[0]?.[0]).toBeInstanceOf(Event)
    expect(dispatchEvent.mock.calls[0]?.[0]?.type).toBe('aos-founder-data-changed')
  })
})
