'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { trackEvent } from '@/lib/analytics'
import { useMotionSafe } from '@/lib/motion'

const NAV_LINKS = [
  { label: 'Performance Read', href: '#rank' },
  { label: 'Join', href: '#inline-signup-gate' },
  { label: 'Contact', href: 'mailto:contact@athleteos.io' },
] as const

export function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const { reduced } = useMotionSafe()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      aria-label="Main navigation"
      className="sticky top-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(9,9,11,0.95)' : 'transparent',
        borderBottom: scrolled
          ? '1px solid rgba(255,255,255,0.05)'
          : '1px solid transparent',
      }}
    >
      <div className="mx-auto flex max-w-screen-xl items-center justify-between px-5 py-4 sm:px-6 md:px-10">

        {/* ── Logo + wordmark ── */}
        <Link href="/" className="group flex items-center gap-2.5">
          <motion.div
            className="relative flex h-7 w-7 items-center justify-center"
            style={{ flexShrink: 0, perspective: 160 }}
            initial={false}
            animate={reduced ? undefined : { rotateX: 0, rotateY: 0, scale: 1 }}
            whileHover={
              reduced
                ? undefined
                : {
                    rotateX: -8,
                    rotateY: 10,
                    scale: 1.035,
                  }
            }
            transition={{ type: 'spring', stiffness: 260, damping: 20, mass: 0.7 }}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true" className="aos-logo" style={{ transformStyle: 'preserve-3d' }}>
              {/* Interpreting core */}
              <motion.circle
                cx="14"
                cy="14"
                r="6.1"
                fill="rgba(255,255,255,0.4)"
                opacity="0.12"
                animate={reduced ? undefined : { opacity: [0.09, 0.18, 0.09], scale: [1, 1.08, 1] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '14px 14px' }}
              />
              <motion.circle
                cx="14"
                cy="14"
                r="4.5"
                fill="rgba(255,255,255,0.4)"
                animate={reduced ? undefined : { scale: [1, 1.045, 1] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '14px 14px' }}
              />
              {/* Three linked input streams */}
              <path d="M14 4 A10 10 0 0 1 22.1 8.2" stroke="rgba(255,255,255,0.4)" strokeWidth="1.3" strokeLinecap="round" opacity="0.28" />
              <path d="M23 18.5 A10 10 0 0 1 14.8 24" stroke="rgba(255,255,255,0.4)" strokeWidth="1.3" strokeLinecap="round" opacity="0.24" />
              <path d="M5.7 18.8 A10 10 0 0 1 7.8 8.5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.3" strokeLinecap="round" opacity="0.2" />
              {/* Inward routing ticks */}
              <path d="M19.1 9.3 L16.55 11.6" stroke="rgba(255,255,255,0.4)" strokeWidth="1.35" strokeLinecap="round" opacity="0.34" />
              <path d="M18.55 19.2 L16.15 17.2" stroke="rgba(255,255,255,0.4)" strokeWidth="1.35" strokeLinecap="round" opacity="0.3" />
              <path d="M9.1 19 L11.45 17.05" stroke="rgba(255,255,255,0.4)" strokeWidth="1.35" strokeLinecap="round" opacity="0.26" />
              {/* Input nodes */}
              <motion.circle
                cx="14"
                cy="4"
                r="1.8"
                fill="rgba(255,255,255,0.4)"
                opacity="0.6"
                animate={reduced ? undefined : { y: [0, -0.45, 0], opacity: [0.56, 0.72, 0.56] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.circle
                cx="22"
                cy="19"
                r="1.4"
                fill="rgba(255,255,255,0.4)"
                opacity="0.4"
                animate={reduced ? undefined : { x: [0, 0.3, 0], y: [0, 0.22, 0], opacity: [0.36, 0.5, 0.36] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: 0.25 }}
              />
              <motion.circle
                cx="6"
                cy="19"
                r="1.1"
                fill="rgba(255,255,255,0.4)"
                opacity="0.3"
                animate={reduced ? undefined : { x: [0, -0.24, 0], y: [0, 0.18, 0], opacity: [0.28, 0.4, 0.28] }}
                transition={{ duration: 3.7, repeat: Infinity, ease: 'easeInOut', delay: 0.45 }}
              />
            </svg>
          </motion.div>
          <span
            className="text-[15px] font-extrabold tracking-tight"
            style={{ fontFamily: 'var(--font-jakarta)', letterSpacing: '-0.03em' }}
          >
            <span className="text-foreground">athlete</span>
            <span className="text-[#fafafa]">OS</span>
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
                className="relative rounded-full px-4 py-2 text-[13px] font-medium text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-white/[0.06]"
                onClick={() => trackEvent('cta_clicked', { cta_source: 'nav_' + label.toLowerCase(), cta_text: label, has_rank_result: false })}
              >
                <span className="link-slide">
                  <span className="link-slide-inner">
                    <span className="link-slide-text">{label}</span>
                    <span className="link-slide-text" aria-hidden="true">{label}</span>
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <a
          href="#rank"
          className="group/cta relative cursor-pointer overflow-hidden rounded-full px-4 py-2.5 text-[13px] font-semibold text-foreground transition-all duration-200 hover:text-white whitespace-nowrap min-h-[44px]"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
          onClick={() => trackEvent('cta_clicked', { cta_source: 'nav_cta', cta_text: 'Get Your Read', has_rank_result: false })}
        >
          <span className="relative z-10 flex items-center gap-1.5">
            Get Your Read
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="opacity-40 transition-all duration-200 group-hover/cta:opacity-80 group-hover/cta:translate-x-0.5">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          {/* Hover glow */}
          <span
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/cta:opacity-100"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08), transparent 70%)',
            }}
          />
        </a>
      </div>
    </nav>
  )
}
