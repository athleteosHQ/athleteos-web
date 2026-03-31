'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

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
      className="sticky top-0 z-50 backdrop-blur-md transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(5,5,6,0.88)' : 'rgba(5,5,6,0)',
        borderBottom: scrolled
          ? '1px solid rgba(255,255,255,0.06)'
          : '1px solid transparent',
        boxShadow: scrolled
          ? '0 1px 0 rgba(255,255,255,0.03), 0 8px 32px rgba(0,0,0,0.24)'
          : 'none',
      }}
    >
      <div className="mx-auto flex max-w-screen-xl items-center justify-between gap-3 px-4 py-4 sm:px-6 md:px-10">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
            <circle cx="14" cy="14" r="10" stroke="var(--accent)" strokeWidth="1.5" opacity="0.3"/>
            <circle cx="14" cy="14" r="4.5" fill="var(--accent)"/>
            <circle cx="14" cy="4" r="2" fill="var(--accent)" opacity="0.7"/>
            <circle cx="22" cy="19" r="1.6" fill="var(--accent)" opacity="0.5"/>
            <circle cx="6" cy="19" r="1.3" fill="var(--accent)" opacity="0.4"/>
          </svg>
          <span
            className="text-base sm:text-lg font-extrabold"
            style={{ fontFamily: 'var(--font-jakarta)', letterSpacing: '-0.04em' }}
          >
            <span className="text-foreground">athlete</span><span className="text-accent">OS</span>
          </span>
          <span className="hidden font-mono text-[10px] text-muted-foreground/40 sm:inline">early access</span>
        </Link>

        <div className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          {(['Rank', 'Join'] as const).map(link => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="transition hover:text-foreground"
            >
              {link}
            </a>
          ))}
        </div>

        <a
          href="#rank"
          className="cursor-pointer rounded-md bg-accent px-3 py-2 text-xs sm:px-4 sm:text-sm font-bold text-white transition-all hover:bg-accent-light whitespace-nowrap"
          style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
        >
          Performance Check
        </a>
      </div>
    </nav>
  )
}
