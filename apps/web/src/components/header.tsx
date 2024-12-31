import Image from 'next/image'
import Link from 'next/link'

import LogoIcon from '@/assets/images/logo-icon.svg'

import ProfileButton from './profile-button'
import { Button } from './ui/button'
export default function Header() {
  return (
    <header className="sticky z-50 flex items-center justify-between border-b p-4 dark:bg-[#171716]">
      <div className="flex items-center gap-4">
        <Button size="icon" className="bg-muted hover:bg-muted/60">
          <Image src="./menu-left.svg" alt="collapse" width={16} height={16} />
        </Button>
        <Link href="/" className="flex items-center gap-2">
          <Image src={LogoIcon} className="size-6 dark:invert" alt="cashkit" />
          <span className="text-lg font-medium">
            Cash<span className="font-bold text-blue-600">Kit</span>
          </span>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm"></div>
        <ProfileButton />
      </div>
    </header>
  )
}
