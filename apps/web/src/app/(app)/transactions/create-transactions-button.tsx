import { PlusCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { CardType, getProfile } from '@/http/get-profile'
import {
  getTransactionsCategorys,
  GetTransactionsCategorysResponse,
} from '@/http/get-transactions-categorys'
import { getWallet, GetWalletResponse } from '@/http/get-wallet'

import { Button } from '../../../components/ui/button'
import CreateIncomeForm from './create-transaction-form'

export default function CreateTransactionButton() {
  const [wallet, setWallet] = useState<GetWalletResponse | null>(null)
  const [cards, setCards] = useState<CardType[] | null>(null)
  const [categorys, setCategorys] = useState<
    GetTransactionsCategorysResponse[] | null
  >(null)

  useEffect(() => {
    const fetchData = async () => {
      const walletData = await getWallet()
      setWallet(walletData)

      const categorysData = await getTransactionsCategorys()
      setCategorys(categorysData)

      const getProfileData = await getProfile()
      setCards(getProfileData.user.card)
    }

    fetchData()
  }, [])

  if (!categorys || !wallet || !cards) {
    return <p>Carregando...</p>
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex h-[40px] items-center bg-blue-700 text-white hover:bg-blue-800 hover:text-white dark:bg-blue-700"
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
        <CreateIncomeForm wallet={wallet} categorys={categorys} cards={cards} />
      </DialogContent>
    </Dialog>
  )
}
