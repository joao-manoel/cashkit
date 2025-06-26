import { api } from './api-client'

export interface InvoiceDetails {
  id: string
  dueDate: number
  isPaid: boolean
  paidAt: Date | null
  totalAmount: number
  transactions: Array<{
    id: string
    title: string
    amount: number
    payDate: Date
    status: 'paid' | 'pending'
  }>
}

interface GetInvoiceDetailsResponse {
  invoice: InvoiceDetails | null
}

export async function getInvoiceDetails(cardId: string, month: number, year: number) {
  const result = await api
    .get(`cards/${cardId}/invoices/${month}/${year}`)
    .json<GetInvoiceDetailsResponse>()

  return result.invoice
}
