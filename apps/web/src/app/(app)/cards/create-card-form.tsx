'use client'

import { CreditCard, Loader2, PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BrandCardType, createCard } from '@/http/create-card'
import { queryClient } from '@/lib/react-query'

const brandOptions = Object.keys(BrandCardType) as Array<
  keyof typeof BrandCardType
>

export function CreateCardForm() {
  const [name, setName] = useState('')
  const [brand, setBrand] = useState<keyof typeof BrandCardType>('DEFAULT')
  const [limit, setLimit] = useState('')
  const [dueDate, setDueDate] = useState<number>(1) // Default to day 1
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formatCurrency = (input: string) => {
    const digits = input.replace(/\D/g, '')
    const number = parseInt(digits, 10) / 100
    return number.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    if (input === '') {
      setLimit('')
    } else {
      const formatted = formatCurrency(input)
      setLimit(formatted)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const rawLimit = Number(limit.replace(/\D/g, ''))

    try {
      await createCard({
        name,
        brand,
        limit: rawLimit,
        dueDate,
      })
      toast.success('Cartão criado com sucesso!')
      setName('')
      setLimit('')
      setBrand('DEFAULT')
      setDueDate(1) // Reset to default day 1
      queryClient.invalidateQueries({ queryKey: ['cards'] })
    } catch (error) {
      toast.error('Erro ao criar cartão.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <CreditCard className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Cadastrar Novo Cartão</h2>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Nome do Cartão</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Nubank Roxo"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="brand">Bandeira</Label>
        <Select
          value={brand}
          onValueChange={(value) =>
            setBrand(value as keyof typeof BrandCardType)
          }
        >
          <SelectTrigger id="brand">
            <SelectValue placeholder="Selecione a bandeira" />
          </SelectTrigger>
          <SelectContent>
            {brandOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="limit">Limite</Label>
        <Input
          id="limit"
          value={limit}
          onChange={handleLimitChange}
          placeholder="R$ 0,00"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">Dia de Vencimento da Fatura</Label>
        <Input
          id="dueDate"
          type="number"
          value={dueDate}
          onChange={(e) => setDueDate(Number(e.target.value))}
          placeholder="Ex: 15"
          min={1}
          max={31}
          required
        />
      </div>

      <Button type="submit" className="mt-2 w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <>
            <PlusCircle className="mr-2 h-4 w-4" />
            Cadastrar Cartão
          </>
        )}
      </Button>
    </form>
  )
}
