import { DateDropdown } from '@/components/date-dropdown'

import { CardsTable } from './cards-table'

export default function CardsPage() {
  return (
    <>
      <div className="flex justify-end">
        <DateDropdown />
      </div>
      <CardsTable />
    </>
  )
}
