'use client'

import { useQuery } from '@tanstack/react-query'
import { CreditCard, Loader2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getCards } from '@/http/get-cards'

import CreateCardButton from './create-card-button' // ajuste o path se necessário

export function CardsTable() {
  const {
    data: cards,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['cards'],
    queryFn: getCards,
  })

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
                <TableHead className="text-right">Limite</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cards.map((card) => (
                <TableRow key={card.name}>
                  <TableCell>{card.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{card.brand}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(card.limit / 100)}
                  </TableCell>
                </TableRow>
              ))}
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
