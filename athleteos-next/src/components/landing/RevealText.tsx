'use client'

import { useRef, useEffect, ReactNode } from 'react'

interface RevealTextProps {
  children: ReactNode
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div'
}

export function RevealText({ children, className = '', as: Tag = 'div' }: RevealTextProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed')
          observer.unobserve(el)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag ref={ref as any} className={`reveal-line ${className}`}>
      <span>{children}</span>
    </Tag>
  )
}
