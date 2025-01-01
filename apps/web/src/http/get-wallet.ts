import { api } from './api-client'

export interface CardType {
  id: string
  name: string
  brand: string
  limit: number
}

export interface GetWalletResponse {
  id: string
  name: string
  card: CardType[]
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
