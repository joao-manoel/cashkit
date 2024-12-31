'use client'
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Check,
  CheckCircle2,
  CircleDashed,
  PlusCircle,
  Search,
  Trash,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import InfoCard from './info-card'

type Transaction = {
  id: string
  titulo: string
  valor: number
  tipo: 'Receita' | 'Despesa'
  recorrencia: 'variavel' | 'mensal' | 'anual'
  status: 'Pago' | 'Pendente'
  formaPagamento: string
}

const initialTransactions: Transaction[] = [
  {
    id: '1',
    titulo: 'Salário',
    valor: 500000,
    tipo: 'Receita',
    recorrencia: 'mensal',
    status: 'Pago',
    formaPagamento: 'Transferência',
  },
  {
    id: '2',
    titulo: 'Aluguel',
    valor: 150000,
    tipo: 'Despesa',
    recorrencia: 'mensal',
    status: 'Pendente',
    formaPagamento: 'Boleto',
  },
  {
    id: '3',
    titulo: 'Compra de Laptop',
    valor: 300000,
    tipo: 'Despesa',
    recorrencia: 'variavel',
    status: 'Pago',
    formaPagamento: 'Cartão de Crédito',
  },
  {
    id: '4',
    titulo: 'Bônus Anual',
    valor: 200000,
    tipo: 'Receita',
    recorrencia: 'anual',
    status: 'Pendente',
    formaPagamento: 'Transferência',
  },
]

export function TransactionsTable() {
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions)
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredTransactions, setFilteredTransactions] =
    useState<Transaction[]>(transactions)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [typeFilter, setTypeFilter] = useState<'Receita' | 'Despesa' | 'all'>(
    'all',
  )

  useEffect(() => {
    const filtered = transactions.filter(
      (transaction) =>
        (transaction.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.formaPagamento
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) &&
        (typeFilter === 'all' || transaction.tipo === typeFilter),
    )
    setFilteredTransactions(filtered)
  }, [searchTerm, transactions, typeFilter])

  const handleCheckboxChange = (transactionId: string) => {
    setSelectedTransactions((prev) =>
      prev.includes(transactionId)
        ? prev.filter((id) => id !== transactionId)
        : [...prev, transactionId],
    )
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTransactions(filteredTransactions.map((t) => t.id))
    } else {
      setSelectedTransactions([])
    }
  }

  const handleStatusChange = (newStatus: 'Pago' | 'Pendente') => {
    setTransactions((prev) =>
      prev.map((transaction) =>
        selectedTransactions.includes(transaction.id)
          ? { ...transaction, status: newStatus }
          : transaction,
      ),
    )
  }

  const handleDelete = () => {
    setTransactions((prev) =>
      prev.filter(
        (transaction) => !selectedTransactions.includes(transaction.id),
      ),
    )
    setSelectedTransactions([])
    setIsDeleteDialogOpen(false)
  }

  const totalDespesas = transactions
    .filter((t) => t.tipo === 'Despesa')
    .reduce((sum, t) => sum + t.valor, 0)

  const totalReceitas = transactions
    .filter((t) => t.tipo === 'Receita')
    .reduce((sum, t) => sum + t.valor, 0)

  const totalPendentes = transactions
    .filter((t) => t.status === 'Pendente')
    .reduce((sum, t) => sum + t.valor, 0)

  return (
    <div className="mt-4 space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <InfoCard
          amount={totalReceitas}
          title="Total de Receitas"
          color="green"
          icon={<ArrowUpCircle className="h-4 w-4 text-green-500" />}
        />
        <InfoCard
          amount={totalDespesas}
          title="Total de Despesas"
          color="red"
          icon={<ArrowDownCircle className="h-4 w-4 text-red-500" />}
        />
        <InfoCard
          amount={totalPendentes}
          title="Total Pendente"
          color="yellow"
          icon={<CircleDashed className="h-4 w-4 text-yellow-500" />}
        />
      </div>
      <div className="flex h-[40px] items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="lg:w-[300px]">
            <Input
              type="text"
              placeholder="Buscar transações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="hidden bg-background lg:block"
            />
            <Button
              size="icon"
              variant="outline"
              className="bg-background lg:hidden"
            >
              <Search />
            </Button>
          </div>
          <Select
            value={typeFilter}
            onValueChange={(value: 'Receita' | 'Despesa' | 'all') =>
              setTypeFilter(value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Receita">Receita</SelectItem>
              <SelectItem value="Despesa">Despesa</SelectItem>
            </SelectContent>
          </Select>
          {selectedTransactions.length > 0 && (
            <div className="flex items-center gap-2 p-2 lg:p-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex gap-2 bg-background"
                  >
                    <Check className="lg:hidden" />
                    <span className="hidden lg:flex lg:items-center">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      <span>Atualizar Status</span>
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleStatusChange('Pago')}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    <span>Pago</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange('Pendente')}
                  >
                    <CircleDashed className="mr-2 h-4 w-4" />
                    <span>Pendente</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="flex justify-center gap-2"
                  >
                    <Trash className="h-4 w-4" />
                    <span className="hidden lg:block">
                      Deletar Selecionados
                    </span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. Isso irá permanentemente
                      deletar as transações selecionadas.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-background">
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-700 hover:bg-red-800 dark:text-white"
                    >
                      Continuar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            className="flex h-[40px] items-center bg-blue-700 hover:bg-blue-800"
          >
            <PlusCircle />
            <span className="hidden lg:block">Nova Transação</span>
          </Button>
        </div>
      </div>
      <Table className="border bg-background">
        <TableCaption>Lista de transações financeiras.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={
                  selectedTransactions.length === filteredTransactions.length &&
                  filteredTransactions.length > 0
                }
                onCheckedChange={(checked) =>
                  handleSelectAll(checked as boolean)
                }
              />
            </TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Recorrência</TableHead>
            <TableHead>Forma de Pagamento</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTransactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>
                <Checkbox
                  checked={selectedTransactions.includes(transaction.id)}
                  onCheckedChange={() => handleCheckboxChange(transaction.id)}
                />
              </TableCell>
              <TableCell className="font-medium">
                {transaction.titulo}
              </TableCell>
              <TableCell>
                {Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(transaction.valor / 100)}
              </TableCell>
              <TableCell>{transaction.status}</TableCell>
              <TableCell>{transaction.tipo}</TableCell>
              <TableCell>{transaction.recorrencia}</TableCell>
              <TableCell>{transaction.formaPagamento}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
