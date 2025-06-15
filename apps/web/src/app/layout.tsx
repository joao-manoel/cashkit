import './globals.css'

import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'

import Header from '@/components/header'
import { Toaster } from '@/components/ui/sonner'

import Providers from './providers'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
})

export const metadata: Metadata = {
  title: 'MeuBolso',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        cz-shortcut-listen="true"
        className={`dark overflow-hidden bg-background ${roboto.className}`}
      >
        <Providers>
          <Header />
          {children}
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  )
}
