import './globals.css'

import { Roboto } from '@next/font/google'
import type { Metadata } from 'next'

import Providers from './providers'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  display: 'swap',
})

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
      <body
        cz-shortcut-listen="true"
        className={`dark overflow-hidden bg-background ${roboto.className}`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
