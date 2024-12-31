'use client'
import { addMonths, format, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from './ui/button'

interface NavigationDateProps {
  date: string
}

export default function NavigationMonth({ date }: NavigationDateProps) {
  const { push } = useRouter()

  // Extrai ano, mês e dia da string para garantir consistência na criação da data
  const [year, month, day] = date.split('-').map(Number)
  const initialDate = new Date(year, month - 1, day) // mês é indexado em 0

  const [currentDate, setCurrentDate] = useState(initialDate)

  const handlePreviousMonth = () => {
    const newDate = subMonths(currentDate, 1)
    setCurrentDate(newDate)

    const formattedMonth =
      newDate.getMonth() + 1 < 10
        ? `0${newDate.getMonth() + 1}`
        : newDate.getMonth() + 1

    push(`?month=${formattedMonth}&year=${newDate.getFullYear()}`)
  }

  const handleNextMonth = () => {
    const newDate = addMonths(currentDate, 1)
    setCurrentDate(newDate)

    const formattedMonth =
      newDate.getMonth() + 1 < 10
        ? `0${newDate.getMonth() + 1}`
        : newDate.getMonth() + 1

    push(`?month=${formattedMonth}&year=${newDate.getFullYear()}`)
  }

  return (
    <div className="flex items-center gap-2 rounded-md bg-muted p-2 shadow-md">
      <Button
        variant="ghost"
        size="sm"
        className="rounded-none text-gray-600 hover:bg-transparent"
        onClick={handlePreviousMonth}
      >
        <ArrowLeft />
      </Button>
      <div className="flex min-w-20 flex-col items-center justify-center">
        <span className="text-xs text-muted-foreground">
          {format(currentDate, 'yyyy', { locale: ptBR })}
        </span>
        <span className="text-md capitalize">
          {format(currentDate, 'MMMM', { locale: ptBR })}
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="rounded-none text-gray-600 hover:bg-transparent"
        onClick={handleNextMonth}
      >
        <ArrowRight />
      </Button>
    </div>
  )
}
