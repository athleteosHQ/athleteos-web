'use client'

export function CTASection() {
  return (
    <section id="waitlist" className="px-6 py-12 text-center">
      <p className="mb-3 text-sm text-muted-foreground">Haven&apos;t checked your rank yet?</p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <a href="#rank" className="font-mono-label text-accent transition hover:text-accent-light">
          Check now →
        </a>
        <span className="text-muted-foreground/30">|</span>
        <a href="#inline-signup-gate" className="font-mono-label text-accent transition hover:text-accent-light">
          Lock your spot →
        </a>
      </div>
    </section>
  )
}
