'use client'

import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const months = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

export function MonthYearDropdown() {
  const currentYear = new Date().getFullYear()
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [viewYear, setViewYear] = useState(currentYear)

  const handleYearChange = (increment: number) => {
    setViewYear((prevYear) => prevYear + increment)
  }

  const handleMonthSelect = (monthIndex: number) => {
    setSelectedMonth(monthIndex)
    setSelectedYear(viewYear)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="min-w-40 justify-between bg-black/20 lg:min-w-52"
        >
          <CalendarDays />
          <span className="flex flex-col text-sm font-medium lg:flex-row lg:gap-2">
            <span className="text-xs font-light lg:hidden">{selectedYear}</span>
            <span className="">{months[selectedMonth]} </span>
            <span className="hidden lg:block">de</span>
            <span className="hidden text-xs font-light lg:block lg:text-sm lg:font-medium">
              {selectedYear}
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
          {months.map((month, index) => (
            <Button
              key={month}
              variant={
                selectedMonth === index && selectedYear === viewYear
                  ? 'default'
                  : 'ghost'
              }
              className={`justify-center font-normal ${
                selectedMonth === index && selectedYear === viewYear
                  ? 'bg-primary text-primary-foreground'
                  : ''
              }`}
              onClick={() => handleMonthSelect(index)}
            >
              {month}
            </Button>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
