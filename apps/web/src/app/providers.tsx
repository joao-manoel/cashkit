'use client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { ReactNode } from 'react'

import { DateProvider } from '@/context/date-context'
import { MenuProvider } from '@/context/menu-context'
import { queryClient } from '@/lib/react-query'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <DateProvider>
          <MenuProvider>{children}</MenuProvider>
        </DateProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
