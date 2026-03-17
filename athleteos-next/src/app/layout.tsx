import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Space_Mono } from 'next/font/google'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700', '800'],
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: 'athleteOS — Performance Intelligence for Serious Athletes',
  description: 'athleteOS diagnoses why your progress stalled. Strength percentile, endurance score, recovery status — one system, one answer.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${jakarta.variable} ${spaceMono.variable} bg-[#0B1118] font-sans text-white antialiased`}>
        {children}
      </body>
    </html>
  )
}
