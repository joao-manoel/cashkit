import { ArrowRightLeft, HomeIcon } from 'lucide-react'
import Link from 'next/link'

const menuItems = [
  {
    label: 'Home',
    href: '/',
    icon: <HomeIcon className="size-5 text-gray-400" />,
  },
  {
    label: 'Transações',
    href: '/transactions',
    icon: <ArrowRightLeft className="size-5 text-gray-400" />,
  },
]

export default function NavBar() {
  return (
    <nav className="flex h-full w-full flex-col border-r p-4">
      {menuItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="flex items-center justify-center gap-2 rounded-md p-2 pb-4 pt-4 transition-colors hover:bg-gray-100 dark:hover:bg-black/20 lg:justify-start"
        >
          {item.icon}
          <span className="text-bold ml-2 hidden font-normal text-gray-400 lg:block">
            {item.label}
          </span>
        </Link>
      ))}
    </nav>
  )
}
