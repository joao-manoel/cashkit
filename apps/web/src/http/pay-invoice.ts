import { api } from './api-client'

interface PayInvoiceRequest {
  cardId: string
  invoiceId: string
}

export async function payInvoice({ cardId, invoiceId }: PayInvoiceRequest) {
  await api.patch(`cards/${cardId}/invoices/${invoiceId}/pay`)
}
