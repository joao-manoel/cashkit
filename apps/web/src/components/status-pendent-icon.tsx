import { formatDistanceToNow, isPast, isToday } from 'date-fns'
import { CircleDashed } from 'lucide-react'

export default function StatusPendentIcon({ dueDate }: { dueDate: Date }) {
  // Verifica se a data já passou
  const isOverdue = isPast(dueDate)

  // Verifica se a data é hoje
  const isDueToday = isToday(dueDate)

  // Calcula a distância até a data de vencimento
  const daysToDue = formatDistanceToNow(dueDate, { addSuffix: true })

  // Variáveis para o número de dias restantes
  let daysRemaining = 0

  // Extrai o número de dias restantes, considerando apenas valores numéricos para 'day'
  if (daysToDue.includes('day')) {
    const match = daysToDue.match(/(\d+) day/)
    if (match) {
      daysRemaining = parseInt(match[1])
    }
  }

  // Define a cor do ícone
  let color = 'blue'

  // Se a data for atrasada
  if (isOverdue) {
    color = 'red'
  }
  // Se a data for hoje
  else if (isDueToday) {
    color = 'yellow'
  }
  // Se faltar 5 dias ou menos para o vencimento
  else if (daysRemaining <= 5) {
    color = 'yellow'
  }

  return (
    <CircleDashed
      className={`size-4 ${color === 'red' ? 'text-red-500' : color === 'yellow' ? 'text-yellow-500' : 'text-blue-500'}`}
    />
  )
}
