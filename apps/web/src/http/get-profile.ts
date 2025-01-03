import { api } from './api-client'

export interface CardType {
  id: string
  name: string
  brand: string
  limit: number
}

interface GetProfileResponse {
  user: {
    id: number
    name: string
    avatar?: string
    email?: string | null
    card: CardType[]
  }
}

export async function getProfile() {
  const result = await api
    .get('auth/profile', {
      next: {
        tags: ['profile'],
      },
    })
    .json<GetProfileResponse>()
  return result
}
