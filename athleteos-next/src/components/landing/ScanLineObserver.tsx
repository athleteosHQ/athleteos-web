'use client'

import { useEffect } from 'react'

/** Observes all .section-fade-top elements and adds .revealed when they enter viewport. */
export function ScanLineObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.05 },
    )

    // Slight delay to ensure sections are rendered
    const timeout = setTimeout(() => {
      document.querySelectorAll('.section-fade-top').forEach((el) => {
        observer.observe(el)
      })
    }, 300)

    return () => {
      clearTimeout(timeout)
      observer.disconnect()
    }
  }, [])

  return null
}
