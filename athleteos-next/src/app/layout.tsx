import type { Metadata } from 'next'
import { Archivo, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  weight: ['400', '600', '700', '800', '900'],
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
    <html lang="en" className="dark">
      <body className={`${archivo.variable} ${inter.variable} ${jetbrainsMono.variable} bg-[#0B1118] font-sans text-white antialiased`}>
        {children}
      </body>
    </html>
  )
}
