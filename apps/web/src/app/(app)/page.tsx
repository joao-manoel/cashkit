import { MonthYearDropdown } from '@/components/month-year-dropdown'

export default function HomePage() {
  return (
    <div className="container-wrapper">
      <div className="container p-4">
        <header className="flex items-center justify-between">
          <h1 className="text-lg font-bold">Dashboard</h1>
          <MonthYearDropdown />
        </header>
      </div>
    </div>
  )
}
