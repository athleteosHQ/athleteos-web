'use client'

import Link from 'next/link'

export function NavBar() {
  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-md"
      style={{
        background: 'rgba(7,13,20,0.88)',
        borderBottom: '1px solid rgba(127,178,255,0.10)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.24)',
      }}
    >
      <div className="mx-auto flex max-w-screen-xl items-center justify-between gap-3 px-4 py-4 sm:px-6 md:px-10">
        {/* Logo */}
        <Link href="/" className="flex min-w-0 items-center gap-3">
          {/* Icon — bare SVG, no box */}
          <svg width="34" height="34" viewBox="0 0 56 56" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
            {/* Orbit ring */}
            <circle cx="28" cy="28" r="17" stroke="#7FB2FF" strokeWidth="1.4" opacity="0.22"/>
            {/* Electron 1: fast CW, top */}
            <g>
              <animateTransform attributeName="transform" type="rotate" from="0 28 28" to="360 28 28" dur="3.2s" repeatCount="indefinite"/>
              <line x1="28" y1="28" x2="28" y2="11" stroke="#7FB2FF" strokeWidth="1" strokeLinecap="round">
                <animate attributeName="opacity" values="0.32;0.88;0.32" dur="2s" begin="0s" repeatCount="indefinite"/>
              </line>
              <circle cx="28" cy="11" r="3.2" fill="#7FB2FF">
                <animate attributeName="opacity" values="0.55;1;0.55" dur="2s" begin="0s" repeatCount="indefinite"/>
              </circle>
            </g>
            {/* Electron 2: medium CW, bottom-right */}
            <g>
              <animateTransform attributeName="transform" type="rotate" from="0 28 28" to="360 28 28" dur="5s" repeatCount="indefinite"/>
              <line x1="28" y1="28" x2="43" y2="37" stroke="#7FB2FF" strokeWidth="1" strokeLinecap="round">
                <animate attributeName="opacity" values="0.32;0.88;0.32" dur="2s" begin="0.65s" repeatCount="indefinite"/>
              </line>
              <circle cx="43" cy="37" r="2.6" fill="#7FB2FF">
                <animate attributeName="opacity" values="0.55;1;0.55" dur="2s" begin="0.65s" repeatCount="indefinite"/>
              </circle>
            </g>
            {/* Electron 3: slow CCW, bottom-left */}
            <g>
              <animateTransform attributeName="transform" type="rotate" from="0 28 28" to="-360 28 28" dur="7.5s" repeatCount="indefinite"/>
              <line x1="28" y1="28" x2="13" y2="37" stroke="#7FB2FF" strokeWidth="1" strokeLinecap="round">
                <animate attributeName="opacity" values="0.32;0.88;0.32" dur="2s" begin="1.3s" repeatCount="indefinite"/>
              </line>
              <circle cx="13" cy="37" r="2.2" fill="#7FB2FF">
                <animate attributeName="opacity" values="0.55;1;0.55" dur="2s" begin="1.3s" repeatCount="indefinite"/>
              </circle>
            </g>
            {/* Nucleus — breathing */}
            <circle cx="28" cy="28" fill="#7FB2FF">
              <animate attributeName="r" values="7;8;7" dur="2.4s" repeatCount="indefinite"/>
            </circle>
          </svg>

          {/* Wordmark + access status */}
          <span
            className="text-base sm:text-lg font-extrabold"
            style={{ fontFamily: 'var(--font-jakarta)', letterSpacing: '-0.04em' }}
          >
            <span className="text-foreground">athlete</span><span className="text-accent">OS</span>
          </span>
          <span className="hidden font-mono text-[10px] text-muted-foreground/40 sm:inline">early access</span>
        </Link>

        <div className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          {(['Problem', 'System', 'Rank', 'Join'] as const).map(link => (
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
          className="cta-glow rounded bg-accent px-3 py-2 text-xs sm:px-4 sm:text-sm font-bold text-white transition hover:bg-accent-light accent-glow whitespace-nowrap"
        >
          <span className="sm:hidden">Diagnose Free</span>
          <span className="hidden sm:inline">Diagnose My Plateau — Free</span>
        </a>
      </div>
    </nav>
  )
}
