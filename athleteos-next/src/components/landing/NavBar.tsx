'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const NAV_LINKS = [
  { label: 'Rank', href: '#rank' },
  { label: 'Join', href: '#inline-signup-gate' },
  { label: 'Contact', href: 'mailto:contact@athleteos.io' },
] as const

export function NavBar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className="sticky top-0 z-50 transition-all duration-500"
      style={{
        backdropFilter: scrolled ? 'blur(20px) saturate(1.4)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.4)' : 'none',
        background: scrolled ? 'rgba(12,12,14,0.72)' : 'transparent',
        borderBottom: scrolled
          ? '1px solid rgba(255,255,255,0.05)'
          : '1px solid transparent',
      }}
    >
      <div className="mx-auto flex max-w-screen-xl items-center justify-between px-5 py-4 sm:px-6 md:px-10">

        {/* ── Logo + wordmark ── */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div
            className="relative flex h-7 w-7 items-center justify-center"
            style={{ flexShrink: 0 }}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <circle cx="14" cy="14" r="10" stroke="var(--accent)" strokeWidth="1.2" opacity="0.25" />
              <circle cx="14" cy="14" r="4.5" fill="var(--accent)" />
              <circle cx="14" cy="4" r="1.8" fill="var(--accent)" opacity="0.6" />
              <circle cx="22" cy="19" r="1.4" fill="var(--accent)" opacity="0.4" />
              <circle cx="6" cy="19" r="1.1" fill="var(--accent)" opacity="0.3" />
            </svg>
          </div>
          <span
            className="text-[15px] font-extrabold tracking-tight"
            style={{ fontFamily: 'var(--font-jakarta)', letterSpacing: '-0.03em' }}
          >
            <span className="text-foreground">athlete</span>
            <span className="text-accent">OS</span>
          </span>

          {/* Subtle divider + badge — Linear-style */}
          <span className="hidden sm:flex items-center gap-2 ml-0.5">
            <span
              className="h-3.5 w-px"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            />
            <span
              className="font-mono text-[10px] font-medium tracking-[0.08em] uppercase"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              Early access
            </span>
          </span>
        </Link>

        {/* ── Center nav links — visible on md+ ── */}
        <div className="hidden md:flex items-center">
          <div
            className="flex items-center gap-0.5 rounded-full px-1 py-1"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="relative rounded-full px-4 py-1.5 text-[13px] font-medium text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-white/[0.06]"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <a
          href="#rank"
          className="group/cta relative cursor-pointer overflow-hidden rounded-full px-4 py-2 text-[13px] font-semibold text-foreground transition-all duration-200 hover:text-white whitespace-nowrap"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <span className="relative z-10 flex items-center gap-1.5">
            See Where You Rank
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="opacity-40 transition-all duration-200 group-hover/cta:opacity-80 group-hover/cta:translate-x-0.5">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          {/* Hover glow */}
          <span
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/cta:opacity-100"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(107,122,237,0.12), transparent 70%)',
            }}
          />
        </a>
      </div>
    </nav>
  )
}
