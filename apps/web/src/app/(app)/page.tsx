import { isMatch } from 'date-fns'
import { redirect } from 'next/navigation'

import NavigationMonth from '@/components/navigation-month'
interface HomeProps {
  searchParams: { month: string; year: string }
}
export default function HomePage({ searchParams: { month, year } }: HomeProps) {
  const monthIsInvalid = !month || !isMatch(month, 'MM')

  const date = new Date()

  const currentMonth =
    date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1

  if (monthIsInvalid) {
    redirect(`/?month=${currentMonth}&year=${date.getFullYear().toString()}`)
  }
  return (
    <div className="container-wrapper">
      <div className="container p-4">
        <header className="flex items-center justify-between">
          <h1 className="text-lg font-bold">Dashboard</h1>

          <NavigationMonth date={`${year}-${month}-01`} />
        </header>
      </div>
    </div>
  )
}
