'use client'

import { PlusCircle } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { CreateCardForm } from './create-card-form'

export default function CreateCardButton() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="flex h-[40px] items-center gap-2 bg-blue-700 text-white hover:bg-blue-800"
        >
          <PlusCircle className="h-4 w-4" />
          <span className="hidden lg:block">Novo Cartão</span>
        </Button>
      </DialogTrigger>

      <DialogContent aria-describedby="formulario de adicionar cartão">
        <DialogTitle>
          <p className="text-2xl font-bold">Adicionar cartão</p>
          <DialogDescription>
            Preencha os dados do novo cartão.
          </DialogDescription>
        </DialogTitle>
        <CreateCardForm />
      </DialogContent>
    </Dialog>
  )
}
