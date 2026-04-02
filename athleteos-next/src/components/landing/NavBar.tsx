'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { trackEvent } from '@/lib/analytics'
import { useMotionSafe } from '@/lib/motion'

const NAV_LINKS = [
  { label: 'Rank', href: '#rank' },
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
        backdropFilter: scrolled ? 'blur(28px) saturate(1.8)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(28px) saturate(1.8)' : 'none',
        background: scrolled ? 'rgba(8,8,9,0.80)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
      }}
    >
      <div className="mx-auto flex max-w-screen-xl items-center justify-between px-5 py-4 sm:px-6 md:px-10">

        {/* ── Logo + wordmark ── */}
        <Link href="/" className="group flex items-center gap-2.5">
          <motion.div
            className="relative flex h-7 w-7 items-center justify-center"
            style={{ flexShrink: 0, perspective: 160 }}
            initial={false}
            whileHover={reduced ? undefined : { rotateX: -8, rotateY: 10, scale: 1.04 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, mass: 0.7 }}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true" style={{ transformStyle: 'preserve-3d' }}>
              <defs>
                <linearGradient id="navLogoGrad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FF6B35" />
                  <stop offset="50%" stopColor="#FF0080" />
                  <stop offset="100%" stopColor="#7B2FFF" />
                </linearGradient>
              </defs>
              <motion.circle cx="14" cy="14" r="6.1" fill="url(#navLogoGrad)" opacity="0.12"
                animate={reduced ? undefined : { opacity: [0.08, 0.2, 0.08], scale: [1, 1.1, 1] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '14px 14px' }}
              />
              <circle cx="14" cy="14" r="4.5" fill="url(#navLogoGrad)" />
              <path d="M14 4 A10 10 0 0 1 22.1 8.2" stroke="url(#navLogoGrad)" strokeWidth="1.3" strokeLinecap="round" opacity="0.3" />
              <path d="M23 18.5 A10 10 0 0 1 14.8 24" stroke="url(#navLogoGrad)" strokeWidth="1.3" strokeLinecap="round" opacity="0.25" />
              <path d="M5.7 18.8 A10 10 0 0 1 7.8 8.5" stroke="url(#navLogoGrad)" strokeWidth="1.3" strokeLinecap="round" opacity="0.2" />
              <path d="M19.1 9.3 L16.55 11.6" stroke="#FF6B35" strokeWidth="1.35" strokeLinecap="round" opacity="0.35" />
              <path d="M18.55 19.2 L16.15 17.2" stroke="#FF0080" strokeWidth="1.35" strokeLinecap="round" opacity="0.3" />
              <path d="M9.1 19 L11.45 17.05" stroke="#7B2FFF" strokeWidth="1.35" strokeLinecap="round" opacity="0.26" />
              <motion.circle cx="14" cy="4" r="1.8" fill="#FF6B35" opacity="0.65"
                animate={reduced ? undefined : { y: [0, -0.5, 0], opacity: [0.55, 0.75, 0.55] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.circle cx="22" cy="19" r="1.4" fill="#FF0080" opacity="0.45"
                animate={reduced ? undefined : { x: [0, 0.3, 0], opacity: [0.35, 0.55, 0.35] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: 0.25 }}
              />
              <motion.circle cx="6" cy="19" r="1.1" fill="#7B2FFF" opacity="0.35"
                animate={reduced ? undefined : { x: [0, -0.24, 0], opacity: [0.28, 0.45, 0.28] }}
                transition={{ duration: 3.7, repeat: Infinity, ease: 'easeInOut', delay: 0.45 }}
              />
            </svg>
          </motion.div>

          <span
            className="text-[15px] font-extrabold tracking-tight"
            style={{ fontFamily: "'Syne', var(--font-jakarta), sans-serif", letterSpacing: '-0.03em' }}
          >
            <span style={{ color: 'rgba(237,237,239,0.95)' }}>athlete</span>
            <span
              style={{
                background: 'linear-gradient(135deg, #FF6B35, #FF0080)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              OS
            </span>
          </span>

          <span className="hidden sm:flex items-center gap-2 ml-0.5">
            <span className="h-3.5 w-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
            <span className="font-mono text-[10px] font-medium tracking-[0.08em] uppercase" style={{ color: 'rgba(255,255,255,0.28)' }}>
              Early access
            </span>
          </span>
        </Link>

        {/* ── Center nav links ── */}
        <div className="hidden md:flex items-center">
          <div
            className="flex items-center gap-0.5 rounded-full px-1 py-1"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="relative rounded-full px-4 py-2 text-[13px] font-medium text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-white/[0.06]"
                onClick={() => trackEvent('cta_clicked', { cta_source: 'nav_' + label.toLowerCase(), cta_text: label, has_rank_result: false })}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* ── Gradient CTA pill ── */}
        <a
          href="#rank"
          className="group/cta relative cursor-pointer overflow-hidden rounded-full min-h-[44px] flex items-center whitespace-nowrap transition-all duration-200"
          style={{ padding: '0 18px' }}
          onClick={() => trackEvent('cta_clicked', { cta_source: 'nav_cta', cta_text: 'Check Rank', has_rank_result: false })}
        >
          {/* Gradient border */}
          <span
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(135deg, rgba(255,107,53,0.6), rgba(255,0,128,0.4), rgba(123,47,255,0.3))',
              padding: '1px',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />
          {/* Background */}
          <span
            className="pointer-events-none absolute inset-[1px] rounded-full transition-opacity duration-200"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          />
          {/* Hover glow */}
          <span
            className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover/cta:opacity-100 transition-opacity duration-300"
            style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,107,53,0.1), transparent 70%)' }}
          />
          <span className="relative z-10 text-[13px] font-semibold text-foreground flex items-center gap-1.5">
            Check Rank
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="opacity-50 transition-all duration-200 group-hover/cta:opacity-90 group-hover/cta:translate-x-0.5">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </a>
      </div>
    </nav>
  )
}
