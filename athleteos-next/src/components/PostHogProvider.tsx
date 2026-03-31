'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { initPostHog, posthog } from '@/lib/posthog'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Initialize PostHog once on mount
  useEffect(() => {
    initPostHog()
  }, [])

  // Track pageviews on route change
  useEffect(() => {
    if (!pathname) return

    const url = searchParams?.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname

    posthog.capture('$pageview', { $current_url: url })
  }, [pathname, searchParams])

  // Track section views via IntersectionObserver
  useEffect(() => {
    const fired = new Set<string>()

    const SECTION_MAP: Record<string, string> = {
      'rank': 'section_viewed',
      'sample-outcome': 'section_viewed',
      'personalized-upsell': 'upsell_strip_viewed',
      'inline-signup-gate': 'signup_gate_viewed',
      'system': 'section_viewed',
      'problem': 'section_viewed',
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const id = entry.target.id
          if (fired.has(id)) continue
          fired.add(id)

          const event = SECTION_MAP[id] ?? 'section_viewed'
          posthog.capture(event, { section: id })
        }
      },
      { threshold: 0.3 },
    )

    // Observe after a tick so sections are rendered
    const timeout = setTimeout(() => {
      for (const id of Object.keys(SECTION_MAP)) {
        const el = document.getElementById(id)
        if (el) observer.observe(el)
      }
    }, 500)

    return () => {
      clearTimeout(timeout)
      observer.disconnect()
    }
  }, [pathname])

  return <>{children}</>
}
