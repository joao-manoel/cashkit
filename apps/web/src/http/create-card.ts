import { api } from './api-client'

export const BrandCardType = {
  DEFAULT: 'DEFAULT',
  NUBANK: 'NUBANK',
  BB: 'BB',
  ITAU: 'ITAU',
  SICREDI: 'SICREDI',
  BRADESCO: 'BRADESCO',
  SANTANDER: 'SANTANDER',
  CAIXA: 'CAIXA',
  INTER: 'INTER',
  C6BANK: 'C6BANK',
  NEXT: 'NEXT',
  NEON: 'NEON',
  PAN: 'PAN',
  PICPAY: 'PICPAY',
  INFINITYPAY: 'INFINITYPAY',
  ITI: 'ITI',
  MERCADOPAGO: 'MERCADOPAGO',
  PAGSEGURO: 'PAGSEGURO',
} as const

type BrandCardType = keyof typeof BrandCardType

interface CreateCardProps {
  name: string
  brand: BrandCardType
  limit: number
  dueDate: number
}

interface CreateCardResponse {
  id: string
}

export async function createCard({ name, brand, limit, dueDate }: CreateCardProps) {
  const result = await api
    .post(`card`, {
      json: {
        name,
        brand,
        limit,
        dueDate,
      },
    })
    .json<CreateCardResponse>()

  return result
}
