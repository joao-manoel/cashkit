import { Breadcrumb } from '@/components/breadcrumbs'
import { DateDropdown } from '@/components/date-dropdown'

export default function HomePage() {
  return (
    <>
      <Breadcrumb />
      <header className="mt-4 flex items-center justify-between">
        <h1 className="text-lg font-bold">Home</h1>
        <DateDropdown />
      </header>
    </>
  )
}
