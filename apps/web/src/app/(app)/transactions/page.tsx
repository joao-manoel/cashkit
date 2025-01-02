'use client'

import { useEffect, useState } from 'react'

import { Transactions } from '@/@types/transactions-types'
import { Breadcrumb } from '@/components/breadcrumbs'
import { DateDropdown } from '@/components/date-dropdown'
import { useDate } from '@/context/date-context' // Importando o contexto
import { getTransactions } from '@/http/get-transactions'
import { getWallet, GetWalletResponse } from '@/http/get-wallet'

import { TransactionsTable } from './transactions-table'

export default function TransactionsPage() {
  const { month, year } = useDate() // Usando o mês e ano do contexto
  const [wallet, setWallet] = useState<GetWalletResponse | null>(null)
  const [transactions, setTransactions] = useState<Transactions[] | []>([])

  useEffect(() => {
    const fetchData = async () => {
      const walletData = await getWallet()
      setWallet(walletData)

      if (walletData) {
        const transactionsData = await getTransactions({
          walletId: walletData.id,
          month: month.toString(),
          year: year.toString(),
        })
        setTransactions(transactionsData)
      }
    }

    fetchData()
  }, [month, year])

  if (!wallet || !transactions.length) return <p>Carregando...</p>

  return (
    <div>
      <Breadcrumb />
      <header className="mt-4 flex items-center justify-between">
        <h1 className="text-lg font-bold">Transações</h1>
        <DateDropdown />
      </header>
      <div>
        <TransactionsTable initialTransactions={transactions} />
      </div>
    </div>
  )
}
