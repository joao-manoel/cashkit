'use client'
import {
  Check,
  CheckCircle2,
  CircleArrowDown,
  CircleArrowUp,
  CircleDashed,
  CircleFadingArrowUp,
  Filter,
  PiggyBank,
  Search,
  Trash,
  Wallet,
  X,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { Transactions } from '@/@types/transactions-types'
import { CardIcon } from '@/components/card-icons'
import CreateTransactionButton from '@/components/create-transactions-button'
import InfoCard from '@/components/info-card'
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { translate } from '@/utils/translate'

interface TransactionTableProps {
  initialTransactions: Transactions[]
}

export function TransactionsTable({
  initialTransactions,
}: TransactionTableProps) {
  const [transactions, setTransactions] =
    useState<Transactions[]>(initialTransactions)
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredTransactions, setFilteredTransactions] =
    useState<Transactions[]>(transactions)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [typeFilter, setTypeFilter] = useState<
    'INCOME' | 'EXPENSE' | 'INVESTMENT' | 'ALL'
  >('ALL')

  useEffect(() => {
    setTransactions(initialTransactions)
  }, [initialTransactions])

  useEffect(() => {
    const filtered = transactions.filter(
      (transaction) =>
        (transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.card.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) &&
        (typeFilter === 'ALL' || transaction.type === typeFilter),
    )
    setFilteredTransactions(filtered)
  }, [searchTerm, typeFilter, transactions])

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

  const handleStatusChange = (newStatus: 'paid' | 'pending') => {
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

  const totalDespesasPedent = transactions
    .filter((t) => t.type === 'EXPENSE' && t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalDespesasPaid = transactions
    .filter((t) => t.type === 'EXPENSE' && t.status === 'paid')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalReceitasPendent = transactions
    .filter((t) => t.type === 'INCOME' && t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0)

  const total =
    transactions
      .filter((t) => t.type === 'INCOME' && t.status === 'paid')
      .reduce((sum, t) => sum + t.amount, 0) - totalDespesasPaid

  return (
    <div className="mt-4 space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <InfoCard
          amount={total}
          title="Saldo"
          icon={<Wallet className="h-4 w-4 text-white" />}
        />
        <InfoCard
          amount={totalReceitasPendent}
          title="Receitas Pendentes"
          color="green"
          icon={<CircleFadingArrowUp className="h-4 w-4 text-green-500" />}
        />
        <InfoCard
          amount={totalDespesasPedent}
          title="Despesas Pendentes"
          color="red"
          icon={
            <CircleFadingArrowUp className="h-4 w-4 rotate-180 text-red-500" />
          }
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2 bg-background">
                <Filter className="lg:hidden" />
                <span className="hidden lg:flex lg:items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <span>Filtrar</span>
                </span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setTypeFilter('INCOME')}
                disabled={typeFilter === 'INCOME'}
              >
                <CircleArrowUp className="mr-2 h-4 w-4 text-green-500" />
                <span>Receitas</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTypeFilter('EXPENSE')}
                disabled={typeFilter === 'EXPENSE'}
              >
                <CircleArrowDown className="mr-2 h-4 w-4 text-red-500" />
                <span>Despesas</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTypeFilter('INVESTMENT')}
                disabled={typeFilter === 'INVESTMENT'}
              >
                <PiggyBank className="mr-2 h-4 w-4 text-yellow-500" />
                <span>Investimentos</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
                  <DropdownMenuItem onClick={() => handleStatusChange('paid')}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    <span>Pago</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange('pending')}
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
          <CreateTransactionButton />
        </div>
      </div>
      <div className="flex items-center gap-2 pl-2 text-xs">
        {typeFilter !== 'ALL' && (
          <Button
            size="sm"
            className="min-w-19 h-6 rounded-md p-1 text-[10px] text-zinc-700 outline-dashed outline-zinc-800"
            variant="ghost"
            onClick={() => setTypeFilter('ALL')}
          >
            <X className="size-1" />
            <span className="">{typeFilter}</span>
          </Button>
        )}
      </div>
      <Table className="border bg-background">
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
            <TableHead className="">Descrição</TableHead>
            <TableHead className="text-center">Valor</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Tipo</TableHead>
            <TableHead className="text-center">Vencimento</TableHead>
            <TableHead className="text-center">Forma de Pagamento</TableHead>
            <TableHead className="text-center">Recorrência</TableHead>
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
              <TableCell className="font-medium">{transaction.title}</TableCell>
              <TableCell className="text-center">
                {Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(transaction.amount / 100)}
              </TableCell>
              <TableCell className="text-center">
                {translate(transaction.status)}
              </TableCell>
              <TableCell className="text-center">
                {translate(transaction.type)}
              </TableCell>
              <TableCell className="text-center capitalize">
                {new Intl.DateTimeFormat('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                }).format(new Date(transaction.payDate))}
              </TableCell>
              <TableCell className="flex items-center justify-center gap-2 text-center">
                {CardIcon(transaction.card.brand)}
                <span>{transaction.card.name}</span>
              </TableCell>
              <TableCell className="text-center">
                {translate(transaction.recurrence)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="h-6">
        <p className="text-xs text-gray-500">
          Total de transações: {filteredTransactions.length}
        </p>
      </div>
    </div>
  )
}
