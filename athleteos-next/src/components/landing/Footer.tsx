export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-10 md:px-10">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between gap-6">
        <div>
          <p className="font-bold text-foreground">
            athlete<span className="text-accent">OS</span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Performance diagnosis + progress tracking for serious strength athletes.</p>
          <a
            href="mailto:contact@athleteos.io"
            className="mt-2 block py-2 px-1 text-sm text-muted-foreground transition hover:text-foreground"
          >
            contact@athleteos.io
          </a>
        </div>
        <nav className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          {[
            { label: 'Problem', href: '#problem' },
            { label: 'System', href: '#system' },
            { label: 'Baseline', href: '#rank' },
            { label: 'Join', href: '#inline-signup-gate' },
          ].map(({ label, href }) => (
            <a key={label} href={href} className="py-2 px-1 transition hover:text-foreground">{label}</a>
          ))}
          <a href="/privacy" className="py-2 px-1 transition hover:text-foreground">Privacy</a>
          <a href="/terms" className="py-2 px-1 transition hover:text-foreground">Terms</a>
        </nav>
      </div>
    </footer>
  )
}
