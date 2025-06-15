import { api } from './api-client'

interface Cards {
  name: string
  brand: string
  limit: number
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
