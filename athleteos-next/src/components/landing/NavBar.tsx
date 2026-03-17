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
        <a href="/" className="flex items-center gap-2.5">
          <svg width="28" height="28" viewBox="0 0 56 56" fill="none" aria-hidden="true" style={{ filter: 'drop-shadow(0 0 6px rgba(255,122,47,0.28))' }}>
            <circle cx="28" cy="28" r="17" stroke="#FF7A2F" strokeWidth="1.4" opacity="0.22"/>
            <g>
              <animateTransform attributeName="transform" type="rotate" from="0 28 28" to="360 28 28" dur="3.2s" repeatCount="indefinite"/>
              <circle cx="28" cy="11" r="3.2" fill="#FF7A2F">
                <animate attributeName="opacity" values="0.55;1;0.55" dur="2s" begin="0s" repeatCount="indefinite"/>
              </circle>
            </g>
            <circle cx="28" cy="28" r="5" fill="#FF7A2F" opacity="0.7"/>
          </svg>
          <span className="font-bold tracking-tight text-foreground">
            athlete<span className="text-accent">OS</span>
          </span>
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
