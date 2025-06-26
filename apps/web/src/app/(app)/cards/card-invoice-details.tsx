'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { CardType } from '@/http/get-cards'
import { getInvoiceDetails } from '@/http/get-invoice-details'
import { payInvoice } from '@/http/pay-invoice'
import { TableCell } from '@/components/ui/table'

interface CardInvoiceDetailsProps {
  card: CardType
  month: number
  year: number
}

export function CardInvoiceDetails({ card, month, year }: CardInvoiceDetailsProps) {
  const queryClient = useQueryClient()

  const isCreditCard = card.limit > 0

  const {
    data: invoiceDetails,
    isLoading: isLoadingInvoice,
    isError: isErrorInvoice,
  } = useQuery({
    queryKey: ['invoice', card.id, month, year],
    queryFn: () => getInvoiceDetails(card.id, month, year),
    enabled: isCreditCard,
  })

  const { mutate: handlePayInvoice, isPending: isPayingInvoice } = useMutation({
    mutationFn: payInvoice,
    onSuccess: () => {
      toast.success('Fatura paga com sucesso!')
      queryClient.invalidateQueries({
        queryKey: ['invoice', card.id, month, year],
      })
      queryClient.invalidateQueries({ queryKey: ['cards'] })
    },
    onError: () => {
      toast.error('Erro ao pagar fatura.')
    },
  })

  return (
    <>
      <TableCell className="text-right">
        {isCreditCard ? (
          isLoadingInvoice ? (
            <Loader2 className="size-4 animate-spin" />
          ) : isErrorInvoice ? (
            'Erro'
          ) : invoiceDetails ? (
            format(new Date(year, month - 1, invoiceDetails.dueDate), 'dd/MM/yyyy')
          ) : (
            'N/A'
          )
        ) : (
          'N/A'
        )}
      </TableCell>
      <TableCell className="text-right">
        {isCreditCard ? (
          invoiceDetails && !invoiceDetails.isPaid ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handlePayInvoice({
                  cardId: card.id,
                  invoiceId: invoiceDetails.id,
                })
              }
              disabled={isPayingInvoice || card.used === 0}
            >
              {isPayingInvoice ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                'Pagar Fatura'
              )}
            </Button>
          ) : invoiceDetails?.isPaid ? (
            'Paga'
          ) : (
            'N/A'
          )
        ) : (
          'N/A'
        )}
      </TableCell>
    </>
  )
}
