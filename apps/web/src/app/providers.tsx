'use client'
import { ThemeProvider } from 'next-themes'
import { ReactNode } from 'react'

import { DateProvider } from '@/context/date-context'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      disableTransitionOnChange
    >
      <DateProvider>{children}</DateProvider>
    </ThemeProvider>
  )
}
