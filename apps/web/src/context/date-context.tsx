import React, { createContext, ReactNode, useContext, useState } from 'react'

interface DateContextProps {
  month: number
  year: number
  setMonth: (month: number) => void
  setYear: (year: number) => void
}

const DateContext = createContext<DateContextProps | undefined>(undefined)

export const useDate = (): DateContextProps => {
  const context = useContext(DateContext)
  if (!context) {
    throw new Error('useDate must be used within a DateProvider')
  }
  return context
}

interface DateProviderProps {
  children: ReactNode
}

export const DateProvider: React.FC<DateProviderProps> = ({ children }) => {
  const currentDate = new Date()
  const [month, setMonth] = useState<number>(currentDate.getMonth() + 1) // Mês começa de 0, então somamos 1
  const [year, setYear] = useState<number>(currentDate.getFullYear())

  return (
    <DateContext.Provider value={{ month, year, setMonth, setYear }}>
      {children}
    </DateContext.Provider>
  )
}
