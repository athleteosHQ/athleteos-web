export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-10 md:px-10">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between gap-6">
        <div>
          <p className="font-bold text-foreground">
            athlete<span className="text-accent">OS</span>
          </p>
          <p className="mt-1 font-mono-label text-muted-foreground">Stop tracking. Start understanding.</p>
          <a
            href="mailto:contact@athleteos.io"
            className="mt-1 block font-mono-label text-muted-foreground transition hover:text-foreground"
          >
            contact@athleteos.io
          </a>
        </div>
        <nav className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          {['Problem', 'System', 'Rank', 'Waitlist'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="transition hover:text-foreground">{l}</a>
          ))}
          <a href="/privacy" className="transition hover:text-foreground">Privacy</a>
          <a href="/terms" className="transition hover:text-foreground">Terms</a>
        </nav>
      </div>
    </footer>
  )
}
