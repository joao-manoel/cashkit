'use client'

import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDate } from '@/context/date-context' // Usando o contexto
import { months } from '@/utils/utils'

export function DateDropdown() {
  const { month, year, setMonth, setYear } = useDate() // Usando o contexto
  const currentYear = new Date().getFullYear()
  const [viewYear, setViewYear] = useState(currentYear)

  const handleYearChange = (increment: number) => {
    setViewYear((prevYear) => prevYear + increment)
  }

  const handleMonthSelect = (monthIndex: number) => {
    const newMonth = monthIndex + 1 // Corrigido aqui, para garantir que o mês seja o correto
    setMonth(newMonth) // Atualiza o mês no contexto
    setYear(viewYear) // Atualiza o ano no contexto
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="min-w-40 justify-between bg-gray-100 dark:bg-black/20 lg:min-w-52"
        >
          <CalendarDays />
          <span className="flex flex-col text-sm font-medium lg:flex-row lg:gap-2">
            <span className="text-xs font-light lg:hidden">{year}</span>
            <span>{months[month - 1]}</span>{' '}
            <span className="hidden lg:block">de</span>
            <span className="hidden text-xs font-light lg:block lg:text-sm lg:font-medium">
              {year}
            </span>
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px] p-0" align="end">
        <div className="flex items-center justify-between p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleYearChange(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-semibold">{viewYear}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleYearChange(1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-1 p-2">
          {months.map((m, index) => (
            <Button
              key={m}
              variant={
                months[Number(month - 1)] === months[index] && viewYear === year
                  ? 'default'
                  : 'ghost'
              }
              className={`justify-center font-normal ${
                months[Number(month - 1)] === months[index] && viewYear === year
                  ? 'bg-primary/20 text-primary hover:bg-primary/20 hover:text-primary dark:bg-primary dark:text-primary-foreground'
                  : ''
              }`}
              onClick={() => handleMonthSelect(index)} // Ao clicar, chama handleMonthSelect
            >
              {m}
            </Button>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
