import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from 'next/font/google'
import { PostHogProvider } from '@/components/PostHogProvider'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700', '800'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '700'],
})

export const metadata: Metadata = {
  title: 'athleteOS — Performance Intelligence for Serious Athletes',
  description: 'athleteOS diagnoses why your progress stalled. Strength percentile, endurance score, recovery status — one system, one answer.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${jakarta.variable} ${inter.variable} ${jetbrainsMono.variable} bg-background font-sans text-white antialiased`}>
        <Suspense fallback={null}>
          <PostHogProvider>{children}</PostHogProvider>
        </Suspense>
      </body>
    </html>
  )
}
