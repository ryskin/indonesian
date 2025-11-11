import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Indonesian Learning App - Speak Indonesian in 30 Days',
  description: 'Learn Indonesian using the SVO methodology with 100 core verbs. Master conversational Indonesian in just 16 weeks.',
  keywords: 'Indonesian, language learning, SVO, Bahasa Indonesia, learn Indonesian',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
