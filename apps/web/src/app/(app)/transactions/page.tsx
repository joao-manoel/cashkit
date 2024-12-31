import { MonthYearDropdown } from '@/components/month-year-dropdown'
import { TransactionsTable } from '@/components/transactions-table'

export default function TransactionsPage() {
  return (
    <div className="container-wrapper">
      <div className="container p-4">
        <header className="flex items-center justify-between">
          <h1 className="text-lg font-bold">Transações</h1>
          <MonthYearDropdown />
        </header>
        <div>
          <TransactionsTable />
        </div>
      </div>
    </div>
  )
}
