import Image from 'next/image'
import Link from 'next/link'

import LogoIcon from '@/assets/images/logo-icon.svg'
import { isAuthenticated } from '@/auth/auth'

import CollapseMenuButton from './collapse-menu-button'
import ProfileButton from './profile-button'
export default async function Header() {
  const isAuth = await isAuthenticated()

  return (
    <header className="sticky z-50 flex items-center justify-between border-b p-4 dark:bg-[#171716]">
      <div className="flex items-center gap-4">
        <CollapseMenuButton />
        <Link href="/" className="flex items-center gap-2">
          <Image src={LogoIcon} className="size-6 dark:invert" alt="cashkit" />
          <span className="text-lg font-medium">
            Cash<span className="font-bold text-blue-600">Kit</span>
          </span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {isAuth && <ProfileButton />}
      </div>
    </header>
  )
}
