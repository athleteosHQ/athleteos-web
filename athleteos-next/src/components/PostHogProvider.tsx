'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { initPostHog, posthog } from '@/lib/posthog'

const SCROLL_THRESHOLDS = [25, 50, 75, 90] as const

const TRACKED_SECTIONS = [
  'hero', 'insight-patterns', 'sample-outcome', 'rank',
  'personalized-upsell', 'inline-signup-gate', 'system',
  'problem', 'trust', 'faq',
] as const

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const pageLoadRef = useRef(Date.now())
  const scrollFiredRef = useRef<Set<number>>(new Set())
  const sectionFiredRef = useRef<Set<string>>(new Set())

  // Initialize PostHog once on mount
  useEffect(() => {
    initPostHog()
  }, [])

  // Track pageviews on route change + reset tracking state
  useEffect(() => {
    if (!pathname) return

    const url = searchParams?.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname

    posthog.capture('$pageview', { $current_url: url })
    pageLoadRef.current = Date.now()
    scrollFiredRef.current = new Set()
    sectionFiredRef.current = new Set()
  }, [pathname, searchParams])

  // Section visibility tracking via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const id = entry.target.id
          if (sectionFiredRef.current.has(id)) continue
          sectionFiredRef.current.add(id)

          posthog.capture('section_viewed', {
            section: id,
            time_on_page_seconds: Math.round((Date.now() - pageLoadRef.current) / 1000),
          })
        }
      },
      { threshold: 0.5 },
    )

    const timeout = setTimeout(() => {
      for (const id of TRACKED_SECTIONS) {
        const el = document.getElementById(id)
        if (el) observer.observe(el)
      }
    }, 500)

    return () => {
      clearTimeout(timeout)
      observer.disconnect()
    }
  }, [pathname])

  // Scroll depth tracking at 25/50/75/90%
  useEffect(() => {
    const onScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight <= 0) return

      const pct = Math.round((window.scrollY / scrollHeight) * 100)

      for (const threshold of SCROLL_THRESHOLDS) {
        if (pct >= threshold && !scrollFiredRef.current.has(threshold)) {
          scrollFiredRef.current.add(threshold)
          posthog.capture('scroll_depth', {
            depth_percent: threshold,
            time_on_page_seconds: Math.round((Date.now() - pageLoadRef.current) / 1000),
          })
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return <>{children}</>
}
