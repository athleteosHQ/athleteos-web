interface AnalyticsPayload {
  event: string
  path: string
  props: Record<string, string | number | boolean | null>
  ts: string
}

export function buildAnalyticsEvent(
  event: string,
  props: Record<string, string | number | boolean | null> = {},
  path = '/',
): AnalyticsPayload {
  return {
    event,
    path,
    props,
    ts: new Date().toISOString(),
  }
}

export function trackEvent(
  event: string,
  props: Record<string, string | number | boolean | null> = {},
): void {
  if (typeof window === 'undefined') return

  const payload = buildAnalyticsEvent(event, props, window.location.pathname + window.location.search)

  try {
    const body = JSON.stringify(payload)
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/track', body)
      return
    }

    void fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    })
  } catch {
    // Analytics must never break the user flow.
  }
}

export type { AnalyticsPayload }
