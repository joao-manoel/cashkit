'use client'

import { useQuery } from '@tanstack/react-query'

import { Wallet } from '@/@types/wallet-type'
import { Breadcrumb } from '@/components/breadcrumbs'
import { DateDropdown } from '@/components/date-dropdown'
import TransactionSkeleton from '@/components/transaction-skeleton'
import { useDate } from '@/context/date-context' // Importando o contexto
import { getTransactions } from '@/http/get-transactions'
import { getWallet } from '@/http/get-wallet'

import { TransactionsTable } from './transactions-table'

export default function TransactionsPage() {
  const { month, year } = useDate()

  // Fetch para a carteira
  const {
    data: wallet,
    isLoading: isWalletLoading,
    error: walletError,
  } = useQuery<Wallet, Error>({
    queryKey: ['wallet'],
    queryFn: getWallet,
  })

  // Fetch para as transações
  const {
    data: transactions,
    isLoading: isTransactionsLoading,
    error: transactionsError,
  } = useQuery({
    queryKey: ['transactions', wallet?.id, month, year],
    queryFn: () =>
      getTransactions({
        walletId: wallet!.id,
        month: month.toString(),
        year: year.toString(),
      }),
    enabled: !!wallet,
  })

  if (walletError || transactionsError) return <p>Erro ao carregar dados.</p>

  return (
    <div>
      <Breadcrumb />
      <header className="mt-4 flex items-center justify-between">
        <h1 className="text-lg font-bold">Transações</h1>
        <DateDropdown />
      </header>
      <div>
        {isTransactionsLoading || isWalletLoading ? (
          <TransactionSkeleton />
        ) : (
          <TransactionsTable data={transactions || []} wallet={wallet} />
        )}
      </div>
    </div>
  )
}
