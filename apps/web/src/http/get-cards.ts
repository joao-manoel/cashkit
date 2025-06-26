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
  const searchParams: Record<string, string> = {}

  if (month !== undefined) {
    searchParams.month = String(month)
  }

  if (year !== undefined) {
    searchParams.year = String(year)
  }

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
