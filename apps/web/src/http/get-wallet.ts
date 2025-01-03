import { api } from './api-client'

export interface GetWalletResponse {
  id: string
  name: string
}

export async function getWallet() {
  const result = await api
    .get(`wallet`, {
      next: {
        tags: [`wallet`],
      },
    })
    .json<GetWalletResponse>()

  return result
}
