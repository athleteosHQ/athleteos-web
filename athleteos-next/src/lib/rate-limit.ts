/** Simple in-memory rate limiter for API routes.
 *  Limits requests per IP within a sliding window.
 *  Note: resets on cold start (serverless), but blocks rapid-fire abuse within a single instance. */

const ipHits = new Map<string, { count: number; resetAt: number }>()

// Cleanup stale entries every 60s to prevent memory leak
if (typeof globalThis !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [ip, entry] of ipHits) {
      if (now > entry.resetAt) ipHits.delete(ip)
    }
  }, 60_000).unref?.()
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetIn: number
}

export function checkRateLimit(
  ip: string,
  { maxRequests = 5, windowMs = 60_000 }: { maxRequests?: number; windowMs?: number } = {},
): RateLimitResult {
  const now = Date.now()
  const entry = ipHits.get(ip)

  if (!entry || now > entry.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs }
  }

  entry.count += 1

  if (entry.count > maxRequests) {
    return { allowed: false, remaining: 0, resetIn: entry.resetAt - now }
  }

  return { allowed: true, remaining: maxRequests - entry.count, resetIn: entry.resetAt - now }
}

/** Extract client IP from request headers (works on Vercel) */
export function getClientIp(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headers.get('x-real-ip') ??
    'unknown'
  )
}

/** Check if the request origin matches allowed domains */
export function isAllowedOrigin(headers: Headers, allowedDomains: readonly string[]): boolean {
  const origin = headers.get('origin') ?? ''
  const referer = headers.get('referer') ?? ''

  // Allow same-origin requests (no origin header = server-side or same-origin)
  if (!origin && !referer) return true

  return allowedDomains.some(domain =>
    origin.includes(domain) || referer.includes(domain),
  )
}

const ALLOWED_DOMAINS = [
  'athleteos.io',
  'localhost',
  'athleteos-web.vercel.app',
  'athleteos.vercel.app',
] as const

export { ALLOWED_DOMAINS }
