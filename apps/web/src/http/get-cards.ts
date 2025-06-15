import { api } from './api-client'

interface Cards {
  id: string
  name: string
  brand: string
  limit: number
  used: number
}

export async function getCards() {
  const result = await api
    .get(`cards`, {
      next: {
        tags: [`cards`],
      },
    })
    .json<Cards[]>()

  return result
}
