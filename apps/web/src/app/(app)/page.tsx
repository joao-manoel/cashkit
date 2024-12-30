import { TrendingDownIcon, TrendingUpIcon, WalletIcon } from 'lucide-react'

import SummaryCard from '@/components/summary-card'

import Tab from './tab'

export default function HomePage() {
  return (
    <div className="w-full">
      <div className="w-full bg-black">
        <header className="container relative h-[176px]">
          <div className="absolute bottom-0 left-0 right-0 flex translate-y-1/2 transform justify-between">
            <SummaryCard
              title="Saldo"
              amount={2000}
              icon={<WalletIcon size={16} />}
            />
            <SummaryCard
              title="Receitas"
              amount={2000}
              icon={<TrendingUpIcon size={14} className="text-green-500" />}
            />
            <SummaryCard
              title="Despesas"
              amount={2000}
              icon={<TrendingDownIcon size={14} className="text-red-500" />}
            />
          </div>
        </header>
      </div>
      <div className="h-[100px]"></div> {/* Espaço para os cards */}
      <div className="container">
        <Tab />
      </div>
    </div>
  )
}
