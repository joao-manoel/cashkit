'use client'
import {
  CircleArrowDown,
  CircleArrowUp,
  CircleFadingArrowUp,
  Filter,
  PiggyBank,
  PlusCircle,
  Search,
  Wallet,
} from 'lucide-react'

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

import InfoCardSkeleton from './info-card-skeleton'
import { Skeleton } from './ui/skeleton'

export default function TransactionSkeleton() {
  const skeletonRows = Array.from({ length: 10 })
  return (
    <div className="mt-4 space-y-4 pb-10">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <InfoCardSkeleton
          icon={<Wallet className="h-4 w-4 dark:text-white" />}
        />
        <InfoCardSkeleton
          color="green"
          icon={<CircleFadingArrowUp className="h-4 w-4 text-green-500" />}
        />
        <InfoCardSkeleton
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
              disabled
              className="hidden bg-background lg:block"
            />
            <Button
              size="icon"
              variant="outline"
              disabled
              className="bg-background lg:hidden"
            >
              <Search />
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled>
              <Button variant="outline" className="flex gap-2 bg-background">
                <Filter className="lg:hidden" />
                <span className="hidden lg:flex lg:items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <span>Filtrar</span>
                </span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <CircleArrowUp className="mr-2 h-4 w-4 text-green-500" />
                <span>Receitas</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CircleArrowDown className="mr-2 h-4 w-4 text-red-500" />
                <span>Despesas</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <PiggyBank className="mr-2 h-4 w-4 text-yellow-500" />
                <span>Investimentos</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            className="flex h-[40px] items-center bg-blue-700 text-white hover:bg-blue-800 hover:text-white dark:bg-blue-700"
            disabled
          >
            <PlusCircle />
            <span className="hidden lg:block">Nova Transação</span>
          </Button>
        </div>
      </div>

      <Table className="border bg-background">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox checked={false} disabled />
            </TableHead>
            <TableHead className="">Descrição</TableHead>
            <TableHead className="flex items-center justify-center">
              Valor
            </TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Tipo</TableHead>
            <TableHead className="text-center">Vencimento</TableHead>
            <TableHead className="text-center">Forma de Pagamento</TableHead>
            <TableHead className="">Categoria</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {skeletonRows.map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Checkbox checked={false} disabled />
              </TableCell>
              <TableCell className="font-medium">
                <Skeleton className="h-[16px] w-[120px] rounded-sm" />
              </TableCell>
              <TableCell className="">
                <div className="flex justify-center">
                  <Skeleton className="h-[16px] w-[64px] rounded-sm" />
                </div>
              </TableCell>
              <TableCell className="flex items-center justify-center gap-2 text-center">
                <div className="flex justify-center">
                  <Skeleton className="h-[16px] w-[64px] rounded-sm" />
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center">
                  <Skeleton className="h-[16px] w-[64px] rounded-sm" />
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center">
                  <Skeleton className="h-[16px] w-[120px] rounded-sm" />
                </div>
              </TableCell>

              <TableCell className="flex items-center justify-center gap-2 text-center">
                <div className="flex justify-center">
                  <Skeleton className="h-[16px] w-[90px] rounded-sm" />
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="h-[16px] w-[64px] rounded-sm" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex h-6 gap-1">
        <p className="items-center text-xs text-gray-500">
          Total de transações:
        </p>
        <Skeleton className="h-[12px] w-[10px] rounded-sm" />
      </div>
    </div>
  )
}
