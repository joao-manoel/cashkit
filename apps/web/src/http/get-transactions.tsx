import { Transactions } from '@/@types/transactions-types'

import { api } from './api-client'

interface GetTransactionRequest {
  walletId: string
  month: string
  year: string
}

export async function getTransactions({
  walletId,
  month,
  year,
}: GetTransactionRequest) {
  const result = await api
    .post(`wallet/${walletId}/transactions`, {
      json: {
        month,
        year,
      },
      next: {
        tags: [`transactions`],
      },
    })
    .json<Transactions[]>()

  return result
}
