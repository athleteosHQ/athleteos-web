export const LOCAL_RESET_KEYS = [
  'aos_founder_data',
  'aos_waitlist',
  'aos_rank_result',
  'aos_referrer_id',
] as const

interface ClearAthleteOsLocalStateArgs {
  storage: Pick<Storage, 'removeItem'>
  dispatchEvent: (event: Event) => void
}

export function clearAthleteOsLocalState({
  storage,
  dispatchEvent,
}: ClearAthleteOsLocalStateArgs) {
  for (const key of LOCAL_RESET_KEYS) {
    storage.removeItem(key)
  }

  dispatchEvent(new Event('aos-founder-data-changed'))
}
