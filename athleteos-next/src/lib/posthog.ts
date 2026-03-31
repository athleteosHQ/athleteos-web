import posthog from 'posthog-js'

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? ''
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com'

let initialized = false

export function initPostHog(): void {
  if (typeof window === 'undefined') return
  if (initialized) return
  if (!POSTHOG_KEY) return

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: 'identified_only',
    capture_pageview: false, // we handle this manually
    capture_pageleave: true,
    autocapture: false, // we use explicit trackEvent calls
    persistence: 'localStorage',
    loaded: (ph) => {
      if (process.env.NODE_ENV === 'development') {
        ph.debug()
      }
    },
  })

  initialized = true
}

export { posthog }
