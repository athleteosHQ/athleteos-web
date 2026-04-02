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
  weight: ['300', '400', '500', '600', '700'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '700'],
})

const baseUrl = 'https://athleteos.io'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'athleteOS — Know Exactly What\'s Holding You Back',
  description: 'AthleteOS finds the one variable limiting your performance — by reading training, nutrition, and recovery as one system. Free rank check vs. 3,200+ competitive athletes.',
  keywords: ['athlete performance', 'strength rank', 'fitness diagnosis', 'training analytics', 'India fitness app'],
  openGraph: {
    title: 'athleteOS — Know Exactly What\'s Holding You Back',
    description: 'Free rank check. See where you stand against 3,200+ competitive athletes and discover the single bottleneck limiting your performance.',
    url: baseUrl,
    siteName: 'athleteOS',
    images: [
      {
        url: '/og.svg',
        width: 1200,
        height: 630,
        alt: 'athleteOS — Performance Diagnosis System',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'athleteOS — Know Exactly What\'s Holding You Back',
    description: 'Free rank check. See where you stand against 3,200+ competitive athletes.',
    images: ['/og.svg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${jakarta.variable} ${inter.variable} ${jetbrainsMono.variable} bg-background text-white antialiased`}
        style={{ fontFamily: "'Inter', var(--font-inter), sans-serif" }}
      >
        <Suspense fallback={null}>
          <PostHogProvider>{children}</PostHogProvider>
        </Suspense>
      </body>
    </html>
  )
}
