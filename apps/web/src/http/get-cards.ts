import { api } from './api-client'

export interface CardType {
  id: string
  name: string
  brand: string
  limit: number
  used: number
  accountBalance: number
}

interface GetCardsResponse {
  cards: CardType[]
}

export async function getCards(month?: number, year?: number) {
  const searchParams = Object.fromEntries(
    Object.entries({ month, year })
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, String(v)])
  )

  const result = await api
    .get('cards', {
      searchParams,
      next: {
        tags: ['cards'],
      },
    })
    .json<GetCardsResponse>()

  return result
}
