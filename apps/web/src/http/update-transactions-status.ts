import { api } from './api-client'

interface UpdateTransactionsStatusRequest {
  walletId: string
  transactions: Array<{
    id: string
    recurrence: 'VARIABLE' | 'MONTH' | 'YEAR'
    payDate: string
    status?: 'paid' | 'pending'
    paidAt?: string
    installments?: Array<{
      id: string
    }>
  }>
}

export async function updateTransactionsStatus({
  walletId,
  transactions,
}: UpdateTransactionsStatusRequest) {
  await api
    .put(`wallet/${walletId}/transactions/status`, {
      json: {
        transactions,
      },
    })
    .json()
}
