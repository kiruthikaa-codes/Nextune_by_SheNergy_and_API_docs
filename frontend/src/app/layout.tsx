import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import LayoutClient from '@/components/LayoutClient'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Nextune - Vehicle Service Platform',
  description: 'AI-powered vehicle maintenance and service platform with predictive analytics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-primary-dark text-text-light min-h-screen`}>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  )
}
