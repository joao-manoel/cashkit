import { ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Skeleton } from './ui/skeleton'

interface InfoCardProps {
  icon: ReactNode
  color?: 'green' | 'red' | 'yellow' | 'default'
}

export default function InfoCardSkeleton({
  icon,
  color = 'default',
}: InfoCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <Skeleton className="h-[20px] w-[90px] rounded-sm" />
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div
          className={`text-2xl font-bold ${color === 'green' ? 'text-green-500' : color === 'red' ? 'text-red-500' : color === 'yellow' ? 'text-yellow-500' : 'text-black dark:text-white'} `}
        >
          <Skeleton className="h-[32px] w-[120px] rounded-sm" />
        </div>
      </CardContent>
    </Card>
  )
}
