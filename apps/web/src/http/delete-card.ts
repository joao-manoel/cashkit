import { api } from './api-client'

export default async function deleteCard(id: string) {
  await api.delete(`card/${id}`)
}
