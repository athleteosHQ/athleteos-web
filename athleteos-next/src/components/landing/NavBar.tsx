'use client'

export function NavBar() {
  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-md"
      style={{
        background: 'rgba(7,13,20,0.88)',
        borderBottom: '1px solid rgba(255,122,47,0.10)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.24)',
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 group">
          {/* Icon mark */}
          <div
            className="relative flex h-9 w-9 items-center justify-center rounded-xl flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(255,122,47,0.25) 0%, rgba(255,122,47,0.08) 100%)',
              border: '1px solid rgba(255,122,47,0.35)',
              boxShadow: '0 0 16px rgba(255,122,47,0.20), inset 0 1px 0 rgba(255,255,255,0.08)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 56 56" fill="none" aria-hidden="true">
              <circle cx="28" cy="28" r="17" stroke="#FF7A2F" strokeWidth="1.8" opacity="0.35"/>
              <g>
                <animateTransform attributeName="transform" type="rotate" from="0 28 28" to="360 28 28" dur="3.2s" repeatCount="indefinite"/>
                <circle cx="28" cy="11" r="3.8" fill="#FF7A2F">
                  <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/>
                </circle>
              </g>
              <circle cx="28" cy="28" r="5.5" fill="#FF7A2F"/>
            </svg>
            {/* Glow behind icon */}
            <div
              className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'rgba(255,122,47,0.12)' }}
            />
          </div>

          {/* Wordmark */}
          <div className="flex flex-col leading-none">
            <span
              className="text-lg font-bold tracking-tight"
              style={{ fontFamily: 'var(--font-jakarta)', letterSpacing: '-0.02em' }}
            >
              <span className="text-foreground">athlete</span><span className="text-accent">OS</span>
            </span>
            <span className="font-mono-label text-muted-foreground" style={{ marginTop: 1 }}>
              Performance Diagnostic
            </span>
          </div>
        </a>

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
          className="cta-glow rounded-xl bg-accent px-4 py-2 text-sm font-bold text-white transition hover:bg-accent-light accent-glow"
        >
          Get Score →
        </a>
      </div>
    </nav>
  )
}
