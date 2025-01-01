import { isMatch } from 'date-fns'
import { redirect } from 'next/navigation'

import { MonthYearDropdown } from '@/components/month-year-dropdown'
import { getTransactions } from '@/http/get-transactions'
import { getWallet } from '@/http/get-wallet'

import { TransactionsTable } from './transactions-table'

interface TransactionsProps {
  searchParams: { month: string; year: string }
}

export default async function TransactionsPage({
  searchParams: { month, year },
}: TransactionsProps) {
  const monthIsInvalid = !month || !isMatch(month, 'MM')

  const date = new Date()

  const currentMonth =
    date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1

  if (monthIsInvalid) {
    redirect(`?month=${currentMonth}&year=${date.getFullYear().toString()}`)
  }

  const wallet = await getWallet()

  const transactions = await getTransactions({
    walletId: wallet.id,
    month,
    year,
    take: 100,
  })

  return (
    <div className="container-wrapper">
      <div className="container p-4">
        <header className="flex items-center justify-between">
          <h1 className="text-lg font-bold">Transações</h1>
          <MonthYearDropdown />
        </header>
        <div>
          <TransactionsTable initialTransactions={transactions} />
        </div>
      </div>
    </div>
  )
}
