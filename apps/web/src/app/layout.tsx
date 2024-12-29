import './globals.css'

import type { Metadata } from 'next'

import { Header } from '@/components/header'

import Providers from './providers'

export const metadata: Metadata = {
  title: 'CashKit',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body cz-shortcut-listen="true" className="bg-zinc-300">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  )
}
