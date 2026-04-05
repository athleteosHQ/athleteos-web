import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from 'next/font/google'
import { PostHogProvider } from '@/components/PostHogProvider'
import {
  OG_IMAGE_ALT,
  OG_IMAGE_DESCRIPTION,
  OG_IMAGE_TITLE,
  OG_IMAGE_URL,
  SITE_URL,
} from '@/lib/seo'
import './globals.css'

const metadataBase = new URL(SITE_URL)

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
  metadataBase,
  title: OG_IMAGE_TITLE,
  description:
    'AthleteOS finds the one variable holding your performance back. Training, nutrition, and recovery read as one system. Free rank check against 3,200+ competitive athletes.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'AthleteOS',
    title: OG_IMAGE_TITLE,
    description: OG_IMAGE_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: OG_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: OG_IMAGE_TITLE,
    description: OG_IMAGE_DESCRIPTION,
    images: [OG_IMAGE_URL],
  },
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
