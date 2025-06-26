'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CreditCard, Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { CardIcon } from '@/components/card-icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useDate } from '@/context/date-context'
import deleteCard from '@/http/delete-card'
import { getCards } from '@/http/get-cards'

import { CardInvoiceDetails } from './card-invoice-details'
import CreateCardButton from './create-card-button'

export function CardsTable() {
  const queryClient = useQueryClient()
  const { month, year } = useDate()

  const {
    data: cardsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['cards', month, year],
    queryFn: () => getCards(month, year),
  })

  const { mutate: handleDelete, isPending: isDeleting } = useMutation({
    mutationFn: deleteCard,
    onSuccess: () => {
      toast.success('Cartão deletado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['cards'] })
    },
    onError: () => {
      toast.error('Erro ao deletar cartão.')
    },
  })

  const cards = cardsData?.cards || []

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          <CardTitle>Cartões</CardTitle>
        </div>
        <CreateCardButton />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : isError ? (
          <p className="text-center text-sm text-red-500">
            Erro ao carregar cartões.
          </p>
        ) : cards && cards.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Bandeira</TableHead>
                <TableHead className="text-center">Uso</TableHead>
                <TableHead className="text-right">Limite</TableHead>
                <TableHead className="text-right">Saldo da Conta</TableHead>
                <TableHead className="text-right">Vencimento Fatura</TableHead>
                <TableHead className="text-right">Ações Fatura</TableHead>
                <TableHead className="w-[40px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {cards.map((card) => {
                const usedReais = card.used / 100
                const limitReais = card.limit / 100
                const usedPercent =
                  limitReais === 0 ? 0 : (usedReais / limitReais) * 100

                return (
                  <TableRow key={card.id}>
                    <TableCell>{card.name}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <span>{CardIcon(card.brand)}</span>
                      <span>{card.brand}</span>
                    </TableCell>
                    <TableCell className="w-[240px] text-center">
                      <div className="mb-1 text-xs text-muted-foreground">
                        {Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(usedReais)}{' '}
                        /{' '}
                        {Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(limitReais)}
                      </div>
                      <Progress value={usedPercent} className="h-2" />
                    </TableCell>
                    <TableCell className="text-right">
                      {Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(limitReais)}
                    </TableCell>
                    <TableCell className="text-right">
                      {Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(card.accountBalance / 100)}
                    </TableCell>
                    <CardInvoiceDetails card={card} month={month} year={year} />
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(card.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-muted-foreground">
            Nenhum cartão cadastrado.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
