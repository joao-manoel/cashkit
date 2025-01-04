import { api } from './api-client'

interface DeleteTransactionRequest {
  walletId: string
  transactions: Array<string>
}

export async function deleteTransaction({
  walletId,
  transactions,
}: DeleteTransactionRequest) {
  await api.delete(`wallet/${walletId}/transaction`, {
    json: {
      transactions,
    },
  })
}
