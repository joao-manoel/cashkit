import Image from 'next/image'
import Link from 'next/link'

import LogoIcon from '@/assets/images/logo-icon.svg'
import { isAuthenticated } from '@/auth/auth'

import ProfileButton from './profile-button'
import { Button } from './ui/button'

export async function Header() {
  const isAuth = await isAuthenticated()

  return (
    <header className="top-0 z-50 w-full bg-black backdrop-blur supports-[backdrop-filter]:bg-black">
      <div className="container-wrapper">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <a href="/" className="mr-4 flex items-center gap-2 invert lg:mr-6">
              <Image src={LogoIcon} alt="Icone" className="size-5 text-white" />
              <span className="hidden font-bold text-black lg:inline-block">
                CashKit
              </span>
            </a>
          </div>
          <div className="flex flex-1 items-center justify-between gap-2 md:justify-end">
            {!isAuth ? (
              <Button size="sm" variant="ghost" className="text-white">
                <Link href="/sign-in">Entrar</Link>
              </Button>
            ) : (
              <ProfileButton />
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
