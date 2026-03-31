'use client'

import { useEffect } from 'react'
import Link from 'next/link'

import { clearAthleteOsLocalState } from '@/lib/localReset'

export default function ResetLocalPage() {
  useEffect(() => {
    clearAthleteOsLocalState({
      storage: window.localStorage,
      dispatchEvent: window.dispatchEvent.bind(window),
    })

    const timeout = window.setTimeout(() => {
      window.location.replace('/')
    }, 1200)

    return () => window.clearTimeout(timeout)
  }, [])

  return (
    <main className="grid min-h-screen place-items-center bg-background px-6 text-center text-foreground">
      <div className="max-w-lg">
        <p className="font-mono-label text-accent">Local reset</p>
        <h1 className="mt-3 text-3xl font-display font-bold md:text-4xl">
          Browser data cleared.
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          Founder and rank state have been removed from this browser. Redirecting you to the homepage.
        </p>
        <Link href="/" className="mt-6 inline-block text-sm font-semibold text-accent hover:underline">
          Return now
        </Link>
      </div>
    </main>
  )
}
