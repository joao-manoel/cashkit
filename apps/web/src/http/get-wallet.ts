import { Wallet } from '@/@types/wallet-type'

import { api } from './api-client'

export async function getWallet() {
  const result = await api
    .get(`wallet`, {
      next: {
        tags: [`wallet`],
      },
    })
    .json<Wallet>()

  return result
}
