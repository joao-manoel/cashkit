import { ReactNode } from 'react'

import { Card, CardContent, CardHeader } from './ui/card'

interface InfoCardProps {
  title: string
  amount: number
  icon: ReactNode
  size?: 'small' | 'large'
}

export default function SummaryCard({
  title,
  amount,
  icon,
  size = 'small',
}: InfoCardProps) {
  return (
    <Card className="mx-2 flex-1">
      <CardHeader className="w-full flex-row items-center gap-2">
        {icon}
        <p
          className={`${size === 'small' ? 'text-muted-foreground' : 'text-black opacity-70 dark:text-white'}`}
        >
          {title}
        </p>
      </CardHeader>
      <CardContent>
        <p className={`font-bold ${size === 'small' ? 'text-xl' : 'text-3xl'}`}>
          {Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(amount / 100)}
        </p>
      </CardContent>
    </Card>
  )
}
