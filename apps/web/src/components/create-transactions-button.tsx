import { PlusCircle } from 'lucide-react'

import CreateIncomeForm from './create-transaction-form'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'

export default function CreateTransactionButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex h-[40px] items-center bg-blue-700 text-white hover:bg-blue-800 dark:bg-blue-700"
        >
          <PlusCircle />
          <span className="hidden lg:block">Nova Transação</span>
        </Button>
      </DialogTrigger>

      <DialogContent aria-describedby="formulario de adicionar transação">
        <DialogTitle>
          <p className="text-2xl font-bold">Adiciona transação</p>
          <DialogDescription>Adicionar uma nova transação.</DialogDescription>
        </DialogTitle>
        <CreateIncomeForm />
      </DialogContent>
    </Dialog>
  )
}
