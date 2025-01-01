import { ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface InfoCardProps {
  title: string
  amount: number
  icon: ReactNode
  color?: 'green' | 'red' | 'yellow' | 'default'
}

export default function InfoCard({
  title,
  amount,
  icon,
  color = 'default',
}: InfoCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div
          className={`text-2xl font-bold ${color === 'green' ? 'text-green-500' : color === 'red' ? 'text-red-500' : color === 'yellow' ? 'text-yellow-500' : 'text-black dark:text-white'} `}
        >
          {Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(amount / 100)}
        </div>
      </CardContent>
    </Card>
  )
}
