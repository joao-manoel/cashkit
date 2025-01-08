'use client'
import {
  Check,
  CheckCircle2,
  CircleArrowDown,
  CircleArrowUp,
  CircleCheck,
  CircleDashed,
  CircleFadingArrowUp,
  Edit,
  Filter,
  PiggyBank,
  Search,
  Trash,
  Trash2,
  Wallet,
  X,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Transactions, TransactionType } from '@/@types/transactions-types'
import { Wallet as WalletType } from '@/@types/wallet-type'
import { CardIcon } from '@/components/card-icons'
import InfoCard from '@/components/info-card'
import StatusPendentIcon from '@/components/status-pendent-icon'
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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
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
import { useDate } from '@/context/date-context'
import { translate } from '@/utils/translate'
import { months } from '@/utils/utils'

import {
  deleteTransactionAction,
  updateTransactionsStatusAction,
} from './actions'
import CreateTransactionButton from './create-transactions-button'

interface TransactionTableProps {
  data: Transactions[]
  wallet: WalletType | undefined
}

export function TransactionsTable({ data, wallet }: TransactionTableProps) {
  const { month, year } = useDate()
  const [transactions, setTransactions] = useState<Transactions[]>(data)
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredTransactions, setFilteredTransactions] =
    useState<Transactions[]>(transactions)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [typeFilter, setTypeFilter] = useState<
    'INCOME' | 'EXPENSE' | 'INVESTMENT' | 'ALL'
  >('ALL')

  useEffect(() => {
    const updatedTransactions = data.map((transaction) => {
      // Verifica se a transação é mensal ou anual e tem parcelas
      if (
        (transaction.recurrence === 'MONTH' ||
          transaction.recurrence === 'YEAR') &&
        transaction.installments.length > 0
      ) {
        const currentInstallment = transaction.installments.find(
          (installment) =>
            new Date(installment.payDate).getMonth() + 1 === month &&
            new Date(installment.payDate).getFullYear() === year,
        )

        if (currentInstallment) {
          // Garantir que o status seja um valor literal válido
          const installmentStatus: 'paid' | 'pending' =
            currentInstallment.status

          return {
            ...transaction,
            status: installmentStatus, // Agora o status é corretamente tipado
          }
        }
      }

      // Lógica para transações com recorrência 'VARIABLE' e parcelas
      if (
        transaction.recurrence === 'VARIABLE' &&
        transaction.installments.length > 0
      ) {
        // Encontra a parcela atual com base no mês e ano
        const currentInstallment = transaction.installments.find(
          (installment) =>
            new Date(installment.payDate).getMonth() + 1 === month &&
            new Date(installment.payDate).getFullYear() === year,
        )

        // Se existir uma parcela, formate o título
        if (currentInstallment) {
          const installmentTitle = `${transaction.title} (${currentInstallment.installment}/${
            transaction.installments.length
          })`

          // Divide o valor pela quantidade de parcelas
          const installmentAmount =
            transaction.amount / transaction.installments.length

          return {
            ...transaction,
            title: installmentTitle, // Atualiza o título com o número da parcela
            amount: installmentAmount, // Atualiza o valor dividindo pelas parcelas
            status: currentInstallment.status,
          }
        }
      }

      // Se não for de recorrência 'VARIABLE' nem mensal/anual, retorna a transação original
      return transaction
    })

    setTransactions(updatedTransactions) // Atualiza o estado com as transações modificadas
  }, [data, month, year])

  useEffect(() => {
    const filtered = transactions
      .filter(
        (transaction) =>
          (transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.card.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) &&
          (typeFilter === 'ALL' || transaction.type === typeFilter),
      )
      // Ordenando as transações para que as com status 'pending' apareçam primeiro, e depois por payDate (do mais antigo para o mais recente)
      .sort((a, b) => {
        // Primeiro, verifica se o status é 'pending'
        if (a.status === 'pending' && b.status !== 'pending') return -1 // 'pending' vem primeiro
        if (a.status !== 'pending' && b.status === 'pending') return 1 // 'pending' vem primeiro

        // Se o status for igual, ordena pela data de pagamento (payDate) do mais antigo para o mais recente
        const dateA = new Date(a.payDate)
        const dateB = new Date(b.payDate)

        // Ordena do mais antigo para o mais recente
        return dateA.getTime() - dateB.getTime()
      })

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
    setSelectedTransactions([])
    toast('Status Atualizado', {
      description: `Status foi atualizado para ${newStatus === 'paid' ? 'Pago' : 'Pendente'}.`,
    })
  }

  const handleDelete = () => {
    setTransactions((prev) =>
      prev.filter(
        (transaction) => !selectedTransactions.includes(transaction.id),
      ),
    )
    setSelectedTransactions([])
    setIsDeleteDialogOpen(false)
    toast('Transações Deletadas', {
      description: `Todas Transações selecionada foram deletadas.`,
    })
  }

  type handleDeleteMenuContextProps = {
    walletId: string
    transactionId: string
  }

  const handleDeleteMenuContext = ({
    walletId,
    transactionId,
  }: handleDeleteMenuContextProps) => {
    deleteTransactionAction({
      walletId,
      transactions: [transactionId],
    })
      .then(() => {
        toast.success('Transação deletada com sucesso!')
      })
      .catch((err: unknown) => {
        const errorMessage =
          err instanceof Error ? err.message : 'Erro desconhecido'
        toast.error(`Erro ao deletar transação: ${errorMessage}`)
      })
  }

  type handleUpdateStatusProps = {
    walletId: string
    transactions: Array<{
      id: string
      recurrence: 'VARIABLE' | 'MONTH' | 'YEAR'
      payDate: string
      amount: number
      type: TransactionType
      status?: 'paid' | 'pending'
      paidAt?: string
      installments: Array<{
        id: string
        installment: number
        status: 'paid' | 'pending'
        isRecurring: boolean
        payDate: string
        paidAt?: string
      }>
    }>
  }

  const handleUpdateStatus = ({
    walletId,
    transactions,
  }: handleUpdateStatusProps) => {
    const updatedTransactions = transactions.map((transaction) => {
      if (
        transaction.recurrence === 'MONTH' ||
        transaction.recurrence === 'YEAR'
      ) {
        const currentPayDate = new Date(transaction.payDate)
        currentPayDate.setMonth(month - 1)
        currentPayDate.setFullYear(year)
        transaction.payDate = currentPayDate.toISOString()

        if (transaction.installments && transaction.installments.length > 0) {
          const filteredInstallments = transaction.installments.filter(
            (installment) => {
              const installmentDate = new Date(installment.payDate)
              const installmentMonth = installmentDate.getMonth() + 1

              return (
                installmentMonth === month &&
                installmentDate.getFullYear() === year
              )
            },
          )
          transaction.installments = filteredInstallments
        }
      } else if (
        transaction.recurrence === 'VARIABLE' &&
        transaction.installments &&
        transaction.installments.length > 0
      ) {
        // Filtra os installments que coincidem com o mês e ano de `transaction.payDate`
        const variablePayDate = new Date(transaction.payDate)
        const variableMonth = variablePayDate.getMonth() + 1
        const variableYear = variablePayDate.getFullYear()

        const filteredInstallments = transaction.installments.filter(
          (installment) => {
            const installmentDate = new Date(installment.payDate)
            const installmentMonth = installmentDate.getMonth() + 1
            const installmentYear = installmentDate.getFullYear()

            return (
              installmentMonth === variableMonth &&
              installmentYear === variableYear
            )
          },
        )
        transaction.installments = filteredInstallments
      }

      return transaction
    })

    updateTransactionsStatusAction({
      walletId,
      transactions: updatedTransactions,
    })
      .then(() => {
        toast.success('Status da transação atualizada com sucesso!')
      })
      .catch((err: unknown) => {
        const errorMessage =
          err instanceof Error ? err.message : 'Erro desconhecido'
        toast.error(
          `Erro ao atualizar o status das transações: ${errorMessage}`,
        )
      })
  }

  const totalDespesasPedent = transactions
    .filter((t) => t.type === 'EXPENSE' && t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalReceitasPendent = transactions
    .filter((t) => t.type === 'INCOME' && t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="mt-4 space-y-3 pb-10">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <InfoCard
          amount={wallet ? wallet.balance : 0}
          title="Saldo"
          icon={<Wallet className="h-4 w-4 dark:text-white" />}
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
      <div className="flex items-center gap-1 text-xs">
        {typeFilter !== 'ALL' && (
          <Button
            size="sm"
            className="min-w-19 h-6 rounded-md p-1 pr-2 text-[10px] text-zinc-700 outline-dashed outline-zinc-800"
            variant="ghost"
            onClick={() => setTypeFilter('ALL')}
          >
            <X className="size-1" />
            <span className="">{translate(typeFilter)}s</span>
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
            <TableHead className="">Categoria</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTransactions.map((transaction) => (
            <ContextMenu key={transaction.id}>
              <ContextMenuTrigger asChild>
                <TableRow key={transaction.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedTransactions.includes(transaction.id)}
                      onCheckedChange={() =>
                        handleCheckboxChange(transaction.id)
                      }
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.title}
                  </TableCell>
                  <TableCell className="text-center">
                    {Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(transaction.amount / 100)}
                  </TableCell>
                  <TableCell className="flex items-center justify-center gap-2 text-center">
                    {transaction.status === 'paid' ? (
                      <CircleCheck className="size-4 text-green-500" />
                    ) : (
                      <StatusPendentIcon
                        dueDate={new Date(transaction.payDate)}
                      />
                    )}
                    <span>{translate(transaction.status)}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        transaction.type === 'INCOME'
                          ? 'success'
                          : 'destructive'
                      }
                    >
                      {translate(transaction.type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {new Intl.DateTimeFormat('pt-BR', {
                      day: '2-digit',
                    }).format(new Date(transaction.payDate))}{' '}
                    de <span className="capitalize">{months[month - 1]}</span>
                  </TableCell>

                  <TableCell className="flex items-center justify-center gap-2 text-center">
                    {CardIcon(transaction.card.brand)}
                    <span>{transaction.card.name}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-start gap-2">
                      <span>{translate(transaction.categorys.title)}</span>
                    </div>
                  </TableCell>
                </TableRow>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onClick={() => console.log(transaction.id)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() =>
                    handleDeleteMenuContext({
                      transactionId: transaction.id,
                      walletId: transaction.wallet.id,
                    })
                  }
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Deletar
                </ContextMenuItem>
                <ContextMenuSeparator />
                {transaction.status === 'pending' ? (
                  <ContextMenuItem
                    onClick={() =>
                      handleUpdateStatus({
                        walletId: transaction.wallet.id,
                        transactions: [
                          {
                            id: transaction.id,
                            status: 'paid',
                            type: transaction.type,
                            amount: transaction.amount,
                            payDate: transaction.payDate,
                            recurrence: transaction.recurrence,
                            installments: transaction.installments,
                          },
                        ],
                      })
                    }
                    className="flex gap-2"
                  >
                    <CircleCheck className="size-4 text-green-500" />
                    Pagar
                  </ContextMenuItem>
                ) : (
                  <ContextMenuItem
                    className="flex gap-2"
                    onClick={() =>
                      handleUpdateStatus({
                        walletId: transaction.wallet.id,
                        transactions: [
                          {
                            id: transaction.id,
                            status: 'pending',
                            type: transaction.type,
                            amount: transaction.amount,
                            payDate: transaction.payDate,
                            recurrence: transaction.recurrence,
                            installments: transaction.installments,
                          },
                        ],
                      })
                    }
                  >
                    <CircleDashed className={`size-4 text-yellow-500`} />
                    Pendente
                  </ContextMenuItem>
                )}
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </TableBody>
      </Table>
      {filteredTransactions.length <= 0 ? (
        <span className="flex justify-center p-2 font-light text-zinc-300">
          Não foi encontrada nenhuma transação
        </span>
      ) : (
        <div className="h-6">
          <p className="text-xs text-gray-500">
            Total de transações: {filteredTransactions.length}
          </p>
        </div>
      )}
    </div>
  )
}
